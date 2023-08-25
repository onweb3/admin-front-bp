import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchAdmin = createAsyncThunk(
    "adminSlice/fetchAdmin",
    async (_, { getState }) => {
        const { jwtToken } = getState().admin;
        if (jwtToken) {
            const response = await axios.get("/auth/my-account", {
                headers: {
                    authorization: `Bearer ${jwtToken}`,
                },
            });
            return response.data;
        } else {
            throw Error("");
        }
    }
);

const initialState = {
    isSiteLoading: true,
    admin: {},
    jwtToken: localStorage.getItem("random-string") || "",
    isLoggedIn: false,
};

export const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        setAdmin: (state, action) => {
            state.admin = action.payload?.admin;
            state.jwtToken = action.payload?.jwtToken;
            state.isLoggedIn = true;

            localStorage.setItem("random-string", action.payload?.jwtToken);
        },
        logoutAdmin: (state, action) => {
            state.isLoggedIn = false;
            state.jwtToken = "";
            state.admin = {};

            localStorage.removeItem("random-string");
        },
        updateAdmin: (state, action) => {
            state.admin = action.payload;
        },
    },
    extraReducers: {
        [fetchAdmin.fulfilled]: (state, action) => {
            state.admin = action.payload;
            state.isLoggedIn = true;
            state.isSiteLoading = false;
        },
        [fetchAdmin.rejected]: (state, action) => {
            state.isSiteLoading = false;
            localStorage.removeItem("random-string");
        },
    },
});

export const { setAdmin, logoutAdmin, updateAdmin } = adminSlice.actions;

export default adminSlice.reducer;
