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
        // handleMealCountChange: (state, action) => {
        //     if (action.payload.value === "add") {
        //         const meal =
        //             state.flightAncillaries.mealsSsr[action.payload.index1]
        //                 .meals[action.payload.index2];
        //         meal.count = (meal.count || 0) + 1;
        //     } else if (action.payload.value === "substract") {
        //         const meal =
        //             state.flightAncillaries.mealsSsr[action.payload.index1]
        //                 .meals[action.payload.index2];
        //         meal.count = Math.max((meal.count || 0) - 1, 0);
        //     }
        // },
        // handleBagggageCountChange: (state, action) => {
        //     if (action.payload.value === "add") {
        //         const baggage =
        //             state.flightAncillaries.baggageSsr[action.payload.index1]
        //                 .baggages[action.payload.index2];
        //         baggage.count = (baggage.count || 0) + 1;
        //     } else if (action.payload.value === "substract") {
        //         const baggage =
        //             state.flightAncillaries.baggageSsr[action.payload.index1]
        //                 .baggages[action.payload.index2];
        //         baggage.count = Math.max((baggage.count || 0) - 1, 0);
        //     }
        // },
        handleSeatCountChange: (state, action) => {
            if (
                !state.flightAncillaries.seatSsr[action.payload.index1]
                    ?.selectedSeats
            ) {
                state.flightAncillaries.seatSsr[
                    action.payload.index1
                ].selectedSeats = [];
            }

            const selectedSeatIndex = state.flightAncillaries?.seatSsr[
                action.payload.index1
            ]?.selectedSeats?.findIndex((seat) => {
                return seat?.seatNumber === action.payload?.value?.seatNumber;
            });

            if (selectedSeatIndex !== -1) {
                // If the seat exists in the array, remove it
                state.flightAncillaries.seatSsr[
                    action.payload.index1
                ].selectedSeats.splice(selectedSeatIndex, 1);
            } else if (
                state.flightAncillaries.priceQuoteResponse.noOfAdults +
                    state.flightAncillaries.priceQuoteResponse.noOfChildren >
                state.flightAncillaries?.seatSsr[action.payload.index1]
                    ?.selectedSeats.length
            ) {
                // If the seat doesn't exist in the array, push it to the array

                state.flightAncillaries.seatSsr[
                    action.payload.index1
                ].selectedSeats.push(
                    action.payload.value
                    // Other properties of the seat
                );
            }
        },
        handleBagggageCountChange: (state, action) => {
            try {
                if (
                    !state.flightAncillaries.baggageSsr[action.payload.index1]
                        ?.selectedBaggage
                ) {
                    state.flightAncillaries.baggageSsr[
                        action.payload.index1
                    ].selectedBaggage = [];
                }
                console.log("call");

                const selectedBaggIndex = state.flightAncillaries?.baggageSsr[
                    action.payload.index1
                ]?.selectedBaggage?.findIndex((bagg) => {
                    return (
                        bagg?.baggageCode === action.payload?.value?.baggageCode
                    );
                });

                if (action.payload.value1 === "add") {
                    console.log("call2");

                    if (selectedBaggIndex !== -1) {
                        console.log("call4");
                        let baggage =
                            state.flightAncillaries.baggageSsr[
                                action.payload.index1
                            ].selectedBaggage[selectedBaggIndex];
                        baggage.count = (baggage?.count || 0) + 1;
                    } else {
                        console.log("call3");

                        state.flightAncillaries.baggageSsr[
                            action.payload.index1
                        ].selectedBaggage.push({
                            ...action.payload?.value,
                            count: 1,
                        });
                    }
                } else if (action.payload.value1 === "substract") {
                    if (selectedBaggIndex !== -1) {
                        let baggage =
                            state.flightAncillaries.baggageSsr[
                                action.payload.index1
                            ].selectedBaggage[selectedBaggIndex];

                        if (baggage?.count > 1) {
                            baggage.count = Math.max(
                                (baggage?.count || 0) - 1,
                                0
                            );
                        } else {
                            state.flightAncillaries.baggageSsr[
                                action.payload.index1
                            ].selectedBaggage.splice(selectedBaggIndex, 1);
                        }
                    }
                }
            } catch (e) {
                console.log(e);
            }
        },
        handleMealCountChange: (state, action) => {
            try {
                if (
                    !state?.flightAncillaries?.mealsSsr[action.payload.index1]
                        ?.selectedMeals
                ) {
                    state.flightAncillaries.mealsSsr[
                        action.payload.index1
                    ].selectedMeals = [];
                }
                console.log("call");

                const selectedMealIndex = state.flightAncillaries?.mealsSsr[
                    action.payload.index1
                ]?.selectedMeals?.findIndex((ml) => {
                    return ml?.mealCode === action.payload?.value?.mealCode;
                });
                console.log("selected index", selectedMealIndex);

                if (action.payload.value1 === "add") {
                    console.log("call2");

                    if (selectedMealIndex !== -1) {
                        console.log("call4");
                        let baggage =
                            state.flightAncillaries.mealsSsr[
                                action.payload.index1
                            ].selectedMeals[selectedMealIndex];
                        baggage.count = (baggage?.count || 0) + 1;
                    } else {
                        console.log("call3");

                        state.flightAncillaries?.mealsSsr[
                            action.payload.index1
                        ]?.selectedMeals?.push({
                            ...action.payload?.value,
                            count: 1,
                        });
                    }
                } else if (action.payload.value1 === "substract") {
                    if (selectedMealIndex !== -1) {
                        let baggage =
                            state.flightAncillaries.mealsSsr[
                                action.payload.index1
                            ].selectedMeals[selectedMealIndex];

                        if (baggage?.count > 1) {
                            baggage.count = Math.max(
                                (baggage?.count || 0) - 1,
                                0
                            );
                        } else {
                            state.flightAncillaries.mealsSsr[
                                action.payload.index1
                            ].selectedMeals.splice(selectedMealIndex, 1);
                        }
                    }
                }
            } catch (e) {
                console.log(e);
            }
        },
        handlePassengerChange: (state, action) => {
            state.flightAncillaries.priceQuoteResponse.passengers[
                action.payload.index
            ][action.payload.name] = action.payload.value;
        },
        handleContactChange: (state, action) => {
            if (!state.flightAncillaries.priceQuoteResponse.contactDetails) {
                state.flightAncillaries.priceQuoteResponse.contactDetails = {};
            }
            state.flightAncillaries.priceQuoteResponse.contactDetails[
                action.payload.name
            ] = action.payload.value;
        },
        handleTotalChange: (state, action) => {
            console.log(action.payload, "payload");
            if (
                !state?.flightAncillaries[action.payload.name1][
                    action.payload.index1
                ]?.totalCount
            ) {
                state.flightAncillaries[action.payload.name1][
                    action.payload.index1
                ].totalCount = 0;
            }

            state.flightAncillaries[action.payload.name1][
                action.payload.index1
            ].totalCount = action.payload.value;
        },

        clearAllData: (state, action) => {
            state.flightAncillaries = {};
            state.singleFlightDetails = {};
        },
    },
});

export const {
    handleInitalDataChange,
    handleMealCountChange,
    handleDataChange,
    handleBagggageCountChange,
    handleSeatCountChange,
    handlePassengerChange,
    handleContactChange,
    handleTotalCountChange,
    handleTotalChange,
    clearAllData,
} = flightOrderSlice.actions;

export default flightOrderSlice.reducer;
