import React from 'react';

const styleAlertCheckVersion = {
    width: '552px',
    padding: '12px',
    fontFamily: 'Segoe UI',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '20px',
    background: '#FFFBE6',
    border: '1px solid #FFEDAF',
    borderRadius: '12px',
    textAlign: 'center',
    letterSpacing: '0.0125em',
    color: '#101828'
};
const CheckBrowserVersion = () => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'rgba(0,0,0,.45)'
            }}
        >
            <div style={styleAlertCheckVersion}>
                Your browser not support modern CSS Selector. Please use modern browser to view (e.g. Chrome, Firefox,
                etc). If you want to compatible style with legacy browser, please upgrade your browser version to the
                latest version.
            </div>
        </div>
    );
};

export default CheckBrowserVersion;
