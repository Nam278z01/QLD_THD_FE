import { Button, Col, Grid, Image, Modal, Row, Select, Space, Table, Tooltip, Typography } from 'antd';
import * as _ from 'lodash';
import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { PAGE_INDEX, PAGE_SIZE_OPTIONS_TABLE } from '../../constants/pagination';
import { GetTokenV2Context } from '../../context/GetTokenV2Context';
import { imgServer } from '../../dataConfig';
import useAuth from '../../Hook/useAuth';
import { exportLeaderboardData } from '../../services/LeaderBoardAPI';
import formatNumber from '../../utils/formatNumber';
import { ArrowDownIcon, ArrowUpIcon, HistoryIcon, Top1Icon, Top2Icon, Top3Icon } from '../Icons';
import SearchInput from '../SearchInput';
import LeaderboardDetailBadge from './LeaderboardDetailBadge';
import LeaderBoardHistory from './LeaderboardHistory';
import moment from 'moment';
import debounce from 'lodash/debounce';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;
const getYears = (yearList) => {
    return (
        yearList &&
        yearList
            .filter((item) => !!item)
            .map((item) => {
                return { value: item, label: item.toString() };
            })
    );
};
const getMonths = (year) => {
    let months = [];
    const curYear = new Date().getFullYear();
    const curMonth = new Date().getMonth() + 1;
    let minMonth = year === curYear ? curMonth : 12;

    months.push({ value: 0, label: `All` });
    for (let index = 0; index < minMonth; index++) {
        months.push({ value: index + 1, label: `${index + 1}` });
    }

    return months;
};
const arrowStyle = {
    marginTop: '0.25rem',
    marginLeft: '0.25rem'
};
const TextLink = styled(Text)`
    & {
        color: #101828;
        cursor: default;
    }

    &.text-underline {
        &:hover {
            text-decoration: underline;
            cursor: pointer;
        }
    }
`;

const TextSpecLink = styled(Text)`
    & {
        color: #101828;
    }

    &.top-link {
        color: #321b85;
        font-weight: 600;
    }

    &.text-underline {
        &:hover {
            text-decoration: underline;
            cursor: pointer;
        }
    }
`;

const RowGroup = styled(Row)`
    .ant-col {
        margin-bottom: 1rem;
    }

    .ant-col.sm {
        width: 100%;
    }

    .ant-col .select-group {
        display: flex;
        align-items: center;
    }

    .ant-col .select-group .select-label {
        margin-right: 0.5rem;
    }

    .ant-col .select-group .select-label.sm {
        min-width: 90px;
        margin-right: 0 !important;
    }

    .ant-col .select-group .ant-select {
        width: 120px;
    }

    .ant-col .select-group .ant-select.sm {
        width: 100%;
    }
`;
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
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '1rem'
};

