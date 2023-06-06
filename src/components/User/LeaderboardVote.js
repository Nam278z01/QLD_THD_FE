import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Input, Row, Space, Table, Typography } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GetTokenV2Context } from '../../context/GetTokenV2Context';
import { imgServer } from '../../dataConfig';
import useRefreshToken from '../../Hook/useRefreshToken';
import { createNickName, deleteNickname, findAllUserNickname, voteForNickname } from '../../services/NicknameAPI';
import { DeleteIcon, UnVoteIcon, VotedIcon } from '../Icons';

function LeaderboardVote({ ...prop }) {
    const user = prop.user;
    const [nickname, setNickname] = useState('');
    const [numNick, setNumNick] = useState('');
    const [newNickname, setNewNickname] = useState('');
    const { getToken } = useContext(GetTokenV2Context);
    const { userID } = useSelector((state) => state.UserSlice);
    
    const renderVoteColumn = (_, record) => {
        return (
            <Space>
                <div style={{ cursor: 'pointer' }} onClick={() => handleVoted(record.ID)}>
                    {record.voted ? <UnVoteIcon /> : <VotedIcon />}
                </div>
                <Typography.Text style={{ fontWeight: 600, fontSize: 16, marginBottom: 4, display: 'block' }}>
                    {`(${+record.total_vote})`}
                </Typography.Text>
            </Space>
        );
    };
    const renderActionColumn = (_, record) => {
        return (
            record.isAuthor && (
                <DeleteIcon style={{ cursor: 'pointer' }} onClick={() => handleDeleteNickname(record.ID)} />
            )
        );
    };
    const columns = [
        {
            title: 'Nickname',
            dataIndex: 'Name'
        },
        {
            title: 'Vote',
            dataIndex: 'total_vote',
            width: 100,
            align: 'center',
            render: renderVoteColumn
        },
        {
            title: 'Action',
            dataIndex: 'ID',
            width: 60,
            align: 'center',
            render: renderActionColumn
        }
    ];

    const [data, setRefresh] = useRefreshToken(findAllUserNickname, user.ID);

    useEffect(() => {
        if (data) {
            setNickname(data);
            setNumNick(data.length);
        }
    }, [data]);

    const handleCallbackSuccess = (isClearInputAdd = false) => {
        prop.setDataChange(true);
        setTimeout(() => {
            setRefresh(new Date());
        }, 500);
        isClearInputAdd && setNewNickname('');
    };

    const onNicknameInputChange = (event) => {
        setNewNickname(event.target.value);
    };

    const handleAddNickname = () => {
        const body = {
            UserMasterID: user.ID,
            Name: newNickname
        };
        getToken(createNickName, 'Add new nickname successfully!', handleCallbackSuccess(true), null, body);
    };

    const handleVoted = (nicknameId) => {
        const body = {
            UserMasterID: userID,
            NicknameID: nicknameId
        };
        getToken(voteForNickname, null, handleCallbackSuccess, null, body);
    };

    const handleDeleteNickname = (nicknameId) => {
        getToken(deleteNickname, 'Nickname has been delete', handleCallbackSuccess, null, nicknameId);
    };

    return (
        <div>
            <Row style={{ margin: '1.5rem 0' }}>
                <Col>
                    <Card className="card-unstyle" bordered={false}>
                        <Card.Meta
                            avatar={<Avatar size={44} src={`${imgServer}${user.avatar}`} icon={<UserOutlined />} />}
                            title={<div style={{ margin: 0 }}>{user.DisplayName}</div>}
                            description={`${numNick} nicknames`}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Table List */}
            <Table
                bordered
                style={{ marginBottom: '1.5rem' }}
                rowKey={(record) => record.ID}
                columns={columns}
                dataSource={nickname}
                pagination={false}
            />

            <Row gutter={12}>
                <Col span={20}>
                    <Input
                        value={newNickname}
                        onChange={onNicknameInputChange}
                        onPressEnter={handleAddNickname}
                        placeholder="Enter nickname"
                    />
                </Col>
                <Col span={4}>
                    <Button type="primary" style={{ width: '100%' }} onClick={handleAddNickname}>
                        Add
                    </Button>
                </Col>
            </Row>
        </div>
    );
}

export default LeaderboardVote;
