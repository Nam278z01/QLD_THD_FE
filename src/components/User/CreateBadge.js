import { PlusCircleOutlined } from '@ant-design/icons';
import {
    Avatar,
    Badge,
    Button,
    Card,
    Col,
    Form,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Space,
    Tooltip,
    Upload
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useRefreshToken from '../../Hook/useRefreshToken';
import { GetTokenV2Context } from '../../context/GetTokenV2Context';
import { imgServer } from '../../dataConfig';
import { createBadge, getOneBadgeV2, updateBadgeV2 } from '../../services/BadgeAPI';
import { getAllActiveRuleNotBadge } from '../../services/RuleAPI';
import { getValueFromEvent } from '../../utils/upload';
import { notBeEmpty } from '../../utils/validator';
import UploadContent from '../UploadContent';
import CreateBadgeLevel, { maxConversionRate } from './CreateBadgeLevel';
import debounce from 'lodash/debounce';
import { IMAGE_LIMIT_SIZE } from '../../constants/upload';

const AWARD_TYPE = {
    MANUAL: 'manual',
    AUTO: 'auto'
};
const STATUS_BADGE = {
    ACTIVE: 1,
    INACTIVE: 2
};
const awardType = [
    { label: 'Manual', value: AWARD_TYPE.MANUAL },
    { label: 'Auto', value: AWARD_TYPE.AUTO }
];
const operators = ['=', '<', '>', '<=', '>='];
const condition = [
    { value: 'asc', label: 'Min' },
    { value: '=', label: '\u003D' },
    { value: '>', label: '\u003E' },
    { value: '<', label: '\u003C' },
    { value: '<=', label: '\u2264' },
    { value: '>=', label: '\u2265' },
    { value: 'desc', label: 'Max' }
];
let defaultBadge = {
    AwardType: 'manual',
    BadgeIcon: [],
    RuleDefintionID: null
};

function CreateBadge({ bagdeId, setRefresh, setModalState }) {
    const [form] = Form.useForm();
    const [badgeLevels, setBadgeLevels] = useState([]);
    const badgeIconValue = Form.useWatch('ImageURL', form);
    const awardTypeValue = Form.useWatch('AwardType', form);
    const conditionValue = Form.useWatch('Condition', form);
    const { role } = useSelector((state) => state.UserSlice);
    const { getTokenFormData, getTokenPromise } = useContext(GetTokenV2Context);
    const { DepartmentID } = useSelector((state) => state.DepartmentSettingSlice);
    const [rules] = useRefreshToken(getAllActiveRuleNotBadge, role);
    const [uploadErrors, setUploadErrors] = useState([]);
    const [modalCreateBadgeLevel, setModalCreateBadgeLevel] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [isDataChanged, setIsDataChanged] = useState(false);
    const [rulesMedal, setRuleMedal] = useState([]);
    const configUploadIcon = {
        multiple: false,
        listType: 'picture',
        maxCount: 1,
        limitSize: IMAGE_LIMIT_SIZE,
        accept: 'image/png, image/jpeg, image/jpg, image/svg+xml',
        beforeUpload: (file) => {
            // validate limit image size
            let limitSize = IMAGE_LIMIT_SIZE;
            const isInvalidSize = file.size / 1024 >= limitSize;
            setUploadErrors([]);
            if (isInvalidSize) {
                setUploadErrors([`Exist file more than ${limitSize}kB`]);
                return Upload.LIST_IGNORE;
            }
            return false;
        }
    };

    const getConditionAndValue = (value) => {
        let result = {
            condition: null,
            value: null
        };

        if (!value) return result;

        let hasOperator = operators.some((item) => value.includes(item));
        if (hasOperator) {
            for (const operator of operators) {
                if (value.includes(operator)) {
                    const arr = value.split(operator);
                    result.condition = operator;
                    result.value = Number(arr[1]);
                }
            }
        } else {
            result.condition = value;
        }

        return result;
    };

    useEffect(() => {
        form.setFieldsValue(defaultBadge);
        bagdeId &&
            getTokenPromise(getOneBadgeV2, null, bagdeId).then((res) => {
                if (res) {
                    let ruleData = [];
                    if (rules) {
                        ruleData = [...rules];
                    }
                    if (res.RuleDefinition) {
                        ruleData.push({ value: res.RuleDefinition.ID, label: res.RuleDefinition.Name });
                    }
                    setRuleMedal(ruleData);
                    let badgeIcon = [
                        {
                            uid: 0,
                            name: res.ImageURL,
                            url: `${imgServer}${res.ImageURL}`,
                            thumbUrl: `${imgServer}${res.ImageURL}`
                        }
                    ];
                    let badge = {
                        ...res,
                        ImageURL: badgeIcon,
                        Condition: getConditionAndValue(res.Condition).condition,
                        ConditionValue: getConditionAndValue(res.Condition).value
                    };
                    form.setFieldsValue(badge);
                    setBadgeLevels(badge.BadgeLevels);
                }
            });
    }, [bagdeId, isDataChanged, rules]);

    const callbackSuccess = () => {
        setRefresh(new Date());
        setModalState(false);
    };

    const handleFinish = (values) => {
        const formData = new FormData();
        let { Name, Description, Condition, AwardType, ConditionValue, RuleDefintionID, ImageURL } = values;

        formData.append('Name', Name.trim());
        formData.append('Description', Description.trim());
        formData.append('DepartmentID', DepartmentID);
        if (ImageURL[0].originFileObj) {
            formData.append('ImageURL', ImageURL[0].originFileObj);
        }
        formData.append('AwardType', AwardType);
        if (AwardType === AWARD_TYPE.AUTO) {
            formData.append('RuleID', RuleDefintionID);
            if (operators.includes(Condition)) {
                Condition = Condition + ConditionValue;
            }
            formData.append('Condition', Condition);
        }

        getTokenFormData(
            bagdeId ? updateBadgeV2 : createBadge,
            bagdeId ? 'Update success' : 'Create success',
            callbackSuccess,
            null,
            formData,
            bagdeId ? bagdeId : DepartmentID
        );
    };

    // Open modal level
    const openModalLevel = (item) => {
        const levels = badgeLevels ?? [];
        if (item === null || item === undefined) {
            item = {};
            item.LevelNumber = levels.length + 2;
            item.BadgeID = bagdeId;
            item.PreLevelConversionRate = levels === [] ? 1 : levels?.[levels?.length - 1]?.ConversionRate ?? 1;
            item.NextLevelConversionRate = maxConversionRate;
        } else {
            const index = levels.findIndex((level) => level.ID === item.ID);
            item.PreLevelConversionRate = levels === [] ? 1 : levels[index - 1]?.ConversionRate;
            item.NextLevelConversionRate = levels === [] ? maxConversionRate : levels[index + 1]?.ConversionRate;
        }
        item.PreLevelConversionRate = item.PreLevelConversionRate + 1;
        item.NextLevelConversionRate = item.NextLevelConversionRate - 1;
        setSelectedLevel(item);
        setModalCreateBadgeLevel(true);
    };

    return (
        <Form
            form={form}
            labelCol={{ span: 6 }}
            labelWrap
            labelAlign="left"
            style={{ marginTop: '1.5rem' }}
            onFinish={debounce(handleFinish, 500)}
        >
            <Row gutter={24}>
                <Col xs={24} md={bagdeId ? 14 : 24}>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                label="Name"
                                name="Name"
                                rules={[{ required: true, message: 'Name is required' }, { validator: notBeEmpty }]}
                            >
                                <Input type="text" min={3} max={30} placeholder="Medal name" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Description"
                                name="Description"
                                rules={[
                                    { required: true, message: 'Description is required' },
                                    { validator: notBeEmpty }
                                ]}
                            >
                                <Input.TextArea type="textarea" rows={2} min={5} max={30} placeholder="Description" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Medal Icon"
                                name="ImageURL"
                                valuePropName="fileList"
                                getValueFromEvent={getValueFromEvent}
                                rules={[{ required: true, message: 'Medal Icon is required' }]}
                            >
                                <Upload className="ant-upload-custom" {...configUploadIcon}>
                                    <UploadContent value={badgeIconValue} errors={uploadErrors} />
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Award Type" name="AwardType">
                                <Select options={awardType} />
                            </Form.Item>
                        </Col>
                        {awardTypeValue === AWARD_TYPE.AUTO && (
                            <>
                                <Col span={24}>
                                    <Form.Item
                                        label="Rule"
                                        name="RuleDefintionID"
                                        rules={[{ required: true, message: 'Please select Rule!' }]}
                                    >
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                            }
                                            options={bagdeId ? rulesMedal : rules}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="Condition" className="mb-0">
                                        <Row gutter={16}>
                                            <Col span={10}>
                                                <Form.Item
                                                    name="Condition"
                                                    rules={[{ required: true, message: 'Please select Condition!' }]}
                                                >
                                                    <Select options={condition} />
                                                </Form.Item>
                                            </Col>
                                            {operators.includes(conditionValue) && (
                                                <Col span={14}>
                                                    <Form.Item
                                                        name="ConditionValue"
                                                        rules={[{ required: true, message: 'Value is required' }]}
                                                    >
                                                        <InputNumber style={{ width: '100%' }} min={1} max={999999} />
                                                    </Form.Item>
                                                </Col>
                                            )}
                                        </Row>
                                    </Form.Item>
                                </Col>
                            </>
                        )}
                    </Row>
                </Col>
                {bagdeId && (
                    <Col xs={24} md={10} style={{ marginBottom: '1.5rem' }}>
                        <Content className="border p-2 pe-4 " style={{ height: '390px', overflow: 'auto' }}>
                            {
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    {badgeLevels?.length > 0 ? (
                                        badgeLevels.map((item) => (
                                            <Badge.Ribbon
                                                key={item.ID}
                                                text={`Level ${item.LevelNumber}`}
                                                placement="end"
                                                color="red"
                                            >
                                                <Card onClick={(e) => openModalLevel(item)} hoverable>
                                                    <Card.Meta
                                                        avatar={
                                                            <Avatar size={50} src={`${imgServer}${item.ImageURL}`} />
                                                        }
                                                        title={item.Name}
                                                        description={
                                                            <Badge
                                                                color={ item.Status === STATUS_BADGE.ACTIVE ? '#1677ff' : 'red' }
                                                                count={ item.Status === STATUS_BADGE.ACTIVE ? 'Active' : 'Inactive' }
                                                            />
                                                        }
                                                    />
                                                </Card>
                                            </Badge.Ribbon>
                                        ))
                                    ) : (
                                        <></>
                                    )}
                                </Space>
                            }
                        </Content>
                        <Row justify="center" className="mt-3">
                            <Tooltip title="New level">
                                <Button onClick={() => openModalLevel(null)} type="primary">
                                    <PlusCircleOutlined />
                                </Button>
                            </Tooltip>
                        </Row>
                    </Col>
                )}
            </Row>

            <Row justify="end" align="middle">
                <Button size="large" type="primary" htmlType="submit">
                    {bagdeId ? 'Update' : 'Create'}
                </Button>
            </Row>
            <Modal
                title={selectedLevel?.Name ? 'Update Level' : 'Create Level'}
                centered
                open={modalCreateBadgeLevel}
                footer={null}
                width={selectedLevel ? 800 : 500}
                onCancel={() => setModalCreateBadgeLevel(false)}
                afterClose={() => {
                    setSelectedLevel(null);
                    setModalCreateBadgeLevel(false);
                    bagdeId = bagdeId;
                }}
                destroyOnClose
            >
                <CreateBadgeLevel
                    level={selectedLevel}
                    setModalState={setModalCreateBadgeLevel}
                    setRefresh={setRefresh}
                    setIsDataChanged={setIsDataChanged}
                    isDataChanged={isDataChanged}
                />
            </Modal>
        </Form>
    );
}

export default CreateBadge;
