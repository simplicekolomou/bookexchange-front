import { Box, Flex, Button, useBreakpointValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, BookOpen, Send, LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LogoWithText } from "./LogoWithText.tsx";
import { UserMenu } from "./UserMenu.tsx";
import { useGetMyBooksQuery } from "../../features/book/api/bookApi.ts";
import { useSelector } from "react-redux";
import {
    selectCurrentUser,
    selectIsAuthenticated,
} from "../../features/auth/authSlice.ts";
// NOUVEL IMPORT : on a besoin de useGetMeQuery ici, directement dans la
// Navbar, pour avoir accès à "isLoading" et "isSuccess" — deux infos
// que Redux seul ne peut pas nous donner de façon synchrone (sans délai).
import { useGetMeQuery } from "../../features/auth/api/authApi.ts";

export const Navbar = () => {
    const navigate = useNavigate();
    const { t } = useTranslation(["common", "collections"]);
    const pathname = window.location.pathname;

    // On appelle useGetMeQuery() ICI AUSSI, en plus de ProtectedRoute et
    // PublicOnlyRoute qui l'appellent déjà.
    //
    // EXPLICATION IMPORTANTE : ce n'est PAS un problème de performance.
    // RTK Query fonctionne avec un CACHE PARTAGÉ basé sur la combinaison
    // (endpoint + arguments). Puisque useGetMeQuery() est appelée ICI
    // avec exactement les MÊMES arguments (aucun argument, "void") que
    // dans ProtectedRoute/PublicOnlyRoute, les TROIS composants
    // s'abonnent au MÊME résultat en cache. Un SEUL vrai appel réseau
    // est fait, peu importe le nombre de composants qui utilisent ce hook.
    //
    // "isLoading" : true UNIQUEMENT lors du tout premier chargement
    // (pas de données en cache du tout encore)
    // "isSuccess" : true dès que la requête a réussi, DANS LE MÊME
    // rendu que isLoading passe à false — donc SANS le délai d'un
    // useEffect, contrairement à la valeur Redux "isAuthenticated"
    const { isLoading, isSuccess } = useGetMeQuery();

    // User et isAuthenticated depuis authSlice (Redux) — on garde ces
    // lectures, elles restent utiles une fois que tout est stabilisé
    // (par exemple après un login classique en cours de session, où
    // Redux est mis à jour directement sans repasser par cette vérification)
    const user = useSelector(selectCurrentUser);
    const isAuthenticatedFromStore = useSelector(selectIsAuthenticated);

    // LA CORRECTION CLÉ : on combine les deux sources avec un OU (||).
    // Dès que L'UNE des deux dit "true", on considère l'utilisateur
    // comme connecté. Ça élimine la fenêtre de tir où Redux dirait
    // encore "false" alors que la requête getMe a DÉJÀ réussi.
    const isAuthenticated = isAuthenticatedFromStore || isSuccess;

    // Petite nuance pour "books" : useGetMyBooksQuery utilisait "skip:
    // !isAuthenticated" avec l'ANCIENNE valeur (Redux seul). On utilise
    // maintenant notre nouvelle valeur combinée, pour que cette requête
    // se déclenche AUSSITÔT que possible (dès que isSuccess est vrai),
    // sans attendre elle non plus le délai du useEffect Redux.
    const { data: books = [] } = useGetMyBooksQuery(undefined, {
        skip: !isAuthenticated,
    });

    const showText = useBreakpointValue({ base: false, md: true }) ?? false;

    const navButtons = [
        {
            key: "search",
            path: "/search",
            icon: <Search size={16} />,
            label: t("common:actions.search"),
            hide: pathname.startsWith("/search"),
        },
        {
            key: "add",
            path: "/add-book",
            icon: <Plus size={16} />,
            label: t("common:actions.add"),
            hide: pathname.startsWith("/add-book"),
        },
        {
            key: "collection",
            path: `/user/${user?.id}/collection`,
            icon: <BookOpen size={16} />,
            label: t("common:actions.collection"),
            hide: pathname.startsWith(`/user/${user?.id}/collection`),
        },
        {
            key: "dms",
            path: `/user/${user?.id}/dms`,
            icon: <Send size={16} />,
            label: t("common:actions.dms"),
            hide: pathname.startsWith("/dms"),
            bg: "colorPalette.default",
            hoverBg: "colorPalette.emphasized",
        },
    ];

    // NOUVELLE SECTION : tant que la vérification d'authentification est
    // en cours (isLoading = true, donc AUCUNE donnée en cache encore,
    // ni via cette requête, ni via une précédente), on affiche une
    // version "neutre" de la Navbar : juste le logo, SANS les boutons
    // de navigation ni le bouton "Connexion".
    //
    // POURQUOI c'est important : si on n'avait pas cette étape, le code
    // plus bas devrait choisir ENTRE "afficher les boutons connectés" et
    // "afficher le bouton Connexion" — et à ce stade précis (chargement
    // en cours), on ne sait tout simplement PAS ENCORE laquelle des deux
    // réponses est la bonne. Choisir l'une ou l'autre risquerait de se
    // tromper temporairement, ce qui EST le flash qu'on corrige ici.
    if (isLoading) {
        return (
            <Box
                as="nav"
                borderBottomWidth="1px"
                borderBottomColor="border.default"
                bg="bg.surface"
                color="fg.default"
                position="sticky"
                top={0}
                zIndex={10}
                py={2}
                borderRadius="md"
            >
                <Flex
                    maxW="1200px"
                    mx="auto"
                    px={4}
                    direction="row"
                    align="center"
                    justify="space-between"
                    gap={2}
                    wrap="nowrap"
                >
                    {/* On garde le logo visible (il ne dépend pas de
                        l'authentification), mais SANS le nombre de livres
                        (nbBooks={undefined}), puisqu'on ne sait pas encore
                        si l'utilisateur est connecté pour les afficher */}
                    <LogoWithText
                        title={t("common:brand.title")}
                        direction="row"
                        nbBooks={undefined}
                    />
                    {/* Rien à droite pendant le chargement : ni boutons
                        de navigation, ni bouton "Connexion". Ça évite
                        totalement le flash, au prix d'un très bref
                        instant où la Navbar semble "vide" à droite —
                        ce qui est BEAUCOUP moins gênant visuellement
                        qu'un bouton qui apparaît puis disparaît. */}
                </Flex>
            </Box>
        );
    }

    // À partir d'ici, isLoading est FORCÉMENT false : on CONNAÎT la
    // réponse avec certitude (isAuthenticated est fiable, plus de risque
    // de flash). Le reste du code est identique à ta version originale.
    return (
        <Box
            as="nav"
            borderBottomWidth="1px"
            borderBottomColor="border.default"
            bg="bg.surface"
            color="fg.default"
            position="sticky"
            top={0}
            zIndex={10}
            py={2}
            borderRadius="md"
        >
            <Flex
                maxW="1200px"
                mx="auto"
                px={4}
                direction="row"
                align="center"
                justify="space-between"
                gap={2}
                wrap="nowrap"
            >
                <LogoWithText
                    title={t("common:brand.title")}
                    direction="row"
                    nbBooks={isAuthenticated ? books.length : undefined}
                />

                <Flex gap={2} align="center" wrap="nowrap">
                    {isAuthenticated ? (
                        <>
                            {navButtons
                                .filter((btn) => !btn.hide)
                                .map(({ key, path, icon, label, bg, hoverBg }) => (
                                    <Button
                                        key={key}
                                        onClick={() => navigate(path)}
                                        variant="solid"
                                        size="sm"
                                        minW="auto"
                                        px={3}
                                        {...(bg ? { bg, _hover: { bg: hoverBg } } : {})}
                                    >
                                        {icon}
                                        {showText && <Box as="span" ms={2}>{label}</Box>}
                                    </Button>
                                ))}
                            <UserMenu />
                        </>
                    ) : (
                        <Button variant="solid" onClick={() => navigate("/login")}>
                            {t("common:actions.start")}
                            <LogIn size={16} style={{ marginLeft: 8 }} />
                        </Button>
                    )}
                </Flex>
            </Flex>
        </Box>
    );
};