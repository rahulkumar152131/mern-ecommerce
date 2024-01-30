import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { axiosWithUserToken } from "../../middleware/axiosWithToken";
import { useNavigate } from "react-router-dom";

const INITIAL_STATE = {
    orders: [],
    isLoading: false,
    success: false,
    errors: null,

}


export const setInitialorderAsync = createAsyncThunk("orders/setinitialstate",
    async () => {
        // console.log('set initial');
        const response = await axiosWithUserToken.get("http://localhost:4100/api/orders/get-all-order");
        // console.log("response", response);
        return response.data;
    }
)

export const saveToorderAsync = createAsyncThunk("orders/saveToorder",
    async (_, thunkAPI) => {
        // console.log(payload, "payload");
        try {
            const response = await axiosWithUserToken.post(`http://localhost:4100/api/orders/place-order`);
            // console.log("response", response);
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err?.response?.data || [{ msg: "server not responding" }]);
        }
    }
)

export const removeFromorderAsync = createAsyncThunk("orders/removeFromorder",
    async (id) => {
        // console.log("id", id);
        const response = await axiosWithUserToken.delete(`http://localhost:4100/api/orders/delete-order-item/${id}`);
        // console.log("response", response);
        return response.data;
    }
)


const orderSlice = createSlice({
    name: "order",
    initialState: INITIAL_STATE,
    reducers: {
        setInitialorder: (state, action) => {
            state.orders = action.payload;
        },
        clearorder: (state, action) => {
            console.log("clearorder");
            state.orders = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(saveToorderAsync.fulfilled, (state, action) => {
            state.isLoading = false;
            state.msg = action?.payload?.msg;
            state.success = action?.payload?.success;
            // console.log("action", action.payload);

            state.orders.push({ ...action.payload })
        })
            .addCase(saveToorderAsync.pending, (state, action) => {
                // console.log("action", action.payload);
                state.isLoading = true;
                // state.orders.push({ ...action.payload })
            })
            .addCase(saveToorderAsync.rejected, (state, action) => {
                // console.log("action", action.payload);
                state.isLoading = false;
                state.msg = action?.payload?.msg;
                state.success = action?.payload?.success;


            })
            .addCase(setInitialorderAsync.fulfilled, (state, action) => {
                // console.log(action.payload, 'action');
                state.orders = action.payload;
            })
            .addCase(setInitialorderAsync.rejected, (state, action) => {
                // console.log("action", action);
                // state.orders.length = 0;
            })
            .addCase(removeFromorderAsync.fulfilled, (state, action) => {
                state.orders = state.orders.filter((order) => order._id !== action.payload._id)

            })

    }
})

export const orderSelector = (state) => state.orderReducer;
export const orderActions = orderSlice.actions;
export const orderReducer = orderSlice.reducer;

