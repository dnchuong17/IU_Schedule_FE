import React from 'react';
import viteLogo from '../../assets/logo.png'; // Adjust the path if necessary

const Header = () => {
    return (
        <header style={{ padding: '25px', backgroundColor: '#fff', borderBottom: '1px solid #dee2e6', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={viteLogo} alt="Vite Logo" style={{ height: '60px', marginRight: '10px' }} />
            <h1 style={{ margin: 0, fontFamily: 'Roboto, sans-serif', fontWeight: 'bold', fontSize: '2.5rem', color: '#4682B4' }}>IU SCHEDULE</h1>
        </header>
    );
};

export default Header;