import { CollectionContent } from "../components/CollectionContent.tsx";
import { useCollectionController } from "../hooks/useCollectionController.tsx";

export const CollectionPage = () => {
    const controller = useCollectionController();

    if (controller.isLoading) return <p>Loading…</p>;
    if (controller.isError) return <p>Failed to load collection.</p>;

    return (
        <CollectionContent
            filteredBooks={controller.filteredBooks}
            searchQuery={controller.searchQuery}
            viewMode={controller.viewMode}
            filter={controller.filter}
            onSearchChange={controller.setSearchQuery}
            onViewModeChange={controller.setViewMode}
            onFilterChange={controller.setFilter}
            gridColumns={controller.gridColumns}
        />
    );
};
