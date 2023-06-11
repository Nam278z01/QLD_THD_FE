import { Divider, Button, Card, Col, Form, Empty, Grid, Modal, Pagination, Row, Space, message, Table, Input, Typography } from 'antd';
import { SpaceCompactItemContext } from 'antd/es/space/Compact';
import { useEffect, useState } from 'react';
import SearchInput from '../../components/SearchInput';
import { PAGE_INDEX, PAGE_SIZE, PAGE_SIZE_OPTIONS_GRID } from '../../constants/pagination';
import { notBeEmpty } from '../../utils/validator';
import debounce from 'lodash/debounce';
import { createClass } from '../../services/ClassAPI';
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
function Class({ classData, gradeId, setRefresh }) {
    const [form] = Form.useForm();
    const [page, setPage] = useState(PAGE_INDEX);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [sortQuery, setSortQuery] = useState('');
    const { xs, lg } = useBreakpoint();
    const [data, setData] = useState(null);
    const [modalClass, setModalClass] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if (classData && classData?.rows?.length > 0) {
            setData(classData.rows);
        }
    }, [classData]);

    const handelAfterChangeSearch = (value) => {
        setPage(PAGE_INDEX);
        setSearch(value);
    };
    // Handle paging changes
    const handlePagingChange = (page, pageSize) => {
        setPage(page);
        setPageSize(pageSize);
    };

    const handleFinish = (values) => {
        values.GradeID = gradeId;

        createClass(values).then((res) => {
            console.log(res);
            messageApi.open({
                type: 'success',
                content: 'Thêm mới thành công',
            });
            setRefresh(new Date());
            setModalClass(false);
        })
        .catch ((err) => {
            console.log(err);
            messageApi.open({
                type: 'error',
                content: 'Thêm mới thất bại',
            });
        })
    };

    return (
        <div>
            {contextHolder}
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
                            <Button type="primary" onClick={() => setModalClass(true)}>
                                Add
                            </Button>
                        </Space>
                        <SearchInput afterChange={handelAfterChangeSearch} style={{ width: xs ? '100%' : 250 }} />
                    </Space>
                </Col>
            </Row>
            <Row gutter={[30, 30]}>
                {data?.length > 0 ? (
                    data?.map((item) => (
                        <Col span={6} key={item.ID}>
                            <Card>
                                <Meta title={item.Name} />
                                {`Mã lớp: ${item.Code}`}
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
            {data?.length > 0 && (
                <Pagination
                    style={{ float: 'right', marginTop: '1rem' }}
                    total={classData ? classData?.count : 0}
                    showTotal={(total) => `Total ${total} items`}
                    pageSize={pageSize}
                    current={page}
                    showSizeChanger={true}
                    pageSizeOptions={PAGE_SIZE_OPTIONS_GRID}
                    onChange={handlePagingChange}
                />
            )}
            {/* Modal Tạo lớp */}
            <Modal
                title="Tạo lớp mới"
                centered
                width={1000}
                open={modalClass}
                onCancel={() => setModalClass(false)}
                footer={[]}
                destroyOnClose={true}
            >
                <Form
                    form={form}
                    labelCol={{ span: 6 }}
                    labelWrap
                    labelAlign="left"
                    style={{ marginTop: '1.5rem' }}
                    onFinish={debounce(handleFinish, 500)}
                >
                    <Row gutter={24}>
                        <Col xs={24} md={24}>
                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        label="Name"
                                        name="Name"
                                        rules={[
                                            { required: true, message: 'Name is required' },
                                            { type: 'string', min: 3 },
                                            { validator: notBeEmpty }
                                        ]}
                                    >
                                        <Input type="text" min={5} max={30} placeholder="Tên lớp" />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        label="Mã Lớp"
                                        name="Code"
                                        rules={[
                                            { required: true, message: 'Mã Lớp is required' },
                                            { type: 'string', min: 3 },
                                            { validator: notBeEmpty }
                                        ]}
                                    >
                                        <Input type="text" min={5} max={30} placeholder="Mã lớp" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row justify="end" align="middle">
                        <Button size="large" type="primary" htmlType="submit">
                            Thêm mới
                        </Button>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
}

export default Class;
