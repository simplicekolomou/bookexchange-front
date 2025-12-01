import '../styles/App.css'
import { Home } from "./sections/Home.tsx"
import { Footer } from "./layout/Footer.tsx"
import { Login } from "./sections/Login.tsx"
import { Collection } from "./sections/Collection.tsx"
import { Routes, Route } from "react-router-dom"
import { Registration } from "./sections/Registration.tsx"
import { SearchSection } from "./sections/SearchSection.tsx"
import { AddBook } from "./sections/AddBook.tsx"
import { Profile } from "./sections/profile/Profile.tsx"
import { useAppSelector } from '../app/hooks.ts'
import { AuthenticatedNavbar } from "./layout/AuthenticatedNavbar.tsx"
import { UnAuthenticatedNavbar } from "./layout/UnAuthenticatedNavbar.tsx"
import {ProtectedRoute} from "./layout/ProtectedRoute.tsx";
import {NotFound404} from "./layout/NotFound404.tsx";
import {Settings} from "./sections/profile/Settings.tsx";

function App() {
    const { isAuthenticated } = useAppSelector((state) => state.auth)

    return (
        <div className="App">
            {/* Navigation conditionnelle */}
            {!isAuthenticated ? (
                <UnAuthenticatedNavbar />
            ) : (
                <AuthenticatedNavbar bookCount={0} title="Ma Collection" />
            )}

            {/* Routes principales */}
            <Routes>
                {/* Routes publiques */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registration" element={<Registration />} />

                {/* Routes protégées */}
                <Route
                    path="/collection"
                    element={
                        <ProtectedRoute>
                            <Collection />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/search"
                    element={
                        <ProtectedRoute>
                            <SearchSection />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/add-book"
                    element={
                        <ProtectedRoute>
                            <AddBook />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    }
                />

                {/* Route 404 - Redirection vers la home */}
                <Route path="*" element={<NotFound404 />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App