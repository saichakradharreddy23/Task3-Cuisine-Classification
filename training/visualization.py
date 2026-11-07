import os
import tempfile
os.environ['MPLCONFIGDIR'] = tempfile.gettempdir()

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import pandas as pd
from typing import Dict, Any, List

# Style configuration
plt.style.use('dark_background')
PALETTE = ['#F08A4B', '#43D6A0', '#B69CFF', '#41C8F5', '#F1B85B', '#FF9252']

def plot_cuisine_distribution(cuisine_freq: Dict[str, int], output_path: str, top_n: int = 20):
    """Plots the distribution of the most frequent cuisines."""
    items = list(cuisine_freq.items())[:top_n]
    cuisines = [k for k, v in items]
    counts = [v for k, v in items]

    fig, ax = plt.subplots(figsize=(12, 7), facecolor='#17191E')
    ax.set_facecolor('#272C33')
    
    bars = ax.barh(cuisines[::-1], counts[::-1], color='#F08A4B', edgecolor='#FFC078', alpha=0.9, height=0.7)
    
    # Value labels
    for bar in bars:
        w = bar.get_width()
        ax.text(w + 30, bar.get_y() + bar.get_height()/2, f'{int(w)}', 
                va='center', ha='left', color='#FFF1E6', fontsize=9, fontweight='bold')

    ax.set_title(f'Top {top_n} Restaurant Cuisines Distribution', color='#FFF1E6', fontsize=15, pad=15, fontweight='bold')
    ax.set_xlabel('Number of Restaurants', color='#FFC078', fontsize=12)
    ax.tick_params(colors='#FFF1E6', labelsize=10)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color('#472A20')
    ax.spines['bottom'].set_color('#472A20')
    
    plt.tight_layout()
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    plt.savefig(output_path, dpi=300, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()

def plot_model_comparison(comparison_data: List[Dict[str, Any]], output_path: str):
    """Plots comparison of trained models."""
    df = pd.DataFrame(comparison_data)
    
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6), facecolor='#071F35')
    ax1.set_facecolor('#103653')
    ax2.set_facecolor('#103653')

    models = df['model_name']
    x = np.arange(len(models))
    w = 0.35

    # Chart 1: Micro & Macro F1
    ax1.bar(x - w/2, df['micro_f1'], width=w, label='Micro F1', color='#41C8F5', edgecolor='#82E6FF')
    ax1.bar(x + w/2, df['macro_f1'], width=w, label='Macro F1', color='#B69CFF', edgecolor='#F4C96B')
    ax1.set_xticks(x)
    ax1.set_xticklabels(models, rotation=20, ha='right', color='#E9F8FF', fontweight='bold')
    ax1.set_ylabel('Score (0 - 1.0)', color='#82E6FF', fontsize=11)
    ax1.set_title('Model F1-Score Comparison', color='#E9F8FF', fontsize=13, fontweight='bold')
    ax1.legend(facecolor='#164768', edgecolor='#41C8F5', labelcolor='#E9F8FF')
    ax1.set_ylim(0, 1.0)
    ax1.grid(axis='y', alpha=0.2, color='#82E6FF')

    # Chart 2: Hamming Loss (Lower is better)
    ax2.bar(x, df['hamming_loss'], width=0.45, color='#F08A4B', edgecolor='#FFC078')
    ax2.set_xticks(x)
    ax2.set_xticklabels(models, rotation=20, ha='right', color='#E9F8FF', fontweight='bold')
    ax2.set_ylabel('Hamming Loss (Lower is Better)', color='#FFC078', fontsize=11)
    ax2.set_title('Model Hamming Loss Comparison', color='#E9F8FF', fontsize=13, fontweight='bold')
    ax2.grid(axis='y', alpha=0.2, color='#FFC078')

    for ax in [ax1, ax2]:
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['left'].set_color('#164768')
        ax.spines['bottom'].set_color('#164768')
        ax.tick_params(colors='#E9F8FF')

    plt.tight_layout()
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    plt.savefig(output_path, dpi=300, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()

def plot_per_cuisine_performance(per_cuisine: Dict[str, Dict[str, float]], output_path: str, top_n: int = 15):
    """Plots per-cuisine precision, recall, and F1."""
    # Sort by support or F1
    sorted_items = sorted(per_cuisine.items(), key=lambda x: x[1].get('support', 0), reverse=True)[:top_n]
    cuisines = [k for k, _ in sorted_items]
    f1 = [v.get('f1-score', 0) for _, v in sorted_items]
    prec = [v.get('precision', 0) for _, v in sorted_items]
    rec = [v.get('recall', 0) for _, v in sorted_items]

    fig, ax = plt.subplots(figsize=(14, 7), facecolor='#092D27')
    ax.set_facecolor('#12463B')

    x = np.arange(len(cuisines))
    w = 0.25

    ax.bar(x - w, prec, width=w, label='Precision', color='#43D6A0', edgecolor='#B7F7D0')
    ax.bar(x, rec, width=w, label='Recall', color='#F1B85B', edgecolor='#FFE1A3')
    ax.bar(x + w, f1, width=w, label='F1-Score', color='#B69CFF', edgecolor='#FFF1E6')

    ax.set_xticks(x)
    ax.set_xticklabels(cuisines, rotation=35, ha='right', color='#E9FFF4', fontweight='bold')
    ax.set_ylabel('Metric Score', color='#B7F7D0', fontsize=12)
    ax.set_title(f'Per-Cuisine Performance Metrics (Top {top_n} Cuisines)', color='#E9FFF4', fontsize=14, fontweight='bold', pad=15)
    ax.set_ylim(0, 1.05)
    ax.legend(facecolor='#185447', edgecolor='#43D6A0', labelcolor='#E9FFF4')
    ax.grid(axis='y', alpha=0.2, color='#43D6A0')

    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color('#185447')
    ax.spines['bottom'].set_color('#185447')
    ax.tick_params(colors='#E9FFF4')

    plt.tight_layout()
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    plt.savefig(output_path, dpi=300, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()

def plot_confusion_matrix_heatmap(cm: np.ndarray, class_names: List[str], output_path: str):
    """Plots single-label confusion matrix heatmap."""
    fig, ax = plt.subplots(figsize=(12, 10), facecolor='#17132D')
    ax.set_facecolor('#28204B')

    sns.heatmap(
        cm, annot=True, fmt='d', cmap='magma',
        xticklabels=class_names, yticklabels=class_names,
        ax=ax, cbar_kws={'label': 'Count'}
    )

    ax.set_title('Primary Cuisine Confusion Matrix', color='#F5F0FF', fontsize=14, fontweight='bold', pad=15)
    ax.set_xlabel('Predicted Cuisine', color='#B69CFF', fontsize=11, labelpad=10)
    ax.set_ylabel('True Cuisine', color='#B69CFF', fontsize=11, labelpad=10)
    plt.xticks(rotation=45, ha='right', color='#F5F0FF')
    plt.yticks(color='#F5F0FF')

    plt.tight_layout()
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    plt.savefig(output_path, dpi=300, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
