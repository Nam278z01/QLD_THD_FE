import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Button,
    Form,
    Input,
    Image,
    InputNumber,
    Steps,
    Popconfirm,
    Col,
    Divider,
    Row,
    Modal,
    Space,
    ConfigProvider
} from 'antd';
import { imgServer } from '../../dataConfig';
import { GetTokenV2Context } from '../../context/GetTokenV2Context';
import { useContext } from 'react';
import { deleteRequest, requestUpdate } from '../../services/RequestAPI';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { confirm } = Modal;

const ViewRequest = ({ data, setModalViewRequest, setModalEditRequest, editAble, approveAble, setRefresh }) => {
    const [form] = Form.useForm();
    const [modalCancelRequest, setModalCancelRequest] = useState(false);
    const displayImage =
        data.Evidence && typeof data.Evidence == 'string' ? (data.Evidence.startsWith('/public/images/') ? 2 : 1) : 1;
    const date = new Date();
    const { PointName } = useSelector((a) => a.DepartmentSettingSlice);
    const { userID, account, role, userDepartmentCode } = useSelector((state) => state.UserSlice);
    const { DepartmentID } = useSelector((a) => a.DepartmentSettingSlice);
    const { getToken } = useContext(GetTokenV2Context);
    const canceledStatusId = 5;
    const rejectedStatusId = 4;
    const [selection, setSelection] = useState(displayImage);
    const [note, setNote] = useState(data?.Note ?? '');
    const items = [
        {
            title: 'Submitted'
        },
        {
            title: 'Waiting PM Confirm'
        },
        {
            title: 'Waiting Head Approve'
        },
        {
            title: 'Approved'
        }
    ];
    const canceledItem = [
        {
            title: 'Submitted'
        },
        {
            title: 'Canceled'
        }
    ];
    const rejectedItem = [
        {
            title: 'Submitted'
        },
        {
            title: 'Rejected'
        }
    ];
    const handleChange = ({ file: file }) => {
        if (!file) {
            setSelectedFile(undefined);
            return;
        }

        const maxAllowedSize = 200000;
        if (file.size > maxAllowedSize) {
            file.value = null;
            // document.getElementById("fileSizeAlert").style.display = "block";
        } else {
            // document.getElementById("fileSizeAlert").style.display = "none";
            setSelectedFile(file);
        }
    };
    function success() {
        setRefresh(new Date());
        setModalViewRequest(false);
    }

    const onFinish = (values) => {};

    const handleApproveRequest = () => {
        getToken(
            requestUpdate,
            'Request has been approved',
            success,
            null,
            {
                Status: role === 'Head' ? 3 : 2,
                Note: note
            },
            DepartmentID,
            data.ID
        );
    };

    const handleRejectRequest = () => {
        confirm({
            title: 'Reject this Request',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure?',
            onOk() {
                getToken(
                    requestUpdate,
                    'Request has been rejected',
                    success,
                    null,
                    {
                        Status: 4,
                        Note: note
                    },
                    DepartmentID,
                    data.ID
                );
            }
        });
    };

    return (
        <>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={[0, 0]}>
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
                            <Input readOnly />
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
                            <InputNumber
                                readOnly
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
                            initialValue={data.Month}
                            name="Month"
                            label="Month"
                        >
                            <InputNumber
                                readOnly
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
                            initialValue={PointName}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the title of collection!'
                                }
                            ]}
                        >
                            <Input readOnly />
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
                            label={`${PointName} Of Rule`}
                        >
                            <InputNumber readOnly onChange={(e) => {}} style={{ width: '100%' }} type="number" />
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
                                readOnly
                                min={1999}
                                max={date.getFullYear()}
                                onChange={(e) => {}}
                                style={{ width: '100%' }}
                                type="number"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={18}>
                        <Row>
                            <Col span={8}>
                                <Form.Item
                                    name="RuleDefinition"
                                    label="Rule Definition"
                                    initialValue={data?.RuleDefinition?.Name}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please choose a rule'
                                        }
                                    ]}
                                >
                                    <Input readOnly />
                                </Form.Item>
                            </Col>
                            <Col offset={4} span={8}>
                                <Form.Item
                                    name="ProjectCode"
                                    label="Project Code"
                                    initialValue={data.Project !== null ? data?.Project?.Code : 'No project'}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please choose a project'
                                        }
                                    ]}
                                >
                                    <Input readOnly />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    name="Approver"
                                    label="Approver"
                                    initialValue={data.Approver}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input the title of collection!'
                                        }
                                    ]}
                                >
                                    <Input readOnly />
                                </Form.Item>
                            </Col>
                            <Col offset={4} span={8}>
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
                                    <Input readOnly />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>

                    <Col span={6}>
                        <Form.Item name="Note" label="Note" initialValue={data?.Note !== null ? data?.Note : '-'}>
                            <TextArea onChange={(e) => setNote(e.target.value)} rows={4} readOnly={!approveAble} />
                        </Form.Item>
                    </Col>
                    <Col offset={3} span={6}></Col>
                    <Col span={20}>
                        <div style={{ fontWeight: 'bold' }}>
                            <span style={{ color: 'red' }}>*&nbsp;</span>Evidence
                        </div>

                        {selection == 1 ? (
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
                                    <a href={`${data.Evidence}`} target="_blank">
                                        &nbsp; {data.Evidence}
                                    </a>
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
                                    <Image width={100} height={50} src={`${imgServer}${data.Evidence}`} />
                                </Form.Item>
                            </>
                        )}
                    </Col>
                </Row>
            </Form>
            <span style={{ fontWeight: 'bold' }}>&nbsp; Status</span> <br />
            <br />
            {data.StatusID == canceledStatusId ? (
                <>
                    <Steps
                        size="small"
                        responsive={true}
                        label={'Status'}
                        current={1}
                        labelPlacement="vertical"
                        status="error"
                        items={canceledItem}
                    />
                </>
            ) : data.StatusID == rejectedStatusId ? (
                <>
                    {' '}
                    <Steps
                        size="small"
                        responsive={true}
                        label={'Status'}
                        current={1}
                        labelPlacement="vertical"
                        status="error"
                        items={rejectedItem}
                    />
                </>
            ) : (
                <>
                    {' '}
                    <Steps
                        responsive={true}
                        size="small"
                        label={'Status'}
                        current={data.StatusID}
                        labelPlacement="vertical"
                        items={items}
                    />
                </>
            )}
            <Row justify={'end'}>
                <div>
                    {editAble ? (
                        <>
                            {' '}
                            {/* <Popconfirm
                placement="top"
                title={"Are you sure?"}
                description={"Cancel this request"}
              
                onConfirm={() => {
                  let pointID = data.ID;
                      getToken(
                        deleteRequest,
                        "Delete request point successfully!",
                        success,
                        null,
                        null,
                        pointID
                      );
                }}
                okText="Yes"
                cancelText="No"
              > */}
                            {approveAble ? (
                                <Space>
                                    <Button
                                        style={{ width: '150px' }}
                                        size="large"
                                        onClick={handleRejectRequest}
                                        type="primary"
                                        danger
                                    >
                                        Reject Request
                                    </Button>
                                    <Button
                                        style={{ width: '150px' }}
                                        size="large"
                                        onClick={handleApproveRequest}
                                        type="primary"
                                    >
                                        Approve Request
                                    </Button>
                                </Space>
                            ) : (
                                <Button
                                    style={{ width: '150px' }}
                                    size="large"
                                    onClick={() => {
                                        setModalCancelRequest(true);
                                    }}
                                    type="default"
                                >
                                    Cancel Request
                                </Button>
                            )}
                            {/* </Popconfirm> */}
                            &nbsp;&nbsp;&nbsp;
                            <Button
                                style={{ width: '150px' }}
                                size="large"
                                onClick={() => {
                                    setModalViewRequest(false), setModalEditRequest(true);
                                }}
                                type="primary"
                            >
                                Edit Request
                            </Button>
                        </>
                    ) : (
                        ''
                    )}
                </div>
            </Row>
            <Modal
                title="Cancel Request"
                centered
                width={300}
                open={modalCancelRequest}
                onOk={() => {
                    let pointID = data.ID;
                    getToken(deleteRequest, 'Delete request point successfully!', success, null, null, pointID);
                    setModalCancelRequest(false);
                }}
                onCancel={() => {
                    setModalCancelRequest(false);
                }}
                destroyOnClose={true}
            >
                <div style={{ fontWeight: 'bold' }}>Are you sure?</div>
            </Modal>
        </>
    );
};

export default ViewRequest;
