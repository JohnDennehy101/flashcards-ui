import { Home } from './pages/Home'
import {Study} from "./pages/Study";
import {List} from "./pages/List";
import {Login} from "./pages/Login";

export const routes = [
    {
        path: '/',
        element: <Home />,
        showHeader: true,
        protected: false
    },
    {
        path: '/study/:id',
        element: <Study />,
        showHeader: true,
        protected: true
    },
    {
        path: '/study',
        element: <Study /> ,
        showHeader: true,
        protected: true
    },
    {
        path: '/list',
        element: <List />,
        showHeader: true,
        protected: true
    },
    {
        path: '/login',
        element: <Login />,
        showHeader: false,
        protected: false
    }
]