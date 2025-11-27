import { useState } from 'react';
import { callAzureAI } from './services/aiService';
import { Send, Settings, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import './App.css'; // We'll keep this but it might be empty or default, we rely on index.css mostly

function App() {
  const [endpoint, setEndpoint] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [payload, setPayload] = useState('{\n  "prompt": "Hello, Azure AI!"\n}');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfig, setShowConfig] = useState(true);

  const handleSend = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let parsedPayload;
      try {
        parsedPayload = JSON.parse(payload);
      } catch (e) {
        throw new Error("Invalid JSON payload. Please check your syntax.");
      }

      const data = await callAzureAI(endpoint, apiKey, parsedPayload);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>
        <Activity className="inline-icon" size={40} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
        Azure AI Consumer
      </h1>
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
        Test your Azure AI endpoints directly from the browser.
      </p>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Configuration</h2>
          <button onClick={() => setShowConfig(!showConfig)} style={{ padding: '0.4rem', background: 'transparent' }}>
            <Settings size={20} color="#94a3b8" />
          </button>
        </div>

        {showConfig && (
          <div className="config-section">
            <label className="label">Endpoint URL</label>
            <input
              type="text"
              placeholder="https://your-resource.cognitiveservices.azure.com/..."
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
            />

            <label className="label">API Key</label>
            <input
              type="password"
              placeholder="Your Azure API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Request Body (JSON)</h2>
        <textarea
          rows={8}
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
        />

        <div style={{ textAlign: 'right', marginTop: '1rem' }}>
          <button onClick={handleSend} disabled={loading || !endpoint || !apiKey} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            {loading ? 'Processing...' : (
              <>
                <Send size={18} /> Send Request
              </>
            )}
          </button>
        </div>
      </div>

      {(result || error) && (
        <div className="card" style={{ borderColor: error ? '#ef4444' : '#22c55e', borderWidth: '1px', borderStyle: 'solid' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {error ? <AlertCircle color="#ef4444" /> : <CheckCircle2 color="#22c55e" />}
            {error ? 'Error' : 'Response'}
          </h2>

          <div className="result-area">
            {error ? error : JSON.stringify(result, null, 2)}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
