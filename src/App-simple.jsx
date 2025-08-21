export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#eff6ff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#2563eb',
          marginBottom: '1rem'
        }}>
          🎉 Akuma Budget - Test Simple
        </h1>
        <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
          L'application React se charge correctement !
        </p>
        <div style={{
          background: 'white',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Version test sans Tailwind - {new Date().toLocaleString()}
          </p>
          <button 
            onClick={() => alert('React fonctionne !')}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Tester React
          </button>
        </div>
      </div>
    </div>
  );
}