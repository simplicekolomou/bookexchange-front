import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

/**
 * Configuration du système de design
 */

const customConfig = defineConfig({
    // ============================================
    //  PALETTE DE COULEURS SÉMANTIQUES
    // ============================================
    theme: {
        tokens: {
            colors: {
                // Couleurs principales de la marque
                brand: {
                    50: { value: "#fef2f2" },
                    100: { value: "#fee2e2" },
                    200: { value: "#fecaca" },
                    300: { value: "#fca5a5" },
                    400: { value: "#f87171" },
                    500: { value: "#d76442" },
                    600: { value: "#dc2626" },
                    700: { value: "#b91c1c" },
                    800: { value: "#991b1b" },
                },

                // Couleurs neutres (gris)
                neutral: {
                    50: { value: "#f3f2f2" },
                    100: { value: "#f5f5f4" },
                    200: { value: "#e7e5e4" },
                    300: { value: "#d6d3d1" },
                    400: { value: "#a8a29e" },
                    500: { value: "#78716c" },
                    600: { value: "#57534e" },
                    700: { value: "#44403c" },
                    800: { value: "#292524" },
                    900: { value: "#1c1917" },
                    950: { value: "#0c0a09" },
                },

                // Couleurs d'accentuation (terre/orange)
                accent: {
                    50: { value: "#fff7ed" },
                    100: { value: "#ffedd5" },
                    200: { value: "#fed7aa" },
                    300: { value: "#fdba74" },
                    400: { value: "#fb923c" },
                    500: { value: "#f97316" },
                    600: { value: "#ea580c" },
                    700: { value: "#c2410c" },
                    800: { value: "#9a3412" },
                    900: { value: "#7c2d12" },
                },

                // Couleurs sémantiques (success, warning, error, info)
                success: {
                    50: { value: "#f0fdf4" },
                    500: { value: "#22c55e" },
                    600: { value: "#16a34a" },
                },
                error: {
                    50: { value: "#fef2f2" },
                    500: { value: "#ef4444" },
                    600: { value: "#dc2626" },
                },
                info: {
                    50: { value: "#eff6ff" },
                    500: { value: "#3b82f6" },
                    600: { value: "#2563eb" },
                },
            },

            // ============================================
            //  TYPOGRAPHIE
            // ============================================
            fonts: {
                heading: { value: "'Inter', 'Nunito', sans-serif" },
                body: { value: "'Inter', 'Nunito', sans-serif" },
                mono: { value: "'Fira Code', 'Courier New', monospace" },
            },

            fontSizes: {
                xs: { value: "0.75rem" },      // 12px
                sm: { value: "0.875rem" },     // 14px
                md: { value: "1rem" },         // 16px (base)
                lg: { value: "1.125rem" },     // 18px
                xl: { value: "1.25rem" },      // 20px
                "2xl": { value: "1.5rem" },    // 24px
                "3xl": { value: "1.875rem" },  // 30px
                "4xl": { value: "2.25rem" },   // 36px
                "5xl": { value: "3rem" },      // 48px
            },

            fontWeights: {
                normal: { value: 400 },
                medium: { value: 500 },
                semibold: { value: 600 },
                bold: { value: 700 },
            },

            lineHeights: {
                tight: { value: "1.25" },
                normal: { value: "1.5" },
                relaxed: { value: "1.75" },
            },

            // ============================================
            //  ESPACEMENTS
            // ============================================
            spacing: {
                xs: { value: "0.25rem" },   // 4px
                sm: { value: "0.5rem" },    // 8px
                md: { value: "1rem" },      // 16px
                lg: { value: "1.5rem" },    // 24px
                xl: { value: "2rem" },      // 32px
                "2xl": { value: "3rem" },   // 48px
            },

            // ============================================
            //  BORDURES & OMBRES
            // ============================================
            radii: {
                none: { value: "0" },
                sm: { value: "0.25rem" },   // 4px
                md: { value: "0.5rem" },    // 8px
            },

            // ============================================
            //  TRANSITIONS
            // ============================================
            animations: {
                durations: {
                    fast: { value: "150ms" },
                    normal: { value: "250ms" },
                    slow: { value: "350ms" },
                },
                easings: {
                    ease: { value: "ease" },
                    easeIn: { value: "ease-in" },
                    easeOut: { value: "ease-out" },
                    easeInOut: { value: "ease-in-out" },
                },
            },
        },

        // ============================================
        //  TOKENS SÉMANTIQUES (Mapping des couleurs)
        // ============================================
        semanticTokens: {
            colors: {
                // Couleurs de fond
                "bg.canvas": {
                    value: { base: "{colors.neutral.50}", _dark: "{colors.neutral.950}" },
                },
                "bg.surface": {
                    value: { base: "white", _dark: "{colors.neutral.900}" },
                },
                "bg.subtle": {
                    value: { base: "{colors.neutral.100}", _dark: "{colors.neutral.800}" },
                },

                // Couleurs de texte
                "fg.default": {
                    value: { base: "{colors.neutral.900}", _dark: "{colors.neutral.50}" },
                },
                "fg.muted": {
                    value: { base: "{colors.neutral.600}", _dark: "{colors.neutral.400}" },
                },

                // Couleurs de bordure
                "border.default": {
                    value: { base: "{colors.neutral.100}", _dark: "{colors.neutral.700}" },
                },
                "border.muted": {
                    value: { base: "{colors.neutral.100}", _dark: "{colors.neutral.800}" },
                },

                // Couleurs d'action (boutons, liens)
                "colorPalette.default": {
                    value: { base: "{colors.brand.500}", _dark: "{colors.brand.400}" },
                },
                "colorPalette.emphasized": {
                    value: { base: "{colors.brand.600}", _dark: "{colors.brand.300}" },
                },
            },
        },

        // ============================================
        //  STYLES DE COMPOSANTS PERSONNALISÉS
        // ============================================
        recipes: {
            // Style des boutons personnalisés
            button: {
                base: {
                    fontWeight: "semibold",
                    borderRadius: "md",
                    transition: "all 0.2s ease-in-out",
                    border: "1px solid colors.border.default",
                    _hover: {
                        transform: "translateY(-1px)",
                    },
                },
                variants: {
                    variant: {
                        solid: {
                            base: {
                                bg: "brand.500",
                                color: "white",
                                _hover: {
                                    bg: "brand.50",
                                },
                            },
                        },
                        outline: {
                            base: {
                                borderWidth: "2px",
                                borderColor: "brand.500",
                                color: "brand.500",
                                _hover: {
                                    bg: "brand.50",
                                },
                            },
                        },
                        ghost: {
                            base: {
                                color: "brand.500",
                                _hover: {
                                    bg: "brand.50",
                                },
                            },
                        },
                    },
                },
            },

            // Style des cartes
            card: {
                base: {
                    bg: "bg.surface",
                    borderRadius: "xl",
                    p: "lg",
                    borderWidth: "1px",
                    borderColor: "border.default",
                    transition: "all 0.2s ease-in-out",
                    _hover: {
                        transform: "translateY(-4px)",
                    },
                },
            },
        },
    },

    // ============================================
    //  STYLES GLOBAUX
    // ============================================
    globalCss: {
        // Reset et styles de base
        "html, body": {
            margin: 0,
            padding: 0,
            fontFamily: "{fonts.body}",
            fontSize: "{fontSizes.md}",
            lineHeight: "{lineHeights.normal}",
            scrollBehavior: "smooth",
            backgroundColor: "{colors.bg.canvas}",
            color: "{colors.fg.default}",
        },

        // Conteneur principal
        "#root": {
            width: "100%",
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "{spacing.xs}",
        },

        // Titres
        "h1, h2, h3, h4, h5, h6": {
            fontFamily: "{fonts.heading}",
            fontWeight: "{fontWeights.bold}",
            color: "{colors.brand.500}",
            lineHeight: "{lineHeights.tight}",
        },

        h1: {
            fontSize: "{fontSizes.5xl}",
            textAlign: "center",
        },
        h2: {
            fontSize: "{fontSizes.3xl}",
        },
        h3: {
            fontSize: "{fontSizes.2xl}",
        },

        // Liens
        a: {
            color: "{colors.brand.500}",
            textDecoration: "underline",
            transition: "color {animations.durations.fast} {animations.easings.easeInOut}",
            _hover: {
                color: "{colors.brand.600}",
            },
        },

        // Scroll personnalisé (Webkit)
        "::-webkit-scrollbar": {
            width: "12px",
        },
        "::-webkit-scrollbar-track": {
            bg: "{colors.neutral.100}",
        },
        "::-webkit-scrollbar-thumb": {
            bg: "{colors.neutral.300}",
            borderRadius: "{radii.md}",
            _hover: {
                bg: "{colors.neutral.400}",
            },
        },

        // Selection de texte
        "::selection": {
            bg: "{colors.brand.200}",
            color: "{colors.brand.900}",
        },
    },

    // ============================================
    //  CONDITIONS (Responsive & States)
    // ============================================
    conditions: {
        light: "[data-theme=light] &",
        dark: "[data-theme=dark] &",
        sm: "@media (min-width: 640px)",
        md: "@media (min-width: 768px)",
        lg: "@media (min-width: 1024px)",
        xl: "@media (min-width: 1280px)",
    },
})

export const designTheme = createSystem(defaultConfig, customConfig)

// ============================================
//  EXPORT DES TOKENS POUR USAGE DIRECT
// ============================================
export const tokens = {
    colors: {
        primary: "brand.500",
        primaryHover: "brand.50",
        secondary: "accent.500",
        background: "bg.canvas",
        surface: "bg.surface",
        text: "fg.default",
        textMuted: "fg.muted",
        border: "border.default",
    },
    spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
    },
    radius: {
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
    },
}