import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "../../axios";
import convertIsoDateToYMD from "../../utils/dateFormatter";

export const fetchPromotionInitialData = createAsyncThunk(
    "hotelContractForm/fetchPromotionInitialData",
    async (args, { getState }) => {
        const { jwtToken } = getState().admin;
        const response = await axios.get(`/hotels/promotion-data/${args.id}`, {
            headers: {
                authorization: `Bearer ${jwtToken}`,
            },
        });

        return response.data;
    }
);

export const fetchInitialDataWithPromotion = createAsyncThunk(
    "hotelPromotionsForm/fetchInitialDataWithPromotion",
    async (args, { getState }) => {
        const { jwtToken } = getState().admin;

        const req1 = axios.get(`/hotels/promotion-data/${args.id}`, {
            headers: {
                authorization: `Bearer ${jwtToken}`,
            },
        });
        const req2 = axios.get(`/hotels/promotions/single/${args.promotionId}`, {
            headers: { authorization: `Bearer ${jwtToken}` },
        });

        const promiseRes = await Promise.all([req1, req2]);

        return promiseRes;
    }
);

const initialState = {
    isPromotionLoading: true,
    roomTypes: [],
    contractGroups: [],
    promotions: [],
    boardTypes: [],
    markets: [],
    data: {
        promotionCode: "",
        name: "",
        sellFrom: "",
        sellTo: "",
        bookingWindowFrom: "",
        bookingWindowTo: "",
        priority: "",
        isCombinedPromotion: false,
        isDiscountAvailable: true,
        isStayPayAvailable: false,
        isMealUpgradeAvailable: false,
        isRoomTypeUpgradeAvailable: false,
        isActive: true,
        multipleStayPay: false,
        stayPayFreeOn: "cheapest",
        mealUpgradeOn: "both",
        contractGroups: [],
        combinedPromotions: [],
        // markets: [],
        specificNations: false,
        applicableNations: [],
        isFeatured: false,
        featuredNote: "",
        isApplicableForExtraBed: false,
        isApplicableForSupplement: false,
        applicableOnRatePromotion: false,
    },
    validDays: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    discounts: [
        {
            rateCode: "",
            fromDate: "",
            toDate: "",
            bookBefore: 1,
            boardTypes: [],
            minimumLengthOfStay: "1",
            maximumLengthOfStay: "999",
            discountType: "flat",
            roomTypes: [
                {
                    roomTypeId: "",
                    roomName: "",
                    roomOccupancies: [{ occupancyId: "", shortName: "", discount: "" }],
                },
            ],
        },
    ],
    initialRoomTypes: [],
    stayPays: [],
    roomTypeUpgrades: [],
    mealUpgrades: [],
    roomDiscounts: [],
    cancellationPolicies: [],
    excludedDates: [],
};

