import axios from 'axios';
import moment from 'moment';
import { Server, Status, UserMaster } from '../dataConfig';

export const createProject = async (token, DepartmentID, body) => {
    try {
        await axios.post(`${Server}/projects`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const syncAllproject = async (token, DepartmentID) => {
    try {
        await axios.put(`${Server}/projects/sync-jira?DepartmentID=${DepartmentID}`, {}, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const syncAllprojectFsu = async (token, DepartmentID, body) => {
    try {
        await axios.put(`${Server}/projects/many-department?Status=All`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getAllProject = async (
    token,
    DepartmentID,
    page,
    row,
    sort,
    search,
    account,
    status,
    userID,
    role,
    departmentName,
    departmentFilters
) => {
    try {
        let res;
        if (role === 'PM') {
            res = await axios.get(
                `${Server}/projects?${page ? `&page=${page}` : ''}${row === 'All' ? '' : `&size=${row}`}${
                    sort ? `&sort=${sort}` : ''
                }${search ? `&keyword=${search}` : ''}${userID ? `&ManagerID=${userID}` : ''}${
                    status ? `&Status=${status}` : '&Status=On-Going'
                }&DepartmentID=${DepartmentID}${departmentFilters ? `&departmentFilters=${departmentFilters}` : ''}`,
                token
            );
        } else if (role === 'Member') {
            res = await axios.get(
                `${Server}/projects?${page ? `&page=${page}` : ''}${row === 'All' ? '' : `&size=${row}`}${
                    sort ? `&sort=${sort}` : ''
                }${search ? `&keyword=${search}` : ''}${userID ? `&MemberID=${userID}` : ''}${
                    status ? `&Status=${status}` : '&Status=On-Going'
                }&DepartmentID=${DepartmentID}${departmentFilters ? `&departmentFilters=${departmentFilters}` : ''}`,
                token
            );
        } else {
            res = await axios.get(
                `${Server}/projects?${page ? `&page=${page}` : ''}${row === 'All' ? '' : `&size=${row}`}${
                    sort ? `&sort=${sort}` : '&sort=Status:DESC'
                }${search ? `&keyword=${search}` : ''}${
                    status ? `&Status=${status}` : ''
                }&DepartmentID=${DepartmentID}${departmentFilters ? `&departmentFilters=${departmentFilters}` : ''}`,
                token
            );
        }
        const totalPage = Math.ceil(res.data.data.total / row);
        const datas = res.data.data.projects;
        let lstDepartmentFilter = res.data.data.DepartmentFilters;
        let totalItems = res.data.data.total;
        const projectData = datas.map((x) => ({
            key: x.Key,
            code: x.Code,
            manager: x.Manager ? x.Manager.Account : null,
            type: x.Type,
            rank: x.Rank,
            budget: x.Budget,
            startdate: x.StartDate,
            enddate: x.EndDate,
            note: x.Note,
            UpdatedBy: x.UpdatedBy,
            createdBy: x.CreatedBy,
            status: x.Status,
            projectID: x.ID,
            department: x.Department.Code,
            label: x.Code
        }));
        return { projectData, totalPage, totalItems, lstDepartmentFilter };
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getProjectExcel = async (token, DepartmentID, search) => {
    try {
        const res = await axios.get(
            `${Server}/projects?${search ? `&keyword=${search}` : ''}&DepartmentID=${DepartmentID}`,
            token
        );
        const datas = res.data.data.projects;
        const projectData = datas.map((x) => ({
            key: x.Key,
            code: x.Code,
            manager: x.Manager ? x.Manager.Account : null,
            type: x.Type,
            rank: x.Rank,
            budget: x.Budget,
            startdate: x.StartDate,
            enddate: x.EndDate,
            note: x.Note,
            UpdatedBy: x.UpdatedBy,
            createdBy: x.CreatedBy,
            status: x.Status,
            projectID: x.ID,
            department: x.Department.Code,
            label: x.Code
        }));
        return { projectData };
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getAllProjectFsu = async (
    token,
    DepartmentID,
    page,
    row,
    sort,
    search,
    account,
    status,
    userID,
    role,
    departmentName
) => {
    try {
        let res;

        if (role === 'PM') {
            res = await axios.get(
                `${Server}/projects?page=${page}${row === 'All' ? '' : `&size=${row}`}${sort ? `&sort=${sort}` : ''}${
                    search ? `&keyword=${search}` : ''
                }${userID ? `&ManagerID=${userID}` : ''}${
                    status ? `&Status=${status}` : '&Status=On-Going'
                }&DepartmentID=${DepartmentID}`,
                token
            );
        } else if (role === 'Member') {
            res = await axios.get(
                `${Server}/projects?page=${page}${row === 'All' ? '' : `&size=${row}`}${sort ? `&sort=${sort}` : ''}${
                    search ? `&keyword=${search}` : ''
                }${userID ? `&MemberID=${userID}` : ''}${
                    status ? `&Status=${status}` : '&Status=On-Going'
                }&DepartmentID=${DepartmentID}`,
                token
            );
        } else {
            res = await axios.get(
                `${Server}/projects?page=${page}${row === 'All' ? '' : `&size=${row}`}${sort ? `&sort=${sort}` : ''}${
                    search ? `&keyword=${search}` : ''
                }${status ? `&Status=${status}` : ''}&DepartmentID=${DepartmentID}`,
                token
            );
        }
        const totalPage = Math.ceil(res.data.data.total / row);
        const datas = res.data.data.projects;
        let totalItems = res.data.data.total;
        const projectData = datas.map((x) => ({
            projectID: x.ID,
            key: x.Key,
            label: x.Code,
            code: x.Code,
            startdate: x.StartDate,
            enddate: x.EndDate,
            department: x.Department.Code,
            manager: x.Manager ? x.Manager.Account : null,
            status: x.Status
        }));
        return { projectData, totalPage, totalItems };
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getAllProjectNoPage = async (token, DepartmentID, departmentName) => {
    try {
        const res = await axios.get(
            `${Server}/projects?DepartmentID=${DepartmentID}&Department=${departmentName}`,
            token
        );

        const datas = res.data.data.projects;

        const projectData = datas.map((x) => ({
            ID: x.ID,
            Key: x.Key,
            Code: x.Code,
            Department: x.Department.Code,
            Manager: x.Manager ? x.Manager.Account : null,
            Type: x.Type,
            Rank: x.Rank,
            Budget: x.Budget,
            Startdate: x.StartDate ? moment(x.StartDate).format('DD-MM-YYYY') : null,
            Enddate: x.EndDate ? moment(x.EndDate).format('DD-MM-YYYY') : null,
            Note: x.Note,
            Status: x.Status
        }));

        return projectData;
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getAllDepartmentFsu = async (token, DepartmentID, departmentName) => {
    try {
        const res = await axios.put(`${Server}/projects/FSU-ALL/`, {}, token);
        const datas = res.data.data.projects;

        const projectData = datas
            .filter((x, i) => i > 0)
            .map((x) => ({
                ID: x.ID,
                Code: x.Code
            }));

        return projectData;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getProjectDetail = async (token, DepartmentID, projectID) => {
    try {
        const res = await axios.get(`${Server}/projects/${projectID}?DepartmentID=${DepartmentID}`, token);

        const project = res.data.data;

        const res2 = await axios.get(
            `${Server}/usermasters/?keyword=${project.Manager}&DepartmentID=${DepartmentID}`,
            token
        );

        const manager = res2.data.data.userMasters[0];

        const res3 = await axios.get(
            `${Server}/projectmembers?ProjectID=${project.ID}&DepartmentID=${DepartmentID}`,
            token
        );

        const projectMember = res3.data.data.projectmembers;

        return { project, manager, projectMember };
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getAllUserProject = async (token, DepartmentID, departmentName) => {
    try {
        const res = await axios.get(
            `${Server}/projects?Status=on-going&DepartmentID=${DepartmentID}&Department=${departmentName}`,
            token
        );
        const datas = res.data.data.projects;
        const project = datas.map((x) => ({
            projectid: x.ID,
            key: x.Code,
            manager: x.Manager ? x.Manager.Account : 'No Data',
            label: x.Code
        }));

        return project;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getProjectMember = async (token, DepartmentID, page, row, sort, search, ID) => {
    try {
        const res = await axios.get(
            `${Server}/projectmembers?page=${page}${row === 'All' ? '' : `&size=${row}`}&ProjectID=${ID}${
                sort ? `&sort=${sort}` : ''
            }${search ? `&keyword=${search}` : ''}&DepartmentID=${DepartmentID}`,
            token
        );

        const member = res.data.data.projectmembers;
        const totalPage = Math.ceil(res.data.data.total / row);
        let totalItems = res.data.data.total;
        return { member, totalPage, totalItems };
    } catch (err) {
        throw err.response.data.error;
    }
};

export async function syncProjectMember(token, DepartmentID, projectKey, startDate, endDate) {
    try {
        const Sdate = moment(startDate, 'YYYY/MM');
        const Edate = moment(endDate, 'YYYY/MM');
        const currentSDate = `${Sdate.format('MMM')}/${Sdate.format('YY')}`;
        const currentEDate = `${Edate.format('MMM')}/${Edate.format('YY')}`;

        await axios.put(
            `${Server}/projectmembers?project_key=${projectKey}&begin_assignment=${currentSDate}&end_assignment=${currentEDate}`,
            {},
            token
        );
    } catch (err) {
        throw err.response.data.error;
    }
}

export const exportProjectData = async (
    token,
    DepartmentID,
    page,
    row,
    sort,
    search,
    account,
    status,
    userID,
    role,
    departmentName,
    departmentFilters
) => {
    try {
        if (role === 'PM') {
            return await axios.get(
                `${Server}/exports/project-excel?${page ? `&page=${page}` : ''}${row === 'All' ? '' : `&size=All`}${
                    sort ? `&sort=${sort}` : ''
                }${search ? `&keyword=${search}` : ''}${userID ? `&ManagerID=${userID}` : ''}${
                    status ? `&Status=${status}` : '&Status=On-Going'
                }&DepartmentID=${DepartmentID}${departmentFilters ? `&departmentFilters=${departmentFilters}` : ''}`,
                token
            );
        } else if (role === 'Member') {
            return await axios.get(
                `${Server}/exports/project-excel?${page ? `&page=${page}` : ''}${row === 'All' ? '' : `&size=All`}${
                    sort ? `&sort=${sort}` : ''
                }${search ? `&keyword=${search}` : ''}${userID ? `&MemberID=${userID}` : ''}${
                    status ? `&Status=${status}` : '&Status=On-Going'
                }&DepartmentID=${DepartmentID}${departmentFilters ? `&departmentFilters=${departmentFilters}` : ''}`,
                token
            );
        } else {
            return await axios.get(
                `${Server}/exports/project-excel?${page ? `&page=${page}` : ''}${row === 'All' ? '' : `&size=All`}${
                    sort ? `&sort=${sort}` : '&sort=Status:DESC'
                }${search ? `&keyword=${search}` : ''}${
                    status ? `&Status=${status}` : ''
                }&DepartmentID=${DepartmentID}${departmentFilters ? `&departmentFilters=${departmentFilters}` : ''}`,
                token
            );
        }
    } catch (err) {
        return 'NO DATA';
    }
};
