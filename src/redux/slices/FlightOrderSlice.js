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
        handleInitalDataChange: (state, action) => {
            state[action.payload.name] = action.payload.value;
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

export const { handleInitalDataChange, handleMealCountChange } =
    flightOrderSlice.actions;

export default flightOrderSlice.reducer;
