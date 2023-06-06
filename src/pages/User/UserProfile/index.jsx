import {
    Avatar,
    Button,
    Col,
    Form,
    Modal,
    Radio,
    Row,
    Space,
    Typography,
    Upload,
    Image,
    Card,
    Tooltip,
    message
} from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import FromUserProfileConfig from '../../../components/CreateAndEditFormConfig';
import { GetTokenV2Context } from '../../../context/GetTokenV2Context';
import useRefreshToken from '../../../Hook/useRefreshToken';
import {
    getUserProfileInforData,
    updateUserProfileInfomation,
    getUserMasterPic
} from '../../../services/UsermasterAPI';
import { uploadUserAvatarProfile } from '../../../services/ImportAPI';
import { imgServer } from '../../../dataConfig';
import {
    BuSeeProfile,
    CameraButtonUploadImg,
    CloudUploadImage,
    DividerVector,
    EveryoneSeeProfile,
    OnlymeSeeProfile
} from '../../../components/Icons';
import { QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';
import { setUserAvatar } from '../../../store/UserSlice';
import './style.scss';
import { RightOutlined } from '@ant-design/icons';
import LeaderboardVote from '../../../components/User/LeaderboardVote';
import debounce from 'lodash/debounce';
import { IMAGE_LIMIT_SIZE } from '../../../constants/upload';
import { tr } from 'date-fns/locale';

const { Title, Text } = Typography;

const contantTextViewModeObject = {
    OnlyMe: 1,
    Bu: 2,
    Everyone: 3
};
const convertTextViewMode = [
    {
        label: 'Only me',
        value: contantTextViewModeObject.OnlyMe
    },
    {
        label: 'Bu',
        value: contantTextViewModeObject.Bu
    },
    {
        label: 'Everyone',
        value: contantTextViewModeObject.Everyone
    }
];

const badgeStyle = {
    position: 'relative'
};

function UserProfile() {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    let { id } = useParams();
    const [userProfileData, setUserProfileData] = useState([]);
    const { userID, account, userDepartmentID } = useSelector((state) => state.UserSlice);
    const { DepartmentID } = useSelector((state) => state.DepartmentSettingSlice);
    const { getToken, getTokenFormData } = useContext(GetTokenV2Context);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [valueRadioStatus, setValueRadioSatus] = useState(contantTextViewModeObject.OnlyMe);
    const [isOpenUpload, setIsOpenUpload] = useState(false);
    const [isModalNicknameOpen, setIsModalNicknameOpen] = useState(false);
    const [isDataChange, setDataChange] = useState(false);
    const [invalidAvatar, setInvalidAvatar] = useState(true);

    const isMyAccount = (id && id === userID.toString()) || !id;
    const [isSameDepartment, setSameDepartment] = useState(false);
    const [viewMode, setViewMode] = useState(false);

    const handleChange = ({ fileList }) => {
        const file = fileList[0].originFileObj;
        const isInvalidSize = file.size / 1024 >= IMAGE_LIMIT_SIZE;
        if (isInvalidSize) {
            message.error(`Image must smaller than ${IMAGE_LIMIT_SIZE}kb!`);
            return;
        }
        let formData = new FormData();
        formData.append('image', fileList[0].originFileObj);
        getTokenFormData(
            uploadUserAvatarProfile,
            'Avatar had been updated',
            handleCallbackGetAvatar,
            null,
            formData,
            account,
            DepartmentID
        );
    };
    const userId = id ? id : userID;

    const [data, setRefresh] = useRefreshToken(getUserProfileInforData, userId);
    const handleCallbackGetAvatar = (data) => {
        setRefresh(new Date());
        setIsOpenUpload(false);
        dispatch(setUserAvatar(data.imageUrl));
    };
    useEffect(() => {
        if (data) {
            setUserProfileData(data);
            setSameDepartment(data.DepartmentID === userDepartmentID);
            setViewMode(data.ViewMode);
            setValueRadioSatus(data.ViewMode);
            form.setFieldsValue(data);
        }
    }, [data]);

    const handleCallbackGetInFoUser = () => {
        form.setFieldsValue();
        setRefresh(new Date());
    };
    const handleSubmitform = (data) => {
        const formData = {
            ...data,
            ViewMode: valueRadioStatus
        };
        getToken(
            updateUserProfileInfomation,
            'Change new information successfully!',
            handleCallbackGetInFoUser,
            null,
            formData,
            userId
        );
    };

    const handleSaveChangeInfo = () => {
        form.submit();
    };

    const handleShowModalSelect = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setValueRadioSatus(data ? data.ViewMode : contantTextViewModeObject.OnlyMe);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const onChange = (e) => {
        setValueRadioSatus(e.target.value);
    };

    const handleUploadAvatar = () => {
        setIsOpenUpload(true);
    };
    const handleCancelShowUpload = () => {
        setIsOpenUpload(false);
    };
    const handleOkUpload = () => {
        setIsOpenUpload(false);
    };

    const handleModalNickname = () => {
        setIsModalNicknameOpen(true);
    };

    return (
        <div style={{ margin: '1rem 5rem' }}>
            {/* Breadcrumb */}
            {/* <BreadcrumbApp/> */}
            <Title style={{ lineHeight: 1.1, margin: 0, marginBottom: '1rem' }} level={3}>
                User Profile
            </Title>
            <div>
                <div className="item-flex">
                    <div className="form-image">
                        <Card>
                            <div className="flex-image">
                                <div className="box-image">
                                    {
                                        <Avatar
                                            className="image-profile"
                                            src={`${imgServer}${data?.Avatar}`}
                                            icon={<UserOutlined />}
                                        />
                                    }
                                    {isMyAccount && (
                                        <CameraButtonUploadImg className="icon-camera" onClick={handleUploadAvatar} />
                                    )}
                                </div>
                            </div>
                            <div className="col-item">
                                <span className="name-user">{data?.DisplayName}</span>
                                {data?.TopNickName?.Name && (
                                    <span className="back-home">
                                        <span className="nickname-user"># {data?.TopNickName?.Name}</span>{' '}
                                    </span>
                                )}
                                <div className="form-element" style={{ marginBottom: '1rem' }}>
                                    <div style={{ cursor: 'pointer' }} onClick={handleModalNickname}>
                                        {data?.TotalNickName ? (
                                            <span>
                                                {data.TotalNickName - 1} Other{' '}
                                                {data.TotalNickName - 1 > 1 ? 'Nicknames' : 'Nickname'}
                                            </span>
                                        ) : (
                                            <span>0 Other Nickname</span>
                                        )}
                                        <RightOutlined style={{ width: 10, marginLeft: 4 }} />
                                    </div>
                                </div>
                                <div className="form-element">
                                    <p className="item-question">Who can see my profile?</p>
                                    {(id && id == userID) || !id ? (
                                        <Button className="btn-select" onClick={handleShowModalSelect}>
                                            <Typography className="text-select">
                                                {
                                                    convertTextViewMode.find((item) => item.value == valueRadioStatus)
                                                        ?.label
                                                }
                                            </Typography>
                                        </Button>
                                    ) : (
                                        <Button className="btn-select">
                                            <Typography className="text-select">
                                                {data?.ViewMode === 1
                                                    ? 'Only me'
                                                    : data?.ViewMode === 2
                                                    ? 'BU'
                                                    : data?.ViewMode === 3
                                                    ? 'Everyone'
                                                    : ''}
                                            </Typography>
                                        </Button>
                                    )}
                                </div>
                                <div>
                                    <DividerVector />
                                    <div>
                                    {data?.ImageURL.length != 0 &&  <div className="text-badges">Medals</div>}
                                       
                                        <div className="badges-list-item">
                                            <Row style={{ justifyContent: 'space-around' }} gutter={10}>
                                                {data?.ImageURL.map((item, i) => (
                                                    <Col key={i} flex={`60px`} style={{ marginBottom: '5px' }}>
                                                        {item && (
                                                            <>
                                                                <Tooltip color="#321B85" title={item.Description}>
                                                                    <div style={badgeStyle}>
                                                                        <Image
                                                                            height={50}
                                                                            width={50}
                                                                            key={i}
                                                                            src={`${imgServer}${item.ImageURL}`}
                                                                            preview={false}
                                                                        />
                                                                    </div>
                                                                </Tooltip>
                                                            </>
                                                        )}
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>
                                    </div>
                                    <div></div>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="form-item-info">
                        <div className="content-infomation">
                            <FromUserProfileConfig
                                form={form}
                                handleSubmitform={handleSubmitform}
                                viewMode={viewMode}
                                isMyAccount={isMyAccount}
                                isSameDepartment={isSameDepartment}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className="form-button">
                    {!isMyAccount ? (
                        <Button style={{ display: 'none' }}></Button>
                    ) : (
                        <Button size="large" type="primary" onClick={debounce(handleSaveChangeInfo, 300)}>
                            Save Changes
                        </Button>
                    )}
                </div>
                <Modal
                    className="custom-modal"
                    title="Select Audience"
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="Done"
                    footer={[
                        <Button className="btn-cancel" onClick={handleCancel}>
                            Cancel
                        </Button>,
                        <Button className="btn-confirm" onClick={handleOk}>
                            Done
                        </Button>
                    ]}
                >
                    <Radio.Group onChange={onChange} value={valueRadioStatus} className="radio-group-custom">
                        <Space direction="vertical">
                            <Radio
                                style={{
                                    backgroundColor:
                                        valueRadioStatus === contantTextViewModeObject.OnlyMe ? '#F3F0FD' : '#ffffff'
                                }}
                                value={contantTextViewModeObject.OnlyMe}
                            >
                                <OnlymeSeeProfile className="icon-only" />
                                Only Me
                            </Radio>
                            <Radio
                                style={{
                                    backgroundColor:
                                        valueRadioStatus === contantTextViewModeObject.Bu ? '#F3F0FD' : '#ffffff'
                                }}
                                value={contantTextViewModeObject.Bu}
                            >
                                <BuSeeProfile className="icon" />
                                BU
                            </Radio>
                            <Radio
                                style={{
                                    backgroundColor:
                                        valueRadioStatus === contantTextViewModeObject.Everyone ? '#F3F0FD' : '#ffffff'
                                }}
                                value={contantTextViewModeObject.Everyone}
                            >
                                <EveryoneSeeProfile className="icon" />
                                Everyone
                            </Radio>
                        </Space>
                    </Radio.Group>
                </Modal>
                <Modal
                    title="See All Nicknames"
                    centered
                    width={600}
                    open={isModalNicknameOpen}
                    onCancel={() => setIsModalNicknameOpen(false)}
                    footer={false}
                    afterClose={() => {
                        isDataChange && setRefresh(new Date());
                        setDataChange(false);
                    }}
                    destroyOnClose
                >
                    <LeaderboardVote user={data} setDataChange={setDataChange} />
                </Modal>
                <Modal
                    title=""
                    footer={null}
                    open={isOpenUpload}
                    onOk={handleOkUpload}
                    onCancel={handleCancelShowUpload}
                >
                    <div className="form-upload">
                        <div>
                            <CloudUploadImage />
                        </div>
                        <p className="drap-drop">Drag and drop</p>
                        <p style={{ height: '8px', color: '#667085', marginBottom: '10px' }}>or</p>
                        <Upload
                            name="Avatar"
                            className="avatar-uploader"
                            showUploadList={false}
                            accept="image/png, image/jpeg, image/jpg"
                            limitSize={IMAGE_LIMIT_SIZE}
                            beforeUpload={() => false}
                            maxCount={1}
                            onChange={handleChange}
                        >
                            <div className="text-choose-file">Choose file</div>
                        </Upload>
                    </div>
                </Modal>
            </div>
        </div>
    );
}

export default UserProfile;
