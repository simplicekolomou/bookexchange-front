import { CollectionContent } from "./CollectionContent";
import { useCollectionController } from "./hooks/useCollectionController";

export const CollectionPage = () => {
    const controller = useCollectionController();

    if (controller.isLoading) return <p>Loading…</p>;
    if (controller.isError) return <p>Failed to load collection.</p>;

    return (
        <CollectionContent
            books={controller.books}
            searchQuery={controller.searchQuery}
            viewMode={controller.viewMode}
            filter={controller.filter}
            onSearchChange={controller.setSearchQuery}
            onViewModeChange={controller.setViewMode}
            onFilterChange={controller.setFilter}
        />
    );
};
