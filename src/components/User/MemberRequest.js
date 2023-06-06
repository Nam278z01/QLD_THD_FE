import { Badge, Col, Form, Modal, Row, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SearchInput from '../../components/SearchInput';
import EditRequest from '../../components/User/EditRequest';
import ViewRequest from '../../components/User/ViewRequest';
import { PAGE_INDEX, PAGE_SIZE, PAGE_SIZE_OPTIONS_TABLE } from '../../constants/pagination';
import { TABLE, statusColumRender } from '../../constants/table';
import useRefreshToken from '../../Hook/useRefreshToken';
import { getMyRequest } from '../../services/RequestAPI';
import { REQUEST_STATUS } from '../../constants/status';

const { Title } = Typography;

function MemberRequest() {
    const [page, setPage] = useState(PAGE_INDEX);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [search, setSearch] = useState('');
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
    const [form] = Form.useForm();
    // get data from api [getMyRequest]
    const [myRequestData, setRefresh] = useRefreshToken(
        getMyRequest,
        page,
        pageSize,
        sortQuery,
        search,
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
            title: PointName,
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

    const handleAfterChangeSearch = (value) => {
        setPage(PAGE_INDEX);
        setSearch(value);
    };

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
        <div style={{ margin: '1rem 2.5rem' }}>
            {/* Breadcrumb */}
            {/* <BreadcrumbApp/> */}

            {/* Filter */}
            <Row style={{ marginBottom: '1rem' }}>
                <Col span={20}>
                    <Title style={{ lineHeight: 1.1, margin: 0 }} level={3}>
                        My Request
                    </Title>
                </Col>
                <Col span={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                    <SearchInput afterChange={handleAfterChangeSearch} style={{ width: 250 }} />
                </Col>
            </Row>

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

export default MemberRequest;
