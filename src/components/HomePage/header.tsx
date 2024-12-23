import React from 'react';
import viteLogo from '../../assets/logo.png'; // Adjust the path if necessary

const Header: React.FC = () => {
    return (
        <header style={{ padding: '25px', backgroundColor: '#fff', borderBottom: '1px solid #dee2e6', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={viteLogo} alt="Vite Logo" style={{ height: '80px', marginRight: '10px' }} />
            <h1 style={{
                fontSize: '4rem',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 900,
                background: 'linear-gradient(to right, #3dbbf9, #29a2f6)',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}>
                IU SCHEDULER
            </h1>

        </header>
    );
};

export default Header;