import { useDispatch, useSelector, useStore } from "react-redux";
import type { RootState, AppDispatch } from ".";
import type { Store } from "@reduxjs/toolkit";

// Typed hooks — use these throughout the app, never plain useDispatch/useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) => useSelector(selector);
export const useAppStore = () => useStore<Store<RootState>>();
