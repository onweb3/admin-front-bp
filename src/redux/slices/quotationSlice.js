import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    places: [],
    excursions: [],
    airports: [],
    visas: [],
    hotels: [],
    cities: [],
    states: [],
    areas: [],
    roomTypes: [],
    isAlreadyBooked: false,
    transferQuotation: {
        transfers: [],
    },
    selectedReseller: {
        resellerId: "",
        resellerName: "",
    },
    paxType: "solo",
    isResellerDisabled: true,
    initialDataFetching: true,
    clientName: "Sir / Madam",
    noOfAdults: 1,
    noOfChildren: 0,
    checkInDate: "",
    checkOutDate: "",
    childrenAges: [],
    isArrivalAirportDisabled: false,
    arrivalAirport: "",
    arrivalAirportName: "",
    arrivalTerminalId: "",
    arrivalTerminalCode: "",
    isDepartureAirportDisabled: false,
    departureAirport: "",
    departureAirportName: "",
    departureTerminalId: "",
    departureTerminalCode: "",
    hotelQt: {
        totalPrice: 0,
        isTourismFeeIncluded: true,
        stays: [
            {
                hotels: [],
            },
        ],
    },
    isTourisumFeeIncluded: false,
    dateError: "",
    selectedExcursions: [],
    excursionTotalPrice: 0,
    selectedExcursionsIds: [],
    excursionTransferType: "all",
    selectedExcSupplements: [],
    excSupplementsTotalPrice: 0,
    selectedExcSupplementIds: [],
    isSupplimentQuotationDisabled: true,
    isVisaQuotationDisabled: true,
    excSupplementTransferType: "all",
    selectedVisa: {},
    selectedVisaNationality: "",
    otbPrice: "",
    isTransferQuotationDisabled: true,
    isHotelQuotationDisabled: true,
    isExcursionQuotationDisabled: true,
    quotationCurrency: "AED",
    hotelDisabledRemark: "",
    vehicleTypes: [
        {
            isVehicleChecked: false,
            vehicle: "",
            price: 0,
        },
    ],
    isCustomMarkup: false,
    customMarkupType: "flat",
    customMarkup: 0,
};

