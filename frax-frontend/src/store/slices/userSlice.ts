import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import type { 
    DsUserLoginRequest, 
    DsUserRegisterRequest, 
    DsUserUpdateRequest, 
    DsUserDTO 
} from '../../api/Api';

// Тип состояния пользователя
interface UserState {
    user: DsUserDTO | null;      
    token: string | null;        
    isAuthenticated: boolean;    
    registerSuccess: boolean;   
    loading: boolean;         
    error: string | null;      
}

const storedToken = localStorage.getItem('authToken');
const storedUser = localStorage.getItem('userInfo');

const initialState: UserState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    isAuthenticated: !!storedToken,
    registerSuccess: false,
    loading: false,
    error: null,
};

// --- 1. ВХОД (Login) ---
export const loginUser = createAsyncThunk(
    'user/login',
    async (credentials: DsUserLoginRequest, { rejectWithValue }) => {
        try {
            const response = await api.auth.loginCreate(credentials);
            const data = response.data;

            if (data.token) localStorage.setItem('authToken', data.token);
            if (data.user) localStorage.setItem('userInfo', JSON.stringify(data.user));

            return data;
        } catch (err: any) {
            const backendError = err.response?.data?.description || '';
            let readableError = 'Ошибка авторизации';
            if (backendError.includes('record not found')) {
                readableError = 'Пользователь с таким логином не найден';
            } else if (backendError.includes('hashedPassword is not the hash') || backendError.includes('password')) {
                readableError = 'Неверный пароль';
            } else if (backendError) {
                readableError = backendError;
            }

            return rejectWithValue(readableError);
        }
    }
);

// --- 2. РЕГИСТРАЦИЯ (Register) ---
export const registerUser = createAsyncThunk(
    'user/register',
    async (credentials: DsUserRegisterRequest, { rejectWithValue }) => {
        try {
            const response = await api.users.usersCreate(credentials);
            return response.data; 
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.description || 'Ошибка регистрации');
        }
    }
);

// --- 3. ВЫХОД (Logout) ---
export const logoutUser = createAsyncThunk(
    'user/logout',
    async () => {
        try {
            await api.auth.logoutCreate();
        } catch (err) {
            console.warn('Logout failed on backend, clearing local anyway');
        } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userInfo');
        }
    }
);

// --- 4. ПОЛУЧЕНИЕ ПРОФИЛЯ ---
export const fetchUserProfile = createAsyncThunk(
    'user/fetchProfile',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await api.users.usersDetail(id);
            localStorage.setItem('userInfo', JSON.stringify(response.data));
            return response.data;
        } catch (err: any) {
            return rejectWithValue('Не удалось загрузить профиль');
        }
    }
);

// --- 5. ОБНОВЛЕНИЕ ПРОФИЛЯ ---
export const updateUserProfile = createAsyncThunk(
    'user/updateProfile',
    async ({ id, data }: { id: number; data: DsUserUpdateRequest }, { rejectWithValue }) => {
        try {
            await api.users.usersUpdate(id, data);
            return { id, ...data }; 
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.description || 'Ошибка обновления');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetRegisterSuccess: (state) => {
            state.registerSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // === LOGIN ===
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token || null;
                state.user = action.payload.user || null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // === REGISTER ===
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.registerSuccess = false;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                state.registerSuccess = true; 
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // === LOGOUT ===
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            })
            .addCase(logoutUser.rejected, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            })

            // === FETCH PROFILE ===
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.user = action.payload;
            })

            // === UPDATE PROFILE ===
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                if (state.user) {
                    if (action.payload.full_name) state.user.full_name = action.payload.full_name;
                    if (action.payload.username) state.user.username = action.payload.username;
                }
                localStorage.setItem('userInfo', JSON.stringify(state.user));
            });
    },
});

export const { clearError, resetRegisterSuccess } = userSlice.actions;
export default userSlice.reducer;