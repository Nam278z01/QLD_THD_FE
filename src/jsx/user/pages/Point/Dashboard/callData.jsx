import React, { useState } from "react";
import useRefreshToken from "../../../../../Hook/useRefreshToken";
import { getDataChart, getDataChartLine } from "../../../../../services/Chart";
import LineChart from "./LineChart";
import { DatePicker, Space } from "antd";
import BarChart from "./BarChart";

const CallData = () => {
  const date = new Date();
  const [year, setYear] = useState(date.getFullYear());
  const [month, setMonth] = useState(date.getMonth() + 1);
  const [valueSelect, setValueSelect] = useState("APlus");
  const [valueYear, setValueYear] = useState(2023);
  const [data, setRefresh] = useRefreshToken(
    getDataChart,
    month,
    year,
    valueSelect
  );
  const [dataLineChart, setRefreshLineChart] = useRefreshToken(
    getDataChartLine,
    valueYear
  );

  const handleChangeYear = (e, value) => {
    setValueYear(value);
  };
  return (
    <>
      {data && (
        <div>
          <BarChart dataBarChart={data} setMonth={setMonth} setYear={setYear} />
        </div>
      )}
      {dataLineChart && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              fontWeight: 500,
              color: "#6E6E6E",
            }}
          >
            Line Chart
          </div>
          <div>
            Year:
            <Space direction="vertical" size={12}>
              <DatePicker
                picker="year"
                bordered={false}
                onChange={handleChangeYear}
              />
            </Space>
            Total coin in year: {dataLineChart?.totalCoinInYear}
          </div>
          <LineChart dataLineChart={dataLineChart} valueYear={valueYear} />
        </div>
      )}
    </>
  );
};

export default CallData;
