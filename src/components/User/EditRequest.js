import { Button, Form, Input, Modal, Radio, InputNumber, Select, Upload, message, Col, Divider, Row } from 'antd';
import { GetTokenV2Context } from '../../context/GetTokenV2Context';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import useRefreshToken from '../../Hook/useRefreshToken';
import { getAllActiveRule } from '../../services/RuleAPI';
import { getAllUserProject } from '../../services/ProjectAPI';
import { getAllUserMasterNoPage } from '../../services/UsermasterAPI';
import { imgServer } from '../../dataConfig';
import React, { useState } from 'react';
import { requestUpdate } from '../../services/RequestAPI';
import { deleteRequest } from '../../services/RequestAPI';
import debounce from 'lodash/debounce';
import { IMAGE_LIMIT_SIZE } from '../../constants/upload';

function EditRequest({ data, setModalEditRequest, setRefresh }) {
    const [form] = Form.useForm();
    const displayImage =
        data.Evidence && typeof data.Evidence == 'string' ? (data.Evidence.startsWith('/public/images/') ? 2 : 1) : 1;
    const date = new Date();
    const { userID, account, role, userDepartmentCode } = useSelector((state) => state.UserSlice);
    const limitImageSize = IMAGE_LIMIT_SIZE;
    const { DepartmentID } = useSelector((state) => state.DepartmentSettingSlice);
    const [ruleData] = useRefreshToken(getAllActiveRule, role);
    const [projectData] = useRefreshToken(getAllUserProject, userDepartmentCode);
    const [BULUser] = useRefreshToken(getAllUserMasterNoPage, 2);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageName, setImageName] = useState(data.Evidence);
    const [selection, setSelection] = useState(displayImage);
    const { getToken } = useContext(GetTokenV2Context);

    const [fileList, setFileList] = useState([
        {
            name: 'Evidence',
            status: 'success',
            url: `${imgServer}${data.Evidence}`
        }
    ]);
    const ruleList =
        ruleData !== null
            ? ruleData.map((x) => ({
                  value: x.RuleID,
                  label: x.label
              }))
            : null;
    const projectList =
        projectData !== null
            ? projectData.map((x) => ({
                  value: x.projectid,
                  label: x.key
              }))
            : null;

    const bulList =
        BULUser !== null
            ? BULUser.map((x) => ({
                  value: x.ID,
                  label: x.Account
              }))
            : [];

    function success() {
        setRefresh(new Date());
        setModalEditRequest(false);
    }
    const onFinish = (values) => {
        let body;
        const { Year, Times, RuleDefinitionID, ProjectID, Month, Evidence, Approver } = values;
        if (typeof values.Evidence == 'string') {
            body = {
                UserMasterID: userID,
                RuleDefinitionID,
                ProjectID,
                Approver,
                Year,
                Times,
                Month,
                Evidence: values.Evidence,
                DepartmentID: DepartmentID
                // DepartmentID: DepartmentID,
            };
        } else if (typeof values.Evidence == 'object') {
            const formData = new FormData();
            formData.append('UserMasterID', userID);
            formData.append('RuleDefinitionID', RuleDefinitionID);
            formData.append('ProjectID', ProjectID);
            formData.append('Times', Times);
            formData.append('Month', Month);
            formData.append('Year', Year);
            formData.append('Approver', Approver);
            formData.append('DepartmentID', DepartmentID);
            formData.append('Evidence', values.Evidence.file);
            //   formData.append("DepartmentID", DepartmentID);
            body = formData;
        }
        let ID = data.ID;
        getToken(requestUpdate, 'Update request point successfully!', success, null, body, DepartmentID, ID);
    };
    function beforeUpload(file) {
        const isLt2M = file.size / 1024 < limitImageSize;

        if (!isLt2M) {
            message.error(`Image must smaller than ${limitImageSize}kb!`);
            return Upload.LIST_IGNORE;
        }
        return false;
    }
    return (
        <>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={[0, 12]}>
                    <Col span={6}>
                        <Form.Item
                            name="Requester"
                            label="Requester"
                            initialValue={data.CreatedBy}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the title of collection!'
                                }
                            ]}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col offset={3} span={6}>
                        <Form.Item
                            rules={[
                                {
                                    required: true,

                                    type: 'number',

                                    message: 'Please enter a valid number'
                                },

                                {
                                    type: 'number',

                                    min: 1,

                                    message: 'Please enter a number larger than 1'
                                }
                            ]}
                            initialValue={data.Times}
                            name="Times"
                            label="Times"
                        >
                            <InputNumber onChange={(e) => {}} min={1} style={{ width: '100%' }} type="number" />
                        </Form.Item>
                    </Col>
                    <Col offset={3} span={6}>
                        <Form.Item
                            rules={[
                                {
                                    required: true,

                                    type: 'number',

                                    message: 'Please enter a valid number'
                                },

                                {
                                    type: 'number',

                                    min: 1,

                                    max: 12,

                                    message: 'Please enter a number between 1 and 12'
                                }
                            ]}
                            initialValue={data.Month}
                            name="Month"
                            label="Month"
                        >
                            <InputNumber
                                min={1}
                                max={12}
                                onChange={(e) => {}}
                                style={{ width: '100%' }}
                                type="number"
                            />
                        </Form.Item>
                    </Col>

                    <Col span={6}>
                        <Form.Item
                            name="RequestType"
                            label="Request Type"
                            initialValue={{
                                value: 'Point',
                                label: 'Point'
                            }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the title of collection!'
                                }
                            ]}
                        >
                            <Select
                                showSearch
                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                options={[{ value: 'Point', label: 'Point' }]}
                            ></Select>
                        </Form.Item>
                    </Col>
                    <Col offset={3} span={6}>
                        <Form.Item
                            rules={[
                                {
                                    required: true,

                                    type: 'number',

                                    message: 'Please choose a rule'
                                }
                            ]}
                            initialValue={data.PointOfRule}
                            name="PointOfRule"
                            label="Point Of Rule"
                        >
                            <InputNumber disabled onChange={(e) => {}} style={{ width: '100%' }} type="number" />
                        </Form.Item>
                    </Col>
                    <Col offset={3} span={6}>
                        <Form.Item
                            rules={[
                                {
                                    required: true,

                                    type: 'number',

                                    message: 'Please enter a valid number'
                                },

                                {
                                    type: 'number',

                                    min: 1999,

                                    max: date.getFullYear(),

                                    message: `Please enter a number between 1999 and ${date.getFullYear()}`
                                }
                            ]}
                            initialValue={data.Year}
                            name="Year"
                            label="Year"
                        >
                            <InputNumber
                                min={1999}
                                max={date.getFullYear()}
                                onChange={(e) => {}}
                                style={{ width: '100%' }}
                                type="number"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="RuleDefinitionID"
                            label="Rule Definition"
                            initialValue={data.RuleDefinition?.ID}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please choose a rule'
                                }
                            ]}
                        >
                            <Select
                                showSearch
                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                initialValue={{
                                    label: data.Name,
                                    value: data.RuleDefinition?.ID
                                }}
                                onChange={(e) => {
                                    let rule = ruleData.find((rule) => rule.RuleID === e).Point;
                                    form.setFieldsValue({ PointOfRule: rule });
                                }}
                                options={ruleList}
                            >
                                {' '}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col offset={3} span={6}>
                        <Form.Item
                            name="ProjectID"
                            label="Project Code"
                            initialValue={data.Project !== null ? data.Project?.ID : ''}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please choose a project'
                                }
                            ]}
                        >
                            <Select
                                showSearch
                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                initialValue={{
                                    label: data.Project !== null ? data.Project?.Key : '',
                                    value: data.Project !== null ? data.Project?.ID : ''
                                }}
                                onChange={(e) => {
                                    let confirmer = projectData.find((project) => project.projectid === e).manager;
                                    form.setFieldsValue({ ConfirmBy: confirmer });
                                }}
                                options={projectList}
                            >
                                {' '}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col style={{ height: '100px' }} offset={3} span={6}>
                        <div style={{ fontWeight: 'bold' }}>
                            <span style={{ color: 'red' }}>*&nbsp;</span>Evidence
                        </div>
                        <Radio.Group
                            onChange={(e) => {
                                form.setFieldsValue({ Evidence: '' });
                                setImageName('');
                                setFileList(null);
                                setSelection(e.target.value);
                            }}
                            defaultValue={selection}
                        >
                            <Radio value={1}>Enter Link</Radio>
                            <Radio value={2}>Choose Image</Radio>
                        </Radio.Group>
                        <br /> <br />
                        {selection == 1 ? (
                            <>
                                <Form.Item
                                    name="Evidence"
                                    initialValue={data.Evidence}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input evidence'
                                        },
                                        {
                                            pattern:
                                                /^https?:\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?$/,
                                            message: 'Please input a link'
                                        }
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </>
                        ) : (
                            <>
                                <Form.Item
                                    name="Evidence"
                                    initialValue={data.Evidence}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input evidence'
                                        }
                                    ]}
                                >
                                    <Upload
                                        beforeUpload={beforeUpload}
                                        maxCount={1}
                                        listType="picture"
                                        defaultFileList={fileList}
                                        id="uploadImage"
                                        accept="image/png, image/jpeg"
                                        onChange={(e) => {
                                            if (e.fileList.length == 0) {
                                                form.setFieldsValue({ Evidence: '' });
                                                document.getElementById('FileName').value = '';
                                                setImageName('');
                                            } else {
                                                document.getElementById('FileName').value = e.fileList[0].name;
                                                setImageName(document.getElementById('FileName').value);
                                            }
                                        }}
                                    >
                                        <Row>
                                            <Col span={10}>
                                                <Button
                                                    id="selectImage"
                                                    style={{
                                                        backgroundColor: '#EAE6FD',
                                                        color: '#321B85',
                                                        fontWeight: 'bold',
                                                        borderTopRightRadius: '0px',
                                                        borderBottomRightRadius: '0px'
                                                    }}
                                                >
                                                    Choose File
                                                </Button>
                                            </Col>
                                            <Col span={14}>
                                                <Input
                                                    style={{
                                                        borderTopLeftRadius: '0px',
                                                        borderBottomLeftRadius: '0px'
                                                    }}
                                                    value={imageName}
                                                    id="FileName"
                                                    readOnly
                                                />
                                            </Col>{' '}
                                        </Row>
                                    </Upload>
                                </Form.Item>
                            </>
                        )}
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="Approver"
                            label="Approver"
                            initialValue={{
                                label: data.Approver,
                                value: data.Approver
                            }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the title of collection!'
                                }
                            ]}
                        >
                            <Select
                                showSearch
                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                options={bulList}
                            >
                                {' '}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col offset={3} span={6}>
                        <Form.Item
                            name="ConfirmBy"
                            label="Confirm By"
                            initialValue={data.Confirmer}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the title of collection!'
                                }
                            ]}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Row justify={'end'}>
                <div>
                    <Button
                        style={{ width: '150px' }}
                        size="large"
                        onClick={debounce(() => form.submit(), 500)}
                        type="primary"
                    >
                        Save Changes
                    </Button>
                </div>
            </Row>
        </>
    );
}

export default EditRequest;
