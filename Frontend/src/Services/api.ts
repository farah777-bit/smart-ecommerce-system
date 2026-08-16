const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5053/api";

type RequestOptions = RequestInit & {
    auth?: boolean;
};

async function request<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const token = localStorage.getItem("token");

    const headers = new Headers(options.headers);

    if (!(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    if (options.auth && token) {
        headers.set("Authorization", `Bearer ${ token }`);
    }

    const response = await fetch(`${ API_URL }${ endpoint }`, {
        ...options,
        headers,
    });

    if (response.status === 204) {
        return undefined as T;
    }

    let data: any = null;

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    if (!response.ok) {
        const message =
            data?.message ||
            data?.title ||
            "Something went wrong.";

        throw new Error(message);
    }

    return data as T;
}

// ==============================
// GET
// ==============================

export function apiGet<T>(
    endpoint: string,
    auth = false
): Promise<T> {
    return request<T>(endpoint, {
        method: "GET",
        auth,
    });
}

// ==============================
// POST
// ==============================

export function apiPost<T>(
    endpoint: string,
    body?: unknown,
    auth = false
): Promise<T> {
    return request<T>(endpoint, {
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
        auth,
    });
}

// ==============================
// PUT
// ==============================

export function apiPut<T>(
    endpoint: string,
    body?: unknown,
    auth = false
): Promise<T> {
    return request<T>(endpoint, {
        method: "PUT",
        body: body ? JSON.stringify(body) : undefined,
        auth,
    });
}

// ==============================
// DELETE
// ==============================

export function apiDelete<T>(
    endpoint: string,
    auth = false
): Promise<T> {
    return request<T>(endpoint, {
        method: "DELETE",
        auth,
    });
}

export default API_URL;