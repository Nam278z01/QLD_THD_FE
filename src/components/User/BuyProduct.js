import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Form, Input, InputNumber, Row, Space, Typography } from 'antd';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { imgServer } from '../../dataConfig';
import { TransferCoin } from '../../services/WalletAPI';
import { GetTokenV2Context } from '../../context/GetTokenV2Context';
import debounce from 'lodash/debounce';

const { Title, Text } = Typography;
const cardUserInfoStyle = {
    marginBottom: '1rem'
};

function BuyProduct({ data, setModalBuyProduct, setRefreshUser, quantity, setRefresh, User }) {
    const [form] = Form.useForm();
    const { imgurl, displayName } = useSelector((state) => state.UserSlice);
    const { DepartmentID, CoinName } = useSelector((state) => state.DepartmentSettingSlice);
    const { getToken } = useContext(GetTokenV2Context);
    const TransactionMethodId = 2;

    function success() {
        setModalBuyProduct(false);
        setRefresh(new Date());
        setRefreshUser(new Date());
    }

    function handleSubmit() {
        form.submit();
    }

    const onFinish = (values) => {
        const store = {
            UserReceive: data.UserMaster.ID ? data.UserMaster.ID : '',
            CoinNumber: data.Coin ? data.Coin * quantity : null,
            Message: values.Message,
            AccountName: User.Account,
            DepartmentID: DepartmentID,
            TransactionMethod: TransactionMethodId,
            Quantity: quantity,
            ProductID: data.ID
        };
        getToken(TransferCoin, 'Buy product successfully!', success, null, store, DepartmentID);
    };

    return (
        <div>
            {/* Card User Info */}
            <Title style={{ lineHeight: 1.1, marginBottom: '0.75rem', marginTop: '1.75rem' }} level={5}>
                Send {CoinName} from
            </Title>
            <Card className="card-unstyle" bordered={false} style={cardUserInfoStyle}>
                <Card.Meta
                    avatar={<Avatar size={44} src={`${imgServer}${imgurl}`} icon={<UserOutlined />} />}
                    title={<div style={{ fontSize: 16 }}>{displayName}</div>}
                    description={
                        <Space>
                            <Text style={{ opacity: 0.6 }}>Current {CoinName}:</Text>
                            <Text style={{ fontWeight: 700 }}>{User.TotalCoin}</Text>
                        </Space>
                    }
                />
            </Card>

            {/* Form */}
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={[0, 12]}></Row>
                <Row gutter={[0, 12]}>
                    <Col span={24}>
                        <Form.Item
                            name="ProductName"
                            label="To"
                            value={data.UserMaster.Account}
                            initialValue={data.UserMaster.Account}
                        >
                            <Input readOnly value={data.UserMaster.Account} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="Amount" label="Amount" value={quantity} initialValue={quantity}>
                            <InputNumber
                                readOnly
                                placeholder="Input price"
                                onChange={(e) => {}}
                                value={quantity}
                                style={{ width: '100%' }}
                                type="number"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="Message" label="Message" initialValue={''}>
                            <Input placeholder="Enter message" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

            <Row justify="end">
                <Button
                    type="primary"
                    size="large"
                    style={{ width: '150px' }}
                    onClick={debounce(() => handleSubmit(), 500)}
                >
                    Buy
                </Button>
            </Row>
        </div>
    );
}

export default BuyProduct;
