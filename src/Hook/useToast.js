import { notification } from 'antd';
import { ErrorAlertIcon, SuccessAlertIcon, InfoAlertIcon, WarningAlertIcon } from '../components/Icons';

const useToast = ({ ...prop }) => {
    const [api, contextHolder] = notification.useNotification();

    const handleIconNotify = (type) => {
        return (
            <>
                {type === 'success' && <SuccessAlertIcon />}
                {type === 'error' && <ErrorAlertIcon />}
                {type === 'warning' && <WarningAlertIcon />}
                {type === 'info' && <InfoAlertIcon />}
            </>
        );
    };

    const handleColorNotify = (type) => {
        let color = '';
        switch (type) {
            case 'success':
                color = '#12B76A';
                break;
            case 'error':
                color = '#F04438';
                break;
            case 'warning':
                color = '#F79009';
                break;
            case 'info':
                color = '#3386F2';
                break;
            default:
                color = '#101828';
                break;
        }
        return color;
    };

    // type: 'success' | 'info' | 'warning' | 'error' | ''
    const openNotification = (type, message, description, icon, btn, key) => {
        if (type) {
            api[type]({
                message: <div style={{ color: '#fff', fontWeight: 600 }}>{message}</div>,
                description: <div style={{ color: '#fff' }}>{description}</div>,
                icon: handleIconNotify(type),
                btn,
                key,
                duration: prop.duration,
                style: { backgroundColor: handleColorNotify(type) }
            });
        } else {
            notification.open({ message, description, icon, btn, key, duration: prop.duration });
        }
    };

    return [contextHolder, openNotification];
};

export default useToast;
