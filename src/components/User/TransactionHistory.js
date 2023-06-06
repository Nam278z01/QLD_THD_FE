import { Badge, Modal, Table, theme, Typography } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PAGE_INDEX, PAGE_SIZE, PAGE_SIZE_OPTIONS_TABLE } from '../../constants/pagination';
import { TABLE } from '../../constants/table';
import useRefreshToken from '../../Hook/useRefreshToken';
import { getWallet } from '../../services/WalletAPI';
import TransactionDetail from './TransactionDetail';

const { Text } = Typography;

const TRANS_STATUS = {
    SUCCESS: 'Success',
    FAIL: 'Fail'
};

// render badge for request status
const statusColumRender = () => <Badge status={'success'} text={TRANS_STATUS.SUCCESS} />;

function TransactionHistory({ ...prop }) {
    const [modalTransDetail, setModalTransDetail] = useState(false);
    const [rowData, setRowData] = useState(false);
    const {
        token: { colorPrimary }
    } = theme.useToken();
    const [page, setPage] = useState(PAGE_INDEX);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const { userID } = useSelector((state) => state.UserSlice);
    const [data, setData] = useState({});

    // render amount
    const renderAmount = (CoinNumber, record, index) => (
        <Text type={record.CoinNumber < 0 ? 'danger' : 'success'}>{CoinNumber}</Text>
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
            title: 'Date',
            dataIndex: 'CreatedDate',
            key: 'CreatedDate',
            width: '15%',
            align: 'center',
            render: (CreatedDate) => moment(new Date(CreatedDate)).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'Transaction',
            dataIndex: 'Message',
            key: 'Message'
        },
        {
            title: 'Amount',
            dataIndex: 'CoinNumber',
            key: 'CoinNumber',
            align: 'center',
            render: renderAmount
        },
        {
            title: 'Status',
            dataIndex: 'Status',
            key: 'Status',
            width: 100,
            align: 'center',
            render: statusColumRender
        }
    ];

    // get data from api [getWallet]
    const [transHisData, setRefresh] = useRefreshToken(getWallet, userID, page, pageSize);

    useEffect(() => {
        setData(transHisData ? transHisData : {});
    }, [transHisData]);

    useEffect(() => {
        if (prop.triggerRefresh) {
            setRefresh(new Date());
        }
    });

    // show detail data after click row
    const handleRowClick = (record, rowIndex) => {
        return {
            // click row
            onClick: (event) => {
                setRowData({
                    from: record.Sender,
                    to: record.Receiver,
                    message: record.Message,
                    createdDate: record.CreatedDate,
                    amount: record.CoinNumber
                });
                setModalTransDetail(true);
            }
        };
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
    };

    return (
        <div>
            {/* Table List */}
            <Table
                rowClassName={'cursor-pointer'}
                bordered
                style={{ borderRadius: 0 }}
                onRow={handleRowClick}
                rowKey={(record) => record.ID}
                columns={columns}
                dataSource={data ? data.walletData : []}
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

            {/* Modal see detail transaction */}
            <Modal
                title={`Transaction ${moment(new Date(rowData.createdDate)).format('DD/MM/YYYY HH:mm')}`}
                centered
                width={554}
                open={modalTransDetail}
                onCancel={() => setModalTransDetail(false)}
                footer={[]}
                destroyOnClose={true}
            >
                <TransactionDetail transData={rowData} />
            </Modal>
        </div>
    );
}

export default TransactionHistory;
