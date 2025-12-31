import { JSX } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { routes } from "./routes"
import {DesktopHeader} from "./components/header/DesktopHeader.tsx";
import {MobileHeader} from "./components/header/MobileHeader.tsx";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral100 flex flex-col">
          <div className="hidden lg:block">
          <DesktopHeader />
          </div>
          <div className="block lg:hidden">
              <MobileHeader />
          </div>
        <main className="flex-1 flex">
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
