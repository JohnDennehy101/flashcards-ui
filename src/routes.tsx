import { Home } from './pages/Home'
import {Study} from "./pages/Study";
import {List} from "./pages/List";
import {Login} from "./pages/Login";

export const routes = [
    {
        path: '/',
        element: <Home />,
        showHeader: true
    },
    {
        path: '/study/:id',
        element: <Study />,
        showHeader: true
    },
    {
        path: '/study',
        element: <Study /> ,
        showHeader: true
    },
    {
        path: '/list',
        element: <List />,
        showHeader: true
    },
    {
        path: '/login',
        element: <Login />,
        showHeader: false
    }
]