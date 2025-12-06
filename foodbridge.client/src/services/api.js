import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const instance = axios.create({
 baseURL: API_BASE_URL.replace(/\/$/, ''),
 timeout:10000,
});

instance.interceptors.request.use(
 (config) => {
 const token = localStorage.getItem('authToken');
 if (token) config.headers.Authorization = `Bearer ${token}`;
 return config;
 },
 (error) => Promise.reject(error)
);

instance.interceptors.response.use(
 (response) => response,
 (error) => {
 if (error.response?.status ===401) {
 localStorage.removeItem('authToken');
 localStorage.removeItem('user');
 if (!window.location.pathname.includes('/login')) {
 window.location.href = '/login';
 }
 }
 return Promise.reject(error);
 }
);

const ep = (path) => (path.startsWith('/') ? path : `/${path}`);
const camel = (k) => k.charAt(0).toLowerCase() + k.slice(1);
const camelize = (val) => {
 if (Array.isArray(val)) return val.map(camelize);
 if (val && typeof val === 'object') {
 return Object.keys(val).reduce((acc, key) => {
 acc[camel(key)] = camelize(val[key]);
 return acc;
 }, {});
 }
 return val;
};
const normalizeResponse = (raw) => {
 if (raw.success !== undefined) return raw;
 const base = {
 success: raw.Success,
 message: raw.Message,
 errors: raw.Errors || [],
 timestamp: raw.Timestamp,
 };
 if (raw.Data !== undefined) {
 if (raw.Data && raw.Data.Items !== undefined && raw.Data.TotalCount !== undefined) {
 const paged = {
 items: camelize(raw.Data.Items),
 totalCount: raw.Data.TotalCount,
 pageNumber: raw.Data.PageNumber,
 pageSize: raw.Data.PageSize,
 totalPages: Math.max(1, Math.ceil(raw.Data.TotalCount / raw.Data.PageSize)),
 };
 return { ...base, data: paged };
 }
 return { ...base, data: camelize(raw.Data) };
 }
 return base;
};

const cleanParams = (params = {}) => {
 return Object.fromEntries(
 Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
 );
};

const get = async (url, config = {}) => {
 if (config.params) config.params = cleanParams(config.params);
 return normalizeResponse((await instance.get(url, config)).data);
};
const post = async (url, data, config) => normalizeResponse((await instance.post(url, data, config)).data);
const put = async (url, data, config) => normalizeResponse((await instance.put(url, data, config)).data);
const del = async (url, config) => normalizeResponse((await instance.delete(url, config)).data);

export const productsAPI = {
 getAll: async (params = {}) => get(ep('products'), { params }),
 getById: async (id) => get(ep(`products/${id}`)),
 getActive: async () => get(ep('products/active')),
 create: async (data) => post(ep('products'), data),
 update: async (id, data) => put(ep(`products/${id}`), data),
 delete: async (id) => del(ep(`products/${id}`)),
};

export const donationsAPI = {
 getAll: async (params = {}) => get(ep('donations'), { params }),
 getById: async (id) => get(ep(`donations/${id}`)),
 create: async (data) => post(ep('donations'), data),
 update: async (id, data) => put(ep(`donations/${id}`), data),
 delete: async (id) => del(ep(`donations/${id}`)),
 getDonationItems: async (id) => get(ep(`donations/${id}/items`)),
 getQualityInspection: async (id) => get(ep(`donations/${id}/inspection`)),
 getReceipt: async (id) => get(ep(`donations/${id}/receipt`)),
 getAvailableItems: async () => get(ep('donations/available-items')),
};

export const inventoryAPI = {
 getAll: async (params = {}) => get(ep('inventory'), { params }),
 getById: async (id) => get(ep(`inventory/${id}`)),
 getExpiringSoon: async (days =7) => get(ep('inventory/expiring-soon'), { params: { days } }),
 create: async (data) => post(ep('inventory'), data),
 update: async (id, data) => put(ep(`inventory/${id}`), data),
 adjustQuantity: async (id, quantityChange, reason) => post(ep(`inventory/${id}/adjust-quantity`), { quantityChange, reason }),
 delete: async (id) => del(ep(`inventory/${id}`)),
};

export const donorsAPI = {
 getAll: async (params = {}) => get(ep('donors'), { params }),
 getById: async (id) => get(ep(`donors/${id}`)),
 getActive: async () => get(ep('donors/active')),
 create: async (data) => post(ep('donors'), data),
 update: async (id, data) => put(ep(`donors/${id}`), data),
 delete: async (id) => del(ep(`donors/${id}`)),
};

export const wasteAPI = {
 getAll: async (params = {}) => get(ep('waste'), { params }),
 getById: async (id) => get(ep(`waste/${id}`)),
 create: async (data) => post(ep('waste'), data),
 update: async (id, data) => put(ep(`waste/${id}`), data),
 delete: async (id) => del(ep(`waste/${id}`)),
};

export default instance;