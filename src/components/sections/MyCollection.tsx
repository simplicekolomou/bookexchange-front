import {Navbar} from "../layout/Navbar.tsx";

export const MyCollection = () => {
    return (
        <>
            <Navbar title={"BookSwap"} isAuthenticated={true} />
            <div>MyCollection Component</div>
        </>
    );
}