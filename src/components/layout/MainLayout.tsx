import {Navbar} from "./Navbar.tsx";
import {Footer} from "./Footer.tsx";
import {Outlet} from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="main-layout">
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}