import { getAllDepartmentSetting } from "../../../../services/SettingAPI";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllDepaWelcome } from "../../../../services/DepartmentAPI";
const ChangeDepartmentButton = () => {
  const location = window.location.pathname.split("/")[1].split(".").join(" ");
  const { account } = useSelector((state) => state.UserSlice);
  const { Code } = useSelector((a) => a.DepartmentSettingSlice);

  const pathName = useLocation().pathname;

  const [depa] = useRefreshToken(getAllDepartmentSetting);
  const [datadepa, setRefreshdatadepa, setDepaDatadatadepa] =
    useRefreshToken(getAllDepaWelcome);
  function changeDepartment(path) {
    window.location.assign(`/${path}${pathName}`);
  }
  return (
    datadepa !== null && (
      <div className="d-flex align-items-center gap-1">
        BU:
        <Select
          options={datadepa.filter((x) => x.Code !== "ADMIN")}
          defaultValue={{ Code: Code }}
          onChange={(depa) => {
            changeDepartment(depa.Code.split(" ").join("."));
          }}
          getOptionValue={(option) => option.Code}
          getOptionLabel={(option) => option.Code}
        />
      </div>
    )
  );
};

export default ChangeDepartmentButton;
