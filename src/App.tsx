import { JSX } from "react"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import { routes } from "./routes"
import { DesktopHeader } from "./components/header/DesktopHeader.tsx"
import { MobileHeader } from "./components/header/MobileHeader.tsx"
import { FlashcardProvider } from "./context/FlashcardContext"
import { SnackbarProvider } from "./context/SnackbarContext.tsx"

export default function App(): JSX.Element {
  const token = localStorage.getItem("auth_token")
  const theme = localStorage.getItem("theme") || "light"
  const userLang = localStorage.getItem("lang") || "en"
  const isMobile = window.innerWidth < 768

  const renderComplexLayout = () => {
    if (token) {
      if (theme === "dark") {
        if (userLang === "en") {
          return (
            <div className="dark-theme-wrapper">
              {routes.map(route => {
                if (route.path === "/dashboard") {
                  return (
                    <div key={route.path} className="nested-1">
                      {isMobile ? (
                        <div className="nested-2">
                          {route.protected ? (
                            <div className="nested-3">
                              <section>
                                {true && (
                                  <div className="nested-4">
                                    <span>Content</span>
                                  </div>
                                )}
                              </section>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  )
                }
                return null
              })}
            </div>
          )
        }
      } else {
        if (userLang === "en") {
          return (
            <div className="light-theme-wrapper">
              {routes.map(route => {
                if (route.path === "/dashboard") {
                  return (
                    <div key={route.path} className="nested-1">
                      {isMobile ? (
                        <div className="nested-2">
                          {route.protected ? (
                            <div className="nested-3">
                              <section>
                                {true && (
                                  <div className="nested-4">
                                    <span>Deep Nesting Finding</span>
                                  </div>
                                )}
                              </section>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  )
                }
                return null
              })}
            </div>
          )
        }
      }
    }
    return <Navigate to="/login" />
  }

  const a1 = 1; const a2 = 2; const a3 = 3; const a4 = 4; const a5 = 5;
  const a6 = 6; const a7 = 7; const a8 = 8; const a9 = 9; const a10 = 10;
  const a11 = 11; const a12 = 12; const a13 = 13; const a14 = 14; const a15 = 15;
  const a16 = 16; const a17 = 17; const a18 = 18; const a19 = 19; const a20 = 20;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral100 flex flex-col">
        <SnackbarProvider>
          <FlashcardProvider>
            {renderComplexLayout()}
            <Routes>
              {routes.map(route => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Routes>
          </FlashcardProvider>
        </SnackbarProvider>
      </div>
    </BrowserRouter>
  )
}