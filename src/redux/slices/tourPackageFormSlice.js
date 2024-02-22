import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

const initialState = {
    data: {
        packageType: "static",
        packageName: "",
        overveiw: "",
        packageThemes: [],
        noOfDays: "",
        isCustomDate: false,
        isAirportTransfer: false,
        airportTransferPrice: "",
        isInterHotelTransfer: false,
        interHotelPrice: "",
        inclusions: "",
        exclusions: "",
        visaPolicy: "",
        termsAndConditions: "",
        thumbnail: [],
    },
    availableDates: [],
    excludedDates: [],
    tPackageHotels: [
        {
            country: "",
            city: "",
            noOfNights: "",
            title: "",
            price: "",
            hotelOptions: [],
        },
    ],
    itineraries: [],
    activities: [],
    tPackageThemes: [],
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
                if (
                    isNaN(state.data.noOfDays) ||
                    Number(state.data.noOfDays) < 1
                ) {
                    state.itineraries = [];
                } else {
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

                    if (
                        state.tPackageHotels?.length === 1 &&
                        !state.tPackageHotels[0].noOfNights
                    ) {
                        state.tPackageHotels[0].noOfNights =
                            Number(state.data.noOfDays) - 1;
                    }
                }
            }
        },
        addTPackageAvailableDateRow: (state, action) => {
            state.availableDates?.push({
                startDate: "",
                endDate: "",
            });
        },
        clearTourData: (state, action) => {
            state.data = {
                packageType: "static",
                packageName: "",
                overveiw: "",
                packageThemes: [],
                noOfDays: "",
                isCustomDate: false,
                isAirportTransfer: false,
                airportTransferPrice: "",
                isInterHotelTransfer: false,
                interHotelPrice: "",
                inclusions: "",
                exclusions: "",
                visaPolicy: "",
                termsAndConditions: "",
                thumbnail: [],
            };
            state.availableDates = [];
            state.excludedDates = [];
            state.tPackageHotels = [
                {
                    country: "",
                    city: "",
                    noOfNights: "",
                    title: "",
                    price: "",
                    hotelOptions: [],
                },
            ];
            state.itineraries = [];
            state.activities = [];
            state.tPackageThemes = [];
        },
        removeTPackageAvailableDateRow: (state, action) => {
            state.availableDates?.splice(action.payload, 1);
        },
        handleChangeTPackageAvailableDateData: (state, action) => {
            state.availableDates[action.payload?.index][action.payload?.name] =
                action.payload?.value;
        },
        addTPackageExcludedDateRow: (state, action) => {
            state.excludedDates?.push({
                startDate: "",
                endDate: "",
            });
        },
        removeTPackageExcludedDateRow: (state, action) => {
            state.excludedDates?.splice(action.payload, 1);
        },
        handleChangeTPackageExcludedDateData: (state, action) => {
            state.excludedDates[action.payload?.index][action.payload?.name] =
                action.payload?.value;
        },
        addTPackageHotelRow: (state, action) => {
            state.tPackageHotels?.push({
                country: "",
                city: "",
                noOfNights: "",
                title: "",
                price: "",
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
            state.itineraries[action.payload?.itineraryIndex][
                action.payload?.name
            ] = action.payload?.value;
        },
        addTPackageItineraryItems: (state, action) => {
            state.itineraries[
                action.payload?.itineraryIndex
            ]?.itineraryItems?.push({
                ...action.payload,
            });
        },
        removeTPackageItineraryItems: (state, action) => {
            state.itineraries[
                action.payload?.itineraryIndex
            ]?.itineraryItems?.splice(action.payload?.itineraryItemIndex, 1);
        },
        updateTourPackageFormAllData: (state, action) => {
            state.data = {
                isCustomDate: action.payload?.isCustomDate,
                noOfDays: action.payload?.noOfDays,
                packageType: action.payload?.packageType,
                packageName: action.payload?.packageName,
                overveiw: action.payload?.overveiw,
                packageThemes: action.payload?.packageThemes || [],
                isAirportTransfer: action.payload?.isAirportTransfer || false,
                airportTransferPrice:
                    action.payload?.airportTransferPrice || "",
                isInterHotelTransfer:
                    action.payload?.isInterHotelTransfer || false,
                interHotelPrice: action.payload?.interHotelPrice || "",
                inclusions: action.payload?.inclusions,
                exclusions: action.payload?.exclusions,
                visaPolicy: action.payload?.visaPolicy,
                country: action.payload?.country,
                destination: action.payload?.destination,
                termsAndConditions: action.payload?.termsAndConditions,
                thumbnail: action.payload?.thumbnail,
            };
            state.itineraries = action.payload?.itineraries;
            state.tPackageHotels = action.payload?.hotels;
        },
    },
    extraReducers: {
        [fetchTPackageInitialData.fulfilled]: (state, action) => {
            state.activities = action.payload?.activities;
            state.tPackageThemes = action.payload?.tourPackageThemes;
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
    updateTourPackageFormAllData,
    addTPackageExcludedDateRow,
    handleChangeTPackageExcludedDateData,
    removeTPackageExcludedDateRow,
    clearTourData,
} = tourPackageFormSlice.actions;

export default tourPackageFormSlice.reducer;
