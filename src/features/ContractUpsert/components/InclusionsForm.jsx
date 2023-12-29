import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { RichTextEditor } from "../../../components";
import { handleContractDataChange } from "../../../redux/slices/hotelContractSlice";

export default function InclusionsForm({ isEditPermission = true }) {
    const dispatch = useDispatch();
    const { data } = useSelector((state) => state.hotelContractForm);

    return (
        <div className="p-4">
            <label htmlFor="">Inclusions</label>
            {isEditPermission ? (
                <RichTextEditor
                    getValue={(value) => {
                        dispatch(
                            handleContractDataChange({
                                name: "inclusions",
                                value: value,
                            })
                        );
                    }}
                    initialValue={data?.inclusions || ""}
                />
            ) : (
                <textarea defaultValue={data?.inclusions || ""} disabled></textarea>
            )}
        </div>
    );
}
