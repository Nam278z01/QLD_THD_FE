import { Badge, Modal, Table, Typography } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PAGE_INDEX, PAGE_SIZE, PAGE_SIZE_OPTIONS_TABLE } from '../../constants/pagination';
import { TABLE } from '../../constants/table';
import useRefreshToken from '../../Hook/useRefreshToken';
import { getShopHistoryList } from '../../services/ShopAPI';
import TransactionDetail from './TransactionDetail';

const { Text } = Typography;

function ShopHistory({ ...prop }) {
    const [modalTransDetail, setModalTransDetail] = useState(false);
    const [rowData, setRowData] = useState(false);
    const [page, setPage] = useState(PAGE_INDEX);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [data, setData] = useState({});
    const { userID } = useSelector((state) => state.UserSlice);

    // render amount
    const renderAmount = (TotalCoin, record, index) => (
        <Text type={TotalCoin < 0 ? 'danger' : 'success'}> {TotalCoin}</Text>
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
            title: 'Buy Date',
            dataIndex: 'CreatedDate',
            key: 'CreatedDate',
            width: '15%',
            align: 'center',
            render: (CreatedDate) => moment(new Date(CreatedDate)).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'Message',
            dataIndex: 'Message',
            key: 'Message'
        },
        {
            title: 'Amount',
            dataIndex: 'TotalCoin',
            key: 'TotalCoin',
            width: '10%',
            align: 'center',
            render: renderAmount
        },
        {
            title: 'Status',
            dataIndex: 'Status',
            key: 'Status',
            width: 100,
            align: 'center',
            render: () => <Badge status="success" text="Success" />
        }
    ];

    // get data from api [getShopHistoryList]
    const [shophistory, setRefresh] = useRefreshToken(getShopHistoryList, page, pageSize, userID);

    useEffect(() => {
        setData(shophistory ? shophistory : {});
    }, [shophistory]);

    useEffect(() => {
        if (prop.triggerRefresh) {
            setRefresh(new Date());
        }
    });

    useEffect(() => {
        prop.triggerRefresh && setRefresh(new Date());
    }, [prop.triggerRefresh]);
    // show detail data after click row
    const handleRowClick = (record, rowIndex) => {
        return {
            // click row
            onClick: (event) => {
                setRowData({
                    from: record.buyer,
                    to: record.saler,
                    message: record.Message,
                    createdDate: record.CreatedDate,
                    amount: record.TotalCoin
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
                rowKey={(record) => record.ID}
                onRow={handleRowClick}
                columns={columns}
                dataSource={data ? data.ShopData : []}
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

export default ShopHistory;
