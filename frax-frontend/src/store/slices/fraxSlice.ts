import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import { logoutUser } from './userSlice'; 
import type { DsFraxDTO, DsFraxUpdateRequest, DsFactorToFraxUpdateRequest } from '../../api/Api';



interface FraxState {
    list: DsFraxDTO[];           
    currentOrder: DsFraxDTO | null; 
    loading: boolean;
    error: string | null;
    operationSuccess: boolean;  
}

const initialState: FraxState = {
    list: [],
    currentOrder: null,
    loading: false,
    error: null,
    operationSuccess: false,
};

// --- 1. Получение списка заявок (с фильтрами) ---
export const fetchOrdersList = createAsyncThunk(
    'frax/fetchList',
    async (filters: { status?: string; from?: string; to?: string }, { rejectWithValue }) => {
        try {
            const queryArgs: any = {};
            if (filters.status && filters.status !== 'all') queryArgs.status = parseInt(filters.status);
            if (filters.from) queryArgs.from = filters.from;
            if (filters.to) queryArgs.to = filters.to;
            const response = await api.frax.fraxList(queryArgs);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.description || 'Ошибка загрузки списка');
        }
    }
);

// --- 2. Получение одной заявки по ID ---
export const fetchOrderById = createAsyncThunk(
    'frax/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.frax.fraxDetail(parseInt(id));
            const data: any = response.data;
            const mappedFactors = (data.Factors || data.factors || []).map((f: any) => ({
                factor_id: f.FactorID ?? f.factor_id ?? 0,
                title: f.Title ?? f.title ?? 'Без названия',
                image: f.Image ?? f.image ?? '',
                description: f.Description ?? f.description ?? ''
            }));
            const mappedOrder: DsFraxDTO = {
                id: data.ID ?? data.id,
                status: data.Status ?? data.status ?? 1, 
                age: data.Age ?? data.age ?? 0,
                gender: data.Gender ?? data.gender ?? false,
                weight: data.Weight ?? data.weight ?? 0,
                height: data.Height ?? data.height ?? 0,
                POF: data.POF ?? data.pof ?? 0,
                PHF: data.PHF ?? data.phf ?? 0,
                factors: mappedFactors
            };
            
            console.log('Загруженная заявка (после маппинга):', mappedOrder); 
            return mappedOrder;
        } catch (err: any) {
            return rejectWithValue('Заявка не найдена');
        }
    }
);

// --- 3. Сохранение (Обновление полей: вес, рост и т.д.) ---
export const updateOrderFields = createAsyncThunk(
    'frax/updateFields',
    async ({ id, data }: { id: number; data: DsFraxUpdateRequest }, { rejectWithValue }) => {
        try {
            const payload = {
                Age: data.age,
                Gender: data.gender,
                Weight: data.weight,
                Height: data.height
            };            
            // @ts-ignore
            await api.frax.fraxUpdate(id, payload);
            return data;
        } catch (err: any) {
            return rejectWithValue('Ошибка сохранения');
        }
    }
);

// --- 4. Обновление описания фактора (М-М связь) ---
export const updateFactorDescription = createAsyncThunk(
    'frax/updateFactorDesc',
    async ({ orderId, factorId, desc }: { orderId: number; factorId: number; desc: string }, { rejectWithValue }) => {
        try {
            const data: DsFactorToFraxUpdateRequest = { description: desc };
            await api.frax.factorsUpdate(orderId, factorId, data);
            return { factorId, desc };
        } catch (err) {
            return rejectWithValue('Не удалось обновить описание');
        }
    }
);

// --- 5. Удаление фактора из заявки ---
export const removeFactorFromOrder = createAsyncThunk(
    'frax/removeFactor',
    async ({ orderId, factorId }: { orderId: number; factorId: number }, { rejectWithValue }) => {
        try {
            await api.frax.factorsDelete(orderId, factorId);
            return factorId;
        } catch (err) {
            return rejectWithValue('Ошибка удаления фактора');
        }
    }
);

// --- 6. Сформировать заявку (Отправить) ---
export const submitOrder = createAsyncThunk(
    'frax/submit',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.frax.formUpdate(id);
            return id;
        } catch (err: any) {
            return rejectWithValue('Ошибка формирования заявки');
        }
    }
);

// --- 7. Удалить заявку ---
export const deleteOrder = createAsyncThunk(
    'frax/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.frax.fraxDelete(id);
            return id;
        } catch (err) {
            return rejectWithValue('Ошибка удаления');
        }
    }
);

const fraxSlice = createSlice({
    name: 'frax',
    initialState,
    reducers: {
        resetOperationSuccess: (state) => {
            state.operationSuccess = false;
        },
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Список
            .addCase(fetchOrdersList.pending, (state) => { state.loading = true; })
            .addCase(fetchOrdersList.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload || []; 
})
            // Детали
            .addCase(fetchOrderById.pending, (state) => { state.loading = true; state.currentOrder = null; })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
            })
            // Обновление полей (локально обновляем стейт)
            .addCase(updateOrderFields.fulfilled, (state, action) => {
                if (state.currentOrder) {
                    state.currentOrder = { ...state.currentOrder, ...action.payload };
                }
            })
            // Обновление описания фактора
            .addCase(updateFactorDescription.fulfilled, (state, action) => {
                if (state.currentOrder && state.currentOrder.factors) {
                    const factor = state.currentOrder.factors.find(f => f.factor_id === action.payload.factorId);
                    if (factor) factor.description = action.payload.desc;
                }
            })
            // Удаление фактора
            .addCase(removeFactorFromOrder.fulfilled, (state, action) => {
                if (state.currentOrder && state.currentOrder.factors) {
                    state.currentOrder.factors = state.currentOrder.factors.filter(f => f.factor_id !== action.payload);
                }
            })
            // Сформировать / Удалить (успех)
            .addCase(submitOrder.fulfilled, (state) => { state.operationSuccess = true; })
            .addCase(deleteOrder.fulfilled, (state) => { state.operationSuccess = true; })
            // Сброс
            .addCase(logoutUser.fulfilled, () => initialState);
    }
});

export const { resetOperationSuccess, clearCurrentOrder } = fraxSlice.actions;
export default fraxSlice.reducer;