export const hotelPromotionsFormSlice = createSlice({
    name: "hotelPromotionsForm",
    initialState,
    reducers: {
        handlePromotionDataChange: (state, action) => {
            state.data[action.payload?.name] = action.payload?.value;
        },

        handleValidDaysChange: (state, action) => {
            const { value } = action.payload;

            if (state.validDays.includes(value)) {
                const updatedValidDay = state.validDays.filter((type) => type !== value);
                state.validDays = updatedValidDay;
            } else {
                state.validDays.push(value);
            }
        },

        addDiscountRows: (state, action) => {
            state.discounts.push({
                rateCode: "",
                fromDate: "",
                toDate: "",
                bookBefore: 1,
                boardTypes: [],
                minimumLengthOfStay: "1",
                maximumLengthOfStay: "999",
                discountType: "flat",
                roomTypes: state.initialRoomTypes,
            });
        },
        addRoomTypeToDiscounts: (state, action) => {
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
                        discount: "",
                    };

                    return roomOccupancy;
                }),
            };
            state.initialRoomTypes?.push(tempData);
            let tempDiscounts = state.discounts;
            for (let i = 0; i < tempDiscounts?.length; i++) {
                tempDiscounts[i]?.roomTypes?.push(tempData);
            }
            state.discounts = tempDiscounts;
        },
        removeRoomTypeFromDiscounts: (state, action) => {
            state.initialRoomTypes = state.initialRoomTypes?.filter((item) => {
                return item?.roomTypeId !== action?.payload;
            });
            let tempDiscounts = state.discounts;
            for (let i = 0; i < tempDiscounts?.length; i++) {
                tempDiscounts[i].roomTypes = tempDiscounts[i]?.roomTypes?.filter((item) => {
                    return item?.roomTypeId !== action?.payload;
                });
            }
            state.discounts = tempDiscounts;
        },
        handleDiscountRoomTypeDataChange: (state, action) => {
            const { index, roomTypeIndex, occupancyIndex, value } = action.payload;
            state.discounts[index].roomTypes[roomTypeIndex].roomOccupancies[
                occupancyIndex
            ].discount = value;
        },

        addStayPaysRows: (state, action) => {
            state.stayPays.push({
                rateCode: "",
                fromDate: "",
                toDate: "",
                bookBefore: 1,
                roomTypes: [],
                boardTypes: [],
                stayCount: "",
                freeCount: "",
            });
        },

        addRoomTypeUpgradesRows: (state, action) => {
            state.roomTypeUpgrades.push({
                rateCode: "",
                fromDate: "",
                toDate: "",
                bookBefore: 1,
                boardTypes: [],
                roomTypeFrom: "",
                roomTypeTo: "",
                minimumLengthOfStay: "1",
                maximumLengthOfStay: "999",
            });
        },

        addMealUpgradesRows: (state, action) => {
            state.mealUpgrades.push({
                rateCode: "",
                fromDate: "",
                toDate: "",
                bookBefore: 1,
                roomTypes: [],
                mealFrom: "",
                mealTo: "",
                minimumLengthOfStay: "1",
                maximumLengthOfStay: "999",
            });
        },

        addRoomDiscountsRows: (state, action) => {
            state.roomDiscounts.push({
                rateCode: "",
                fromDate: "",
                toDate: "",
                roomTypes: [],
                boardTypes: [],
                bookBefore: 1,
                roomCount: "",
                applicableTill: "",
                discountType: "",
                discount: "",
                minimumLengthOfStay: "1",
                maximumLengthOfStay: "999",
            });
        },

        addCancellationPoliciesRows: (state, action) => {
            state.cancellationPolicies.push({
                fromDate: "",
                toDate: "",
                roomTypes: [],
                daysBefore: "",
                cancellationChargeType: "flat",
                cancellationCharge: "",
            });
        },

        addExcludedDatesRows: (state, action) => {
            state.excludedDates.push({
                fromDate: "",
                toDate: "",
            });
        },

        handlePromotionRowDataChange: (state, action) => {
            const { typeName, index, name, value } = action.payload;
            state[typeName][index][name] = value;
        },

        deletePromotionItemRow: (state, action) => {
            const { index, name } = action.payload;
            state[name].splice(index, 1);
        },
        resetPromotionForm: (state) => {
            Object.assign(state, initialState);
        },
    },
    extraReducers: {
        [fetchPromotionInitialData.fulfilled]: (state, action) => {
            state.contractGroups = action.payload?.contractGroups;
            state.promotions = action.payload?.promotions;
            state.roomTypes = action.payload?.roomTypes;
            state.boardTypes = action.payload?.boardTypes;
            state.markets = action.payload?.markets;

            const initialRoomTypes = state.roomTypes
                ?.filter((item) => {
                    return item?.roomOccupancies?.length > 0;
                })
                ?.map((element) => {
                    const initialRoomOccupancies = element.roomOccupancies.map((ele) => {
                        const roomOccupancy = {
                            occupancyId: ele._id,
                            shortName: ele.shortName,
                            discount: "",
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
            state.discounts[0].roomTypes = initialRoomTypes;

            state.isPromotionLoading = false;
        },
        [fetchInitialDataWithPromotion.fulfilled]: (state, action) => {
            state.contractGroups = action.payload[0]?.data?.contractGroups;
            state.promotions = action.payload[0]?.data?.promotions;
            state.roomTypes = action.payload[0]?.data?.roomTypes;
            state.boardTypes = action.payload[0]?.data?.boardTypes;
            state.markets = action.payload[0]?.data?.markets;

            // const initialRoomTypes = state.roomTypes.map((element) => {
            //     const initialRoomOccupancies = element.roomOccupancies.map((ele) => {
            //         const roomOccupancy = {
            //             occupancyId: ele._id,
            //             shortName: ele.shortName,
            //             discount: "",
            //         };

            //         return roomOccupancy;
            //     });

            //     return {
            //         roomTypeId: element._id,
            //         roomName: element.roomName,
            //         roomOccupancies: initialRoomOccupancies,
            //     };
            // });

            // state.initialRoomTypes = initialRoomTypes;

            const {
                promotionCode,
                name,
                sellFrom,
                sellTo,
                priority,
                isCombinedPromotion,
                isDiscountAvailable,
                isStayPayAvailable,
                isMealUpgradeAvailable,
                isRoomTypeUpgradeAvailable,
                isActive,
                multipleStayPay,
                stayPayFreeOn,
                mealUpgradeOn,
                contractGroups,
                validDays,
                combinedPromotions,
                cancellationPolicies,
                excludedDates,
                roomDiscounts,
                discounts,
                stayPays,
                roomTypeUpgrades,
                mealUpgrades,
                bookingWindowFrom,
                bookingWindowTo,
                // markets,
                specificNations,
                applicableNations,
                isFeatured,
                featuredNote,
                isApplicableForExtraBed,
                isApplicableForSupplement,
                applicableOnRatePromotion,
            } = action.payload[1]?.data;

            state.data = {
                promotionCode: promotionCode || "",
                name: name || "",
                sellFrom: sellFrom ? convertIsoDateToYMD(sellFrom) : "",
                sellTo: sellTo ? convertIsoDateToYMD(sellTo) : "",
                bookingWindowFrom: bookingWindowFrom ? convertIsoDateToYMD(bookingWindowFrom) : "",
                bookingWindowTo: bookingWindowTo ? convertIsoDateToYMD(bookingWindowTo) : "",
                priority: priority || "",
                isCombinedPromotion,
                isDiscountAvailable,
                isStayPayAvailable,
                isMealUpgradeAvailable,
                isRoomTypeUpgradeAvailable,
                isActive: isActive,
                multipleStayPay,
                stayPayFreeOn: stayPayFreeOn || "cheapest",
                mealUpgradeOn: mealUpgradeOn || "both",
                contractGroups: contractGroups || [],
                combinedPromotions: combinedPromotions || [],
                // markets: markets || [],
                specificNations: specificNations || false,
                applicableNations: applicableNations || [],
                isFeatured,
                featuredNote: featuredNote || "",
                isApplicableForExtraBed: isApplicableForExtraBed || false,
                isApplicableForSupplement: isApplicableForSupplement || false,
                applicableOnRatePromotion: applicableOnRatePromotion || false,
            };

            state.validDays = validDays;

            const initialRoomTypes = discounts[0]?.roomTypes
                ?.filter((item) => {
                    const roomObjIndex = state.roomTypes?.findIndex((element) => {
                        return item?.roomTypeId === element?._id;
                    });

                    if (
                        roomObjIndex !== -1 &&
                        state.roomTypes[roomObjIndex]?.roomOccupancies?.length > 0
                    )
                        return item;
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
                            discount: "",
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

            let filteredDiscounts = discounts.map((discount) => {
                return {
                    rateCode: discount?.rateCode,
                    fromDate: convertIsoDateToYMD(discount.fromDate),
                    toDate: convertIsoDateToYMD(discount.toDate),
                    bookBefore: discount?.bookBefore,
                    boardTypes: discount?.boardTypes || [],
                    minimumLengthOfStay: discount?.minimumLengthOfStay,
                    maximumLengthOfStay: discount?.maximumLengthOfStay,
                    discountType: discount?.discountType || "flat",
                    roomTypes: discount.roomTypes.map((roomType) => {
                        return {
                            roomTypeId: roomType.roomTypeId,
                            roomOccupancies: roomType.roomOccupancies.map((occupancy) => {
                                return {
                                    occupancyId: occupancy.occupancyId,
                                    shortName: occupancy.shortName,
                                    discount: occupancy.discount,
                                };
                            }),
                        };
                    }),
                };
            });

            state.discounts = filteredDiscounts?.map((discount) => {
                let tempRoomTypes = initialRoomTypes;
                return {
                    ...discount,
                    roomTypes: tempRoomTypes?.map((roomType) => {
                        const roomTypeObjIndex = discount?.roomTypes?.findIndex((item) => {
                            return item?.roomTypeId === roomType?.roomTypeId;
                        });
                        if (roomTypeObjIndex !== -1) {
                            return {
                                ...roomType,
                                roomOccupancies: roomType?.roomOccupancies?.map((occupancy) => {
                                    const occupancyObjIndex = discount?.roomTypes[
                                        roomTypeObjIndex
                                    ]?.roomOccupancies?.findIndex((item) => {
                                        return item?.occupancyId === occupancy?.occupancyId;
                                    });

                                    if (occupancyObjIndex !== -1) {
                                        return {
                                            ...occupancy,
                                            discount:
                                                discount?.roomTypes[roomTypeObjIndex]
                                                    ?.roomOccupancies[occupancyObjIndex]?.discount,
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

            state.stayPays =
                stayPays?.map((stayPay) => ({
                    rateCode: stayPay.rateCode,
                    fromDate: stayPay.fromDate ? convertIsoDateToYMD(stayPay.fromDate) : "",
                    toDate: stayPay.toDate ? convertIsoDateToYMD(stayPay.toDate) : "",
                    bookBefore: stayPay.bookBefore,
                    roomTypes: stayPay.roomTypes,
                    boardTypes: stayPay.boardTypes,
                    stayCount: stayPay.stayCount,
                    freeCount: stayPay.freeCount,
                })) || [];

            state.roomTypeUpgrades =
                roomTypeUpgrades?.map((roomTypeUpgrade) => ({
                    rateCode: roomTypeUpgrade.rateCode,
                    fromDate: roomTypeUpgrade.fromDate
                        ? convertIsoDateToYMD(roomTypeUpgrade.fromDate)
                        : "",
                    toDate: roomTypeUpgrade.toDate
                        ? convertIsoDateToYMD(roomTypeUpgrade.toDate)
                        : "",
                    bookBefore: roomTypeUpgrade.bookBefore,
                    boardTypes: roomTypeUpgrade.boardTypes,
                    roomTypeFrom: roomTypeUpgrade.roomTypeFrom,
                    roomTypeTo: roomTypeUpgrade.roomTypeTo,
                    minimumLengthOfStay: roomTypeUpgrade.minimumLengthOfStay,
                    maximumLengthOfStay: roomTypeUpgrade.maximumLengthOfStay,
                })) || [];

            state.mealUpgrades =
                mealUpgrades?.map((mealUpgrade) => ({
                    rateCode: mealUpgrade.rateCode,
                    fromDate: mealUpgrade.fromDate ? convertIsoDateToYMD(mealUpgrade.fromDate) : "",
                    toDate: mealUpgrade.toDate ? convertIsoDateToYMD(mealUpgrade.toDate) : "",
                    bookBefore: mealUpgrade.bookBefore,
                    roomTypes: mealUpgrade.roomTypes,
                    mealFrom: mealUpgrade.mealFrom,
                    mealTo: mealUpgrade.mealTo,
                    minimumLengthOfStay: mealUpgrade.minimumLengthOfStay,
                    maximumLengthOfStay: mealUpgrade.maximumLengthOfStay,
                })) || [];

            state.roomDiscounts =
                roomDiscounts?.map((roomDiscount) => ({
                    rateCode: roomDiscount.rateCode,
                    fromDate: roomDiscount.fromDate
                        ? convertIsoDateToYMD(roomDiscount.fromDate)
                        : "",
                    toDate: roomDiscount.toDate ? convertIsoDateToYMD(roomDiscount.toDate) : "",
                    bookBefore: roomDiscount.bookBefore,
                    roomTypes: roomDiscount.roomTypes,
                    boardTypes: roomDiscount.boardTypes,
                    roomCount: roomDiscount.roomCount,
                    applicableTill: roomDiscount.applicableTill,
                    discountType: roomDiscount.discountType,
                    discount: roomDiscount.discount,
                    minimumLengthOfStay: roomDiscount.minimumLengthOfStay,
                    maximumLengthOfStay: roomDiscount.maximumLengthOfStay,
                })) || [];

            state.cancellationPolicies =
                cancellationPolicies?.map((policies) => ({
                    fromDate: policies.fromDate ? convertIsoDateToYMD(policies.fromDate) : "",
                    toDate: policies.toDate ? convertIsoDateToYMD(policies.toDate) : "",
                    roomTypes: policies?.roomTypes,
                    daysBefore: policies.daysBefore,
                    cancellationChargeType: policies.cancellationChargeType || "flat",
                    cancellationCharge: policies.cancellationCharge,
                })) || [];

            state.excludedDates =
                excludedDates?.map((dateRange) => ({
                    fromDate: dateRange.fromDate ? convertIsoDateToYMD(dateRange.fromDate) : "",
                    toDate: dateRange.toDate ? convertIsoDateToYMD(dateRange.toDate) : "",
                })) || [];

            state.isPromotionLoading = false;
        },
    },
});

export const {
    handlePromotionDataChange,
    handleValidDaysChange,
    addDiscountRows,
    addStayPaysRows,
    addMealUpgradesRows,
    addRoomDiscountsRows,
    addCancellationPoliciesRows,
    addExcludedDatesRows,
    addRoomTypeUpgradesRows,
    resetPromotionForm,
    handlePromotionRowDataChange,
    deletePromotionItemRow,
    addRoomTypeToDiscounts,
    removeRoomTypeFromDiscounts,
    handleDiscountRoomTypeDataChange,
} = hotelPromotionsFormSlice.actions;

export default hotelPromotionsFormSlice.reducer;
