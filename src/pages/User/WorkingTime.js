import { Button, Card, Col, Modal, Row, Space, Table, Typography } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import SearchInput from '../../components/SearchInput';
import { PAGE_INDEX, PAGE_SIZE, PAGE_SIZE_OPTIONS_TABLE } from '../../constants/pagination';
import { TABLE } from '../../constants/table';
import useAuth from '../../Hook/useAuth';
import useRefreshToken from '../../Hook/useRefreshToken';
import {
    exportAllWorkingDepartment,
    getAllWorkingDepartment,
    getYearListWorkingTimeSelect
} from '../../services/UsermasterAPI';
import ImportFile from '../../components/ImportFile';
import { GetTokenV2Context } from '../../context/GetTokenV2Context';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { uploadWorkingExcel } from '../../services/ImportAPI';
import debounce from 'lodash/debounce';
const { Title, Text } = Typography;

const monthColumRender = {
    jan: 1,
    feb: 2,
    mar: 3,
    apr: 4,
    may: 5,
    jun: 6,
    jul: 7,
    aug: 8,
    sep: 9,
    oct: 10,
    nov: 11,
    dec: 12
};

const monthFilter = (Month) => {
    switch (Month) {
        case monthColumRender.jan:
            return <Text>1</Text>;
        case monthColumRender.feb:
            return <Text>2</Text>;
        case monthColumRender.mar:
            return <Text>3</Text>;
        case monthColumRender.apr:
            return <Text>4</Text>;
        case monthColumRender.may:
            return <Text>5</Text>;
        case monthColumRender.jun:
            return <Text>6</Text>;
        case monthColumRender.jul:
            return <Text>7</Text>;
        case monthColumRender.aug:
            return <Text>8</Text>;
        case monthColumRender.sep:
            return <Text>9</Text>;
        case monthColumRender.oct:
            return <Text>10</Text>;
        case monthColumRender.nov:
            return <Text>11</Text>;
        case monthColumRender.dec:
            return <Text>12</Text>;
        default:
    }
};

// default status filter values
const monthFilterValues = [
    {
        text: '1',
        value: '1'
    },
    {
        text: '2',
        value: '2'
    },
    {
        text: '3',
        value: '3'
    },
    {
        text: '4',
        value: '4'
    },
    {
        text: '5',
        value: '5'
    },
    {
        text: '6',
        value: '6'
    },
    {
        text: '7',
        value: '7'
    },
    {
        text: '8',
        value: '8'
    },
    {
        text: '9',
        value: '9'
    },
    {
        text: '10',
        value: '10'
    },
    {
        text: '11',
        value: '11'
    },
    {
        text: '12',
        value: '12'
    }
];

const StyledCard = styled(Card)`
    .ant-card {
        box-shadow: none;
    }

    .ant-card .ant-card-head-title {
        font-weight: 600;
        font-size: 16px;
    }

    .ant-card-head {
        border-bottom: none;
    }

    .ant-card-body {
        border-radius: 0;
        padding: 8px 16px;
        box-shadow: inset 0px 1px 0px #d0d5dd, inset 0px -1px 0px #d0d5dd, inset 1px 0px 0px #d0d5dd,
            inset -1px 0px 0px #d0d5dd;
    }
`;

