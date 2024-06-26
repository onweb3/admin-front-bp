import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";

import axios from "../../../axios";
import { useHandleClickOutside } from "../../../hooks";
import { BtnLoader } from "../../../components";

export default function B2BHomeSectionModal({
    setIsModalOpen,
    sections,
    setSections,
    edit,
    index,
    setIndex,
}) {
    const [data, setData] = useState({
        title: sections[index]?.title || "",
        description: sections[index]?.description || "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setIsModalOpen(false));
    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setError("");
            setIsLoading(true);

            if (edit) {
                const sectionId = sections[index]._id;
                const response = await axios.patch(
                    `/b2b/home/section/edit/${sectionId}`,
                    { ...data },
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                const updatedSections = sections.map((section) =>
                    section._id === sectionId
                        ? {
                              _id: sectionId,
                              title: data.title,
                              description: data.description,
                          }
                        : section
                );

                setSections(updatedSections);
                setIndex("");
                setIsLoading(false);
                setIsModalOpen(false);
            } else {
                const response = await axios.post(
                    "/b2b/home/section/add",
                    { ...data },
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                setSections((prev) => [
                    ...prev,
                    {
                        _id: response.data._id,
                        title: data.title,
                        description: data.description,
                    },
                ]);
                setIndex("");

                setIsLoading(false);
                setIsModalOpen(false);
            }
        } catch (err) {
            // console.log(err);
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    console.log(sections, "sections");

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">Add Section</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div className="mt-4">
                            <label htmlFor="">Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={data?.title || ""}
                                onChange={handleChange}
                                placeholder="Enter title"
                                id=""
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Description *</label>
                            <input
                                type="text"
                                value={data.description || ""}
                                name="description"
                                onChange={handleChange}
                                placeholder="Enter description"
                                required
                            />
                        </div>
                        {error && (
                            <span className="text-sm block text-red-500 mt-2">
                                {error}
                            </span>
                        )}
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button className="w-[160px]">
                                {isLoading ? <BtnLoader /> : "Add Section"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
