import axios from 'axios';
import { Server } from '../dataConfig';

export const getDefaultHead = async (token, DepartmentID, trueDepartmentID) => {
    try {
        const res = await axios.get(`${Server}/defaultheads?DepartmentID=${trueDepartmentID}`, token);
        const DefaultHead = res.data.data.defaultHeads;
        return DefaultHead[0];
    } catch (err) {
        throw err;
    }
};

export const getDefaultHead2 = async (token, DepartmentID, trueDepartmentID) => {
    try {
        const res = await axios.get(`${Server}/defaultheads?DepartmentID=${trueDepartmentID}`, token);
        const DefaultHead = res.data.data.defaultHeads;
        return DefaultHead;
    } catch (err) {
        throw err;
    }
};

export const updateDefaultHead = async (token, DepartmentID, id, body) => {
    try {
        await axios.put(`${Server}/defaultheads/${id}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const createDefaultHead = async (token, DepartmentID, body) => {
  try {
    const res = await axios.post(`${Server}/defaultheads`, body, token);
    const DefaultHead = res.data.data;
    return DefaultHead;
  } catch (err) {
    throw err.response.data.error;
  }
};

export const deleteDefaultHead = async (token, DepartmentID, id) => {
    try {
        await axios.delete(`${Server}/defaultheads/${id}`, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