function WorkingTime() {
    const [page, setPage] = useState(PAGE_INDEX);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [search, setSearch] = useState('');
    const [sortQuery, setSortQuery] = useState('');
    const [monthQuery, setMonthQuery] = useState('');
    const [yearQuery, setYearQuery] = useState('');
    const [modalImportRule, setModalImportRule] = useState(false);
    const [data, setData] = useState(null);
    const [dataAll, setDataAll] = useState(null);
    const [yearFilterArray, setYearFilterArray] = useState([]);
    const { isHead } = useAuth({});
    const { DepartmentID, Code } = useSelector((state) => state.DepartmentSettingSlice);
    const { getTokenFormData, getTokenDownload } = useContext(GetTokenV2Context);
    const [year, setYear] = useState([]);

    const [memberData, setMemberData] = useRefreshToken(
        getAllWorkingDepartment,
        page,
        pageSize,
        sortQuery,
        search,
        monthQuery,
        yearQuery
    );

    const [memberDataAll, setMemberDataAll] = useRefreshToken(getAllWorkingDepartment);

    const yearFilterValues = [];
    useEffect(() => {
        setData(memberData);
        setDataAll(memberDataAll);
    }, [memberData, memberDataAll]);

    useEffect(() => {
        if (memberDataAll !== null) {
            memberDataAll.working.forEach((item) => {
                if (!yearFilterValues.some((i) => i.text === item.Year.toString())) {
                    yearFilterValues.push({ text: item.Year.toString(), value: item.Year });
                }
            });
        }
        setYearFilterArray(yearFilterValues);
    }, [memberDataAll]);

    const yearFilter = (yearFilterValues) => {
        return <Text>{yearFilterValues}</Text>;
    };

    // setting colums of table
    const columns = [
        {
            title: 'No.',
            dataIndex: 'No',
            key: 'No',
            width: 50,
            align: 'center',
            render: (id, record, index) => TABLE.COLUMN.RENDER_INDEX(id, record, index, page, pageSize)
        },
        {
            title: 'Name',
            dataIndex: 'DisplayName',
            key: 'DisplayName',
            width: '25%'
        },
        {
            title: 'Account',
            dataIndex: 'Account',
            key: 'Account',
            align: 'center'
        },
        {
            title: 'Month',
            dataIndex: 'Month',
            key: 'Month',
            align: 'center',
            filters: monthFilterValues,
            filterMultiple: false,
            render: monthFilter
        },
        {
            title: 'Year',
            dataIndex: 'Year',
            key: 'Year',
            align: 'center',
            filters: yearFilterArray,
            filterMultiple: false,
            render: yearFilter
        },
        {
            title: 'WorkDateNumber',
            dataIndex: 'WorkDateNumber',
            key: 'WorkDateNumber',
            align: 'center',
            sorter: true,
            sortDirections: ['ascend', 'descend']
        }
    ];

    // get data from api [getAllWorkingDepartment]

    const handelAfterChangeSearch = (value) => {
        setPage(PAGE_INDEX);
        setSearch(value);
    };

    /**
     * Trigger event table change
     * @param {*} pagination { current, pageSize, total, showSizeChanger }
     * @param {*} filters { Status[...], Role[...], RuleType[...] }
     * @param {*} sorter { order, columnKey, field, column{...} }
     * @param {*} extra { currentDataSource[...], action }
     */

    const onTableChange = (pagination, filters, sorter, extra) => {
        // pagination
        setPage(pagination.current);
        setPageSize(pagination.pageSize);

        // filter
        if (filters.Month) {
            setMonthQuery(filters.Month[0]);
        } else {
            setMonthQuery('');
        }

        if (filters.Year) {
            setYearQuery(filters.Year[0]);
        } else {
            setYearQuery('');
        }
        // sort
        let order = sorter.order;
        let sortName = sorter.columnKey;

        if (order) {
            setSortQuery(sortName + ':' + (order === 'ascend' ? 'ASC' : 'DESC'));
        } else {
            setSortQuery('');
        }
    };

    const handleImport = (file) => {
        setModalImportRule(false);

        const formData = new FormData();
        formData.append('file', file);

        getTokenFormData(uploadWorkingExcel, 'Import success', success, null, formData, DepartmentID);
    };

    const success = () => {
        setMemberDataAll(new Date());
        setMemberData(new Date());
    };

    const handleExport = () => {
        const exportFileName = `${Code}_workingTime_${moment(new Date()).format('YYYY_MM_DD_HH_mm')}`;
        getTokenDownload(
            exportAllWorkingDepartment,
            exportFileName,
            DepartmentID,
            page,
            pageSize,
            sortQuery,
            search,
            monthQuery,
            yearQuery
        );
    };

    return (
        <div style={{ margin: '1rem 2.5rem' }}>
            <Row style={{ marginBottom: '1rem' }}>
                <Col span={12}>
                    <Title style={{ lineHeight: 1.1, margin: 0 }} level={3}>
                        Working Time
                    </Title>
                </Col>
                <Col span={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                    <SearchInput afterChange={handelAfterChangeSearch} style={{ width: 250, marginRight: '.5rem' }} />
                    {isHead && (
                        <Space>
                            <Button type="primary" onClick={debounce(handleExport, 500)}>
                                Export
                            </Button>
                            <Button type="primary" onClick={() => setModalImportRule(true)}>
                                Import
                            </Button>
                        </Space>
                    )}
                </Col>
            </Row>

            {/* Table List */}
            <Table
                bordered
                style={{ borderRadius: 0 }}
                rowKey={(record) => record.ID}
                columns={columns}
                dataSource={data ? data.working : []}
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
            <Modal
                title="Import Working Time"
                centered
                open={modalImportRule}
                footer={null}
                width={500}
                onCancel={() => setModalImportRule(false)}
            >
                <ImportFile onFinish={handleImport} />
            </Modal>
        </div>
    );
}

export default WorkingTime;
