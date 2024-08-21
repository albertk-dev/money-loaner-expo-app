import { TypedUseSelectorHook, useSelector as rawUseSelector } from 'react-redux';
import { RootState } from '../redux/setup/rootReducer';


export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector;
