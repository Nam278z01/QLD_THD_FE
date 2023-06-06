import axios from 'axios';
import moment from 'moment';
import { Server, Status, UserMaster } from '../dataConfig';

export const getAllDepartmentNoSetting = async (token, DepartmentID) => {
    try {
        const res = await axios.get(`${Server}/departments?Status=1`, token);

        const datas = res.data.data.departments;

        const departmentData = datas.map((data) => {
            const { ID, Code } = data;
            return { ID, Code, label: Code };
        });

        departmentData.unshift({ ID: 1, Code: 'Other', label: 'Other' });

        return departmentData;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getAllDepartmentStatus2 = async (token, DepartmentID) => {
    try {
        const res = await axios.get(`${Server}/departments?Status=2`, token);
        const datas = res.data.data.departments;
        const departmentData = datas.map((data) => {
            const { ID, Code } = data;
            return { ID, Code, label: Code };
        });

        return departmentData;
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getAllDepaWelcome = async (token, DepartmentID) => {
    try {
        const res = await axios.get(`${Server}/departments/all-department`, token);
        const datas = res.data.data;
        const departmentData = datas.map((data) => {
            const { ID, Code } = data;
            return { ID, Code, label: Code };
        });

        return departmentData;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getAllDepartmentFsu = async (token, DepartmentID, ID) => {
    try {
        const res = await axios.get(`${Server}/departments/all-fsu/?DepartmentID=${ID}`, token);

        const datas = res.data.data;

        const departmentData = datas.map((data) => {
            const { ID, Name, DepartmentID, Description, Status, Department } = data;
            return {
                ID,
                Name,
                label: Name,
                DepartmentID,
                Description,
                Status,
                Department
            };
        });

        return departmentData;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getAllDepartmentForGuest = async (token, DepartmentID, page, row, search) => {
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

export const getAllDepartmentWithPage = async (token, DepartmentID, page, row, sort, search) => {
    try {
        const res = await axios.get(
            `${Server}/departments?size=${row}&page=${page}${sort ? `&sort=${sort}` : ''}${
                search ? `&keyword=${search}` : ''
            }&Status=2&Status=3`,
            token
        );

        let departmentData = res.data.data.departments;

        const totalPage = Math.ceil(res.data.data.total / row);
        return { departmentData, totalPage };
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getCurrentDepartment = async (token, departmentID, code) => {
    try {
        const res = await axios.get(`${Server}/departments?Code=${code}`, token);
        const department = res.data.data.departments[0];

        return department;
    } catch (err) {
        throw 'NO DATA';
    }
};

export const getOneDepartmentDetail = async (token, DepartmentID, depaID) => {
    try {
        const res = await axios.get(`${Server}/departments/${depaID}`, token);

        const datas = res.data.data;

        return datas;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const createDepartmentUseAkarank = async (token, DepartmentID, body) => {
    try {
        const res = await axios.post(`${Server}/departments`, body, token);

        const newDepaID = res.data.data.ID;

        await axios.put(`${Server}/departments/${newDepaID}`, { Status: 2 }, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const updateDepartment = async (token, DepartmentID, body, trueDepartmentID) => {
    try {
        await axios.put(`${Server}/departments/${trueDepartmentID}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getAllDepartment = async (token, DepartmentID, isOnlyMember) => {
    try {
        const res = await axios.get(
            `${Server}/departments/all-department${isOnlyMember ? `?isOnlyMember=${isOnlyMember}` : ''}`,
            token
        );

        return res.data.data;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const updateFsutoBu = async (token, DepartmentID, body, trueDepartmentID) => {
    try {
        await axios.put(`${Server}/departments/fsu-to-bu?DepartmentID=${trueDepartmentID}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