export const quotationsSlice = createSlice({
    name: "quotations",
    initialState,
    reducers: {
        setInititalData: (state, action) => {
            state.airports = action.payload?.airports;
            state.visas = action.payload?.visaCountry;
            state.initialDataFetching = false;
        },
        setInitialHotels: (state, action) => {
            state.stays = action.payload;
        },
        handleTransferChange: (state, action) => {
            state.transferQuotation.transfers = action.payload?.value;
        },
        handleAirportStatusChange: (state, action) => {
            state[action.payload?.name] = action.payload?.value;
        },
        handleAirportDataChange: (state, action) => {
            const [airportId, terminalId] = action.payload?.value.split("-");

            const selectedAirport = state.airports.find(
                (airport) =>
                    airport._id === airportId &&
                    airport.terminals._id === terminalId
            );

            if (selectedAirport) {
                console.log(selectedAirport, "selectedAirport");

                // const selectedTerminal = selectedAirport.terminals.find(
                //     (terminal) => terminal._id === terminalId
                // );

                console.log(airportId, terminalId, "airportId, terminalId");
                state[action.payload?.name] = airportId;
                state[action.payload?.name2] = selectedAirport?.airportName;
                state[action.payload?.name3] =
                    selectedAirport?.terminals.terminalCode;
                state[action.payload?.name4] = terminalId;
            }
        },
        addHotel: (state, action) => {
            state.hotelQt?.stays?.push({ hotels: [] });

            // state.transferQuotation.transfers?.push({ stays: [] });
            //     hotels: [
            //         {
            //             hotelId: "",
            //             hotelName: "",
            //             checkInDate: "",
            //             checkOutDate: "",
            //             placeName: "",
            //             starCategory: "",
            //             isBreakfastIncluded: false,
            //             isRefundable: false,
            //             roomTypeName: "",
            //             roomTypeId: "",
            //             roomOccupancies: [],
            //             availableRoomTypes: [],
            //             availableBoardTypes: [],
            //             hotelData: {},
            //         },
            //     ],
            // });
        },
        setTypesOfHotel: (state, action) => {
            state.hotelQt.stays[action.payload.stayIndex].hotels[
                action.payload.hotelIndex
            ][action.payload.name] = action.payload.value;
        },
        removeHotel: (state, action) => {
            const filteredHotels = state.hotelQt?.stays?.filter((_, index) => {
                return index !== action.payload;
            });
            state.hotelQt.stays = filteredHotels;
        },
        addNewMultiHotel: (state, action) => {
            state.hotelQt?.stays[action.payload]?.hotels?.push({
                hotelId: "",
                hotelName: "",
                checkInDate: "",
                checkOutDate: "",
                placeName: "",
                starCategory: "",
                isBreakfastIncluded: false,
                isRefundable: false,
                roomTypeName: "",
                roomTypeId: "",
                roomOccupancies: [],
                availableRoomTypes: [],
                availableBoardTypes: [],
                hotelData: {},
            });
        },
        handleHotelTransferChange: (state, action) => {
            state.hotelQt.stays[action.payload.stayIndex].hotels[
                action.payload.hotelIndex
            ].hotelTransfer[action.payload.name] = action.payload?.value;
        },
        removeMultiHotel: (state, action) => {
            const filteredStay = state.hotelQt?.stays[
                action.payload.stayIndex
            ]?.hotels?.filter((_, index) => {
                return index !== action.payload.hotelIndex;
            });

            state.hotelQt.stays[action.payload.stayIndex].hotels = filteredStay;
        },
        handleHotelQtDataChange: (state, action) => {
            state.hotelQt[action?.payload?.name] = action.payload?.value;
        },
        handleHotelsDataChange: (state, action) => {
            console.log(
                action.payload,
                state.hotelQt,
                action.payload?.hotelIndex,
                action.payload.edit,
                "hotelQt"
            );

            if (action.payload.edit === true) {
                console.log("calling edit");
                state.hotelQt.stays[action.payload?.stayIndex].hotels[
                    action.payload?.hotelIndex
                ] = action.payload.data;
            } else {
                console.log("calling else");

                state.hotelQt.stays[action.payload?.stayIndex].hotels.push(
                    action.payload.data
                );
            }
        },
        handleHotelsTransferDataChange: (state, action) => {
            console.log("called transfer data change");

            for (let i = 0; i < state.hotelQt.stays.length; i++) {
                let stay = state.hotelQt.stays[i];
                let stays = [];
                console.log(stay, "stay");

                for (let j = 0; j < stay.hotels.length; j++) {
                    console.log(stay.hotels, "stay.hotels");
                    if (state.isArrivalAirportDisabled === false && j === 0) {
                        stays.push({
                            transferFrom: state.arrivalAirport,
                            transferTo: stay.hotels[j]?.areaId,
                            transferToName: stay.hotels[j].hotelName,
                            transferFromName: state.arrivalAirportName,
                            transferType: "airport-city",
                            transferArrivalTerminalCode:
                                state.arrivalTerminalCode,
                            transferArrivalTerminalName: `Terminal ${state?.arrivalTerminalCode[1]}`,
                        });
                    }

                    if (j !== stay.hotels.length - 1) {
                        stays.push({
                            transferFrom: stay.hotels[j].areaId,
                            transferTo: stay.hotels[j + 1].areaId,
                            transferFromName: stay.hotels[j].hotelName,
                            transferToName: stay.hotels[j + 1].hotelName,
                            transferType: "city-city",
                        });
                    }

                    if (
                        state.isDepartureAirportDisabled === false &&
                        j === stay.hotels.length - 1
                    ) {
                        stays.push({
                            transferTo: state.departureAirport,
                            transferFrom: stay.hotels[j].areaId,
                            transferFromName: stay.hotels[j].hotelName,
                            transferToName: state.departureAirportName,
                            transferType: "city-airport",
                            transferDepartureTerminalCode:
                                state?.departureTerminalCode,
                            transferDepartureTerminalName: `Terminal ${state?.departureTerminalCode[1]}`,
                        });
                    }
                }

                state.transferQuotation.transfers.push({
                    stays,
                    stayNo: i + 1,
                });
            }
        },
        updateHotelBreakfastIncludedOrNot: (state, action) => {
            state.hotelQt.hotels[action.payload.hotelIndex].multiHotel[
                action.payload.stayIndex
            ].isBreakfastIncluded = action.payload.isBreakfastIncluded;
        },
        updateHotelIsRefundable: (state, action) => {
            state.hotelQt.hotels[action.payload.hotelIndex].multiHotel[
                action.payload.stayIndex
            ].isRefundable = action.payload.isRefundable;
        },
        updateIsTourismFeeIncluded: (state, action) => {
            state.hotelQt.isTourismFeeIncluded = action.payload;
        },
        handleRowItemChange: (state, action) => {
            state.hotelQt.stays[action.payload?.stayIndex].hotels[
                action.payload.hotelIndex
            ].roomOccupancies[action.payload.roomIndex].price =
                action.payload.value;
        },
        handleRoomOccupancyChange: (state, action) => {
            const roomOccupancyObjIndex = state.roomOccupancies?.findIndex(
                (obj) => obj._id === action.payload?.roomOccupancyId
            );
            if (roomOccupancyObjIndex !== -1) {
                let roomOccupancy =
                    state.roomOccupancies[roomOccupancyObjIndex];
                state.hotelQt.stays[action.payload?.stayIndex].roomRows[
                    action.payload.roomIndex
                ].roomOccupancyName = roomOccupancy?.roomOccupancyName;
                state.hotelQt.stays[action.payload?.stayIndex].roomRows[
                    action.payload.roomIndex
                ].noOfPersons = roomOccupancy?.noOfPersons;
                state.hotelQt.stays[action.payload?.stayIndex].roomRows[
                    action.payload.roomIndex
                ].roomOccupancyId = roomOccupancy?._id;
            }
        },
        handleNoOfAdultsChange: (state, action) => {
            state.noOfAdults = Number(action.payload);
        },
        handleNoOfChildrenChange: (state, action) => {
            state.noOfChildren = Number(action.payload);
            for (let i = 0; i < state.noOfChildren; i++) {
                state.childrenAges?.push("");
            }
            state.childrenAges = state.childrenAges?.slice(
                0,
                state.noOfChildren
            );
        },
        handleChildrenAgeChange: (state, action) => {
            if (!action.payload?.value) {
                state.childrenAges[action.payload?.index] = "";
            } else {
                state.childrenAges[action.payload?.index] =
                    action.payload.value;
            }
        },
        addExcusrsion: (state, action) => {
            if (action.payload) {
                console.log(action.payload, "payload");
                state.selectedExcursions.push({
                    excursionId: action?.payload?.excursion?.activityId,
                    excursionType: action?.payload?.excursion?.excursionType,
                    excursionName: action?.payload?.excursion?.activity?.name,
                    value:
                        action?.payload?.excursionTransferType === "all"
                            ? "ticket"
                            : action?.payload?.excursionTransferType,
                });
                state.selectedExcursionsIds.push(
                    action.payload?.excursion.activityId
                );

                state.excursions.push(action?.payload?.excursion);
            }
        },
        changeExcursionType: (state, action) => {
            const selectedExcursionIndex = state.selectedExcursions?.findIndex(
                (obj) => obj.excursionId === action.payload?._id
            );
            const excursionIndex = state.excursions?.findIndex(
                (obj) => obj.activityId === action.payload?._id
            );

            console.log(
                action.payload,
                selectedExcursionIndex,
                excursionIndex,
                action.payload?._id,
                "action.payload?"
            );

            if (selectedExcursionIndex !== -1 && excursionIndex !== -1) {
                state.selectedExcursions[selectedExcursionIndex].value =
                    action.payload?.value;

                let totalPax =
                    (!isNaN(state.noOfAdults) ? Number(state.noOfAdults) : 0) +
                    (!isNaN(state.noOfChildren)
                        ? Number(state.noOfChildren)
                        : 0);

                if (
                    state.selectedExcursions[selectedExcursionIndex]
                        ?.excursionType === "transfer" &&
                    action.payload?.value.toLowerCase() === "private"
                ) {
                    state.selectedExcursions[
                        selectedExcursionIndex
                    ].vehicleType = [];
                }

                if (
                    state.selectedExcursions[selectedExcursionIndex]
                        ?.excursionType === "ticket" &&
                    action.payload?.value.toLowerCase() === "private"
                ) {
                    state.selectedExcursions[
                        selectedExcursionIndex
                    ].vehicleType = [];
                    // state.excursions[excursionIndex].transferVehicleType;
                }
            }
        },
        changeExcursionTransferData: (state, action) => {
            console.log("call reached", action.payload);
            const selectedExcursionIndex = state.selectedExcursions?.findIndex(
                (obj) => obj.excursionId === action.payload?._id
            );
            if (selectedExcursionIndex !== -1) {
                const selectedVehicleIndex = state.selectedExcursions[
                    selectedExcursionIndex
                ].vehicleType.findIndex(
                    (obj) => obj.vehicle === action.payload?.vehicleId
                );

                if (
                    selectedVehicleIndex !== -1 &&
                    action.payload?.name2 === "count"
                ) {
                    state.selectedExcursions[selectedExcursionIndex][
                        action.payload?.name1
                    ][selectedVehicleIndex][action.payload?.name2] =
                        action.payload.value;
                } else if (
                    selectedVehicleIndex !== -1 &&
                    action.payload?.name2 === "vehicle"
                ) {
                    console.log(
                        selectedVehicleIndex,
                        selectedExcursionIndex,
                        "selectedExcursionIndex"
                    );
                    state.selectedExcursions[selectedExcursionIndex][
                        action.payload?.name1
                    ] = state.selectedExcursions[selectedExcursionIndex][
                        action.payload?.name1
                    ].filter((item) => {
                        return (
                            item[action.payload?.name2] !== action.payload.value
                        );
                    });
                } else if (
                    selectedVehicleIndex == -1 &&
                    action.payload?.name2 === "vehicle"
                ) {
                    state.selectedExcursions[selectedExcursionIndex][
                        action.payload?.name1
                    ].push({
                        [action.payload?.name2]: action.payload.value,
                        count: 1,
                        price: action.payload?.price,
                    });

                    console.log(
                        action.payload?.price,
                        " action.payload?.price,"
                    );
                }
            }
        },
        updateVehicleTransfer: (state, action) => {
            const selectedExcursionIndex = state.selectedExcursions?.findIndex(
                (obj) => obj.excursionId === action.payload?.excursionId
            );

            console.log(selectedExcursionIndex, "selectedExcursionIndex");
            if (selectedExcursionIndex !== -1) {
                state.selectedExcursions[selectedExcursionIndex].vehicleType =
                    action.payload?.vehicleType
                        .filter((item) => item.count > 0)
                        .map((item) => ({
                            count: item.count,
                            vehicle: item.vehicle,
                            price: item.price,
                        }));
            }
        },
        updateSupplVehicleTransfer: (state, action) => {
            const selectedExcursionIndex =
                state.selectedExcSupplements?.findIndex(
                    (obj) => obj.excursionId === action.payload?.excursionId
                );

            console.log(selectedExcursionIndex, "selectedExcursionIndex");
            if (selectedExcursionIndex !== -1) {
                state.selectedExcSupplements[
                    selectedExcursionIndex
                ].vehicleType = action.payload?.vehicleType
                    .filter((item) => item.count > 0)
                    .map((item) => ({
                        count: item.count,
                        vehicle: item.vehicle,
                        price: item.price,
                    }));
            }
        },
        changeExcursionPerPersonPrice: (state, action) => {
            for (let i = 0; i < state.selectedExcursions?.length; i++) {
                if (
                    state.selectedExcursions[i]?.excursionId ===
                    action.payload?._id
                ) {
                    state.selectedExcursions[i].perPersonAdultPrice =
                        action.payload?.perPersonAdultPrice;
                    state.selectedExcursions[i].perPersonChildPrice =
                        action.payload?.perPersonChildPrice;
                    break;
                }
            }
        },
        removeSelectedExcursion: (state, action) => {
            const filteredExcursions = state.selectedExcursions?.filter(
                (item) => {
                    return item?.excursionId !== action.payload;
                }
            );

            console.log(filteredExcursions, "filteredExcursions");
            state.selectedExcursions = filteredExcursions;
            const filteredIds = state.selectedExcursionsIds?.filter((id) => {
                return id !== action.payload;
            });
            console.log(filteredIds, "filteredIds");

            state.selectedExcursionsIds = filteredIds;
        },
        addExcSupplement: (state, action) => {
            if (action.payload) {
                state.selectedExcSupplements.push({
                    excursionId: action?.payload?.excursion?.activityId,
                    excursionType: action?.payload?.excursion?.excursionType,
                    excursionName: action?.payload?.excursion?.activity?.name,
                    value:
                        action?.payload?.excSupplementTransferType === "all"
                            ? "ticket"
                            : action.payload?.excSupplementTransferType,
                });
                state.selectedExcSupplementIds.push(
                    action.payload?.excursion?.activityId
                );
                state.excursions.push(action?.payload?.excursion);
            }
        },
        changeExcSupplementPerPersonPrice: (state, action) => {
            for (let i = 0; i < state.selectedExcSupplements?.length; i++) {
                if (
                    state.selectedExcSupplements[i]?.excursionId ===
                    action.payload?._id
                ) {
                    state.selectedExcSupplements[i].perPersonAdultPrice =
                        action.payload?.perPersonAdultPrice;
                    state.selectedExcSupplements[i].perPersonChildPrice =
                        action.payload?.perPersonChildPrice;
                    break;
                }
            }
        },
        changeExcSupplementTransferData: (state, action) => {
            console.log("changeExcSupplement");
            const selectedExcursionIndex =
                state.selectedExcSupplements?.findIndex(
                    (obj) => obj.excursionId === action.payload?._id
                );

            console.log(selectedExcursionIndex, "selectedExcursionIndex");
            if (selectedExcursionIndex !== -1) {
                const selectedVehicleIndex = state.selectedExcSupplements[
                    selectedExcursionIndex
                ].vehicleType.findIndex(
                    (obj) => obj.vehicle === action.payload?.vehicleId
                );

                if (
                    selectedVehicleIndex !== -1 &&
                    action.payload?.name2 === "count"
                ) {
                    state.selectedExcSupplements[selectedExcursionIndex][
                        action.payload?.name1
                    ][selectedVehicleIndex][action.payload?.name2] =
                        action.payload.value;

                    console.log(
                        selectedVehicleIndex,
                        action.payload?.name2,
                        "selectedVehicleIndex",
                        action.payload.value
                    );
                } else if (
                    selectedVehicleIndex !== -1 &&
                    action.payload?.name2 === "vehicle"
                ) {
                    console.log(
                        selectedVehicleIndex,
                        selectedExcursionIndex,
                        "selectedExcursionIndex"
                    );
                    state.selectedExcSupplements[selectedExcursionIndex][
                        action.payload?.name1
                    ] = state.selectedExcSupplements[selectedExcursionIndex][
                        action.payload?.name1
                    ].filter((item) => {
                        return (
                            item[action.payload?.name2] !== action.payload.value
                        );
                    });
                } else if (
                    selectedVehicleIndex == -1 &&
                    action.payload?.name2 === "vehicle"
                ) {
                    state.selectedExcSupplements[selectedExcursionIndex][
                        action.payload?.name1
                    ].push({
                        [action.payload?.name2]: action.payload.value,
                        count: 1,
                        price: action.payload?.price,
                    });

                    console.log(
                        action.payload?.price,
                        " action.payload?.price,"
                    );
                }
            }
        },
        changeExcSupplementType: (state, action) => {
            const selectedExcursionIndex =
                state.selectedExcSupplements?.findIndex(
                    (obj) => obj.excursionId === action.payload?._id
                );
            const excursionIndex = state.excursions?.findIndex(
                (obj) => obj.activityId === action.payload?._id
            );

            console.log(
                selectedExcursionIndex,
                excursionIndex,
                action.payload,
                "cahngeExecsuppl"
            );
            if (selectedExcursionIndex !== -1 && excursionIndex !== -1) {
                state.selectedExcSupplements[selectedExcursionIndex].value =
                    action.payload?.value;

                let totalPax =
                    (!isNaN(state.noOfAdults) ? Number(state.noOfAdults) : 0) +
                    (!isNaN(state.noOfChildren)
                        ? Number(state.noOfChildren)
                        : 0);

                if (
                    state.selectedExcSupplements[selectedExcursionIndex]
                        ?.excursionType === "transfer" &&
                    action.payload?.value === "private"
                ) {
                    state.selectedExcSupplements[
                        selectedExcursionIndex
                    ].vehicleType = [];
                }

                if (
                    state.selectedExcSupplements[selectedExcursionIndex]
                        ?.excursionType === "ticket" &&
                    action.payload?.value === "private"
                ) {
                    state.selectedExcSupplements[
                        selectedExcursionIndex
                    ].vehicleType = [];
                }
            }
        },
        removeSelectedExcSupplement: (state, action) => {
            const filteredExcursions = state.selectedExcSupplements?.filter(
                (item) => {
                    return item?.excursionId !== action.payload;
                }
            );
            state.selectedExcSupplements = filteredExcursions;
            const filteredIds = state.selectedExcSupplementIds?.filter((id) => {
                return id !== action.payload;
            });
            state.selectedExcSupplementIds = filteredIds;
        },
        updateIsTransferQuotationDisabled: (state, action) => {
            state.isTransferQuotationDisabled = action.payload;
        },
        updateIsHotelQuotationDisabled: (state, action) => {
            state.isHotelQuotationDisabled = action.payload;
        },
        updateSelectedVisa: (state, action) => {
            // console.log(action.payload, "payloadpayload");
            // if (Object.keys(action.payload).length < 1) {
            //     state.selectedVisa = {};
            // } else {
            //     let visa = { ...action.payload };
            //     visa.visaId = action.payload?._id;
            state.selectedVisa = action.payload?.visaId;
            // }
        },
        handleQuotationCurrencyChange: (state, action) => {
            state.quotationCurrency = action.payload;
        },
        handleMarkupChange: (state, action) => {
            state.customMarkup = action.payload;
        },
        handleMarkupTypeChange: (state, action) => {
            state.customMarkupType = action.payload;
        },
        setQuotationData: (state, action) => {
            state.clientName =
                action.payload?.amendment?.clientName || "Sir / Madam";
            state.paxType = action.payload?.amendment?.paxType;
            state.noOfAdults = action.payload?.amendment?.noOfAdults;
            state.noOfChildren = action.payload?.amendment?.noOfChildren;
            state.childrenAges = action.payload?.amendment?.childrenAges
                ? action.payload?.amendment?.childrenAges
                : [];
            state.checkInDate = action.payload?.amendment?.checkInDate;
            state.checkOutDate = action.payload?.amendment?.checkOutDate;
            state.isDepartureAirportDisabled =
                action.payload?.amendment?.isDepartureAirportDisabled;
            state.departureAirport =
                action.payload?.amendment?.departureAirport;
            state.arrivalAirport = action.payload?.amendment?.arrivalAirport;
            state.arrivalAirportName =
                action.payload?.amendment?.arrivalAirportName;
            state.departureAirportName =
                action.payload?.amendment?.departureAirportName;
            state.arrivalTerminalCode =
                action.payload?.amendment?.arrivalTerminalCode;
            state.arrivalTerminalId =
                action.payload?.amendment?.arrivalTerminalId;

            state.departureTerminalId =
                action.payload?.amendment?.departureTerminalId;
            state.departureTerminalCode =
                action.payload?.amendment?.departureTerminalCode;
            state.isArrivalAirportDisabled =
                action.payload?.amendment?.isArrivalAirportDisabled;
            state.isTourisumFeeIncluded =
                action.payload?.amendment?.isTourisumFeeIncluded || false;
            // if (action.payload?.amendment?.transferQuotation) {
            //     state.transfer = action.payload?.amendment?.transferQuotation;
            // }
            state.isAlreadyBooked = action.payload?.amendment?.isAlreadyBooked;

            state.isTransferQuotationDisabled =
                action.payload?.amendment?.isTransferQuotationDisabled;
            state.transferQuotation.transfers =
                action.payload?.amendment?.transferQuotation || [];
            state.isHotelQuotationDisabled =
                action.payload?.amendment?.isHotelQuotationDisabled;

            state.isExcursionQuotationDisabled =
                action.payload?.amendment?.isExcursionQuotationDisabled;
            state.isSupplimentQuotationDisabled =
                action.payload?.amendment?.isSupplimentQuotationDisabled;
            state.isVisaQuotationDisabled =
                action.payload?.amendment?.isVisaQuotationDisabled;
            state.excursions = action.payload?.amendment?.excursions;
            if (action.payload?.amendment?.hotelQuotation) {
                state.hotelQt = action.payload?.amendment?.hotelQuotation;
            } else {
                state.hotelDisabledRemark =
                    action.payload?.amendment?.hotelDisabledRemark || "";
            }

            if (action.payload?.amendment?.excursionQuotation) {
                state.selectedExcursions =
                    action.payload?.amendment?.excursionQuotation?.excursions;
                state.selectedExcursionsIds =
                    action.payload?.amendment?.excursionQuotation?.excursions?.map(
                        (exc) => {
                            return exc?.excursionId;
                        }
                    );
            }

            if (action.payload?.amendment?.excSupplementQuotation) {
                state.selectedExcSupplements =
                    action.payload?.amendment?.excSupplementQuotation?.excursions;
                state.selectedExcSupplementIds =
                    action.payload?.amendment?.excSupplementQuotation?.excursions?.map(
                        (exc) => {
                            return exc?.excursionId;
                        }
                    );
            }

            if (action.payload?.amendment?.visa) {
                state.selectedVisa = action.payload?.amendment?.visa;
                state.selectedVisa.price =
                    action.payload?.amendment?.visa?.price || "";
                state.otbPrice =
                    action.payload?.amendment?.visa?.otbPrice || "";
                state.selectedVisaNationality =
                    action.payload?.amendment?.visa?.nationality;
            }
            state.selectedVisa = action.payload?.amendment?.visa?.visaId;
            // state.transferQuotation =
            //     action.payload?.amendment?.transferQuotation;
            state.markup = action?.payload?.amendment?.markup;
            state.markupType = action?.payload?.amendment?.markupType;
            state.quotationCurrency =
                action?.payload?.amendment?.quotationCurrency;

            state.selectedReseller.resellerId =
                action?.payload?.amendment?.reseller?._id;
            state.selectedReseller.resellerName =
                action?.payload?.amendment?.reseller?.companyName;
            state.isResellerDisabled =
                action?.payload?.amendment?.isResellerDisabled;
            state.isCustomMarkup = action?.payload?.amendment?.isCustomMarkup;
            if (action?.payload?.amendment?.customMarkup) {
                state.customMarkup = action?.payload?.amendment?.customMarkup;
                state.customMarkupType =
                    action?.payload?.amendment?.customMarkupType;
            }
        },
        setExcursionsTotalPrice: (state, action) => {
            state.excursionTotalPrice = action.payload;
        },
        changeSelectedHotel: (state, action) => {
            state.hotelQt.hotels[action.payload?.hotelIndex].multiHotel[
                action.payload.stayIndex
            ].hotelName = action.payload?.hotel?.hotelName;
            state.hotelQt.hotels[action.payload?.hotelIndex].multiHotel[
                action.payload.stayIndex
            ].placeName = action.payload?.hotel?.city?.cityName;
            state.hotelQt.hotels[action.payload?.hotelIndex].multiHotel[
                action.payload.stayIndex
            ].starCategory = action.payload?.hotel?.starCategory;
            state.hotelQt.hotels[action.payload?.hotelIndex].multiHotel[
                action.payload.stayIndex
            ].hotelId = action.payload?.hotel?._id;
            state.hotelQt.hotels[action.payload?.hotelIndex].multiHotel[
                action.payload.stayIndex
            ].roomTypeName =
                action?.payload?.hotel?.defaultRoomType?.roomTypeName || "";
        },
        setDateError: (state, action) => {
            state.dateError = action.payload;
        },
        handleCheckInChange: (state, action) => {
            state.checkInDate = action.payload;
        },
        handleCheckOutChange: (state, action) => {
            state.checkOutDate = action.payload;
        },
        handleOkToBoardChange: (state, action) => {
            state.otbPrice = action.payload;
        },
        handleHotelDisabledRemarkChange: (state, action) => {
            state.hotelDisabledRemark = action.payload;
        },
        handleExcursionTypeChange: (state, action) => {
            state.excursionTransferType = action.payload;
        },
        handleExcSupplementTransferTypeChange: (state, action) => {
            state.excSupplementTransferType = action.payload;
        },
        clearAllQtnData: (state, action) => {
            state.clientName = "Sir / Madam";
            state.noOfAdults = 1;
            state.noOfChildren = 0;
            state.checkInDate = "";
            state.checkOutDate = "";
            state.childrenAges = [];
            state.paxType = "solo";
            state.selectedReseller = {};
            state.isArrivalAirportDisabled = true;
            state.arrivalAirport = "";
            state.arrivalAirportName = "";
            state.isDepartureAirportDisabled = true;
            state.departureAirport = "";
            state.departureAirportName = "";
            state.isAlreadyBooked = false;
            state.transferQuotation = {
                transfers: [],
            };
            state.hotelQt = {
                stays: [
                    {
                        hotels: [],
                    },
                ],
            };
            state.dateError = "";
            state.selectedExcursions = [];
            state.excursionTotalPrice = 0;
            state.selectedExcursionsIds = [];
            state.excursionTransferType = "all";
            state.selectedExcSupplements = [];
            state.excSupplementsTotalPrice = 0;
            state.selectedExcSupplementIds = [];
            state.excSupplementTransferType = "all";
            state.selectedVisa = {};
            state.otbPrice = "";
            state.isTransferQuotationDisabled = true;
            state.isHotelQuotationDisabled = true;
            state.isVisaQuotationDisabled = true;
            state.isExcursionQuotationDisabled = true;
            state.isSupplimentQuotationDisabled = true;
            state.quotationCurrency = "AED";

            state.hotelDisabledRemark = "";
            state.isCustomMarkup = false;
            state.customMarkup = 0;
            state.customMarkupType = "flat";
        },
        handleClientNameChange: (state, action) => {
            state.clientName = action.payload;
        },
        handleTransferCheckChange: (state, action) => {
            let selectedTransferIndex =
                state.transferQuotation.transfers.findIndex((stayTf) => {
                    return (
                        Number(stayTf.stayNo) ===
                        Number(action.payload.stayIndex) + 1
                    );
                });

            if (selectedTransferIndex !== -1) {
                let selectedStayIndex = state.transferQuotation.transfers[
                    selectedTransferIndex
                ].stays.findIndex((stay) => {
                    return (
                        stay.transferFrom.toString() ===
                            action.payload.data.transferFrom.toString() &&
                        stay.transferTo.toString() ===
                            action.payload.data.transferTo.toString()
                    );
                });

                console.log(selectedStayIndex, "selectedStayIndex");

                if (selectedStayIndex !== -1) {
                    let selectedVehilceTypeIndex =
                        state?.transferQuotation?.transfers?.[
                            selectedTransferIndex
                        ]?.stays?.[selectedStayIndex]?.vehicleTypes?.findIndex(
                            (vt) => {
                                return (
                                    vt?.vehicle?.toString() ===
                                    action?.payload?.veh?.vehicle?._id.toString()
                                );
                            }
                        );

                    console.log(
                        selectedVehilceTypeIndex,
                        "selectedVehilceType"
                    );

                    if (selectedVehilceTypeIndex >= 0) {
                        if (selectedVehilceTypeIndex !== -1) {
                            console.log("Adding vehicle type 1");

                            state.transferQuotation.transfers[
                                selectedTransferIndex
                            ].stays[selectedStayIndex].vehicleTypes.splice(
                                selectedVehilceTypeIndex,
                                1
                            );
                        } else {
                            // Check if vehicleTypes array exists, otherwise initialize it as an empty array

                            console.log("Adding vehicle type 2");

                            // Push a new object into the vehicleTypes array
                            state.transferQuotation.transfers[
                                selectedTransferIndex
                            ].stays[selectedStayIndex].vehicleTypes.push({
                                vehicle: action.payload.veh.vehicle._id,
                                count: 1,
                                vehicleName: action.payload.veh.vehicle.name,
                            });
                        }
                    } else {
                        console.log("Adding vehicle type 3");
                        if (
                            !state?.transferQuotation?.transfers?.[
                                selectedTransferIndex
                            ]?.stays?.[selectedStayIndex]?.vehicleTypes
                        ) {
                            state.transferQuotation.transfers[
                                selectedTransferIndex
                            ].stays[selectedStayIndex].vehicleTypes = [];
                        }

                        state.transferQuotation.transfers[
                            selectedTransferIndex
                        ].stays[selectedStayIndex].vehicleTypes.push({
                            vehicle: action.payload.veh.vehicle._id,
                            count: 1,
                            vehicleName: action.payload.veh.vehicle.name,
                        });
                    }
                } else {
                    state.transferQuotation.transfers[
                        selectedTransferIndex
                    ].stays.push({
                        transferFrom: action.payload.data.transferFrom,
                        transferTo: action.payload.data.transferTo,
                        transferType: action.payload.data.transferType,
                        vehicleTypes: [
                            {
                                vehicle: action.payload.veh.vehicle._id,
                                count: 1,
                                vehicleName: action.payload.veh.vehicle.name,
                            },
                        ],
                    });
                }
            } else {
                state.transferQuotation.transfers.push({
                    stays: [
                        {
                            transferFrom: action.payload.data.transferFrom,
                            transferTo: action.payload.data.transferTo,
                            transferType: action.payload.data.transferType,
                            vehicleTypes: [
                                {
                                    vehicle: action.payload.veh.vehicle._id,
                                    count: 1,
                                    vehicleName:
                                        action.payload.veh.vehicle.name,
                                },
                            ],
                        },
                    ],
                    stayNo: action.payload.stayIndex + 1,
                });
            }
        },
        handleIsAddTransferDataChange: (state, action) => {
            let selectedTransferIndex =
                state?.transferQuotation?.transfers?.findIndex((stayTf) => {
                    return (
                        Number(stayTf?.stayNo) ===
                        Number(action?.payload?.stayIndex) + 1
                    );
                });

            if (selectedTransferIndex !== -1) {
                let selectedStayIndex = state?.transferQuotation?.transfers[
                    selectedTransferIndex
                ].stays.findIndex((stay) => {
                    return (
                        stay?.transferFrom?.toString() ===
                            action?.payload?.data?.transferFrom?.toString() &&
                        stay?.transferTo?.toString() ===
                            action.payload.data?.transferTo?.toString()
                    );
                });

                if (selectedStayIndex !== -1) {
                    console.log(
                        "Selected transfer",
                        selectedStayIndex,
                        "selectedStayIndex"
                    );
                    state.transferQuotation.transfers[
                        selectedTransferIndex
                    ].stays[selectedStayIndex].isAddTransfer =
                        action.payload?.value;
                }
            }
        },
        handleTransferCountChange: (state, action) => {
            let selectedTransferIndex =
                state.transferQuotation.transfers.findIndex((stayTf) => {
                    return (
                        Number(stayTf.stayNo) ===
                        Number(action.payload.stayIndex) + 1
                    );
                });

            if (selectedTransferIndex !== -1) {
                let selectedStayIndex = state.transferQuotation.transfers[
                    selectedTransferIndex
                ].stays.findIndex((stay) => {
                    return (
                        stay.transferFrom.toString() ===
                            action.payload.data.transferFrom.toString() &&
                        stay.transferTo.toString() ===
                            action.payload.data.transferTo.toString()
                    );
                });

                if (selectedStayIndex !== -1) {
                    let selectedVehilceTypeIndex =
                        state.transferQuotation.transfers[
                            selectedTransferIndex
                        ].stays[selectedStayIndex].vehicleTypes?.findIndex(
                            (vt) => {
                                return (
                                    vt?.vehicle.toString() ===
                                    action?.payload?.veh?.vehicle?._id.toString()
                                );
                            }
                        );

                    if (selectedVehilceTypeIndex !== -1) {
                        state.transferQuotation.transfers[
                            selectedTransferIndex
                        ].stays[selectedStayIndex].vehicleTypes[
                            selectedVehilceTypeIndex
                        ].count = action?.payload?.count;
                    }
                }
            }
        },

        handleTransferInitalData: (state, action) => {
            let selectedTransferIndex = state.transfers.findIndex((stayTf) => {
                return (
                    Number(stayTf.stayNo) ===
                    Number(action.payload.stayTransfer?.stayNo)
                );
            });

            if (selectedTransferIndex !== -1) {
                state.transfers[selectedTransferIndex].stays.push({
                    transferFrom: action.payload.transfer.transferFrom,
                    transferTo: action.payload.transfer.transferTo,
                    transferType: action.payload.transfer.transferType,
                    vehicleTypes: action.payload.vehicleType,
                });
            } else {
                state.transfers.push({
                    stays: [
                        {
                            transferFrom: action.payload.transfer.transferFrom,
                            transferTo: action.payload.transfer.transferTo,
                            transferType: action.payload.transfer.transferType,
                            vehicleTypes: action.payload.vehicleType,
                        },
                    ],
                    stayNo: action.payload.stayIndex + 1,
                });
            }
        },
        handleQuotationDisableChange: (state, action) => {
            state[action.payload.name] = action.payload.value;
        },
        clearTransferDetails: (state, action) => {
            state.transferQuotation.transfers = [];
        },
        clearHotelDetails: (state, action) => {
            console.log("called clear hotel");
            state.hotelQt.stays[0].hotels = [];
        },
        addEnquiry: (state, action) => {
            state.locality = action.payload.locality;
            state.fromDate = action.payload.fromDate;
            state.toDate = action.payload.toDate;
            state.suggestionType = action.payload.suggestionType;
        },
        handleChangeReseller: (state, action) => {
            state.selectedReseller.resellerId = action.payload.resellerId;
            state.selectedReseller.resellerName = action.payload.resellerName;
        },
        handleTransferClear: (state, action) => {
            state.transferQuotation.transfers = [];
        },
        handleTransferInitalCount: (state, action) => {
            const { transferIndex, stayIndex, vehicles } = action.payload;

            const selectedTransfer =
                state.transferQuotation.transfers[transferIndex]?.stays?.[
                    stayIndex
                ];

            console.log(selectedTransfer, "SELECTED");
            console.log(vehicles, "vehicles");

            if (selectedTransfer) {
                let filteredVeh = vehicles.map((vh) => {
                    if (vh.count > 0) {
                        return {
                            vehicle: vh.vehicle._id,
                            count: vh.count,
                        };
                    }
                });

                // Remove any undefined elements from the filteredVeh array
                filteredVeh = filteredVeh.filter((vh) => vh !== undefined);

                console.log(filteredVeh, "FIL");

                selectedTransfer.vehicleTypes = filteredVeh;
            } else {
                // Handle the case when selectedTransfer is undefined
                // Add your logic here
            }
        },
        setVehicleCountEdit: (state, action) => {
            const { transferIndex, stayIndex, vehicle } = action.payload;

            state.transfers[transferIndex].stays[stayIndex].vehicleTypes =
                vehicle;
        },
        setHandlePaxTypeChange: (state, action) => {
            state.paxType = action.payload.value;

            if (action.payload.value === "solo") {
                state.noOfAdults = 1;
                state.noOfChildren = 0;
            }

            if (action.payload.value === "couple") {
                state.noOfAdults = 2;
                state.noOfChildren = 0;
            }

            if (action.payload.value === "family") {
                state.noOfAdults = 2;
                state.noOfChildren = 0;
            }
            if (action.payload.value === "friends") {
                state.noOfAdults = 3;
                state.noOfChildren = 0;
            }
        },
        updateSelectedVisNationality: (state, action) => {
            state.selectedVisaNationality = action.payload;
        },
        handleCustomMarkupChange: (state, action) => {
            state.isCustomMarkup = action.payload.value;
        },
        handleHotelCustomMarkupChange: (state, action) => {
            const { stayIndex, hotelIndex, value } = action.payload;
            state.hotelQt.stays[stayIndex].hotels[
                hotelIndex
            ].isCustomHotelMarkup = value;
        },
        handleRoomTypeChange: (state, action) => {
            const { stayIndex, hotelIndex, name, value } = action.payload;

            const roomOccupancies =
                state.hotelQt.stays[stayIndex].hotels[hotelIndex]
                    .roomOccupancies;

            for (let i = 0; i < roomOccupancies.length; i++) {
                if (roomOccupancies[i].occupancyShortName === name) {
                    roomOccupancies[i].price = value;
                    break; // Exit the loop once the match is found
                }
            }
        },
        handleRoomOccupancy: (state, action) => {
            const { stayIndex, hotelIndex, name, value } = action.payload;

            state.hotelQt.stays[stayIndex].hotels[hotelIndex].roomOccupancies =
                value;
        },
    },
});

