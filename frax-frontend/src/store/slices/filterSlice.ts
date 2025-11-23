import { createSlice } from '@reduxjs/toolkit';
import { logoutUser } from './userSlice'; 
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import type { FilterState } from '../../types';



const initialState: FilterState = {
    searchTerm: '',
};

export const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.searchTerm = '';
        });
    },
});

export const { setSearchTerm } = filterSlice.actions;
export const selectSearchTerm = (state: RootState) => state.filter.searchTerm;
export default filterSlice.reducer;