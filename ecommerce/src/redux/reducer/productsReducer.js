import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosWithUserToken } from "../../middleware/axiosWithToken";
import { toast } from "react-toastify";

const INITIAL_STATE = {
    products: [],
    success: false,
    errors: null,
    msg: null,
    isLoading: false,
}
const baseurl='http://localhost:4100'
export const getInitialAsync = createAsyncThunk("/products/addProducts",
    async (_, thunkAPI) => {
        try {
            const response = await axiosWithUserToken.get(`${baseurl}/api/products/get-products`);
            // console.log(response, 'response');
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err?.response?.data || [{ msg: "server not responding" }]);
        }

    }
)
export const getOneProductByIdAsync = createAsyncThunk("/products/get-one-product",
    async (id, thunkAPI) => {
        try {
            // console.log(id);
            const response = await axiosWithUserToken.get(`${baseurl}/api/products/get-one/${id}`);
            // console.log(response);
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err?.response?.data || [{ msg: "server not responding" }]);
        }
    }
)
export const filterProductsAsync = createAsyncThunk("/products/filterProducts",
    async (payload, thunkAPI) => {
        // console.log(payload, 'payload');
        try {
            const response = await axios.post(`${baseurl}/api/products/filter`,
                {
                    ...payload
                });
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err?.response?.data || [{ msg: "server not responding" }]);
        }
    }
);

export const addProductAsync = createAsyncThunk("/products/ad-product",
    async (payload, thunkAPI) => {
        try {

            const response = await axiosWithUserToken.post(`${baseurl}/api/products/add-product`, { ...payload }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err?.response?.data || [{ msg: "server not responding" }]);
        }

    }
)
export const rateProductAsync = createAsyncThunk("/products/rate-product",
    async (payload, thunkAPI) => {
        try {
            const response = await axiosWithUserToken.post(`${baseurl}/api/products/rate`, { ...payload });
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err?.response?.data || [{ msg: "server not responding" }]);
        }
    }

)
export const likeProductAsync = createAsyncThunk("/products/like-product",
    async ({ id, type }, thunkAPI) => {
        try {
            const response = await axiosWithUserToken.post(`${baseurl}/api/likes/?id=${id}&type=${type}`);
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err?.response?.data || [{ msg: "server not responding" }]);
        }
    }
)

const productsSlice = createSlice({
    name: "products",
    initialState: INITIAL_STATE,
    reducers: {
        toggleCart: (state, action) => {
            state.products = state.products.map((product) => {
                if (product._id === action.payload) {
                    product.inCart = true;
                }
                return product;
            })
        },
        resetProductState: (state, action) => {
            return INITIAL_STATE;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getInitialAsync.fulfilled, (state, action) => {
            state.isLoading = false;
            state.msg = action?.payload?.msg;
                state.products = action?.payload?.res;
        })
            .addCase(getInitialAsync.pending, (state, action) => {
                state.isLoading = true;
                state.products = action.payload;
            })
            .addCase(getInitialAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = action?.payload?.data;
            })

            .addCase(rateProductAsync.fulfilled, (state, action) => {
                state.products = state.products.map((product) => {
                    if (product._id === action.payload._id) {
                        return { ...product, ...action.payload };
                    }
                    return product;
                });
            })
            .addCase(likeProductAsync.fulfilled, (state, action) => {
                // console.log(action.payload, 'payload');
                state.products = state.products.map((product) => {
                    if (product._id === action.payload._id) {
                        return { ...product, likes: action.payload.likes };
                    }
                    return product;
                });
            })
            .addCase(filterProductsAsync.fulfilled, (state, action) => {
                // console.log(action.payload);
                state.products = action.payload;
            })
            .addCase(addProductAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.msg = action?.payload?.msg;
                state.success = action?.payload?.success;
            })
            .addCase(addProductAsync.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(addProductAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.msg = action?.payload?.msg;
                state.success = action?.payload?.success;
                state.errors = action?.payload?.errors;
            })

    }
});

export const productsReducer = productsSlice.reducer;

export const prodActions = productsSlice.actions;

export const productSelector = (state) => state.productsReducer;

