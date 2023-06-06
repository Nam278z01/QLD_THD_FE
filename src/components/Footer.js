import { Row, Typography } from 'antd';
import { FLTLogoIcon, FptLogoIcon } from './Icons';

function FooterContent() {
    return (
        <Row align="middle" justify="end" style={{ padding: '0.5rem' }}>
            <Typography.Text>Copyright © 2023</Typography.Text>
            <Typography.Text>&nbsp;|&nbsp;</Typography.Text>
            <Typography.Text style={{ display: 'inline-flex' }}>
                Developed by <FLTLogoIcon style={{ marginLeft: '0.25rem' }} />
            </Typography.Text>
            <Typography.Text>&nbsp;|&nbsp; All rights reserved</Typography.Text>
        </Row>
    );
}

export default FooterContent;
