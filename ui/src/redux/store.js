import { configureStore } from "@reduxjs/toolkit";
import classifiedSlice from "./classifiedSlice";

const store = configureStore({ reducer: { classifiedSlice } });

export default store;
