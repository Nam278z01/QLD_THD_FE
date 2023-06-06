import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    DownloadOutlined,
    ExclamationCircleOutlined,
    ImportOutlined
} from '@ant-design/icons';
import { Button, Col, Modal, Row, Space, Table } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useRefreshToken from '../../Hook/useRefreshToken';
import { PAGE_INDEX, PAGE_SIZE, PAGE_SIZE_OPTIONS_TABLE } from '../../constants/pagination';
import { TABLE } from '../../constants/table';
import { GetTokenV2Context } from '../../context/GetTokenV2Context';
import { getRequest, requestUpdateBulk } from '../../services/RequestAPI';
import EditRequest from './EditRequest';
import ViewRequest from './ViewRequest';
import ImportFile from '../ImportFile';
import { uploadPointExcelPM } from '../../services/ImportAPI';
import { getExcelPM } from '../../services/ExportAPI';
import moment from 'moment';
import debounce from 'lodash/debounce';

const { confirm } = Modal;

function PMRequestConfirm({ ...prop }) {
    const { searchQuery } = { ...prop };
    const [page, setPage] = useState(PAGE_INDEX);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [sortQuery, setsortQuery] = useState('');
    const [data, setData] = useState({});
    const [modalViewRequest, setModalViewRequest] = useState(false);
    const [modalEditRequest, setModalEditRequest] = useState(false);
    const [requestData, setRequestData] = useState(null);
    const [editAble, setEditAble] = useState(false);
    const query = new URLSearchParams(window.location.search);
    const refreshPage = query.get('refreshPage');
    const { PointName } = useSelector((a) => a.DepartmentSettingSlice);
    const { userID, role, account } = useSelector((a) => a.UserSlice);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const { getTokenDownload, getTokenFormData, getToken } = useContext(GetTokenV2Context);
    const { DepartmentID } = useSelector((a) => a.DepartmentSettingSlice);
    const [modalImportPoint, setModalImportPoint] = useState(false);
    // get data from api [ getRequest ]
    const [myRequestData, setRefresh] = useRefreshToken(
        getRequest,
        page,
        pageSize,
        sortQuery,
        searchQuery,
        role,
        userID,
        account
    );
    useEffect(() => {
        if (refreshPage !== null) {
            setRefresh(new Date());
        }
    }, [refreshPage]);
    useEffect(() => {
        setData(myRequestData);
    }, [myRequestData]);

    // setting colums of table
    const columns = [
        {
            title: '#',
            dataIndex: 'ID',
            key: 'ID',
            width: 50,
            align: 'center',
            render: (id, record, index) => TABLE.COLUMN.RENDER_INDEX(id, record, index, page, pageSize)
        },
        {
            title: 'Account',
            dataIndex: 'Account',
            key: 'Account',
            align: 'center'
        },
        {
            title: 'Approver',
            dataIndex: 'Approver',
            key: 'Approver',
            align: 'center'
        },
        {
            title: 'Project',
            dataIndex: 'ProjectName',
            key: 'ProjectName',
            align: 'center'
        },
        {
            title: 'Total ' + PointName,
            key: 'PointOfRule',
            dataIndex: 'PointOfRule',
            align: 'center',
            sorter: true,
            sortDirections: ['ascend', 'descend']
        },
        {
            title: 'Rule',
            dataIndex: 'Name',
            key: 'Name',
            width: '25%'
        },
        {
            title: 'Times',
            dataIndex: 'Times',
            key: 'Times',
            align: 'center',
            sorter: true,
            sortDirections: ['ascend', 'descend']
        },
        {
            title: 'Created Date',
            dataIndex: 'Date',
            key: 'Date',
            align: 'center',
            sorter: true,
            sortDirections: ['ascend', 'descend']
        },
        {
            title: 'Status',
            dataIndex: 'Status',
            key: 'Status',
            align: 'center',
            render: TABLE.COLUMN.REQUEST_RENDER_STATUS
        }
    ];

    const handleSubmitform = (data) => {};
    const handleEditRequest = (data) => {
        setModalEditRequest(true);
        setModalViewRequest(false);
    };

    const handleRowClick = (record, rowIndex) => {
        return {
            onClick: (event) => {
                setRequestData(record);
                setEditAble(true);

                setModalViewRequest(true);
            }
        };
    };
    /**
     * Trigger event table change
     * @param {*} pagination { current, pageSize, total, showSizeChanger }
     * @param {*} filters { Status[...]}
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
            if (sortName === 'Date') {
                sortName = 'CreatedDate';
            }
            setsortQuery(sortName + ':' + (order === 'ascend' ? 'ASC' : 'DESC'));
        } else {
            setsortQuery('');
        }
    };
    // handle select row
    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    // handle success after call api
    const success = () => {
        setRefresh(new Date());
        setSelectedRowKeys([]);
    };
    // handle approve selected request
    const handleApproveSelectedRequest = () => {
        const datasToSend = {
            PointID: selectedRowKeys,
            Status: role === 'Head' ? 3 : 2
        };

        getToken(requestUpdateBulk, 'Selected request has been approved', success, null, datasToSend, DepartmentID);
    };
    // handle reject selected request
    const handleRejectSelectedRequest = () => {
        confirm({
            title: 'Reject Selected Request',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure?',
            centered: true,
            onOk() {
                const datasToSend = {
                    PointID: selectedRowKeys,
                    Status: 4
                };

                getToken(
                    requestUpdateBulk,
                    'Selected request has been rejected',
                    success,
                    null,
                    datasToSend,
                    DepartmentID
                );
            }
        });
    };
    // handle import point
    const handleImport = (file) => {
        setModalImportPoint(false);

        const formData = new FormData();
        formData.append('file', file);

        getTokenFormData(uploadPointExcelPM, 'Import success', success, null, formData, DepartmentID);
    };
    // handle export template
    const handleExport = () => {
        const exportFileName = `PM-POINT-TEMPLATE(${moment(new Date()).format('DD-MM-YYYY')})`;
        getTokenDownload(getExcelPM, exportFileName, DepartmentID, page, pageSize, sortQuery);
    };
    return (
        <div>
            <Row>
                <Col span={12}>
                    <Row className="mb-2" hidden={selectedRowKeys.length < 1}>
                        <Space wrap>
                            <Button
                                onClick={handleApproveSelectedRequest}
                                type="primary"
                                shape="round"
                                icon={<CheckCircleOutlined />}
                                size="middle"
                            >
                                Confirm Selected
                            </Button>
                            <Button
                                onClick={handleRejectSelectedRequest}
                                type="primary"
                                danger
                                shape="round"
                                icon={<CloseCircleOutlined />}
                                size="middle"
                            >
                                Reject Selected
                            </Button>
                        </Space>
                    </Row>
                </Col>
                <Col span={12}>
                    <Row justify="end" className="mb-2">
                        <Space wrap>
                            <Button
                                onClick={debounce(handleExport, 500)}
                                type="primary"
                                shape="round"
                                icon={<DownloadOutlined />}
                                size="middle"
                            >
                                Download
                            </Button>
                            <Button
                                onClick={() => setModalImportPoint(true)}
                                type="primary"
                                shape="round"
                                icon={<ImportOutlined />}
                                size="middle"
                            >
                                Import
                            </Button>
                        </Space>
                    </Row>
                </Col>
            </Row>
            {/* Table List */}
            <Table
                bordered
                style={{ borderRadius: 0 }}
                onRow={handleRowClick}
                rowKey={(record) => record.ID}
                rowSelection={{
                    selectedRowKeys,
                    onChange: onSelectChange
                }}
                columns={columns}
                dataSource={data ? data.requestData : []}
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
            {/* Modal view request */}
            <Modal
                title={`See Request ${PointName}`}
                centered
                width={1000}
                open={modalViewRequest}
                onOk={() => {
                    setModalViewRequest(false);
                }}
                onCancel={() => {
                    setModalViewRequest(false);
                }}
                destroyOnClose={true}
                footer={null}
            >
                <ViewRequest
                    approveAble={true}
                    data={requestData}
                    editAble={editAble}
                    setRefresh={setRefresh}
                    handleSubmitform={handleSubmitform}
                    setModalViewRequest={setModalViewRequest}
                    setModalEditRequest={setModalEditRequest}
                />
            </Modal>
            {/* Modal edit request */}
            <Modal
                title={`Edit Request ${PointName}`}
                centered
                width={1000}
                open={modalEditRequest}
                onOk={() => {
                    setModalEditRequest(false);
                }}
                onCancel={() => {
                    setModalEditRequest(false);
                }}
                destroyOnClose={true}
                footer={null}
            >
                <EditRequest
                    data={requestData}
                    setRefresh={setRefresh}
                    handleSubmitform={handleSubmitform}
                    setModalEditRequest={setModalEditRequest}
                />
            </Modal>
            {/* Modal import point */}
            <Modal
                title="Import point"
                centered
                open={modalImportPoint}
                footer={null}
                width={500}
                onCancel={() => setModalImportPoint(false)}
            >
                <ImportFile onFinish={handleImport} />
            </Modal>
        </div>
    );
}

export default PMRequestConfirm;
