import { Col, Form, Input, InputNumber, Row, Tooltip } from 'antd';
import React from 'react';
import { checkCaculateData, checkConditionData } from '../../utils/ValidateSyncRule';
import { QuestionCircleOutlined } from '@ant-design/icons';

function UpdateTemplateExcel(sampleData) {
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
                        <InputNumber style={{ width: '100%' }} type="text" placeholder="Enter account row" />
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
        </>
    );
}

export default UpdateTemplateExcel;
