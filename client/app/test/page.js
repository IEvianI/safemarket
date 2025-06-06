'use client';

import { useEffect, useState } from 'react';

export default function TestPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_API_URL;
    console.log('🌐 API URL utilisée :', url);

    fetch(`${url}/listings`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setResult(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>🔍 Test API depuis Vercel</h1>
      <p><strong>API URL :</strong> {process.env.NEXT_PUBLIC_API_URL}</p>

      {error && <p style={{ color: 'red' }}>❌ Erreur : {error}</p>}

      {result ? (
        <div>
          <p>✅ Réponse reçue !</p>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      ) : !error ? (
        <p>⏳ Chargement...</p>
      ) : null}
    </div>
  );
}
