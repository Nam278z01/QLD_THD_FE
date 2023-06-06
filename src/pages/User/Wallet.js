import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Modal, Row, Space, Tabs, theme, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SendPointForm from '../../components/User/SendPoint';
import ShopHistory from '../../components/User/ShopHistory';
import TransactionHistory from '../../components/User/TransactionHistory';
import { imgServer } from '../../dataConfig';
import useRefreshToken from '../../Hook/useRefreshToken';
import { getOneUserMasterByAccount } from '../../services/UsermasterAPI';
import bgWallet from '../../assets/images/bg_wallet.svg';

const { Title, Text } = Typography;
const cardUserInfoStyle = {
    backgroundImage: `url(${bgWallet})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    padding: '2rem',
    margin: '1.5rem 0'
};
const sendPointBtnStyle = {
    border: 'none',
    fontWeight: 600,
    height: 48,
    lineHeight: 1.5,
    padding: '0.75rem 2.25rem',
    borderRadius: 48
};

function Wallet() {
    const {
        token: { colorPrimary }
    } = theme.useToken();
    const [modalSendPoint, setModalSendPoint] = useState(false);
    const [curTab, setCurTab] = useState(1);
    const [isDataChange, setDataChange] = useState(false);
    const [user, setUser] = useState({});
    const { CoinName } = useSelector((a) => a.DepartmentSettingSlice);
    const { account, displayName, imgurl } = useSelector((state) => state.UserSlice);
    const items = [
        {
            label: `Transaction History`,
            key: 1,
            children: <TransactionHistory triggerRefresh={curTab === 1 && isDataChange} />
        },
        {
            label: `Shop History`,
            key: 2,
            children: <ShopHistory triggerRefresh={curTab === 2 && isDataChange} />
        }
    ];
    const [userData, setRefresh] = useRefreshToken(getOneUserMasterByAccount, account);

    useEffect(() => {
        setUser(userData ? userData : {});
    }, [userData]);

    useEffect(() => {
        if (isDataChange) {
            setRefresh(new Date());
            setDataChange(false);
        }
    }, [isDataChange]);

    const handleTabChange = (activeKey) => {
        setCurTab(activeKey);
    };

    return (
        <div style={{ margin: '1rem 2.5rem' }}>
            {/* Breadcrumb */}
            {/* <BreadcrumbApp/> */}

            {/* Filter */}
            <Title style={{ lineHeight: 1.1 }} level={3}>
                My Wallet
            </Title>

            {/* Card User Info */}
            <Card className="card-custom" bordered={false} style={cardUserInfoStyle}>
                <Row align="middle" justify="space-between">
                    <Card.Meta
                        avatar={<Avatar size={70} src={`${imgServer}${imgurl}`} icon={<UserOutlined />} />}
                        title={<div style={{ fontSize: 18, marginBottom: '0.25rem' }}>{displayName}</div>}
                        description={
                            <Space>
                                <Text style={{ opacity: 0.6 }}>You currently have</Text>
                                <Text style={{ fontWeight: 700, color: colorPrimary }}>
                                    {user ? user.TotalCoin : 0} {CoinName}
                                </Text>
                            </Space>
                        }
                    />
                    <Button
                        style={sendPointBtnStyle}
                        size="large"
                        onClick={() => {
                            setModalSendPoint(true);
                        }}
                    >
                        Send {CoinName}
                    </Button>
                </Row>
            </Card>

            {/* Table List */}
            <Tabs type="card" items={items} destroyInactiveTabPane={true} onChange={handleTabChange} />

            {/* Modal send point */}
            {modalSendPoint && (
                <Modal
                    title={'Send ' + CoinName}
                    centered
                    width={554}
                    open={modalSendPoint}
                    onCancel={() => setModalSendPoint(false)}
                    footer={null}
                >
                    <SendPointForm
                        setModalSendPoint={setModalSendPoint}
                        setDataChange={setDataChange}
                        user={user}
                        coinName={CoinName}
                    />
                </Modal>
            )}
        </div>
    );
}

export default Wallet;
