import { Button, Col, Form, Input, Popconfirm, Row, Table, Typography } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
const { Title, Text } = Typography;
const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};
const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);
    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };
    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({
                ...record,
                ...values,
            });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };
    let childNode = children;
    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }
    return <td {...restProps}>{childNode}</td>;
};
const ScopeManage = () => {
    const [dataSource, setDataSource] = useState([
        {
            key: '0',
            Name: 'Vũ Tiến Đạt',
            MHS1: 6,
            D15P: 7,
            D45P: 8,
            DHK: 8,
        },
        {
            key: '1',
            Name: 'Đào Thị Hòa',
            MHS1: 6,
            D15P: 7,
            D45P: 8,
            DHK: 8,
        },
        {
            key: '2',
            Name: 'Lê Hoàng Nam',
            MHS1: 6,
            D15P: 7,
            D45P: 8,
            DHK: 8,
        },
    ]);
    const [count, setCount] = useState(2);
    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };
    const defaultColumns = [
        {
            title: 'Tên học sinh',
            dataIndex: 'Name',
            width: '20%',
        },
        {
            title: 'Điểm miệng(hệ số 1)',
            dataIndex: 'MHS1',
            editable: true,
        },
        {
            title: 'Điểm 15p( hệ 1)',
            dataIndex: 'D15P',
            editable: true,
        },
        {
            title: 'Điểm 45p(hệ 2)',
            dataIndex: 'D45P',
            editable: true,
        },
        {
            title: 'Thi HK(hệ 3)',
            dataIndex: 'DHK',
            editable: true,
        },
        {
            title: 'Điểm TB môn học(tổng/7)',
            dataIndex: 'DTB',
            render: function (_, record) {
                const result = ((Number(record.MHS1) + Number(record.D15P) + Number(record.D45P) * 2 + Number(record.DHK) * 3) / 7);
                return (<> {result.toFixed(2)}</>);
            }
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                        <a>Delete</a>
                    </Popconfirm>
                ) : null,
        },
    ];
    const handleAdd = () => {
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: '32',
            address: `London, Park Lane no. ${count}`,
        };
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };
    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource(newData);
    };
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });
    return (
        <div>
            <Row>
                <Col xs={24} md={12} style={{ marginBottom: '1rem' }}>
                    <Title style={{ lineHeight: 1.1, margin: 0 }} level={3}>
                        Quản lý điểm lớp 10A1
                    </Title>
                    <Text>Danh sách học sinh</Text>
                </Col>
            </Row>
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns}
            />
        </div>
    );
};
export default ScopeManage;