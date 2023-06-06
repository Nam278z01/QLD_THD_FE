import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
    Button,
    Card,
    Checkbox,
    Col,
    Form,
    Input,
    InputNumber,
    Modal,
    Radio,
    Row,
    Select,
    Space,
    Typography,
    Upload
} from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import useAuth from '../../Hook/useAuth';
import useRefreshToken from '../../Hook/useRefreshToken';
import UploadContent from '../../components/UploadContent';
import SubDepartmentSetting from '../../components/User/SubDepartmentSetting';
import { GetTokenV2Context } from '../../context/GetTokenV2Context';
import { imgServer } from '../../dataConfig';
import { getAllDepartmentGroupChild } from '../../services/GroupChildAPI';
import { getYearList } from '../../services/LeaderBoardAPI';
import { getSetting, saveSetting, updSetting } from '../../services/SettingAPI';
import { getValueFromEvent } from '../../utils/upload';
import ErrorPage from '../ErrorPage';
import { IMAGE_LIMIT_SIZE } from '../../constants/upload';

const { Title } = Typography;

const viewMode = ['Public', 'Private'];
const topStaff = [1, 3, 5];
const allowMinus = [
    { value: 1, label: 'Yes' },
    { value: 2, label: 'No' }
];
const SettingCard = styled(Card)`
    & {
        margin-bottom: 1.5rem;
    }
    &.ant-card .ant-card-head {
        padding: 1rem;
        min-height: auto;
    }
    &.ant-card .ant-card-body .ant-form-item {
        margin-bottom: 1rem;
    }
    &.ant-card .ant-card-body .ant-form-item.mb-0 {
        margin-bottom: 0;
    }
`;
const InputNumberKper = styled(InputNumber)`
    & {
        width: 79px;
    }
`;
const deleteIconStyle = {
    position: 'relative',
    top: 4,
    color: '#999',
    fontSize: 20,
    cursor: 'pointer',
    transition: 'all 0.3s'
};

