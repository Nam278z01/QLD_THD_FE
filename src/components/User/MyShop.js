import { Col, Empty, Modal, Pagination, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PAGE_INDEX, PAGE_SIZE, PAGE_SIZE_OPTIONS_GRID } from '../../constants/pagination';
import useRefreshToken from '../../Hook/useRefreshToken';
import { getPersonalShopList } from '../../services/ShopAPI';
import SellProduct from './SellProduct';
import ShopItem from './ShopItem';

function MyShop({ ...props }) {
    const { tabKey, searchQuery, refresh } = { ...props };
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(PAGE_INDEX);
    const [pageSize, setPageSize] = useState(PAGE_SIZE + 2);
    const { userID } = useSelector((a) => a.UserSlice);
    const [modalEditProduct, setModalEditProduct] = useState(false);
    const [productData, setProductData] = useState(null);
    const [isDataChange, setDataChange] = useState(false);

    const [data, setRefreshPersonalShop] = useRefreshToken(getPersonalShopList, userID, page, pageSize, searchQuery);

    useEffect(() => {
        refresh && setRefreshPersonalShop(new Date());
    });

    const handlePagingChange = (page, pageSize) => {
        setPage(page);
        setPageSize(pageSize);
    };

    useEffect(() => {
        setProducts(data ? data.ShopData : []);
    }, [data]);

    useEffect(() => {
        if (isDataChange) {
            setRefreshPersonalShop(new Date());
            setDataChange(false);
        }
    }, [isDataChange]);

    return (
        <>
            <Row gutter={[24, 24]}>
                {products.length > 0 ? (
                    products.map((item) => (
                        <Col span={6} key={item.ID}>
                            <ShopItem
                                product={item}
                                setDataChange={setDataChange}
                                tabKey={tabKey}
                                setProductData={setProductData}
                                setModalEditProduct={setModalEditProduct}
                            />
                        </Col>
                    ))
                ) : (
                    <Row className="ant-empty-layout" align="middle" justify="center">
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </Row>
                )}
            </Row>

            {/* Pagination */}
            {products.length > 0 && (
                <Pagination
                    style={{ float: 'right', marginTop: '1rem' }}
                    total={data ? data.totalItems : 0}
                    showTotal={(total) => `Total ${total} items`}
                    pageSize={pageSize}
                    current={page}
                    showSizeChanger={true}
                    pageSizeOptions={PAGE_SIZE_OPTIONS_GRID}
                    onChange={handlePagingChange}
                />
            )}
            <Modal
                title={productData ? 'Edit Product' : 'Sell product'}
                centered
                width={1000}
                open={modalEditProduct}
                onCancel={() => {
                    setModalEditProduct(false);
                }}
                destroyOnClose={true}
                footer={null}
            >
                <SellProduct
                    setRefresh={setRefreshPersonalShop}
                    setModalEditProduct={setModalEditProduct}
                    data={productData}
                    userData={props.userData}
                />
            </Modal>
        </>
    );
}

export default MyShop;
