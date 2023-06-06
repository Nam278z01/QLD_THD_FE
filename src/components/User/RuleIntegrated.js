import { Button, Form, Input, Row, Select } from 'antd';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { GetTokenV2Context } from '../../context/GetTokenV2Context';
import { updateRuleIntegrate, updateRuleStatus } from '../../services/RuleAPI';
import debounce from 'lodash/debounce';
function RuleIntegrated(props) {
    const [form] = Form.useForm();
    const { DepartmentID, PointName } = useSelector((a) => a.DepartmentSettingSlice);
    const { getToken } = useContext(GetTokenV2Context);

    const callbackFinish = () => {
        props.setModalIntegrate(false);
        props.setRefreshdata(new Date());
        props.setRefresh(new Date());
    };

    const handleFinish = (values) => {
        const { RuleFsu } = values;
        let body = {
            DepartmentID: DepartmentID,
            Integrate: RuleFsu
        };
        getToken(updateRuleIntegrate, 'The integrate rule has been updated', callbackFinish, null, body, props.data.ID);
    };

    const handleSelectChange = (value) => {
        form.setFieldsValue({
            PointFsu: props.RuleFsu ? props.RuleFsu.ruleData.filter((e) => e.ID === value).map((e) => e.Point)[0] : ''
        });
    };

    const disintegrate = () => {
        let body = {
            Integrate: null
        };
        getToken(
            updateRuleStatus,
            ' The disintegrate rule has been updated',
            callbackFinish,
            null,
            body,
            props.data.ID
        );
    };

    const initialValueForm = () => {
        return {
            Rule: props.data ? props.data.RuleName : '',
            Point: props.data ? PointName + ' of rule: ' + props.data.Point : '',
            PointFsu:
                props.data.Integrate && props.RuleFsu.ruleData
                    ? props.RuleFsu.ruleData.filter((e) => e.ID === props.data.Integrate).map((e) => e.Point)[0]
                    : '',
            RuleFsu:
                props.data.Integrate && props.RuleFsu.ruleData
                    ? props.RuleFsu.ruleData.filter((e) => e.ID === props.data.Integrate).map((e) => e.value)[0]
                    : ''
        };
    };

    return (
        <Form
            form={form}
            style={{ marginTop: '2rem' }}
            layout="vertical"
            onFinish={debounce(handleFinish, 500)}
            initialValues={initialValueForm()}
        >
            <Form.Item name="Rule" label="Rule">
                <Input type="text" disabled={true} />
            </Form.Item>
            <Form.Item name="Point" label="Point">
                <Input type="text" disabled={true} />
            </Form.Item>
            <Form.Item name="RuleFsu" label="Rule Fsu" rules={[{ required: true, message: 'Please choose Rule!' }]}>
                <Select
                    showSearch
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    notFoundContent="Not Found"
                    placeholder="Please choose Rule!"
                    options={props.RuleFsu.ruleData}
                    onChange={handleSelectChange}
                />
            </Form.Item>
            <Form.Item name="PointFsu" id="PointFsu" label="Point">
                <Input type="text" disabled={true} />
            </Form.Item>

            <Row justify="end">
                <Button size="large" type="primary" htmlType="submit" style={{ width: 150 }}>
                    Save
                </Button>
                {props.data.Integrate && (
                    <Row justify="end">
                        <Button
                            size="large"
                            type="primary"
                            htmlType="button"
                            danger
                            style={{ width: 150, marginLeft: 10 }}
                            onClick={debounce(disintegrate, 500)}
                        >
                            Disintegrate
                        </Button>
                    </Row>
                )}
            </Row>
        </Form>
    );
}

export default RuleIntegrated;
