import {AuthenticatedNavbar} from "../layout/AuthenticatedNavbar.tsx";
import {useTranslation} from "react-i18next";

export const SearchSection = () => {
    const {t} = useTranslation("collections");
    return (
        <div>
            <AuthenticatedNavbar
                title={t("title")}
                bookCount={0} onAddBook={function(): void {
                throw new Error("Function not implemented.");
            } } />
        </div>
    );
}