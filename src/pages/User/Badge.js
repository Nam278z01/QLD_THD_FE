import { ExclamationCircleFilled, GiftOutlined, MoreOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Badge, Button, Col, Divider, Dropdown, Grid, Image, Input, Modal, Row, Space, Table, Typography } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import useAuth from '../../Hook/useAuth';
import useRefreshToken from '../../Hook/useRefreshToken';
import SearchInput from '../../components/SearchInput';
import CreateBadge from '../../components/User/CreateBadge';
import { PAGE_INDEX, PAGE_SIZE, PAGE_SIZE_OPTIONS_TABLE } from '../../constants/pagination';
import { TABLE } from '../../constants/table';
import { GetTokenV2Context } from '../../context/GetTokenV2Context';
import { getExcelBadge } from '../../services/ExportAPI';
import moment from 'moment';
import ImportFile from '../../components/ImportFile';
import { uploadBadgeExcel } from '../../services/ImportAPI';
import { useSelector } from 'react-redux';
import { getAllHistoryBadge } from '../../services/UsermasterAPI';
import { Status, imgServer } from '../../dataConfig';
import { getAllBadgeWithPage, updateBadgeV2 } from '../../services/BadgeAPI';
import BadgeSchedule from '../../components/User/BadgeSchedule';
import debounce from 'lodash/debounce';
import { getFileDownLoadBadgeHistory } from '../../services/ExportAPI';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;
const { confirm } = Modal;

const BADGES_STATUS = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive'
};

const BADGES_STATUS_CODE = {
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
        status: BADGES_STATUS_CODE.ACTIVE
    },
    {
        key: 2,
        label: 'Deactive',
        status: BADGES_STATUS_CODE.DEACTIVE
    },
    {
        key: 3,
        label: 'Update to auto',
        awardtype: 'auto'
    },
    {
        key: 4,
        label: 'Schedule',
        awardtype: 'manual'
    }
];

const statusFilterValues = [
    {
        text: BADGES_STATUS.ACTIVE,
        value: '1'
    },
    {
        text: BADGES_STATUS.INACTIVE,
        value: '2'
    }
];

