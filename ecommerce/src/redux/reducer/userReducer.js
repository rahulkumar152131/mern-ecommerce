import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { json, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const INITIAL_STATE = {
    user: null,
    isLoading: false,
    errors: null,
    msg: null,
    success: false
}
const baseurl='http://localhost:4100'
export const signUpAsync = createAsyncThunk('user/sign-up', async (payload, thunkAPI) => {
    try {
        const response = await axios.post(`${baseurl}/api/users/sign-up`, { ...payload }, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err?.response?.data?.errors || [{ msg: "server not responding" }]);
    }
});

export const signInAsync = createAsyncThunk('user/sign-in', async (payload, thunkAPI) => {
    // console.log(payload);
    try {

        const response = await axios.post(`${baseurl}/api/users/sign-in`, {
            ...payload
        })
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err?.response?.data || [{ msg: "server not responding" }]);
    }

})
export const mailSendAsync = createAsyncThunk('user/send-mail', async (payload, thunkAPI) => {
    // console.log(payload);
    try {
        // console.log(payload);

        const response = await axios.post(`${baseurl}/api/users/send-link`, {
            ...payload
        })
        // console.log(response);
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err?.response?.data || [{ msg: "server not responding" }]);
    }

})
export const resetPasswordAsync = createAsyncThunk('user/reset-password', async (payload, thunkAPI) => {
    // console.log(payload);
    try {
        // console.log(payload);

        const response = await axios.put(`${baseurl}/api/users/reset-password`, {
            ...payload
        })
        // console.log(response);
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err?.response?.data || [{ msg: "server not responding" }]);
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState: INITIAL_STATE,
    reducers: {
        setUser: (state, action) => {
            if (action.payload === null) {
                return INITIAL_STATE;
            }
            // console.log(action.payload, 'action');
            state.user = action.payload;
        },
        // clearUser: (state, action) => {
        //     // console.log(action.payload, 'action');
        //     state.user = null;
        // },
        // clearMsg: (state, action) => {
        //     // console.log(action.payload, 'action');
        //     state.msg = null;
        // },
        // changeSuccess: (state, action) => {
        //     // console.log(action.payload, 'action');
        //     state.success = false;
        // },
        setUserErrors: (state, action) => {
            state.errors = action.payload;
        },
        resetUserState: (state, action) => {
            state.user = null;
            state.isLoading = false;
            state.errors = null;
            state.msg = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(signUpAsync.fulfilled, (state, action) => {
            state.isLoading = false;
            state.errors = null;
            state.success = action?.payload?.success;
            state.msg = action?.payload?.msg;
        })
            .addCase(signUpAsync.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(signUpAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.success = false
                state.errors = action?.payload?.errors;
            })
            .addCase(signInAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.errors = null;
                state.success = action?.payload?.success;
                state.msg = action?.payload?.msg;
                if (action.payload) {
                    localStorage.setItem('userToken', JSON.stringify("Bearer " + action.payload?.token));
                    localStorage.setItem('user', JSON.stringify(action.payload?.user));
                    const user = JSON.parse(localStorage.getItem('user'));
                    const userToken = localStorage.getItem('userToken');
                    const message = JSON.parse(localStorage.getItem('message'));
                    state.user = { user, userToken, message };
                } else {
                    console.log("incorrect credentials");
                }
            })
            .addCase(signInAsync.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(signInAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.success = false
                state.errors = [action.payload];
            })
            .addCase(mailSendAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = action?.payload?.success;
                state.msg = action?.payload?.msg;
            })
            .addCase(mailSendAsync.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(mailSendAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.success = false
                state.errors = [action.payload];
            })
            .addCase(resetPasswordAsync.fulfilled, (state, action) => {
                console.log(action.payload);
                state.isLoading = false;
                state.success = action?.payload?.success;
                state.msg = action?.payload?.msg;
            })
            .addCase(resetPasswordAsync.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(resetPasswordAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.success = false
                state.errors = [action.payload];
            })
    }
})

export const userReducer = userSlice.reducer;
export const userActions = userSlice.actions;
export const userSelector = (state) => state.userReducer
