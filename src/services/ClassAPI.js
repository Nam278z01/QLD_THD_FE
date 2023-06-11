import axios from 'axios';
import { Server, Status, UserMaster } from '../dataConfig';

export const getAllClass = async () => {
    try {
        const res = await axios.get(`${Server}/class`);
        const allwalletDetail = res.data.data;
        return allwalletDetail;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const createClass = async (body) => {
    try {
        return await axios.post(`${Server}/class`, body);
    } catch (err) {
        throw err.response.data.error;
    }
};