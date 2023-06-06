import axios from 'axios';
import tr from 'date-fns/esm/locale/tr/index.js';
import moment from 'moment';
import { Server, Status, UserMaster } from '../dataConfig';

export const getUserRole = async (token, DepartmentID, account, trueDepartmentID) => {
    try {
        const res = await axios.get(`${Server}/usermasters/${account}?DepartmentID=${trueDepartmentID}`, token);

        return res.data.data;
    } catch (err) {
        return 'NO DATA';
    }
};

export const getAllUserMasterNoDepartment = async (token, DepartmentID, page, row, role) => {
    try {
        const res = await axios.get(
            `${Server}/usermasters${page ? `?page=${page}` : ''}${row ? `&size=${row}` : ''}${
                role ? `&RoleID=${role}` : ''
            }`,
            token
        );

        const userMasterData = res.data.data.userMasters;
        userMasterData.unshift({ ID: 0, Account: 'Other' });
        return userMasterData;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getAllUserMasterWithDepartment = async (token, DepartmentID) => {
    try {
        const res = await axios.get(`${Server}/usermasters?DepartmentID=${DepartmentID}&RoleID=3&RoleID=4`, token);

        const userMasterData = res.data.data.userMasters;
        userMasterData.unshift({ ID: 0, Account: 'Other' });
        return userMasterData;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getAllUserMasterNoPage = async (token, DepartmentID, role) => {
    try {
        const res = await axios.get(
            `${Server}/usermasters${role ? `?RoleID=${role}` : ''}${
                DepartmentID ? `&DepartmentID=${DepartmentID}` : ''
            }`,
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

export const getAllUserMasterNoPageWithDepartmentID = async (token, DepartmentID, role, trueDepartmentID) => {
    try {
        const res = await axios.get(
            `${Server}/usermasters${role ? `?RoleID=${role}` : ''}${
                trueDepartmentID ? `&DepartmentID=${trueDepartmentID}` : ''
            }`,
            token
        );

        const datas = res.data.data.userMasters;
        const userMasterData = datas.map((data) => {
            const { ID, Account, RoleID, Department } = data;

            return {
                ID,
                Account,
                label: Account,
                RoleID,
                Department
            };
        });

        return userMasterData;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getAllPM = async (token, DepartmentID) => {
    try {
        const res = await axios.get(`${Server}/usermasters?RoleID=3&DepartmentID=${DepartmentID}`, token);

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
export const getAllHead = async (token, DepartmentID) => {
    try {
        const res = await axios.get(`${Server}/usermasters?RoleID=2&DepartmentID=${DepartmentID}`, token);

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
export const getAllMem = async (token, DepartmentID) => {
    try {
        const res = await axios.post(
            `${Server}/usermasters/all-member?DepartmentID=${DepartmentID}`,

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

export const getAllActiveMem = async (token, DepartmentID) => {
    try {
        const res = await axios.get(`${Server}/usermasters?DepartmentID=${DepartmentID}`, token);

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

export const getAllUserMasterNoPageWithMoreData = async (token, DepartmentID, search) => {
    try {
        const res = await axios.post(
            `${Server}/usermasters/all-member?DepartmentID=${DepartmentID}${search ? `&keyword=${search}` : ''}`,
            {},
            token
        );

        const datas = res.data.data.userMasters;
        const userMasterData = datas.map((data) => {
            const {
                Account,
                DisplayName,
                Email,
                ContractType,
                Department,
                JobTitle,
                RoleID,
                Status: UserStatus,
                Group,
                EmployeeID,
                Skill,
                ForeignLanguage,
                DOB,
                PhoneNumber,
                Note,
                DateJoinUnit
            } = data;

            return {
                Name: DisplayName,
                Department: Department ? Department.Code : '',
                Group: Group,
                Account,
                Email,
                EmployeeID,
                Skill,
                ForeignLanguage,
                DOB: DOB ? moment(DOB).format('DD/MM/YYYY') : null,
                PhoneNumber,
                Contract_Type: UserMaster.ContractType[ContractType - 1],
                Note,
                DateJoinUnit: DateJoinUnit ? moment(DateJoinUnit).format('DD/MM/YYYY') : null,
                JobTitle,
                Role: UserMaster.Role[RoleID - 1],
                Status: Status.UserMaster[UserStatus - 1]
            };
        });
        return userMasterData;
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getAllWorkingNoPageWithMoreData = async (token, DepartmentID, search) => {
    try {
        const res = await axios.get(
            `${Server}/workingtimes?DepartmentID=${DepartmentID}${search ? `&keyword=${search}` : ''}`,
            token
        );
        const datas = res.data.data.workingTimes;
        const working = datas.map((data) => {
            const { UserMaster, WorkDateNumber, Month, Year } = data;

            return {
                Account: UserMaster.Account,
                Month: Month,
                Year: Year,
                WorkDateNumber: WorkDateNumber
            };
        });
        return working;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getAllMember = async (token, DepartmentID, page, row, sort, search, role, status) => {
    try {
        const res = await axios.get(
            `${Server}/usermasters?page=${page}${row === 'All' ? '' : `&size=${row}`}${sort ? `&sort=${sort}` : ''}${
                search ? `&keyword=${search}` : ''
            }${role != null ? `&RoleID=${role}` : ''}${
                status != null ? `&Status=${status}` : ''
            }&DepartmentID=${DepartmentID}`,
            token
        );

        const allMem = res.data.data.userMasters;

        const totalPage = Math.ceil(res.data.data.total / row);
        let totalItems = res.data.data.total;
        return {
            allMem,
            totalPage,
            totalItems
        };
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getAllMemberDepartment = async (token, DepartmentID, page, row, sort, search, role, status, contract) => {
    try {
        const res = await axios.post(
            `${Server}/usermasters/all-member?page=${page}${row === 'All' ? '' : `&size=${row}`}${
                sort ? `&sort=${sort}` : ''
            }${search ? `&keyword=${search}` : ''}${role != null ? `&RoleID=${role}` : ''}${
                status != null ? `&Status=${status}` : ''
            }&DepartmentID=${DepartmentID}${contract != null ? `&ContractType=${contract}` : ''}
            `,
            {},
            token
        );

        const allMem = res.data.data.userMasters;

        const totalPage = Math.ceil(res.data.data.total / row);

        let totalItems = res.data.data.total;

        return {
            allMem,
            totalPage,
            totalItems
        };
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getAllWorkingDepartment = async (token, DepartmentID, page, row, sort, search, month, year) => {
    try {
        const res = await axios.get(
            `${Server}/workingtimes?page=${page}${row === 'All' ? '' : `&size=${row}`}${sort ? `&sort=${sort}` : ''}${
                search ? `&keyword=${search}` : ''
            }${month ? `&Month=${month}` : ''}${year ? `&Year=${year}` : ''}&DepartmentID=${DepartmentID}`,
            token
        );

        const allworking = res.data.data.workingTimes;
        const working = allworking.map((data) => {
            const { UserMaster, WorkDateNumber, Month, Year, ID } = data;

            return {
                ID: ID,
                DisplayName: UserMaster.DisplayName,
                Account: UserMaster.Account,
                WorkDateNumber: WorkDateNumber,
                Month: Month,
                Year: Year
            };
        });
        const totalPage = Math.ceil(res.data.data.total / row);

        let totalItems = res.data.data.total;

        return {
            working,
            totalPage,
            totalItems
        };
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getAllHistoryBadge = async (token, DepartmentID, page, row, sort, search, month, year) => {
    try {
        const res = await axios.get(
            `${Server}/userbadges/userbadgeHistory?DepartmentID=${DepartmentID}${
                sort ? `&sort=${sort}` : '&sort=CreatedDate:DESC'
            }`,

            token
        );
        const allworking = res.data.data.userBadges;
        const working = allworking.map((data) => {
            const {
                ID,
                TotalLine,
                NumberLineFail,
                NumberLineSuccess,
                CreatedDate,
                FileFailURL,
                FileSuccessURL,
                CreatedBy
            } = data;
            return {
                ID: ID,
                TotalLine: TotalLine,
                NumberLineFail: NumberLineFail,
                NumberLineSuccess: NumberLineSuccess,
                CreatedDate: moment(CreatedDate).format('DD/MM/YYYY'),
                FileFailURL: FileFailURL,
                FileSuccessURL: FileSuccessURL,
                CreatedBy: CreatedBy
            };
        });
        return working;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getOneUserMaster = async (token, DepartmentID, ID) => {
    try {
        const res = await axios.get(`${Server}/usermasters?ID=${ID}&DepartmentID=${DepartmentID}`, token);

        if (res.data.data.userMasters[0]) {
            const member = res.data.data.userMasters[0];
            return member;
        } else {
            return null;
        }
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getUserMasterPic = async (token, DepartmentID, ID) => {
    try {
        const res = await axios.get(`${Server}/usermasters?ID=${ID}&DepartmentID=${DepartmentID}`, token);

        if (res.data.data.userMasters[0]) {
            const member = res.data.data.userMasters[0].Account;
            return member;
        } else {
            return null;
        }
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getApprover = async (token, DepartmentID, Account) => {
    try {
        const res = await axios.get(`${Server}/usermasters?Account=${Account}&DepartmentID=${DepartmentID}`, token);

        if (res.data.data.userMasters[0]) {
            const member = res.data.data.userMasters[0].ID;
            return member;
        } else {
            return null;
        }
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getOneUserMasterByAccount = async (token, DepartmentID, Account) => {
    try {
        const res = await axios.get(`${Server}/usermasters/${Account}?DepartmentID=${DepartmentID}`, token);
        const data = res.data.data;

        return data;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const createUserMaster = async (token, DepartmentID, body) => {
    try {
        await axios.post(`${Server}/usermasters`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const createDefaultHead = async (token, DepartmentID, body, trueDepartmentID) => {
    try {
        const res = await axios.post(`${Server}/usermasters`, body, token);

        const depaBody = { DefaultHead: res.data.data.ID };

        await axios.put(`${Server}/departments/${trueDepartmentID}`, depaBody, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const changeUserRole = async (token, DepartmentID, body) => {
    let newbody = {
        RoleID: body.roleID
    };
    try {
        await axios.put(`${Server}/usermasters/${body.accountName}?DepartmentID=${body.departmentID}`, newbody, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const changeUserRole1 = async (token, DepartmentID, account, body) => {
    try {
        await axios.put(`${Server}/usermasters/${account}?DepartmentID=${DepartmentID}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const updateUserInfo = async (token, DepartmentID, accountName, body) => {
    try {
        await axios.put(`${Server}/usermasters/${accountName}?DepartmentID=${DepartmentID}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const updateUserProfileInfomation = async (token, userId, body) => {
    try {
        await axios.put(`${Server}/usermasters/user/${userId}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getUserProfileInforData = async (token, userId, ...rest) => {
    try {
        let res;
        res = await axios.get(`${Server}/usermasters/user/${rest}`, token);
        return res.data.data;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const exportAllMemberDepartment = async (token, DepartmentID, page, row, sort, search, role, status) => {
    try {
        return await axios.get(
            // {{baseUrl}}/api/v1/exports/usermaster-excel?DepartmentID=1001
            `${Server}/exports/usermaster-excel?page=${page}${row === 'All' ? '' : `&size=${row}`}${
                sort ? `&sort=${sort}` : ''
            }${search ? `&keyword=${search}` : ''}${role != null ? `&RoleID=${role}` : ''}${
                status != null ? `&Status=${status}` : ''
            }&DepartmentID=${DepartmentID}`,

            token
        );
    } catch (err) {
        throw err.response.data.error;
    }
};

export const exportAllWorkingDepartment = async (token, DepartmentID, page, row, sort, search, month, year) => {
    try {
        const res = await axios.get(
            `${Server}/exports/workingtime-excel?page=${page}${row === 'All' ? '' : `&size=${row}`}${
                sort ? `&sort=${sort}` : ''
            }${search ? `&keyword=${search}` : ''}${month ? `&Month=${month}` : ''}${
                year ? `&Year=${year}` : ''
            }&DepartmentID=${DepartmentID}`,
            token
        );
        return res;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getYearListWorkingTimeSelect = async (token, DepartmentID) => {
    try {
        return await axios.get(`${Server}/workingtimes/getYearForFilter${DepartmentID}`, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
