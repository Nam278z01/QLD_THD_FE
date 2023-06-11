import axios from 'axios';
import { Server, Status, UserMaster } from '../dataConfig';

export const getAllSubject = async () => {
    try {
        const res = await axios.get(`${Server}/subject`);
        const allwalletDetail = res.data.data;
        return allwalletDetail;
    } catch (err) {
        throw err.response.data.error;
    }
};