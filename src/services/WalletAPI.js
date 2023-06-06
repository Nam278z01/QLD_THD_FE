import axios from 'axios';
import { Server, Status, UserMaster } from '../dataConfig';

export const getWallet = async (token, DepartmentID, UserID, page, row) => {
    try {
        const res = await axios.get(
            `${Server}/userwallets?page=${page}&sort=CreatedDate:DESC&DepartmentID=${DepartmentID}&UserMasterID=${UserID}${
                row === 'All' ? '' : `&size=${row}`
            }`,
            token
        );
        const datas = res.data.data.userCoins;
        const totalPage = Math.ceil(res.data.data.total / row);
        const totalItems = res.data.data.total;
        const walletData = datas.map((data) => ({
            ID: data.ID,
            Receiver: data.Receiver,
            DepartmentID: data.DepartmentID,
            CoinNumber: data.CoinNumber,
            TransactionMethod: data.TransactionMethod,
            Message: data.Message,
            Sender: data.Sender,
            CreatedDate: data.CreatedDate
        }));
        return { walletData, totalPage, totalItems };
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getAllWalletHistory = async (token, DepartmentID, UserID) => {
    try {
        const res = await axios.get(
            `${Server}/userwallets?sort=CreatedDate:DESC&UserMasterID=${UserID}&DepartmentID=${DepartmentID}`,
            token
        );
        const datas = res.data.data.userCoins;
        return datas;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getDetailWalletHistory = async (token, DepartmentID, WalletID) => {
    try {
        const res = await axios.get(`${Server}/userwallets/${WalletID}`, token);
        const allwalletDetail = res.data.data;
        return allwalletDetail;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const TransferCoin = async (token, DepartmentID, body) => {
    try {
        await axios.post(`${Server}/userwallets`, { ...body, DepartmentID }, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
