import numpy as np
import pandas as pd
from sklearn.preprocessing import OneHotEncoder, StandardScaler, MultiLabelBinarizer, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.base import BaseEstimator, TransformerMixin
from typing import List, Dict, Any, Tuple

class RestaurantFeatureTransformer(BaseEstimator, TransformerMixin):
    """
    Custom transformer to clean and engineer restaurant features
    without data leakage.
    """
    def __init__(self, top_cities_count: int = 25):
        self.top_cities_count = top_cities_count
        self.top_cities_: List[str] = []
        self.column_transformer_: ColumnTransformer = None
        self.feature_names_: List[str] = []

    def fit(self, X: pd.DataFrame, y=None):
        X_df = X.copy()
        
        # Learn top cities
        city_counts = X_df['City'].value_counts()
        self.top_cities_ = city_counts.head(self.top_cities_count).index.tolist()
        
        # Prepare transformed copy for fitting column transformer
        X_proc = self._transform_internal(X_df)
        
        num_cols = ['norm_cost', 'norm_votes', 'Aggregate rating', 'Price range', 'Longitude', 'Latitude']
        cat_cols = ['City_grouped', 'Country Code', 'Has Table booking', 'Has Online delivery', 'Is delivering now', 'Rating text']
        
        self.column_transformer_ = ColumnTransformer(
            transformers=[
                ('num', StandardScaler(), num_cols),
                ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), cat_cols)
            ]
        )
        self.column_transformer_.fit(X_proc)
        
        # Extract feature names
        num_names = num_cols
        cat_encoder = self.column_transformer_.named_transformers_['cat']
        cat_names = list(cat_encoder.get_feature_names_out(cat_cols))
        self.feature_names_ = num_names + cat_names
        
        return self

    def _transform_internal(self, df: pd.DataFrame) -> pd.DataFrame:
        out = pd.DataFrame(index=df.index)
        
        # Numerical transformations with log1p
        cost = pd.to_numeric(df.get('Average Cost for two', 0), errors='coerce').fillna(0)
        out['norm_cost'] = np.log1p(np.maximum(0, cost))
        
        votes = pd.to_numeric(df.get('Votes', 0), errors='coerce').fillna(0)
        out['norm_votes'] = np.log1p(np.maximum(0, votes))
        
        rating = pd.to_numeric(df.get('Aggregate rating', 0), errors='coerce').fillna(0)
        out['Aggregate rating'] = rating
        
        price = pd.to_numeric(df.get('Price range', 1), errors='coerce').fillna(1)
        out['Price range'] = price
        
        long = pd.to_numeric(df.get('Longitude', 0), errors='coerce').fillna(0)
        out['Longitude'] = long
        
        lat = pd.to_numeric(df.get('Latitude', 0), errors='coerce').fillna(0)
        out['Latitude'] = lat
        
        # Categorical grouping
        cities = df.get('City', pd.Series('Other', index=df.index)).fillna('Other')
        out['City_grouped'] = cities.apply(lambda c: c if c in self.top_cities_ else 'Other')
        
        out['Country Code'] = df.get('Country Code', pd.Series(1, index=df.index)).fillna(1).astype(str)
        
        for bool_col in ['Has Table booking', 'Has Online delivery', 'Is delivering now']:
            val = df.get(bool_col, pd.Series('No', index=df.index)).fillna('No').astype(str)
            out[bool_col] = val.apply(lambda x: 'Yes' if str(x).strip().lower() in ['yes', '1', 'true'] else 'No')
            
        rating_text = df.get('Rating text', pd.Series('Average', index=df.index)).fillna('Average').astype(str)
        out['Rating text'] = rating_text
        
        return out

    def transform(self, X: pd.DataFrame) -> np.ndarray:
        X_df = X.copy()
        X_proc = self._transform_internal(X_df)
        return self.column_transformer_.transform(X_proc)

def prepare_multilabel_targets(cuisine_series: pd.Series, top_classes: List[str]) -> Tuple[np.ndarray, MultiLabelBinarizer]:
    """
    Parses comma-separated cuisines and encodes as binary matrix.
    """
    cleaned_lists = cuisine_series.apply(
        lambda x: [c.strip() for c in str(x).split(',') if c.strip() and c.strip() in top_classes]
    )
    mlb = MultiLabelBinarizer(classes=top_classes)
    y_binary = mlb.fit_transform(cleaned_lists)
    return y_binary, mlb

def prepare_singlelabel_targets(cuisine_series: pd.Series, top_classes: List[str]) -> Tuple[np.ndarray, LabelEncoder, pd.Series]:
    """
    Extracts primary cuisine and encodes as single integer labels.
    """
    def extract_primary(x):
        tokens = [c.strip() for c in str(x).split(',') if c.strip()]
        for t in tokens:
            if t in top_classes:
                return t
        return None

    primary = cuisine_series.apply(extract_primary)
    valid_mask = primary.notnull()
    le = LabelEncoder()
    le.fit(top_classes)
    
    y_single = np.full(len(cuisine_series), -1)
    y_single[valid_mask] = le.transform(primary[valid_mask])
    
    return y_single, le, valid_mask
