import React from 'react'
import {Routes, Route, Navigate} from 'react-router-dom';
import {BacklogPage} from "./pages/BacklogPage";
import {BoardPage} from "./pages/BoardPage";
import {RegisterPage} from "./pages/RegisterPage";
import {AuthPage} from "./pages/AuthPage";

export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Routes>
                <Route path="/backlog" exact element={<BacklogPage/>}/>
                <Route path="/board" exact element={<BoardPage/>}/>
                {/*<Route path="/detail/:id">*/}
                {/*    <DetailPage/>*/}
                {/*</Route>*/}
                <Route path="*" element={<Navigate replace to="/board"/>}/>
            </Routes>
        )
    }
    return (
        <Routes>
            <Route path="/" exact element={<AuthPage/>}/>
            <Route path="/register" exact element={<RegisterPage/>}/>
            <Route path="*" element={<Navigate replace to="/"/>}/>
        </Routes>
    )
}