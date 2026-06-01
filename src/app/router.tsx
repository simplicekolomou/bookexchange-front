import {createBrowserRouter} from "react-router-dom";
import {Home} from "../features/home/Home.tsx";
import {ForgotPassword} from "../features/forgotPassword/components/ForgotPassword.tsx";
import {ResetPassword} from "../features/resetPassword/components/ResetPassword.tsx";
import {BookDetailPage} from "../features/book/collection/components/BookDetailPage.tsx";
import {ProtectedRoute} from "../routes/ProtectedRoute.tsx";
import {SearchPage} from "../features/book/search/pages/SearchPage.tsx";
import {AddBookPage} from "../features/book/addbook/pages/AddBookPage.tsx";
import {EditBookPage} from "../features/book/editbook/pages/EditBookPage.tsx";
import {Profile} from "../features/profile/components/Profile.tsx";
import {Settings} from "../features/profile/components/Settings.tsx";
import {UpdatePassword} from "../features/updatePassword/components/UpdatePassword.tsx";
import {Messaging} from "../features/message/sendMessage/pages/Messaging.tsx";
import {SendMessageBox} from "../features/message/sendMessage/components/SendMessageBox.tsx";
import {CollectionPage} from "../features/book/collection/pages/CollectionPage.tsx";
import {NotFound404} from "../components/ui/NotFound404.tsx";
import MainLayout from "../components/layout/MainLayout.tsx";
import Login from "../features/auth/pages/Login.tsx";
import Register from "../features/register/pages/Register.tsx";

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
                    element: <Login/>
                },
                {
                    path: "/register",
                    element: <Register />
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
                            path: "/collection",
                            element: <CollectionPage />
                        },
                        {
                            path: "/search",
                            element: <SearchPage/>
                        },
                        {
                            path: "/add-book",
                            element: <AddBookPage />
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