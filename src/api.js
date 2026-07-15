// src/api.js

async function request(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Always send cookies for JWT session
        ...options,
    };

    try {
        const response = await fetch(url, defaultOptions);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error: ${response.status}`);
        }

        // Return the JSON data if the response body isn't empty
        return response.status !== 204 ? await response.json() : null;
    } catch (error) {
        console.error("API Request Error:", error.message);
        throw error;
    }
}

export const api = {
    // ── Auth Endpoints ──────────────────────────────────────
    checkSession: () => request('/api/auth/me'),
    login: (data) => request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    register: (data) => request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    logout: () => request('/api/auth/logout', { method: 'POST' }),

    // ── Patient Endpoints ───────────────────────────────────
    registerPatient: (data) => request('/api/patients/register', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    // ── Doctor Endpoints ────────────────────────────────────
    addDoctor: (data) => request('/api/doctors/add', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    getDoctors: () => request('/api/doctors'),

    // ── Admin Endpoints ─────────────────────────────────────
    getAdminStats: () => request('/api/admin/stats'),
    getDoctorsForApproval: () => request('/api/doctors'),
    toggleDoctorApproval: (doctorId, approved) => request(`/api/doctors/${doctorId}/availability?isAvailable=${approved}`, {
        method: 'PUT',
    }),

    // ── Appointment Endpoints (Privacy-Scoped) ──────────────
    // These endpoints return only appointments belonging to the
    // authenticated user (patient or doctor). No cross-access.
    bookAppointment: (params) => {
        const queryParams = new URLSearchParams(params).toString();
        return request(`/api/appointments/book?${queryParams}`, {
            method: 'POST',
        });
    },
    getMyAppointments: () => request('/api/appointments/mine'),
    cancelAppointment: (id) => request(`/api/appointments/${id}/cancel`, {
        method: 'PUT',
    }),
    rescheduleAppointment: (id, params) => {
        const queryParams = new URLSearchParams(params).toString();
        return request(`/api/appointments/${id}/reschedule?${queryParams}`, {
            method: 'PUT',
        });
    },

    // ── Feedback Endpoints ──────────────────────────────────
    submitFeedback: (data) => request('/api/feedback', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    getMyFeedback: () => request('/api/feedback/mine'),
    deleteFeedback: (id) => request(`/api/feedback/${id}`, {
        method: 'DELETE',
    }),

    // ── Notification Endpoints ──────────────────────────────
    getNotifications: () => request('/api/notifications'),
    markNotificationRead: (id) => request(`/api/notifications/${id}/read`, {
        method: 'PUT',
    }),
};