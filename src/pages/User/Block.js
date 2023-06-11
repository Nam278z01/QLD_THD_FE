import { Badge, Button, Card, Col, Divider, Empty, Grid, Modal, Pagination, Row, Space, Spin, Table, Tag, Typography } from 'antd';
import { SpaceCompactItemContext } from 'antd/es/space/Compact';
import { useEffect, useState } from 'react';
import SearchInput from '../../components/SearchInput';
import { PAGE_INDEX, PAGE_SIZE, PAGE_SIZE_OPTIONS_GRID } from '../../constants/pagination';
import Class from './Class';
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;
const { Meta } = Card;

const BlockData = {
    Blocks: [
        {
            ID: 1,
            Name: 'Khối 10'
        },
        {
            ID: 2,
            Name: 'Khối 11'
        },
        {
            ID: 3,
            Name: 'Khối 12'
        },
    ],
    totalItems: 3
};
function Block() {
    const [page, setPage] = useState(PAGE_INDEX);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [sortQuery, setSortQuery] = useState('');
    const { xs, lg } = useBreakpoint();
    const [data, setData] = useState(BlockData);
    const [selectedBlock, setSelectedBlock] = useState(1);

    useEffect(() => {
        setData(BlockData);
    }, []);

    const handelAfterChangeSearch = (value) => {
        setPage(PAGE_INDEX);
        setSearch(value);
    };
    const handlePagingChange = (page, pageSize) => {
        setPage(page);
        setPageSize(pageSize);
    };

    return (
        <div>
            <Row>
                <Col xs={24} md={12} style={{ marginBottom: '1rem' }}>
                    <Title style={{ lineHeight: 1.1, margin: 0 }} level={3}>
                        Danh sách các khối
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
                {BlockData?.Blocks.length > 0 ? (
                    BlockData?.Blocks.map((item) => (
                        <Col span={8} key={item.ID}>
                            <Card onClick={() => setSelectedBlock(item.ID)} hoverable className={ selectedBlock === item.ID ? 'border border-success':''}>
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

            {/* Class */}
            <Class />
        </div>
    );
}

export default Block;
