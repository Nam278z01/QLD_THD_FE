import { Row, Typography, Upload, Col, Button, message, Input, Form } from 'antd';
import { FLTLogoIcon, FptLogoIcon } from './Icons';
import { useState } from 'react';
function UploadImageAntd({ id, quantity, form, setImgList, defaultFileList }) {
    const limitImageSize = 200;

    const [imageName, setImageName] = useState('');
    function beforeUpload(file) {
        const isLt2M = file.size / 1024 < limitImageSize;
        if (!isLt2M) {
            message.error(`Image must smaller than ${limitImageSize}kb!`);
            return Upload.LIST_IGNORE;
        }
        if (form.getFieldValue('Image').fileList.length == quantity) {
            message.error(`Max image quantity is ${quantity}`);
            return Upload.LIST_IGNORE;
        }

        return false;
    }
    return (
        <Upload
            beforeUpload={beforeUpload}
            maxCount={quantity ? quantity : 1}
            listType="picture"
            multiple
            defaultFileList={defaultFileList}
            id={id}
            accept="image/png, image/jpeg, image/jpg"
            onChange={(e) => {
                if (e.fileList.length == 0) {
                    form.setFieldsValue({ Image: '' });
                    document.getElementById('FileName').value = '';
                    setImageName('');
                } else {
                    document.getElementById('FileName').value = e.fileList[e.fileList.length - 1].name;
                    setImageName(document.getElementById('FileName').value);
                    form.setFieldsValue({ Image: e });
                }
            }}
        >
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
                        style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }}
                        value={imageName}
                        id="FileName"
                        readOnly
                    />
                </Col>{' '}
            </Row>
        </Upload>
    );
}

export default UploadImageAntd;
