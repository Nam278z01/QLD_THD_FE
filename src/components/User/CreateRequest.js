import { Button, Col, Form, Input, InputNumber, Radio, Row, Select, Upload, message } from 'antd';
import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useRefreshToken from '../../Hook/useRefreshToken';
import { GetTokenV2Context } from '../../context/GetTokenV2Context';
import { getAllUserProject } from '../../services/ProjectAPI';
import { createSelfRequest } from '../../services/RequestAPI';
import { getAllActiveRule } from '../../services/RuleAPI';
import { getAllUserMasterNoPage } from '../../services/UsermasterAPI';
import debounce from 'lodash/debounce';
import { IMAGE_LIMIT_SIZE } from '../../constants/upload';

function CreateRequest({ setModal }) {
    const [form] = Form.useForm();
    const limitImageSize = IMAGE_LIMIT_SIZE;
    const date = new Date();
    const { userID, account, role, userDepartmentCode } = useSelector((state) => state.UserSlice);
    const { DepartmentID, PointName } = useSelector((state) => state.DepartmentSettingSlice);
    const [ruleData, setRefresh] = useRefreshToken(getAllActiveRule, role);
    const [projectData] = useRefreshToken(getAllUserProject, userDepartmentCode);
    const [BULUser] = useRefreshToken(getAllUserMasterNoPage, 2);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageName, setImageName] = useState('No file choosen');
    const [selection, setSelection] = useState(1);
    const { getToken } = useContext(GetTokenV2Context);
    const history = useHistory();
    const query = new URLSearchParams(window.location.search);
    const refreshPage = query.get('refreshPage');

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
        setModal(false);
        if (refreshPage !== 'true') {
            history.push('/request?refreshPage=true');
        } else {
            history.push('/request?refreshPage=false');
        }
    }
    const onFinish = (values) => {
        let body;
        const { Year, Times, RuleDefinitionID, ProjectID, Month, Evidence, Approver } = values;
        if (typeof values.Evidence == 'string') {
            body = {
                UserMasterID: userID,
                RuleDefinitionID: RuleDefinitionID,
                ProjectID: ProjectID,
                Approver: Approver,
                Year: Year,
                Times: Times,
                Month: Month,
                Evidence: Evidence,
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
        getToken(createSelfRequest, 'Add request point successfully!', success, null, body);
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
            <Form form={form} layout="vertical" onFinish={debounce(onFinish, 500)}>
                <Row gutter={[0, 12]}>
                    <Col span={6}>
                        <Form.Item
                            name="Requester"
                            label="Requester"
                            initialValue={account}
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
                            name="Times"
                            label="Times"
                        >
                            <InputNumber
                                placeholder="Input times"
                                onChange={(e) => {}}
                                min={1}
                                style={{ width: '100%' }}
                                type="number"
                            />
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
                            name="Month"
                            label="Month"
                        >
                            <InputNumber
                                placeholder="Input month"
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
                            rules={[
                                {
                                    required: true,
                                    message: 'Please choose request type'
                                }
                            ]}
                        >
                            <Select
                                showSearch
                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                placeholder="Select"
                                options={[{ value: PointName, label: PointName }]}
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
                            name="PointOfRule"
                            label={`${PointName} Of Rule`}
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
                            name="Year"
                            label="Year"
                        >
                            <InputNumber
                                min={1999}
                                placeholder="Input year"
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
                                onChange={(e) => {
                                    let rule = ruleData.find((rule) => rule.RuleID === e).Point;
                                    form.setFieldsValue({ PointOfRule: rule });
                                }}
                                placeholder="Select"
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
                            rules={[
                                {
                                    required: true,
                                    message: 'Please choose a project'
                                }
                            ]}
                        >
                            <Select
                                placeholder="Select"
                                showSearch
                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
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
                    <Col style={{ height: '90px' }} offset={3} span={6}>
                        <div style={{ fontWeight: 'bold' }}>
                            Evidence<span style={{ color: 'red' }}> *&nbsp;</span>
                        </div>
                        <Radio.Group
                            style={{ paddingTop: '10px', paddingBottom: '10px' }}
                            onChange={(e) => {
                                form.setFieldsValue({ Evidence: '' });
                                setImageName('No file choosen');
                                setSelection(e.target.value);
                            }}
                            defaultValue={'1'}
                        >
                            <Radio value="1">Enter Link</Radio>
                            <Radio value="2">Choose Image</Radio>
                        </Radio.Group>
                        <br />
                        {selection == 1 ? (
                            <>
                                <Form.Item
                                    name="Evidence"
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
                                    <Input placeholder="Input link" type="url" />
                                </Form.Item>
                            </>
                        ) : (
                            <>
                                <Form.Item
                                    name="Evidence"
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
                                        id="uploadImage"
                                        accept="image/png, image/jpeg"
                                        onChange={(e) => {
                                            if (e.fileList.length == 0) {
                                                form.setFieldsValue({ Evidence: '' });
                                                document.getElementById('FileName').value = '';
                                                setImageName('No file choosen');
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
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the title of collection!'
                                }
                            ]}
                        >
                            <Select
                                filterOption={(input, option) =>
                                    option?.label?.toLowerCase()?.includes(input.toLowerCase())
                                }
                                showSearch
                                placeholder="Select"
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
                    <Button size="large" onClick={debounce(() => form.submit(), 500)} type="primary">
                        Submit Request
                    </Button>
                </div>
            </Row>
        </>
    );
}

export default CreateRequest;
