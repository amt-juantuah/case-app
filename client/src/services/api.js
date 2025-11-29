/**
 * API Service Setup
 * Setup Axios client for API requests
 */

import axios from "axios";
import toast from "react-hot-toast";
import { messages } from "../constants";


// Toast request wrapper
async function request(promise, successMessage) {
    try {
        const response = await promise;
        if (successMessage) toast.success(successMessage);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || messages.smthing_went_wrong;
        toast.error(errorMessage);
        throw error;
    }
}

// Axios initialization with base URL and headers
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        'x-api-key': process.env.NEXT_PUBLIC_API_KEY
    },
});

// authorized login
export async function login(username, password) {
    const response = await api.post("auth/login", { username, password });
    return response.data
}

// Get all Cases 
export async function getAllCases() {
    const response = await api.get("/cases");
    return response.data;
}


// Get Case by ID
export async function getCaseById(id) {
    const response = await api.get(`/cases/${id}`);
    return response.data;
}

// Create a new Case
export async function createCase(caseData) {
    const response = await api.post("/cases", caseData);
    return response.data;
}

// Update a Case status by ID
export async function updateCaseStatus(id, status) {
    const response = await api.patch(`/cases/${id}/status`, { status });
    return response.data;
}

// Update a Case priority by ID
export async function updateCasePriority(id, priority) {
    const response = await api.patch(`/cases/${id}/priority`, { priority });
    return response.data;
}

// Delete a Case by ID
export async function deleteCase(id) {
    const response = await api.delete(`/cases/${id}`);
    return response.data;
}

// Generic update case function
export async function updateCase(id, caseData) {
    const response = await api.patch(`/cases/${id}`, caseData);
    return response.data;
}

export default api;