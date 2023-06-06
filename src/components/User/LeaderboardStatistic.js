import { Row } from 'antd';
import TopEventItem from './TopEventItem';
import TopUserItem from './TopUserItem';
import * as _ from 'lodash';

function LeaderboardStatistic({ ...prop }) {
    const unitPoint = `${prop.pointName ? prop.pointName.toLowerCase() : ''}`;

    const handleEventsData = (events) => {
        if (!events) return [];

        return events.map((item, i) => {
            switch (i) {
                case 0:
                    item.key = 'top_plus';
                    item.eventName = 'Top Plus';
                    item.tooltip = `Employee who got the most plus ${unitPoint}s`;
                    break;
                case 1:
                    item.key = 'top_minus';
                    item.eventName = 'Top Minus';
                    item.tooltip = `Employee who got the most minus ${unitPoint}s`;
                    break;
                case 2:
                    item.key = 'risingstar';
                    item.eventName = 'Rising Star';
                    item.tooltip = 'Employee who climbed the most ranks';
                    break;
                default:
                    break;
            }

            return item;
        });
    };

    const handleSortedUsersData = (users) => {
        if (!users) return [];

        let sortedUsers = [];
        const countUser = users.length;

        switch (countUser) {
            case 5:
                sortedUsers.push({ ...users[3], index: 4 });
                sortedUsers.push({ ...users[1], index: 2 });
                sortedUsers.push({ ...users[0], index: 1 });
                sortedUsers.push({ ...users[2], index: 3 });
                sortedUsers.push({ ...users[4], index: 5 });
                break;
            case 3:
                sortedUsers.push({ ...users[1], index: 2 });
                sortedUsers.push({ ...users[0], index: 1 });
                sortedUsers.push({ ...users[2], index: 3 });
                break;
            case 1:
                sortedUsers.push({ ...users[0], index: 1 });
                break;
            default:
                break;
        }

        return sortedUsers;
    };

    const topUserData = handleSortedUsersData(prop.data.LeaderBoardTop);
    const topEventData = handleEventsData(prop.data.listTop);

    const calcDisplayBadge = (countUser) => {
        return countUser >= 5 ? 4 : countUser === 3 ? 5 : 7;
    };

    const handleUsersFormatBadgeSlot = (user) => {
        let results = [];
        const badges = user.badge_names ? user.badge_names.split('|') : [];
        const displayBadge = calcDisplayBadge(topUserData.length);

        for (let i = 0; i < displayBadge; i++) {
            results.push(badges[i] ? badges[i] : null);
        }

        return {
            ...user,
            badges_slot: results,
            badges_total: badges.length,
            more_slot: badges.length - displayBadge
        };
    };

    const calcWidthCard = (countUser) => {
        return countUser >= 5 ? 280 : countUser === 3 ? 350 : 450;
    };

    return (
        <div style={{ margin: '7rem 0 3rem 0' }}>
            <Row style={{ margin: '0 2rem 2rem 2rem', gap: 24 }} justify="center">
                {topUserData.map((user, i) => (
                    <TopUserItem
                        key={i}
                        user={handleUsersFormatBadgeSlot(user)}
                        numWidthCard={calcWidthCard(topUserData.length)}
                        setRefreshLeaderboard={prop.setRefreshLeaderboard}
                        pointName={prop.pointName}
                    />
                ))}
            </Row>
            <Row style={{ gap: 24 }} justify="center">
                {topEventData.map((event, i) => (
                    <TopEventItem key={i} indexPos={i} event={event} count={topEventData.length} numWidthCard={290} />
                ))}
            </Row>
        </div>
    );
}

export default LeaderboardStatistic;
