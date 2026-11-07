import os
import pandas as pd
import numpy as np
from collections import Counter
from typing import Tuple, Dict, Any, List

def get_dataset_path() -> str:
    """Finds the dataset file in the project folder."""
    candidates = [
        os.path.join(os.path.dirname(__file__), "..", "dataset", "Dataset .csv"),
        os.path.join(os.path.dirname(__file__), "..", "Dataset .csv"),
        "dataset/Dataset .csv",
        "Dataset .csv"
    ]
    for path in candidates:
        abs_path = os.path.abspath(path)
        if os.path.exists(abs_path):
            return abs_path
    raise FileNotFoundError("Could not find restaurant dataset in project folder.")

def load_and_inspect_data(top_n_cuisines: int = 25) -> Dict[str, Any]:
    """
    Loads and inspects the restaurant dataset.
    Returns cleaned dataframe, raw stats, and cuisine distribution.
    """
    path = get_dataset_path()
    df = pd.read_csv(path, encoding='utf-8')
    raw_shape = df.shape
    raw_nulls = df.isnull().sum().to_dict()
    raw_duplicates = int(df['Restaurant ID'].duplicated().sum())

    # Handle missing cuisines
    df_clean = df.dropna(subset=['Cuisines']).copy()

    # Parse cuisines list
    df_clean['cuisine_list'] = df_clean['Cuisines'].apply(
        lambda x: [c.strip() for c in str(x).split(',') if c.strip()]
    )
    df_clean['cuisine_count'] = df_clean['cuisine_list'].apply(len)
    
    # Primary cuisine (first listed)
    df_clean['primary_cuisine'] = df_clean['cuisine_list'].apply(lambda x: x[0] if len(x) > 0 else 'Unknown')

    # All cuisine tokens
    all_cuisines = [c for sub in df_clean['cuisine_list'] for c in sub]
    cuisine_freq = Counter(all_cuisines)
    unique_cuisines_count = len(cuisine_freq)

    # Top N cuisines selection
    top_cuisines = [c for c, _ in cuisine_freq.most_common(top_n_cuisines)]
    rare_cuisines = [c for c, count in cuisine_freq.items() if count <= 2]

    # Filtered multi-label targets containing top cuisines
    df_clean['target_cuisines'] = df_clean['cuisine_list'].apply(
        lambda tags: [t for t in tags if t in top_cuisines]
    )

    # Count of single-label vs multi-label restaurants
    single_label_count = int((df_clean['cuisine_count'] == 1).sum())
    multi_label_count = int((df_clean['cuisine_count'] > 1).sum())

    return {
        "df": df_clean,
        "dataset_path": path,
        "raw_shape": raw_shape,
        "cleaned_shape": df_clean.shape,
        "null_counts": raw_nulls,
        "duplicate_records": raw_duplicates,
        "cuisine_frequency": dict(cuisine_freq.most_common(50)),
        "unique_cuisines_count": unique_cuisines_count,
        "total_cuisine_mentions": len(all_cuisines),
        "top_cuisines": top_cuisines,
        "rare_cuisines_count": len(rare_cuisines),
        "single_label_count": single_label_count,
        "multi_label_count": multi_label_count,
        "is_multilabel": multi_label_count > 0
    }

if __name__ == "__main__":
    info = load_and_inspect_data()
    print("=== DATA INSPECTION SUMMARY ===")
    print(f"Path: {info['dataset_path']}")
    print(f"Raw shape: {info['raw_shape']}")
    print(f"Clean shape: {info['cleaned_shape']}")
    print(f"Unique cuisines: {info['unique_cuisines_count']}")
    print(f"Single-label count: {info['single_label_count']}")
    print(f"Multi-label count: {info['multi_label_count']}")
    print(f"Top 5 cuisines: {info['top_cuisines'][:5]}")
