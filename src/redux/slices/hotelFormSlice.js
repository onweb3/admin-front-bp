import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchInitialData = createAsyncThunk(
    "hotelForm/fetchInitialData",
    async (_, { getState }) => {
        const { jwtToken } = getState().admin;
        const response = await axios.get("/hotels/initial-data", {
            headers: {
                authorization: `Bearer ${jwtToken}`,
            },
        });
        return response.data;
    }
);

const initialState = {
    amenities: [],
    accommodationTypes: [],
    apis: [],
    boards: [],
    hotelChains: [],
    details: {
        hotelName: "",
        country: "",
        state: "",
        city: "",
        area: "",
        address: "",
        landMark: "",
        street: "",
        postalCode: "",
        longitude: "",
        latitude: "",
        checkInTime: "12:00",
        checkOutTime: "14:00",
        distanceFromCity: "",
        website: "",
        starCategory: "",
        roomsCount: "",
        floorsCount: "",
        carParkingSlots: "",
        openDays: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
        accommodationType: "",
        hotelChain: "",
        isApiConnected: false,
        connectedApis: [],
        isContractAvailable: false,
        boardTypes: [],
        hbId: "",
        ottilaId: "",
        isPublished: false,
        isActive: true,
        allGuestDetailsRequired: false,
    },
    // correspondenceAddress: {
    //     street: "",
    //     address2: "",
    //     address3: "",
    //     country: "",
    //     city: "",
    //     zipcode: "",
    //     phonecode: "+971",
    //     phone: "",
    // },
    restaurants: [],
    bars: [],
    salesContacts: [
        {
            name: "",
            position: "",
            email: "",
            country: "",
            phoneNumber: "",
        },
    ],
    accountsContacts: [
        {
            name: "",
            position: "",
            email: "",
            country: "",
            phoneNumber: "",
        },
    ],
    hotelContacts: [
        {
            name: "",
            position: "",
            email: "",
            country: "",
            phoneNumber: "",
        },
    ],
    reservationsContacts: [
        {
            name: "",
            position: "",
            email: "",
            country: "",
            phoneNumber: "",
        },
    ],
    description: "",
    faqs: [],
    selectedAmenities: [],
    images: [],
    roomTypes: [],
};

