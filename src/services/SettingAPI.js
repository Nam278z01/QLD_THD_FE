import axios from 'axios';
import moment from 'moment';
import { Server, Status, UserMaster } from '../dataConfig';

export const getSetting = async (token, departmentID, trueDepartmentID) => {
    try {
        const res = await axios.get(`${Server}/settings/${trueDepartmentID}`, token);

        const datas = res.data.data;

        return datas;
    } catch (err) {
        return 'NO DATA';
    }
};
export const getSettingWorking = async (token, departmentID) => {
    try {
        const res = await axios.get(`${Server}/workingtimeofyear?sort=Year:DESC&DepartmentID=${departmentID}`, token);

        const datas = res.data.data.workingTimesOfYear;

        const workingData = datas.map((data) => {
            const { Month, Year, WorkDateNumber } = data;

            return {
                Month,
                Year,
                WorkDateNumber
            };
        });

        return workingData;
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getSettingTop = async (token, departmentID, trueDepartmentID) => {
    try {
        const res = await axios.get(`${Server}/settings/${departmentID}`, token);

        const datas = res.data.data.MaxTopNumber;

        return datas;
    } catch (err) {
        return 'NO DATA';
    }
};

export const getAllDepartmentSetting = async (token, DepartmentID, page, row, search) => {
    try {
        const res = await axios.get(
            `${Server}/settings?page=${page}${row ? `&size=${row}` : ''}${search ? `&keyword=${search}` : ''}`,
            token
        );

        const departmentData = res.data.data.settings;

        const totalPage = Math.ceil(res.data.data.total / row);

        return { departmentData, totalPage };
    } catch (err) {
        throw err.response.data.error;
    }
};

export const saveSetting = async (token, DepartmentID, body) => {
    try {
        let res = await axios.post(`${Server}/settings`, body, token);
        return res.data.data;
    } catch (err) {
        throw err.response.data.error;
    }
};
export const saveWorking = async (token, DepartmentID, body) => {
    try {
        await axios.post(`${Server}/workingtimeofyear/createMany`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const updateSetting = async (token, DepartmentID, body, id) => {
    try {
        await axios.put(`${Server}/settings/${id}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const updateDepartment = async (token, DepartmentID, body) => {
    try {
        await axios.put(`${Server}/departments/${DepartmentID}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const updSetting = async (token, id, body) => {
    try {
        let res = await axios.put(`${Server}/settings/${id}`, body, token);
        return res.data.data;
    } catch (err) {
        throw err.response.data.error;
    }
};
