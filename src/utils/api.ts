// src/utils/api.ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Funções para gerenciar token no localStorage
export function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
}

export function setToken(token: string, role?: string): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        // Seta cookies espelho para o middleware
        document.cookie = 'has_session=1; Path=/; SameSite=Lax';
        if (role) {
            document.cookie = `role=${role}; Path=/; SameSite=Lax`;
        }
    }
}

export function removeToken(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // Remove cookies espelho
        document.cookie = 'has_session=; Max-Age=0; Path=/; SameSite=Lax';
        document.cookie = 'role=; Max-Age=0; Path=/; SameSite=Lax';
    }
}

export async function apiPost<T = any>(path: string, body: unknown): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
        "Content-Type": "application/json"
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        // Não usar credentials com bearer tokens
    });

    // tenta ler json mesmo em erro:
    let data: any = null;
    try {
        data = await res.json();
    } catch {
        // ignore
    }

    if (!res.ok) {
        const msg = data?.error || data?.message || `Erro ${res.status}`;
        throw new Error(msg);
    }
    return data as T;
}

export async function apiGet<T = any>(path: string): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {};

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${path}`, {
        method: "GET",
        headers,
        // Não usar credentials com bearer tokens
    });

    let data: any = null;
    try {
        data = await res.json();
    } catch {
        // ignore
    }

    if (!res.ok) {
        const msg = data?.error || data?.message || `Erro ${res.status}`;
        throw new Error(msg);
    }
    return data as T;
}

export async function apiDelete<T = any>(path: string): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {};

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${path}`, {
        method: "DELETE",
        headers,
        // Não usar credentials com bearer tokens
    });

    let data: any = null;
    try {
        data = await res.json();
    } catch {
        // ignore
    }

    if (!res.ok) {
        const msg = data?.error || data?.message || `Erro ${res.status}`;
        throw new Error(msg);
    }
    return data as T;
}

export async function apiPatch<T = any>(path: string, body: unknown): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
        "Content-Type": "application/json"
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${path}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(body),
        // Não usar credentials com bearer tokens
    });

    let data: any = null;
    try {
        data = await res.json();
    } catch {
        // ignore
    }

    if (!res.ok) {
        const msg = data?.error || data?.message || `Erro ${res.status}`;
        throw new Error(msg);
    }
    return data as T;
}

export async function apiPut<T = any>(path: string, body: unknown): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
        "Content-Type": "application/json"
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${path}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
        // Não usar credentials com bearer tokens
    });

    let data: any = null;
    try {
        data = await res.json();
    } catch {
        // ignore
    }

    if (!res.ok) {
        const msg = data?.error || data?.message || `Erro ${res.status}`;
        throw new Error(msg);
    }
    return data as T;
}
