import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { axiosWithUserToken } from "../../middleware/axiosWithToken";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const INITIAL_STATE = {
    carts: [],
}


export const setInitialCartAsync = createAsyncThunk("carts/setinitialstate",
    async () => {
        // console.log('set initial');
        const response = await axiosWithUserToken.get("http://localhost:4100/api/carts/get-cart-items");
        // console.log("response", response);
        return response.data;
    }
)

export const saveToCartAsync = createAsyncThunk("carts/saveToCart",
    async (payload) => {
        // console.log(payload, "payload");
        const response = await axiosWithUserToken.post(`http://localhost:4100/api/carts/add-to-cart?productID=${payload._id}&quantity=1`, {
            ...payload
        });
        console.log("response", response);
        return response.data;
    }
)

export const removeFromCartAsync = createAsyncThunk("carts/removeFromCart",
    async (id) => {
        // console.log("id", id);
        const response = await axiosWithUserToken.delete(`http://localhost:4100/api/carts/delete-cart-item/${id}`);
        // console.log("response", response);
        return response.data;
    }
)

export const increaseCartItem = createAsyncThunk("carts/increase-item",
    async (id) => {
        // console.log("id", id);
        const response = await axiosWithUserToken.post(`http://localhost:4100/api/carts/increase-quantity/${id}`)
        // console.log(response);
        return response.data;
    }

)

export const decreaseCartItem = createAsyncThunk("carts/decrease-item",
    async (id) => {
        console.log("id", id);
        const response = await axiosWithUserToken.post(`http://localhost:4100/api/carts/decrease-quantity/${id}`)

        // console.log(response);
        return response.data;
    }

)

const cartSlice = createSlice({
    name: "cart",
    initialState: INITIAL_STATE,
    reducers: {
        setInitialCart: (state, action) => {
            state.carts = action.payload;
        },
        clearCart: (state, action) => {
            console.log("clearcart");
            state.carts = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(saveToCartAsync.fulfilled, (state, action) => {
            if (action?.payload?.success) {
                state.carts.push({ ...action.payload.res })
                toast.success(action?.payload?.msg, {
                    className: 'custom-toast'
                })
            } else {
                toast.error(action?.payload?.msg, {
                    className: 'custom-toast'
                })
            }
        })
            .addCase(setInitialCartAsync.fulfilled, (state, action) => {
                // console.log(action.payload, 'action');
                state.carts = action.payload;
            })
            .addCase(setInitialCartAsync.rejected, (state, action) => {
                // console.log("action", action);
                // state.carts.length = 0;
            })
            .addCase(removeFromCartAsync.fulfilled, (state, action) => {
                state.carts = state.carts.filter((cart) => cart._id !== action.payload._id)

            })
            .addCase(increaseCartItem.fulfilled, (state, action) => {
                // console.log(action.payload);
                state.carts = state.carts.map((cart) => {
                    if (cart._id === action.payload._id) {
                        return { ...cart, quantity: action.payload.quantity }
                    }
                    return cart;
                })

            })
            .addCase(decreaseCartItem.fulfilled, (state, action) => {
                // console.log(action.payload);
                state.carts = state.carts.map((cart) => {
                    if (cart._id === action.payload._id) {
                        return { ...cart, quantity: action.payload.quantity }
                    }
                    return cart;
                })
            })
    }
})

export const cartSelector = (state) => state.cartReducer.carts;
export const cartActions = cartSlice.actions;
export const cartReducer = cartSlice.reducer;

