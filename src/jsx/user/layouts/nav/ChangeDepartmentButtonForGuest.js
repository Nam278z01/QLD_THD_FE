import { getAllDepartmentSetting } from "../../../../services/SettingAPI";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import { getAllDepartmentStatus2 } from "../../../../services/DepartmentAPI";

const ChangeDepartmentButtonForGuest = () => {
  const location = window.location.pathname.split("/")[1].split(".").join(" ");

  const pathName = useLocation().pathname;

  const [depa] = useRefreshToken(getAllDepartmentStatus2);
  
  function changeDepartment(path) {
    window.location.assign(`/${path}${pathName}`);
  }

  return (
    depa !== null && (
      <div className="d-flex align-items-center gap-1">
        Choose Department:
        <Select
          options={depa}
          defaultValue={{
            ID: 1175,
            Code: location ,
          }}
          onChange={(depa) => {
            changeDepartment(depa.Code.split(" ").join("."));
          }}
          getOptionValue={(option) => option.ID}
          getOptionLabel={(option) => option.Code}
        />
      </div>
    )
  );
};

export default ChangeDepartmentButtonForGuest;
