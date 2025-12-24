import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import type { DsUserLoginRequest, DsUserRegisterRequest, DsUserUpdateRequest, DsUserDTO } from '../../api/Api';



interface UserState {
    user: DsUserDTO | null;      
    token: string | null;        
    isAuthenticated: boolean;    
    registerSuccess: boolean;   
    loading: boolean;         
    error: string | null;      
}

const storedToken = localStorage.getItem('authToken');

const initialState: UserState = {
    user: null,          
    token: storedToken,  
    isAuthenticated: !!storedToken, 
    registerSuccess: false,
    loading: false,
    error: null,
};

// --- ВХОД ---
export const loginUser = createAsyncThunk(
    'user/login',
    async (credentials: DsUserLoginRequest, { rejectWithValue }) => {
        try {
            const response = await api.auth.loginCreate(credentials);
            const data = response.data;

            if (data.token) localStorage.setItem('authToken', data.token);
            return data;
        } catch (err: any) {
            const backendData = err.response?.data;
            const backendError = backendData?.description || backendData?.error || err.message || 'Unknown error';
            console.log('Error from backend:', backendError);
            let readableError = 'Произошла ошибка при входе';

            if (typeof backendError === 'string') {
                if (backendError.includes('record not found')) {
                    readableError = 'Пользователь с таким логином не найден';
                } 
                else if (backendError.includes('hashedPassword') || backendError.includes('crypto/bcrypt')) {
                    readableError = 'Неверный пароль. Попробуйте снова.';
                } 
                else if (backendError.includes('Network Error')) {
                    readableError = 'Сервер недоступен. Проверьте соединение.';
                } 
                else {
                    readableError = backendError;
                }
            }

            return rejectWithValue(readableError);
        }
    }
);

// --- РЕГИСТРАЦИЯ (без изменений) ---
export const registerUser = createAsyncThunk(
    'user/register',
    async (credentials: DsUserRegisterRequest, { rejectWithValue }) => {
        try {
            const response = await api.users.usersCreate(credentials);
            return response.data; 
        } catch (err: any) {
            return rejectWithValue('Ошибка регистрации');
        }
    }
);

// --- ВЫХОД ---
export const logoutUser = createAsyncThunk(
    'user/logout',
    async () => {
        try {
            await api.auth.logoutCreate();
        } catch (err) {
            console.warn('Logout failed');
        } finally {
            localStorage.removeItem('authToken'); 
        }
    }
);

// --- ПОЛУЧЕНИЕ ПРОФИЛЯ ---
export const fetchUserProfile = createAsyncThunk(
    'user/fetchProfile',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await api.users.usersDetail(id);
            return response.data;
        } catch (err: any) {
            return rejectWithValue('Не удалось загрузить профиль');
        }
    }
);

// --- ОБНОВЛЕНИЕ ---
export const updateUserProfile = createAsyncThunk(
    'user/updateProfile',
    async ({ id, data }: { id: number; data: DsUserUpdateRequest }, { rejectWithValue }) => {
        try {
            await api.users.usersUpdate(id, data);
            return { id, ...data }; 
        } catch (err: any) {
            return rejectWithValue('Ошибка обновления');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearError: (state) => { state.error = null; },
        resetRegisterSuccess: (state) => { state.registerSuccess = false; }
    },
    extraReducers: (builder) => {
        builder
            // Login
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
                // Сюда попадает наш readableError
                state.error = action.payload as string; 
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            })
            // Fetch Profile
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                localStorage.removeItem('authToken');
            })
            // Update Profile
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                 if (state.user) {
                    if (action.payload.full_name) state.user.full_name = action.payload.full_name;
                    if (action.payload.username) state.user.username = action.payload.username;
                }
            });
    },
});

export const { clearError, resetRegisterSuccess } = userSlice.actions;
export default userSlice.reducer;