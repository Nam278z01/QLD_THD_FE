import axios from 'axios';
import { Server } from '../dataConfig';

export const uploadMemberExcel = async (token, DepartmentID, file) => {
    try {
        await axios.post(`${Server}/imports/usermaster-excel?DepartmentID=${DepartmentID}`, file, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const uploadWorkingExcel = async (token, DepartmentID, file) => {
    try {
        await axios.post(`${Server}/imports/workingtime-excel?DepartmentID=${DepartmentID}`, file, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const uploadBadgeExcel = async (token, DepartmentID, file) => {
    try {
        await axios.post(`${Server}/userbadges/manual-award-badges?DepartmentID=${DepartmentID}`, file, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const uploadPointExcelPM = async (token, departmentID, file) => {
    try {
        await axios.post(`${Server}/points/pm-request?DepartmentID=${departmentID}`, file, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const uploadPointExcelBUL = async (token, departmentID, file) => {
    try {
        await axios.post(`${Server}/points/head-request?DepartmentID=${departmentID}`, file, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const uploadUserAvatar = async (token, DepartmentID, avatar, account) => {
    try {
        await axios.put(`${Server}/uploads/avatar/${account}?DepartmentID=${DepartmentID}`, avatar, token);
        return true;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const uploadUserAvatarProfile = async (token, DepartmentID, account, body) => {
    try {
        const res = await axios.put(`${Server}/uploads/avatar/${DepartmentID}?DepartmentID=${account}`, body, token);

        return res.data.data;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const uploadMemberProject = async (token, DepartmentID, file) => {
    try {
        await axios.post(`${Server}/imports/projectmember-excel?DepartmentID=${DepartmentID}`, file, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const uploadProject = async (token, DepartmentID, file) => {
    try {
        await axios.post(`${Server}/imports/project-excel?DepartmentID=${DepartmentID}`, file, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
