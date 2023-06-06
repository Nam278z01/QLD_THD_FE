import { Button, Checkbox, Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import { useState } from 'react';
import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { GetTokenV2Context } from '../../context/GetTokenV2Context';
import useRefreshToken from '../../Hook/useRefreshToken';
import { createNewRule, getRuleDetail, getRuleFsu, updateRuleStatusV2 } from '../../services/RuleAPI';
import RuleIntegrated from './RuleIntegrated';
import RuleSync from './RuleSync';
import { notBeEmpty } from '../../utils/validator';
import debounce from 'lodash/debounce';

const RULE_STATUS = {
    ACTIVE: 1,
    INACTIVE: 2
};
const ruleStatus = [
    { value: RULE_STATUS.ACTIVE, label: 'Active' },
    { value: RULE_STATUS.INACTIVE, label: 'Inactive' }
];
const categories = ['Head', 'PM', 'Member'];
const ruleType = ['Plus', 'Minus'];
const SETTING_RULE = {
    SYNCHRONIZE: 'Synchronize',
    INTEGRATE: 'Integrate'
};

function CreateRule({ ruleId, setRefresh, setModalState }) {
    const initRule = {
        Category: categories[0],
        Status: RULE_STATUS.ACTIVE,
        RuleType: ruleType[0]
    };
    const [form] = Form.useForm();
    const { getToken, getTokenPromise } = useContext(GetTokenV2Context);

    const { DepartmentID } = useSelector((state) => state.DepartmentSettingSlice);
    const [modalSync, setModalSync] = useState(false);
    const [modalIntegrate, setModalIntegrate] = useState(false);
    const [isIntegrate, setIsIntegrate] = useState(false);
    const [ruleDetail, setRuleDetail] = useState(null);
    const [refreshFlag, setRefreshFlag] = useState(false);
    const [ruleTypeSelected, setRuleTypeSelected] = useState(ruleType[0]);

    const [ruleFSU] = useRefreshToken(getRuleFsu);

    useEffect(() => {
        form.setFieldsValue(initRule);
        ruleId &&
            getTokenPromise(getRuleDetail, null, ruleId).then((res) => {
                let settingRule = [];
                if (res) {
                    setRuleTypeSelected(res.RuleType);
                    setRuleDetail(res);
                    if (Boolean(res.ApiID || res.TemplateID)) {
                        settingRule.push(SETTING_RULE.SYNCHRONIZE);
                    }
                    if (res.Integrate) {
                        settingRule.push(SETTING_RULE.INTEGRATE);
                    }
                    let rule = {
                        ...res,
                        Name: res.RuleName,
                        Note: res.RuleNote,
                        Status: res.RuleStatus,
                        PointNumber: res.Point,
                        SettingRule: settingRule,
                        RuleType: res.RuleType
                    };
                    form.setFieldsValue(rule);
                }
            });
    }, [ruleId, refreshFlag]);

    const callbackSuccess = () => {
        setRefresh(new Date());
        setModalState(false);
    };

    const handleFinish = (values) => {
        let body = {
            ...values,
            DepartmentID
        };
        if (values.Note) {
            body.Note = values.Note.trim();
        }
        body.Name = values.Name.trim();
        delete body['SettingRule'];
        getToken(
            ruleId ? updateRuleStatusV2 : createNewRule,
            ruleId ? 'Rule has been updated' : 'New rule has been created',
            callbackSuccess,
            null,
            body,
            ruleId ? ruleId : DepartmentID
        );
    };

    const handleSyncModal = (e) => {
        setModalSync(true);
    };

    const handleIntegrateModal = (e) => {
        setModalIntegrate(true);
    };
    const handleRefresh = () => {
        setModalSync(false);
        setModalIntegrate(false);
        setRefreshFlag(new Date());
    };

    return (
        <>
            <Form
                form={form}
                labelCol={{ span: 7 }}
                labelWrap
                labelAlign="left"
                style={{ marginTop: '1.5rem' }}
                onFinish={debounce(handleFinish, 300)}
            >
                <Row gutter={48}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Rule Type"
                            name="RuleType"
                            rules={[{ required: true, message: 'Rule Type is required' }]}
                        >
                            <Select
                                options={ruleType.map((item) => ({ value: item, label: `${item}` }))}
                                onSelect={(e) => setRuleTypeSelected(e)}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            className="mb-0"
                            label="Status"
                            name="Status"
                            rules={[{ required: true, message: 'Status is required' }]}
                        >
                            <Select options={ruleStatus} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Name"
                            name="Name"
                            rules={[{ required: true, message: 'Name is required' }, { validator: notBeEmpty }]}
                        >
                            <Input.TextArea type="textarea" rows={2} min={3} max={300} placeholder="Enter name" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Note" name="Note">
                            <Input.TextArea type="textarea" rows={2} min={3} max={5000} placeholder="Enter note" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Submit by"
                            name="Category"
                            rules={[{ required: true, message: 'Category is required' }]}
                        >
                            <Select options={categories.map((item) => ({ value: item, label: `${item}` }))} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Point"
                            name="PointNumber"
                            rules={[
                                { required: true, message: 'Point is required' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (getFieldValue('RuleType') === 'Minus') {
                                            if (value < 0) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Point must be negative'));
                                        }
                                        if (getFieldValue('RuleType') === 'Plus') {
                                            if (value > 0) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Point must be positive'));
                                        }
                                        return Promise.resolve();
                                    }
                                })
                            ]}
                        >
                            {ruleTypeSelected === 'Plus' ? (
                                <InputNumber style={{ width: '100%' }} min={0} max={999999} placeholder="Enter point" />
                            ) : (
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={-999999}
                                    max={0}
                                    placeholder="Enter point"
                                />
                            )}
                        </Form.Item>
                    </Col>
                    {ruleDetail && (
                        <Col xs={24} md={12}>
                            <Form.Item labelCol={{ span: 10 }} label="Setting Rule" className="mb-0" name="SettingRule">
                                <Checkbox.Group>
                                    <Checkbox onChange={handleSyncModal} value="Synchronize">
                                        Synchronous
                                    </Checkbox>
                                    {ruleFSU && (
                                        <Checkbox
                                            checked={isIntegrate}
                                            onChange={handleIntegrateModal}
                                            value="Integrate"
                                        >
                                            Integrate
                                        </Checkbox>
                                    )}
                                </Checkbox.Group>
                            </Form.Item>
                        </Col>
                    )}
                </Row>
                <Row justify="end" align="middle">
                    <Button size="large" type="primary" htmlType="submit">
                        {ruleId ? 'Update' : 'Create'}
                    </Button>
                </Row>
            </Form>

            {ruleDetail && (
                <>
                    <Modal
                        title="Synchronous"
                        centered
                        width={750}
                        open={modalSync}
                        onCancel={handleRefresh}
                        footer={null}
                        destroyOnClose={true}
                    >
                        <RuleSync
                            data={ruleDetail}
                            RuleFsu={ruleFSU}
                            setModalSync={setModalSync}
                            setRefreshdata={setRefreshFlag}
                            setRefresh={setRefresh}
                        />
                    </Modal>
                    <Modal
                        title="Integrate"
                        centered
                        width={500}
                        open={modalIntegrate}
                        onCancel={handleRefresh}
                        footer={null}
                        destroyOnClose={true}
                    >
                        <RuleIntegrated
                            data={ruleDetail}
                            RuleFsu={ruleFSU}
                            RedirectUrl="/rule"
                            setModalIntegrate={setModalIntegrate}
                            setRefreshdata={setRefreshFlag}
                            setRefresh={setRefresh}
                        />
                    </Modal>
                </>
            )}
        </>
    );
}

export default CreateRule;
