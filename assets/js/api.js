// api.js - Centralized API Service

    // Backend API for Certificates & Auth
    BACKEND_URL: '/api',
    
    // GitHub Raw URL for Projects Data (Public)
    PROJECTS_DATA_URL: 'https://raw.githubusercontent.com/landing-ai/ade-fintech/master/data/projects_data.json'
};

const ApiService = {
    /**
     * Fetch all projects from GitHub
     */
    async getProjects() {
        try {
            const response = await fetch(API_CONFIG.PROJECTS_DATA_URL);
            if (!response.ok) throw new Error('Failed to fetch projects data');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            // Fallback to local file if GitHub fetch fails (e.g. rate limit or offline dev)
            console.warn('Falling back to local projects data...');
            const fallback = await fetch('data/projects_data.json');
            return await fallback.json();
        }
    },

    /**
     * Verify a certificate by ID (Public)
     */
    async verifyCertificate(id) {
        const response = await fetch(`${API_CONFIG.BACKEND_URL}/certificates/${id}`);
        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error('Certificate service unavailable');
        }
        return await response.json();
    },

    /**
     * Admin: Login
     */
    async login(email, password) {
        const response = await fetch(`${API_CONFIG.BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Login failed');
        }
        
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        return data;
    },

    /**
     * Admin: Logout
     */
    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('adminUser');
        window.location.href = 'index.html'; // Redirect to home or login
    },

    /**
     * Admin: Create Certificate
     */
    async createCertificate(data) {
        return this._authFetch(`${API_CONFIG.BACKEND_URL}/certificates`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    /**
     * Admin: Get All Certificates
     */
    async getAllCertificates(page = 1, limit = 20, search = '') {
        const query = new URLSearchParams({ page, limit, q: search });
        return this._authFetch(`${API_CONFIG.BACKEND_URL}/certificates?${query}`);
    },

    /**
     * Helper for authenticated requests
     */
    async _authFetch(url, options = {}) {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Unauthorized');

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };

        const response = await fetch(url, { ...options, headers });
        
        if (response.status === 401 || response.status === 403) {
            this.logout();
            throw new Error('Session expired');
        }

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Request failed');
        }

        return await response.json();
    }
};

// Export to global scope
window.ApiService = ApiService;
