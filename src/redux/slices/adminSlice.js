import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axioss from "../../axios";
import { config } from "../../constants";

export const fetchAdmin = createAsyncThunk(
    "adminSlice/fetchAdmin",
    async (_, { getState }) => {
        const { jwtToken } = getState().admin;
        if (jwtToken) {
            const response = await axioss.get("/auth/my-account", {
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

export const checkInstallation = createAsyncThunk(
    "adminSlice/checkInstallation",
    async (_, { getState }) => {
        const { jwtToken } = getState().admin;
        const response = await axios.get(`${config.SERVER_URL}/initial/`);
        return response.data;
    }
);

const initialState = {
    isSiteLoading: true,
    admin: {},
    jwtToken: localStorage.getItem("random-string") || "",
    isLoggedIn: false,
    isInstallation: true,
    company: {},
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
        setInstallation: (state, action) => {
            state.isInstallation = true;
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
        [checkInstallation.fulfilled]: (state, action) => {
            if (action.payload?.status === true) {
                state.isInstallation = true;
                state.company = action.payload.data[0];
            } else {
                state.isInstallation = false;
            }
        },
        [checkInstallation.rejected]: (state, action) => {
            state.isInstallation = false;
        },
    },
});

export const { setAdmin, logoutAdmin, updateAdmin, setInstallation } =
    adminSlice.actions;

export default adminSlice.reducer;
