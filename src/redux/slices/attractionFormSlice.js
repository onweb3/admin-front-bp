import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

const availabilityData = [
  { isEnabled: false, day: "sunday", open: "00:00", close: "00:00" },
  { isEnabled: false, day: "monday", open: "00:00", close: "00:00" },
  { isEnabled: false, day: "tuesday", open: "00:00", close: "00:00" },
  { isEnabled: false, day: "wednesday", open: "00:00", close: "00:00" },
  { isEnabled: false, day: "thursday", open: "00:00", close: "00:00" },
  { isEnabled: false, day: "friday", open: "00:00", close: "00:00" },
  { isEnabled: false, day: "saturday", open: "00:00", close: "00:00" },
];

export const fetchInitialData = createAsyncThunk(
  "attractionForm/fetchInitialData",
  async (_, { getState }) => {
    const { jwtToken } = getState().admin;
    const response = await axios.get("/attractions/initial-data", {
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    });
    return response.data;
  }
);

const initialState = {
  categories: [],
  data: {
    title: "",
    bookingType: "ticket",
    destination: "",
    category: "",
    durationType: "hours",
    duration: "",
    mapLink: "",
    isOffer: false,
    offerAmountType: "flat",
    offerAmount: "",
    isApiConnected: false,
    connectedApi: "",
    cancellationType: "nonRefundable",
    cancelBeforeTime: "0",
    cancellationFee: "",
    isCustomDate: false,
    startDate: "",
    endDate: "",
    itineraryDescription: "",
    highlights: "",
    youtubeLink: "",
    sections: [],
    isCombo: false,
    bookingPriorDays: "",
    country: "",
    state: "",
    city: "",
    area: "",
    displayOrder: 1,
  },
  logo: "",
  images: [],
  availability: availabilityData,
  offDates: [],
  activities: [],
  faqs: [],
};

