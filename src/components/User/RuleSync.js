import { Button, Col, Form, Row, Select, Space, Spin } from 'antd';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import useRefreshToken from '../../Hook/useRefreshToken';
import { GetTokenV2Context } from '../../context/GetTokenV2Context';
import {
    createNewTemplate,
    createSync,
    getTemplateSync,
    getdefaultRuleSync,
    updateRuleStatus,
    updateSync
} from '../../services/RuleAPI';
import { CreateSyncAPI, createNewTemplateAPI } from '../../services/SyncExcelAPI';
import {
    getAllTemplate,
    getAllTemplateAPI,
    getDataSyncAPI,
    getDefaultDataSyncAPI,
    getInforAPI
} from '../../services/TemplateAPI';
import CreateTemplateApi from './CreateTemplateApi ';
import CreateTemplateExcel from './CreateTemplateExcel';
import TableSyncData from './TableSyncData';
import UpdateTemplateApi from './UpdateTemplateApi ';
import UpdateTemplateExcel from './UpdateTemplateExcel ';
import debounce from 'lodash/debounce';
const SyncStatus = {
    Usual: 1,
    Api: 2
};

const syncList = [
    { value: SyncStatus.Usual, label: 'Synchronize as usual' },
    { value: SyncStatus.Api, label: 'Synchronize with API' }
];
const formType = {
    formCreateTemplate: 'formCreateTemplate',
    formUpdateTemplate: 'formUpdateTemplate',
    formCreateApi: 'formCreateApi',
    formUpdateApi: 'formUpdateApi',
    asynchronousExcel: 'asynchronousExcel',
    asynchronousApi: 'asynchronousApi'
};

