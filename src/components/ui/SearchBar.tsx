import {useTranslation} from "react-i18next";

export const SearchBar = () => {
    const {t} = useTranslation("common");
    const text = t("actions.search") + "..."
    return (
        <input className="search-bar"
            type="text"
            placeholder={text}
        />
    );
}