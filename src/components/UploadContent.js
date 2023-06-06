import { Button, Input, Space } from 'antd';
import { useState } from 'react';

const buttonUploadStyle = {
    width: '20%',
    backgroundColor: '#EAE6FD',
    color: '#321B85',
    fontWeight: 'bold',
    borderTopRightRadius: '0px',
    borderBottomRightRadius: '0px',
    width: 100
};
const inputUploadStyle = {
    width: '100%',
    borderTopLeftRadius: '0px',
    borderBottomLeftRadius: '0px',
    pointerEvents: 'none'
};
const errorUploadStyle = {
    color: '#ff4d4f'
};

function UploadContent({ value, errors }) {
    return (
        <div>
            <Space.Compact block>
                <Button style={buttonUploadStyle}>Choose File</Button>
                <Input style={inputUploadStyle} value={value && value.map((item) => item.name).join(',')} readOnly />
            </Space.Compact>
            <div style={{ marginTop: '0.25rem' }}>
                {errors &&
                    errors.map((item, i) => (
                        <div key={i} style={errorUploadStyle}>
                            {item}
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default UploadContent;
