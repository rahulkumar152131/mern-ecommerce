import { configureStore } from "@reduxjs/toolkit";
import { productsReducer } from "./reducer/productsReducer";
import { cartReducer } from "./reducer/cartReducer";
import { userReducer } from "./reducer/userReducer";
import { orderReducer } from "./reducer/orderReducer";


export const store = configureStore({
    reducer: {
        productsReducer,
        cartReducer,
        userReducer,
        orderReducer,
        
    },
    // middleware:[loggerMiddleware]
    // middleware: (getDefaultMiddleware) =>
    // getDefaultMiddleware({
    //   serializableCheck: {
    //     // Ignore these action types
    //     ignoredActions: ['*'],
    //     // ignoredActions: ['user/sign-in/fulfille'],
    //     // Ignore these field paths in all actions
    //     ignoredActionPaths: ['*'],
    //     // Ignore these paths in the state
    //     ignoredPaths: (path) => true,
    //   },
    // }),
})