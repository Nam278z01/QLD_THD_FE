import { InboxOutlined } from '@ant-design/icons';
import { Form, Upload } from 'antd';

const { Dragger } = Upload;

function ImportFile({ onFinish }) {
    const configImportFile = {
        multiple: false,
        maxCount: 1,
        showUploadList: false,
        accept: '.xlsx,.xls'
    };

    const handleChange = (e) => {
        const { status } = e.file;
        if (status !== 'uploading') {
            onFinish(e.file);
        }
    };

    return (
        <Form>
            <Form.Item style={{ margin: 0 }} name="file" valuePropName="fileList" getValueFromEvent={handleChange}>
                <Dragger
                    {...configImportFile}
                    beforeUpload={() => {
                        return false;
                    }}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">Support {configImportFile.accept} extention files.</p>
                </Dragger>
            </Form.Item>
        </Form>
    );
}

export default ImportFile;
