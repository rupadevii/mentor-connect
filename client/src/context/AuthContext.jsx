import { createContext, useEffect, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    const getUser = async () => {
        try {
            const response = await api.get('/auth/me');
            if(response.data.success){
                setIsAuthenticated(true)
            }
        } catch (error) {
            setIsAuthenticated(false);
        } finally{
            setLoading(false)
        }
    };
    
    useEffect(() => {
        getUser()
    }, [])

    return (
        <AuthContext.Provider value={{isAuthenticated, loading}}>
            {children}
        </AuthContext.Provider>
    )
}