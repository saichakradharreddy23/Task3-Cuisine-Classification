import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.multiclass import OneVsRestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.dummy import DummyClassifier

# Add current dir to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from data_loader import load_and_inspect_data
from preprocessing import (
    RestaurantFeatureTransformer,
    prepare_multilabel_targets,
    prepare_singlelabel_targets
)
from evaluate import evaluate_multilabel_model, evaluate_singlelabel_model
from visualization import (
    plot_cuisine_distribution,
    plot_model_comparison,
    plot_per_cuisine_performance,
    plot_confusion_matrix_heatmap
)

def run_training_pipeline(top_n_cuisines: int = 25, random_seed: int = 42):
    print("=" * 60)
    print("RESTAURANT CUISINE CLASSIFICATION - MODEL TRAINING PIPELINE")
    print("=" * 60)

    # 1. Load Data
    print("\n[Step 1/7] Loading and Inspecting Dataset...")
    data_info = load_and_inspect_data(top_n_cuisines=top_n_cuisines)
    df = data_info["df"]
    top_cuisines = data_info["top_cuisines"]

    print(f"Dataset path: {data_info['dataset_path']}")
    print(f"Total records: {data_info['raw_shape'][0]} rows, {data_info['raw_shape'][1]} columns")
    print(f"Cleaned records: {data_info['cleaned_shape'][0]}")
    print(f"Distinct cuisines found: {data_info['unique_cuisines_count']}")
    print(f"Top {top_n_cuisines} target cuisines selected: {', '.join(top_cuisines[:8])}...")
    print(f"Single-label restaurants: {data_info['single_label_count']}")
    print(f"Multi-label restaurants: {data_info['multi_label_count']} (Dominant pattern: Multi-label classification)")

    # 2. Prepare Features & Multi-label Targets
    print("\n[Step 2/7] Preprocessing Features & Encoding Targets...")
    feature_cols = [
        'City', 'Country Code', 'Has Table booking', 'Has Online delivery',
        'Is delivering now', 'Rating text', 'Average Cost for two', 'Price range',
        'Aggregate rating', 'Votes', 'Longitude', 'Latitude'
    ]
    X_raw = df[feature_cols].copy()
    
    # Target encoding for Multi-label
    y_multilabel, mlb = prepare_multilabel_targets(df['Cuisines'], top_cuisines)

    # Filter rows with at least one target cuisine
    has_target = y_multilabel.sum(axis=1) > 0
    X_filtered = X_raw[has_target].copy().reset_index(drop=True)
    y_filtered = y_multilabel[has_target]
    df_filtered = df[has_target].copy().reset_index(drop=True)

    print(f"Filtered dataset size (matching top {top_n_cuisines} cuisines): {X_filtered.shape[0]} records")

    # 3. Train-Test Split (Prevent Data Leakage)
    print("\n[Step 3/7] Splitting Dataset into Train and Test Sets...")
    X_train_df, X_test_df, y_train_multi, y_test_multi, idx_train, idx_test = train_test_split(
        X_filtered, y_filtered, np.arange(len(X_filtered)),
        test_size=0.2, random_state=random_seed
    )

    print(f"Training set: {X_train_df.shape[0]} records")
    print(f"Testing set: {X_test_df.shape[0]} records")

    # Fit feature preprocessor ONLY on training set
    preprocessor = RestaurantFeatureTransformer(top_cities_count=20)
    preprocessor.fit(X_train_df)
    
    X_train = preprocessor.transform(X_train_df)
    X_test = preprocessor.transform(X_test_df)
    print(f"Engineered feature dimensionality: {X_train.shape[1]} features")

    # 4. Multi-Label Model Training & Evaluation
    print("\n[Step 4/7] Training & Comparing Multi-Label Classification Algorithms...")
    models = {
        "Baseline (Dummy)": DummyClassifier(strategy='prior', random_state=random_seed),
        "OneVsRest Logistic Regression": OneVsRestClassifier(
            LogisticRegression(max_iter=1000, class_weight='balanced', C=1.0, random_state=random_seed)
        ),
        "Random Forest Classifier": RandomForestClassifier(
            n_estimators=120, max_depth=16, min_samples_split=4,
            class_weight='balanced_subsample', random_state=random_seed, n_jobs=-1
        ),
        "Decision Tree Classifier": DecisionTreeClassifier(
            max_depth=12, class_weight='balanced', random_state=random_seed
        )
    }

    comparison_results = []
    eval_reports = {}
    best_model_name = None
    best_macro_f1 = -1.0
    best_model_obj = None

    for name, clf in models.items():
        print(f"  -> Training {name}...")
        clf.fit(X_train, y_train_multi)
        metrics = evaluate_multilabel_model(clf, X_test, y_test_multi, top_cuisines)
        eval_reports[name] = metrics

        comp_entry = {
            "model_name": name,
            "micro_precision": metrics["micro_precision"],
            "micro_recall": metrics["micro_recall"],
            "micro_f1": metrics["micro_f1"],
            "macro_precision": metrics["macro_precision"],
            "macro_recall": metrics["macro_recall"],
            "macro_f1": metrics["macro_f1"],
            "weighted_f1": metrics["weighted_f1"],
            "hamming_loss": metrics["hamming_loss"],
            "subset_accuracy": metrics["subset_accuracy"]
        }
        comparison_results.append(comp_entry)

        print(f"     Micro-F1: {metrics['micro_f1']:.4f} | Macro-F1: {metrics['macro_f1']:.4f} | Hamming Loss: {metrics['hamming_loss']:.4f}")

        # Choose best based on Macro F1 (handles class imbalance)
        if name != "Baseline (Dummy)" and metrics["macro_f1"] > best_macro_f1:
            best_macro_f1 = metrics["macro_f1"]
            best_model_name = name
            best_model_obj = clf

    print(f"\n[Selection] Best Performing Model: {best_model_name} (Macro-F1: {best_macro_f1:.4f})")

    # 5. Single-Label (Primary Cuisine) Training for Comprehensive Benchmarking
    print("\n[Step 5/7] Training Single-Label Primary Cuisine Models (Top 10 Classes)...")
    top_primary_cuisines = top_cuisines[:10]
    y_single_all, le, valid_single_mask = prepare_singlelabel_targets(df_filtered['Cuisines'], top_primary_cuisines)

    # Filter to records having one of top primary cuisines
    X_single = X_filtered[valid_single_mask].copy().reset_index(drop=True)
    y_single = y_single_all[valid_single_mask]

    X_s_train_df, X_s_test_df, y_s_train, y_s_test = train_test_split(
        X_single, y_single, test_size=0.2, random_state=random_seed, stratify=y_single
    )

    s_preprocessor = RestaurantFeatureTransformer(top_cities_count=20)
    s_preprocessor.fit(X_s_train_df)
    X_s_train = s_preprocessor.transform(X_s_train_df)
    X_s_test = s_preprocessor.transform(X_s_test_df)

    # Train single-label RF
    single_rf = RandomForestClassifier(n_estimators=100, max_depth=14, class_weight='balanced', random_state=random_seed)
    single_rf.fit(X_s_train, y_s_train)
    single_metrics = evaluate_singlelabel_model(single_rf, X_s_test, y_s_test, top_primary_cuisines)
    print(f"  -> Single-Label Primary Cuisine Accuracy: {single_metrics['accuracy']:.4f} | Macro-F1: {single_metrics['macro_f1']:.4f}")

    # 6. Generate Visualizations and Reports
    print("\n[Step 6/7] Generating Reports and Visualizations...")
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    reports_dir = os.path.join(base_dir, "reports")
    models_dir = os.path.join(base_dir, "models")
    os.makedirs(reports_dir, exist_ok=True)
    os.makedirs(models_dir, exist_ok=True)

    # Save JSON reports
    with open(os.path.join(reports_dir, "model_comparison.json"), "w", encoding="utf-8") as f:
        json.dump(comparison_results, f, indent=2)

    with open(os.path.join(reports_dir, "classification_report.json"), "w", encoding="utf-8") as f:
        json.dump(eval_reports[best_model_name], f, indent=2)

    with open(os.path.join(reports_dir, "single_label_report.json"), "w", encoding="utf-8") as f:
        json.dump(single_metrics, f, indent=2)

    # Generate charts
    plot_cuisine_distribution(
        data_info["cuisine_frequency"],
        os.path.join(reports_dir, "cuisine_distribution.png"),
        top_n=20
    )
    plot_model_comparison(
        comparison_results,
        os.path.join(reports_dir, "model_comparison.png")
    )
    plot_per_cuisine_performance(
        eval_reports[best_model_name]["per_cuisine"],
        os.path.join(reports_dir, "cuisine_performance.png"),
        top_n=15
    )
    plot_confusion_matrix_heatmap(
        np.array(single_metrics["confusion_matrix"]),
        top_primary_cuisines,
        os.path.join(reports_dir, "confusion_matrix.png")
    )

    # 7. Save Models and Metadata
    print("\n[Step 7/7] Saving Trained Pipelines and Metadata...")
    joblib.dump(best_model_obj, os.path.join(models_dir, "best_model.pkl"))
    joblib.dump({
        "feature_preprocessor": preprocessor,
        "multilabel_binarizer": mlb,
        "top_cuisines": top_cuisines,
        "feature_names": preprocessor.feature_names_
    }, os.path.join(models_dir, "preprocessing_pipeline.pkl"))

    # Single-label model dump
    joblib.dump({
        "model": single_rf,
        "preprocessor": s_preprocessor,
        "label_encoder": le,
        "classes": top_primary_cuisines
    }, os.path.join(models_dir, "single_label_model.pkl"))

    # Metadata
    metadata = {
        "project_title": "Restaurant Cuisine Classification",
        "created_at": datetime.now().isoformat(),
        "random_seed": random_seed,
        "dataset_name": "Dataset .csv",
        "dataset_total_records": data_info["raw_shape"][0],
        "training_records": X_train.shape[0],
        "testing_records": X_test.shape[0],
        "number_of_features": X_train.shape[1],
        "target_type": "Multi-Label Cuisine Classification (with Primary Cuisine support)",
        "number_of_target_cuisines": len(top_cuisines),
        "target_cuisines": top_cuisines,
        "best_model_name": best_model_name,
        "best_model_metrics": {
            "micro_f1": eval_reports[best_model_name]["micro_f1"],
            "macro_f1": eval_reports[best_model_name]["macro_f1"],
            "hamming_loss": eval_reports[best_model_name]["hamming_loss"],
            "subset_accuracy": eval_reports[best_model_name]["subset_accuracy"],
            "micro_precision": eval_reports[best_model_name]["micro_precision"],
            "micro_recall": eval_reports[best_model_name]["micro_recall"],
        },
        "single_label_metrics": {
            "accuracy": single_metrics["accuracy"],
            "macro_f1": single_metrics["macro_f1"],
            "classes": top_primary_cuisines
        },
        "all_models_compared": [c["model_name"] for c in comparison_results]
    }

    with open(os.path.join(models_dir, "model_metadata.json"), "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print("\n" + "=" * 60)
    print("TRAINING AND EVALUATION COMPLETE!")
    print(f"Artifacts saved in:\n  - {models_dir}\n  - {reports_dir}")
    print("=" * 60)

if __name__ == "__main__":
    run_training_pipeline()
