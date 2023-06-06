import { Button, Form, Upload } from 'antd';
import { useEffect, useState } from 'react';
import UploadContent from '../../components/UploadContent';
import { imgServer } from '../../dataConfig';
import { getValueFromEvent } from '../../utils/upload';
import { IMAGE_LIMIT_SIZE } from '../../constants/upload';

function HomePage() {
    const fileList = [
        {
            uid: 0,
            name: 'product-1675912333671.png',
            url: `${imgServer}/public/product/product-1675912333671.png`,
            thumbUrl: `${imgServer}/public/product/product-1675912333671.png`
        },
        {
            uid: 1,
            name: 'product-1675912333671.png',
            url: `${imgServer}/public/product/product-1675912333671.png`,
            thumbUrl: `${imgServer}/public/product/product-1675912333671.png`
        }
    ];
    const singleFileList = [
        {
            uid: 0,
            name: 'jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            url: `https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png`,
            thumbUrl: `https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png`
        }
    ];

    const [errors, setErrors] = useState([]);
    const configUploadFile = {
        multiple: true,
        listType: 'picture',
        maxCount: 10,
        accept: 'image/png, image/jpeg, image/jpg',
        beforeUpload: (file) => {
            let limitSize = IMAGE_LIMIT_SIZE;
            const isInvalidSize = file.size / 1024 >= limitSize;
            setErrors([]);
            if (isInvalidSize) {
                setErrors([`Exist file more than ${limitSize}kB`]);
                return Upload.LIST_IGNORE;
            }
            return false;
        }
    };

    const configImportFile = {
        multiple: false,
        maxCount: 1,
        showUploadList: false,
        accept: '.xlsx,.xls',
        isDragAndDrop: true
    };

    const [form] = Form.useForm();
    const uploadValue = Form.useWatch('upload', form);

    useEffect(() => {
        form.setFieldsValue({
            upload: singleFileList,
            upload2: singleFileList
        });
    }, []);

    const onFinish = (values) => {
        console.log(values);
    };

    const handleImport = (file) => {
        console.log(file);
    };

    return (
        <div style={{ padding: '2rem' }}>
            <Form form={form} onFinish={onFinish}>
                <Form.Item name="upload" valuePropName="fileList" getValueFromEvent={getValueFromEvent}>
                    <Upload className="ant-upload-custom" {...configUploadFile}>
                        <UploadContent value={uploadValue} errors={errors} />
                    </Upload>
                </Form.Item>

                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form>
            <br />
            {/* <ImportFile onFinish={handleImport} /> */}
        </div>
    );
}

export default HomePage;
