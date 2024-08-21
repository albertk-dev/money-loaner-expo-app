import { useDispatch as rawUseDispatch } from 'react-redux';
import { AppDispatch } from '../redux/setup/store';


export const useDispatch = () => rawUseDispatch<AppDispatch>();
