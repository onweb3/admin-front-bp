import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "../../axios";
import convertIsoDateToYMD from "../../utils/dateFormatter";

export const fetchInitialData = createAsyncThunk(
    "hotelContractForm/fetchInitialData",
    async (args, { getState }) => {
        const { jwtToken } = getState().admin;
        const response = await axios.post(
            `/hotels/contract-data`,
            { hotelId: args.id, contractGroupId: args?.contractGroupId },
            {
                headers: {
                    authorization: `Bearer ${jwtToken}`,
                },
            }
        );

        return response?.data;
    }
);

export const fetchInitialDataWithContract = createAsyncThunk(
    "hotelContractForm/fetchInitialDataWithContract",
    async (args, { getState }) => {
        const { jwtToken } = getState().admin;
        const req1 = axios.post(
            `/hotels/contract-data`,
            { hotelId: args.id, contractGroupId: args?.contractGroupId },
            {
                headers: {
                    authorization: `Bearer ${jwtToken}`,
                },
            }
        );
        const req2 = await axios.get(`/hotels/contracts/single/${args.contractId}`, {
            headers: {
                authorization: `Bearer ${jwtToken}`,
            },
        });

        const promiseRes = await Promise.all([req1, req2]);

        return promiseRes;
    }
);

const initialState = {
    isContractLoading: true,
    data: {
        basePlan: "",
        rateName: "",
        rateCode: "",
        priority: "",
        sellFrom: "",
        sellTo: "",
        checkInTime: "12:00",
        checkOutTime: "14:00",
        isSpecialRate: false,
        parentContract: "",
        bookingWindowFrom: "",
        bookingWindowTo: "",
        isTourismFeeIncluded: false,
        inclusions: "",
        termsAndConditions: "",
        // markets: [],
        specificNations: false,
        applicableNations: [],
        isActive: true,
        applyPromotion: true,
    },
    contractStatus: "",
    roomTypes: [],
    boardTypes: [],
    markets: [],
    contracts: [],
    roomRates: [
        {
            rateCode: "",
            fromDate: "",
            toDate: "",
            validDays: [
                "sunday",
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
            ],
            minimumLengthOfStay: "1",
            maximumLengthOfStay: "999",
            roomTypes: [
                {
                    roomTypeId: "",
                    roomName: "",
                    roomOccupancies: [{ occupancyId: "", shortName: "", price: "" }],
                },
            ],
        },
    ],
    initialRoomTypes: [],
    mealSupplements: [
        {
            fromDate: "",
            toDate: "",
            boardType: "",
            roomTypes: [],
            adultPrice: "",
            childPrice: "",
            infantPrice: "",
        },
    ],
    cancellationPolicies: [
        {
            fromDate: "",
            toDate: "",
            roomTypes: [],
            daysBefore: "",
            cancellationType: "refundable",
            cancellationChargeType: "flat",
            cancellationCharge: "",
            requestCancelDaysBefore: "",
        },
    ],
    extraSupplements: [
        {
            fromDate: "",
            toDate: "",
            roomTypes: [],
            extraBedAdultPrice: "",
            extraBedChildPrice: "",
            isMealIncluded: true,
            exbMealPriceAdult: "",
            exbMealPriceChild: "",
        },
    ],
    childPolicies: [
        {
            fromDate: "",
            toDate: "",
            roomTypes: [],
            fromAge: "",
            toAge: "",
            policies: [
                {
                    paxCount: "",
                    beddingIclusive: true,
                    beddingCharge: "",
                    mealInclusive: true,
                    mealCharge: "",
                },
            ],
        },
    ],
    childMealPolicies: [
        {
            fromDate: "",
            toDate: "",
            roomTypes: [],
            boardTypes: [],
            fromAge: "",
            toAge: "",
            isFree: false,
            totalFreePax: "",
            isManualRate: false,
            rate: "",
        },
    ],
    excludedDates: [],
};

