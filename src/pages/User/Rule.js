import { CheckCircleTwoTone, ExclamationCircleFilled, MoreOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Col, Dropdown, Grid, Modal, Row, Space, Table, Typography } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import SearchInput from '../../components/SearchInput';
import CreateRule from '../../components/User/CreateRule';
import { PAGE_INDEX, PAGE_SIZE, PAGE_SIZE_OPTIONS_TABLE } from '../../constants/pagination';
import { TABLE } from '../../constants/table';
import useAuth from '../../Hook/useAuth';
import useRefreshToken from '../../Hook/useRefreshToken';
import { exportRule, getRule, getRuleExport, updateRuleStatus, uploadRuleExcel } from '../../services/RuleAPI';
import ImportFile from '../../components/ImportFile';
import { GetTokenV2Context } from '../../context/GetTokenV2Context';
import { useSelector } from 'react-redux';
import moment from 'moment';
import debounce from 'lodash/debounce';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;
const { confirm } = Modal;

const RULE_STATUS = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive'
};

const RULR_CATE = {
    HEAD: 'Head',
    PM: 'PM',
    MEMBER: 'Member'
};

const RULE_TYPE = {
    MINUS: 'Minus',
    PLUS: 'Plus'
};

const RULES_STATUS_CODE = {
    ACTIVE: 1,
    DEACTIVE: 2
};

const itemActions = [
    {
        key: 0,
        label: 'Edit'
    },
    {
        key: 1,
        label: 'Active',
        status: RULE_STATUS.ACTIVE
    },
    {
        key: 2,
        label: 'Deactive',
        status: RULE_STATUS.INACTIVE
    }
];

// render badge for rule status
const statusColumRender = (Status) => (
    <Badge status={Status === RULE_STATUS.ACTIVE ? 'success' : 'error'} text={Status} />
);

// default status filter values
const statusFilterValues = [
    {
        text: RULE_STATUS.ACTIVE,
        value: '1'
    },
    {
        text: RULE_STATUS.INACTIVE,
        value: '2'
    }
];

// default category filter values
const categoryFilterValues = [
    {
        text: RULR_CATE.HEAD,
        value: RULR_CATE.HEAD
    },
    {
        text: RULR_CATE.PM,
        value: RULR_CATE.PM
    },
    {
        text: RULR_CATE.MEMBER,
        value: RULR_CATE.MEMBER
    }
];

// default ruleType filter values
const ruleTypeFilterValues = [
    {
        text: RULE_TYPE.MINUS,
        value: RULE_TYPE.MINUS
    },
    {
        text: RULE_TYPE.PLUS,
        value: RULE_TYPE.PLUS
    }
];

