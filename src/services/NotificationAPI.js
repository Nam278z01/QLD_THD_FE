import axios from 'axios';
import moment from 'moment';
import { Server, Status, UserMaster } from '../dataConfig';

export const getUserNotification = async (token, DepartmentID, usermasterID) => {
    try {
        const res = await axios.get(`${Server}/notifications?UserMasterID=${usermasterID}`, token);

        return res.data.data.notifications;
    } catch (err) {
        throw err;
    }
};
