import axios from 'axios';
import { Server, Status, UserMaster } from '../dataConfig';

export const getAllGrade = async () => {
    try {
        const res = await axios.get(`${Server}/grade`);
        const allwalletDetail = res.data.data;
        return allwalletDetail;
    } catch (err) {
        throw err.response.data.error;
    }
};