import { ExclamationCircleFilled } from '@ant-design/icons';
import { Badge, Button, Card, Col, Grid, Modal, Row, Space, Table, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SearchInput from '../../components/SearchInput';
import CreateRule from '../../components/User/CreateRule';
import { PAGE_INDEX, PAGE_SIZE, PAGE_SIZE_OPTIONS_TABLE } from '../../constants/pagination';
import { TABLE } from '../../constants/table';
import useRefreshToken from '../../Hook/useRefreshToken';
import { getAllProject } from '../../services/ProjectAPI';
import { useSelector } from 'react-redux';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;
const { confirm } = Modal;

const StyledCard = styled(Card)`
    .ant-card {
        box-shadow: none;
    }

    .ant-card .ant-card-head-title {
        font-weight: 600;
        font-size: 16px;
    }

    .ant-card-head {
        border-bottom: none;
    }

    .ant-card-body {
        border-radius: 0;
        padding: 8px 16px;
        box-shadow: inset 0px 1px 0px #d0d5dd, inset 0px -1px 0px #d0d5dd, inset 1px 0px 0px #d0d5dd,
            inset -1px 0px 0px #d0d5dd;
    }
`;

function PMMember() {
    const [page, setPage] = useState(PAGE_INDEX);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [sortQuery, setSortQuery] = useState('');
    const [role, setRole] = useState('');
    const [modalModalSeeMore, setModalModalSeeMore] = useState(false);
    const [modalCreateRule, setModalCreateRule] = useState(false);
    const [modalModalSeeMoreData, setModalM] = useState([]);
    const [data, setData] = useState({});
    const { xs, lg } = useBreakpoint();
    const { account, userID } = useSelector((state) => state.UserSlice);

    const handleDeactiveRule = () => {};
    const showDeactiveConfirm = () => {
        confirm({
            title: 'Are you sure deactive this item?',
            icon: <ExclamationCircleFilled />,
            content: null,
            centered: true,
            okType: 'danger',
            className: 'custom-confirm-styles',
            onOk() {
                handleDeactiveRule();
            }
        });
    };
    const onClick = ({ key }) => {
        switch (parseInt(key)) {
            case 0:
                setModalCreateRule(true);
                break;
            case 1:
                showDeactiveConfirm();
                break;
            default:
                break;
        }
    };

    // setting colums of table
    const columns = [
        {
            title: 'No.',
            dataIndex: 'No',
            key: 'No',
            width: 50,
            align: 'center',
            render: (id, record, index) => TABLE.COLUMN.RENDER_INDEX(id, record, index, page, pageSize)
        },
        {
            title: 'Name',
            dataIndex: 'DisplayName',
            key: 'DisplayName',
            width: '25%'
        },
        {
            title: 'Email',
            dataIndex: 'Email',
            key: 'Email',
            align: 'center',
            sorter: true,
            sortDirections: ['ascend', 'descend'],
            width: '25%'
        },
        {
            title: 'Job Title',
            dataIndex: 'JobTitle',
            key: 'JobTitle'
        },

        {
            title: 'Phone Number',
            dataIndex: 'PhoneNumber',
            key: 'PhoneNumber',
            align: 'center',
            sorter: true,
            sortDirections: ['ascend', 'descend']
        },
        {
            title: 'YOB',
            dataIndex: 'YOB',
            key: 'YOB',
            align: 'center',
            sorter: true,
            sortDirections: ['ascend', 'descend']
        }
    ];

    // get data from api [getAllProject]
    const [memberData] = useRefreshToken(
        getAllProject,
        page,
        account,
        userID,
        pageSize,
        sortQuery,
        search,
        role,
        status
    );

    useEffect(() => {
        setData(memberData);
    }, [memberData]);

    const handelAfterChangeSearch = (value) => {
        setPage(PAGE_INDEX);
        setSearch(value);
    };

    /**
     * Trigger event table change
     * @param {*} pagination { current, pageSize, total, showSizeChanger }
     * @param {*} filters { Status[...], Role[...], RuleType[...] }
     * @param {*} sorter { order, columnKey, field, column{...} }
     * @param {*} extra { currentDataSource[...], action }
     */

    const onTableChange = (pagination, filters, sorter, extra) => {
        // pagination
        setPage(pagination.current);
        setPageSize(pagination.pageSize);

        // sort
        let order = sorter.order;
        let sortName = sorter.columnKey;

        if (order) {
            setSortQuery(sortName + ':' + (order === 'ascend' ? 'ASC' : 'DESC'));
        } else {
            setSortQuery('');
        }
    };

    return (
        <div style={{ margin: '1rem 2.5rem' }}>
            <Row>
                <Col xs={24} md={12} style={{ marginBottom: '1rem' }}>
                    <Title style={{ lineHeight: 1.1, margin: 0 }} level={3}>
                        Member List
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
                        <SearchInput afterChange={handelAfterChangeSearch} style={{ width: xs ? '100%' : 250 }} />
                    </Space>
                </Col>
            </Row>

            {/* Table List */}
            <Table
                bordered
                style={{ borderRadius: 0 }}
                rowKey={(record) => record.ID}
                columns={columns.filter((col) => !col.hidden)}
                dataSource={data ? data.allMem : []}
                onChange={onTableChange}
                pagination={{
                    total: data ? data.totalItems : 0,
                    current: page,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: PAGE_SIZE_OPTIONS_TABLE,
                    showTotal: (total) => `Total ${total} items`
                }}
            />
            <Modal
                title={
                    <h3
                        style={{
                            fontSize: '24px',
                            lineHeight: '32px',
                            fontWeight: 600
                        }}
                    >
                        {'See Note'}
                    </h3>
                }
                centered
                open={modalModalSeeMore}
                onOk={() => setModalModalSeeMore(false)}
                onCancel={() => setModalModalSeeMore(false)}
                footer={[]}
                width={587}
            >
                <StyledCard
                    title={modalModalSeeMoreData.DisplayName}
                    bordered={false}
                    style={{ width: 520, boxShadow: 'none' }}
                >
                    <p>{modalModalSeeMoreData.Note}</p>
                </StyledCard>
            </Modal>
            <Modal
                title="Create rule"
                centered
                open={modalCreateRule}
                footer={null}
                width={750}
                onCancel={() => setModalCreateRule(false)}
            >
                <CreateRule />
            </Modal>
        </div>
    );
}

export default PMMember;