function LeaderboardUserList({ ...prop }) {
    const history = useHistory();
    const [modalHistory, setModalHistory] = useState(false);
    const { isHead } = useAuth();
    const [userSelected, setUserSelected] = useState(null);
    const isAuthorized = Boolean(parseInt(localStorage.getItem('deptAuth'))) || false;
    const lbTops = prop.data.listTopID ? prop.data.listTopID : [];
    const unitPoint = `${prop.pointName ? prop.pointName.toLowerCase() : ''}`;
    const { xs, lg } = useBreakpoint();
    const [modalDetailBadge, setModalDetailBadge] = useState(false);
    const [user, setUser] = useState({});
    const { getTokenDownload } = useContext(GetTokenV2Context);

    const redirectToPage = (path) => {
        history.push(path);
    };
    const handleModalDetailBadge = (user) => {
        setUser(user);
        setModalDetailBadge(true);
    };
    const kperFilters = ['A+', 'A', 'B', 'C', 'D'].map((item) => ({ text: item, value: item }));
    const displayNameColumnRender = (_, record, index) => (
        <Space direction="vertical" size={0}>
            <Space style={{ fontSize: 16 }}>
                <TextSpecLink
                    onClick={() => isAuthorized && redirectToPage(`/profile/${record.ID}`)}
                    className={`${lbTops.includes(record.ID) ? 'top-link' : ''} ${
                        isAuthorized ? 'text-underline' : ''
                    }`}
                >
                    {record.DisplayName}
                </TextSpecLink>
                {prop.pageIndex === 1 && (
                    <>
                        <div>
                            {lbTops.find((item, i) => item === record.ID && i === 0) && <Top1Icon />}
                            {lbTops.find((item, i) => item === record.ID && i === 1) && <Top2Icon />}
                            {lbTops.find((item, i) => item === record.ID && i === 2) && <Top3Icon />}
                        </div>
                    </>
                )}
            </Space>
            <Text style={{ fontSize: 13, color: '#475467' }}>{record.Account}</Text>
        </Space>
    );
    const badgeColumnRender = (_, record, index) => (
        <Space>
            {record.badge_names &&
                record.badge_names
                    .split('|')
                    .slice(0, prop.maxBadge)
                    .map(
                        (item, i) =>
                            item && (
                                <Tooltip color="#321B85" key={i} title={JSON.parse(item)?.description}>
                                    <div style={badgeStyle}>
                                        <Image
                                            style={
                                                record.more_slot > 0 && i === prop.maxBadge - 1 ? imageBadgeStyle : {}
                                            }
                                            height={30}
                                            width={30}
                                            src={`${imgServer}${JSON.parse(item)?.url}`}
                                            preview={false}
                                        />
                                        {record.more_slot > 0 && i === prop.maxBadge - 1 && (
                                            <div
                                                style={{ ...badgeMoreStyle, cursor: 'pointer' }}
                                                onClick={() => handleModalDetailBadge(record)}
                                            >
                                                +{record.more_slot}
                                            </div>
                                        )}
                                    </div>
                                </Tooltip>
                            )
                    )}
        </Space>
    );
    const totalPointColumnRender = (_, record, index) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div>
                <Text>{formatNumber(record.total_point, 0)}</Text>
            </div>
            <div>
                {record.last_point > 0 && <ArrowUpIcon style={arrowStyle} />}
                {record.last_point < 0 && <ArrowDownIcon style={arrowStyle} />}
            </div>
        </div>
    );
    const pointPerDayColumnRender = (_, record) => <div>{formatNumber(record.point_per_day, 0)}</div>;
    const pointPlusColumnRender = (_, record) => <div>{formatNumber(record.point_plus, 0)}</div>;
    const pointMinusColumnRender = (_, record) => <div>{formatNumber(record.point_minus, 0)}</div>;
    const actionColumnRender = (_, record) => (
        <Space>
            <HistoryIcon style={{ cursor: 'pointer' }} onClick={() => handleOpenHistoryModal(record)} />
        </Space>
    );
    const columns = [
        {
            title: 'Rank',
            dataIndex: 'user_rank',
            width: 70,
            align: 'center'
        },
        {
            title: 'Kper',
            dataIndex: 'kper',
            width: 80,
            align: 'center',
            filters: kperFilters,
            filterMultiple: true,
            hidden: !prop.data.IsKper
        },
        {
            title: 'Employee',
            dataIndex: 'DisplayName',
            width: '25%',
            render: displayNameColumnRender
        },
        {
            title: 'Medals',
            dataIndex: 'badge_names',
            width: 180,
            render: badgeColumnRender
        },
        {
            title: `Total ${unitPoint}s`,
            dataIndex: 'total_point',
            width: 120,
            align: 'center',
            render: totalPointColumnRender
        },
        {
            title: 'Average per day',
            dataIndex: 'point_per_day',
            align: 'center',
            render: pointPerDayColumnRender
        },
        {
            title: `${_.upperFirst(unitPoint)} Plus`,
            dataIndex: 'point_plus',
            align: 'center',
            render: pointPlusColumnRender
        },
        {
            title: `${_.upperFirst(unitPoint)} Minus`,
            dataIndex: 'point_minus',
            align: 'center',
            render: pointMinusColumnRender
        },
        {
            title: 'Workdays',
            dataIndex: 'total_work',
            align: 'center'
        },
        {
            title: 'History',
            key: 'action',
            width: 80,
            align: 'center',
            hidden: !isAuthorized,
            render: actionColumnRender
        }
    ];

    const handleAfterChangeSearch = (value) => {
        prop.setPageIndex(PAGE_INDEX);
        prop.setKeyword(value);
    };

    const onYearChange = (event) => {
        prop.setYear(event);
    };

    const onMonthChange = (event) => {
        prop.setMonth(event);
    };

    const handleOpenHistoryModal = (user) => {
        setUserSelected(user);
        setModalHistory(true);
    };

    const onTableChange = (pagination, filters) => {
        prop.setPageIndex(pagination.current);
        prop.setPageSize(pagination.pageSize);
        prop.setKper(filters.kper ? filters.kper.toString() : '');
    };

    const handleRankExport = () => {
        const exportFileName = `${prop.departmentName}${prop.month ? '_' + prop.month : ''}_${
            prop.year
        }_ranking_${moment(new Date()).format('YYYY_MM_DD_HH_mm')}`;

        getTokenDownload(
            exportLeaderboardData,
            exportFileName,
            prop.departmentID,
            prop.userID,
            prop.year,
            prop.month,
            prop.keyword,
            prop.pageIndex,
            prop.pageSize,
            prop.kper
        );
    };
    return (
        <div style={{ margin: '0 5rem' }}>
            {/* Filter */}
            <Row>
                <Col xs={24} flex="none">
                    <Title style={{ lineHeight: 1.1 }} level={3}>
                        Rankingboard
                    </Title>
                </Col>
                <Col xs={24} flex="auto">
                    <RowGroup gutter={16} justify="end">
                        <Col className={xs && 'sm'}>
                            <div className="select-group">
                                <Text className={`select-label ${xs && 'sm'}`}>Select year</Text>
                                <Select
                                    className={xs && 'sm'}
                                    defaultValue={prop.year}
                                    options={getYears(prop.yearList)}
                                    onChange={onYearChange}
                                />
                            </div>
                        </Col>
                        <Col className={xs && 'sm'}>
                            <div className="select-group">
                                <Text className={`select-label ${xs && 'sm'}`}>Select month</Text>
                                <Select
                                    className={xs && 'sm'}
                                    defaultValue={prop.month}
                                    options={getMonths(prop.year)}
                                    onChange={onMonthChange}
                                />
                            </div>
                        </Col>
                        <Col className={xs && 'sm'}>
                            <SearchInput afterChange={handleAfterChangeSearch} style={{ width: xs ? '100%' : 250 }} />
                        </Col>
                        {isHead && (
                            <Col>
                                <Button type="primary" onClick={debounce(handleRankExport, 500)}>
                                    Export data
                                </Button>
                            </Col>
                        )}
                    </RowGroup>
                </Col>
            </Row>

            {/* Table List */}
            <Table
                bordered
                style={{ borderRadius: 0 }}
                rowKey={(record) => record.ID}
                columns={columns.filter((col) => !col.hidden)}
                dataSource={prop.data.LeaderBoard}
                onChange={onTableChange}
                pagination={{
                    total: prop.data.total,
                    current: prop.pageIndex,
                    pageSize: prop.pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: PAGE_SIZE_OPTIONS_TABLE,
                    showTotal: (total) => `Total ${total} items `
                }}
                sticky
                summary={() =>
                    prop.data.myrank && (
                        <Table.Summary fixed="top">
                            <Table.Summary.Row>
                                <Table.Summary.Cell align="center">{prop.data.myrank.user_rank}</Table.Summary.Cell>
                                {prop.data.myrank.kper && (
                                    <Table.Summary.Cell align="center">{prop.data.myrank.kper}</Table.Summary.Cell>
                                )}
                                <Table.Summary.Cell>
                                    {displayNameColumnRender(
                                        null,
                                        {
                                            ID: prop.data.myrank.ID,
                                            DisplayName: prop.data.myrank.DisplayName,
                                            Account: prop.data.myrank.Account
                                        },
                                        -1
                                    )}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell>
                                    {badgeColumnRender(null, { badge_names: prop.data.myrank.badge_names }, -1)}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell>
                                    {totalPointColumnRender(null, {
                                        total_point: prop.data.myrank.total_point,
                                        last_point: prop.data.myrank.last_point
                                    })}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell align="center">
                                    {pointPerDayColumnRender(null, { point_per_day: prop.data.myrank.point_per_day })}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell align="center">
                                    {pointPlusColumnRender(null, { point_plus: prop.data.myrank.point_plus })}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell align="center">
                                    {pointMinusColumnRender(null, { point_minus: prop.data.myrank.point_minus })}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell align="center">{prop.data.myrank.total_work}</Table.Summary.Cell>
                                <Table.Summary.Cell align="center">
                                    {actionColumnRender(null, {
                                        ID: prop.data.myrank.ID,
                                        Account: prop.data.myrank.Account,
                                        DisplayName: prop.data.myrank.DisplayName
                                    })}
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )
                }
            />
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
                title={`See ${userSelected ? userSelected.Account : ''}’s History`}
                centered
                width={1200}
                open={modalHistory}
                onCancel={() => setModalHistory(false)}
                footer={false}
                destroyOnClose={true}
            >
                <LeaderBoardHistory
                    user={userSelected}
                    year={prop.year}
                    month={prop.month}
                    pointName={prop.pointName}
                />
            </Modal>
        </div>
    );
}

export default LeaderboardUserList;
