import React, { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import { RichTextEditor } from "../../../components";
import { updateSection } from "../../../redux/slices/attractionFormSlice";

export default function EditSectionModal({
    setIsEditSectionModalOpen,
    editIndex,
}) {
    const { data } = useSelector((state) => state.attractionForm);

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const wrapperRef = useRef();
    const dispatch = useDispatch();

    // useHandleClickOutside(wrapperRef, () => setIsEditSectionModalOpen(false));

    useEffect(() => {
        setTitle(data?.sections[editIndex]?.title);
        setBody(data?.sections[editIndex]?.body);
    }, [data.sections, editIndex]);

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[800px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">Edit Section</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsEditSectionModalOpen(false)}
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
                                    dispatch(
                                        updateSection({
                                            title,
                                            body,
                                            index: editIndex,
                                        })
                                    );
                                    setTitle("");
                                    setBody("");
                                    setIsEditSectionModalOpen(false);
                                }
                            }}
                        >
                            Edit Section
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
