import { Select, Input, Form as AntForm, Row, Col, Upload } from 'antd';
import { Card } from 'antd';
import React from 'react';
import './style.scss';
const GetInput = (item, gutter) => {
    switch (item.type) {
        case 'select':
            return (
                <AntForm.Item {...item?.formProps} name={item.name} label={item.label} rules={item.rules}>
                    <Select
                        mode={item?.mode}
                        disabled={item?.disabled}
                        readOnly={item?.readOnly}
                        placeholder={item?.placeholder}
                        options={item?.options}
                    />
                </AntForm.Item>
            );
        // case "title":
        //     return (
        //         <h4 className='form-element-title'>{item.title}</h4>
        //     )
        case 'upload':
            return (
                <AntForm.Item name={item.name} rules={item.rules}>
                    <Upload
                        fileName={item.name}
                        label={item.label}
                        path={item.path}
                        disabled={item?.disabled}
                        options={item?.options}
                    />
                </AntForm.Item>
            );
        case 'selectApi':
            return (
                <AntForm.Item name={item.name} label={item.label} rules={item.rules}>
                    <SelectApiComponent {...item} fucnApi={item?.fucnApi} name={item.name} />
                </AntForm.Item>
            );
        default:
            return (
                <AntForm.Item {...item?.formProps} name={item.name} label={item.label} rules={item.rules}>
                    <Input
                        prefix={item.prefix}
                        disabled={item?.disabled}
                        readOnly={item?.readOnly}
                        type={item.type}
                        placeholder={item.placeholder}
                    />
                </AntForm.Item>
            );
    }
};

const FormGetInput = ({
    form,
    items,
    children,
    layout = 'vertical',
    onSubmit = () => {},
    childrenSpan,
    // validateMessage,
    initialValues,
    gutter = [0, 0],
    id,
    isSameDepartment,
    viewMode,
    isMyAccount,
    ...params
}) => {
    return (
        <AntForm
            initialValues={initialValues}
            form={form}
            layout={layout}
            onFinish={onSubmit}
            // validateMessage={validateMessage}
            {...params}
            style={{ marginLeft: '2.5rem', marginBottom: '1rem' }}
        >
            <Card
                title={<div className="title-infomation">FSOFT Information</div>}
                style={{ backgroundColor: 'transparent', marginBottom: '1rem' }}
                headStyle={{ backgroundColor: '#fafafa' }}
                bodyStyle={{ paddingLeft: '0', paddingRight: '0' }}
            >
                <Row gutter={gutter}>
                    {items?.slice(0, 3).map((item, index) => {
                        if (item.type === 'empty') {
                            return null;
                        }
                        return (
                            <Col key={item.name} span={item?.span} offset={item?.offset} className={item.colClassName}>
                                {GetInput(item, gutter)}
                                {item.note && <p className="note">{item.note}</p>}
                            </Col>
                        );
                    })}
                    <Col span={childrenSpan}>{children}</Col>
                </Row>
            </Card>
            { 
                (viewMode === 3 || (viewMode === 2 && isSameDepartment) || isMyAccount) &&
                <Card
                    title={<div className="title-infomation">Personal Information</div>}
                    style={{ backgroundColor: 'transparent' }}
                    headStyle={{ backgroundColor: '#fafafa' }}
                    bodyStyle={{ paddingLeft: '0', paddingRight: '0' }}
                >
                    <Row gutter={gutter}>
                        {items?.slice(3).map((item, index) => {
                            if (item.type === 'empty') {
                                return null;
                            }
                            return (
                                <Col
                                    key={item.name}
                                    span={item?.span}
                                    offset={item?.offset}
                                    className={item.colClassName}
                                >
                                    {GetInput(item, gutter)}
                                    {item.note && <p className="note">{item.note}</p>}
                                </Col>
                            );
                        })}
                        <Col span={childrenSpan}>{children}</Col>
                    </Row>
                </Card>
            }
        </AntForm>
    );
};

export default FormGetInput;
