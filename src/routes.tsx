import { Home } from './pages/Home'
import {Study} from "./pages/Study";
import {List} from "./pages/List";

export const routes = [
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/study/:id',
        element: <Study />,
    },
    {
        path: '/study',
        element: <Study /> },
    {
        path: '/list',
        element: <List />,
    },
]