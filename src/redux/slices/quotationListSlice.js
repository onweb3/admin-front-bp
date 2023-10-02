import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

const initialState = {
    isLoading: true,
    quotations: [],
    filters: {
        dateFrom: "",
        dateTo: "",
        quotationNumber: "",
    },
    skip: 0,
    limit: 10,
    totalQuotations: 0,
};

const fetchQuotations = createAsyncThunk(
    "/user/fetchQuotations",
    async (args, { getState }) => {
        const { jwtToken } = getState().admin;
        const { filters, skip, limit } = getState().quotationsList;

        try {
            const response = await axios.get(
                `/quotations/all?skip=${skip}&limit=${limit}&dateFrom=${
                    filters?.dateFrom
                }&dateTo=${filters?.dateTo}&quotationNumber=${
                    filters?.quotationNumber
                }&agent=${args?.agentId || ""}&status=${filters.status}`,
                { headers: { Authorization: `Bearer ${jwtToken}` } }
            );
            return response.data;
        } catch (err) {
            return err.message;
        }
    }
);

const fetchAgentsQuotations = createAsyncThunk(
    "/user/fetchAgentsQuotations",
    async (_, { getState }) => {
        const { jwtToken } = getState().user;
        const { filters, skip, limit } = getState().quotationsList;
        const response = await axios.get(
            `/quotations/all?skip=${skip}&limit=${limit}&dateFrom=${filters?.dateFrom}&dateTo=${filters?.dateTo}&quotationNumber=${filters?.quotationNumber}&status=${filters.status}`,
            { headers: { Authorization: `Bearer ${jwtToken}` } }
        );
        return response.data;
    }
);

const fetchSingleResellerQuotations = createAsyncThunk(
    "/user/fetchSingleResellerQuotations",
    async (args, { getState }) => {
        const { jwtToken } = getState().admin;
        const { filters, skip, limit } = getState().quotationsList;

        try {
            console.log(args, "argfs");
            const response = await axios.get(
                `/quotations/reseller/list/${
                    args || ""
                }?skip=${skip}&limit=${limit}&dateFrom=${
                    filters?.dateFrom
                }&dateTo=${filters?.dateTo}&quotationNumber=${
                    filters?.quotationNumber
                }&status=${filters.status}`,
                { headers: { Authorization: `Bearer ${jwtToken}` } }
            );
            return response.data;
        } catch (err) {
            return err.message;
        }
    }
);

export const quotationsListSlice = createSlice({
    name: "quotationsList",
    initialState,
    reducers: {
        updateIsQuotationsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        updateQuotationsFilters: (state, action) => {
            state.filters[action.payload?.name] = action.payload?.value;
            state.skip = 0;
        },
        clearQuotationsFilters: (state, action) => {
            state.filters = {
                dateFrom: "",
                dateTo: "",
                quotationNumber: "",
            };
            state.limit = 10;
            state.skip = 0;
        },
        updateQuotationsSkip: (state, action) => {
            state.skip = action.payload;
        },
        incOrDecQuotationsSkip: (state, action) => {
            state.skip += action.payload;
        },
        clearAllQuotationsData: (state, action) => {
            state.quotations = [];
            state.filters = {
                dateFrom: "",
                dateTo: "",
                quotationNumber: "",
            };
            state.limit = 10;
            state.skip = 0;
            state.isLoading = true;
        },
    },
    extraReducers: {
        [fetchQuotations.fulfilled]: (state, action) => {
            state.quotations = action.payload?.quotations;
            state.totalQuotations = action.payload?.totalQuotations;
            state.isLoading = false;
        },
        [fetchAgentsQuotations.fulfilled]: (state, action) => {
            state.quotations = action.payload?.quotations;
            state.totalQuotations = action.payload?.totalQuotations;
            state.isLoading = false;
        },
        [fetchSingleResellerQuotations.fulfilled]: (state, action) => {
            state.quotations = action.payload?.quotations;
            state.totalQuotations = action.payload?.totalQuotations;
            state.isLoading = false;
        },
    },
});

export const {
    clearQuotationsFilters,
    incOrDecQuotationsSkip,
    updateIsQuotationsLoading,
    updateQuotationsFilters,
    updateQuotationsSkip,
    clearAllQuotationsData,
} = quotationsListSlice.actions;

export {
    fetchQuotations,
    fetchAgentsQuotations,
    fetchSingleResellerQuotations,
};

export default quotationsListSlice.reducer;
