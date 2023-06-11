import { ExclamationCircleFilled, MoreOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Col, Dropdown, Grid, Modal, Row, Space, Spin, Table, Tag, Typography } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import SearchInput from '../../components/SearchInput';
import CreateRule from '../../components/User/CreateRule';
import { PAGE_INDEX, PAGE_SIZE, PAGE_SIZE_OPTIONS_TABLE } from '../../constants/pagination';
import { TABLE } from '../../constants/table';
import useAuth from '../../Hook/useAuth';
import useRefreshToken from '../../Hook/useRefreshToken';
import { exportAllMemberDepartment, getAllMemberDepartment } from '../../services/UsermasterAPI';
import ImportFile from '../../components/ImportFile';
import { GetTokenV2Context } from '../../context/GetTokenV2Context';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { uploadMemberExcel } from '../../services/ImportAPI';
import debounce from 'lodash/debounce';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;
const { confirm } = Modal;

const MEMBER_STATUS = {
    ACTIVE: 1,
    INACTIVE: 2,
    AWAY: 3,
    NOT_RANKING: 4
};
const MEMBER_ROLE = {
    ADMIN: 1,
    HEAD: 2,
    PM: 3,
    MEMBER: 4
};
const MEMBER_TYPE = {
    SVTT: 'SVTT',
    NVCT: 'NVCT'
};

// render badge for member status
const statusColumRender = (Status) => {
    switch (Status) {
        case MEMBER_STATUS.ACTIVE:
            return <Badge status="success" text="Active" />;
        case MEMBER_STATUS.INACTIVE:
            return <Badge status="error" text="Inactive" />;
        case MEMBER_STATUS.AWAY:
            return <Badge status="warning" text="Away" />;
        case MEMBER_STATUS.NOT_RANKING:
            return <Badge status="default" text="Not Ranking" />;
        default:
    }
};

// default status filter values
const statusFilterValues = [
    {
        text: 'Active',
        value: 1
    },
    {
        text: 'Inactive',
        value: 2
    },
    {
        text: 'Away',
        value: 3
    },
    {
        text: 'Not Ranking',
        value: 4
    }
];

// default role filter values
const roleFilterValues = [
    {
        text: 'HEAD',
        value: 2
    },
    {
        text: 'PM',
        value: 3
    },
    {
        text: 'MEMBER',
        value: 4
    }
];
const contractTypeValues = [
    { text: MEMBER_TYPE.SVTT, value: MEMBER_TYPE.SVTT },
    { text: MEMBER_TYPE.NVCT, value: MEMBER_TYPE.NVCT }
];

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

function StudentManage() {
    const [page, setPage] = useState(PAGE_INDEX);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [sortQuery, setSortQuery] = useState('');
    const { xs, lg } = useBreakpoint();
    const [data, setData] = useState(null);


    // setting colums of table
    const columns = [
        {
            title: 'STT',
            dataIndex: 'No',
            key: 'No',
            width: 50,
            align: 'center',
            render: (id, record, index) => TABLE.COLUMN.RENDER_INDEX(id, record, index, page, pageSize)
        },
        {
            title: 'Tên giáo viên',
            dataIndex: '',
            key: 'Department',
            align: 'center',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'DisplayName',
            key: 'DisplayName',
            width: '25%'
        },
        {
            title: 'Giới tính',
            dataIndex: 'Account',
            key: 'Account',
            align: 'center',
            sorter: true,
            sortDirections: ['ascend', 'descend']
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'JobTitle',
            key: 'JobTitle'
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'RoleID',
            key: 'Role',
            align: 'center'
        },
        {
            title: 'Email',
            dataIndex: 'PhoneNumber',
            key: 'PhoneNumber',
            align: 'center',
            sorter: true,
            sortDirections: ['ascend', 'descend']
        }
    ];

    // get data from api [getAllMember]
    // const [memberData, setRefreshMemberData] = useRefreshToken(
    //     getAllMemberDepartment,
    //     page,
    //     pageSize,
    //     sortQuery,
    //     search,
    //     role,
    //     status,
    //     contract
    // );
    // useEffect(() => {
    //     setData(memberData);
    // }, [memberData]);

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

        // filter
        if (filters.Status) {
            setStatus(filters.Status[0]);
        } else {
            setStatus('');
        }
        if (filters.Role) {
            setRole(filters.Role[0]);
        } else {
            setRole('');
        }
        if (filters.ContractType) {
            setContract(filters.ContractType[0] === 'NVCT' ? 1 : filters.ContractType[0] === 'SVTT' ? 2 : '');
        } else {
            setContract('');
        }
        // sort
        let order = sorter.order;
        let sortName = sorter.columnKey;

        if (order) {
            if (sortName === 'Birthday') {
                sortName = 'DOB';
            }
            setSortQuery(sortName + ':' + (order === 'ascend' ? 'ASC' : 'DESC'));
        } else {
            setSortQuery('');
        }
    };

    const handleImport = (file) => {
        setModalImportRule(false);

        const formData = new FormData();
        formData.append('file', file);

        getTokenFormData(uploadMemberExcel, 'Import success', success, null, formData, DepartmentID);
    };

    const success = () => {
        setRefreshMemberData(new Date());
    };
    const handleExport = () => {
        const exportFileName = `${Code}_member_${moment(new Date()).format('YYYY_MM_DD_HH_mm')}`;
        getTokenDownload(
            exportAllMemberDepartment,
            exportFileName,
            DepartmentID,
            page,
            pageSize,
            sortQuery,
            search,
            role,
            status
        );
    };

    return (
        <div style={{ margin: '1rem 2.5rem' }}>
            <Row>
                <Col xs={24} md={12} style={{ marginBottom: '1rem' }}>
                    <Title style={{ lineHeight: 1.1, margin: 0 }} level={3}>
                        Quản lý học sinh
                    </Title>
                    <Text>Danh sách học sinh</Text>
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
                        <Button type="primary" >
                            add
                        </Button>
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
            {/* <Modal
                title="Create Member"
                centered
                open={modalCreateRule}
                footer={null}
                width={750}
                onCancel={() => setModalCreateRule(false)}
            >
                <CreateRule />
            </Modal>
            <Modal
                title="Import Member"
                centered
                open={modalImportRule}
                footer={null}
                width={500}
                onCancel={() => setModalImportRule(false)}
            >
                <ImportFile onFinish={handleImport} />
            </Modal> */}
        </div>
    );
}

export default StudentManage;
