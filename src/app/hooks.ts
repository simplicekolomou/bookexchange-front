// Ce fichier sert de hub central pour réexporter les hooks Redux pré-typé.
// Ces importations sont restreintes ailleurs afin de garantir une utilisation cohérente
// des hooks typés dans toute l'application.
// Nous désactivons ici la règle ESLint, car il s'agit de l'emplacement désigné
// pour importer et réexporter les versions typées des hooks.
/* eslint-disable no-restricted-imports */

import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'


export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()