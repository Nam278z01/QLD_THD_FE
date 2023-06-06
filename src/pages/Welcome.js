import { Col, Grid, Row, Select, Space, theme, Typography } from 'antd';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import bgWelcome from '../assets/images/bg_welcome.svg';
import { AkaLogo2Icon } from '../components/Icons';
import { imgServer } from '../dataConfig';
import useRefreshToken from '../Hook/useRefreshToken';
import { getAllDepartment } from '../services/DepartmentAPI';

const { useBreakpoint } = Grid;
const bgStyle = {
    textAlign: 'center',
    height: '100vh'
};
const groupBtn = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
};
const haftHeightStyle = {
    height: '50%'
};
const fullHeightStyle = {
    width: '100%',
    height: '100vh'
};
const appNameStyle = {
    fontWeight: 700,
    wordBreak: 'unset',
    marginTop: '1.5rem'
};
const selectDeptStyle = {
    color: '#344054',
    fontWeight: 600,
    marginBottom: '2rem'
};

function Welcome() {
    const {
        token: { colorPrimary }
    } = theme.useToken();
    const { xs, sm, md, lg } = useBreakpoint();
    const [department, setDepartment] = useState([]);
    const [depData] = useRefreshToken(getAllDepartment);
    const CustomSelect = styled(Select)`
        &.ant-select {
            width: 300px;
        }

        &.ant-select .ant-select-selector {
            border-radius: 40px;
            border-color: ${colorPrimary};
            text-align: left;
        }

        &.ant-select .ant-select-arrow {
            color: ${colorPrimary};
        }
    `;

    useEffect(() => {
        setDepartment(depData ? depData : []);
    }, [depData]);

    const onDepChange = (depValue) => {
        const depCode = depValue.split(',')[0].split(' ').join('.');
        const isAuthorized = depValue.split(',')[1];
        localStorage.setItem('deptAuth', isAuthorized);
        window.location.assign(`/${depCode}`);
    };

    return (
        <Row justify="space-between" align="middle" style={bgStyle}>
            {lg && (
                <Col lg={14}>
                    <img style={fullHeightStyle} src={bgWelcome} />
                </Col>
            )}
            <Col xs={24} lg={10} style={xs || sm || md ? haftHeightStyle : {}}>
                <div style={groupBtn}>
                    <AkaLogo2Icon />
                    <Typography.Text style={{ ...appNameStyle, color: colorPrimary, fontSize: xs ? 30 : 50 }}>
                        Welcome to F-Reward
                    </Typography.Text>
                    <Typography.Title level={5} style={selectDeptStyle}>
                        Please select a department
                    </Typography.Title>
                    <CustomSelect
                        size="large"
                        dropdownMatchSelectWidth={false}
                        optionLabelProp="label"
                        placeholder="Please select a department"
                        onChange={onDepChange}
                    >
                        {department.map((depItem) => (
                            <Select.Option
                                key={depItem.Code}
                                value={`${depItem.Code},${depItem.isAuthorized}`}
                                label={
                                    <Space>
                                        <img
                                            style={{ marginBottom: '0.25rem', maxWidth: 64, height: 24 }}
                                            src={`${imgServer}${depItem.Logo}`}
                                        />
                                        {depItem.Code}
                                    </Space>
                                }
                            >
                                <Space>
                                    <img style={{ maxWidth: 64, height: 24 }} src={`${imgServer}${depItem.Logo}`} />
                                    {depItem.Code}
                                </Space>
                            </Select.Option>
                        ))}
                    </CustomSelect>
                </div>
            </Col>
            {!lg && (
                <Col xs={24} lg={12} style={xs || sm || md ? haftHeightStyle : {}}>
                    <img style={{ width: '100%', height: '100%' }} src={bgWelcome} />
                </Col>
            )}
        </Row>
    );
}

export default Welcome;
