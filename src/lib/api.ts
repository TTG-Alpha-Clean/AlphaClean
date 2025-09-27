const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const SERVICES_API_URL = process.env.NEXT_PUBLIC_SERVICES_API_URL || "http://localhost:3002";

export const register = async (data: { nome: string; email: string; senha: string }) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao registrar");
    }

    return await response.json();
};

export const login = async (data: { email: string; senha: string }) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao logar");
    }

    return await response.json(); // token + user
};
