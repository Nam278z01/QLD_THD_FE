import { UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Image, Row, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { imgServer } from '../../dataConfig';
import useRefreshToken from '../../Hook/useRefreshToken';
import { getUserBadgeAll } from '../../services/BadgeAPI';

function LeaderboardDetailBadge({ ...prop }) {
    const user = prop.user;
    const [badges, setBadges] = useState(null);
    const [numBadge, setNumBadge] = useState(0);

    const renderBadgeIcon = (_, record) => {
        return <Image height={35} width={35} src={`${imgServer}${record.ImageURL}`} preview={false} />;
    };

    const columns = [
        {
            title: 'Badges',
            dataIndex: 'Name',
            width: 120,
            align: 'center',
            render: renderBadgeIcon
        },
        {
            title: 'Description',
            dataIndex: 'Description'
        }
    ];

    const [data] = useRefreshToken(getUserBadgeAll, user.ID);

    useEffect(() => {
        if (data) {
            setBadges(data);
            setNumBadge(data.length);
        }
    }, [data]);

    return (
        <div>
            <Row style={{ margin: '1.5rem 0' }}>
                <Col>
                    <Card className="card-unstyle" bordered={false}>
                        <Card.Meta
                            avatar={<Avatar size={44} src={`${imgServer}${user.avatar}`} icon={<UserOutlined />} />}
                            title={user.DisplayName}
                            description={`${numBadge} badges`}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Table List */}
            <Table
                bordered
                className="table-scroll-body"
                rowKey={(record) => record.IDLink}
                scroll={{ y: 250 }}
                columns={columns}
                dataSource={badges}
                pagination={false}
            />
        </div>
    );
}

export default LeaderboardDetailBadge;
