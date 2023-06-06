import { UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Form, Input, Row, Typography, Badge, Space } from 'antd';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { imgServer } from '../../dataConfig';

const { Text } = Typography;

const lableFontWeight = { fontWeight: 600 };

function TransactionDetail({ ...pros }) {
    const { from, to, message, amount, createdDate } = pros.transData;
    const { CoinName } = useSelector((a) => a.DepartmentSettingSlice);

    return (
        <Row style={{ marginTop: '0.25rem' }}>
            {/* get css off form */}
            <Form>
                <Input hidden={true}></Input>
            </Form>
            {/* From */}
            <Col span={12}>
                <Space
                    direction="vertical"
                    style={{
                        display: 'flex'
                    }}
                >
                    <Text style={lableFontWeight}>From</Text>
                    <Card className="card-unstyle" bordered={false}>
                        <Card.Meta
                            avatar={
                                <Avatar
                                    size={44}
                                    src={`${imgServer}${from ? from.Avatar : ''}`}
                                    icon={<UserOutlined />}
                                />
                            }
                            title={<div style={{ marginBottom: '0.2rem' }}>{from ? from.DisplayName : ''}</div>}
                            description={<Text style={{ opacity: 0.6 }}>{from ? from.Account : ''}</Text>}
                        />
                    </Card>
                </Space>
            </Col>
            {/* To */}
            <Col span={12}>
                <Space
                    direction="vertical"
                    style={{
                        display: 'flex'
                    }}
                >
                    <Text style={lableFontWeight}>To</Text>
                    <Card className="card-unstyle" bordered={false}>
                        <Card.Meta
                            avatar={
                                <Avatar size={44} src={`${imgServer}${to ? to.Avatar : ''}`} icon={<UserOutlined />} />
                            }
                            title={<div style={{ marginBottom: '0.2rem' }}>{to ? to.DisplayName : ''}</div>}
                            description={<Text style={{ opacity: 0.6 }}>{to ? to.Account : ''}</Text>}
                        />
                    </Card>
                </Space>
            </Col>
            {/* Status */}
            <Col span={24} style={{ marginTop: '1rem' }}>
                <Space
                    direction="vertical"
                    style={{
                        display: 'flex'
                    }}
                >
                    <Text style={lableFontWeight}>Status</Text>
                    <Text className="ant-input ant-input-disabled" style={{ display: 'flex' }}>
                        <Space>
                            <Badge color="green" />
                            <span className="text-secondary">Success</span>
                        </Space>
                    </Text>
                </Space>
            </Col>
            {/* Point */}
            <Col span={24} style={{ marginTop: '1rem' }}>
                <Space
                    direction="vertical"
                    style={{
                        display: 'flex'
                    }}
                >
                    <Text style={lableFontWeight}>{CoinName}</Text>
                    <Text className="text-secondary ant-input ant-input-disabled">
                        {amount ? amount : '---'} {CoinName}
                    </Text>
                </Space>
            </Col>
            {/* Date */}
            <Col span={24} style={{ marginTop: '1rem' }}>
                <Space
                    direction="vertical"
                    style={{
                        display: 'flex'
                    }}
                >
                    <Text style={lableFontWeight}>Date</Text>
                    <Text className="text-secondary ant-input ant-input-disabled">
                        {createdDate ? moment(new Date(createdDate)).format('DD/MM/YYYY HH:mm') : '---'}
                    </Text>
                </Space>
            </Col>
            {/* Message */}
            <Col span={24} style={{ marginTop: '1rem' }}>
                <Space
                    direction="vertical"
                    style={{
                        display: 'flex'
                    }}
                >
                    <Text style={lableFontWeight}>Message</Text>
                    <Text className="text-secondary  ant-input ant-input-disabled">
                        {message ? message : 'No messege'}
                    </Text>
                </Space>
            </Col>
        </Row>
    );
}

export default TransactionDetail;
