const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Failed to fetch API health status');
  return res.json();
}

export async function fetchDatasetInfo() {
  const res = await fetch(`${API_BASE}/dataset-info`);
  if (!res.ok) throw new Error('Failed to fetch dataset info');
  return res.json();
}

export async function fetchCuisines() {
  const res = await fetch(`${API_BASE}/cuisines`);
  if (!res.ok) throw new Error('Failed to fetch cuisines');
  return res.json();
}

export async function fetchModelMetrics() {
  const res = await fetch(`${API_BASE}/model-metrics`);
  if (!res.ok) throw new Error('Failed to fetch model metrics');
  return res.json();
}

export async function fetchModelComparison() {
  const res = await fetch(`${API_BASE}/model-comparison`);
  if (!res.ok) throw new Error('Failed to fetch model comparison');
  return res.json();
}

export async function predictCuisine(payload) {
  const res = await fetch(`${API_BASE}/predict?top_k=6`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Prediction request failed');
  }
  return res.json();
}
