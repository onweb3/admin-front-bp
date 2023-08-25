import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchAttractionInitialData = createAsyncThunk(
    "markupProfileForm/fetchAttractionInitialData",
    async (_, { getState }) => {
        const { jwtToken } = getState().admin;
        const response = await axios.get(
            "/profile/get-all-attraction-activities",
            {
                headers: {
                    authorization: `Bearer ${jwtToken}`,
                },
            }
        );

        // console.log(response.data, "data");
        return response.data;
    }
);

export const fetchVisaInitialData = createAsyncThunk(
    "markupProfileForm/fetchVisaInitialData",
    async (_, { getState }) => {
        const { jwtToken } = getState().admin;
        const response = await axios.get("/profile/get-all-visatype", {
            headers: {
                authorization: `Bearer ${jwtToken}`,
            },
        });

        console.log(response.data, "data");
        return response.data;
    }
);

const initialState = {
    attractionList: [
        {
            name: "",
            activity: [
                {
                    id: "",
                    name: "",
                    activityType: "",
                },
            ],
        },
    ],

    visaTypeList: [],
};

export const markupProfileFormSlice = createSlice({
    name: "markupProfileForm",
    initialState,
    reducers: {
        addNewArray: (state, action) => {
            const { name } = action.payload.name;
            state[name].push({
                markupType: action.payload?.question,
                answer: action.payload?.answer,
            });
        },
    },
    extraReducers: {
        [fetchAttractionInitialData.fulfilled]: (state, action) => {
            console.log(action.payload, "action.payload?.activities;");
            state.attractionList = action.payload;
        },
        [fetchVisaInitialData.fulfilled]: (state, action) => {
            console.log(action.payload, "action.payload?.activities;");
            state.visaTypeList = action.payload;
        },
    },
});

export const { addNewArray } = markupProfileFormSlice.actions;

export default markupProfileFormSlice.reducer;
