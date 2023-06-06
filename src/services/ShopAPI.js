import axios from 'axios';
import { Server, Status, UserMaster } from '../dataConfig';

export const getShopList = async (token, DepartmentID, page, row, search) => {
    try {
        const res = await axios.get(
            `${Server}/products?sort=CreatedDate:DESC&DepartmentID=${DepartmentID}&Status=1&page=${page}${
                row === 'All' ? '' : `&row=${row}`
            }${search ? `&keyword=${search}` : ''}`,
            token
        );
        const datas = res.data.data.Product;

        const totalPage = Math.ceil(res.data.data.total / row);
        const totalItems = res.data.data.total;
        const ShopData = datas.map((data) => ({
            ID: data.ID,
            Name: data.Name,
            UserMasterID: data.UserMasterID,
            UserMasterName: data.UserMaster.Account,
            Coin: data.Coin,
            Quantity: data.Quantity,
            Type: data.Type,
            Description: data.Description,
            Image: data.Image.split(',')[0],
            UserMasterBookID: data.UserMasterBookID,
            Message: data.Message,
            Contact: data.Contact,
            Status: data.Status,
            CreatedDate: data.CreatedDate
        }));
        return { ShopData, totalPage, totalItems };
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getShopHistoryList = async (token, DepartmentID, page, row, search) => {
    try {
        const res = await axios.get(
            `${Server}/shophistory?sort=CreatedDate:DESC&page=${page}${
                row === 'All' ? '' : `&size=${row}`
            }&keyword=${search}`,
            token
        );

        const datas = res.data.data.ShopHistorys;
        const totalPage = Math.ceil(res.data.data.total / row);
        const totalItems = res.data.data.total;
        const ShopData = datas.map((data) => ({
            ID: data.ID,
            Product: data.Product,
            UserMasterBuy: data.UserMasterBuy,
            UserMasterSale: data.UserMasterSale,
            ProductID: data.ProductID,
            TotalCoin: data.TotalCoin,
            Status: data.Status,
            CreatedDate: data.CreatedDate,
            Message: data.Message,
            buyer: data.buyer,
            saler: data.saler
        }));
        return { ShopData, totalPage, totalItems };
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getPersonalShopList = async (token, DepartmentID, UserMasterID, page, row, search) => {
    try {
        const res = await axios.get(
            `${Server}/products?sort=CreatedDate:DESC&DepartmentID=${DepartmentID}&UserMasterID=${UserMasterID}&page=${page}${
                row === 'All' ? '' : `&row=${row}`
            }${search ? `&keyword=${search}` : ''}`,
            token
        );
        const datas = res.data.data.Product;
        const totalPage = Math.ceil(res.data.data.total / row);
        const totalItems = res.data.data.total;
        const ShopData = datas.map((data) => ({
            ID: data.ID,
            Name: data.Name,
            UserMasterID: data.UserMasterID,
            UserMasterName: data.UserMaster.Account,
            Coin: data.Coin,
            Quantity: data.Quantity,
            Type: data.Type,
            Description: data.Description,
            Image: data.Image.split(',')[0],
            UserMasterBookID: data.UserMasterBookID,
            Message: data.Message,
            Contact: data.Contact,
            Status: data.Status,
            product_imgs: data.product_imgs,
            CreatedDate: data.CreatedDate
        }));

        return { ShopData, totalPage, totalItems };
    } catch (err) {
        throw err.response.data.error;
    }
};
export const createProduct = async (token, body) => {
    try {
        await axios.post(`${Server}/products`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getDetailShopHistory = async (token, DepartmentID, ShopID) => {
    try {
        const res = await axios.get(`${Server}/shophistory/${ShopID}`, token);
        const allwalletDetail = res.data.data;
        return allwalletDetail;
    } catch (err) {
        throw err.response.data.error;
    }
};
export const updatePersonalShop = async (token, ID, body) => {
    try {
        await axios.put(`${Server}/products/${ID}`, body, token);
    } catch (err) {
        return false;
    }
};

export const maskAsSoldPersonalShop = async (token, ...params) => {
    try {
        await axios.put(`${Server}/products/sold-out/${params[0]}`, {}, token);
    } catch (err) {
        return false;
    }
};

export const deletePersonalShop = async (token, ID) => {
    try {
        await axios.delete(`${Server}/products/${ID}`, token);
    } catch (err) {
        return false;
    }
};

export const getProductDetail = async (token, DepartmentID, id) => {
    try {
        const res = await axios.get(`${Server}/products/${id}`, token);
        const datas = res.data.data;

        const {
            ID,
            Name,
            UserMasterID,
            UserMaster,
            Coin,
            Quantity,
            Type,
            Description,
            Image,
            UserMasterBookID,
            Contact,
            Status,
            CreatedDate,
            product_imgs
        } = datas;

        const ShopDetail = {
            ID,
            Name,
            UserMasterID,
            UserMaster,
            Coin,
            Quantity,
            Type,
            Description,
            UserMaster,
            Image: Image.split(',')[0],
            UserMasterBookID,
            Contact,
            Status,
            CreatedDate,
            product_imgs
        };

        return ShopDetail;
    } catch (err) {
        throw err.response.data.error;
    }
};
