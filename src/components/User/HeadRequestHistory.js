import React from 'react';
import { PAGE_INDEX, PAGE_SIZE, PAGE_SIZE_OPTIONS_TABLE } from '../../constants/pagination';
import { Form, Modal, Table } from 'antd';
import { TABLE } from '../../constants/table';
import { getRequestHistory } from '../../services/RequestAPI';
import { useEffect } from 'react';
import useRefreshToken from '../../Hook/useRefreshToken';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import ViewRequest from './ViewRequest';

function HeadRequestHistory({ ...prop }) {
    const { searchQuery } = { ...prop };
    const [page, setPage] = useState(PAGE_INDEX);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [status, setStatus] = useState('');
    const [sortQuery, setsortQuery] = useState('');
    const { userID, role, account } = useSelector((a) => a.UserSlice);
    const [data, setData] = useState({});
    const [modalViewRequest, setModalViewRequest] = useState(false);
    const [modalEditRequest, setModalEditRequest] = useState(false);
    const [requestData, setRequestData] = useState(null);
    const query = new URLSearchParams(window.location.search);
    const refreshPage = query.get('refreshPage');
    const { PointName } = useSelector((a) => a.DepartmentSettingSlice);
    // get data from api [ getRequestHistory ]
    const [myRequestData, setRefresh] = useRefreshToken(
        getRequestHistory,
        page,
        pageSize,
        sortQuery,
        searchQuery,
        status,
        userID,
        account,
        role
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
            title: 'Created By',
            dataIndex: 'CreatedBy',
            key: 'CreatedBy',
            align: 'center'
        },
        {
            title: 'Confirm by',
            dataIndex: 'Confirmer',
            key: 'Confirmer',
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
            title: 'Total Point',
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
            title: 'Created Date',
            dataIndex: 'CreatedDate',
            key: 'CreatedDate',
            align: 'center',
            sorter: true,
            sortDirections: ['ascend', 'descend']
        },
        {
            title: 'Status',
            dataIndex: 'Status',
            key: 'Status',
            align: 'center',
            render: TABLE.COLUMN.REQUEST_RENDER_STATUS,
            filters: TABLE.COLUMN.REQUEST_STATUS_FILTER,
            filterMultiple: false
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

        // filter
        if (filters.Status) {
            setStatus(filters.Status[0]);
        } else {
            setStatus('');
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
    return (
        <div>
            {/* Table List */}
            <Table
                bordered
                style={{ borderRadius: 0 }}
                onRow={handleRowClick}
                rowKey={(record) => record.ID}
                columns={columns}
                dataSource={data ? data.history : []}
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
                    data={requestData}
                    editAble={false}
                    setRefresh={setRefresh}
                    handleSubmitform={handleSubmitform}
                    setModalViewRequest={setModalViewRequest}
                    setModalEditRequest={setModalEditRequest}
                />
            </Modal>
        </div>
    );
}

export default HeadRequestHistory;
