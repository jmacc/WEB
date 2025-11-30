import { useNavigate } from 'react-router-dom';
import { Activity, Eye, Languages } from 'lucide-react';

function Home() {
    const navigate = useNavigate();

    const projects = [
        {
            id: 'ml',
            title: 'Azure AI Consumer ML ENDPOINT',
            icon: <Activity size={48} />,
            path: '/consumer-ml',
            color: '#3b82f6'
        },
        {
            id: 'vision',
            title: 'Azure Vision ENDPOINT',
            icon: <Eye size={48} />,
            path: '/vision',
            color: '#8b5cf6'
        },
        {
            id: 'translator',
            title: 'Azure IA Translator',
            icon: <Languages size={48} />,
            path: '/translator',
            color: '#10b981'
        }
    ];

    return (
        <div className="container" style={{ textAlign: 'center', maxWidth: '1200px' }}>
            <h1 style={{ marginBottom: '3rem', fontSize: '2.5rem' }}>Azure AI Projects Hub</h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                padding: '1rem'
            }}>
                {projects.map((project) => (
                    <button
                        key={project.id}
                        onClick={() => navigate(project.path)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '3rem 2rem',
                            backgroundColor: '#1e293b',
                            border: `2px solid ${project.color}`,
                            borderRadius: '1rem',
                            cursor: 'pointer',
                            transition: 'transform 0.2s, background-color 0.2s',
                            height: '100%',
                            minHeight: '250px'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.backgroundColor = '#334155';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.backgroundColor = '#1e293b';
                        }}
                    >
                        <div style={{ color: project.color, marginBottom: '1.5rem' }}>
                            {project.icon}
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#f8fafc' }}>
                            {project.title}
                        </h2>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Home;
