import { Button, Card, Input, Modal, Row, Space, Tabs, Typography } from 'antd';
import SellProduct from '../../components/User/SellProduct';
import PublicShop from '../../components/User/PublicShop';
import MyShop from '../../components/User/MyShop';
import { useEffect, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { getOneUserMasterByAccount } from '../../services/UsermasterAPI';
import { useSelector } from 'react-redux';
import useRefreshToken from '../../Hook/useRefreshToken';
import BreadcrumbApp from '../../components/BreadcrumbApp';
import SearchInput from '../../components/SearchInput';
const SellButton = styled(Button)`
     {
        padding: '0.75rem 2.25rem';
        width: 135px;
    }
`;

function Shop() {
    const [openModalSellProduct, setModalSellProduct] = useState();
    const [search, setSearch] = useState('');
    const [keyword, setKeyword] = useState('');
    const [tabKey, setTabKey] = useState(1);
    const [refresh, setRefresh] = useState(false);
    const { account } = useSelector((state) => state.UserSlice);
    const { CoinName } = useSelector((state) => state.DepartmentSettingSlice);

    const [userData, setRefreshUser] = useRefreshToken(getOneUserMasterByAccount, account);

    const shopTabItems = [
        {
            label: `Shop`,
            key: 1,
            children: <PublicShop refresh={tabKey === 1 && refresh} searchQuery={keyword} tabKey={tabKey} />
        },
        {
            label: `My Shop`,
            key: 2,
            children: (
                <MyShop refresh={tabKey === 2 && refresh} searchQuery={keyword} tabKey={tabKey} userData={userData} />
            )
        }
    ];

    useEffect(() => {
        refresh && setRefresh(false);
    }, [refresh]);

    const handleAfterChangeSearch = (value) => {
        setKeyword(value);
    };

    // handle tab click
    const onTabClickHandle = (key, event) => {
        setTabKey(key);
        setSearch('');
        setKeyword('');
    };

    const operations = <SearchInput value={search} afterChange={handleAfterChangeSearch} />;

    return (
        <div style={{ margin: '1rem 2.5rem' }}>
            {/* Breadcrumb */}
            {/* <BreadcrumbApp /> */}

            <Card className="card-unstyle" bordered={false} style={{ marginBottom: '1.25rem' }}>
                <Row align="middle" justify="space-between">
                    <Typography.Title style={{ lineHeight: 1.1 }} level={3}>
                        Shop
                    </Typography.Title>
                    <Space size="large">
                        <Typography.Text style={{ fontSize: 16 }}>
                            You currently have&nbsp;
                            <Typography.Text style={{ fontWeight: 700, fontSize: 18 }}>
                                {userData ? userData.TotalCoin : ''} {CoinName}
                            </Typography.Text>
                        </Typography.Text>
                        <SellButton size="large" type="primary" onClick={() => setModalSellProduct(true)}>
                            Sell Product
                        </SellButton>
                    </Space>
                </Row>
            </Card>

            {/* Tab list */}
            <Tabs
                type="card"
                items={shopTabItems}
                tabBarExtraContent={operations}
                destroyInactiveTabPane={true}
                onTabClick={onTabClickHandle}
            />

            {/* Modal sell product */}
            <Modal
                title="Sell Product"
                centered
                width={1000}
                open={openModalSellProduct}
                onCancel={() => setModalSellProduct(false)}
                footer={[]}
                destroyOnClose={true}
            >
                <SellProduct setRefresh={setRefresh} userData={userData} setModalSellProduct={setModalSellProduct} />
            </Modal>
        </div>
    );
}

export default Shop;
