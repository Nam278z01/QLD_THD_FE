import axios from "axios";
import { Server } from "../dataConfig";


export const getDataChart = async (token, DepartmentID, month,year) => {
    try {
      const res = await axios.get(
        `${Server}/statistical?month=${month}&year=${year}&departmentID=${DepartmentID}`,
        token
      );
      const dataChart = res?.data?.arrData;
      return dataChart;
    } catch (err) {
      throw err.response.data.error;
    }
  };
export const getDataChartLine = async (token, DepartmentID, year) => {
    try {
      const res = await axios.get(
        `${Server}/statistical//point_coin?&year=${year}&departmentID=${DepartmentID}`,
        token
      );
      const dataChart = res.data;
      return dataChart;
    } catch (err) {
      throw err.response.data.error;
    }
  };