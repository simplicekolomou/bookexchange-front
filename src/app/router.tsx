import {createBrowserRouter} from "react-router-dom";
import {Home} from "../features/home/Home.tsx";
import {BookDetailPage} from "../features/book/details/pages/BookDetailPage.tsx";
import {ProtectedRoute} from "../routes/ProtectedRoute.tsx";
import {SearchPage} from "../features/book/search/pages/SearchPage.tsx";
import {AddBookPage} from "../features/book/addbook/addpages/AddBookPage.tsx";
import {EditBookPage} from "../features/book/addbook/editpages/EditBookPage.tsx";
import {Profile} from "../features/auth/profile/pages/Profile.tsx";
import {Messaging} from "../features/message/sendMessage/pages/Messaging.tsx";
import {CreateDirectChat} from "../features/message/sendMessage/components/CreateDirectChat.tsx";
import {CollectionPage} from "../features/book/collection/pages/CollectionPage.tsx";
import {NotFound404} from "../components/ui/NotFound404.tsx";
import MainLayout from "../components/layout/MainLayout.tsx";
import Login from "../features/auth/login/pages/Login.tsx";
import Register from "../features/auth/register/pages/Register.tsx";
import ResetPassword from "../features/auth/resetPassword/pages/ResetPassword.tsx";
import ForgotPassword from "../features/auth/forgotPassword/pages/ForgotPassword.tsx";
import {UpdatePassword} from "../features/auth/updatePassword/pages/UpdatePassword.tsx";
import Settings from "../features/auth/settings/pages/Settings.tsx";

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
                    element: <ForgotPassword />
                },
                {
                    path: "/reset-password",
                    element: <ResetPassword />
                },
                {
                    element: <ProtectedRoute />,
                    children: [
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
                            element: <Settings />
                        },
                        {
                            path: "/update-password",
                            element: <UpdatePassword />
                        },
                        {
                            path: "/dms",
                            element: <Messaging />
                        },
                        {
                            path: "/send-message",
                            element: <CreateDirectChat />
                        },
                        {
                            path: "/user/:userId/collection",
                            element: <CollectionPage/>
                        },
                        {
                            path: "/:bookCopyId/details",
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