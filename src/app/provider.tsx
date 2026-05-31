import { RouterProvider } from "react-router-dom";
import {router} from "./router.tsx";

export function AppProvider() {
    return <RouterProvider router={router} />;
}