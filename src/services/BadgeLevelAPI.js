import axios from 'axios';
import { Server, Status, UserMaster } from '../dataConfig';

export const getAllLevel = async (token, DepartmentID) => {
    try {
        const res = await axios.get(`${Server}/badges?DepartmentID=${DepartmentID}`, token);

        const badges = res.data.data.badges;
        return badges;
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getAllLevelActive = async (token, DepartmentID) => {
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

export const getAllLevelWithPage = async (token, DepartmentID, page, row) => {
    try {
        const res = await axios.get(`${Server}/badges?page=${page}&size=${row}&DepartmentID=${DepartmentID}`, token);

        const badges = res.data.data.badges;
        const totalPage = Math.ceil(res.data.data.total / row);

        return { badges, totalPage };
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getOneLevel = async (token, DepartmentID, badgeID) => {
    try {
        const res = await axios.get(`${Server}/badgelevel/${ID}`, token);

        const badges = res.data.data;

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

export const createLevel = async (token, DepartmentID, ID, body) => {
    try {
        await axios.post(`${Server}/badgelevel`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const updateLevel = async (token, DepartmentID, ID, body) => {
    try {
        await axios.put(`${Server}/badgelevel/${ID}?DepartmentID=${DepartmentID}`, body, token);
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
