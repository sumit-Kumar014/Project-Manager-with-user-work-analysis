import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "types";
import React from "react";
import { queryClient } from "./react-query-provider";
import { useLocation, useNavigate } from "react-router";
import { publicRoutes } from "@/lib";
import { toast } from "sonner";

interface AuthenContextType {
    user: User | null,
    isAuthenticated: boolean,
    isLoading: boolean,
    login: (data : any) => Promise<void>
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthenContextType | undefined>(undefined)

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const navigate = useNavigate()
    const currentPath = useLocation().pathname
    const isPublicRoute = publicRoutes.includes(currentPath)

    //! check if user is authenticated
    useEffect(() => {
        const checkAuth = async() => {
            setIsLoading(true)

            const userInfo = localStorage.getItem("user")
            if(userInfo) {
                setUser(JSON.parse(userInfo))
                setIsAuthenticated(true)
            } else {
                setIsAuthenticated(false)
                if(!isPublicRoute) {
                    navigate("/", {replace: true})
                }
            }
            setIsLoading(false)
        }

        checkAuth()
    }, [isAuthenticated, currentPath])

    useEffect(() => {
        const handleLogout = () => {
            logout()
        }

        window.addEventListener("force-logout", handleLogout)
        return () => window.removeEventListener("force-logout", handleLogout)
    }, [])

    const login = async (data : any) => {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))

        setUser(data.user)
        setIsAuthenticated(true)
    }
    
    const logout = async () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        
        setUser(null)
        setIsAuthenticated(false)
        queryClient.clear()
        navigate("/", { replace: true });
        toast.success("Logout successfully")
    }

    const values = {user, isAuthenticated, isLoading, login, logout}

    return <AuthContext.Provider value={values}> {children} </AuthContext.Provider>
}


export const useAuth = () => {
    const context = useContext(AuthContext)
    if(!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}