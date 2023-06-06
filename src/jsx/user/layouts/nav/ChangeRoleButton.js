import { useSelector } from "react-redux";
import { UserMaster } from "../../../../dataConfig";
import { changeUserRole1 } from "../../../../services/UsermasterAPI";
import { useContext } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";

const ChangeRoleButton = () => {
  const { role, account } = useSelector((state) => state.UserSlice);

  const { getToken } = useContext(GetTokenContext);

  function success() {
    window.location.reload(false);
  }

  function changeRole(rolePara) {
    const body = { RoleID: rolePara };
    getToken(changeUserRole1, false, success, false, account, body);
  }
  return (
    <div className="d-flex align-items-center gap-1">
      Role:
      <select
        defaultValue={
          UserMaster.Role.findIndex((nameRole) => nameRole === role) + 1
        }
        className="form-select align-items-center"
        onChange={(e) => {
          changeRole(e.target.value);
        }}
      >
        <option value={2}>Head</option>
        <option value={3}>PM</option>
        <option value={4}>Member</option>
        {role === "Guest" && <option value={5}>Guest</option>}
      </select>
    </div>
  );
};

export default ChangeRoleButton;
