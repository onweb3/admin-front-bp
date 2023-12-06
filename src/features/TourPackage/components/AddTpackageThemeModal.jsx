import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

import { useHandleClickOutside } from "../../../hooks";
import axios from "../../../axios";
import { MdClose } from "react-icons/md";
import { BtnLoader } from "../../../components";

export default function AddTpackageThemeModal({
    tpThemeModal,
    setTpThemeModal,
    selectedTpTheme,
    updateTPackageTheme,
    addTPackageTheme,
}) {
    const [data, setData] = useState({
        themeName: (tpThemeModal?.isEdit && selectedTpTheme?.themeName) || "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setTpThemeModal({ isEdit: false, isOpen: false }));
    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            if (tpThemeModal?.isEdit) {
                const response = await axios.patch(
                    `/tour-packages/themes/update/${selectedTpTheme?._id}`,
                    data,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                updateTPackageTheme(response.data);
            } else {
                const response = await axios.post("/tour-packages/themes/add", data, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                addTPackageTheme(response.data);
            }
            setTpThemeModal({ isOpen: false, isEdit: false });
        } catch (err) {
            setError(err?.response?.data?.error || "Something went wrong, Try again");
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium">
                        {tpThemeModal?.isEdit ? "Update Theme" : "Add Theme"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setTpThemeModal({ isOpen: false, isEdit: false })}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Theme Name</label>
                            <input
                                type="text"
                                placeholder="Ex: Sight Seeing"
                                name="themeName"
                                value={data.themeName || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {error && <span className="text-sm block text-red-500 mt-2">{error}</span>}
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() =>
                                    setTpThemeModal({
                                        isOpen: false,
                                        isEdit: false,
                                    })
                                }
                            >
                                Cancel
                            </button>
                            <button className="w-[150px]">
                                {isLoading ? (
                                    <BtnLoader />
                                ) : tpThemeModal?.isEdit ? (
                                    "Update Theme"
                                ) : (
                                    "Add Theme"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
