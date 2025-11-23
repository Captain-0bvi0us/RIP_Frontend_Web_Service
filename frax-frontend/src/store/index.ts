import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './slices/filterSlice';
import factorsReducer from './slices/factorsSlice'; 
import cartReducer from './slices/cartSlice';     
import userReducer from './slices/userSlice';
import fraxReducer from './slices/fraxSlice';

export const store = configureStore({
    reducer: {
        filter: filterReducer,
        factors: factorsReducer, 
        cart: cartReducer, 
        user: userReducer,
        frax: fraxReducer,    
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;