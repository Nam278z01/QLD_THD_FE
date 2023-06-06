import { handleBreakpoints } from '@mui/system';
import { Col, Empty, Pagination, Row } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import { shop } from '../../assets/fakeData';
import { PAGE_INDEX, PAGE_SIZE, PAGE_SIZE_OPTIONS_GRID } from '../../constants/pagination';
import useRefreshToken from '../../Hook/useRefreshToken';
import { getShopList } from '../../services/ShopAPI';
import ShopItem from './ShopItem';

function PublicShop({ ...props }) {
    const { tabKey, searchQuery, refresh } = { ...props };
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(PAGE_INDEX);
    const [pageSize, setPageSize] = useState(PAGE_SIZE + 2);
    const [data, setRefreshAllShop] = useRefreshToken(getShopList, page, pageSize, searchQuery);

    useEffect(() => {
        refresh && setRefreshAllShop(new Date());
    });

    // Handle paging changes
    const handlePagingChange = (page, pageSize) => {
        setPage(page);
        setPageSize(pageSize);
    };

    useEffect(() => {
        setProducts(data ? data.ShopData : []);
    }, [data]);

    return (
        <>
            <Row gutter={[30, 30]}>
                {products.length > 0 ? (
                    products.map((item) => (
                        <Col span={6} key={item.ID}>
                            <ShopItem product={item} tabKey={tabKey} />
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
        </>
    );
}

export default PublicShop;
