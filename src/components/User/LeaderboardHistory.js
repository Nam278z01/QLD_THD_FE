import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Input, Row, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { PAGE_INDEX, PAGE_SIZE, PAGE_SIZE_OPTIONS_TABLE } from '../../constants/pagination';
import { imgServer } from '../../dataConfig';
import useRefreshToken from '../../Hook/useRefreshToken';
import { getHistory } from '../../services/RequestAPI';
import formatNumber from '../../utils/formatNumber';
import SearchInput from '../SearchInput';

const requestType = [
    { type: 1, name: 'Request' },
    { type: 2, name: 'Import' },
    { type: 3, name: 'Intergrate' },
    { type: 4, name: 'Synchronous' },
    { type: 5, name: 'Api' }
];

function LeaderboardHistory({ ...prop }) {
    const user = prop.user;
    const [keyword, setKeyword] = useState(null);
    const [pageIndex, setPageIndex] = useState(PAGE_INDEX);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const year = prop.year;
    const month = prop.month;
    const [histories, setHistories] = useState({ historyData: [], totalItems: 0 });
    const pointColumnRender = (_, record) => <div>{formatNumber(record.PointOfRule, 0)}</div>;
    const methodColumnRender = (_, record) => (
        <div>{record.RequestType && requestType.find((item) => item.type == record.RequestType).name}</div>
    );

    const columns = [
        {
            title: 'Created Date',
            dataIndex: 'CreatedDate',
            width: 150,
            align: 'center'
        },
        {
            title: 'Month',
            dataIndex: 'Month',
            width: 50,
            align: 'center'
        },
        {
            title: 'Year',
            dataIndex: 'Year',
            width: 50,
            align: 'center'
        },
        {
            title: 'Project',
            dataIndex: 'ProjectName',
            width: 120,
            align: 'center'
        },
        {
            title: 'Rule',
            dataIndex: 'Name',
            align: 'center'
        },
        {
            title: 'Created by',
            dataIndex: 'CreatedBy',
            width: 120,
            align: 'center'
        },
        {
            title: 'Method',
            dataIndex: 'RequestType',
            align: 'center',
            render: methodColumnRender
        },
        {
            title: `${prop.pointName ? prop.pointName : 'Point'}`,
            dataIndex: 'PointOfRule',
            width: 80,
            align: 'center',
            render: pointColumnRender
        },
        {
            title: 'Times',
            dataIndex: 'Times',
            align: 'center',
            width: 50
        },
        {
            title: 'Note',
            dataIndex: 'Comment',
            align: 'center',
            width: 120
        }
    ];

    const [data] = useRefreshToken(getHistory, month, year, pageIndex, pageSize, null, keyword, user.ID);

    useEffect(() => {
        if (data) {
            setHistories(data);
        }
    }, [data]);

    const handleAfterChangeSearch = (value) => {
        setKeyword(value);
    };

    const onTableChange = (pagination) => {
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
    };

    return (
        <div>
            <Row style={{ margin: '1.5rem 0' }}>
                <Col span={6}>
                    <Card className="card-unstyle" bordered={false}>
                        <Card.Meta
                            avatar={<Avatar size={44} src={`${imgServer}${user.avatar}`} icon={<UserOutlined />} />}
                            title={<div style={{ margin: 0 }}>{user.DisplayName}</div>}
                            description={user.Account}
                        />
                    </Card>
                </Col>
                <Col span={18} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <SearchInput afterChange={handleAfterChangeSearch} style={{ width: 250 }} />
                </Col>
            </Row>

            {/* Table List */}
            <Table
                bordered
                rowKey={(record) => record.Key + Math.random()}
                columns={columns}
                dataSource={histories.historyData}
                onChange={onTableChange}
                pagination={{
                    total: histories.totalItems,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: PAGE_SIZE_OPTIONS_TABLE,
                    showTotal: (total) => `Total ${total} items`
                }}
            />
        </div>
    );
}

export default LeaderboardHistory;
