import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    Logo: '',
    ConversionRatio: 1,
    PointName: 'Point',
    CoinName: 'Coin',
    Code: '',
    Name: '',
    DepartmentID: null,
    DefaultHead: 0,
    IsFsu: ''
};

export const departmentSettingSlice = createSlice({
    name: 'DepartmentSlice',
    initialState,
    reducers: {
        setDepartmentSettingInfo(state, action) {
            state.Logo = action.payload.Logo;
            state.ConversionRatio = action.payload.ConversionRatio || 1;
            state.CoinName = action.payload.CoinName || 'Coin';
            state.PointName = action.payload.PointName || 'Point';
        },

        setDepartmentInfo(state, action) {
            state.Name = action.payload.Name;
            state.Code = action.payload.Code.split(' ').join('-');
            state.DepartmentID = action.payload.DepartmentID;
            state.IsFsu = action.payload.IsFsu;
        },

        setDefaulthead(state, action) {
            state.DefaultHead = action.payload.DefaultHead;
        }
    }
});

// Action creators are generated for each case reducer function
export const { setDepartmentSettingInfo, setDepartmentInfo, setDefaulthead } = departmentSettingSlice.actions;

export default departmentSettingSlice.reducer;
