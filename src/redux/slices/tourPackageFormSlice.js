import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

const initialState = {
    data: {
        packageName: "",
        isCustomDate: false,
        noOfDays: "",
    },
    availableDates: [],
    tPackageHotels: [
        {
            country: "",
            city: "",
            noOfNights: 1,
            hotelOptions: [],
        },
    ],
    itineraries: [],
    activities: [],
};

export const fetchTPackageInitialData = createAsyncThunk(
    "/tourPackageForm/fetchTPackageInitialData",
    async (args, { getState }) => {
        const { jwtToken } = getState().admin;

        try {
            const response = await axios.get(`/tour-packages/initial-data`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            return response.data;
        } catch (err) {
            return err.message;
        }
    }
);

export const tourPackageFormSlice = createSlice({
    name: "tourPackageForm",
    initialState,
    reducers: {
        handleTourDataChange: (state, action) => {
            state.data[action.payload?.name] = action.payload?.value;
            if (action.payload?.name === "noOfDays") {
                if (isNaN(state.data.noOfDays) || Number(state.data.noOfDays) < 1) {
                    state.itineraries = [];
                }
                let tempItineraries = [];
                for (let i = 0; i < Number(state.data.noOfDays); i++) {
                    if (state.itineraries[i]) {
                        tempItineraries?.push(state.itineraries[i]);
                    } else {
                        tempItineraries?.push({
                            title: "",
                            itineraryItems: [],
                        });
                    }
                }
                state.itineraries = tempItineraries;
            }
        },
        addTPackageAvailableDateRow: (state, action) => {
            state.availableDates?.push({
                startDate: "",
                endDate: "",
            });
        },
        removeTPackageAvailableDateRow: (state, action) => {
            state.availableDates?.splice(action.payload, 1);
        },
        handleChangeTPackageAvailableDateData: (state, action) => {
            state.availableDates[action.payload?.index][action.payload?.name] =
                action.payload?.value;
        },
        addTPackageHotelRow: (state, action) => {
            state.tPackageHotels?.push({
                country: "",
                city: "",
                noOfNights: 1,
                hotelOptions: [],
            });
        },
        removeTPackageHotelRow: (state, action) => {
            state.tPackageHotels?.splice(action?.payload, 1);
        },
        handleTourPackageHotelDataChange: (state, action) => {
            state.tPackageHotels[action.payload?.index][action.payload?.name] =
                action.payload?.value;
        },
        addTourPackageHotelOption: (state, action) => {
            state.tPackageHotels[action.payload?.index]?.hotelOptions?.push({
                ...action.payload?.data,
            });
        },
        removeTourPackageHotelOption: (state, action) => {
            state.tPackageHotels[action.payload?.index]?.hotelOptions?.splice(
                action?.payload?.hOptIndex,
                1
            );
        },
        handleTPackageItinerariesDataChange: (state, action) => {
            state.itineraries[action.payload?.itineraryIndex][action.payload?.name] =
                action.payload?.value;
        },
        addTPackageItineraryItems: (state, action) => {
            state.itineraries[action.payload?.itineraryIndex]?.itineraryItems?.push({
                ...action.payload,
            });
        },
        removeTPackageItineraryItems: (state, action) => {
            state.itineraries[action.payload?.itineraryIndex]?.itineraryItems?.splice(
                action.payload?.itineraryItemIndex,
                1
            );
        },
    },
    extraReducers: {
        [fetchTPackageInitialData.fulfilled]: (state, action) => {
            state.activities = action.payload?.activities;
        },
    },
});

export const {
    handleTourDataChange,
    addTPackageAvailableDateRow,
    removeTPackageAvailableDateRow,
    handleChangeTPackageAvailableDateData,
    addTPackageHotelRow,
    removeTPackageHotelRow,
    handleTourPackageHotelDataChange,
    addTourPackageHotelOption,
    removeTourPackageHotelOption,
    updateAllTPackageItineraries,
    addTPackageItineraryItems,
    removeTPackageItineraryItems,
    handleTPackageItinerariesDataChange,
} = tourPackageFormSlice.actions;

export default tourPackageFormSlice.reducer;
