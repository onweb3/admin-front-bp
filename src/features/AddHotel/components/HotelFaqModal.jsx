import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useDispatch } from "react-redux";

import { useHandleClickOutside } from "../../../hooks";
import { addNewHotelFaq, updateHotelFaq } from "../../../redux/slices/hotelFormSlice";

export default function HotelFaqModal({
    hotelFaqModal,
    setHotelFaqModal,
    selectedFaq,
}) {
    const [data, setData] = useState({
        question: hotelFaqModal?.isEdit ? selectedFaq?.question : "",
        answer: hotelFaqModal?.isEdit ? selectedFaq?.answer : "",
    });

    const wrapperRef = useRef();
    const dispatch = useDispatch();

    useHandleClickOutside(wrapperRef, () =>
        setHotelFaqModal({ isOpen: false, isEdit: false })
    );

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium">
                        {hotelFaqModal?.isEdit ? "Edit Faq" : "Add Faq"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setHotelFaqModal({ isOpen: false, isEdit: false })
                        }
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <div>
                        <label htmlFor="">Question</label>
                        <input
                            type="text"
                            value={data.question || ""}
                            onChange={handleChange}
                            name="question"
                            placeholder="Enter Title"
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Answer</label>
                        <textarea
                            name="answer"
                            id=""
                            value={data.answer || ""}
                            onChange={handleChange}
                            placeholder="Enter Description"
                        ></textarea>
                    </div>
                    <div className="flex items-center justify-end mt-6">
                        <button
                            className="px-3"
                            onClick={() => {
                                if (!hotelFaqModal?.isEdit) {
                                    dispatch(addNewHotelFaq({ ...data }));
                                } else {
                                    dispatch(
                                        updateHotelFaq({
                                            ...data,
                                            index: hotelFaqModal?.editIndex,
                                        })
                                    );
                                }
                                setHotelFaqModal({
                                    isOpen: false,
                                    isEdit: false,
                                });
                            }}
                            disabled={!data.question || !data.answer}
                        >
                            {hotelFaqModal?.isEdit ? "Edit Faq" : "Add Faq"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
