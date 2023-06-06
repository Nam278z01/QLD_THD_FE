import axios from 'axios';
import tr from 'date-fns/esm/locale/tr/index.js';
import moment from 'moment';
import { Server, Status, UserMaster } from '../dataConfig';

export const getUserGroupChildRequest = async (token, departmentID, Code) => {
    try {
        const res = await axios.get(`${Server}/groupchilds/?Code=${Code}&DepartmentID=${departmentID}`, token);

        const datas = res.data.data;

        return datas;
    } catch (err) {
        return 'NO DATA';
    }
};

export const getAllUserDepartment = async (token, DepartmentID) => {
    try {
        const res = await axios.get(
            `${Server}/usermasters?RoleID=2
        &DepartmentID=${DepartmentID}
      `,
            token
        );

        const datas = res.data.data.userMasters;

        const userMasterData = datas.map((data) => {
            const { ID, Account, RoleID } = data;

            return { ID, Account, label: Account, RoleID };
        });

        return userMasterData;
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getAllDepartment = async (token, DepartmentID) => {
    try {
        const res = await axios.get(`${Server}/departments`, token);
        const datas = res.data.data.departments;
        const alldepartment = datas.map((data) => {
            const { ID, Code, IsFsu } = data;

            return { ID, label: Code, Code, IsFsu };
        });

        return alldepartment;
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getAllDepartmentWithNoParent = async (token, DepartmentID, trueDepartmentID) => {
    try {
        const res = await axios.get(`${Server}/departments/department-valid?DepartmentID=${trueDepartmentID}`, token);
        const datas = res.data.data;
        const alldepartment = datas.map((data) => {
            const { ID, Code, IsFsu } = data;

            return { ID, label: Code, Code, IsFsu };
        });

        return alldepartment;
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getAllDepartmentGroupChild = async (token, DepartmentID, ID) => {
    try {
        const res = await axios.get(`${Server}/departments/list-groupchild?DepartmentID=${ID}&Status=1`, token);
        const datas = res.data.data;
        const groupchild = datas
            // .filter((e) => e.IsFsu === 1)
            .map((data) => {
                const { Department } = data;

                return {
                    ID: Department.ID,
                    label: Department.Code,

                    Code: Department.Code
                };
            });

        return groupchild;
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getUserGroupChild = async (token, DepartmentID, CodeDepartment) => {
    try {
        const res = await axios.get(
            `${Server}/groupchilds/?DepartmentID=${DepartmentID}&Code=${CodeDepartment}
      `,
            token
        );
        const datas = res.data.data.groupchild;

        const userMasterData = datas.map((data) => {
            const { UserMasterID, Account, Code } = data;

            return { ID: UserMasterID, Account, label: Account, Code };
        });

        return userMasterData;
    } catch (err) {
        throw err.response.data.error;
    }
};
export const createUserMasterGroupChild = async (token, DepartmentID, body) => {
    try {
        await axios.post(`${Server}/groupchilds`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getAllGroupChild = async (token, departmentID, Code) => {
    try {
        const res = await axios.get(`${Server}/departments/sub-department/?fsu=${Code}`, token);
        const datas = res.data.data;
        const alldepartment = datas
            // .filter((e) => e.IsFsu === 1)
            .map((data) => {
                const { ID, Code, IsFsu } = data;

                return { ID, label: Code, Code, IsFsu };
            });
        return alldepartment;
    } catch (err) {
        return 'NO DATA';
    }
};

export const getAllDepartmentCanBeGroupChild = async (token, departmentID, Code) => {
    try {
        const res = await axios.get(`${Server}/departments/sub-department/?fsu=${Code}`, token);

        const datas = res.data.data;
        return datas;
    } catch (err) {
        return 'NO DATA';
    }
};

export const createFsu = async (token, departmentID, body) => {
    try {
        await axios.post(`${Server}/departments/fsu`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const updateFsu = async (token, DepartmentID, body) => {
    try {
        await axios.put(`${Server}/departments/update-fsu/`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
