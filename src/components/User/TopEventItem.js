import { UserOutlined } from '@ant-design/icons';
import { Col, Typography, Card, Avatar, Row, Tooltip } from 'antd';
import { imgServer } from '../../dataConfig';
import formatNumber from '../../utils/formatNumber';
import { RisingStarIcon, TopMinusIcon, TopPlusIcon } from '../Icons';

const { Text } = Typography;
const { Meta } = Card;
const itemCardStyle = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between'
};

function IconIndex({ index, ...prop }) {
    return (
        <>
            {index === 0 && <TopPlusIcon {...prop} />}
            {index === 1 && <TopMinusIcon {...prop} />}
            {index === 2 && <RisingStarIcon {...prop} />}
        </>
    );
}

function TopEventItem({ indexPos, event, numWidthCard }) {
    return (
        <Col flex={`${numWidthCard}px`}>
            <Tooltip overlayStyle={{ maxWidth: numWidthCard }} color="#321B85" title={event.tooltip}>
                <Card hoverable>
                    <Row>
                        <div style={itemCardStyle}>
                            <Meta
                                className="card-meta"
                                avatar={
                                    <Avatar size={44} src={`${imgServer}${event.avatar}`} icon={<UserOutlined />} />
                                }
                                title={
                                    <div style={{ marginBottom: '0.25rem' }}>
                                        {event.eventName}
                                        <IconIndex style={{ marginLeft: '0.25rem' }} index={indexPos} />
                                    </div>
                                }
                                description={event.Account ? event.Account : '---'}
                            />
                            <div>
                                <Text style={{ wordBreak: 'unset', fontWeight: 600, fontSize: 22 }} strong>
                                    {formatNumber(event[event.key], '---')}
                                </Text>
                            </div>
                        </div>
                    </Row>
                </Card>
            </Tooltip>
        </Col>
    );
}

export default TopEventItem;
