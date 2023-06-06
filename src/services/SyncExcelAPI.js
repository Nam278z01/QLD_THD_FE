import axios from 'axios';
import { Server } from '../dataConfig';

export const ExcelSynccertificate = async (token, departmentID, file) => {
    try {
        await axios.post(`${Server}/synchronous/synccertificate-excel?DepartmentID=${departmentID}`, file, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const updateSyncAPI = async (token, DepartmentID, body, id) => {
    try {
        await axios.put(`${Server}/api/${id}?DepartmentID=${DepartmentID}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const CreateSyncAPI = async (token, body) => {
    try {
        await axios.post(`${Server}/api/configApiTemplate`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const createNewTemplateAPI = async (token, body) => {
    try {
        await axios.post(`${Server}/api`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const ExcelsyncRUF = async (token, departmentID, file) => {
    try {
        await axios.post(`${Server}/synchronous/syncRUF-excel?DepartmentID=${departmentID}`, file, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const ExcelsyncIPReuse = async (token, departmentID, file) => {
    try {
        await axios.post(`${Server}/synchronous/syncIPReuse-excel?DepartmentID=${departmentID}`, file, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const ExcelsyncExcelReviewSubmition = async (token, departmentID, file) => {
    try {
        await axios.post(
            `${Server}/synchronous/syncExcelReviewSubmition-excel?DepartmentID=${departmentID}`,
            file,
            token
        );
    } catch (err) {
        throw err.response.data.error;
    }
};
export const ExcelsyncLCEL = async (token, departmentID, file) => {
    try {
        await axios.post(`${Server}/synchronous/syncLCELReport?DepartmentID=${departmentID}`, file, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const ExcelsyncconfirmOTLate = async (token, departmentID, file) => {
    try {
        await axios.post(`${Server}/synchronous/confirmOTLate?DepartmentID=${departmentID}`, file, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const ExcelsyncmemberIncomeReport = async (token, departmentID, file) => {
    try {
        await axios.post(`${Server}/synchronous/memberIncomeReport?DepartmentID=${departmentID}`, file, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const ExcelsyncMonthlyIncomeCheck = async (token, departmentID, file) => {
    try {
        await axios.post(
            `${Server}/synchronous//syncMonthlyIncomeCheck-excel?DepartmentID=${departmentID}`,
            file,
            token
        );
    } catch (err) {
        throw err.response.data.error;
    }
};