function Setting() {
    const { isHead, isDefaultHead } = useAuth();
    const { DepartmentID, Name, Code, IsFsu } = useSelector((a) => a.DepartmentSettingSlice);
    const [form] = Form.useForm();
    const isKper = Form.useWatch('IsKper', form);
    const logoValue = Form.useWatch('Logo', form);
    const { getTokenFormData } = useContext(GetTokenV2Context);
    const [depaSetting, setRefreshDepaSetting] = useRefreshToken(getSetting, DepartmentID);
    const [subDepartment, setRefreshSubDepa] = useRefreshToken(getAllDepartmentGroupChild, DepartmentID);
    const [yearList] = useRefreshToken(getYearList);
    const [isNewSetting, setNewSetting] = useState(true);
    const [openModalSubDepa, setOpenModalSubDepa] = useState(false);
    const [selectedDepaCode, setSelectedDepaCode] = useState(null);
    const [uploadErrors, setUploadErrors] = useState([]);
    const [errorSumKper, setErrorSumKper] = useState('');
    const configUploadLogo = {
        multiple: false,
        listType: 'picture',
        maxCount: 1,
        limitSize: IMAGE_LIMIT_SIZE,
        accept: 'image/png, image/jpeg, image/jpg',
        beforeUpload: (file) => {
            let limitSize = IMAGE_LIMIT_SIZE;
            const isInvalidSize = file.size / 1024 >= limitSize;
            setUploadErrors([]);
            if (isInvalidSize) {
                setUploadErrors([`Exist file more than ${limitSize}kB`]);
                return Upload.LIST_IGNORE;
            }
            return false;
        }
    };
    let defaultSetting = {
        Logo: [],
        Name: Name,
        Code: Code,
        ViewMode: 'Private',
        MaxTopNumber: 5,
        AllowMinus: 1,
        ConversionRatio: 1,
        PointName: 'Point',
        CoinName: 'Coin',
        RankingIntern: 0
    };

    const getYears = () => {
        let years = [];
        const curYear = new Date().getFullYear();
        let maxNumYear = 50000;

        for (let index = curYear - 1; index < curYear + maxNumYear; index++) {
            years.push({ value: index + 1, label: `${index + 1}` });
        }

        return years;
    };
    const getMonths = () => {
        let months = [];
        let minMonth = 12;

        for (let index = 0; index < minMonth; index++) {
            months.push({ value: index + 1, label: `${index + 1}` });
        }

        return months;
    };

    useEffect(() => {
        if (depaSetting && depaSetting !== 'NO DATA') {
            setNewSetting(false);
            let logoDepa = [
                {
                    uid: 0,
                    name: depaSetting.Logo,
                    url: `${imgServer}${depaSetting.Logo}`,
                    thumbUrl: `${imgServer}${depaSetting.Logo}`
                }
            ];
            defaultSetting = {
                ...depaSetting,
                Logo: logoDepa,
                Name: depaSetting.Department.Name,
                Code: depaSetting.Department.Code,
                Slogan: depaSetting.Department.Slogan
            };
            form.setFieldsValue(defaultSetting);
        } else {
            setNewSetting(true);
            form.setFieldsValue(defaultSetting);
        }
    }, [depaSetting]);

    const handleResetData = () => {
        setRefreshDepaSetting(new Date());
    };

    const handleChangeSubDepa = (depaCode) => {
        setSelectedDepaCode(depaCode);
        setOpenModalSubDepa(true);
    };

    const callbackSuccess = (res) => {
        const depaCode = res.Department.Code.split(' ').join('.');
        window.location.assign(`/${depaCode}/setting`);
        setRefreshDepaSetting(new Date());
    };

    const handleFinish = (values) => {
        const formData = new FormData();
        for (var key of Object.keys(values)) {
            if (key === 'Logo') {
                formData.append(key, values[key][0].originFileObj);
            } else if (key === 'WorkingTime') {
                if (values.WorkingTime) {
                    formData.append(key, JSON.stringify(values[key]));
                } else {
                    formData.append(key, JSON.stringify([]));
                }
            } else {
                formData.append(key, values[key]);
            }
        }
        formData.append('DepartmentID', DepartmentID);
        getTokenFormData(
            isNewSetting ? saveSetting : updSetting,
            'Setting has been updated',
            callbackSuccess,
            null,
            formData,
            DepartmentID
        );
    };

    const validateRankNumber = ({ getFieldValue, isFieldTouched }) => ({
        validator(_, value) {
            let rankAPlus = getFieldValue('RankA_plus');
            let rankA = getFieldValue('RankA');
            let rankB = getFieldValue('RankB');
            let rankC = getFieldValue('RankC');
            let rankD = getFieldValue('RankD');
            if (rankAPlus + rankA + rankB + rankC + rankD === 100) {
                setErrorSumKper('');
                return Promise.resolve();
            }
            setErrorSumKper('Kper must total 100%');
        }
    });

    return isHead && isDefaultHead ? (
        <>
            <Form
                form={form}
                labelCol={{ span: 6 }}
                labelWrap
                labelAlign="left"
                style={{ margin: '1rem 2.5rem' }}
                onFinish={handleFinish}
            >
                <Title style={{ lineHeight: 1.1, marginBottom: '1rem' }} level={3}>
                    {isNewSetting ? 'Department' : depaSetting.Department?.Name} Setting
                </Title>

                <SettingCard title="Department Detail">
                    <Row gutter={[{ lg: 220, md: 100 }, 16]}>
                        <Col xs={24} md={12}>
                            <Form.Item label="Department Name" name="Name">
                                <Input type="text" min={3} max={250} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Department Code"
                                name="Code"
                                rules={[{ required: true, message: 'Department Code is required' }]}
                            >
                                <Input type="text" min={3} max={250} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Slogan" name="Slogan">
                                <Input.TextArea type="textarea" rows={3} min={0} max={250} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item className="mb-0" label="View Mode" name="ViewMode">
                                <Select options={viewMode.map((item) => ({ value: item, label: `${item}` }))} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Logo Department"
                                name="Logo"
                                rules={[{ required: true, message: 'Logo Department is required' }]}
                                valuePropName="fileList"
                                getValueFromEvent={getValueFromEvent}
                            >
                                <Upload className="ant-upload-custom" {...configUploadLogo}>
                                    <UploadContent value={logoValue} errors={uploadErrors} />
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </SettingCard>
                {IsFsu === 1 && subDepartment && (
                    <SettingCard title="Sub Department">
                        <Row gutter={[20, 16]}>
                            {subDepartment.map((item, i) => (
                                <Col key={i}>
                                    <Button type="primary" onClick={() => handleChangeSubDepa(item.Code)}>
                                        {item.Code}
                                    </Button>
                                </Col>
                            ))}
                        </Row>
                    </SettingCard>
                )}
                <SettingCard title="SMTP Setting">
                    <Row gutter={[{ lg: 220, md: 100 }, 16]}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="SMTPServer"
                                name="SMTPServer"
                                initialValue={''}
                                rules={[{ required: true, message: 'SMTPServer is required' }]}
                            >
                                <Input type="text" min={0} max={250} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Account"
                                name="SMTPUsername"
                                initialValue={''}
                                rules={[
                                    { required: true, message: 'Account is required' },
                                    { type: 'email', message: 'SMTPServer is email format' }
                                ]}
                            >
                                <Input type="text" max={250} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                className="mb-0"
                                label="Port"
                                name="SMTPPort"
                                initialValue={''}
                                rules={[{ required: true, message: 'Port is required' }]}
                            >
                                <InputNumber style={{ width: '100%' }} min={1} max={250} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                className="mb-0"
                                label="Password"
                                initialValue={''}
                                rules={[{ required: true, message: 'Password is required' }]}
                            >
                                <Input.Password min={6} placeholder={'••••••••••••••'} visibilityToggle={false} />
                            </Form.Item>
                        </Col>
                    </Row>
                </SettingCard>
                <SettingCard title="Ranking Setting">
                    <Row gutter={[{ lg: 220, md: 100 }, 16]}>
                        <Col xs={24} md={12}>
                            <Form.Item label="Point Name" name="PointName">
                                <Input type="text" min={0} max={250} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item label="Coin Name" name="CoinName">
                                <Input type="text" min={0} max={250} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Convert Rate"
                                name="ConversionRatio"
                                rules={[{ required: true, message: 'Convert Rate is required' }]}
                            >
                                <InputNumber style={{ width: '100%' }} min={0} max={9} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Top Employees" name="MaxTopNumber" initialValue={1}>
                                <Select options={topStaff.map((item) => ({ value: item, label: `${item}` }))} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Allow Minus" name="AllowMinus" style={{ maxHeight: 40 }}>
                                <Select options={allowMinus} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Ranking For"
                                name="RankingIntern"
                                rules={[{ required: true, message: 'Ranking For is required' }]}
                            >
                                <Radio.Group defaultValue={0}>
                                    <Radio value={1}>SVTT/OJT & NVCT</Radio>
                                    <Radio value={0}>NVCT</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Request Expiration Date"
                                name="ValidDistantTime"
                                rules={[{ required: true, message: 'Request Expiration Date is required' }]}
                            >
                                <InputNumber style={{ width: '100%' }} min={0} max={720} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item label="Setting Kper">
                                <Form.Item
                                    valuePropName="checked"
                                    name="IsKper"
                                    // style={!isKper ? { marginBottom: '0' } : {}}
                                >
                                    <div style={{ marginTop: '0.5rem' }}>
                                        <Checkbox checked={isKper} id="checkbox" />
                                        <label htmlFor="checkbox" style={{ marginLeft: '0.5rem', cursor: 'pointer' }}>
                                            Show kper (%)
                                        </label>
                                    </div>
                                </Form.Item>
                               
                            </Form.Item>
                        </Col>
                        <Col xs={{span:24,order: 1}} md={{span:12,order: 2}} >
                            <Form.Item style={{marginLeft:'25%'}}>
                                 {isKper && (
                                    <Row gutter={[16, 16]} align="middle">
                                        <Col>
                                            <Form.Item
                                                label="A+"
                                                name="RankA_plus"
                                                rules={
                                                    isKper
                                                        ? [
                                                              { required: true, message: 'Rank A+ is required' },
                                                              validateRankNumber
                                                          ]
                                                        : []
                                                }
                                            >
                                                <InputNumberKper min={0} max={100} />
                                            </Form.Item>
                                        </Col>
                                        <Col>
                                            <Form.Item
                                                label="A"
                                                name="RankA"
                                                rules={
                                                    isKper
                                                        ? [
                                                              { required: true, message: 'Rank A is required' },
                                                              validateRankNumber
                                                          ]
                                                        : []
                                                }
                                            >
                                                <InputNumberKper min={0} max={100} />
                                            </Form.Item>
                                        </Col>
                                        <Col>
                                            <Form.Item
                                                label="B"
                                                name="RankB"
                                                rules={
                                                    isKper
                                                        ? [
                                                              { required: true, message: 'Rank B is required' },
                                                              validateRankNumber
                                                          ]
                                                        : []
                                                }
                                            >
                                                <InputNumberKper min={0} max={100} />
                                            </Form.Item>
                                        </Col>
                                        <Col>
                                            <Form.Item
                                                label="C"
                                                name="RankC"
                                                rules={
                                                    isKper
                                                        ? [
                                                              { required: true, message: 'Rank C is required' },
                                                              validateRankNumber
                                                          ]
                                                        : []
                                                }
                                            >
                                                <InputNumberKper min={0} max={100} />
                                            </Form.Item>
                                        </Col>
                                        <Col>
                                            <Form.Item
                                                label="D"
                                                name="RankD"
                                                rules={
                                                    isKper
                                                        ? [
                                                              { required: true, message: 'Rank D is required' },
                                                              validateRankNumber
                                                          ]
                                                        : []
                                                }
                                            >
                                                <InputNumberKper min={0} max={100} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                )}
                                {errorSumKper && <div className="ant-form-item-explain-error">{errorSumKper}</div>}
                            </Form.Item>
                        </Col>
                        <Col xs={{span:24,order: 2}} md={{span:12,order: 1}} >
                            <Form.Item label="Working Time">
                                <Form.List
                                    name="WorkingTime"
                                    rules={[
                                        {
                                            validator: async (_, workingTimes) => {
                                                const wTimes = workingTimes
                                                    ?.filter((item) => !!item)
                                                    .map((item) => {
                                                        return item.Year + item.Month;
                                                    });

                                                const hasDuplicate = wTimes?.some((item) => {
                                                    return wTimes?.indexOf(item) !== wTimes?.lastIndexOf(item);
                                                });

                                                if (hasDuplicate) {
                                                    return Promise.reject(
                                                        new Error('Exist year-month value duplicate')
                                                    );
                                                }
                                            }
                                        }
                                    ]}
                                >
                                    {(fields, { add, remove }, { errors }) => (
                                        <>
                                            <div style={{ maxHeight: 240, overflow: 'auto', overflowX: 'hidden' }}>
                                                {fields.map(({ key, name, ...restField }, i) => (
                                                    <div key={i}>
                                                        <Row gutter={16}>
                                                            <Col span={7}>
                                                                <Form.Item
                                                                    {...restField}
                                                                    className="mb-0"
                                                                    name={[name, 'Year']}
                                                                    rules={[
                                                                        { required: true, message: 'Year is required' }
                                                                    ]}
                                                                >
                                                                    <InputNumber
                                                                        min={new Date().getFullYear()}
                                                                        max={50000}
                                                                        style={{ width: '100%' }}
                                                                        placeholder="Year"
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={7}>
                                                                <Form.Item
                                                                    {...restField}
                                                                    className="mb-0"
                                                                    name={[name, 'Month']}
                                                                    rules={[
                                                                        { required: true, message: 'Month is required' }
                                                                    ]}
                                                                >
                                                                    <Select options={getMonths()} placeholder="Month" />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={7}>
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[name, 'WorkDateNumber']}
                                                                    rules={[
                                                                        {
                                                                            required: true,
                                                                            message: 'Work Date Number is required'
                                                                        }
                                                                    ]}
                                                                >
                                                                    <InputNumber
                                                                        min={1}
                                                                        max={31}
                                                                        style={{ width: '100%' }}
                                                                        placeholder="Work Date Number"
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col>
                                                                <DeleteOutlined
                                                                    style={deleteIconStyle}
                                                                    onClick={() => remove(name)}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                ))}
                                            </div>
                                            <Form.Item>
                                                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                                    Add Working Time
                                                </Button>
                                            </Form.Item>
                                            <Form.Item>
                                                <Form.ErrorList errors={errors} />
                                            </Form.Item>
                                        </>
                                    )}
                                </Form.List>
                            </Form.Item>
                        </Col>
                       
                    </Row>
                </SettingCard>
                <Row justify="end" align="middle">
                    <Space>
                        <Button size="large" htmlType="button" onClick={handleResetData}>
                            Reset
                        </Button>
                        <Button size="large" type="primary" htmlType="submit">
                            Save changes
                        </Button>
                    </Space>
                </Row>
            </Form>

            <Modal
                title="Edit Sub Department"
                centered
                open={openModalSubDepa}
                footer={null}
                width={500}
                onCancel={() => setOpenModalSubDepa(false)}
                afterClose={() => {
                    setSelectedDepaCode(null);
                    setOpenModalSubDepa(false);
                }}
                destroyOnClose
            >
                <SubDepartmentSetting
                    departmentCode={selectedDepaCode}
                    setRefreshSubDepa={setRefreshSubDepa}
                    setOpenModalSubDepa={setOpenModalSubDepa}
                />
            </Modal>
        </>
    ) : (
        <ErrorPage
            title="The page you were looking for is not found!"
            desc="You may have mistyped the address or the page may have moved."
        />
    );
}

export default Setting;
