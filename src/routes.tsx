import { Home } from './pages/Home'
import {Study} from "./pages/Study";

export const routes = [
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/study',
        element: <Study />,
    },
]