// custom antd card (See more)
const StyledCard = styled(Card)`
    .ant-card {
        box-shadow: none;
    }

    .ant-card-head {
        border-bottom: none;
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

function Rule() {
    const [page, setPage] = useState(PAGE_INDEX);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [sortQuery, setsortQuery] = useState('');
    const [categoryQuery, setCategoryQuery] = useState('');
    const [typeQuery, setTypeQuery] = useState('');
    const [modalModalSeeMore, setModalModalSeeMore] = useState(false);
    const [modalCreateRule, setModalCreateRule] = useState(false);
    const [modalImportRule, setModalImportRule] = useState(false);
    const [modalModalSeeMoreData, setModalModalSeeMoreData] = useState([]);
    const [data, setData] = useState({});
    const { xs, lg } = useBreakpoint();
    const { isHead } = useAuth();
    const { getTokenFormData, getTokenDownload, getToken } = useContext(GetTokenV2Context);
    const { DepartmentID, Code } = useSelector((state) => state.DepartmentSettingSlice);
    const [selectedRuleId, setSelectedRuleId] = useState(null);

    const [ruleData, setRefresh] = useRefreshToken(
        getRule,
        page,
        pageSize,
        sortQuery,
        search,
        categoryQuery,
        typeQuery,
        status
    );
    useEffect(() => {
        setData(ruleData);
    }, [ruleData]);

    const callbackSuccess = () => {
        setRefresh(new Date());
    };

    const handleDeactiveRule = (rule) => {
        let body = {
            Status: rule.Status === RULE_STATUS.ACTIVE ? RULES_STATUS_CODE.DEACTIVE : RULES_STATUS_CODE.ACTIVE
        };

        getToken(updateRuleStatus, 'Update success', callbackSuccess, null, body, rule.ID);
    };

    const showDeactiveConfirm = (rule) => {
        confirm({
            title: `Are you sure ${rule.Status === RULE_STATUS.ACTIVE ? 'deactive' : 'active'} this rule?`,
            icon: <ExclamationCircleFilled />,
            content: null,
            centered: true,
            okType: 'danger',
            className: 'custom-confirm-styles',
            onOk() {
                handleDeactiveRule(rule);
            }
        });
    };

    const onClickDropDowmItem = (e, rule) => {
        switch (parseInt(e.key)) {
            case 0:
                setSelectedRuleId(rule.ID);
                setModalCreateRule(true);
                break;
            case 1:
            case 2:
                showDeactiveConfirm(rule);
                break;
            default:
                break;
        }
    };

    const getItemAction = (curStatus) => {
        return itemActions.filter((item) => item.status != curStatus);
    };

    const actionColumRender = (_, record) => {
        return (
            <div>
                <Dropdown
                    menu={{
                        items: getItemAction(record.Status),
                        onClick: (e) => onClickDropDowmItem(e, record)
                    }}
                    trigger={['click']}
                    placement="bottomRight"
                >
                    <MoreOutlined />
                </Dropdown>
            </div>
        );
    };

    // render see note for Note column
    const noteColumnRender = (_, record) =>
        record.Note ? (
            <a className={`brand-logo`} onClick={() => openModalSeeMore(record)}>
                {'See more'}
            </a>
        ) : (
            '-'
        );
    const integrateRender = (_, record) => (record.Integrate ? <CheckCircleTwoTone /> : '-');
    const synchronousRender = (_, record) => (record.Synchronize ? <CheckCircleTwoTone /> : '-');

    // setting colums of table
    const columns = [
        {
            title: 'No.',
            dataIndex: 'ID',
            key: 'ID',
            width: 50,
            align: 'center',
            render: (id, record, index) => TABLE.COLUMN.RENDER_INDEX(id, record, index, page, pageSize)
        },
        {
            title: 'Rules',
            dataIndex: 'RuleName',
            key: 'RuleName',
            width: '25%'
        },
        {
            title: 'Category',
            dataIndex: 'Category',
            key: 'Category',
            align: 'center',
            filters: categoryFilterValues,
            filterMultiple: false
        },
        {
            title: 'Type',
            dataIndex: 'RuleType',
            key: 'RuleType',
            align: 'center',
            filters: ruleTypeFilterValues,
            filterMultiple: false
        },
        {
            title: 'Synchronous',
            dataIndex: 'Synchronous',
            align: 'center',
            render: synchronousRender
        },
        {
            title: 'Integrate',
            dataIndex: 'Integrate',
            align: 'center',
            render: integrateRender
        },
        {
            title: 'Point',
            dataIndex: 'Point',
            key: 'PointNumber',
            align: 'center',
            sorter: true,
            sortDirections: ['ascend', 'descend']
        },
        {
            title: 'Note',
            dataIndex: 'Note',
            key: 'Note',
            align: 'center',
            width: 100,
            render: noteColumnRender
        },
        {
            title: 'Status',
            dataIndex: 'Status',
            key: 'Status',
            align: 'center',
            render: statusColumRender,
            filters: statusFilterValues,
            filterMultiple: false
        },
        {
            title: 'Action',
            dataIndex: 'ID',
            align: 'center',
            width: 50,
            hidden: !isHead,
            render: actionColumRender
        }
    ];

    const handleAfterChangeSearch = (value) => {
        setPage(PAGE_INDEX);
        setSearch(value);
    };

    // open modal see more
    const openModalSeeMore = (record) => {
        setModalModalSeeMoreData(record);
        setModalModalSeeMore(true);
    };

    /**
     * Trigger event table change
     * @param {*} pagination { current, pageSize, total, showSizeChanger }
     * @param {*} filters { Status[...], Category[...], RuleType[...] }
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

        if (filters.Category) {
            setCategoryQuery(filters.Category[0]);
        } else {
            setCategoryQuery('');
        }

        if (filters.RuleType) {
            setTypeQuery(filters.RuleType[0]);
        } else {
            setTypeQuery('');
        }

        // sort
        let order = sorter.order;
        let sortName = sorter.columnKey;
        if (order) {
            setsortQuery(sortName + ':' + (order === 'ascend' ? 'ASC' : 'DESC'));
        } else {
            setsortQuery('');
        }
    };

    const handleAddRule = () => {
        setModalCreateRule(true);
    };

    const handleImport = (file) => {
        setModalImportRule(false);

        const formData = new FormData();
        formData.append('file', file);

        getTokenFormData(uploadRuleExcel, 'Import success', success, null, formData, DepartmentID);
    };

    const success = () => {
        setRefresh(new Date());
    };

    const handleExport = () => {
        const exportFileName = `${Code}_rules_${moment(new Date()).format('YYYY_MM_DD_HH_mm')}`;
        getTokenDownload(
            exportRule,
            exportFileName,
            DepartmentID,
            page,
            pageSize,
            sortQuery,
            search,
            categoryQuery,
            typeQuery,
            status
        );
    };

    return (
        <div style={{ margin: '1rem 2.5rem' }}>
            <Row>
                <Col xs={24} md={12} style={{ marginBottom: '1rem' }}>
                    <Title style={{ lineHeight: 1.1, margin: 0 }} level={3}>
                        Rules List
                    </Title>
                    <Text className="sub-title">Rules that the department sets on reward and punishment</Text>
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
                        <SearchInput afterChange={handleAfterChangeSearch} style={{ width: xs ? '100%' : 250 }} />
                        {isHead && (
                            <Space>
                                <Button type="primary" onClick={handleAddRule}>
                                    Add Rule
                                </Button>
                                <Button type="primary" onClick={debounce(handleExport, 500)}>
                                    Export
                                </Button>
                                <Button type="primary" onClick={() => setModalImportRule(true)}>
                                    Import
                                </Button>
                            </Space>
                        )}
                    </Space>
                </Col>
            </Row>

            {/* Table List */}
            <Table
                bordered
                style={{ borderRadius: 0 }}
                rowKey={(record) => record.ID}
                columns={columns.filter((col) => !col.hidden)}
                dataSource={data ? data.ruleData : []}
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
                    title={modalModalSeeMoreData.RuleName}
                    bordered={false}
                    style={{ width: 520, boxShadow: 'none' }}
                >
                    <p>{modalModalSeeMoreData.Note}</p>
                </StyledCard>
            </Modal>
            <Modal
                title={selectedRuleId ? 'Update rule' : 'Create rule'}
                centered
                open={modalCreateRule}
                footer={null}
                width={750}
                onCancel={() => setModalCreateRule(false)}
                afterClose={() => {
                    setSelectedRuleId(null);
                    setModalImportRule(false);
                }}
                destroyOnClose
            >
                <CreateRule ruleId={selectedRuleId} setRefresh={setRefresh} setModalState={setModalCreateRule} />
            </Modal>
            <Modal
                title="Import Rule"
                centered
                open={modalImportRule}
                footer={null}
                width={500}
                onCancel={() => setModalImportRule(false)}
            >
                <ImportFile onFinish={handleImport} />
            </Modal>
        </div>
    );
}

export default Rule;
