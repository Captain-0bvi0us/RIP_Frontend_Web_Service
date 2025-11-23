import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import { logoutUser } from './userSlice';



interface CartState {
    frax_id: number | null;
    count: number;
    loading: boolean;
    error: string | null
}

const initialState: CartState = {
    frax_id: null,
    count: 0,
    loading: false,
    error: null,
};

// Получение бейджика
export const fetchCartBadge = createAsyncThunk(
    'cart/fetchCartBadge',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.frax.factorscartList();
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch cart');
        }
    }
);

// Добавление фактора в черновик 
export const addFactorToDraft = createAsyncThunk(
    'cart/addToDraft',
    async (factorId: number, { dispatch, rejectWithValue }) => {
        try {
            await api.frax.draftFactorsCreate(factorId);
            dispatch(fetchCartBadge());
            return factorId;
        } catch (error: any) {
            alert("Ошибка при добавлении: " + (error.response?.data?.description || "Неизвестная ошибка"));
            return rejectWithValue('Failed to add');
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartBadge.fulfilled, (state, action) => {
                state.frax_id = action.payload.frax_id || null;
                state.count = action.payload.count || 0;
            })
            .addCase(fetchCartBadge.rejected, (state) => {
                state.frax_id = null;
                state.count = 0;
            })
            .addCase(logoutUser.fulfilled, () => initialState);
    }
});

export default cartSlice.reducer;