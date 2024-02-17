import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    attrData: {
        title: "",
        attractions: [],
        gallery: [],
        description: "",
        attractionFullData: []
    }
}

export const attractionStandAloneSlice = createSlice({
    name: "attrStandAlone",
    initialState,
    reducers : {

        addAttractionStandAloneDatas: (state, { payload })=>{

            if(payload.name === "attraction") {
                if(state.attrData.attractions.length) {
                    const exist = state.attrData.attractions.findIndex((item)=> item?._id !== payload?.value?._id)
                    if(exist !== -1){
                        state.attrData.attractions.push(payload.value)
                    } 
                } else {
                    state.attrData.attractions.push(payload.value)
                }
            }else {
                state.attrData[payload.name] = payload.value
            }
        }

    }
})

export const {
    addAttractionStandAloneDatas
} = attractionStandAloneSlice.actions;

export default attractionStandAloneSlice.reducer