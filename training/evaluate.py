import numpy as np
import pandas as pd
from sklearn.metrics import (
    precision_score, recall_score, f1_score, hamming_loss,
    accuracy_score, classification_report, confusion_matrix
)
from typing import Dict, Any, List

def evaluate_multilabel_model(
    model, X_test, y_test, class_names: List[str]
) -> Dict[str, Any]:
    """
    Evaluates a multi-label classification model.
    Returns metrics dictionary with micro, macro, per-class stats and Hamming loss.
    """
    y_pred = model.predict(X_test)
    if hasattr(y_pred, 'toarray'):
        y_pred = y_pred.toarray()

    micro_prec = float(precision_score(y_test, y_pred, average='micro', zero_division=0))
    micro_rec = float(recall_score(y_test, y_pred, average='micro', zero_division=0))
    micro_f1 = float(f1_score(y_test, y_pred, average='micro', zero_division=0))

    macro_prec = float(precision_score(y_test, y_pred, average='macro', zero_division=0))
    macro_rec = float(recall_score(y_test, y_pred, average='macro', zero_division=0))
    macro_f1 = float(f1_score(y_test, y_pred, average='macro', zero_division=0))

    weighted_f1 = float(f1_score(y_test, y_pred, average='weighted', zero_division=0))
    h_loss = float(hamming_loss(y_test, y_pred))
    subset_acc = float(accuracy_score(y_test, y_pred))

    # Per-cuisine classification report
    report_dict = classification_report(
        y_test, y_pred, target_names=class_names, output_dict=True, zero_division=0
    )

    per_cuisine = {}
    for c in class_names:
        if c in report_dict:
            per_cuisine[c] = {
                "precision": round(report_dict[c]["precision"], 4),
                "recall": round(report_dict[c]["recall"], 4),
                "f1-score": round(report_dict[c]["f1-score"], 4),
                "support": int(report_dict[c]["support"])
            }

    return {
        "micro_precision": round(micro_prec, 4),
        "micro_recall": round(micro_rec, 4),
        "micro_f1": round(micro_f1, 4),
        "macro_precision": round(macro_prec, 4),
        "macro_recall": round(macro_rec, 4),
        "macro_f1": round(macro_f1, 4),
        "weighted_f1": round(weighted_f1, 4),
        "hamming_loss": round(h_loss, 4),
        "subset_accuracy": round(subset_acc, 4),
        "per_cuisine": per_cuisine,
        "raw_report": report_dict
    }

def evaluate_singlelabel_model(
    model, X_test, y_test, class_names: List[str]
) -> Dict[str, Any]:
    """
    Evaluates a single-label (primary cuisine) classification model.
    """
    y_pred = model.predict(X_test)

    acc = float(accuracy_score(y_test, y_pred))
    macro_f1 = float(f1_score(y_test, y_pred, average='macro', zero_division=0))
    weighted_f1 = float(f1_score(y_test, y_pred, average='weighted', zero_division=0))
    macro_prec = float(precision_score(y_test, y_pred, average='macro', zero_division=0))
    macro_rec = float(recall_score(y_test, y_pred, average='macro', zero_division=0))

    cm = confusion_matrix(y_test, y_pred)
    report_dict = classification_report(
        y_test, y_pred, target_names=class_names, output_dict=True, zero_division=0
    )

    return {
        "accuracy": round(acc, 4),
        "macro_precision": round(macro_prec, 4),
        "macro_recall": round(macro_rec, 4),
        "macro_f1": round(macro_f1, 4),
        "weighted_f1": round(weighted_f1, 4),
        "confusion_matrix": cm.tolist(),
        "classification_report": report_dict
    }
