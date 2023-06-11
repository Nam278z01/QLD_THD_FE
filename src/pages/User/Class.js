import { Divider, Button, Card, Col, Dropdown, Empty, Grid, Modal, Pagination, Row, Space, Spin, Table, Tag, Typography } from 'antd';
import { SpaceCompactItemContext } from 'antd/es/space/Compact';
import { useState } from 'react';
import SearchInput from '../../components/SearchInput';
import { PAGE_INDEX, PAGE_SIZE, PAGE_SIZE_OPTIONS_GRID } from '../../constants/pagination';
const { Title, Text } = Typography;
const { Meta } = Card;
const { useBreakpoint } = Grid;

const ClassData = {
    Classes: [
        {
            ID: 1,
            Name: 'Lớp 10A1',
            Code: '10A1',
            GVCN: 'Lê Thị Mai',
            GVCNID: 1
        },
        {
            ID: 2,
            Name: 'Lớp 10A2',
            Code: '10A2',
            GVCN: 'Lê Hồng Phong',
            GVCNID: 2
        },
        {
            ID: 3,
            Name: 'Lớp 10A3',
            Code: '10A3',
            GVCN: 'Lê Thị Trang',
            GVCNID: 3
        },
        {
            ID: 4,
            Name: 'Lớp 11A1',
            Code: '11A1',
            GVCN: 'Nguyễn Văn Long',
            GVCNID: 4
        },
        {
            ID: 5,
            Name: 'Lớp 11A2',
            Code: '11A2',
            GVCN: 'Lê Thị Mận',
            GVCNID: 5
        },
        {
            ID: 6,
            Name: 'Lớp 11A3',
            Code: '11A3',
            GVCN: 'Lê Thị Ngọc',
            GVCNID: 6
        },
        {
            ID: 7,
            Name: 'Lớp 12A1',
            Code: '12A1',
            GVCN: 'Nguyễn Đình Đán',
            GVCNID: 7
        },
        {
            ID: 8,
            Name: 'Lớp 12A2',
            Code: '12A2',
            GVCN: 'Mr.Siro',
            GVCNID: 8
        },
        {
            ID: 9,
            Name: 'Lớp 12A3',
            Code: '12A3',
            GVCN: 'Văn Mai Hương',
            GVCNID: 9
        },
    ],
    totalItems: 9
};
function Class() {
    const [page, setPage] = useState(PAGE_INDEX);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [sortQuery, setSortQuery] = useState('');
    const { xs, lg } = useBreakpoint();

    const handelAfterChangeSearch = (value) => {
        setPage(PAGE_INDEX);
        setSearch(value);
    };
    // Handle paging changes
    const handlePagingChange = (page, pageSize) => {
        setPage(page);
        setPageSize(pageSize);
    };

    return (
        <div>
            <Divider orientation="left" orientationMargin="0">
                <Title style={{ lineHeight: 1.1, margin: 0 }} level={3}>Danh sách các lớp</Title>
            </Divider>
            <Row>
                <Col xs={24} md={12} style={{ marginBottom: '1rem' }}>
                    <Title style={{ lineHeight: 1.1, margin: 0 }} level={5}>
                        Khối 10
                    </Title>
                </Col>
                <Col
                    xs={24}
                    md={12}
                    style={{
                        display: 'flex',
                        alignItems: 'end',
                        justifyContent: 'end',
                        marginBottom: '1rem'
                    }}
                >
                    <Space>
                        <Space>
                            <Button type="primary" >
                                Add
                            </Button>
                        </Space>
                        <SearchInput afterChange={handelAfterChangeSearch} style={{ width: xs ? '100%' : 250 }} />
                    </Space>
                </Col>
            </Row>
            <Row gutter={[30, 30]}>
                {ClassData.Classes.length > 0 ? (
                    ClassData.Classes.map((item) => (
                        <Col span={6} key={item.ID}>
                            <Card>
                                <Meta title={item.Name} />
                                hi
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Row className="ant-empty-layout" align="middle" justify="center">
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </Row>
                )}
            </Row>

            {/* Pagination */}
            {ClassData.Classes.length > 0 && (
                <Pagination
                    style={{ float: 'right', marginTop: '1rem' }}
                    total={ClassData ? ClassData.totalItems : 0}
                    showTotal={(total) => `Total ${total} items`}
                    pageSize={pageSize}
                    current={page}
                    showSizeChanger={true}
                    pageSizeOptions={PAGE_SIZE_OPTIONS_GRID}
                    onChange={handlePagingChange}
                />
            )}
        </div>
    );
}

export default Class;
