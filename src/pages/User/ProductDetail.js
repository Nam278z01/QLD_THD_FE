import { Button, Col, Image, Modal, Row, Space, theme, Typography } from 'antd';
import { useEffect, useState } from 'react';
import BuyProduct from '../../components/User/BuyProduct';
import { ShopCartIcon, ShopUserIcon } from '../../components/Icons';
import { productDetail } from '../../assets/fakeData';
import { imgServer } from '../../dataConfig';
import styled from 'styled-components';
import { MinusOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import useRefreshToken from '../../Hook/useRefreshToken';
import { getProductDetail } from '../../services/ShopAPI';
import { getOneUserMasterByAccount } from '../../services/UsermasterAPI';
import { useSelector } from 'react-redux';
import moment from 'moment';
import imgFallback from '../../assets/images/bg_default_img.svg';
import imgSquareFallback from '../../assets/images/bg_default_img_square.svg';
import BreadcrumbApp from '../../components/BreadcrumbApp';
import useToast from '../../Hook/useToast';

const widthImg = 85;
const gap = 12;
const widthPreviewImg = 650;
const CustomImage = styled(Image)`
    &.ant-image-img {
        border-radius: 20px;
        cursor: pointer;
    }
`;

const CustomPreviewImage = styled(Image)`
    &.ant-image-img {
        border-radius: 20px;
        margin-bottom: 0.5rem;
    }
`;

const BuyButton = styled(Button)`
     {
        border-radius: 48px;
        padding: '0.75rem 2.25rem';
        width: 240px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

const QuantityButton = styled(Button)`
     {
        border-radius: 0.25rem;
    }

    &:hover .anticon {
        color: #452ba7;
    }
`;

function ProductDetail() {
    let { id } = useParams();
    const [imgSelected, setImgSelected] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [openModalBuyProduct, setModalBuyProduct] = useState();
    const {
        token: { colorPrimary }
    } = theme.useToken();
    const { CoinName } = useSelector((a) => a.DepartmentSettingSlice);
    const [contextHolder, openNotification] = useToast({ duration: 2 });
    const [data, setData] = useState({});
    const { account } = useSelector((state) => state.UserSlice);
    const [totalCoin, setTotalCoin] = useState(0);
    const [productData, setRefresh] = useRefreshToken(getProductDetail, id);
    const [User, setRefreshUser] = useRefreshToken(getOneUserMasterByAccount, account);
    // Open the teams microsoft
    const [defaulthref, setDefaulthref] = useState('https://teams.microsoft.com/l/chat/0/0?users=');

    useEffect(() => {
        setData(productData ? productData : {});
        setImgSelected(data?.Image);
    }, [data, productData]);

    useEffect(() => {
        if (data) {
            if (data.Coin) setTotalCoin(data.Coin * quantity);
            if (data.Quantity == 0) {
                setQuantity(0);
            }
        }
    }, [quantity, data]);

    // handle plus quantity wanted to buy
    const handlePlusQuantity = () => {
        if (quantity >= data?.Quantity) {
            return;
        }
        setQuantity(quantity + 1);
    };

    // handle minus quantity wanted to buy
    const handleMinusQuantity = () => {
        if (quantity <= 1) {
            return;
        }
        setQuantity(quantity - 1);
    };

    const handleBuyProduct = () => {
        if (totalCoin <= User.TotalCoin) {
            setModalBuyProduct(true);
        } else {
            openNotification('warning', 'Thông báo', "Don't have enought coin to buy");
        }
    };

    return (
        data && (
            <div style={{ margin: '1rem 2.5rem' }}>
                {/* Breadcrumb */}
                {/* <BreadcrumbApp /> */}

                <Typography.Title style={{ lineHeight: 1.1, marginBottom: 30 }} level={3}>
                    Product Details
                </Typography.Title>

                <Row wrap={false}>
                    <Col flex={`${widthImg + gap}px`} style={{ paddingRight: `${gap}px` }}>
                        <Space direction="vertical">
                            {data.product_imgs?.map((imgItem, i) => (
                                <CustomImage
                                    key={i}
                                    preview={false}
                                    src={`${imgServer}${imgItem}`}
                                    fallback={imgSquareFallback}
                                    width={widthImg}
                                    height={widthImg}
                                    onClick={() => setImgSelected(imgItem)}
                                />
                            ))}
                        </Space>
                    </Col>
                    <Col flex={`${widthPreviewImg + gap * 2}px`} style={{ padding: `0 ${gap}px` }}>
                        <CustomPreviewImage
                            preview={false}
                            src={`${imgServer}${imgSelected}`}
                            fallback={imgFallback}
                            width={widthPreviewImg}
                        />
                    </Col>
                    <Col style={{ paddingLeft: `${gap}px`, width: '100%' }}>
                        <Space style={{ width: '100%' }} direction="vertical" size="middle">
                            <Typography.Title level={2} style={{ margin: 0 }}>
                                {data?.Name}
                            </Typography.Title>
                            <Row align="middle" justify="space-between">
                                <div>
                                    <ShopUserIcon />
                                    <Typography.Link
                                        href={defaulthref + data?.Contact}
                                        target="_blank"
                                        style={{ color: '#818181', marginLeft: '0.35rem', cursor: 'pointer' }}
                                    >
                                        {data?.UserMaster?.Account}
                                    </Typography.Link>
                                </div>
                                <div style={{ fontSize: 22, color: colorPrimary, fontWeight: 700 }}>
                                    <span style={{ marginRight: '0.25rem' }}>{totalCoin}</span>
                                    <span>{CoinName}</span>
                                </div>
                                <div style={{ flexBasis: '100%', textAlign: 'right' }}>
                                    <span style={{ marginRight: '0.25rem' }}>Original price: {data?.Coin}</span>
                                    <span>{CoinName}</span>
                                </div>
                            </Row>
                            <div>
                                <Typography.Title level={5}>Quantity:</Typography.Title>
                                <Row align="middle" justify="space-between">
                                    <Space size="large">
                                        <Space>
                                            <QuantityButton onClick={handleMinusQuantity} icon={<MinusOutlined />} />
                                            <Typography.Text
                                                style={{ fontWeight: 600, fontSize: 16, margin: '0 0.25rem' }}
                                            >
                                                {quantity}
                                            </Typography.Text>
                                            <QuantityButton onClick={handlePlusQuantity} icon={<PlusOutlined />} />
                                        </Space>
                                        <Typography.Text>{data?.Quantity} items available</Typography.Text>
                                    </Space>

                                    {data.Quantity != 0 && data.UserMaster?.Account != account && (
                                        <BuyButton
                                            size="large"
                                            type="primary"
                                            icon={<ShopCartIcon />}
                                            onClick={handleBuyProduct}
                                        >
                                            Buy
                                        </BuyButton>
                                    )}
                                </Row>
                            </div>
                            <div>
                                <Typography.Title level={5} style={{ marginTop: '1rem' }}>
                                    Description
                                </Typography.Title>
                                <Typography.Paragraph>{data?.Description}</Typography.Paragraph>
                            </div>
                            <Typography.Paragraph style={{ color: '#667085', textAlign: 'right' }}>
                                Publish Date: {moment(new Date(data?.CreatedDate)).format('DD/MM/YYYY')}
                            </Typography.Paragraph>
                        </Space>
                    </Col>
                </Row>

                {contextHolder}

                {/* Modal buy product */}
                <Modal
                    title="Buy Product"
                    centered
                    width={500}
                    open={openModalBuyProduct}
                    onCancel={() => setModalBuyProduct(false)}
                    footer={[]}
                    destroyOnClose={true}
                >
                    <BuyProduct
                        setRefresh={setRefresh}
                        setRefreshUser={setRefreshUser}
                        quantity={quantity}
                        setModalBuyProduct={setModalBuyProduct}
                        User={User}
                        data={data}
                    />
                </Modal>
            </div>
        )
    );
}

export default ProductDetail;
