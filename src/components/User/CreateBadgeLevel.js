import { Button, Col, Form, Input, InputNumber, Row, Select, Upload } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GetTokenV2Context } from '../../context/GetTokenV2Context';
import { imgServer } from '../../dataConfig';
import { createLevel, updateLevel } from '../../services/BadgeLevelAPI';
import { getValueFromEvent } from '../../utils/upload';
import { notBeEmpty } from '../../utils/validator';
import UploadContent from '../UploadContent';
import debounce from 'lodash/debounce';
import { IMAGE_LIMIT_SIZE } from '../../constants/upload';

export const maxConversionRate = 999999;

function CreateBadgeLevel({ level, setModalState, setRefresh, setIsDataChanged, isDataChanged }) {
    const [form] = Form.useForm();
    const levelIconValue = Form.useWatch('ImageURL', form);
    const { getTokenFormData } = useContext(GetTokenV2Context);
    const { DepartmentID } = useSelector((state) => state.DepartmentSettingSlice);
    const [uploadErrors, setUploadErrors] = useState([]);
    const STATUS = {
        ACTIVE: { value: 1, label: 'Active' },
        INACTIVE: { value: 2, label: 'Inactive' }
    };

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

    useEffect(() => {
        form.setFieldValue('Status', STATUS.ACTIVE.value);
        if (level) {
            let levelIcon = [];
            if (level.ImageURL) {
                levelIcon = [
                    {
                        uid: 0,
                        name: level.ImageURL,
                        url: `${imgServer}${level.ImageURL}`,
                        thumbUrl: `${imgServer}${level.ImageURL}`
                    }
                ];
            }
            let formLevel = {
                ...level,
                ImageURL: levelIcon
            };
            form.setFieldsValue(formLevel);
        }
    }, [level]);

    const callbackSuccess = () => {
        setModalState(false);
        setRefresh(new Date());
        setIsDataChanged(!isDataChanged);
    };

    const handleFinish = (values) => {
        const formData = new FormData();
        let { Name, Description, ImageURL, ConversionRate, Status } = values;

        formData.append('Name', Name.trim());
        formData.append('Description', Description.trim());
        formData.append('DepartmentID', DepartmentID);
        if (ImageURL[0].originFileObj) {
            formData.append('ImageURL', ImageURL[0].originFileObj);
        }
        formData.append('RuleDefintionID', null);
        formData.append('LevelNumber', level.LevelNumber);
        formData.append('ConversionRate', ConversionRate);
        formData.append('Status', Status);
        formData.append('BadgeID', level.BadgeID);

        getTokenFormData(
            level.ID ? updateLevel : createLevel,
            level.ID ? 'Update success' : 'Create success',
            callbackSuccess,
            null,
            formData,
            DepartmentID,
            level.ID ?? level.ID
        );
    };

    return (
        <Form
            form={form}
            labelCol={{ span: 6 }}
            labelWrap
            labelAlign="left"
            style={{ marginTop: '1.5rem' }}
            onFinish={debounce(handleFinish,500)}
        >
            <Row gutter={24}>
                <Col span={24} className="text-center m-2">
                    <span className="badge text-bg-danger p-2 mb-2 rounded-pill">Level: {level?.LevelNumber}</span>
                </Col>
                <Col xs={24} md={24}>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                label="Name"
                                name="Name"
                                rules={[
                                    { required: true, message: 'Name is required' },
                                    { type: 'string', min: 3 },
                                    { validator: notBeEmpty }
                                ]}
                            >
                                <Input type="text" min={5} max={30} placeholder="Level name" />
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
                                label="Level Icon"
                                name="ImageURL"
                                valuePropName="fileList"
                                getValueFromEvent={getValueFromEvent}
                                rules={[{ required: true, message: 'Level Icon is required' }]}
                            >
                                <Upload className="ant-upload-custom" {...configUploadIcon}>
                                    <UploadContent value={levelIconValue} errors={uploadErrors} />
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="Status"
                                label="Status"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select Status!'
                                    }
                                ]}
                            >
                                <Select placeholder="select level status">
                                    <Select.Option value={STATUS.ACTIVE.value}>{STATUS.ACTIVE.label}</Select.Option>
                                    <Select.Option value={STATUS.INACTIVE.value}>{STATUS.INACTIVE.label}</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="ConversionRate"
                                name="ConversionRate"
                                rules={[{ required: true, message: 'Value is required' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={level.PreLevelConversionRate || 1}
                                    max={level.NextLevelConversionRate || maxConversionRate}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row justify="end" align="middle">
                <Button size="large" type="primary" htmlType="submit">
                    {level?.ID ? 'Update' : 'Create'}
                </Button>
            </Row>
        </Form>
    );
}

export default CreateBadgeLevel;
