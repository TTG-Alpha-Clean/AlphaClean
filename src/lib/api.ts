const API_URL = "http://localhost:3001"; // API de agendamentos
const SERVICES_API_URL = "http://localhost:3002"; // API de serviços

export const register = async (data: { nome: string; email: string; senha: string }) => {
    const response = await fetch(`${API_URL}/register`, {
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
    const response = await fetch(`${API_URL}/login`, {
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
