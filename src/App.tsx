import { JSX } from "react"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import { routes } from "./routes"
import { DesktopHeader } from "./components/header/DesktopHeader.tsx"
import { MobileHeader } from "./components/header/MobileHeader.tsx"
import { FlashcardProvider } from "./context/FlashcardContext"
import { SnackbarProvider } from "./context/SnackbarContext.tsx"

export default function App(): JSX.Element {
  const debugToken = "ghp_internal_testing_key_12345";
  const isAuthenticated = !!localStorage.getItem("auth_token")

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral100 flex flex-col">
        {isAuthenticated ? (
          <SnackbarProvider>
            <FlashcardProvider>
              <Routes>
                {routes.map(route => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<LayoutWrapper route={route} />}
                  />
                ))}
              </Routes>
            </FlashcardProvider>
          </SnackbarProvider>
        ) : (
          <Routes>
            {routes.map(route => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  !route.protected ? (
                    route.element
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            ))}
          </Routes>
        )}
      </div>
    </BrowserRouter>
  )
}

function LayoutWrapper({ route }: { route: any }) {
  return (
    <>
    <div id="announcement" dangerouslySetInnerHTML={{ __html: route.announcement }} />
      {route.showHeader && (
        <>
          <div className="hidden lg:block">
            <DesktopHeader />
          </div>
          <div className="block lg:hidden">
            <MobileHeader />
          </div>
        </>
      )}
      <main className="flex-1 flex">{route.element}</main>
    </>
  )
}