export const attractionFormSlice = createSlice({
  name: "attractionForm",
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data[action.payload?.name] = action.payload?.value;
      localStorage.setItem("attractionData", JSON.stringify(state.data));
    },
    removeImage: (state, action) => {
      const filteredImages = state.images.filter((_, index) => {
        return index !== action.payload;
      });
      state.images = filteredImages;
    },

    handleInitiateLocalStorageData: (state, { payload }) => {
      state.data = {
        title: payload?.attrData?.title,
        bookingType: payload?.attrData?.bookingType,
        destination: payload?.attrData?.destination,
        category: payload?.attrData?.category,
        durationType: payload?.attrData?.durationType,
        duration: payload?.attrData?.duration,
        mapLink: payload?.attrData?.mapLink,
        isOffer: payload?.attrData?.isOffer,
        offerAmountType: payload?.attrData?.offerAmountType,
        offerAmount: payload?.attrData?.offerAmount,
        isApiConnected: payload?.attrData?.isApiConnected,
        connectedApi: payload?.attrData?.connectedApi,
        cancellationType: payload?.attrData?.cancellationType,
        cancelBeforeTime: payload?.attrData?.cancelBeforeTime,
        cancellationFee: payload?.attrData?.cancellationFee,
        isCustomDate: payload?.attrData?.isCustomDate,
        startDate: payload?.attrData?.startDate,
        endDate: payload?.attrData?.endDate,
        itineraryDescription: payload?.attrData?.itineraryDescription,
        highlights: payload?.attrData?.highlights,
        youtubeLink: payload?.attrData?.youtubeLink,
        sections: payload?.attrData?.sections,
        isCombo: payload?.attrData?.isCombo,
        bookingPriorDays: payload?.attrData?.bookingPriorDays,
        country: payload?.attrData?.country,
        state: payload?.attrData?.state,
        city: payload?.attrData?.city,
        area: payload?.attrData?.area,
        displayOrder: payload?.attrData?.displayOrder,
        latitude: payload?.attrData?.longitude,
        longitude: payload?.attrData?.longitude,
      };
    },

    clearLocalStorageAttraction: (state, { payload }) => {
      localStorage.removeItem("attractionData");
      state.data = {
        title: "",
        bookingType: "ticket",
        destination: "",
        category: "",
        durationType: "hours",
        duration: "",
        mapLink: "",
        isOffer: false,
        offerAmountType: "flat",
        offerAmount: "",
        isApiConnected: false,
        connectedApi: "",
        cancellationType: "nonRefundable",
        cancelBeforeTime: "0",
        cancellationFee: "",
        isCustomDate: false,
        startDate: "",
        endDate: "",
        highlights: "",
        itineraryDescription: "",
        youtubeLink: "",
        sections: [],
        isCombo: false,
        bookingPriorDays: "",
        country: "",
        state: "",
        city: "",
        area: "",
        displayOrder: 1,
      };
    },

    clearAttractionData: (state, action) => {
      state.data = {
        title: "",
        bookingType: "ticket",
        destination: "",
        category: "",
        durationType: "hours",
        duration: "",
        mapLink: "",
        isOffer: false,
        offerAmountType: "flat",
        offerAmount: "",
        isApiConnected: false,
        connectedApi: "",
        cancellationType: "nonRefundable",
        cancelBeforeTime: "0",
        cancellationFee: "",
        isCustomDate: false,
        startDate: "",
        endDate: "",
        highlights: "",
        itineraryDescription: "",
        youtubeLink: "",
        sections: [],
        isCombo: false,
        bookingPriorDays: "",
        country: "",
        state: "",
        city: "",
        area: "",
        displayOrder: 1,
      };
      state.images = [];
      state.availability = availabilityData;
      state.offDates = [];
      state.faqs = [];
      state.activities = [];
      state.logo = "";
    },
    addNewSection: (state, action) => {
      state.data.sections.push({
        title: action.payload?.title,
        body: action.payload?.body,
      });
    },
    deleteSection: (state, action) => {
      const filteredSections = state.data.sections?.filter((_, index) => {
        return index !== action.payload;
      });
      state.data.sections = filteredSections;
    },
    updateSection: (state, action) => {
      state.data.sections[action.payload?.index] = {
        title: action.payload?.title,
        body: action.payload?.body,
      };
    },
    addNewAttrFaq: (state, action) => {
      state.faqs.push({
        question: action.payload?.question,
        answer: action.payload?.answer,
      });
    },
    deleteAttrFaq: (state, action) => {
      const filteredFaqs = state.faqs?.filter((_, index) => {
        return index !== action.payload;
      });
      state.faqs = filteredFaqs;
    },
    updateAttrFaq: (state, action) => {
      state.faqs[action.payload?.index] = {
        question: action.payload?.question,
        answer: action.payload?.answer,
      };
    },
    addInitialData: (state, action) => {
      const {
        bookingType,
        title,
        destination,
        category,
        durationType,
        duration,
        mapLink,
        isOffer,
        offerAmountType,
        offerAmount,
        isCustomDate,
        startDate,
        endDate,
        highlights,
        itineraryDescription,
        youtubeLink,
        sections,
        faqs,
        isApiConnected,
        connectedApi,
        isCombo,
        cancellationType,
        cancelBeforeTime,
        cancellationFee,
        availability,
        offDates,
        bookingPriorDays,
        country,
        city,
        area,
        displayOrder,
        longitude,
        latitude,
        slug,
      } = action.payload;

      state.data.bookingType = bookingType || "ticket";
      state.data.title = title || "";
      state.data.destination = destination || "";
      state.data.category = category || "";
      state.data.durationType = durationType || "hours";
      state.data.duration = duration || "";
      state.data.mapLink = mapLink || "";
      state.data.isOffer = isOffer || false;
      state.data.offerAmountType = offerAmountType || "flat";
      state.data.offerAmount = offerAmount || "";
      state.data.startDate = startDate || "";
      state.data.endDate = endDate || "";
      state.data.highlights = highlights || "";
      state.data.itineraryDescription = itineraryDescription || "";
      state.data.youtubeLink = youtubeLink || "";
      state.data.sections = sections || [];
      state.data.isApiConnected = isApiConnected || false;
      state.data.connectedApi = connectedApi || "";
      state.data.isCombo = isCombo || false;
      state.data.cancellationType = cancellationType || "nonRefundable";
      state.data.cancelBeforeTime = cancelBeforeTime || "";
      state.data.cancellationFee = cancellationFee || "";
      state.data.isCustomDate = isCustomDate || false;
      state.data.bookingPriorDays = bookingPriorDays || "";
      state.faqs = faqs || [];
      state.availability = availability || availabilityData;
      state.offDates = offDates || [];
      state.activities = action.payload?.activities || [];
      state.images = action.payload?.images || [];
      state.logo = action.payload?.logo || [];
      state.data.country = country || "";
      state.data.city = city || "";
      state.data.area = area || "";
      state.data.displayOrder = displayOrder || 1;
      state.data.state = action.payload?.state || "";
      state.data.longitude = longitude || "";
      state.data.latitude = latitude || "";
      state.data.slug = slug || "";
    },
    deleteAttractionActivity: (state, action) => {
      const filteredActivities = state.activities?.filter((activity) => {
        return activity?._id !== action.payload;
      });
      state.activities = filteredActivities;
    },
    isActiveActivity: (state, action) => {
      const activityId = action.payload;

      const activity = state.activities.find(
        (activity) => activity._id === activityId
      );
      if (!activity) {
        return;
      }

      const updatedActivity = {
        ...activity,
        isActive: !activity.isActive,
      };
    },
    updateAttractionActivity: (state, action) => {
      const { activities, newActivities } = action.payload;
      const updatedActivities = activities.map((activity) => {
        const newActivity = newActivities.find(
          (newActivity) => newActivity._id === activity._id
        );
        if (newActivity) {
          return { ...activity, ...newActivity };
        } else {
          return activity;
        }
      });
      const addedActivities = newActivities.filter(
        (newActivity) =>
          !updatedActivities.find(
            (activity) => activity._id === newActivity._id
          )
      );
      state.activities = [...updatedActivities, ...addedActivities];
    },

    addOffDate: (state, action) => {
      state.offDates?.push({
        from: "",
        to: "",
      });
    },
    removeOffDate: (state, action) => {
      const filteredOffDates = state.offDates.filter((_, index) => {
        return index !== action.payload;
      });
      state.offDates = filteredOffDates;
    },
    changeOffDateData: (state, action) => {
      state.offDates[action.payload?.index][action.payload?.name] =
        action.payload.value;
    },
    changeAvailabilityData: (state, action) => {
      state.availability[action.payload?.index][action.payload?.name] =
        action.payload?.value;
    },
  },
  extraReducers: {
    [fetchInitialData.fulfilled]: (state, action) => {
      state.categories = action.payload?.categories;
    },
  },
});

export const {
  setData,
  removeImage,
  clearAttractionData,
  addNewSection,
  deleteSection,
  updateSection,
  addInitialData,
  addNewAttrFaq,
  deleteAttrFaq,
  updateAttrFaq,
  deleteAttractionActivity,
  isActiveActivity,
  addOffDate,
  removeOffDate,
  changeOffDateData,
  changeAvailabilityData,
  updateAttractionActivity,

  // add new changes
  handleInitiateLocalStorageData,
  clearLocalStorageAttraction,
} = attractionFormSlice.actions;

export default attractionFormSlice.reducer;
