import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

const initialState = {
    singleFlightDetails: {},
    flightAncillaries: {},
};

export const flightOrderSlice = createSlice({
    name: "flightOrder",
    initialState,
    reducers: {
        handleDataChange: (state, action) => {
            state[action.payload.name] = action.payload.value;
        },
        handleInitalDataChange: (state, action) => {
            state[action.payload.name] = action.payload.value;
        },
        handleTotalCountChange: (state, action) => {
            if (action.payload.value === "add") {
                const total =
                    state.flightAncillaries.mealsSsr[action.payload.index1];
                total.totalCount = (total.count || 0) + 1;
            } else if (action.payload.value === "substract") {
                const total =
                    state.flightAncillaries.mealsSsr[action.payload.index1];
                total.totalCount = Math.max((meal.count || 0) - 1, 0);
            }
        },
        handleMealCountChange: (state, action) => {
            if (action.payload.value === "add") {
                const meal =
                    state.flightAncillaries.mealsSsr[action.payload.index1]
                        .meals[action.payload.index2];
                meal.count = (meal.count || 0) + 1;
            } else if (action.payload.value === "substract") {
                const meal =
                    state.flightAncillaries.mealsSsr[action.payload.index1]
                        .meals[action.payload.index2];
                meal.count = Math.max((meal.count || 0) - 1, 0);
            }
        },
    },
});

export const {
    handleInitalDataChange,
    handleMealCountChange,
    handleDataChange,
} = flightOrderSlice.actions;

export default flightOrderSlice.reducer;
