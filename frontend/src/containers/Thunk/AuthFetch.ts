import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axiosAPI from "../../axios/AxiosAPI.ts";
import { RootState } from "@reduxjs/toolkit/query";


export interface User{
    _id: string,
    username: string,
    token: string,
}
interface LoginData {
    username: string;
    password: string;
}

interface UserState {
    user: User | null;
    loader: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    loader: false,
    error: null,
};
export const loginUser = createAsyncThunk<User , LoginData , { rejectValue: string }>('users/singIn', async (loginData: { username: string; password: string } , { rejectWithValue }) => {
    try{
        const response = await axiosAPI.post(`/users` , loginData);
        return response.data;
    }catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

export const authorizationUser = createAsyncThunk<User , LoginData , { rejectValue: string }>('users/singUp', async (loginData: { username: string; password: string }, { rejectWithValue }) => {
    try{
        const response = await axiosAPI.post(`/users/sessions` , loginData);
        return response.data;
    }catch (error) {
        console.error('Error details:', error.response);
        return rejectWithValue(error.response?.data?.message || 'Username or password wrong');
    }
});

export const logout = createAsyncThunk<void, string, {state: RootState}>('users/logout',
    async (userToken: string) => {
        await axiosAPI.delete('/users/sessions', {headers: { 'Authorization': `Bearer ${userToken}` }});
    }
);

export const UserSlice = createSlice({
    name:'User',
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state: UserState) => {
            state.loader = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state: UserState, action) => {
            state.user = action.payload;
            state.loader = false;
            state.error = null;
        });
        builder.addCase(loginUser.rejected, (state: UserState , action) => {
            state.loader = false;
            state.error = action.payload as string;
        });
        builder.addCase(authorizationUser.pending, (state: UserState) => {
            state.loader = true;
            state.error = null;
        });
        builder.addCase(authorizationUser.fulfilled, (state: UserState, action) => {
            state.user = action.payload;
            state.loader = false;
            state.error = null;
        });
        builder.addCase(authorizationUser.rejected, (state: UserState , action) => {
            state.loader = false;
            state.error = action.payload as string;
        })
        builder.addCase(logout.pending, (state: UserState) => {
            state.loader = true;
            state.error = null;
        });
        builder.addCase(logout.fulfilled, (state: UserState) => {
            state.user = null;
            state.loader = false;
            state.error = null;
        });
        builder.addCase(logout.rejected, (state: UserState , action) => {
            state.loader = false;
            state.error = action.payload as string;
        });
    },
})


export const UserReducer = UserSlice.reducer;