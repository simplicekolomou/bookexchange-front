import '../styles/App.css'
import { Home } from "./sections/Home.tsx"
import { Footer } from "./layout/Footer.tsx"
import { Login } from "./sections/login/Login.tsx"
import { Collection } from "./sections/books/collection/Collection.tsx"
import { Routes, Route } from "react-router-dom"
import { Registration } from "./sections/register/Registration.tsx"
import { SearchSection } from "./sections/books/search/SearchSection.tsx"
import { AddBook } from "./sections/books/add/AddBook.tsx"
import { Profile } from "./sections/profile/Profile.tsx"
import { useAppSelector } from '../app/hooks.ts'
import { AuthenticatedNavbar } from "./layout/AuthenticatedNavbar.tsx"
import { UnAuthenticatedNavbar } from "./layout/UnAuthenticatedNavbar.tsx"
import {ProtectedRoute} from "./layout/ProtectedRoute.tsx";
import {NotFound404} from "./layout/NotFound404.tsx";
import {Settings} from "./sections/profile/Settings.tsx";
import {Flex} from "@chakra-ui/react";
import {CollectionPage} from "./sections/collection/CollectionPage.tsx";
import {BookDetailPage} from "./sections/collection/BookDetailPage.tsx";
import {ForgotPassword} from "./sections/login/resetPassword/ForgotPassword.tsx";
import {ResetPassword} from "./sections/login/resetPassword/ResetPassword.tsx";
import {UpdatePassword} from "./sections/profile/UpdatePassword.tsx";

function App() {
    const { isAuthenticated } = useAppSelector((state) => state.auth)

    return (
        <Flex className="App" direction="column" minH="100vh">
            {/* Navigation conditionnelle */}
            {!isAuthenticated ? (
                <UnAuthenticatedNavbar />
            ) : (
                <AuthenticatedNavbar bookCount={0} title="Ma CollectionPage" />
            )}

            {/* Routes principales */}
            <Routes>
                {/* Routes publiques */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/forgotPassword" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />


                <Route path="/user/:userId/collection" element={<CollectionPage />} />

                <Route
                    path={"/user/:userId/bookCopy/:bookCopyId"}
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

                <Route
                    path="/update-password"
                    element={
                        <ProtectedRoute>
                            <UpdatePassword />
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