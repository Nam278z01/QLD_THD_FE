import axios from 'axios';
import moment from 'moment';
import { Server, Status, UserMaster } from '../dataConfig';

export const createNickName = async (token, body) => {
    try {
        await axios.post(`${Server}/nicknames`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const findAllUserNickname = async (token, DepartmentID, userID) => {
    try {
        const res = await axios.get(`${Server}/nicknames?UserMasterID=${userID}&DepartmentID=${DepartmentID}`, token);

        const nicknames = res.data.data;

        return nicknames;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const voteForNickname = async (token, body) => {
    try {
        await axios.put(`${Server}/usernicknames`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const voteForNicknameFirst = async (token, DepartmentID, body) => {
    try {
        await axios.post(`${Server}/usernicknames?DepartmentID=${DepartmentID}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getWhatIVote = async (token, DepartmentID, voted, voter) => {
    try {
        const res = await axios.get(
            `${Server}/usernicknames?voter=${voter}&voted=${voted}&DepartmentID=${DepartmentID}`,
            token
        );

        return res.data.data.rows;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const deleteNickname = async (token, nicknameID) => {
    try {
        await axios.delete(`${Server}/nicknames/${nicknameID}?`, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
