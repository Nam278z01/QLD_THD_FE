import { InboxOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Row, Select, Space, Table, Upload, theme } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { notBeEmpty } from '../../utils/validator';

function CreateTemplateApi(props) {
    const { form } = props;
    const Method_Status = {
        Get: 'Get',
        Post: 'Post',
        Put: 'Put',
        Delete: 'Delete'
    };
    const optionmethod = [
        { value: Method_Status.Get, label: 'Get' },
        { value: Method_Status.Post, label: 'Post' },
        { value: Method_Status.Put, label: 'Put' },
        { value: Method_Status.Delete, label: 'Delete' }
    ];
    const Author_Status = {
        BasicAuth: 'BasicAuth',
        Token: 'Token',
        Header: 'Header'
    };
    const optionauthor = [
        { value: Author_Status.BasicAuth, label: 'BasicAuth' },
        { value: Author_Status.Token, label: 'Token' },
        { value: Author_Status.Header, label: 'Header' }
    ];
    const [selectAuthor, setselectAuthor] = useState();
    const handleSelectChange = (e) => {
        setselectAuthor(e);
        form.setFieldsValue({
            UserName: '',
            Password: '',
            Token: ''
        });
    };
    return (
        <>
            <Form.Item
                name="NameApi"
                label="Name"
                rules={[{ required: true, message: 'Please enter name!' }, { validator: notBeEmpty }]}
            >
                <Input style={{ width: '50%' }} type="text" placeholder="Enter name" />
            </Form.Item>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="Method"
                        label="Method API"
                        rules={[{ required: true, message: 'Please select method!' }]}
                    >
                        <Select
                            style={{ width: '100%' }}
                            filterOption={false}
                            notFoundContent={'Not Found'}
                            placeholder="Enter method api"
                            options={optionmethod}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="Url" label="Link API" rules={[{ required: true, message: 'Please enter url!' }]}>
                        <Input style={{ width: '100%' }} type="text" placeholder="Enter link url" />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item
                name="Params"
                label="Params"
                style={{ maxHeight: '260px', overflowY: 'auto', overflowX: 'hidden' }}
                className="m-0 p-0"
            >
                <Form.List name="Params" style={{ maxWidth: '700' }}>
                    {(fields, { add, remove }) => (
                        <>
                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            block
                                            icon={<PlusOutlined />}
                                            style={{ width: '100%' }}
                                        >
                                            Add field
                                        </Button>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space
                                            key={key}
                                            style={{
                                                display: 'flex'
                                                // marginBottom: 8
                                            }}
                                            align="baseline"
                                        >
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'key']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Missing key'
                                                    }
                                                ]}
                                            >
                                                <Input placeholder="Key" />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'value']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Missing value'
                                                    }
                                                ]}
                                            >
                                                <Input placeholder="Value" />
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </Space>
                                    ))}
                                </Col>
                            </Row>
                        </>
                    )}
                </Form.List>
            </Form.Item>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="Authorization"
                        label="Authorization"
                        rules={[{ required: true, message: 'Please select authorization!' }]}
                    >
                        <Select
                            style={{ width: '100%' }}
                            filterOption={false}
                            notFoundContent={'Not Found'}
                            placeholder="Please choose authorization"
                            options={optionauthor}
                            onChange={handleSelectChange}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    {selectAuthor === 'BasicAuth' || selectAuthor === 'Header' ? (
                        <>
                            {' '}
                            <Form.Item name="UserName" label="UserName">
                                <Input style={{ width: '100%' }} type="text" placeholder="Enter user name" />
                            </Form.Item>
                            <Form.Item name="Password" label="Password">
                                <Input style={{ width: '100%' }} type="text" placeholder="Enter password" />
                            </Form.Item>
                        </>
                    ) : selectAuthor === 'Token' ? (
                        <>
                            <Form.Item name="Token" label="Token">
                                <Input style={{ width: '100%' }} type="text" placeholder="Enter token" />
                            </Form.Item>
                        </>
                    ) : (
                        <></>
                    )}
                </Col>
            </Row>
        </>
    );
}

export default CreateTemplateApi;
