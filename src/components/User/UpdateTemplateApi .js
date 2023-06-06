import { Col, Form, Input, InputNumber, Row, Select, Space, Tooltip } from 'antd';
import React from 'react';
import { useMemo } from 'react';
import { checkConditionData, checkCaculateData } from '../../utils/ValidateSyncRule';
import { QuestionCircleOutlined } from '@ant-design/icons';

function UpdateTemplateApi(sampleData) {
    const optionDay = useMemo(() => {
        const options = [];
        for (let i = 1; i <= 31; i++) {
            options.push({
                label: i.toString(),
                value: i.toString()
            });
        }
        return options;
    }, []);

    const optionHours = useMemo(() => {
        const options = [];
        for (let i = 0; i < 24; i++) {
            options.push({
                label: i.toString(),
                value: i.toString()
            });
        }
        return options;
    }, []);

    const optionMinutes = useMemo(() => {
        const options = [];
        for (let i = 0; i < 60; i++) {
            options.push({
                label: i.toString(),
                value: i.toString()
            });
        }
        return options;
    }, []);

    const validateCondition = (_, value) => {
        let result = checkConditionData(value, sampleData.sampleData);
        if (result.checkCondition) {
            return Promise.resolve();
        }
        return Promise.reject(new Error(result.ConditionError));
    };

    const validateCaculationFormula = (_, value) => {
        let result = checkCaculateData(value, sampleData.sampleData);
        if (result.checkCaculation) {
            return Promise.resolve();
        }
        return Promise.reject(new Error(result.CaculationError));
    };

    return (
        <>
            <Row gutter={16} align="middle">
                <Col span={8}>
                    <Form.Item
                        name="AccountRow"
                        label="Account Row"
                        rules={[{ required: true, message: 'Please input account row!' }]}
                    >
                        <InputNumber style={{ width: '100%' }} type="text" min={1} placeholder="Enter account row" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="ProjectCodeRow" label="Project Code Row">
                        <InputNumber style={{ width: '100%' }} type="text" placeholder="Enter project code row" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="NoteRow" label="Note Row">
                        <InputNumber style={{ width: '100%' }} type="text" placeholder="Enter note row" />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item name="TimeRun" label="Time Run" className="m-0">
                <Row gutter={16} align="middle">
                    <Col span={8}>
                        <Form.Item name="Day">
                            <Select
                                style={{ width: '100%' }}
                                filterOption={false}
                                notFoundContent={'Not Found'}
                                placeholder="Please choose day"
                                options={optionDay}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="Hours">
                            <Select
                                style={{ width: '100%' }}
                                filterOption={false}
                                notFoundContent={'Not Found'}
                                placeholder="Please choose hours"
                                options={optionHours}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="Minutes">
                            <Select
                                style={{ width: '100%' }}
                                filterOption={false}
                                notFoundContent={'Not Found'}
                                placeholder="Please choose minutes"
                                options={optionMinutes}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form.Item>
            <Row justify="start" gutter={16}>
                <Col span={16}>
                    <Form.Item
                        name="Condition"
                        label={
                            <span>
                                Condition &nbsp;
                                <Tooltip
                                    arrow={{ pointAtCenter: true }}
                                    placement="topLeft"
                                    title="Điều kiện để request point thỏa mãn:&#10;cột: [số cột]&#10;so sánh bằng '=='&#10;so sánh khác '!='&#10;chỉ có thể so sánh các cột có cùng kiểu giá trị&#10;Example: [x]=='Approved'"
                                >
                                    <QuestionCircleOutlined style={{ fontSize: 16, color: '#FF0000' }} />
                                </Tooltip>
                            </span>
                        }
                        rules={[{ validator: validateCondition }]}
                    >
                        <Input style={{ width: '100%' }} type="text" className="me-2" placeholder="Enter condition" />
                    </Form.Item>
                </Col>
            </Row>
            <Row justify="start" gutter={16}>
                <Col span={16}>
                    <Form.Item
                        name="CaculationFormula"
                        label={
                            <span>
                                Caculation Formula &nbsp;
                                <Tooltip
                                    arrow={{ pointAtCenter: true }}
                                    placement="topLeft"
                                    title="Công thức tính điểm cho request point:&#10;chỉ có thể tính toán giữa các số tự nhiên với các cột number và percentage&#10;Example: [x]*5*[y]"
                                >
                                    <QuestionCircleOutlined style={{ fontSize: 16, color: '#FF0000' }} />
                                </Tooltip>
                            </span>
                        }
                        rules={[{ validator: validateCaculationFormula }]}
                    >
                        <Input
                            style={{ width: '100%' }}
                            type="text"
                            className="me-2"
                            placeholder="Enter caculation formula"
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item name="RawHeader" label="Caculation Formula" hidden={true}>
                <Input type="text" />
            </Form.Item>
            <Form.Item name="MappingData" label="Caculation Formula" hidden={true}>
                <Input type="text" />
            </Form.Item>
            <Form.Item name="RawSampleData" label="Caculation Formula" hidden={true}>
                <Input type="text" />
            </Form.Item>
        </>
    );
}

export default UpdateTemplateApi;
