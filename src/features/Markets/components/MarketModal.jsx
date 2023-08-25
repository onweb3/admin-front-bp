import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";

import axios from "../../../axios";
import { BtnLoader } from "../../../components";
import { useHandleClickOutside } from "../../../hooks";

export default function MaketModal({
    marketModal,
    setMarketModal,
    selectedMarket,
    markets,
    setMarkets,
}) {
    const [data, setData] = useState({
        marketName: (marketModal?.isEdit && selectedMarket?.marketName) || "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setMarketModal({ isEdit: false, isOpen: false })
    );
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

            if (marketModal?.isEdit) {
                const response = await axios.patch(
                    `/markets/update/${selectedMarket?._id}`,
                    data,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                const tempMarkets = markets;
                const objIndex = tempMarkets?.findIndex((item) => {
                    return item?._id === response?.data?._id;
                });
                if (objIndex !== -1) {
                    tempMarkets[objIndex] = response?.data;
                    setMarkets(tempMarkets);
                }
            } else {
                const response = await axios.post("/markets/add", data, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                setMarkets((prev) => {
                    return [response.data, ...prev];
                });
            }
            setMarketModal({ isOpen: false, isEdit: false });
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
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
                    <h2 className="font-medium mb-2">
                        {marketModal?.isEdit ? "Update Market" : "Add Market"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setMarketModal({ isOpen: false, isEdit: false })
                        }
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Market Name</label>
                            <input
                                type="text"
                                placeholder="Enter Market Name"
                                name="marketName"
                                value={data.marketName || ""}
                                onChange={handleChange}
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
                                onClick={() =>
                                    setMarketModal({
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
                                ) : marketModal?.isEdit ? (
                                    "Update Market"
                                ) : (
                                    "Add Market"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
