import {createBrowserRouter} from "react-router-dom";
import {Home} from "../components/sections/Home.tsx";
import {Registration} from "../components/sections/register/Registration.tsx";
import {ForgotPassword} from "../features/forgotPassword/components/ForgotPassword.tsx";
import {ResetPassword} from "../features/resetPassword/components/ResetPassword.tsx";
import {BookDetailPage} from "../components/sections/books/collection/BookDetailPage.tsx";
import {ProtectedRoute} from "../routes/ProtectedRoute.tsx";
import {SearchSection} from "../components/sections/books/search/SearchSection.tsx";
import {AddBookPage} from "../components/sections/books/collection/AddBookPage.tsx";
import {EditBookPage} from "../components/sections/books/collection/EditBookPage.tsx";
import {Profile} from "../components/sections/profile/Profile.tsx";
import {Settings} from "../components/sections/profile/Settings.tsx";
import {UpdatePassword} from "../components/sections/profile/UpdatePassword.tsx";
import {Messaging} from "../components/sections/message/Messaging.tsx";
import {SendMessageBox} from "../components/sections/message/SendMessageBox.tsx";
import {CollectionPage} from "../components/sections/books/collection/CollectionPage.tsx";
import {NotFound404} from "../components/layout/NotFound404.tsx";
import MainLayout from "../components/layout/MainLayout.tsx";
import LoginForm from "../features/auth/components/LoginForm.tsx";

export const router = createBrowserRouter(
    [
        {
            element: <MainLayout />,
            children: [
                {
                    path: "/",
                    element: <Home />
                },
                {
                    path: "/login",
                    element: <LoginForm/>
                },
                {
                    path: "/registration",
                    element: <Registration/>
                },
                {
                    path: "/forgotPassword",
                    element: <ForgotPassword/>
                },
                {
                    path: "/reset-password",
                    element: <ResetPassword/>
                },
                {
                    element: <ProtectedRoute />,
                    children: [
                        {
                            path: "/search",
                            element: <SearchSection/>
                        },
                        {
                            path: "/add-book",
                            element: <AddBookPage/>
                        },
                        {
                            path: "/edit-book/:bookCopyId",
                            element: <EditBookPage/>
                        },
                        {
                            path: "/user/:userId/profile",
                            element: <Profile/>
                        },
                        {
                            path: "/settings",
                            element: <Settings/>
                        },
                        {
                            path: "/update-password",
                            element: <UpdatePassword/>
                        },
                        {
                            path: "/dms",
                            element: <Messaging/>
                        },
                        {
                            path: "/send-message",
                            element: <SendMessageBox />
                        },
                        {
                            path: "/user/:userId/collection",
                            element: <CollectionPage/>
                        },
                        {
                            path: "/bookCopy/:bookCopyId",
                            element: <BookDetailPage/>
                        }
                    ],
                },
                {
                    path: "*",
                    element: <NotFound404 />
                }
            ],
        }
    ]
)