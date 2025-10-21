import type { IPaginatedFactors, IFactor } from '../types';
import { FACTORS_MOCK } from './mock';

const API_PREFIX = '/api';

// Получение списка факторов с фильтрацией
export const getFactors = async (title: string): Promise<IPaginatedFactors> => {
    try {
        const response = await fetch(`${API_PREFIX}/factors?title=${title}`);
        if (!response.ok) {
            throw new Error('Backend is not available');
        }
        return await response.json();
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