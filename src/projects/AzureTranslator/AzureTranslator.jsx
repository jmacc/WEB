import { ArrowLeft, Languages } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AzureTranslator() {
    const navigate = useNavigate();

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
                <Languages className="inline-icon" size={40} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                Azure IA Translator
            </h1>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
                Project placeholder.
            </p>

            <div className="card">
                <p>Coming soon...</p>
            </div>
        </div>
    );
}

export default AzureTranslator;
