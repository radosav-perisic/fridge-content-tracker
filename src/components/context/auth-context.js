import React, { useState } from "react";

export const AuthContext = React.createContext({
    isAuth: false,
    login: () => {}
})

const AuthContextProvider = props => {
    const [isAuthenthicated, setIsAuthenthicated]= useState(false)

    const loginHandler = () => {
        setIsAuthenthicated(true)
    }
    return (
        <AuthContext.Provider value={{isAuth:isAuthenthicated, login:loginHandler}}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;