function RuleSync2(props) {
    const [tempID, setTempID] = useState(null);
    const [apiID, setApiID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [file, setfile] = useState(0);
    const [AllTemplate, setAllTemplate] = useRefreshToken(getAllTemplate);
    const [AllTemplateApi, setAllTemplateApi] = useRefreshToken(getAllTemplateAPI);
    const { DepartmentID } = useSelector((a) => a.DepartmentSettingSlice);
    const { getTokenFormData, getToken, getTokenPromise } = useContext(GetTokenV2Context);
    const [selectOptionSync, setSelectOptionSync] = useState();
    const [selectOptionItemSync, setSelectOptionItemSync] = useState();
    const [headerOptions, setHeaderOptions] = useState([]);
    const [sampleData, setSampleData] = useState([]);
    const [addNew, setAddNew] = useState(false);
    const [dataTemplate, setdataTemplate] = useState(null);
    const [apiValue, setApiValue] = useState(null);

    useEffect(() => {
        form.setFieldsValue({
            AccountRow: '',
            CaculationFormula: '',
            Condition: '',
            NoteRow: '',
            ProjectCodeRow: '',
            Day: null,
            Hours: null,
            Minutes: null
        });
        setTempID(null);
        setApiID(null);
        if (selectOptionSync === SyncStatus.Usual) {
            getTokenPromise(getdefaultRuleSync, DepartmentID, props.data.ID).then((res) => {
                if (res && res.length > 0) {
                    setTempID(res[0]?.TemplateID);
                    setHeaderOptions(res[0]?.Header);
                    setSampleData(res[0]?.SampleData);
                    setSelectOptionItemSync(res[0]?.Template.Name);
                }
            });
        } else if (selectOptionSync === SyncStatus.Api) {
            getTokenPromise(getDefaultDataSyncAPI, DepartmentID, props.data.ID).then((res) => {
                if (res) {
                    setApiValue(res.Header?.length > 0 && res.SampleData?.length > 0);
                    setApiID(res?.ApiID);
                    setHeaderOptions(res?.Header);
                    setSampleData(res?.SampleData);
                    setSelectOptionItemSync(res?.Api.Name);
                    form.setFieldsValue({
                        Day: res.TimeRun?.split(',')[0] || null,
                        Hours: res.TimeRun?.split(',')[1] || null,
                        Minutes: res.TimeRun?.split(',')[2] || null
                    });
                }
            });
        }
    }, [selectOptionSync]);

    useEffect(() => {
        form.setFieldsValue({
            AccountRow: '',
            CaculationFormula: '',
            Condition: '',
            NoteRow: '',
            ProjectCodeRow: ''
        });
        setHeaderOptions([]);
        setSampleData([]);
        if (tempID) {
            getTokenPromise(getTemplateSync, DepartmentID, props.data.ID, tempID).then((res) => {
                if (res) {
                    setdataTemplate(res);
                    form.setFieldsValue({
                        AccountRow: res.ApplyFor,
                        CaculationFormula: res.CaculationFormula,
                        Condition: res.Condition,
                        NoteRow: res.Note,
                        ProjectCodeRow: res.ProjectID
                    });
                }
            });

            if (AllTemplate) {
                const template = AllTemplate?.find((item) => item.value === tempID);
                setHeaderOptions(template?.Header);
                setSampleData(template?.SampleData);
            }
        }
    }, [tempID]);

    useEffect(() => {
        form.setFieldsValue({
            AccountRow: '',
            CaculationFormula: '',
            Condition: '',
            NoteRow: '',
            ProjectCodeRow: '',
            Day: null,
            Hours: null,
            Minutes: null
        });
        setHeaderOptions([]);
        setSampleData([]);
        if (apiID) {
            getTokenPromise(getDataSyncAPI, DepartmentID, props.data.ID, apiID).then((res) => {
                if (res) {
                    form.setFieldsValue({
                        AccountRow: res.Account,
                        CaculationFormula: res.Caculator,
                        Condition: res.Condition,
                        NoteRow: res.NoteRow,
                        ProjectCodeRow: res.ProjectCode,
                        Day: res.TimeRun?.split(',')[0] || null,
                        Hours: res.TimeRun?.split(',')[1] || null,
                        Minutes: res.TimeRun?.split(',')[2] || null
                    });
                    setHeaderOptions(res?.Header);
                    setSampleData(res?.SampleData);
                }
            });
        }
    }, [apiID]);

    const callbackFinishUpdateSync = () => {
        props.setRefresh(new Date());
        props.setModalSync(false);
        props.setRefreshdata(new Date());
        setdataTemplate(new Date());
    };
    const callbackFinishSyncExcel = () => {
        props.setRefresh(new Date());
        props.setRefreshdata(new Date());
        props.setModalSync(false);
        setdataTemplate(new Date());
    };
    const callbackFinishSyncApi = () => {
        props.setRefresh(new Date());
        props.setModalSync(false);
        props.setRefreshdata(new Date());
        setdataTemplate(new Date());
    };
    const callbackFinishAsynchronousRule = () => {
        props.setRefresh(new Date());
        props.setModalSync(false);
        props.setRefreshdata(new Date());

        setdataTemplate(new Date());
    };
    const callbackFinishAddExcel = () => {
        setAddNew(false);
        form.setFieldsValue({
            ExcelTemplate: '',
            API: '',
            Name: '',
            HeaderLine: '',
            DataStartRow: '',
            Sheet: ''
        });
        setAllTemplate(new Date());
    };
    const callbackFinishAddApi = () => {
        setAddNew(false);
        form.setFieldsValue({
            ExcelTemplate: '',
            API: '',
            NameApi: '',
            Method: '',
            Params: '',
            Authorization: '',
            UserName: '',
            Password: '',
            Token: '',
            Url: ''
        });
        setAllTemplateApi(new Date());
        setAllTemplate(new Date());
    };
    const handleFinish = (name, info) => {
        const {
            DataStartRow,
            HeaderLine,
            Name,
            Sheet,
            AccountRow,
            NoteRow,
            Condition,
            ProjectCodeRow,
            CaculationFormula,
            Url,
            UserName,
            Password,
            Token,
            NameApi,
            Method,
            Params,
            Authorization,
            RawSampleData,
            RawHeader,
            MappingData,
            Day,
            Hours,
            Minutes
        } = info?.values ?? '';
        let TimeRun = null;
        if (
            Day !== undefined &&
            Hours !== undefined &&
            Minutes !== undefined &&
            Day !== null &&
            Hours !== null &&
            Minutes !== null
        ) {
            TimeRun = Day + ',' + Hours + ',' + Minutes;
        }
        switch (name) {
            case formType.formCreateTemplate:
                const formData = new FormData();
                formData.append('Name', Name);
                formData.append('file', file);
                formData.append('HeaderLine', HeaderLine);
                formData.append('Sheet', Sheet);
                formData.append('DataStartLine', DataStartRow);

                getTokenFormData(
                    createNewTemplate,
                    'New template has been created',
                    callbackFinishAddExcel,
                    null,
                    formData,
                    DepartmentID
                );
                break;
            case formType.formUpdateTemplate:
                let dataToSend = {
                    RuleDefinitionID: props.data.ID,
                    TemplateID: tempID,
                    Note: NoteRow ? NoteRow : null,
                    Condition: Condition ? Condition : null,
                    CaculationFormula: CaculationFormula ? CaculationFormula : null,
                    ApplyFor: AccountRow ? AccountRow : null,
                    ProjectID: ProjectCodeRow ? ProjectCodeRow : null
                };
                if (dataTemplate === null) {
                    getToken(
                        createSync,
                        'New request synchronous has been created',
                        callbackFinishSyncExcel,
                        null,
                        dataToSend,
                        DepartmentID
                    );
                } else {
                    getToken(
                        updateSync,
                        'Update synchronous has been created',
                        callbackFinishUpdateSync,
                        null,
                        dataToSend,
                        DepartmentID
                    );
                }
                break;
            case formType.formCreateApi:
                let dataTemplateToSend = {
                    Params: Params?.reduce((acc, user, index, array) => {
                        const values = Object.values(user).join(':');
                        const comma = index !== array.length - 1 ? ',' : '';
                        return acc + values + comma === ':' ? null : acc + values + comma;
                    }, ''),
                    Method: Method,
                    Url: Url,
                    Authorization: Authorization,
                    UserName: UserName,
                    Password: Password,
                    Token: Token,
                    Name: NameApi,
                    DepartmentID: DepartmentID
                };
                getToken(
                    createNewTemplateAPI,
                    'New template synchronous has been created',
                    callbackFinishAddApi,
                    null,
                    dataTemplateToSend
                );
                break;
            case formType.formUpdateApi:
                let dataCreateToSend = {
                    TimeRun: TimeRun,
                    SampleData: RawSampleData,
                    RuleDefinitionID: props.data.ID,
                    Header: RawHeader,
                    ApiID: apiID,
                    DepartmentID: DepartmentID,
                    AccountPropertyRefer: AccountRow,
                    ProjectIDPropertyRefer: ProjectCodeRow,
                    MappingData: MappingData,
                    NotePropertyRefer: NoteRow,
                    Condition: Condition,
                    FormulaCaculator: CaculationFormula
                };
                getToken(
                    CreateSyncAPI,
                    'New request synchronous has been created',
                    callbackFinishSyncApi,
                    false,
                    dataCreateToSend
                );
                break;
            case formType.asynchronousExcel:
                getToken(
                    updateRuleStatus,
                    'The asynchronous rule has been updated',
                    callbackFinishAsynchronousRule,
                    null,
                    {
                        TemplateID: null
                    },
                    props.data.ID
                );
                break;
            case formType.asynchronousApi:
                getToken(
                    updateRuleStatus,
                    'The asynchronous rule has been updated',
                    callbackFinishAsynchronousRule,
                    null,
                    {
                        ApiID: null
                    },
                    props.data.ID
                );
                break;
            default:
                break;
        }
    };

    const getTemplate = (syncType) => {
        let result = [];
        switch (syncType) {
            case SyncStatus.Usual:
                result = AllTemplate;
                break;
            case SyncStatus.Api:
                result = AllTemplateApi;
                break;
            default:
                result = [];
                break;
        }
        return result;
    };

    const handleAddNew = (syncType) => {
        setAddNew(true);
        setSelectOptionItemSync(null);
    };

    const handleChangeSyncItem = (value) => {
        setApiValue(null);
        setAddNew(false);
        setSelectOptionItemSync(value);
        switch (selectOptionSync) {
            case SyncStatus.Usual:
                setTempID(value);
                break;
            case SyncStatus.Api:
                setApiID(value);
                break;
            default:
                setTempID(null);
                setApiID(null);
                break;
        }
    };

    const handleSelectOptionSync = (value) => {
        setAddNew(false);
        setSelectOptionSync(value);
        setSelectOptionItemSync(null);
        form.resetFields();
    };

    const handleSyncRule = () => {
        setLoading(true);
        getTokenPromise(getInforAPI, DepartmentID, apiID).then((res) => {
            if (res) {
                setApiValue(res.Header?.length > 0 && res.SampleData?.length > 0);
                form.setFieldsValue({
                    RawHeader: res.RawHeader,
                    MappingData: res.MappingData,
                    RawSampleData: res.RawSampleData
                });
                setHeaderOptions(res.Header);
                setSampleData(res.SampleData);
                setLoading(false);
            } else {
                setLoading(false);
            }
        });
    };
    return (
        <Form.Provider onFormFinish={debounce(handleFinish, 500)}>
            <Row gutter={16}>
                <Col xs={24} md={16}>
                    <Form.Item required label="Sync Options" labelCol={{ span: 6 }} labelWrap labelAlign="left">
                        <Select
                            filterOption={false}
                            placeholder="Please choose sync option"
                            options={syncList}
                            onChange={handleSelectOptionSync}
                        />
                    </Form.Item>
                </Col>
            </Row>

            {selectOptionSync && (
                <Row gutter={16}>
                    <Col xs={24} md={16}>
                        <Form.Item
                            required
                            label={selectOptionSync === SyncStatus.Usual ? 'Excel Template' : 'API'}
                            labelCol={{ span: 6 }}
                            labelWrap
                            labelAlign="left"
                        >
                            <Select
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                value={selectOptionItemSync}
                                placeholder={
                                    selectOptionSync === SyncStatus.Usual
                                        ? 'Please choose excel template'
                                        : 'Please choose api'
                                }
                                options={getTemplate(selectOptionSync)}
                                onChange={handleChangeSyncItem}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Space>
                            {!addNew && (
                                <Button type="primary" onClick={() => handleAddNew(selectOptionSync)}>
                                    Add new
                                </Button>
                            )}
                        </Space>
                    </Col>
                </Row>
            )}

            {/* Thêm mới vs sync type = usual */}
            {addNew && selectOptionSync === SyncStatus.Usual && (
                <Form name="formCreateTemplate" form={form} layout="vertical">
                    <CreateTemplateExcel setfile={setfile} />
                    <Row justify="end">
                        <Button size="large" type="primary" htmlType="submit" style={{ width: 150 }}>
                            Submit
                        </Button>
                    </Row>
                </Form>
            )}

            {/* Thêm mới vs sync type = api */}
            {addNew && selectOptionSync === SyncStatus.Api && (
                <Form name="formCreateApi" form={form} layout="vertical">
                    <CreateTemplateApi form={form} />
                    <Row justify="end">
                        <Button size="large" type="primary" htmlType="submit" style={{ width: 150 }}>
                            Submit
                        </Button>
                    </Row>
                </Form>
            )}

            {/* Config template vs sync type = usual */}
            {selectOptionItemSync && selectOptionSync === SyncStatus.Usual && (
                <Form name="formUpdateTemplate" form={form} layout="vertical">
                    <TableSyncData headerOptions={headerOptions} sampleData={sampleData} />

                    <UpdateTemplateExcel sampleData={sampleData} />
                    <Row justify="end">
                        <Button size="large" type="primary" htmlType="submit" style={{ width: 150 }}>
                            Save
                        </Button>
                        {props.data.TemplateID === tempID && (
                            <Row justify="end">
                                <Button
                                    size="large"
                                    type="primary"
                                    htmlType="button"
                                    danger
                                    style={{ width: 150, marginLeft: 10 }}
                                    onClick={() => handleFinish('asynchronousExcel', null)}
                                >
                                    Asynchronous
                                </Button>
                            </Row>
                        )}
                    </Row>
                </Form>
            )}

            {/* Config template vs sync type = api */}
            {selectOptionItemSync && selectOptionSync === SyncStatus.Api && (
                <Form name="formUpdateApi" form={form} layout="vertical">
                    <Spin spinning={loading} size="large" style={{ maxHeight: '100%', zIndex: 1001 }}>
                        <TableSyncData headerOptions={headerOptions} sampleData={sampleData} />
                    </Spin>
                    {selectOptionSync === SyncStatus.Api && (
                        <div className="text-end">
                            <Button type="primary" size="middle" onClick={debounce(handleSyncRule, 300)}>
                                Sync data
                            </Button>
                        </div>
                    )}

                    <UpdateTemplateApi sampleData={sampleData} />
                    <Row justify="end">
                        <Button
                            size="large"
                            type="primary"
                            htmlType="submit"
                            style={{ width: 150 }}
                            disabled={apiValue ? false : true}
                        >
                            Save
                        </Button>

                        {props.data.ApiID === apiID && (
                            <Row justify="end">
                                <Button
                                    size="large"
                                    type="primary"
                                    htmlType="button"
                                    danger
                                    style={{ width: 150, marginLeft: 10 }}
                                    onClick={() => handleFinish('asynchronousApi', null)}
                                >
                                    Asynchronous
                                </Button>
                            </Row>
                        )}
                    </Row>
                </Form>
            )}
        </Form.Provider>
    );
}

export default RuleSync2;
