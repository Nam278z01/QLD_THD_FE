import axios from 'axios';
import { Server, Status, UserMaster } from '../dataConfig';

export const getGroupList = async (token, DepartmentID, page, row, search) => {
    try {
        const res = await axios.get(
            `${Server}/groups?sort=Status:ASC&CreatedDate:DESC&DepartmentID=${DepartmentID}&page=${page}${
                row === 'All' ? '' : `&size=${row}`
            }${search ? `&keyword=${search}` : ''}`,
            token
        );
        const datas = res.data.data.groups;
        const totalPage = Math.ceil(res.data.data.total / row);

        const GroupCampaignData = datas.map((data) => ({
            ID: data.ID,
            DepartmentID: data.DepartmentID,
            Name: data.Name,
            ShortDescription: data.ShortDescription,
            DetailDescription: data.DetailDescription,
            Status: data.Status,
            CreatedBy: data.CreatedBy,
            UpdatedBy: data.UpdatedBy,
            UserMasters: data.UserMasters
        }));

        return { GroupCampaignData, totalPage };
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getActiveGroupList = async (token, DepartmentID, page, row, search) => {
    try {
        const res = await axios.get(
            `${Server}/groups?Status=1&DepartmentID=${DepartmentID}&page=${page}${row === 'All' ? '' : `&size=${row}`}${
                search ? `&keyword=${search}` : ''
            }`,
            token
        );
        const datas = res.data.data.groups;
        const totalPage = Math.ceil(res.data.data.total / row);
        const GroupCampaignData = datas.map((data) => ({
            ID: data.ID,
            DepartmentID: data.DepartmentID,
            Name: data.Name,
            ShortDescription: data.ShortDescription,
            DetailDescription: data.DetailDescription,
            Status: data.Status,
            CreatedBy: data.CreatedBy,
            UpdatedBy: data.UpdatedBy,
            UserMasters: data.UserMasters
        }));

        return { GroupCampaignData, totalPage };
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getUserGroupList = async (token, DepartmentID, userID, page, row, search) => {
    try {
        const res = await axios.get(
            `${Server}/groupmembers?sort=CreatedDate:DESC&MemberID=${userID}&DepartmentID=${DepartmentID}&page=${page}${
                row === 'All' ? '' : `&size=${row}`
            }${search ? `&keyword=${search}` : ''}`,
            token
        );
        const datas = res.data.data.groupMembers;
        const totalPage = Math.ceil(res.data.data.total / row);

        const GroupCampaignData = datas.map((data) => ({
            ID: data.Group.ID,
            DepartmentID: data.Group.DepartmentID,
            Name: data.Group.Name,
            ShortDescription: data.Group.ShortDescription,
            DetailDescription: data.Group.DetailDescription,
            Status: data.Group.Status,
            CreatedBy: data.Group.CreatedBy,
            UpdatedBy: data.Group.UpdatedBy,
            UserMasters: data.UserMaster
        }));

        return { GroupCampaignData, totalPage };
    } catch (err) {
        throw err.response.data.error;
    }
};

export const createGroup = async (token, DepartmentID, body) => {
    try {
        await axios.post(`${Server}/groups?DepartmentID=${DepartmentID}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const updateGroupCampaign = async (token, DepartmentID, ID, body) => {
    try {
        await axios.put(`${Server}/groups/${ID}`, body, token);
    } catch (err) {
        throw err.response.data.error;
        return false;
    }
};
export const DeleteGroupCampaign = async (token, DepartmentID, ID, body) => {
    try {
        await axios.delete(`${Server}/groups/${ID}`, token);
    } catch (err) {
        return false;
    }
};
export const getGroupCampaignDetail = async (token, DepartmentID, id) => {
    try {
        const res = await axios.get(`${Server}/groups/${id}`, token);
        const datas = res.data.data;

        const {
            ID,
            DepartmentID,
            Name,
            ShortDescription,
            DetailDescription,
            Status,
            CreatedBy,
            UpdatedBy,
            UserMasters
        } = datas;

        return datas;
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getGroupMember = async (token, DepartmentID, id) => {
    try {
        const res = await axios.get(`${Server}/groupmembers/${id}`, token);
        const datas = res.data.data;

        const { ID, GroupID, MemberID, Status } = datas;

        return datas;
    } catch (err) {
        throw err.response.data.error;
    }
};
