import { Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useRefreshToken from '../../Hook/useRefreshToken';
import { PAGE_INDEX, PAGE_SIZE, PAGE_SIZE_OPTIONS_TABLE } from '../../constants/pagination';
import { TABLE } from '../../constants/table';
import { getMyRequest } from '../../services/RequestAPI';
import EditRequest from './EditRequest';
import ViewRequest from './ViewRequest';

function PMRequestList({ ...prop }) {
    const { searchQuery } = { ...prop };
    const [page, setPage] = useState(PAGE_INDEX);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [status, setStatus] = useState('');
    const [sortQuery, setsortQuery] = useState('');
    const { userID } = useSelector((state) => state.UserSlice);
    const [data, setData] = useState({});
    const [modalViewRequest, setModalViewRequest] = useState(false);
    const [modalEditRequest, setModalEditRequest] = useState(false);
    const [requestData, setRequestData] = useState(null);
    const [editAble, setEditAble] = useState(false);
    const query = new URLSearchParams(window.location.search);
    const refreshPage = query.get('refreshPage');
    const { PointName } = useSelector((a) => a.DepartmentSettingSlice);
    // get data from api [getMyRequest]
    const [myRequestData, setRefresh] = useRefreshToken(
        getMyRequest,
        page,
        pageSize,
        sortQuery,
        searchQuery,
        status,
        userID
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
                if (record.StatusID == 1) setEditAble(true);
                else setEditAble(false);

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
        </div>
    );
}

export default PMRequestList;
