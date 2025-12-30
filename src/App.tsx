import { JSX } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { routes } from "./routes"
import {DesktopHeader} from "./components/header/DesktopHeader.tsx";
import {MobileHeader} from "./components/header/MobileHeader.tsx";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
          <div className="hidden md:block">
          <DesktopHeader />
          </div>
          <div className="block md:hidden">
              <MobileHeader />
          </div>
        <main className="w-full h-screen py-6 px-4 flex items-center justify-center">
          <Routes>
            {routes.map(route => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
