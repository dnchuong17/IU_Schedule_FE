import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer style={{ padding: '20px', backgroundColor: '#fff', borderTop: '1px solid #dee2e6', textAlign: 'center', position: 'fixed', width: '100%', bottom: 0 }}>
            <p style={{ margin: 0 }}>© {new Date().getFullYear()} IU Schedule. All rights reserved.</p>
            <p style={{ margin: 0 }}>
                Follow us on
                <a href="https://twitter.com" style={{ margin: '0 5px' }}>Twitter</a> |
                <a href="https://facebook.com" style={{ margin: '0 5px' }}>Facebook</a> |
                <a href="https://instagram.com" style={{ margin: '0 5px' }}>Instagram</a>
            </p>
        </footer>
    );
};

export default Footer;