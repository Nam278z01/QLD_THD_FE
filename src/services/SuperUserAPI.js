import axios from 'axios';
import { Server } from '../dataConfig';

export const getSuperUserList = async (token, departmentID) => {
  try {
    const res = await axios.get(`${Server}/superuser`, token);

    const datas = res.data.data;

    return datas;
  } catch (err) {
    return "NO DATA";
  }
};