export const hotelContractFormSlice = createSlice({
    name: "hotelContractForm",
    initialState,
    reducers: {
        handleContractDataChange: (state, action) => {
            state.data[action.payload?.name] = action.payload?.value;
        },

        addRoomRatesRow: (state, action) => {
            state.roomRates.push({
                rateCode: "",
                fromDate: "",
                toDate: "",
                validDays: [
                    "sunday",
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                ],
                minimumLengthOfStay: "1",
                maximumLengthOfStay: "999",
                roomTypes: state.initialRoomTypes,
            });
        },

        deleteRoomRatesRow: (state, action) => {
            const { index } = action.payload;
            state.roomRates.splice(index, 1);
        },

        handleRoomRatesChange: (state, action) => {
            state.roomRates[action.payload?.index][action.payload?.name] = action.payload?.value;
        },

        roomRateValidDayChange: (state, action) => {
            const { index, value } = action.payload;

            const validDays = state.roomRates[index].validDays;

            if (validDays.includes(value)) {
                const updatedValidDay = validDays.filter((type) => type !== value);
                state.roomRates[index].validDays = updatedValidDay;
            } else {
                state.roomRates[index].validDays.push(value);
            }
        },

        handleRoomRateRoomTypeDataChange: (state, action) => {
            const { index, roomTypeIndex, occupancyIndex, value } = action.payload;
            state.roomRates[index].roomTypes[roomTypeIndex].roomOccupancies[occupancyIndex].price =
                value;
        },

        addMealRow: (state, action) => {
            state.mealSupplements.push({
                fromDate: "",
                toDate: "",
                boardType: "",
                roomTypes: [],
                adultPrice: "",
                childPrice: "",
                infantPrice: "",
            });
        },

        deleteMealRow: (state, action) => {
            const { index } = action.payload;
            state.mealSupplements.splice(index, 1);
        },

        handleMealSupplementDataChange: (state, action) => {
            state.mealSupplements[action.payload?.index][action.payload?.name] =
                action.payload?.value;
        },

        addExtraSupplementsRow: (state, action) => {
            state.extraSupplements.push({
                fromDate: "",
                toDate: "",
                roomTypes: [],
                extraBedAdultPrice: "",
                extraBedChildPrice: "",
                isMealIncluded: true,
                exbMealPriceAdult: "",
                exbMealPriceChild: "",
            });
        },

        deleteExtraSupplementsRow: (state, action) => {
            const { index } = action.payload;
            state.extraSupplements.splice(index, 1);
        },

        handleExtraSupplementDataChange: (state, action) => {
            state.extraSupplements[action.payload?.index][action.payload?.name] =
                action.payload?.value;
        },

        addChildPoliciesRow: (state, action) => {
            state.childPolicies.push({
                fromDate: "",
                toDate: "",
                roomTypes: [],
                fromAge: "",
                toAge: "",
                policies: [
                    {
                        paxCount: "",
                        beddingIclusive: true,
                        beddingCharge: "",
                        mealInclusive: true,
                        mealCharge: "",
                    },
                ],
            });
        },

        handleChildPolicyPoliciesChange: (state, action) => {
            const tempChildPolicies = state.childPolicies;
            tempChildPolicies[action.payload?.index].policies[action.payload?.policyIndex][
                action?.payload?.name
            ] = action.payload?.value;
            state.childPolicies = tempChildPolicies;
        },

        addChildPoliciesPolicyRow: (state, action) => {
            const tempChildPolicies = state.childPolicies;
            tempChildPolicies[action.payload?.index]?.policies?.push({
                paxCount: "",
                beddingIclusive: true,
                beddingCharge: "",
                mealInclusive: true,
                mealCharge: "",
            });
            state.childPolicies = tempChildPolicies;
        },

        removeChildPoliciesPolicyRow: (state, action) => {
            const tempChildPolicies = state.childPolicies;
            tempChildPolicies[action.payload?.index]?.policies?.splice(
                action.payload?.policyIndex,
                1
            );
            state.childPolicies = tempChildPolicies;
        },

        deleteChildPoliciesRow: (state, action) => {
            const { index } = action.payload;
            state.childPolicies.splice(index, 1);
        },

        handleChildPolicyDataChange: (state, action) => {
            state.childPolicies[action.payload?.index][action.payload?.name] =
                action.payload?.value;
        },

        addChildMealPoliciesRow: (state, action) => {
            state.childMealPolicies.push({
                fromDate: "",
                toDate: "",
                roomTypes: [],
                boardTypes: [],
                fromAge: "",
                toAge: "",
                isFree: false,
                totalFreePax: "",
                isManualRate: false,
                rate: "",
            });
        },

        deleteChildMealPoliciesRow: (state, action) => {
            const { index } = action.payload;
            state.childMealPolicies.splice(index, 1);
        },

        handleChildMealPolicyDataChange: (state, action) => {
            state.childMealPolicies[action.payload?.index][action.payload?.name] =
                action.payload?.value;
        },

        updateCheckBox: (state, action) => {
            state.childPolicies[action.payload?.index][action.payload?.name] =
                action.payload?.value;
        },

        addCancellationPoliciesRow: (state, action) => {
            state.cancellationPolicies.push({
                fromDate: "",
                toDate: "",
                roomTypes: [],
                daysBefore: "",
                cancellationType: "refundable",
                cancellationChargeType: "flat",
                cancellationCharge: "",
                requestCancelDaysBefore: "",
            });
        },

        deleteCancellationPoliciesRow: (state, action) => {
            const { index } = action.payload;
            state.cancellationPolicies.splice(index, 1);
        },

        handleCancellationPolicyDataChange: (state, action) => {
            state.cancellationPolicies[action.payload?.index][action.payload?.name] =
                action.payload?.value;
        },

        resetContractForm: (state) => {
            Object.assign(state, initialState);
        },

        approveHotelContract: (state, action) => {
            state.contractStatus = action.payload;
        },

        addRoomTypeToRateMaster: (state, action) => {
            const objIndex = state.roomTypes?.findIndex((item) => {
                return item?._id === action?.payload;
            });
            const tempData = {
                roomTypeId: state.roomTypes[objIndex]._id,
                roomName: state.roomTypes[objIndex].roomName,
                roomOccupancies: state.roomTypes[objIndex].roomOccupancies.map((ele) => {
                    const roomOccupancy = {
                        occupancyId: ele._id,
                        shortName: ele.shortName,
                        price: "",
                    };

                    return roomOccupancy;
                }),
            };
            state.initialRoomTypes?.push(tempData);
            let tempRoomRates = state.roomRates;
            for (let i = 0; i < tempRoomRates?.length; i++) {
                tempRoomRates[i]?.roomTypes?.push(tempData);
            }
            state.roomRates = tempRoomRates;
        },
        removeRoomTypeFromRateMaster: (state, action) => {
            state.initialRoomTypes = state.initialRoomTypes?.filter((item) => {
                return item?.roomTypeId !== action?.payload;
            });
            let tempRoomRates = state.roomRates;
            for (let i = 0; i < tempRoomRates?.length; i++) {
                tempRoomRates[i].roomTypes = tempRoomRates[i]?.roomTypes?.filter((item) => {
                    return item?.roomTypeId !== action?.payload;
                });
            }
            state.roomRates = tempRoomRates;
        },

        addContractExcludedDatesRows: (state, action) => {
            state.excludedDates.push({
                fromDate: "",
                toDate: "",
                roomTypes: [],
            });
        },
        deleteContractExcludedDatesRow: (state, action) => {
            const { index } = action.payload;
            state.excludedDates.splice(index, 1);
        },
        handleContractExcludedDatesDataChange: (state, action) => {
            state.excludedDates[action.payload?.index][action.payload?.name] =
                action.payload?.value;
        },
    },
    extraReducers: {
        [fetchInitialData.fulfilled]: (state, action) => {
            state.roomTypes = action.payload?.roomTypes;
            state.boardTypes = action.payload?.boardTypes;
            state.markets = action.payload?.markets;
            state.contracts = action.payload?.contracts;

            const initialRoomTypes = state.roomTypes
                ?.filter((item) => {
                    return item?.roomOccupancies?.length > 0;
                })
                ?.map((element) => {
                    const initialRoomOccupancies = element.roomOccupancies.map((ele) => {
                        const roomOccupancy = {
                            occupancyId: ele._id,
                            shortName: ele.shortName,
                            price: "",
                        };

                        return roomOccupancy;
                    });

                    return {
                        roomTypeId: element._id,
                        roomName: element.roomName,
                        roomOccupancies: initialRoomOccupancies,
                    };
                });

            state.initialRoomTypes = initialRoomTypes;
            state.roomRates[0].roomTypes = initialRoomTypes;
            state.isContractLoading = false;
        },
        [fetchInitialDataWithContract.fulfilled]: (state, action) => {
            state.roomTypes = action.payload[0]?.data?.roomTypes;
            state.boardTypes = action.payload[0]?.data?.boardTypes;
            state.markets = action.payload[0]?.data?.markets;
            state.contracts = action.payload[0]?.data?.contracts;

            const {
                basePlan,
                rateName,
                rateCode,
                checkInTime,
                checkOutTime,
                sellFrom,
                sellTo,
                priority,
                isSpecialRate,
                parentContract,
                bookingWindowFrom,
                bookingWindowTo,
                inclusions,
                specificNations,
                applicableNations,
                roomRates,
                mealSupplements,
                cancellationPolicies,
                extraSupplements,
                childPolicies,
                isTourismFeeIncluded,
                status,
                // markets,
                termsAndConditions,
                applyPromotion,
                excludedDates,
            } = action.payload[1]?.data;

            state.data = {
                basePlan,
                rateName,
                // markets: markets || [],
                rateCode,
                checkInTime,
                checkOutTime,
                sellFrom: sellFrom ? convertIsoDateToYMD(sellFrom) : "",
                sellTo: sellTo ? convertIsoDateToYMD(sellTo) : "",
                priority,
                isSpecialRate,
                parentContract: parentContract || "",
                bookingWindowFrom: bookingWindowFrom ? convertIsoDateToYMD(bookingWindowFrom) : "",
                bookingWindowTo: bookingWindowTo ? convertIsoDateToYMD(bookingWindowTo) : "",
                inclusions,
                termsAndConditions,
                isActive: status === "inactive" ? false : true,
                isTourismFeeIncluded: isTourismFeeIncluded ? isTourismFeeIncluded : false,
                specificNations: specificNations || false,
                applicableNations: applicableNations || [],
                applyPromotion: applyPromotion === false ? false : true,
            };
            state.contractStatus = status;

            const initialRoomTypes = roomRates[0]?.roomTypes
                ?.filter((item) => {
                    const roomObjIndex = state.roomTypes?.findIndex((element) => {
                        return item?.roomTypeId === element?._id;
                    });

                    if (
                        roomObjIndex !== -1 &&
                        state.roomTypes[roomObjIndex]?.roomOccupancies?.length > 0
                    ) {
                        return item;
                    }
                })
                ?.map((item) => {
                    const roomObjIndex = state.roomTypes?.findIndex((element) => {
                        return item?.roomTypeId === element?._id;
                    });

                    const initialRoomOccupancies = state.roomTypes[
                        roomObjIndex
                    ].roomOccupancies.map((ele) => {
                        const roomOccupancy = {
                            occupancyId: ele._id,
                            shortName: ele.shortName,
                            price: "",
                        };

                        return roomOccupancy;
                    });

                    return {
                        roomTypeId: item.roomTypeId,
                        roomName: state.roomTypes[roomObjIndex].roomName,
                        roomOccupancies: initialRoomOccupancies,
                    };
                });

            state.initialRoomTypes = initialRoomTypes;

            let filteredRoomRates = roomRates.map((rate) => {
                return {
                    rateCode: rate?.rateCode,
                    fromDate: rate.fromDate ? convertIsoDateToYMD(rate.fromDate) : "",
                    toDate: rate.toDate ? convertIsoDateToYMD(rate.toDate) : "",
                    validDays: rate.validDays,
                    minimumLengthOfStay: rate.minimumLengthOfStay,
                    maximumLengthOfStay: rate.maximumLengthOfStay,
                    roomTypes: rate.roomTypes.map((roomType) => {
                        return {
                            roomTypeId: roomType.roomTypeId,
                            roomOccupancies: roomType.roomOccupancies.map((occupancy) => {
                                return {
                                    occupancyId: occupancy.occupancyId,
                                    shortName: occupancy.shortName,
                                    price: occupancy.price,
                                };
                            }),
                        };
                    }),
                };
            });

            state.roomRates = filteredRoomRates?.map((rate) => {
                let tempRoomTypes = initialRoomTypes;
                return {
                    ...rate,
                    roomTypes: tempRoomTypes?.map((roomType) => {
                        const roomTypeObjIndex = rate?.roomTypes?.findIndex((item) => {
                            return item?.roomTypeId === roomType?.roomTypeId;
                        });
                        if (roomTypeObjIndex !== -1) {
                            return {
                                ...roomType,
                                roomOccupancies: roomType?.roomOccupancies?.map((occupancy) => {
                                    const occupancyObjIndex = rate?.roomTypes[
                                        roomTypeObjIndex
                                    ]?.roomOccupancies?.findIndex((item) => {
                                        return item?.occupancyId === occupancy?.occupancyId;
                                    });

                                    if (occupancyObjIndex !== -1) {
                                        return {
                                            ...occupancy,
                                            price: rate?.roomTypes[roomTypeObjIndex]
                                                ?.roomOccupancies[occupancyObjIndex]?.price,
                                        };
                                    }

                                    return occupancy;
                                }),
                            };
                        }

                        return roomType;
                    }),
                };
            });

            state.mealSupplements =
                mealSupplements.map((supplement) => {
                    return {
                        fromDate: supplement.fromDate
                            ? convertIsoDateToYMD(supplement.fromDate)
                            : "",
                        toDate: supplement.toDate ? convertIsoDateToYMD(supplement.toDate) : "",
                        boardType: supplement.boardType,
                        roomTypes: supplement.roomTypes,
                        adultPrice: supplement.adultPrice,
                        childPrice: supplement.childPrice,
                        infantPrice: supplement.infantPrice,
                    };
                }) || [];

            state.cancellationPolicies =
                cancellationPolicies.map((policy) => {
                    return {
                        fromDate: policy.fromDate ? convertIsoDateToYMD(policy.fromDate) : "",
                        toDate: policy.toDate ? convertIsoDateToYMD(policy.toDate) : "",
                        roomTypes: policy.roomTypes,
                        daysBefore: policy.daysBefore,
                        cancellationType: policy?.cancellationType || "refundable",
                        cancellationChargeType: policy.cancellationChargeType || "flat",
                        cancellationCharge: policy.cancellationCharge,
                        requestCancelDaysBefore: policy.requestCancelDaysBefore,
                    };
                }) || [];

            state.extraSupplements =
                extraSupplements.map((supplement) => {
                    return {
                        fromDate: supplement.fromDate
                            ? convertIsoDateToYMD(supplement.fromDate)
                            : "",
                        toDate: supplement.toDate ? convertIsoDateToYMD(supplement.toDate) : "",
                        roomTypes: supplement.roomTypes,
                        extraBedAdultPrice: supplement.extraBedAdultPrice,
                        extraBedChildPrice: supplement.extraBedChildPrice,
                        isMealIncluded: supplement?.isMealIncluded === false ? false : true,
                        exbMealPriceAdult: supplement.exbMealPriceAdult,
                        exbMealPriceChild: supplement.exbMealPriceChild,
                    };
                }) || [];

            state.childPolicies =
                childPolicies.map((policy) => {
                    return {
                        fromDate: policy.fromDate ? convertIsoDateToYMD(policy.fromDate) : "",
                        toDate: policy.toDate ? convertIsoDateToYMD(policy.toDate) : "",
                        roomTypes: policy.roomTypes,
                        fromAge: policy.fromAge,
                        toAge: policy.toAge,
                        policies: policy.policies,
                    };
                }) || [];

            state.excludedDates = excludedDates?.map((dateRange) => {
                return {
                    fromDate: dateRange.fromDate ? convertIsoDateToYMD(dateRange.fromDate) : "",
                    toDate: dateRange.toDate ? convertIsoDateToYMD(dateRange.toDate) : "",
                    roomTypes: dateRange?.roomTypes || [],
                };
            });

            // state.childMealPolicies = childMealPolicies.map((policy) => {
            //     return {
            //         fromDate: convertIsoDateToYMD(policy.fromDate),
            //         toDate: convertIsoDateToYMD(policy.toDate),
            //         roomTypes: policy.roomTypes,
            //         boardTypes: policy.boardTypes,
            //         fromAge: policy.fromAge,
            //         toAge: policy.toAge,
            //         isFree: policy.isFree,
            //         totalFreePax: policy.totalFreePax,
            //         isManualRate: policy.isManualRate,
            //         rate: policy.rate,
            //     };
            // }) || [];

            state.isContractLoading = false;
        },
    },
});

export const {
    handleContractDataChange,
    addMealRow,
    roomRateValidDayChange,
    deleteMealRow,
    handleRoomRateRoomTypeDataChange,
    handleMealSupplementDataChange,
    addExtraSupplementsRow,
    deleteExtraSupplementsRow,
    handleExtraSupplementDataChange,
    addChildPoliciesRow,
    deleteChildPoliciesRow,
    handleChildPolicyDataChange,
    updateCheckBox,
    addCancellationPoliciesRow,
    deleteCancellationPoliciesRow,
    handleCancellationPolicyDataChange,
    addRoomRatesRow,
    deleteRoomRatesRow,
    handleRoomRatesChange,
    addChildMealPoliciesRow,
    deleteChildMealPoliciesRow,
    handleChildMealPolicyDataChange,
    resetContractForm,
    approveHotelContract,
    addRoomTypeToRateMaster,
    removeRoomTypeFromRateMaster,
    addChildPoliciesPolicyRow,
    handleChildPolicyPoliciesChange,
    removeChildPoliciesPolicyRow,
    addContractExcludedDatesRows,
    deleteContractExcludedDatesRow,
    handleContractExcludedDatesDataChange,
} = hotelContractFormSlice.actions;

export default hotelContractFormSlice.reducer;
