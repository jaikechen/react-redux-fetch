import {applyMiddleware, createStore, compose, combineReducers} from "redux";
import { fetchReducer, fetchState } from '../fetch/fetchReducer';
import { fetchMiddleware } from "../fetch/fetchMiddleware";
export const reducers = combineReducers({fetchReducer});
export const rootStore = createStore(
  reducers,
  compose(
    applyMiddleware(fetchMiddleware)
  )
);

export interface rootStoreType {
   fetchReducer: fetchState<unknown>[]
}