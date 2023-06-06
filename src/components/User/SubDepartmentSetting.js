import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GetTokenV2Context } from '../../context/GetTokenV2Context';
import useRefreshToken from '../../Hook/useRefreshToken';
import { createUserMasterGroupChild, getAllUserDepartment, getUserGroupChild } from '../../services/GroupChildAPI';

function SubDepartmentSetting({ departmentCode, setRefreshSubDepa, setOpenModalSubDepa }) {
    const [form] = Form.useForm();
    const { getToken } = useContext(GetTokenV2Context);
    const { DepartmentID } = useSelector((a) => a.DepartmentSettingSlice);
    const [users] = useRefreshToken(getAllUserDepartment);
    const [groupData] = useRefreshToken(getUserGroupChild, departmentCode);
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        if (groupData && users) {
            setLeaders(users.map((user) => ({ ...user, value: user.ID })));
            form.setFieldsValue({
                Code: departmentCode,
                UserMasterID: groupData && groupData.length > 0 ? groupData.map((item) => item.ID) : []
            });
        }
    }, [groupData, users]);

    const callbackSuccess = () => {
        setOpenModalSubDepa(false);
        setRefreshSubDepa(new Date());
    };

    const handleFinish = (values) => {
        let body = values;
        getToken(createUserMasterGroupChild, 'Update success', callbackSuccess, null, body, DepartmentID);
    };

    return (
        <Form
            form={form}
            labelCol={{ span: 8 }}
            labelWrap
            labelAlign="left"
            style={{ marginTop: '1.5rem' }}
            onFinish={handleFinish}
        >
            <Row gutter={24}>
                <Col span={24}>
                    <Form.Item
                        label="Department Code"
                        name="Code"
                        rules={[{ required: true, message: 'Department Code is required' }]}
                    >
                        <Input disabled type="text" min={5} max={30} placeholder="Department Code" />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item label="Leader" name="UserMasterID">
                        <Select mode="multiple" allowClear options={leaders} />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item hidden name="DepartmentID" initialValue={DepartmentID}>
                <Input type="hidden" />
            </Form.Item>

            <Row justify="end" align="middle">
                <Button size="large" type="primary" htmlType="submit">
                    Submit
                </Button>
            </Row>
        </Form>
    );
}

export default SubDepartmentSetting;
