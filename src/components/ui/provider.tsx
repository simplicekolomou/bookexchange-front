"use client"

import { ChakraProvider,} from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import {designTheme} from "./theme.ts";

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={designTheme}>
        <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
