import { InboxOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Grid, Input, Radio, Row, Select, Table, Typography, Upload } from 'antd';
import moment from 'moment';
import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import useRefreshToken from '../../Hook/useRefreshToken';
import { PAGE_INDEX, PAGE_SIZE, PAGE_SIZE_OPTIONS_TABLE } from '../../constants/pagination';
import { GetTokenV2Context } from '../../context/GetTokenV2Context';
import { createSyncApiHistory, createSyncHistory, getRuleSyncLabel, getSyncHistory } from '../../services/RuleAPI';
import debounce from 'lodash/debounce';
import { getFileDownLoadSyncHistory } from '../../services/ExportAPI';

const { Title } = Typography;
const { Dragger } = Upload;
const { useBreakpoint } = Grid;

const SyncTableNew = (props) => {
    const { year } = props;
    const [page, setPage] = useState(PAGE_INDEX);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [newyear, setNewyear] = useState('');
    const [newmonth, setNewmonth] = useState('');
    const [ruleid, setruleid] = useState(0);
    const [option, setOption] = useState(null);
    const [templateId, setTemplateId] = useState(0);
    const [ApiId, setApiId] = useState(0);
    const [file, setFile] = useState(null);
    const { DepartmentID } = useSelector((a) => a.DepartmentSettingSlice);
    const { getToken, getTokenFormData, getTokenDownload } = useContext(GetTokenV2Context);
    const { Code } = useSelector((a) => a.DepartmentSettingSlice);
    const { xs } = useBreakpoint();

    let [defaultValue, setdefaultValue] = useState({
        TemplateID: '',
        file: '',
        RuleDefinitionID: '',
        option: '',
        ApiID: ''
    });

    const getMonths = (year) => {
        let months = [];
        const curYear = new Date().getFullYear();
        const curMonth = new Date().getMonth() + 1;
        let minMonth = year === curYear ? curMonth : 12;

        for (let index = 0; index < minMonth; index++) {
            months.push(index + 1);
        }

        return months;
    };

    const [currentRuleAndTemplate, setCurrentRuleAndTemplate] = useRefreshToken(getRuleSyncLabel);

    const [syncHistory, setsyncHistory] = useRefreshToken(getSyncHistory, ruleid, newmonth, newyear);

    const onSelectRule = (value) => {
        setruleid(value);
        setOption(null);
        if (
            currentRuleAndTemplate.filter((item) => item.RuleDefinitionID === value)[0].Api !== null &&
            currentRuleAndTemplate.filter((item) => item.RuleDefinitionID === value)[0].Api !== ''
        ) {
            setApiId(currentRuleAndTemplate.filter((item) => item.RuleDefinitionID === value)[0].Api.ID);
        }
        if (
            currentRuleAndTemplate.filter((item) => item.RuleDefinitionID === value)[0].Template !== null &&
            currentRuleAndTemplate.filter((item) => item.RuleDefinitionID === value)[0].Template !== ''
        ) {
            setTemplateId(currentRuleAndTemplate.filter((item) => item.RuleDefinitionID === value)[0].Template.ID);
        }
    };

    const handleDownload = (URL, record) => {
        let exportFileName;
        let syncDownLoadType;
        if (URL === record.FileSuccesURL) {
            exportFileName = `SYNC-FILE-SUCCESS-${record.ID}-${moment(new Date()).format('YYYY_MM_DD_HH_mm')}`;
            syncDownLoadType = 1;
        }
        if (URL === record.FileFailURL) {
            exportFileName = `SYNC-FILE-FAIL-${record.ID}-${moment(new Date()).format('YYYY_MM_DD_HH_mm')}`;
            syncDownLoadType = 2;
        }
        getTokenDownload(getFileDownLoadSyncHistory, exportFileName, record.ID, syncDownLoadType);
    };

    const downloadExcel = (URL, record) => (
        <Button
            type="primary"
            onClick={debounce(() => {
                handleDownload(URL, record);
            }, 500)}
        >
            Download
        </Button>
    );

    const dateRender = (date) => {
        return moment(date).format('DD-MM-YYYY HH:mm:ss');
    };

    const columns = [
        {
            align: 'center',
            title: 'Total Line',
            dataIndex: 'TotalLine',
            key: 'TotalLine'
        },
        {
            align: 'center',
            title: 'Number Line Fail',
            dataIndex: 'NumberLineFail',
            key: 'NumberLineFail'
        },
        {
            align: 'center',
            title: 'Number Line Success',
            dataIndex: 'NumberLineSuccess',
            key: 'NumberLineSuccess'
        },
        {
            align: 'center',
            title: 'File Fail',
            dataIndex: 'FileFailURL',
            key: 'FileFailURL',
            render: downloadExcel
        },
        {
            align: 'center',
            title: 'File Success',
            dataIndex: 'FileSuccesURL',
            key: 'FileSuccesURL',
            render: downloadExcel
        },
        {
            align: 'center',
            title: 'Created Date',
            dataIndex: 'CreatedDate',
            key: 'CreatedDate',
            render: dateRender
        }
    ];

    const onTableChange = (pagination, filters, sorter, extra) => {
        // pagination
        setPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    function addNewTemplate() {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('Year', newyear);
        formData.append('Month', newmonth);
        formData.append('RuleDefinitionID', ruleid);
        formData.append('TemplateID', templateId);
        getTokenFormData(createSyncHistory, 'Sync request has been created', success, fail, formData, DepartmentID);
    }

    function syncApi() {
        const dataToSend = {
            ApiID: ApiId,
            RuleDefinitionID: ruleid,
            DepartmentID: DepartmentID,
            Month: newmonth,
            Year: newyear
        };
        getToken(createSyncApiHistory, 'Sync request has been created', success, fail, dataToSend, DepartmentID);
    }

    const success = () => {
        setCurrentRuleAndTemplate(new Date());
        setsyncHistory(new Date());
    };
    const fail = () => {
        return null;
    };

    const configImportFile = {
        multiple: false,
        maxCount: 1,
        accept: '.xlsx,.xls'
    };

    const uploadPoint = (file) => {
        setFile(file);
    };

    return (
        <div style={xs ? { margin: '1rem 2.5rem' } : { margin: '1rem 10rem' }}>
            <Row>
                <Col xs={24} md={12} style={{ marginBottom: '1rem' }}>
                    <Title style={{ lineHeight: 1.1, margin: 0 }} level={3}>
                        Head Sync Data
                    </Title>
                </Col>
            </Row>
            <Card style={{ padding: '1rem 4rem 0 4rem' }}>
                <Form
                    initialValues={defaultValue}
                    onFinish={debounce(() => (option === 'Excel' ? addNewTemplate() : syncApi()), 500)}
                    // {
                    //     if (option === 'Excel') {
                    //         debounce(addNewTemplate(),300);
                    //     } else {
                    //         debounce(syncApi(),300);
                    //     }
                    // }}
                >
                    {year !== null && (
                        <Form.Item
                            label="Year"
                            rules={[
                                {
                                    required: true
                                }
                            ]}
                            labelCol={{
                                span: 3
                            }}
                            wrapperCol={{
                                span: 19
                            }}
                        >
                            <Radio.Group buttonStyle="solid" onChange={(e) => setNewyear(e.target.value)}>
                                {year.map((year) => {
                                    return (
                                        <Radio.Button key={year} value={year}>
                                            {year}
                                        </Radio.Button>
                                    );
                                })}
                            </Radio.Group>
                        </Form.Item>
                    )}
                    {newyear !== '' && (
                        <div>
                            <Form.Item
                                label="Month"
                                rules={[
                                    {
                                        required: true
                                    }
                                ]}
                                labelCol={{
                                    span: 3
                                }}
                                wrapperCol={{
                                    span: 19
                                }}
                            >
                                <Radio.Group buttonStyle="solid" onChange={(e) => setNewmonth(e.target.value)}>
                                    {getMonths(newyear).map((month) => {
                                        const date = new Date();
                                        date.setMonth(month - 1);
                                        const monthToString = date.toLocaleString('en-US', {
                                            month: 'long'
                                        });
                                        return (
                                            <Radio.Button key={month} value={month}>
                                                {monthToString}
                                            </Radio.Button>
                                        );
                                    })}
                                </Radio.Group>
                            </Form.Item>
                            {newmonth !== '' && (
                                <div>
                                    <Form.Item
                                        label="Rule"
                                        rules={[
                                            {
                                                required: true
                                            }
                                        ]}
                                        labelCol={{
                                            span: 3
                                        }}
                                        wrapperCol={{
                                            span: 19
                                        }}
                                    >
                                        <Select
                                            showSearch
                                            placeholder="Select rule"
                                            onChange={(value) => {
                                                onSelectRule(value);
                                            }}
                                            filterOption={(input, option) =>
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                            }
                                        >
                                            {currentRuleAndTemplate ? (
                                                currentRuleAndTemplate.map((item) => {
                                                    return (
                                                        <Select.Option
                                                            key={item.RuleDefinitionID}
                                                            value={item.RuleDefinitionID}
                                                        >
                                                            {item.label}
                                                        </Select.Option>
                                                    );
                                                })
                                            ) : (
                                                <Select.Option key="0" value="0"></Select.Option>
                                            )}
                                        </Select>
                                    </Form.Item>
                                    {ruleid !== 0 && (
                                        <div>
                                            <Form.Item
                                                label="Options Sync"
                                                rules={[
                                                    {
                                                        required: true
                                                    }
                                                ]}
                                                labelCol={{
                                                    span: 3
                                                }}
                                                wrapperCol={{
                                                    span: 19
                                                }}
                                            >
                                                <Select
                                                    placeholder="Select option sync"
                                                    onChange={(value) => setOption(value)}
                                                    value={option}
                                                >
                                                    {currentRuleAndTemplate.filter(
                                                        (item) => item.RuleDefinitionID === ruleid
                                                    )[0].Template !== null &&
                                                        currentRuleAndTemplate.filter(
                                                            (item) => item.RuleDefinitionID === ruleid
                                                        )[0].Template !== '' && (
                                                            <Select.Option value="Excel">Sync with Excel</Select.Option>
                                                        )}
                                                    {currentRuleAndTemplate.filter(
                                                        (item) => item.RuleDefinitionID === ruleid
                                                    )[0].Api !== null &&
                                                        currentRuleAndTemplate.filter(
                                                            (item) => item.RuleDefinitionID === ruleid
                                                        )[0].Api !== '' && (
                                                            <Select.Option value="Api">Sync with API</Select.Option>
                                                        )}
                                                </Select>
                                            </Form.Item>
                                            {option !== null && (
                                                <div>
                                                    <Form.Item
                                                        label={option === 'Excel' ? 'Apply for Excel' : 'Apply for API'}
                                                        labelCol={{
                                                            span: 3
                                                        }}
                                                        wrapperCol={{
                                                            span: 19
                                                        }}
                                                    >
                                                        <Input
                                                            disabled
                                                            placeholder={
                                                                option === 'Excel'
                                                                    ? currentRuleAndTemplate.filter(
                                                                          (item) => item.RuleDefinitionID === ruleid
                                                                      )[0].Template.Name
                                                                    : currentRuleAndTemplate.filter(
                                                                          (item) => item.RuleDefinitionID === ruleid
                                                                      )[0].Api.Name
                                                            }
                                                        />
                                                    </Form.Item>
                                                    {option === 'Excel' && (
                                                        <Form.Item
                                                            label="File Excel"
                                                            labelCol={{
                                                                span: 3
                                                            }}
                                                            wrapperCol={{
                                                                span: 19
                                                            }}
                                                        >
                                                            <Dragger
                                                                {...configImportFile}
                                                                beforeUpload={() => {
                                                                    return false;
                                                                }}
                                                                onChange={(info) => {
                                                                    uploadPoint(info.file);
                                                                }}
                                                            >
                                                                <p className="ant-upload-drag-icon">
                                                                    <InboxOutlined />
                                                                </p>
                                                                <p className="ant-upload-text">
                                                                    Click or drag file to this area to upload
                                                                </p>
                                                                <p className="ant-upload-hint">
                                                                    Support {configImportFile.accept} extention files.
                                                                </p>
                                                            </Dragger>
                                                        </Form.Item>
                                                    )}
                                                    <Form.Item
                                                        wrapperCol={{
                                                            offset: 3
                                                        }}
                                                        style={{ textAlign: 'right' }}
                                                    >
                                                        <Button style={{ width: 120 }} type="primary" htmlType="submit">
                                                            Sync
                                                        </Button>
                                                    </Form.Item>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </Form>
                {option !== null && (
                    <Table
                        bordered
                        style={{ borderRadius: 0 }}
                        rowKey={(record) => record.ID}
                        columns={columns}
                        dataSource={syncHistory ? syncHistory : []}
                        onChange={onTableChange}
                        pagination={{
                            total: syncHistory ? syncHistory.length : 0,
                            current: page,
                            pageSize: pageSize,
                            showSizeChanger: true,
                            pageSizeOptions: PAGE_SIZE_OPTIONS_TABLE,
                            showTotal: (total) => `Total ${total} items`
                        }}
                    />
                )}
            </Card>
        </div>
    );
};

export default SyncTableNew;
