import React from "react";
import { useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import HotelFaqModal from "./HotelFaqModal";
import { deleteHotelFaq, handleHotelDescriptionChange } from "../../../redux/slices/hotelFormSlice";
import { RichTextEditor } from "../../../components";

export default function HotelDescriptionForm({ selectedSection, isEditPermission = true }) {
    const [hotelFaqModal, setHotelFaqModal] = useState({
        isOpen: false,
        isEdit: false,
        editIndex: 0,
    });
    const [selectedFaq, setSelectedFaq] = useState({});

    const { faqs, description } = useSelector((state) => state.hotelForm);
    const dispatch = useDispatch();

    return (
        <div className={selectedSection === "-description" ? "block" : "hidden"}>
            <div>
                <label htmlFor="">Description *</label>
                {isEditPermission ? (
                    <RichTextEditor
                        initialValue={description || ""}
                        getValue={(value) => {
                            dispatch(handleHotelDescriptionChange(value));
                        }}
                    />
                ) : (
                    <textarea defaultValue={description || ""} disabled></textarea>
                )}
            </div>
            {hotelFaqModal.isOpen && (
                <HotelFaqModal
                    hotelFaqModal={hotelFaqModal}
                    setHotelFaqModal={setHotelFaqModal}
                    selectedFaq={selectedFaq}
                />
            )}
            <div className="mt-[3em]">
                <div
                    className={
                        "flex items-center mb-3 " + (faqs?.length < 1 ? "justify-center" : "justify-end")
                    }
                >
                    {isEditPermission && (
                        <button
                            className="px-3 bg-orange-500"
                            onClick={() => setHotelFaqModal({ isOpen: true, isEdit: false })}
                        >
                            + Add FAQ
                        </button>
                    )}
                </div>
                {faqs?.length < 1 ? (
                    <span className="text-sm text-grayColor font-medium text-center block">
                        Faqs not added!!!
                    </span>
                ) : (
                    <table className="w-full">
                        <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                            <tr>
                                <th className="font-[500] p-3">#</th>
                                <th className="font-[500] p-3">Question</th>
                                <th className="font-[500] p-3">Answer</th>
                                {isEditPermission && <th className="font-[500] p-3">Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {faqs?.map((faq, index) => {
                                return (
                                    <tr key={index} className="border-b border-tableBorderColor">
                                        <td className="p-3">#{index + 1}</td>
                                        <td className="p-3">{faq?.question || "N/A"}</td>
                                        <td className="p-3">{faq?.answer || "N/A"}</td>
                                        {isEditPermission && (
                                            <td className="p-3">
                                                <div className="flex gap-[10px]">
                                                    <button
                                                        className="h-auto bg-transparent text-red-500 text-xl"
                                                        onClick={() => {
                                                            if (window.confirm("Are you sure to delete?")) {
                                                                dispatch(deleteHotelFaq(index));
                                                            }
                                                        }}
                                                    >
                                                        <MdDelete />
                                                    </button>
                                                    <button
                                                        className="h-auto bg-transparent text-green-500 text-xl"
                                                        onClick={() => {
                                                            setSelectedFaq(faq);
                                                            setHotelFaqModal({
                                                                isOpen: true,
                                                                isEdit: true,
                                                                editIndex: index,
                                                            });
                                                        }}
                                                    >
                                                        <BiEditAlt />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
