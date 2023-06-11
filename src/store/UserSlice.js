import { createSlice } from '@reduxjs/toolkit';
import { UserMaster } from '../dataConfig';

const initialState = {
    name: '',
    email: '',
    role: '',
    account: '',
    displayName: '',
    userID: null,
    imgurl: '',
    roleID: '',
    userDepartmentID: '',
    userDepartmentCode: ''
};

export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        setUserInfo(state, action) {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.account = action.payload.account;
        },

        setUserRoleAndID(state, action) {
            state.role = action.payload.Role ?? null;

            state.roleID = action.payload.Role;
            state.userID = action.payload.ID || 0;
            state.userDepartmentID = action.payload.DepartmentID;
            state.userDepartmentCode = action.payload.Code;
            state.displayName = action.payload.DisplayName;
        },

        setUserAvatar(state, action) {
            state.imgurl = action.payload;
        }
    }
});

// Action creators are generated for each case reducer function
export const { setUserInfo, setUserRoleAndID, setUserAvatar } = userSlice.actions;

export default userSlice.reducer;
