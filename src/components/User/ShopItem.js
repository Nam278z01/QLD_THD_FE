import { Dropdown, Image, Row, Space, Typography } from 'antd';
import { useHistory } from 'react-router-dom';
import { menuShop, menuShopKey } from '../../constants/shop';
import { imgServer } from '../../dataConfig';
import { ShopMenuIcon, ShopUserIcon, SoldIcon } from '../Icons';
import styled from 'styled-components';
import imgFallback from '../../assets/images/bg_default_img.svg';
import { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { GetTokenV2Context } from '../../context/GetTokenV2Context';
import { deletePersonalShop, maskAsSoldPersonalShop } from '../../services/ShopAPI';

const CustomImage = styled(Image)`
    &.ant-image-img {
        border-radius: 20px;
        max-height: 300px;
        margin-bottom: 0.5rem;
    }
`;

const solidContentStyle = {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 280,
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const productStatus = {
    UNSOLD: 1,
    SOLD: 2
};

function ShopItem({ ...prop }) {
    const isSold = prop.product.Status === productStatus.SOLD;
    const [defaulthref, setDefaulthref] = useState('https://teams.microsoft.com/l/chat/0/0?users=');
    const { getToken } = useContext(GetTokenV2Context);
    const { email } = useSelector((state) => state.UserSlice);
    const { CoinName } = useSelector((a) => a.DepartmentSettingSlice);
    const history = useHistory();

    // handle open the MS Teams
    const handleOpenMSTeam = () => {
        let isMyProduct = prop?.product.Contact === email;
        if (prop.tabKey === 1 && !isMyProduct) {
            window.open(defaulthref + prop?.product.Contact, '_blank');
        }
    };
    const handleShopMenuEvent = (key) => {
        switch (Number(key)) {
            case menuShopKey.EDIT:
                prop.setProductData(prop?.product);
                prop.setModalEditProduct(true);
                break;
            case menuShopKey.CHANGE_STATUS:
                unmarkOrmarkAsSold(isSold ? 'Unmark sold complete' : 'Mark as sold complete');
                break;
            case menuShopKey.DELETE:
                deleteItiem('Product is deleted');
                break;
            default:
                break;
        }
    };

    const callbackFinish = () => {
        prop.setDataChange(true);
    };

    const callbackFailed = () => {
        return;
    };
    // handle mark as sold
    const unmarkOrmarkAsSold = (message) => {
        getToken(maskAsSoldPersonalShop, message, callbackFinish, callbackFailed, null, prop.product.ID);
    };

    // handle mark as sold
    const deleteItiem = (message) => {
        getToken(deletePersonalShop, message, callbackFinish, callbackFailed, null, prop.product.ID);
    };

    const redirectToPage = (path) => {
        history.push(path);
    };

    return (
        <div style={{ position: 'relative' }}>
            {isSold && (
                <div style={solidContentStyle}>
                    <SoldIcon />
                </div>
            )}
            {prop.tabKey == 2 && (
                <Dropdown
                    overlayClassName="ant-dropdown-custom"
                    placement="bottomRight"
                    menu={{ items: menuShop(isSold), onClick: (event) => handleShopMenuEvent(event.key) }}
                    trigger={['click']}
                >
                    <a onClick={(e) => e.preventDefault()} style={{ position: 'absolute', right: 0, zIndex: 1 }}>
                        <ShopMenuIcon />
                    </a>
                </Dropdown>
            )}
            <Space.Compact block direction="vertical" style={isSold ? { opacity: 0.5, pointerEvents: 'none' } : {}}>
                <div style={{ cursor: 'pointer', position: 'relative' }}>
                    <Space.Compact
                        block
                        direction="vertical"
                        onClick={() => prop.tabKey === 1 && redirectToPage(`product/${prop.product.ID}`)}
                    >
                        <CustomImage
                            width="100%"
                            height="300px"
                            preview={false}
                            src={`${imgServer}${prop.product.Image}`}
                            fallback={imgFallback}
                        />
                        <Typography.Title level={5} style={{ marginBottom: '8px', marginTop: '8px' }}>
                            {prop.product.Name}
                        </Typography.Title>
                    </Space.Compact>
                </div>

                <Row style={{ width: '100%' }} align="middle" justify="space-between">
                    <div>
                        <ShopUserIcon />
                        <Typography.Text
                            onClick={handleOpenMSTeam}
                            style={{ color: '#818181', marginLeft: '0.35rem', cursor: 'pointer' }}
                        >
                            {prop.product.UserMasterName}
                        </Typography.Text>
                    </div>
                    <div style={{ fontSize: 16 }}>
                        <span style={{ fontWeight: 700, marginRight: '0.25rem' }}>{prop.product.Coin}</span>
                        <span>{CoinName}</span>
                    </div>
                </Row>
            </Space.Compact>
        </div>
    );
}

export default ShopItem;
