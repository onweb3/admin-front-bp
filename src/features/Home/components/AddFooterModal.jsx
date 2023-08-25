import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useHandleClickOutside } from "../../../hooks";

export default function AddFooterModal({
    footerModal,
    setFooterModal,
    selectedFooter,
    addFooter,
    updateFooter,
}) {
    const [title, setTitle] = useState(
        (footerModal?.isEdit && selectedFooter?.footer?.title) || ""
    );

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setFooterModal({ isOpen: false, isEdit: false })
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (footerModal?.isEdit) {
            updateFooter(title);
        } else {
            addFooter(title);
        }
        setFooterModal({ isOpen: false, isEdit: false });
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px] rounded shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">
                        {footerModal?.isEdit ? "Update Footer" : "Add Footer"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setFooterModal({
                                isOpen: false,
                                isEdit: false,
                            })
                        }
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Footer Title</label>
                            <input
                                type="text"
                                placeholder="Enter Title"
                                onChange={(e) => setTitle(e.target.value)}
                                value={title || ""}
                                required
                            />
                        </div>
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() =>
                                    setFooterModal({
                                        isOpen: false,
                                        isEdit: false,
                                    })
                                }
                            >
                                Cancel
                            </button>
                            <button className="w-[140px]">
                                {footerModal?.isEdit
                                    ? "Update Footer"
                                    : "Add Footer"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
