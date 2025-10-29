import type { IPaginatedFactors, IFactor, ICartBadge} from '../types';
import { FACTORS_MOCK } from './mock';

const API_PREFIX = '/api';

// Получение списка факторов с фильтраией по названию
export const getFactors = async (title: string): Promise<IPaginatedFactors> => {
    const url = title 
        ? `${API_PREFIX}/factors?title=${encodeURIComponent(title)}`
        : `${API_PREFIX}/factors`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Backend is not available');
        }
    const data = await response.json();
    return {
        items: data.items || [],
        total: data.total || 0
    };
    } catch (error) {
        console.warn('Failed to fetch from backend, using mock data.', error);
        const filteredMockItems = FACTORS_MOCK.items.filter(factor =>
            factor.title.toLowerCase().includes(title.toLowerCase())
        );
        return { items: filteredMockItems, total: filteredMockItems.length };
    }
};

// Получение одного фактора по ID
export const getFactorById = async (id: string): Promise<IFactor | null> => {
    try {
        const response = await fetch(`${API_PREFIX}/factors/${id}`);
        if (!response.ok) {
            throw new Error('Backend is not available');
        }
        return await response.json();
    } catch (error) {
        console.warn(`Failed to fetch factor ${id}, using mock data.`, error);
        const factor = FACTORS_MOCK.items.find(f => f.id === parseInt(id));
        return factor || null;
    }
};

// Получение корзины
export const getCartBadge = async (): Promise<ICartBadge> => {
    try {
        const token = localStorage.getItem('authToken'); 
        if (!token) {
            throw new Error('No auth token found');
        }

        const response = await fetch(`${API_PREFIX}/frax/factorscart`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch cart data');
        }
        return await response.json();

    } catch (error) {
        console.warn('Could not fetch cart data, assuming cart is empty.', error);
        return { frax_id: null, count: 0 };
    }
};