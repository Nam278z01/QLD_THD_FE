import { ErrorPageIcon } from '../components/Icons';
import { Button, Space, Typography } from 'antd';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { setStatusPage } from '../store/LoadingSlice';
import { useDispatch } from 'react-redux';

const errorPageStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center'
};
const titleStyle = {
    margin: 0
};
const descStyle = {
    marginBottom: '2.5rem',
    fontSize: 18,
    color: '#667085'
};
const backBtnStyle = {
    pading: '0.75rem 1rem',
    width: 200,
    borderRadius: 200
};

function ErrorPage({ ...prop }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const title = prop.title ?? 'No information for the moment';
    const desc = prop.desc ?? 'Please keep checking up regularly to stay updated';

    const redirectToPage = (path) => {
        history.push(path);
    };

    useEffect(() => {
        dispatch(setStatusPage(true));

        return () => {
            dispatch(setStatusPage(false));
        };
    }, []);

    return (
        <div style={errorPageStyle}>
            <Space direction="vertical">
                <ErrorPageIcon />
                <Typography.Title level={2} style={titleStyle}>
                    {title}
                </Typography.Title>
                <Typography.Paragraph style={descStyle}>{desc}</Typography.Paragraph>
                <Button style={backBtnStyle} type="primary" size="large" onClick={() => redirectToPage('/')}>
                    Back to Home
                </Button>
            </Space>
        </div>
    );
}

export default ErrorPage;
