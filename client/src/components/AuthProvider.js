"use client";

import { login } from "@/services/api";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import AuthUserModal from "./AuthUserModal";
import { redirect } from "next/navigation";

const AuthContext = createContext();

// Global auth provider
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [err, setErr] = useState("")

    // Check user logged in on first load
    useEffect(() => {
        const stored = localStorage.getItem("demoUser");
        if (stored) {
            setUser(JSON.parse(stored));
        } else {
            setShowLoginModal(true); // Auto-open modal
        }
    }, []);

    // log user in through client and api verification
    const loginUser = async (userObj) => {
        try {
            if (
                userObj.username === process.env.NEXT_PUBLIC_DEMO_USERNAME &&
                userObj.password === process.env.NEXT_PUBLIC_DEMO_PASSWORD
            ) {
                const response = await login(userObj.username, userObj.password);

                if (response.success) {
                    localStorage.setItem("demoUser", JSON.stringify(response.user));
                    setShowLoginModal(false);
                    setUser(response.user);
                    setErr(null);
                    toast.success(response.message);
                } else {
                    setErr(response.message)
                }
            } else {
                setErr("One of the credentials isn't right")
            }
        } catch (error) {
            setErr(error.message)
        }
    };

    // log out user
    const logout = () => {
        setUser(null);
        setShowLoginModal(true);
        
        localStorage.removeItem("demoUser");
        redirect("/");
    };

    return (
        <AuthContext.Provider value={{ err, setErr, user, loginUser, logout, showLoginModal, setShowLoginModal }}>
          <AuthUserModal />
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
