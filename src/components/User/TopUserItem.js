import { RightOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Image, Modal, Row, Space, Tag, Tooltip, Typography } from 'antd';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { imgServer } from '../../dataConfig';
import formatNumber from '../../utils/formatNumber';
import { DividerVector, FifthIcon, FirstIcon, FourthIcon, SecondIcon, TagVector, ThirdIcon } from '../Icons';
import LeaderboardDetailBadge from './LeaderboardDetailBadge';
import LeaderboardVote from './LeaderboardVote';

const { Text, Title } = Typography;
const badgeStyle = {
    position: 'relative'
};
const imageBadgeStyle = {
    opacity: 0.3,
    borderRadius: '50%',
    background: '#000'
};
const badgeMoreStyle = {
    position: 'absolute',
    color: '#fff',
    fontWeight: 700,
    fontSize: 20,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '1rem'
};

const TextLink = styled(Text)`
    & {
        font-size: 18px;
        font-weight: 600;
        cursor: default;
    }

    &.text-underline {
        &:hover {
            text-decoration: underline;
            cursor: pointer;
        }
    }
`;

function IconIndex({ index }) {
    return (
        <>
            {index === 1 && <FirstIcon />}
            {index === 2 && <SecondIcon />}
            {index === 3 && <ThirdIcon />}
            {index === 4 && <FourthIcon />}
            {index === 5 && <FifthIcon />}
        </>
    );
}

function TopUserItem({ user, numWidthCard, setRefreshLeaderboard, pointName }) {
    const history = useHistory();
    const [modalDetailBadge, setModalDetailBadge] = useState(false);
    const [modalVote, setModalVote] = useState(false);
    const [isDataChange, setDataChange] = useState(false);
    const isAuthorized = Boolean(parseInt(localStorage.getItem('deptAuth'))) || false;

    const handleModalDetailBadge = () => {
        setModalDetailBadge(true);
    };

    const handleModalVote = () => {
        setModalVote(true);
    };

    const redirectToPage = (path) => {
        history.push(path);
    };

    return (
        <>
            <Col flex={`${numWidthCard}px`}>
                <Card
                    className={user.index === 1 ? 'card-custom card-selected' : 'card-custom'}
                    style={{
                        marginTop: user.index === 1 ? 'auto' : user.index === 2 || user.index === 3 ? '2rem' : '4rem'
                    }}
                    title={
                        <div className={`card-title-top card-title-top-${user.index}`}>
                            <div>
                                <Avatar
                                    style={{ border: '4px solid rgba(255, 255, 255, 0.6)', lineHeight: '46px' }}
                                    size={56}
                                    src={`${imgServer}${user.avatar}`}
                                    icon={<UserOutlined />}
                                />
                            </div>
                            <div>
                                <div style={{ textAlign: 'end' }}>
                                    <IconIndex index={user.index}></IconIndex>
                                </div>
                                <Space>
                                    <Title style={{ color: '#fff' }} level={3}>
                                        {formatNumber(user.point_per_day, 0)}
                                    </Title>
                                    <Title style={{ color: '#fff' }} level={5}>
                                        {pointName ? `${pointName.toLowerCase()}s` : ''}/day
                                    </Title>
                                </Space>
                            </div>
                        </div>
                    }
                >
                    <Space direction="vertical" style={{ width: '100%', padding: '1rem 0' }}>
                        <Space direction="vertical" style={{ padding: '0 1rem' }}>
                            <TextLink
                                className={isAuthorized ? 'text-underline' : ''}
                                onClick={() => isAuthorized && redirectToPage(`/profile/${user.ID}`)}
                            >
                                {user.DisplayName}
                            </TextLink>
                            <Tag
                                style={{ padding: '0.15rem 0.5rem', borderRadius: 16 }}
                                color="#EAE6FD"
                                icon={<TagVector />}
                            >
                                <Text strong style={{ color: '#321B85' }}>
                                    {user.user_nickname}
                                </Text>
                            </Tag>
                            <Text
                                style={isAuthorized && { cursor: 'pointer' }}
                                onClick={() => isAuthorized && handleModalVote()}
                            >
                                {user.total_nickname && user.total_nickname > 0 ? (
                                    <span>{user.total_nickname - 1} other nickname</span>
                                ) : (
                                    <span>0 other nickname</span>
                                )}
                                <RightOutlined style={{ width: 10, marginLeft: 4 }} />
                            </Text>
                        </Space>
                        <DividerVector className="custom-divider" style={{ paddingTop: '1rem' }} />
                        <Space direction="vertical" style={{ padding: '0 1rem', width: '100%' }}>
                            <Text style={{ fontWeight: 600 }}>Medals</Text>
                            <Row style={{ justifyContent: 'space-evenly' }}>
                                {user.badges_slot.map((item, i) => (
                                    <Col key={i} flex={`50px`}>
                                        {item && (
                                            <Tooltip color="#321B85" title={JSON.parse(item).description}>
                                                <div style={badgeStyle}>
                                                    <Image
                                                        style={
                                                            user.more_slot > 0 && i === user.badges_slot.length - 1
                                                                ? imageBadgeStyle
                                                                : {}
                                                        }
                                                        height={50}
                                                        width={50}
                                                        key={i}
                                                        src={`${imgServer}${JSON.parse(item).url}`}
                                                        preview={false}
                                                    />
                                                    {user.more_slot > 0 && i === user.badges_slot.length - 1 && (
                                                        <div
                                                            style={{ ...badgeMoreStyle, cursor: 'pointer' }}
                                                            onClick={() => handleModalDetailBadge()}
                                                        >
                                                            +{user.more_slot}
                                                        </div>
                                                    )}
                                                </div>
                                            </Tooltip>
                                        )}
                                    </Col>
                                ))}
                            </Row>
                        </Space>
                    </Space>
                </Card>
            </Col>
            <Modal
                title="See All Medals"
                centered
                width={600}
                open={modalDetailBadge}
                onCancel={() => setModalDetailBadge(false)}
                footer={false}
                destroyOnClose={true}
            >
                <LeaderboardDetailBadge user={user}></LeaderboardDetailBadge>
            </Modal>
            <Modal
                title="See All Nicknames"
                centered
                width={600}
                open={modalVote}
                onCancel={() => setModalVote(false)}
                footer={false}
                afterClose={() => {
                    isDataChange && setRefreshLeaderboard(new Date());
                    setDataChange(false);
                }}
                destroyOnClose={true}
            >
                <LeaderboardVote user={user} setDataChange={setDataChange}></LeaderboardVote>
            </Modal>
        </>
    );
}

export default TopUserItem;
