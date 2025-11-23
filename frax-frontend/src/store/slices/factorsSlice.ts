import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import { FACTORS_MOCK } from '../../api/mock'; 
import type { IFactor } from '../../types';



interface FactorsState {
    items: IFactor[];
    total: number;
    currentFactor: IFactor | null;
    loading: boolean;
    error: string | null;
}

const initialState: FactorsState = {
    items: [],
    total: 0,
    currentFactor: null,
    loading: false,
    error: null,
};

// --- Thunk: Получение списка факторов ---
export const fetchFactors = createAsyncThunk(
    'factors/fetchFactors',
    async (title: string, { rejectWithValue }) => {
        try {
            const response = await api.factors.factorsList({ title });
            
            const rawItems = response.data.items || [];
            
            const mappedItems: IFactor[] = Array.isArray(rawItems) 
                ? rawItems.map((item: any) => ({
                    id: item.id ?? 0,
                    title: item.title ?? 'Без названия',
                    text: item.text ?? '',
                    image: item.image ?? '',
                    argument: item.argument ?? 0,
                    status: item.status ?? false,
                }))
                : [];

            return {
                items: mappedItems,
                total: response.data.total || 0
            };
        } catch (err) {
            return rejectWithValue('Backend unavailable');
        }
    }
);

// --- Thunk: Получение одного фактора ---
export const fetchFactorById = createAsyncThunk(
    'factors/fetchFactorById',
    async (id: string, { rejectWithValue }) => {
        try {
            const factorId = parseInt(id);
            const response = await api.factors.factorsDetail(factorId);
            
            const data = response.data;
            const mappedFactor: IFactor = {
                id: data.id ?? factorId,
                title: data.title ?? 'Без названия',
                text: data.text ?? '',
                image: data.image ?? '',
                argument: data.argument ?? 0,
                status: data.status ?? false
            };

            return mappedFactor;
        } catch (err) {
            return rejectWithValue(id);
        }
    }
);

const factorsSlice = createSlice({
    name: 'factors',
    initialState,
    reducers: {
        clearCurrentFactor: (state) => {
            state.currentFactor = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFactors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFactors.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items; 
                state.total = action.payload.total;
            })
            .addCase(fetchFactors.rejected, (state, action) => {
                state.loading = false;
                state.error = 'Backend unavailable';
                console.warn('[Redux] Ошибка загрузки списка. Используем моки.');
                const filterTitle = (action.meta.arg as string) || '';
                const filteredMockItems = FACTORS_MOCK.items.filter(factor =>
                    factor.title.toLowerCase().includes(filterTitle.toLowerCase())
                );
                state.items = filteredMockItems;
                state.total = filteredMockItems.length;
            })
            .addCase(fetchFactorById.pending, (state) => {
                state.loading = true;
                state.currentFactor = null; 
            })
            .addCase(fetchFactorById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentFactor = action.payload;
            })
            .addCase(fetchFactorById.rejected, (state, action) => {
                state.loading = false;
                
                const idStr = action.meta.arg;
                const id = parseInt(idStr);
                console.log(`[Redux] Ошибка загрузки фактора ID: ${id}. Ищем в моках...`);

                const factor = FACTORS_MOCK.items.find(f => f.id === id);
                state.currentFactor = factor || null;
            });
    },
});

export const { clearCurrentFactor } = factorsSlice.actions;
export default factorsSlice.reducer;