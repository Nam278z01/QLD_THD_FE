import { configureStore } from '@reduxjs/toolkit';
import DepartmentSettingSlice from './DepartmentSettingSlice';
import LoadingSlice from './LoadingSlice';
import UserSlice from './UserSlice';

export const store = configureStore({
    reducer: {
        UserSlice: UserSlice,
        DepartmentSettingSlice: DepartmentSettingSlice,
        LoadingSlice: LoadingSlice
    }
});
