import { Box, Container } from '@chakra-ui/react';
import type {isbns, VolumeShort} from "../../../../types/book.types.ts";
import {useForm} from "react-hook-form";
import {SearchBar} from "./SearchBar.tsx";

export const SearchSection = () => {
    /**
     * Permet de récupérer le meilleur ISBN
     * @param ids
     */
    function pickBestIsbn(ids?: isbns[]) {
        if (!ids?.length) return "";

        const isbn13 = ids.find(i => i.type === "ISBN_13");
        const isbn10 = ids.find(i => i.type === "ISBN_10");
        if (isbn13) {
            return isbn13.identifier;
        } else if (isbn10) {
            return isbn10.identifier;
        } else {
            return ids[0].identifier;
        }
    }

    const { setValue } = useForm({ defaultValues: {
        title: '',
        authors: [{ name: '' }],
        isbns: '',
        }});

    return (
        <Box minH="100vh">
            <Container maxW="4xl" py={8}>
                <SearchBar
                    limit={10}
                    onSelect={(b: VolumeShort) => {
                        setValue("title", b.title);

                        setValue("authors", (b.authors ?? [""]).map(a => ({ name: a })));
                        setValue("isbns", pickBestIsbn(b.isbns));
                        console.log(b.authors)
                        console.log(typeof b.authors?.at(0))
                    }}

                />
            </Container>
        </Box>
    );
}