export const {
    setInititalData,
    handleTransferChange,
    handleRowItemChange,
    addExcusrsion,
    removeSelectedExcursion,
    addHotel,
    removeHotel,
    handleRoomOccupancyChange,
    handleHotelQtDataChange,
    handleHotelsDataChange,
    updateIsTransferQuotationDisabled,
    updateIsHotelQuotationDisabled,
    updateSelectedVisa,
    setQuotationData,
    changeExcursionType,
    handleQuotationCurrencyChange,
    handleMarkupChange,
    handleMarkupTypeChange,
    handleTourismFeeIncludedChange,
    setExcursionsTotalPrice,
    changeSelectedHotel,
    handleNoOfAdultsChange,
    handleChildrenAgeChange,
    handleNoOfChildrenChange,
    setDateError,
    updateHotelBreakfastIncludedOrNot,
    updateHotelIsRefundable,
    handleCheckInChange,
    handleCheckOutChange,
    handleOkToBoardChange,
    handleHotelDisabledRemarkChange,
    updateIsTourismFeeIncluded,
    handleExcursionTypeChange,
    changeExcursionPerPersonPrice,
    clearAllQtnData,
    handleClientNameChange,
    changeExcursionTransferData,
    addExcSupplement,
    handleExcSupplementTransferTypeChange,
    changeExcSupplementPerPersonPrice,
    changeExcSupplementTransferData,
    changeExcSupplementType,
    removeSelectedExcSupplement,
    addNewMultiHotel,
    removeMultiHotel,
    handleHotelTransferChange,
    setInitialHotels,
    setTypesOfHotel,
    handleAirportStatusChange,
    handleAirportDataChange,
    isArrivalAirport,
    isDepartureAirport,
    handleTransferCheckChange,
    handleTransferCountChange,
    handleTransferInitalData,
    handleQuotationDisableChange,
    clearTransferDetails,
    clearHotelDetails,
    addEnquiry,
    handleChangeReseller,
    handleHotelsTransferDataChange,
    handleArrivalAirportTransferChange,
    handleTransferClear,
    handleTransferInitalCount,
    setVehicleCountEdit,
    setHandlePaxTypeChange,
    updateVehicleTransfer,
    updateSupplVehicleTransfer,
    handleIsAddTransferDataChange,
    updateSelectedVisNationality,
    handleCustomMarkupChange,
    handleHotelCustomMarkupChange,
    handleRoomTypeChange,
    handleRoomOccupancy,
} = quotationsSlice.actions;

export default quotationsSlice.reducer;
