import '../styles/App.css'
import { Home } from "./sections/Home.tsx"
import { Footer } from "./layout/Footer.tsx"
import { Login } from "./sections/login/Login.tsx"
import {Routes, Route, Navigate} from "react-router-dom"
import { Registration } from "./sections/register/Registration.tsx"
import { SearchSection } from "./sections/books/search/SearchSection.tsx"
import { Profile } from "./sections/profile/Profile.tsx"
import { useAppSelector } from '../app/hooks.ts'
import { AuthenticatedNavbar } from "./layout/AuthenticatedNavbar.tsx"
import { UnAuthenticatedNavbar } from "./layout/UnAuthenticatedNavbar.tsx"
import {ProtectedRoute} from "./layout/ProtectedRoute.tsx";
import {NotFound404} from "./layout/NotFound404.tsx";
import {Settings} from "./sections/profile/Settings.tsx";
import {ForgotPassword} from "./sections/login/resetPassword/ForgotPassword.tsx";
import { ResetPassword } from './sections/login/resetPassword/ResetPassword.tsx'
import {CollectionPage} from "./sections/books/collection/CollectionPage.tsx";
import {BookDetailPage} from "./sections/books/collection/BookDetailPage.tsx";
import {AddBookPage} from "./sections/books/collection/AddBookPage.tsx";
import { EditBookPage } from './sections/books/collection/EditBookPage.tsx'
import { Flex } from '@chakra-ui/react'
import {UpdatePassword} from "./sections/profile/UpdatePassword.tsx";
import {Messaging} from "./sections/message/Messaging.tsx";

function App() {
    const { isAuthenticated } = useAppSelector((state) => state.auth)
    const storedUser = localStorage.getItem("auth_user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    // useEffect(() => {
    //     webSocketService.connect("http://localhost:8000/");
    // }, []);
    return (
        <Flex className="App" direction="column" minH="100vh">
            {/* Navigation conditionnelle */}
            {!isAuthenticated ? (
                <UnAuthenticatedNavbar />
            ) : (
                <AuthenticatedNavbar title="Ma Collection" />
            )}

            {/* Routes principales */}
            <Routes>
                {/* Routes publiques */}
                <Route path="/" element={isAuthenticated && user ? <Navigate to={`/user/${user.id}/collection`} replace /> : <Home />} />
                <Route path="/login" element={isAuthenticated && user ? <Navigate to={`/user/${user.id}/collection`} replace /> : <Login />} />
                <Route path="/registration" element={isAuthenticated && user ? <Navigate to={`/user/${user.id}/collection`} replace /> : <Registration />} />
                <Route path="/forgotPassword" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />


                <Route path="/user/:userId/collection" element={<CollectionPage />} />

                <Route
                    path={"/bookCopy/:bookCopyId"}
                    element={
                        <BookDetailPage/>
                    }
                />

                {/* Routes protégées */}
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
                            <AddBookPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/edit-book/:bookCopyId"
                    element={
                    <ProtectedRoute>
                        <EditBookPage />
                    </ProtectedRoute>} />

                <Route
                    path="/user/:userId/profile"
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

                <Route
                    path="/update-password"
                    element={
                        <ProtectedRoute>
                            <UpdatePassword />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dms"
                    element={
                        <ProtectedRoute>
                            <Messaging />
                        </ProtectedRoute>
                    }
                />

                {/* Route 404 - Redirection vers la home */}
                <Route path="*" element={<NotFound404 />} />
            </Routes>
            <Footer />
        </Flex>
    );
}

export default App