import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useDispatch } from "react-redux";

import { RichTextEditor } from "../../../components";
import { useHandleClickOutside } from "../../../hooks";
import { addNewSection } from "../../../redux/slices/attractionFormSlice";

export default function AddSectionModal({
    setIsAddSectionModalOpen,
    isAddSectionModalOpen,
}) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const wrapperRef = useRef();
    const dispatch = useDispatch();

    // useHandleClickOutside(wrapperRef, () => setIsAddSectionModalOpen(false));

    return (
        <div
            className={
                "fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 " +
                (isAddSectionModalOpen ? "block" : "hidden")
            }
        >
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[800px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">Add Section</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsAddSectionModalOpen(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <div>
                        <label htmlFor="">Title</label>
                        <input
                            type="text"
                            value={title || ""}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Body</label>
                        <RichTextEditor
                            initialValue={body}
                            getValue={(value) => {
                                setBody(value);
                            }}
                        />
                    </div>
                    <div className="flex items-center justify-end mt-6">
                        <button
                            className="px-3"
                            onClick={() => {
                                if (title && body) {
                                    dispatch(addNewSection({ title, body }));
                                    setTitle("");
                                    setBody("");
                                    setIsAddSectionModalOpen(false);
                                }
                            }}
                        >
                            Add Section
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
