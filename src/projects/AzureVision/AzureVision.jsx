import { useState } from 'react';
import { callAzureVision } from '../../services/aiService';
import { Eye, Settings, ArrowLeft, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AzureVision() {
    const navigate = useNavigate();
    const [endpoint, setEndpoint] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showConfig, setShowConfig] = useState(true);

    const handleAnalyze = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await callAzureVision(endpoint, apiKey, imageUrl);
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <button
                onClick={() => navigate('/')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    marginBottom: '1rem'
                }}
            >
                <ArrowLeft size={20} /> Back to Home
            </button>

            <h1>
                <Eye className="inline-icon" size={40} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                Azure Vision ENDPOINT
            </h1>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
                Analyze images using your Azure Custom Vision endpoint.
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
                        <label className="label">Prediction Endpoint URL</label>
                        <input
                            type="text"
                            placeholder="https://your-resource.cognitiveservices.azure.com/customvision/v3.0/Prediction/..."
                            value={endpoint}
                            onChange={(e) => setEndpoint(e.target.value)}
                        />

                        <label className="label">Prediction Key</label>
                        <input
                            type="password"
                            placeholder="Your Prediction Key"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                    </div>
                )}
            </div>

            <div className="card">
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Image to Analyze</h2>
                <label className="label">Image URL</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        style={{ flex: 1 }}
                    />
                </div>

                {imageUrl && (
                    <div style={{ marginTop: '1rem', textAlign: 'center', background: '#1e293b', padding: '1rem', borderRadius: '0.5rem' }}>
                        <img
                            src={imageUrl}
                            alt="Preview"
                            style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '0.25rem' }}
                            onError={(e) => e.target.style.display = 'none'}
                            onLoad={(e) => e.target.style.display = 'block'}
                        />
                    </div>
                )}

                <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                    <button onClick={handleAnalyze} disabled={loading || !endpoint || !apiKey || !imageUrl} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        {loading ? 'Analyzing...' : (
                            <>
                                <ImageIcon size={18} /> Analyze Image
                            </>
                        )}
                    </button>
                </div>
            </div>

            {(result || error) && (
                <div className="card" style={{ borderColor: error ? '#ef4444' : '#22c55e', borderWidth: '1px', borderStyle: 'solid' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {error ? <AlertCircle color="#ef4444" /> : <CheckCircle2 color="#22c55e" />}
                        {error ? 'Error' : 'Results'}
                    </h2>

                    <div className="result-area">
                        {error ? (
                            error
                        ) : (
                            <div>
                                {result.predictions && result.predictions.length > 0 ? (
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid #334155', textAlign: 'left' }}>
                                                <th style={{ padding: '0.5rem' }}>Tag</th>
                                                <th style={{ padding: '0.5rem' }}>Probability</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.predictions.map((pred, index) => (
                                                <tr key={index} style={{ borderBottom: '1px solid #1e293b' }}>
                                                    <td style={{ padding: '0.5rem' }}>{pred.tagName}</td>
                                                    <td style={{ padding: '0.5rem' }}>{(pred.probability * 100).toFixed(2)}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <pre>{JSON.stringify(result, null, 2)}</pre>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AzureVision;
