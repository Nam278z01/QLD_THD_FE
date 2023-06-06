import axios from 'axios';
import { Server } from '../dataConfig';

export const getExcelHead = async (token, departmentID) => {
    try {
        return await axios.get(`${Server}/exports/head-template-point?DepartmentID=${departmentID}`, token);
    } catch (err) {
        return 'NO DATA';
    }
};

export const getExcelPM = async (token, departmentID) => {
    try {
        return await axios.get(`${Server}/exports/pm-template-point?DepartmentID=${departmentID}`, token);
    } catch (err) {
        return 'NO DATA';
    }
};
export const getExcelBadge = async (token, departmentID) => {
    try {
        return await axios.post(`${Server}/userbadges/download?DepartmentID=${departmentID}`, { DepartmentID: departmentID }, token);
    } catch (err) {
        return 'NO DATA';
    }
};

export const getMemberTemp = async (token, departmentID) => {
    try {
        return await axios.get(`${Server}/exports/projectmember-template?DepartmentID=${departmentID}`, token);
    } catch (err) {
        return 'NO DATA';
    }
};
export const getProjectTemp = async (token, departmentID) => {
    try {
        return await axios.get(`${Server}/exports/projectmember-template?DepartmentID=${departmentID}`, token);
    } catch (err) {
        return 'NO DATA';
    }
};

export const getFileDownLoadBadgeHistory = async (token, ID, Type) => {
    try {
        return await axios.get(`${Server}/userbadges/downloadImportBadgeHistory?ID=${ID}&Type=${Type}`, token);
    } catch (err) {
        return 'NO DATA';
    }
};

export const getFileDownLoadSyncHistory = async (token, ID, Type) => {
    try {
        return await axios.get(`${Server}/synchronous/getSyncHistory?ID=${ID}&Type=${Type}`, token);
    } catch (err) {
        return 'NO DATA';
    }
};