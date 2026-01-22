import { Study } from "./pages/Study"
import { List } from "./pages/List"
import { Login } from "./pages/Login"
import { Navigate } from "react-router-dom"

export const routes = [
  {
    path: "/",
    element: <Navigate to="/list" replace />,
    showHeader: true,
    protected: true,
  },
  {
    path: "/study/:id",
    element: <Study />,
    showHeader: true,
    protected: true,
  },
  {
    path: "/study",
    element: <Study />,
    showHeader: true,
    protected: true,
  },
  {
    path: "/list",
    element: <List />,
    showHeader: true,
    protected: true,
  },
  {
    path: "/login",
    element: <Login />,
    showHeader: false,
    protected: false,
  },
]
