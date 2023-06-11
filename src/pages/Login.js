import { Button, Col, Form, Grid, Input, Row, theme, Typography, message } from 'antd';
import bgLogin from '../assets/images/bg_login.svg';
import { AkaLogo2Icon } from '../components/Icons';
import { useTranslation } from 'react-i18next';
import { useState, useRef } from 'react';
import { login } from '../services/UsermasterAPI';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo, setUserRoleAndID } from '../store/UserSlice';


const { useBreakpoint } = Grid;
const bgLoginStyle = {
    textAlign: 'center',
    height: '100vh'
};
const btnLoginStyle = {
    height: 48,
    borderRadius: 48,
    lineHeight: 1,
    padding: '0.75rem 1.75rem',
    width: 220,
    fontSize: 16,
    fontWeight: 600
};
const appNameStyle = {
    fontWeight: 700,
    wordBreak: 'unset'
};
const sloganStyle = {
    color: '#344054',
    fontWeight: 600,
    marginBottom: 40
};
const groupBtn = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
};
const haftHeightStyle = {
    height: '50%'
};
const fullHeightStyle = {
    width: '100%',
    height: '100vh'
};

function Login() {
    const {
        token: { colorPrimary }
    } = theme.useToken();
    const dispatch = useDispatch();
    const { xs, lg } = useBreakpoint();
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const handleLogin = (value) => {
        const { password, userName } = value;
        login({ account: userName, password: password })
            .then((res) => {
                if (res !== 'NO DATA') {
                    const { Account, RoleID } = res?.data?.data;
                    console.log(Account, RoleID);
                    dispatch(
                        setUserInfo({
                            name: Account,
                            email: Account,
                            account: Account
                        })
                    );
                    dispatch(
                        setUserRoleAndID({
                            Role: RoleID,
                            RoleID,
                            RoleID,
                            RoleID,
                            Code: RoleID
                        })
                    );
                    location.replace("/FHN.FLT");
                } else {
                    console.log(res);
                    messageApi.open({
                        type: 'error',
                        content: 'Login fail',
                    });
                }
            })
            .catch(err => {
                console.log(err);
                messageApi.open({
                    type: 'error',
                    content: 'Login fail ...',
                });
            })
    };

    return (
        <Row justify='space-between' align='middle' style={bgLoginStyle}>
            {contextHolder}
            {lg && (
                <Col lg={16}>
                    <img style={fullHeightStyle} src={bgLogin} />
                </Col>
            )}
            <Col xs={24} lg={8} style={xs ? haftHeightStyle : {}}>
                <Form form={form} layout={'vertical'} onFinish={handleLogin}>
                    <div style={groupBtn}>
                        <AkaLogo2Icon />
                        <Typography.Text style={{ ...appNameStyle, color: colorPrimary, fontSize: xs ? 70 : 97 }}>
                            {t('app_name')}
                        </Typography.Text>
                        <Typography.Title level={4} style={sloganStyle}>
                            {t('login.slogan')}
                        </Typography.Title>
                        <Form.Item style={{ width: '65%' }} name={'userName'} label={'Username: '} rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item style={{ width: '65%' }} name={'password'} label={'Password'} rules={[{ required: true }]}>
                            <Input.Password />
                        </Form.Item>
                        <Button htmlType={'submit'} type='primary' style={btnLoginStyle}>
                            {t('login.sign_in')}
                        </Button>
                    </div>
                </Form>
            </Col>
            {!lg && (
                <Col xs={24} style={xs ? haftHeightStyle : {}}>
                    <img style={{ width: '100%', height: '100%' }} src={bgLogin} />
                </Col>
            )}
        </Row>
    );
}

export default Login;
