import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Form, Input, InputNumber, message, Row, Space, Typography, Upload } from 'antd';
import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { GetTokenV2Context } from '../../context/GetTokenV2Context';
import { imgServer } from '../../dataConfig';
import { createProduct, updatePersonalShop } from '../../services/ShopAPI';
import UploadImageAntd from '../UploadImageAntd';
import { notBeEmpty } from '../../utils/validator';
const { Title, Text } = Typography;
const cardUserInfoStyle = {
    boxShadow: 'none',
    marginBottom: '1rem'
};
import debounce from 'lodash/debounce';

function SellProduct({ setModalSellProduct, setRefresh, data, userData, setModalEditProduct }) {
    const [form] = Form.useForm();
    const limitImageSize = 200;
    const { account, imgurl, displayName } = useSelector((state) => state.UserSlice);
    const { DepartmentID } = useSelector((state) => state.DepartmentSettingSlice);
    const { getToken, getTokenFormData } = useContext(GetTokenV2Context);
    let imgList = [];
    if (data)
        data.product_imgs.forEach((element, i) => {
            imgList.push({
                name: `Current Image`,
                uid: i,
                status: 'success',
                url: `${imgServer}${element}`
            });
        });
    const [fileList, setFileList] = useState(data ? imgList : null);
    const [imageName, setImageName] = useState(`${data ? data.Image : ''}`);
    const date = new Date();

    function success() {
        if (!data) {
            setModalSellProduct(false);
            setRefresh(new Date());
        } else {
            setModalEditProduct(false);
            setRefresh(new Date());
        }
    }

    const onFinish = (values) => {
        let currentImage = [];

        let newImage = [];
        const { ProductName, Description, Quantity, Price, Image } = values;
        if (typeof values.Image !== 'string')
            if (typeof values.Image == 'object') {
                if (values.Image.fileList !== undefined)
                    values.Image.fileList.forEach((element) => {
                        if (element.url) {
                            currentImage.push('/public/product/' + element.url.split('/public/product/')[1]);
                        } else {
                            newImage.push(element);
                        }
                    });
                else {
                    values.Image.forEach((element) => {
                        if (element.url) {
                            currentImage.push('/public/product/' + element.url.split('/public/product/')[1]);
                        } else {
                            newImage.push(element);
                        }
                    });
                }
            }

        let body;

        // values.Image.fileList.forEach(element => {

        //  listImage.push(element.originFileObj);

        // });

        if (newImage.length == 0) {
            let imageString = '';

            if (values.Image) {
                if (typeof values.Image == 'object') {
                    if (values.Image.fileList !== undefined)
                        values.Image.fileList.forEach((element) => {
                            if (imageString !== '')
                                imageString =
                                    imageString + ',' + '/public/product/' + element.url.split('/public/product/')[1];
                            else {
                                imageString =
                                    imageString + '/public/product/' + element.url.split('/public/product/')[1];
                            }
                        });
                    else {
                        values.Image.forEach((element) => {
                            if (imageString !== '')
                                imageString =
                                    imageString + ',' + '/public/product/' + element.url.split('/public/product/')[1];
                            else {
                                imageString =
                                    imageString + '/public/product/' + element.url.split('/public/product/')[1];
                            }
                        });
                    }
                } else {
                    values.Image.forEach((element) => {
                        if (imageString !== '')
                            imageString =
                                imageString + ',' + '/public/product/' + element.url.split('/public/product/')[1];
                        else {
                            imageString = imageString + '/public/product/' + element.url.split('/public/product/')[1];
                        }
                    });
                }
            }

            body = {
                Name: ProductName,
                Image: imageString,
                Description,
                Quantity,
                Coin: Price,
                Contact: account + '@fpt.com',
                DepartmentID: DepartmentID
                // DepartmentID: DepartmentID,
            };
        } else if (newImage.length !== 0) {
            const formData = new FormData();
            formData.append('currentImage', currentImage);
            formData.append('Name', ProductName);
            values.Image.fileList.forEach((element) => {
                formData.append('Image', element.originFileObj);
            });
            // formData.append("Image", listImage);
            formData.append('Description', Description);
            formData.append('Quantity', Quantity);
            formData.append('Coin', Price);
            formData.append('Contact', account + '@fpt.com');
            formData.append('DepartmentID', DepartmentID);
            body = formData;
        }
        if (data) {
            getToken(updatePersonalShop, 'Update product success!', success, null, body, data.ID);
        } else {
            getTokenFormData(createProduct, 'Product created successfully!', success, null, body);
        }
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
        <div>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={[0, 12]}>
                    <Col span={7}>
                        <Title
                            style={{
                                lineHeight: 1.1,
                                marginBottom: '0.75rem',
                                marginTop: '1.75rem'
                            }}
                            level={5}
                        >
                            Seller
                        </Title>

                        {/* Card User Info */}
                        <Card style={cardUserInfoStyle} bordered={false}>
                            <Card.Meta
                                avatar={<Avatar size={44} src={`${imgServer}${imgurl}`} icon={<UserOutlined />} />}
                                title={<div style={{ fontSize: 16 }}>{displayName}</div>}
                                description={
                                    <Space>
                                        <Text style={{ opacity: 0.6 }}>Current points:</Text>
                                        <Text style={{ fontWeight: 700 }}>{userData ? userData.TotalCoin : ''}</Text>
                                    </Space>
                                }
                            />
                        </Card>
                    </Col>
                </Row>
                <Row gutter={[0, 12]}>
                    <Col span={11}>
                        <Form.Item
                            name="ProductName"
                            label="Product Name"
                            initialValue={data ? data.Name : ''}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter product name'
                                },
                                { validator: notBeEmpty }
                            ]}
                        >
                            <Input placeholder="Enter product name" />
                        </Form.Item>
                    </Col>
                    <Col offset={1} span={12}>
                        <Form.Item
                            name="Price"
                            label="Price"
                            initialValue={data ? data.Coin : ''}
                            rules={[
                                {
                                    required: true,
                                    type: 'number',
                                    message: 'Please enter a valid number'
                                },
                                {
                                    type: 'number',
                                    min: 1,
                                    message: 'Please enter a number larger than 0'
                                }
                            ]}
                        >
                            <InputNumber
                                placeholder="Enter price"
                                onChange={(e) => {}}
                                min={1}
                                style={{ width: '100%' }}
                                type="number"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={11}>
                        <Form.Item
                            name="Quantity"
                            label="Quantity"
                            initialValue={data ? data.Quantity : ''}
                            rules={[
                                {
                                    required: true,
                                    type: 'number',
                                    message: 'Please enter a valid number'
                                },
                                {
                                    type: 'number',
                                    min: 1,
                                    message: 'Please enter a number larger than 0'
                                }
                            ]}
                        >
                            <InputNumber
                                placeholder="Enter quantity"
                                onChange={(e) => {}}
                                min={1}
                                style={{ width: '100%' }}
                                type="number"
                            />
                        </Form.Item>
                    </Col>
                    <Col offset={1} span={12}>
                        <Form.Item name="Description" label="Description" initialValue={data ? data.Description : ''}>
                            <Input placeholder="Enter description" />
                        </Form.Item>
                    </Col>
                    <Col span={11}>
                        <Form.Item
                            label="Image"
                            name="Image"
                            initialValue={fileList}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please choose image'
                                }
                            ]}
                        >
                            <UploadImageAntd id={'uploadImage'} defaultFileList={fileList} quantity={5} form={form}>
                                <Row>
                                    <Col span={8}>
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
                                    </Col>
                                </Row>
                            </UploadImageAntd>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

            {/* Filter */}
            <Row justify="end">
                <div>
                    <Button
                        id="submitButton"
                        size="large"
                        style={{ width: '150px' }}
                        onClick={debounce(() => form.submit(), 500)}
                        type="primary"
                    >
                        {data ? 'Save changes' : 'Sell Product'}
                    </Button>
                </div>
            </Row>

            {/* Form */}
        </div>
    );
}

export default SellProduct;
