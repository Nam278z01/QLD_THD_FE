import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Form, Input, InputNumber, Row, Select, Space, theme, Typography } from 'antd';
import debounce from 'lodash/debounce';
import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { GetTokenV2Context } from '../../context/GetTokenV2Context';
import { imgServer } from '../../dataConfig';
import { getUserRole } from '../../services/UsermasterAPI';
import { TransferCoin } from '../../services/WalletAPI';

const { Text } = Typography;

function SendPointForm({ setModalSendPoint, setDataChange, user, coinName }) {
    const {
        token: { colorPrimary }
    } = theme.useToken();
    const [form] = Form.useForm();
    const [options, setOptions] = useState([]);
    const { DepartmentID } = useSelector((a) => a.DepartmentSettingSlice);
    const { getToken, getTokenPromise } = useContext(GetTokenV2Context);

    const callbackFinish = () => {
        setModalSendPoint(false);
        setDataChange(true);
    };

    const callbackFailed = () => {
        setModalSendPoint(true);
    };

    const handleFinish = (body) => {
        getToken(TransferCoin, 'Send point success', callbackFinish, callbackFailed, body, DepartmentID);
    };

    const handleSearchUserReceive = (keyword) => {
        if (!keyword || keyword.indexOf('@') >= 0) {
            setOptions([]);
            return;
        }

        getTokenPromise(getUserRole, DepartmentID, keyword.trim(), DepartmentID).then((res) => {
            if (res != 'NO DATA') {
                const data = [{ value: res.ID, label: `${res.Account} (${res.Department?.Code})` }];
                setOptions(data ? data : []);
            } else {
                setOptions([]);
            }
        });
    };

    return (
        <Form style={{ marginTop: '2rem' }} form={form} layout="vertical" name="form_in_modal" onFinish={handleFinish}>
            <Form.Item label="From">
                <Card className="card-unstyle" bordered={false}>
                    <Card.Meta
                        avatar={
                            <Avatar size={44} src={`${imgServer}${user ? user.Avatar : ''}`} icon={<UserOutlined />} />
                        }
                        title={<div style={{ marginBottom: '0.25rem' }}>{user ? user.DisplayName : ''}</div>}
                        description={
                            <Space>
                                <Text style={{ opacity: 0.6 }}>Current points:</Text>
                                <Text style={{ fontWeight: 700, color: colorPrimary }}>
                                    {user ? user.TotalCoin : 0} {coinName}
                                </Text>
                            </Space>
                        }
                    />
                </Card>
            </Form.Item>
            <Form.Item name="UserReceive" label="To" rules={[{ required: true, message: 'Please enter account!' }]}>
                <Select
                    showSearch
                    filterOption={false}
                    notFoundContent={'Not Found'}
                    placeholder="Please enter your friend account"
                    options={options}
                    onSearch={debounce(handleSearchUserReceive, 300)}
                />
            </Form.Item>
            <Form.Item
                name="CoinNumber"
                label="Amount"
                rules={[{ required: true, message: 'Please send your friend some Coin!' }]}
            >
                <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
            <Form.Item name="Message" label="Message">
                <Input type="textarea" />
            </Form.Item>
            <Form.Item name="TransactionMethod" hidden={true} initialValue={3}>
                <Input type="text" />
            </Form.Item>
            <Row justify="end">
                <Button size="large" type="primary" onClick={debounce(() => form.submit(), 500)} style={{ width: 150 }}>
                    Send {coinName}
                </Button>
            </Row>
        </Form>
    );
}

export default SendPointForm;
