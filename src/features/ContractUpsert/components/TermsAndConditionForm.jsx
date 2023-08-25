import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { RichTextEditor } from "../../../components";
import { handleContractDataChange } from "../../../redux/slices/hotelContractSlice";

export default function TermsAndConditionForm() {
    const dispatch = useDispatch();
    const { data } = useSelector((state) => state.hotelContractForm);

    return (
        <div className="p-4">
            <label htmlFor="">Terms And Condition</label>
            <RichTextEditor
                getValue={(value) => {
                    dispatch(
                        handleContractDataChange({
                            name: "termsAndConditions",
                            value: value,
                        })
                    );
                }}
                initialValue={data?.termsAndConditions || ""}
            />
        </div>
    );
}
