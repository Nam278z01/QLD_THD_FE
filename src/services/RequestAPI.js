import axios from 'axios';
import moment from 'moment';
import { Server, Status, UserMaster } from '../dataConfig';

export const getMyRequest = async (token, DepartmentID, page, row, sort, search, status, userID) => {
    try {
        let res;
        if (sort === 'Date:ASC') {
            res = await axios.get(
                `${Server}/points/pointOfRule?page=${page}${
                    row === 'All' ? '' : `&row=${row}`
                }&sort=Year:ASC&&sort=Month:ASC${search ? `&keyword=${search}` : ''}&UserMasterID=${userID}${
                    status ? `&Status=${status}` : ''
                }&DepartmentID=${DepartmentID}`,
                token
            );
        } else if (sort === 'Date:DESC') {
            res = await axios.get(
                `${Server}/points/pointOfRule?page=${page}${
                    row === 'All' ? '' : `&row=${row}`
                }&sort=Year:DESC&&sort=Month:DESC${search ? `&keyword=${search}` : ''}&UserMasterID=${userID}${
                    status ? `&Status=${status}` : ''
                }&DepartmentID=${DepartmentID}`,
                token
            );
        } else {
            res = await axios.get(
                `${Server}/points/pointOfRule?page=${page}${row === 'All' ? '' : `&row=${row}`}${
                    sort ? `&sort=${sort}` : '&sort=CreatedDate:DESC'
                }${search ? `&keyword=${search}` : ''}&UserMasterID=${userID}${
                    status ? `&Status=${status}` : ''
                }&DepartmentID=${DepartmentID}`,
                token
            );
        }

        let datas = res.data.data.points;
        let totalPage = Math.ceil(res.data.data.total / row);
        let totalItems = res.data.data.total;
        let requestData = datas.map((data) => {
            const {
                ID,
                RuleDefinition,
                Times,
                Project,
                PointOfRule,
                Confirmer,
                Approver,
                Month,
                Year,
                CreatedDate,
                Status: status,
                Evidence,
                CreatedBy,
                Note
            } = data;

            const { Name } = RuleDefinition;

            return {
                ID,
                Times,
                Code: Project ? Project.Code : 'No Project',
                ProjectName: Project ? Project.Key : 'No Project',
                PointOfRule,
                Name,
                Date: new Date(CreatedDate),
                Status: Status.RequestStatus[status - 1],
                CreatedDate: moment(CreatedDate).format('DD-MM-YYYY'),
                Approver,
                Month,
                Year,
                Confirmer,
                Evidence,
                StatusID: status,
                RuleDefinition,
                Project,
                CreatedBy,
                Note
            };
        });

        return { requestData, totalPage, totalItems };
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getRequest = async (token, DepartmentID, page, row, sort, search, role, userID, account) => {
    try {
        let datas;
        let totalPage;
        let totalItems;
        if (role === 'PM') {
            const res = await axios.get(
                `${Server}/points/pointOfRule?page=${page}${
                    row === 'All' ? '' : `&row=${row}`
                }&Confirmer=${account}&UserMasterID=${userID}${sort ? `&sort=${sort}` : ''}${
                    search ? `&keyword=${search}` : ''
                }&Status=1&DepartmentID=${DepartmentID}`,
                token
            );
            datas = res.data.data.points;

            totalPage = Math.ceil(res.data.data.total / row);
            totalItems = res.data.data.total;
        } else if (role === 'Head') {
            const res = await axios.get(
                `${Server}/points/pointOfRule?page=${page}${row === 'All' ? '' : `&row=${row}`}${
                    sort ? `&sort=${sort}` : ''
                }${
                    search ? `&keyword=${search}` : ''
                }&UserMasterID=${userID}&Approver=${account}&Status=2&DepartmentID=${DepartmentID}`,
                token
            );

            datas = res.data.data.points;
            totalPage = Math.ceil(res.data.data.total / row);
            totalItems = res.data.data.total;
        }
        const requestData = datas.map((data) => {
            const {
                Confirmer,
                Approver,
                ID,
                RuleDefinition,
                Times,
                Project,
                UserMaster,
                PointOfRule,
                Month,
                Year,
                Evidence,
                CreatedBy,
                Status: status,
                Note
            } = data;

            if (UserMaster == null) {
                return null;
            }

            const { DisplayName, Email, Account } = UserMaster;
            const { Name } = RuleDefinition;
            return {
                Confirmer,
                Account,
                Approver,
                ID,
                Times,
                Code: Project ? Project.Code : 'No Project',
                ProjectName: Project ? Project.Key : 'No Project',
                PointOfRule,
                Date: Month + '/' + Year,
                DisplayName,
                Name,
                Status: Status.RequestStatus[status - 1],
                email: Email.split('@')[0],
                Note,
                Project,
                RuleDefinition,
                Evidence,
                Month,
                Year,
                CreatedBy,
                StatusID: status
            };
        });
        return { requestData, totalPage, totalItems };
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getRequestHistory = async (
    token,
    DepartmentID,
    page,
    row,
    sort,
    search,
    status,
    userID,
    account,
    role
) => {
    try {
        let datas;
        let totalPage;
        let totalItems;
        if (role === 'PM') {
            const res = await axios.get(
                `${Server}/points/request-history?UserMasterID=${userID}&page=${page}${
                    row === 'All' ? '' : `&row=${row}`
                }${sort ? `&sort=${sort}` : '&sort=CreatedDate:DESC'}${search ? `&keyword=${search}` : ''}${
                    status ? `&Status=${status}` : ''
                }&Confirmer=${account}&DepartmentID=${DepartmentID}`,
                token
            );

            datas = res.data.data.points;

            totalPage = Math.ceil(res.data.data.total / row);
            totalItems = res.data.data.total;
        } else if (role === 'Head') {
            const res = await axios.get(
                `${Server}/points/request-history?UserMasterID=${userID}&page=${page}${
                    row === 'All' ? '' : `&row=${row}`
                }${sort ? `&sort=${sort}` : '&sort=CreatedDate:DESC'}${search ? `&keyword=${search}` : ''}${
                    status ? `&Status=${status}` : ''
                }&Approver=${account}&DepartmentID=${DepartmentID}`,
                token
            );
            datas = res.data.data.points;
            totalPage = Math.ceil(res.data.data.total / row);
            totalItems = res.data.data.total;
        }

        let history = datas.map((data) => {
            const {
                ID,
                RuleDefinition,
                Times,
                Project,
                PointOfRule,
                Confirmer,
                Approver,
                Month,
                Year,
                Status: status,
                UserMaster,
                CreatedDate,
                CreatedBy,
                Evidence,
                Note
            } = data;

            const { Name } = RuleDefinition;
            const { DisplayName, Email } = UserMaster;

            return {
                ID,
                Times,
                Code: Project ? Project.Code : 'No Project',
                ProjectName: Project ? Project.Key : 'No Project',
                PointOfRule,
                Name,
                Date: Month + '/' + Year,
                Status: Status.RequestStatus[status - 1],
                Approver,
                Month,
                Year,
                Account: Email.split('@')[0],
                CreatedDate: moment(CreatedDate).format('DD-MM-YYYY'),
                Confirmer,
                CreatedBy,
                Note,
                RuleDefinition,
                Project,
                Evidence,
                StatusID: status
            };
        });

        return { history, totalPage, totalItems };
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getRequestCampaignHistory = async (token, DepartmentID, page, row, sort, search, status, account) => {
    try {
        const res = await axios.get(
            `${Server}/usercampaigns/request-history?page=${page}${row === 'All' ? '' : `&size=${row}`}${
                search ? `&keyword=${search}` : ''
            }${status ? `&Status=${status}` : ''}
      &DepartmentID=${DepartmentID}`,
            token
        );
        const datas = res.data.data.userCampaigns;
        const totalPage = Math.ceil(res.data.data.total / row);
        let totalItems = res.data.data.total;
        const history = datas.map((data) => {
            const {
                ID,
                CampaignID,
                UserMasterID,
                Evidence,
                Description,
                Confirmer,
                Status,
                CreatedDate,
                UpdatedDate,
                Campaign,
                UserMaster,
                Note
            } = data;

            return {
                CreatedDate: moment(CreatedDate).format('DD-MM-YYYY'),
                ID,
                CampaignID,
                UserMasterID,
                Evidence,
                Description,
                Confirmer,
                Status,
                UpdatedDate,
                Campaign,
                UserMaster,
                Note
            };
        });
        return { history, totalPage, totalItems };
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getRequestMoocCampaignHistory = async (token, DepartmentID, page, row, sort, search, status, account) => {
    try {
        const res = await axios.get(
            `${Server}/usermooccampaigns/request-history?page=${page}${row === 'All' ? '' : `&size=${row}`}${
                search ? `&keyword=${search}` : ''
            }${status ? `&Status=${status}` : ''}
     
      &DepartmentID=${DepartmentID}`,
            token
        );

        const datas = res.data.data.userMoocCampaigns;
        const totalPage = Math.ceil(res.data.data.total / row);
        let totalItems = res.data.data.total;
        const history = datas.map((data) => {
            const {
                Confirmer,
                CreatedDate,
                Description,
                Evidence,
                ID,
                MoocCampaignID,
                PublishedDate,
                Status,
                UpdatedDate,
                UserMasterID,
                MoocCampaign,
                UserMaster
            } = data;

            return {
                CreatedDate: moment(CreatedDate).format('DD-MM-YYYY'),
                Confirmer,
                Description,
                Evidence,
                ID,
                MoocCampaignID,
                PublishedDate,
                Status,
                UpdatedDate,
                UserMasterID,
                MoocCampaign,
                UserMaster
            };
        });
        return { history, totalPage, totalItems };
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getCampaignName = async (token, DepartmentID, UserMoocCampaignID) => {
    try {
        const res = await axios.get(
            `${Server}/usermooccampaigns/get-campaign?UserMoocCampaignID=${UserMoocCampaignID}
      &DepartmentID=${DepartmentID}`,
            token
        );

        const datas = res.data.data.userMoocCampaigns;
        const totalPage = Math.ceil(res.data.data.total / row);
        let totalItems = res.data.data.total;
        const history = datas.map((data) => {
            const {
                Confirmer,
                CreatedDate,
                Description,
                Evidence,
                ID,
                MoocCampaignID,
                PublishedDate,
                Status,
                UpdatedDate,
                UserMasterID,
                MoocCampaign,
                UserMaster
            } = data;

            return {
                CreatedDate: moment(CreatedDate).format('DD-MM-YYYY'),
                Confirmer,
                Description,
                Evidence,
                ID,
                MoocCampaignID,
                PublishedDate,
                Status,
                UpdatedDate,
                UserMasterID,
                MoocCampaign,
                UserMaster
            };
        });
        return { history, totalPage, totalItems };
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getRequestDetail = async (token, DepartmentID, ID) => {
    try {
        const res = await axios.get(`${Server}/points/${ID}`, token);
        const datas = res.data.data;
        const {
            RuleDefinition,
            PointOfRule,
            Department,
            Comment,
            Status: StatusRequest,
            Approver,
            Confirmer,
            Times,
            UserMaster,
            Effort,
            KPer,
            Project,
            Month,
            Year,
            RuleDefinitionID,
            ProjectID,
            Evidence,
            Note
        } = datas;

        const { Code: DepartmentCode } = Department;
        const { Name: RuleName, RuleType, Category, PointNumber } = RuleDefinition;
        const { DisplayName, Email } = UserMaster;

        const requestDetail = {
            Approver,
            Confirmer,
            ID,
            PointOfRule,
            ProjectID,
            Comment,
            Status: StatusRequest,
            Times,
            Effort,
            KPer,
            DepartmentCode,
            ProjectCode: Project ? Project.Code : 'No Project',
            RuleName,
            RuleType,
            Category,
            DisplayName,
            Account: Email.split('@')[0],
            Month,
            Year,
            RuleDefinitionID,
            Point: PointNumber,
            Evidence,
            Note
        };
        return requestDetail;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const requestUpdate = async (token, DepartmentID, ID, body) => {
    try {
        await axios.put(`${Server}/points/${ID}?DepartmentID=${DepartmentID} `, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const requestCampaignUpdate = async (token, DepartmentID, ID, body) => {
    try {
        await axios.put(`${Server}/usercampaigns/${ID}?DepartmentID=${DepartmentID} `, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const requestMoocCampaignUpdate = async (token, DepartmentID, ID, body) => {
    try {
        await axios.put(`${Server}/usermooccampaigns/${ID}?DepartmentID=${DepartmentID} `, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const requestUpdateBulk = async (token, DepartmentID, body) => {
    try {
        await axios.patch(`${Server}/points/Status?DepartmentID=${DepartmentID}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const requestUpdateCampaignBulk = async (token, DepartmentID, body) => {
    try {
        await axios.patch(`${Server}/usercampaigns/update-many?DepartmentID=${DepartmentID}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const requestUpdateMoocCampaignBulk = async (token, DepartmentID, body) => {
    try {
        await axios.patch(`${Server}/usermooccampaigns/update-many?DepartmentID=${DepartmentID}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const createSelfRequest = async (token, body) => {
    try {
        await axios.post(`${Server}/points/selfmark`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const deleteRequest = async (token, pointID) => {
    try {
        await axios.delete(`${Server}/points/${pointID}`, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getHistory = async (token, DepartmentID, month, year, page, row, sort, search, userID) => {
    try {
        let res;
        if (sort === 'Date:ASC' && userID !== '') {
            res = await axios.get(
                `${Server}/points?page=${page}&size=${row}${userID ? `&UserMasterID=${userID}` : ''}&Status=3${
                    month ? `&Month=${month}` : ''
                }&Year=${year}&sort=Year:ASC&sort=Month:ASC${
                    search ? `&keyword=${search}` : ''
                }&DepartmentID=${DepartmentID}`,
                token
            );
        } else if (sort === 'Date:DESC' && userID !== '') {
            res = await axios.get(
                `${Server}/points?page=${page}&size=${row}${userID ? `&UserMasterID=${userID}` : ''}&Status=3${
                    month ? `&Month=${month}` : ''
                }&Year=${year}&sort=Year:DESC&sort=Month:DESC${
                    search ? `&keyword=${search}` : ''
                }&DepartmentID=${DepartmentID}`,
                token
            );
        } else if (userID !== '') {
            res = await axios.get(
                `${Server}/points?page=${page}&size=${row}${userID ? `&UserMasterID=${userID}` : ''}&Status=3${
                    month ? `&Month=${month}` : ''
                }&Year=${year}${sort ? `&sort=${sort}` : '&sort=CreatedDate:DESC'}${
                    search ? `&keyword=${search}` : ''
                }&DepartmentID=${DepartmentID}`,
                token
            );
        } else {
            return { historyData: [], totalPage: 0, totalItems: 0 };
        }

        const totalPage = Math.ceil(res.data.data.total / row);
        const datas = res.data.data.points;
        let totalItems = res.data.data.total;
        const historyData = datas.map((data, index) => {
            const {
                Comment,
                RuleDefinition,
                Times,
                Project,
                Approver,
                PointOfRule,
                CreatedDate,
                Month,
                Year,
                CreatedBy,
                RequestType,
                Note
            } = data;

            const { Name } = RuleDefinition;

            return {
                ProjectName: Project ? Project.Code : '',
                Name,
                Comment,
                Times,
                PointOfRule,
                Approver,
                CreatedDate: CreatedDate ? moment(CreatedDate).format('DD/MM/YYYY HH:mm') : null,
                Key: Project ? Project.Key : '',
                Month,
                Year,
                CreatedBy,
                RequestType,
                Note
            };
        });

        return { historyData, totalPage, totalItems };
    } catch (err) {
        throw err.response.data.error;
    }
};
