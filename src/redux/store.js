import { configureStore } from "@reduxjs/toolkit";
import {
    adminReducer,
    attractionFormReducer,
    generalReducer,
    hotelFormReducer,
    visaFormReducer,
    hotelContractFormReducer,
    hotelPromotionsFormReducer,
    markupProfileFormSlice,
    quotationListSliceReducer,
    quotationsReducer,
} from "./slices";

export const store = configureStore({
    reducer: {
        admin: adminReducer,
        attractionForm: attractionFormReducer,
        general: generalReducer,
        visaForm: visaFormReducer,
        hotelForm: hotelFormReducer,
        hotelContractForm: hotelContractFormReducer,
        hotelPromotionsForm: hotelPromotionsFormReducer,
        markupProfileForm: markupProfileFormSlice,
        quotationsList: quotationListSliceReducer,
        quotations: quotationsReducer,
    },
});
