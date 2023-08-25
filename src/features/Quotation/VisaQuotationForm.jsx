import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios";

import {
    handleOkToBoardChange,
    updateSelectedVisa,
    handleQuotationDisableChange,
} from "../../redux/slices/quotationSlice";

export default function VisaQuotaionForm() {
    const {
        visas,
        selectedVisa,
        selectedVisaCountry,
        otbPrice,
        isVisaQuotationDisabled,
    } = useSelector((state) => state.quotations);
    const { jwtToken } = useSelector((state) => state.admin);

    const [visa, setVisa] = useState([]);

    const fetchVisaData = async () => {
        try {
            const res = await axios.get(
                `/quotations/inital/visa-type/${visas[0]._id}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setVisa(res.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (visas.length > 0) {
            fetchVisaData();
        }
    }, [visas]);

    const dispatch = useDispatch();

    return (
        <div>
            <div className="flex items-center mb-7 gap-4">
                <input
                    type="checkbox"
                    className="w-[16px] h-[16px]"
                    checked={!isVisaQuotationDisabled}
                    onChange={(e) =>
                        dispatch(
                            handleQuotationDisableChange({
                                name: "isVisaQuotationDisabled",
                                value: !e.target.checked,
                            })
                        )
                    }
                />
                <h1 className="text-base font-[600] text-blue-500">
                    Visa Quotation
                </h1>
            </div>
            {isVisaQuotationDisabled === false ? (
                <>
                    <div className="flex items-start gap-[2em]">
                        <label htmlFor="" className="w-[100%] max-w-[180px]">
                            Visas
                        </label>
                        <div className="flex flex-wrap items-center gap-[30px]">
                            {visa?.map((visa, index) => {
                                return (
                                    <div
                                        className="flex items-center gap-[10px]"
                                        key={index}
                                    >
                                        <input
                                            type="radio"
                                            className="w-[18px] h-[18px]"
                                            name="visa"
                                            value={visa?._id}
                                            onChange={() =>
                                                dispatch(
                                                    updateSelectedVisa(visa)
                                                )
                                            }
                                            defaultChecked={
                                                selectedVisa === visa?._id
                                            }
                                        />
                                        <label className="mb-0">
                                            {visa?.visaName}{" "}
                                            <span className="text-sm text-gray-500">
                                                ({visa?.visaPrice} AED)
                                            </span>
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {selectedVisa && Object.keys(selectedVisa)?.length > 0 && (
                        <div className="flex items-start gap-[2em] mt-6">
                            <label
                                htmlFor=""
                                className="w-[100%] max-w-[180px]"
                            >
                                OTB Price
                            </label>
                            <input
                                type="number"
                                placeholder="Enter the price"
                                value={otbPrice || ""}
                                onChange={(e) =>
                                    dispatch(
                                        handleOkToBoardChange(e.target.value)
                                    )
                                }
                                onWheel={(e) => e.target.blur()}
                            />
                        </div>
                    )}
                    {/* <div className="flex items-start gap-[2em] mt-6">
                        <label htmlFor="" className="w-[100%] max-w-[180px]">
                            Total
                        </label>
                        <span className="text-sm font-medium">
                            {Object.keys(selectedVisa).length > 0
                                ? selectedVisa?.price + Number(otbPrice)
                                : "0.00"}{" "}
                            AED
                        </span>
                    </div> */}
                </>
            ) : (
                ""
            )}
            {/* <div className="flex items-center gap-[10px] mt-5">
                <input
                    type="checkbox"
                    className="w-[16px] h-[16px]"
                    checked={isVisaQuotationDisabled}
                    onChange={(e) =>
                        dispatch(
                            handleQuotationDisableChange({
                                name: "isVisaQuotationDisabled",
                                value: e.target.checked,
                            })
                        )
                    }
                />
                <label htmlFor="" className="mb-0">
                    Please check this box if you don't need visa quotation
                </label>
            </div> */}
        </div>
    );
}
