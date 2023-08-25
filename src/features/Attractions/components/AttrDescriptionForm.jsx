import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";

import {
    deleteAttrFaq,
    deleteSection,
    setData,
} from "../../../redux/slices/attractionFormSlice";
import { RichTextEditor } from "../../../components";
import AddSectionModal from "./AddSectionModal";
import EditSectionModal from "./EditSectionModal";
import AddAttrFaqModal from "./AddAttrFaqModal";

export default function AttrDescriptionForm({ section }) {
    const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
    const [isEditSectionModalOpen, setIsEditSectionModalOpen] = useState(false);
    const [editIndex, setEditIndex] = useState("");
    const [attrFaqModal, setAttrFaqModal] = useState({
        isEdit: false,
        isOpen: false,
        editIndex: null,
    });
    const [selectedFaq, setSelectedFaq] = useState({});

    const dispatch = useDispatch();
    const { data, faqs } = useSelector((state) => state.attractionForm);

    return (
        <div className={section === 4 ? "block" : "hidden"}>
            <div className="">
                <h1 className="font-medium">Inclusion</h1>
                <div className="mt-2">
                    <div className="border border-t-0">
                        <RichTextEditor
                            getValue={(value) => {
                                dispatch(
                                    setData({ name: "highlights", value })
                                );
                            }}
                            initialValue={data?.highlights || ""}
                        />
                    </div>
                </div>
            </div>

            <span className="block border-t border-dashed mt-[3.5em]"></span>

            <AddSectionModal
                setIsAddSectionModalOpen={setIsAddSectionModalOpen}
                isAddSectionModalOpen={isAddSectionModalOpen}
            />
            {isEditSectionModalOpen && (
                <EditSectionModal
                    setIsEditSectionModalOpen={setIsEditSectionModalOpen}
                    editIndex={editIndex}
                />
            )}

            <div className="mt-[3em]">
                <div
                    className={
                        "flex items-center mb-3 " +
                        (data.sections?.length < 1
                            ? "justify-center"
                            : "justify-end")
                    }
                >
                    <button
                        className="px-3 bg-orange-500"
                        onClick={() => setIsAddSectionModalOpen(true)}
                    >
                        + Add Section
                    </button>
                </div>
                {data?.sections?.length > 0 ? (
                    <table className="w-full">
                        <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                            <tr>
                                <th className="font-[500] p-3">#</th>
                                <th className="font-[500] p-3">Title</th>
                                <th className="font-[500] p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.sections?.map((section, index) => {
                                return (
                                    <tr
                                        key={index}
                                        className="border-b border-tableBorderColor"
                                    >
                                        <td className="p-3">#{index + 1}</td>
                                        <td className="p-3">
                                            {section?.title || "N/A"}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex gap-[10px]">
                                                <button
                                                    className="h-auto bg-transparent text-red-500 text-xl"
                                                    onClick={() => {
                                                        if (
                                                            window.confirm(
                                                                "Are you sure to delete?"
                                                            )
                                                        ) {
                                                            dispatch(
                                                                deleteSection(
                                                                    index
                                                                )
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <MdDelete />
                                                </button>
                                                <button
                                                    className="h-auto bg-transparent text-green-500 text-xl"
                                                    onClick={() => {
                                                        setEditIndex(index);
                                                        setIsEditSectionModalOpen(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    <BiEditAlt />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <span className="text-sm text-grayColor font-medium text-center block">
                        Sessions not added!!!
                    </span>
                )}
            </div>

            <span className="block border-t border-dashed mt-[3.5em]"></span>

            {attrFaqModal.isOpen && (
                <AddAttrFaqModal
                    setAttrFaqModal={setAttrFaqModal}
                    attrFaqModal={attrFaqModal}
                    selectedFaq={selectedFaq}
                />
            )}
            <div className="mt-[3em]">
                <div
                    className={
                        "flex items-center mb-3 " +
                        (faqs?.length < 1 ? "justify-center" : "justify-end")
                    }
                >
                    <button
                        className="px-3 bg-orange-500"
                        onClick={() =>
                            setAttrFaqModal({ isOpen: true, isEdit: false })
                        }
                    >
                        + Add FAQ
                    </button>
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
                                <th className="font-[500] p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {faqs?.map((faq, index) => {
                                return (
                                    <tr
                                        key={index}
                                        className="border-b border-tableBorderColor"
                                    >
                                        <td className="p-3">#{index + 1}</td>
                                        <td className="p-3">
                                            {faq?.question || "N/A"}
                                        </td>
                                        <td className="p-3">
                                            {faq?.answer || "N/A"}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex gap-[10px]">
                                                <button
                                                    className="h-auto bg-transparent text-red-500 text-xl"
                                                    onClick={() => {
                                                        if (
                                                            window.confirm(
                                                                "Are you sure to delete?"
                                                            )
                                                        ) {
                                                            dispatch(
                                                                deleteAttrFaq(
                                                                    index
                                                                )
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <MdDelete />
                                                </button>
                                                <button
                                                    className="h-auto bg-transparent text-green-500 text-xl"
                                                    onClick={() => {
                                                        setSelectedFaq(faq);
                                                        setAttrFaqModal({
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
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            <span className="block border-t border-dashed mt-[3.5em]"></span>

            <div className="mt-5">
                <h1 className="font-medium">Itinerary Description</h1>
                <div className="mt-2">
                    <div className="border border-t-0">
                        <RichTextEditor
                            getValue={(value) => {
                                dispatch(
                                    setData({
                                        name: "itineraryDescription",
                                        value,
                                    })
                                );
                            }}
                            initialValue={data?.itineraryDescription || ""}
                        />
                    </div>
                </div>
            </div>

            <span className="block border-t border-dashed mt-[3.5em]"></span>
        </div>
    );
}