export const hotelFormSlice = createSlice({
    name: "hotelForm",
    initialState,
    reducers: {
        addNewHotelFaq: (state, action) => {
            state.faqs.push({
                question: action.payload?.question,
                answer: action.payload?.answer,
            });
        },
        deleteHotelFaq: (state, action) => {
            const filteredFaqs = state.faqs?.filter((_, index) => {
                return index !== action.payload;
            });
            state.faqs = filteredFaqs;
        },
        updateHotelFaq: (state, action) => {
            state.faqs[action.payload?.index] = {
                question: action.payload?.question,
                answer: action.payload?.answer,
            };
        },
        addNewSelectedHotelAmenity: (state, action) => {
            state.selectedAmenities.push(action.payload);
        },
        removeSelectedHotelAmenity: (state, action) => {
            const filteredAmenities = state.selectedAmenities?.filter((item) => {
                return item?.amenity !== action.payload;
            });
            state.selectedAmenities = filteredAmenities;
        },
        handleHotelDetailsChange: (state, action) => {
            state.details[action.payload?.name] = action?.payload?.value;
        },
        handleHotelDescriptionChange: (state, action) => {
            state.description = action.payload;
        },
        initiateHotelFormFields: (state, action) => {
            const {
                hotelName,
                address,
                country,
                city,
                area,
                geoCode,
                checkInTime,
                checkOutTime,
                website,
                starCategory,
                roomsCount,
                floorsCount,
                carParkingSlots,
                description,
                faqs,
                amenities,
                images,
                landMark,
                street,
                postalCode,
                distanceFromCity,
                openDays,
                salesContacts,
                accountsContacts,
                hotelContacts,
                reservationsContacts,
                accommodationType,
                hotelChain,
                connectedApis,
                isContractAvailable,
                isApiConnected,
                boardTypes,
                hbId,
                ottilaId,
                isPublished,
                restaurants,
                bars,
                isActive,
                allGuestDetailsRequired,
            } = action.payload;

            state.details = {
                hotelName: hotelName || "",
                address: address || "",
                country: country || "",
                state: action.payload?.state || "",
                city: city || "",
                area: area || "",
                longitude: geoCode?.longitude || "",
                latitude: geoCode?.latitude || "",
                checkInTime: checkInTime || "",
                checkOutTime: checkOutTime || "",
                website: website || "",
                starCategory: starCategory || "",
                roomsCount: roomsCount || "",
                floorsCount: floorsCount || "",
                carParkingSlots: carParkingSlots || "",
                street: street || "",
                postalCode: postalCode || "",
                landMark: landMark || "",
                distanceFromCity: distanceFromCity || "",
                openDays: openDays || [],
                accommodationType: accommodationType || "",
                hotelChain: hotelChain || "",
                connectedApis: connectedApis || [],
                isApiConnected: isApiConnected,
                isContractAvailable: isContractAvailable,
                boardTypes: boardTypes || [],
                hbId: hbId || "",
                ottilaId: ottilaId || "",
                isPublished: isPublished,
                isActive: isActive,
                allGuestDetailsRequired: allGuestDetailsRequired || false,
            };

            state.description = description;
            state.faqs = faqs;
            state.selectedAmenities =
                amenities
                    ?.filter((item) => item?.amenity)
                    ?.map((item) => {
                        return {
                            name: item?.amenity?.name,
                            amenity: item?.amenity?._id,
                            isPaid: item?.isPaid,
                            isFeatured: item?.isFeatured,
                            amenityGroup: item?.amenityGroup,
                        };
                    }) || [];
            state.images = images;
            state.salesContacts = salesContacts || [];
            state.accountsContacts = accountsContacts || [];
            state.reservationsContacts = reservationsContacts || [];
            state.hotelContacts = hotelContacts || [];
            state.restaurants = restaurants || [];
            state.bars = bars || [];
        },
        selectHotelOpenDay: (state, action) => {
            if (!state.details.openDays?.includes(action?.payload)) {
                state.details.openDays?.push(action.payload?.toLowerCase());
            }
        },
        removeHotelOpenDay: (state, action) => {
            const filteredOpenDays = state.details.openDays?.filter((item) => {
                return item !== action.payload;
            });
            state.details.openDays = filteredOpenDays;
        },
        handleCorrespondenceAddressChange: (state, action) => {
            state.correspondenceAddress[action.payload?.name] = action.payload?.value;
        },
        addSalesContact: (state, action) => {
            state.salesContacts?.push({
                name: "",
                position: "",
                email: "",
                country: "",
                phoneNumber: "",
            });
        },
        removeSalesContact: (state, action) => {
            const filteredItems = state.salesContacts?.filter((_, index) => {
                return index !== action.payload;
            });
            state.salesContacts = filteredItems;
        },
        handleSalesDataChange: (state, action) => {
            state.salesContacts[action.payload?.index][action?.payload?.name] =
                action?.payload?.value;
        },
        addAccountsContact: (state, action) => {
            state.accountsContacts?.push({
                name: "",
                position: "",
                email: "",
                country: "",
                phoneNumber: "",
            });
        },
        removeAccountsContact: (state, action) => {
            const filteredItems = state.accountsContacts?.filter((_, index) => {
                return index !== action.payload;
            });
            state.accountsContacts = filteredItems;
        },
        handleAccountsDataChange: (state, action) => {
            state.accountsContacts[action.payload?.index][action?.payload?.name] =
                action?.payload?.value;
        },
        addHotelContact: (state, action) => {
            state.hotelContacts?.push({
                name: "",
                position: "",
                email: "",
                country: "",
                phoneNumber: "",
            });
        },
        removeHotelContact: (state, action) => {
            const filteredItems = state.hotelContacts?.filter((_, index) => {
                return index !== action.payload;
            });
            state.hotelContacts = filteredItems;
        },
        handleHotelContactDataChange: (state, action) => {
            state.hotelContacts[action.payload?.index][action?.payload?.name] =
                action?.payload?.value;
        },
        addReservationsContact: (state, action) => {
            state.reservationsContacts?.push({
                name: "",
                position: "",
                email: "",
                country: "",
                phoneNumber: "",
            });
        },
        removeReservationsContact: (state, action) => {
            const filteredItems = state.reservationsContacts?.filter((_, index) => {
                return index !== action.payload;
            });
            state.reservationsContacts = filteredItems;
        },
        handleReservationsDataChange: (state, action) => {
            state.reservationsContacts[action.payload?.index][action?.payload?.name] =
                action?.payload?.value;
        },
        removeHotelImage: (state, action) => {
            const filteredImages = state.images.filter((_, index) => {
                return index !== action.payload;
            });
            state.images = filteredImages;
        },
        resetHotelForm: (state) => {
            Object.assign(state, initialState);
        },
        addHotelRestaurant: (state, action) => {
            state.restaurants?.push({
                name: "",
                cuisine: "",
                fromTime: "",
                toTime: "",
            });
        },
        removeHotelRestaurant: (state, action) => {
            const filteredItems = state.restaurants?.filter((_, index) => {
                return index !== action.payload;
            });
            state.restaurants = filteredItems;
        },
        handleHotelRestaurantDataChange: (state, action) => {
            state.restaurants[action.payload?.index][action?.payload?.name] =
                action?.payload?.value;
        },
        addHotelBar: (state, action) => {
            state.bars?.push({
                name: "",
                barType: "",
                fromTime: "",
                toTime: "",
            });
        },
        removeHotelBar: (state, action) => {
            const filteredItems = state.bars?.filter((_, index) => {
                return index !== action.payload;
            });
            state.bars = filteredItems;
        },
        handleHotelBarDataChange: (state, action) => {
            state.bars[action.payload?.index][action?.payload?.name] = action?.payload?.value;
        },
    },
    extraReducers: {
        [fetchInitialData.fulfilled]: (state, action) => {
            state.amenities = action.payload?.amenities;
            state.accommodationTypes = action.payload?.accommodationTypes;
            state.apis = action.payload?.apis;
            state.boards = action.payload?.boardTypes;
            state.hotelChains = action.payload?.hotelChains;
        },
    },
});

export const {
    deleteHotelFaq,
    addNewHotelFaq,
    updateHotelFaq,
    handleHotelDetailsChange,
    handleHotelDescriptionChange,
    initiateHotelFormFields,
    selectHotelOpenDay,
    removeHotelOpenDay,
    handleCorrespondenceAddressChange,
    addNewSelectedHotelAmenity,
    removeSelectedHotelAmenity,
    addSalesContact,
    removeSalesContact,
    handleSalesDataChange,
    addAccountsContact,
    handleAccountsDataChange,
    removeAccountsContact,
    addHotelContact,
    addReservationsContact,
    handleHotelContactDataChange,
    handleReservationsDataChange,
    removeHotelContact,
    removeHotelImage,
    resetHotelForm,
    addHotelBar,
    addHotelRestaurant,
    handleHotelBarDataChange,
    handleHotelRestaurantDataChange,
    removeHotelBar,
    removeHotelRestaurant,
    removeReservationsContact,
} = hotelFormSlice.actions;

export default hotelFormSlice.reducer;
