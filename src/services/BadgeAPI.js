import axios from 'axios';
import { Server, Status, UserMaster } from '../dataConfig';

export const getAllBadge = async (token, DepartmentID) => {
    try {
        const res = await axios.get(`${Server}/badges?DepartmentID=${DepartmentID}`, token);

        const badges = res.data.data.badges;
        return badges;
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getAllBadgeActive = async (token, DepartmentID) => {
    try {
        const res = await axios.get(`${Server}/badges?Status=1&DepartmentID=${DepartmentID}`, token);

        const badges = res.data.data.badges;
        let data = badges.map((data) => ({
            label: data.Name,
            value: data.ID,
            ImageURL: data.ImageURL
        }));

        return data;
    } catch (err) {
        throw [];
    }
};

export const getAllBadgeWithPage = async (token, DepartmentID, page, row, search, status) => {
    try {
        const res = await axios.get(
            `${Server}/badges?page=${page}&size=${row}&DepartmentID=${DepartmentID}${
                search ? `&keyword=${search}` : ''
            }${status ? `&Status=${status}` : ''}`,
            token
        );

        const badges = res.data.data.badges;
        const totalPage = Math.ceil(res.data.data.total / row);
        let totalItems = res.data.data.total;

        return { badges, totalPage, totalItems };
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getOneBadge = async (token, DepartmentID, badgeID) => {
    try {
        const res = await axios.get(`${Server}/badges/${badgeID}`, token);

        const badges = res.data.data;

        return badges;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getOneBadgeV2 = async (token, DepartmentID, badgeID) => {
    try {
        const res = await axios.get(`${Server}/badges/${badgeID}`, token);

        const badges = res.data.data;
        const value = res.data.data.Condition;
        if (value) {
            if (value.includes('desc') || value.includes('asc')) {
                badges.isOperator = false;
            } else {
                badges.isOperator = true;
            }
        }
        return badges;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const get3UserBadge = async (token, DepartmentID, userID) => {
    try {
        const res = await axios.get(`${Server}/userbadges?UserMasterID=${userID}&DepartmentID=${DepartmentID}`, token);

        const badgeArray = [];

        const datas = res.data.data.userBadges;
        datas.forEach((data, i) => {
            if (i < 3) {
                badgeArray.push({
                    Name: data.Badge.Name,
                    BadgeID: data.BadgeID,
                    Description: data.Badge.Description,
                    ImageURL: `${data.Badge.ImageURL}`
                });
            }
        });

        return badgeArray;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getUserBadgeInOrder = async (token, DepartmentID, userID) => {
    try {
        const res = await axios.get(`${Server}/userbadges/badge?UserMasterID=${userID}`, token);
        const badgeArray = [];

        const datas = res.data.data;
        datas.forEach((data, i) => {
            if (i < 3) {
                badgeArray.push({
                    Name: data.Badge.Name,
                    BadgeID: data.BadgeID,
                    Description: data.Badge.Description,
                    ImageURL: `${data.Badge.ImageURL}`
                });
            }
        });

        return badgeArray;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getUserBadgeAll = async (token, DepartmentID, userID) => {
    try {
        const res = await axios.get(`${Server}/userbadges?UserMasterID=${userID}&DepartmentID=${DepartmentID}`, token);

        const badgeArray = [];

        const datas = res.data.data.userBadges;

        datas.forEach((data, i) => {
            if (data.Status !== 2) {
                badgeArray.push({
                    IDLink: data.ID,
                    Name: data.Badge.Name,
                    ID: data.BadgeID,
                    Description: data.Badge.Description,
                    ImageURL: `${data.Badge.ImageURL}`
                });
            }
        });

        return badgeArray;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const giveBadge = async (token, DepartmentID, body) => {
    try {
        await axios.post(`${Server}/userbadges`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const removeBadge = async (token, DepartmentID) => {
    try {
        await axios.delete(`${Server}/userbadges`, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const createBadge = async (token, DepartmentID, body) => {
    try {
        await axios.post(`${Server}/badges`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const updateBadge = async (token, DepartmentID, body, ID) => {
    try {
        await axios.put(`${Server}/badges/${ID}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const setBadge = async (token, DepartmentID, body) => {
    try {
        await axios.post(`${Server}/userbadges/setbadge`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const updateBadgeV2 = async (token, ID, body) => {
    try {
        await axios.put(`${Server}/badges/${ID}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const createScheduleAwardBadge = async (token, DepartmentID, body) => {
    try {
        const res = await axios.post(`${Server}/schedule/?DepartmentID=${DepartmentID}`, body, token);
        return res;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const updateScheduleAwardBadge = async (token, DepartmentID, ID, body) => {
    try {
        await axios.put(`${Server}/schedule/?DepartmentID=${DepartmentID}&id=${ID}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getScheduleBadge = async (token, DepartmentID, badgeID) => {
    try {
        const res = await axios.get(`${Server}/schedule/?BadgeID=${badgeID}`, token);

        const badges = res.data.data;

        return badges;
    } catch (err) {
        throw err.response.data.error;
    }
};
