import { useHistory } from "react-router-dom";
import Select from "react-select";
import useRefreshToken from "../../../Hook/useRefreshToken";
import {
  getAllDepartmentStatus2,
  getAllDepaWelcome,
} from "../../../services/DepartmentAPI";

import img from "../../../images/pic1.png";
import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { getUserRole } from "../../../services/UsermasterAPI";
import Loading from "../../sharedPage/pages/Loading";
import { useSelector } from "react-redux";
function Welcomepage() {
  // const [depaData, setRefresh, setDepaData] = useRefreshToken(
  //   getAllDepartmentStatus2
  // );
  const { accounts } = useMsal();
  const account = accounts[0];
  const [datadepa, setRefreshdatadepa, setDepaDatadatadepa] =
    useRefreshToken(getAllDepaWelcome);

  // const [adminInfo] = useRefreshToken(
  //   getUserRole,
  //   account.username.split("@")[0],
  //   2000 //2000 is admin departmentID, sau tao department ADMIN thi fill ID vao day, hoac tao context ADMINDepartmentID de luu
  // );
  // const [first, setFirst] = useState(true);

  // if (adminInfo !== null && depaData !== null && first) {
  //   if (!adminInfo.ID) {
  //     setDepaData(depaData.filter((x) => x.Code !== "ADMIN"));
  //   }
  //   setFirst(false);
  // }

  // useEffect(() => {
  //   if (depaData !== null && depaData.length === 1) {
  //     navigate.push(`${depaData[0].Code.replace(" ", ".")}/leaderboard`);
  //   }
  // }, [depaData]);
  const navigate = useHistory();
  return datadepa == null ? (
    <Loading />
  ) : (
    <div className="d-flex flex-column justify-content-center align-items-center w-100 my-4">
      <div className="row-2"></div>
      <div className="border border-1 w-50 rounded-5">
        <div
          className="p-3 rounded-5"
          style={{
            backgroundColor: "#dbeafe",
            borderBottomRightRadius: "0px !important",
            borderBottomLeftRadius: "0px !important",
          }}
        >
          <div className="w-100">
            <img
              src={img}
              className="img-fluid d-flex justify-content-center w-25 mx-auto mb-2"
            />
          </div>
        </div>

        <div className="p-5">
          <div className="w-100">
            <h1 className="text-center text-secondary">Welcome To Akarank</h1>
          </div>

          <h6 className="text-center text-secondary">
            Please Choose A Department:
          </h6>
          <div className="w-25 mx-auto">
            <Select
              id="select2"
              options={datadepa}
              onChange={(depa) =>
                navigate.push(`/${depa.Code.split(" ").join(".")}`)
              }
              getOptionValue={(option) => option.label}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcomepage;
