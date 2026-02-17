/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthToken = () => {
    const tokenMatch = document.cookie.split('; ').find(row => row.startsWith('token='));
    return tokenMatch ? tokenMatch.split('=')[1] : null;
};

export const api = {
    auth: {
        register: async (data: any) => {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        login: async (data: any) => {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        logout: async () => {
            const token = getAuthToken();
            const res = await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return res.json();
        },
        checkUsername: async (username: string) => {
            const res = await fetch(`${API_URL}/auth/check-username?username=${username}`);
            return res.json();
        }
    },
    movies: {
        list: async (page: number = 1) => {
            const token = getAuthToken();
            const res = await fetch(`${API_URL}/movies?page=${page}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return res.json();
        }
    },
    series: {
        list: async (page: number = 1) => {
            const token = getAuthToken();
            const res = await fetch(`${API_URL}/tvshows?page=${page}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return res.json();
        }
    },
    content: {
        getDetails: async (id: string) => {
            const token = getAuthToken();
            const res = await fetch(`${API_URL}/content?id=${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return res.json();
        }
    },
    search: async (q: string, page: number = 1) => {
        const res = await fetch(`${API_URL}/search?q=${q}&page=${page}&limit=60`);
        return res.json();
    },
    genres: {
        list: async (genre: string, page: number = 1) => {
            const token = getAuthToken();
            const res = await fetch(`${API_URL}/genres/${genre}?page=${page}&limit=25`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return res.json();
        }
    },
    stream: {
        getDetails: async (uuid: string) => {
            const token = getAuthToken();
            const res = await fetch(`${API_URL}/stream/${uuid}/details`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return res.json();
        },
        getPlaylistUrl: (uuid: string) => {
            return `${API_URL}/stream/${uuid}`;
        }
    },
    watchlist: {
        list: async () => {
            const token = getAuthToken();
            const res = await fetch(`${API_URL}/watchlist`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return res.json();
        },
        toggle: async (contentId: string) => {
            const token = getAuthToken();
            const res = await fetch(`${API_URL}/watchlist/toggle`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content_id: contentId })
            });
            return res.json();
        },
        check: async (contentId: string) => {
            const token = getAuthToken();
            const res = await fetch(`${API_URL}/watchlist/check?content_id=${contentId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return res.json();
        }
    }
};
