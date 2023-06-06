import { InboxOutlined, MinusCircleOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Row, Select, Space, Table, Tooltip, Upload, theme } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { notBeEmpty } from '../../utils/validator';

function CreateTemplateExcel(props) {
    const { setfile } = props;
    const { Dragger } = Upload;

    const configImportFile = {
        multiple: false,
        maxCount: 1,
        showUploadList: true,
        accept: '.xlsx,.xls'
    };
    const handleChange = (e) => {
        setfile(e.file);
    };
    return (
        <>
            <Form.Item
                name="Name"
                label="Name"
                rules={[{ required: true, message: 'Please input excel template name!' }, { validator: notBeEmpty }]}
            >
                <Input style={{ width: '50%' }} type="text" placeholder="Enter name" />
            </Form.Item>
            <Row gutter={16} align="middle">
                <Col span={8}>
                    <Form.Item
                        name="HeaderLine"
                        label={
                            <span>
                                Header Line &nbsp;
                                <Tooltip
                                    arrow={{ pointAtCenter: true }}
                                    placement="topLeft"
                                    title="The line containing the names of the columns in the Excel file"
                                >
                                    <QuestionCircleOutlined style={{ fontSize: 16, color: '#FF0000' }} />
                                </Tooltip>
                            </span>
                        }
                        rules={[{ required: true, message: 'Please input header line!' }]}
                    >
                        <InputNumber style={{ width: '100%' }} type="text" min={0} placeholder="Enter header line" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="DataStartRow"
                        label={
                            <span>
                                Data Start Row &nbsp;
                                <Tooltip
                                    arrow={{ pointAtCenter: true }}
                                    placement="topLeft"
                                    title="The first row containing data in the Excel file"
                                >
                                    <QuestionCircleOutlined style={{ fontSize: 16, color: '#FF0000' }} />
                                </Tooltip>
                            </span>
                        }
                        rules={[{ required: true, message: 'Please input data start row!' }]}
                    >
                        <InputNumber style={{ width: '100%' }} type="text" min={0} placeholder="Enter header line" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="Sheet"
                        label={
                            <span>
                                Sheet &nbsp;
                                <Tooltip
                                    arrow={{ pointAtCenter: true }}
                                    placement="topLeft"
                                    title="The first sheet in the Excel file to be used"
                                >
                                    <QuestionCircleOutlined style={{ fontSize: 16, color: '#FF0000' }} />
                                </Tooltip>
                            </span>
                        }
                        rules={[{ required: true, message: 'Please input sheet!' }]}
                    >
                        <InputNumber style={{ width: '100%' }} type="text" min={0} placeholder="Enter sheet" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                className="mb-4"
                style={{ margin: 0 }}
                name="file"
                valuePropName="fileList"
                getValueFromEvent={handleChange}
            >
                <Dragger
                    {...configImportFile}
                    beforeUpload={() => {
                        return false;
                    }}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">Support {configImportFile.accept} extention files.</p>
                </Dragger>
            </Form.Item>
        </>
    );
}

export default CreateTemplateExcel;