function Badges() {
    const [page, setPage] = useState(PAGE_INDEX);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [pageModalAwardManual, setPageModalAwardManual] = useState(PAGE_INDEX);
    const [pageSizeModalAwardManual, setPageSizeModalAwardManual] = useState(PAGE_SIZE);
    const [search, setSearch] = useState('');
    const [modalCreateBadge, setModalCreateBadge] = useState(false);
    const [modalAwardManual, setModalAwardManual] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [status, setStatus] = useState('');
    const [data, setData] = useState({});
    const { xs, lg } = useBreakpoint();
    const { isHead } = useAuth();
    const [selectedBagdeId, setSelectedBadgeId] = useState(null);
    const { getToken, getTokenDownload, getTokenFormData } = useContext(GetTokenV2Context);
    const [modalImportBadge, setModalImportBadge] = useState(false);
    const { DepartmentID, Code } = useSelector((a) => a.DepartmentSettingSlice);
    const [dataHistory, setDataHistory] = useState({});

    const [badgeData, setRefresh] = useRefreshToken(getAllBadgeWithPage, page, pageSize, search, status);

    useEffect(() => {
        setData(badgeData);
    }, [badgeData]);

    const callbackSuccess = () => {
        setRefresh(new Date());
    };

    const [dataBadgeHistory, setRefreshDataBadgeHistory] = useRefreshToken(getAllHistoryBadge);

    useEffect(() => {
        setDataHistory(dataBadgeHistory);
    }, [dataBadgeHistory]);

    const handleDeactiveBagde = (badge) => {
        let body = {
            Status:
                badge.Status === BADGES_STATUS_CODE.ACTIVE ? BADGES_STATUS_CODE.DEACTIVE : BADGES_STATUS_CODE.ACTIVE,
            RuleID: badge.RuleDefintionID
        };

        getToken(updateBadgeV2, 'Update success', callbackSuccess, null, body, badge.ID);
    };

    const handleUpdateBagdeToAuto = (badge) => {
        let body = {
            AwardType: 'auto',
            RuleID: badge.RuleDefintionID
        };

        getToken(updateBadgeV2, 'Update success', callbackSuccess, null, body, badge.ID);
    };

    const showDeactiveConfirm = (badge) => {
        confirm({
            title: `Are you sure ${badge.Status === BADGES_STATUS_CODE.ACTIVE ? 'deactive' : 'active'}  this medal?`,
            icon: <ExclamationCircleFilled />,
            content: null,
            centered: true,
            okType: 'danger',
            className: 'custom-confirm-styles',
            onOk() {
                handleDeactiveBagde(badge);
            }
        });
    };

    const showUpdateToAutoConfirm = (badge) => {
        confirm({
            title: `Are you sure update this medal to auto award?`,
            icon: <ExclamationCircleFilled />,
            content: null,
            centered: true,
            okType: 'danger',
            className: 'custom-confirm-styles',
            onOk() {
                handleUpdateBagdeToAuto(badge);
            }
        });
    };

    const onClickDropDowmItem = (e, badge) => {
        switch (parseInt(e.key)) {
            case 0:
                setSelectedBadgeId(badge.ID);
                setModalCreateBadge(true);
                break;
            case 1:
            case 2:
                showDeactiveConfirm(badge);
                break;
            case 3:
                showUpdateToAutoConfirm(badge);
                break;
            case 4:
                setSelectedBadgeId(badge.ID);
                setShowScheduleModal(true);
                break;
            default:
                break;
        }
    };

    const getItemAction = (curStatus, awardType) => {
        return itemActions.filter((item) => item.status != curStatus).filter((item) => item.awardtype != awardType);
    };

    const actionColumRender = (_, record) => {
        return (
            <div>
                <Dropdown
                    menu={{
                        items: getItemAction(record.Status, record.AwardType),
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
    // render badge for badges list status
    const statusColumRender = (status) => (
        <Badge status={status === 1 ? 'success' : 'error'} text={Status.NormalStatus[status - 1]} />
    );

    // render image for badges column
    const renderBadgesImg = (ImageURL, record, index) => (
        <Image height={70} key={index} width={70} src={`${imgServer}${record.ImageURL}`} preview={false} />
    );

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
            title: 'Medal',
            dataIndex: 'Badges',
            key: 'Badges',
            width: 100,
            align: 'center',
            render: renderBadgesImg
        },
        {
            title: 'Name',
            dataIndex: 'Name',
            key: 'Name',
            width: '10%',
            align: 'center'
        },
        {
            title: 'Description',
            dataIndex: 'Description',
            key: 'Description'
        },
        {
            title: 'Last time run',
            dataIndex: 'UpdatedDate',
            key: 'UpdatedDate',
            width: '10%',
            align: 'center',
            render: (UpdatedDate) => moment(new Date(UpdatedDate)).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'Award type',
            dataIndex: 'AwardType',
            key: 'AwardType',
            width: 120,
            align: 'center'
        },
        {
            title: 'Status',
            dataIndex: 'Status',
            key: 'Status',
            width: 100,
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

    /**
     * Trigger event table change
     * @param {*} pagination { current, pageSize, total, showSizeChanger }
     * @param {*} filters { Status[...] }
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
    };

    const onModalAwardManualTableChange = (pagination, filters, sorter, extra) => {
        // pagination
        setPageModalAwardManual(pagination.current);
        setPageSizeModalAwardManual(pagination.pageSize);
    };

    const handleAddBadge = () => {
        setModalCreateBadge(true);
    };

    const handleDownload = (URL, record) => {
        let exportFileName;
        let syncDownLoadType;
        if (URL === record.FileSuccessURL) {
            exportFileName = `MEDAL-IMPORT-FILE-SUCCESS-${record.ID}-${moment(new Date()).format('YYYY_MM_DD_HH_mm')}`;
            syncDownLoadType = 1;
        }
        if (URL === record.FileFailURL) {
            exportFileName = `MEDAL-IMPORT-FILE-FAIL-${record.ID}-${moment(new Date()).format('YYYY_MM_DD_HH_mm')}`;
            syncDownLoadType = 2;
        }
        getTokenDownload(getFileDownLoadBadgeHistory, exportFileName, record.ID, syncDownLoadType);
    };

    const downloadExcel = (URL, record) => {
        return (
            <Button
                type="primary"
                onClick={debounce(() => {
                    handleDownload(URL, record);
                }, 500)}
            >
                Download
            </Button>
        );
    };

    const modalAwardManualColums = [
        {
            title: 'Total Line',
            dataIndex: 'TotalLine',
            key: 'TotalLine'
        },
        {
            title: 'Number Line Fail',
            dataIndex: 'NumberLineFail',
            key: 'NumberLineFail'
        },
        {
            title: 'Number Line Success',
            dataIndex: 'NumberLineSuccess',
            key: 'NumberLineSuccess'
        },
        {
            title: 'File Fail',
            dataIndex: 'FileFailURL',
            key: 'FileFailURL',
            render: downloadExcel
        },
        {
            title: 'File Success',
            dataIndex: 'FileSuccessURL',
            key: 'FileSuccessURL',
            render: downloadExcel
        },
        {
            title: 'Created By',
            dataIndex: 'CreatedBy',
            key: 'CreatedBy'
        },
        {
            title: 'Created Date',
            dataIndex: 'CreatedDate',
            key: 'CreatedDate'
        }
    ];

    const handleBadgeExport = () => {
        const exportFileName = `MEDAL-TEMPLATE_${moment(new Date()).format('YYYY_MM_DD_HH_mm')}`;
        getTokenDownload(getExcelBadge, exportFileName, DepartmentID);
    };

    const handleImport = (file) => {
        setModalImportBadge(false);

        const formData = new FormData();
        formData.append('file', file);

        getTokenFormData(uploadBadgeExcel, 'Import success', success, null, formData, DepartmentID);
    };

    const success = () => {
        setRefresh(new Date());
        setRefreshDataBadgeHistory(new Date());
    };

    return (
        <div style={{ margin: '1rem 2.5rem' }}>
            {/* Breadcrumb */}
            {/* <BreadcrumbApp/> */}

            {/* Filter */}
            <Row>
                <Col xs={24} md={12} style={{ marginBottom: '1rem' }}>
                    <Title style={{ lineHeight: 1.1, margin: 0 }} level={3}>
                        Medals List
                    </Title>
                    <Text className="sub-title">Medals that the department gives as rewards</Text>
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
                                <Button type="primary" onClick={() => setModalAwardManual(true)}>
                                    Award manual
                                </Button>
                                <Button type="primary" onClick={handleAddBadge}>
                                    Add Medal
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
                dataSource={data ? data.badges : []}
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
            {/* Modal Create or update Badge */}
            <Modal
                title={selectedBagdeId ? 'Update Medal' : 'Create Medal'}
                centered
                open={modalCreateBadge}
                footer={null}
                width={selectedBagdeId ? 800 : 500}
                onCancel={() => setModalCreateBadge(false)}
                afterClose={() => {
                    setSelectedBadgeId(null);
                    setModalCreateBadge(false);
                }}
                destroyOnClose
            >
                <CreateBadge bagdeId={selectedBagdeId} setRefresh={setRefresh} setModalState={setModalCreateBadge} />
            </Modal>
            {/* Modal Create or update Badge Schedule */}
            <Modal
                title="Schedule"
                centered
                open={showScheduleModal}
                footer={null}
                onCancel={() => setShowScheduleModal(false)}
                afterClose={() => {
                    setSelectedBadgeId(null);
                    setShowScheduleModal(false);
                }}
                destroyOnClose
            >
                <BadgeSchedule badgeId={selectedBagdeId} setRefresh={setRefresh} setModalState={setShowScheduleModal} />
            </Modal>
            {/* Modal Award Manual Badge */}
            <Modal
                zIndex={0}
                title="Award Manual"
                centered
                open={modalAwardManual}
                footer={null}
                onCancel={() => setModalAwardManual(false)}
                afterClose={() => setModalAwardManual(false)}
                destroyOnClose
                width={xs ? '90%' : '60%'}
            >
                <Row justify="end">
                    <Space>
                        <Button type="primary" onClick={debounce(handleBadgeExport, 500)}>
                            Export
                        </Button>
                        <Button type="primary" onClick={() => setModalImportBadge(true)}>
                            Import
                        </Button>
                    </Space>
                </Row>
                <Row justify="center" style={{ marginBottom: '1rem' }}>
                    <Title style={{ lineHeight: 1.1, margin: 0 }} level={3}>
                        Medal Import History
                    </Title>
                </Row>
                <Table
                    bordered
                    style={{ borderRadius: 0 }}
                    rowKey={(record) => record.ID}
                    columns={modalAwardManualColums}
                    onChange={onModalAwardManualTableChange}
                    dataSource={dataHistory ? dataHistory : []}
                    pagination={{
                        total: dataHistory ? dataHistory.length : 0,
                        current: pageModalAwardManual,
                        pageSize: pageSizeModalAwardManual,
                        showSizeChanger: true,
                        pageSizeOptions: PAGE_SIZE_OPTIONS_TABLE,
                        showTotal: (total) => `Total ${total} items`
                    }}
                />
            </Modal>
            {/* Modal Import Badge */}
            <Modal
                zIndex={1}
                title="Import Medal"
                centered
                open={modalImportBadge}
                footer={null}
                width={500}
                onCancel={() => setModalImportBadge(false)}
            >
                <ImportFile onFinish={handleImport} />
            </Modal>
        </div>
    );
}

export default Badges;
