import {Navbar} from "../ui/Navbar.tsx";
import {Footer} from "../ui/Footer.tsx";
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