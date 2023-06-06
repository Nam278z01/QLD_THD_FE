import { Button, Col, Form, Input, Row, Select, Switch } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GetTokenV2Context } from '../../context/GetTokenV2Context';
import { createScheduleAwardBadge, getScheduleBadge, updateScheduleAwardBadge } from '../../services/BadgeAPI';
import { notBeEmpty } from '../../utils/validator';

const dateChoice = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28
];

function BadgeSchedule({ badgeId, setRefresh, setModalState }) {
    const [form] = Form.useForm();
    const { role } = useSelector((state) => state.UserSlice);
    const { getToken, getTokenPromise } = useContext(GetTokenV2Context);
    const { DepartmentID } = useSelector((state) => state.DepartmentSettingSlice);
    const [data, setData] = useState({});

    useEffect(() => {
        badgeId &&
            getTokenPromise(getScheduleBadge, null, badgeId).then((res) => {
                if (res) {
                    const number = res?.StartTime?.match(/[\d]+/);
                    const startTime = number ? parseInt(number) : 1;
                    const initialValues = {
                        Name: res?.Name || '',
                        BadgeID: badgeId || 0,
                        Description: res?.Description || '',
                        StartTime: startTime,
                        Auto: res?.Auto == 1 || false
                    };
                    form.setFieldsValue(initialValues);
                    setData(res);
                }
            });
    }, [badgeId]);

    const success = () => {
        setRefresh(new Date());
        setModalState(false);
    };

    const createOrUpdateSchedule = (values) => {
        var body = values;
        if (values.Auto === true) {
            body.Auto = 1; // 1 is auto every mouth
        } else {
            body.Auto = 2; // 2 is auto once
        }
        body.BadgeID = badgeId;
        if (data?.ID) {
            getToken(updateScheduleAwardBadge, 'Update success', success, null, body, DepartmentID, badgeId);
        } else {
            getToken(createScheduleAwardBadge, 'Create success', success, null, body, DepartmentID);
        }
    };

    const changeStatusSchedule = (status) => {
        getToken(updateScheduleAwardBadge, 'Update success', success, null, { Status: status }, DepartmentID, badgeId);
    };

    return (
        <>
            <Form
                form={form}
                labelCol={{ span: 6 }}
                labelWrap
                labelAlign="left"
                style={{ marginTop: '1.5rem' }}
                onFinish={createOrUpdateSchedule}
            >
                <Row gutter={24}>
                    <Col xs={24} md={24}>
                        <Row>
                            <Col span={10}>
                                <Form.Item
                                    labelCol={{ span: 14 }}
                                    name="StartTime"
                                    label="Date"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please select date!'
                                        }
                                    ]}
                                >
                                    <Select placeholder="select date">
                                        {dateChoice.map((item) => (
                                            <Select.Option key={item} value={item}>
                                                {item}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={14}>
                                <Form.Item
                                    labelCol={{ span: 14, offset: 3 }}
                                    label="Auto every month"
                                    name="Auto"
                                    valuePropName="checked"
                                >
                                    <Switch defaultChecked={data?.Auto == 1 || false} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Name"
                                    name="Name"
                                    rules={[{ required: true, message: 'Name is required' }, { validator: notBeEmpty}]}
                                >
                                    <Input type="text" min={5} max={30} placeholder="Schedule name" />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Description"
                                    name="Description"
                                    rules={[{ required: true, message: 'Description is required' }, { validator: notBeEmpty}]}
                                >
                                    <Input.TextArea
                                        type="textarea"
                                        rows={4}
                                        min={5}
                                        max={30}
                                        placeholder="Description"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row justify="end">
                    {data?.ID ? (
                        <>
                            <Button type="primary" htmlType="submit" className='me-1'>
                                Update
                            </Button>
                            {data?.Status === 1 ? (
                                <Button onClick={() => changeStatusSchedule(2)} type="primary" className="float-end">
                                    Stop
                                </Button>
                            ) : (
                                <Button onClick={() => changeStatusSchedule(1)} type="primary" className="float-end">
                                    Start
                                </Button>
                            )}
                        </>
                    ) : (
                        <Button type="primary" htmlType="submit">
                            Create
                        </Button>
                    )}
                </Row>
            </Form>
        </>
    );
}

export default BadgeSchedule;
