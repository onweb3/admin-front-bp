import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";



const  initialState = {}


export const visaFormSlice = createSlice({
    name: "visaForm",
    initialState,
    reducers: {

        addNewDetails :(state, action) => {
            state.data.sections.push({
                title: action.payload?.title,
                body: action.payload?.body,
            });
        },

    }
})



export default visaFormSlice.reducer;
