import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    handlePromotionDataChange,
    handleValidDaysChange,
} from "../../../redux/slices/hotelPromotionsFormSlice";
import { MultipleSelectDropdown } from "../../../components";

const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export default function PromotionBasicForm() {
    const { data, validDays, contractGroups, promotions, markets } = useSelector(
        (state) => state.hotelPromotionsForm
    );
    const { countries } = useSelector((state) => state.general);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        dispatch(
            handlePromotionDataChange({
                name: e.target.name,
                value: e.target.value,
            })
        );
    };

    const handleChkBoxChange = (e) => {
        dispatch(
            handlePromotionDataChange({
                name: e.target.name,
                value: e.target.checked,
            })
        );
    };

    return (
        <div className="p-4 grid grid-cols-4 gap-3">
            <div>
                <label htmlFor="">Promotion Name *</label>
                <input
                    type="text"
                    name="name"
                    value={data.name || ""}
                    onChange={handleChange}
                    placeholder="Ex: promotion name"
                />
            </div>
            <div>
                <label htmlFor="">Promotion Code *</label>
                <input
                    type="text"
                    name="promotionCode"
                    value={data.promotionCode || ""}
                    onChange={handleChange}
                    placeholder="Ex: PRO001"
                />
            </div>
            <div>
                <label htmlFor="">Priority *</label>
                <input
                    type="number"
                    name="priority"
                    value={!isNaN(data.priority) ? data.priority : ""}
                    onChange={handleChange}
                    placeholder="0"
                />
            </div>
            <div>
                <label htmlFor="basePlan">Contract Groups *</label>
                <div>
                    <MultipleSelectDropdown
                        data={contractGroups}
                        displayName={"contractName"}
                        valueName={"_id"}
                        selectedData={data.contractGroups}
                        setSelectedData={(selContractGroups) => {
                            dispatch(
                                handlePromotionDataChange({
                                    name: "contractGroups",
                                    value: selContractGroups,
                                    index: 0,
                                })
                            );
                        }}
                        randomIndex={0 + "contractGroups"}
                    />
                </div>
            </div>
            <div className="flex flex-col justify-start items-center ">
                <label htmlFor="">Valid Days *</label>
                <div className="flex items-center gap-[2px]">
                    {days?.map((day, indexs) => {
                        return (
                            <span
                                key={indexs}
                                className={
                                    "w-[25px] h-[25px] text-white cursor-pointer capitalize rounded flex items-center justify-center " +
                                    (validDays?.includes(day) ? "bg-orange-500" : "bg-gray-500")
                                }
                                name="validDays"
                                onClick={() => {
                                    dispatch(
                                        handleValidDaysChange({
                                            value: day,
                                        })
                                    );
                                }}
                            >
                                {day?.slice(0, 1)}
                            </span>
                        );
                    })}
                </div>
            </div>
            <div className="flex items-center justify-start gap-[10px] min-h-[40px]">
                <input
                    type="checkbox"
                    name="specificNations"
                    checked={data?.specificNations || false}
                    onChange={handleChkBoxChange}
                    className="w-[17px] h-[17px]"
                    id="specificNations"
                />
                <label htmlFor="specificNations" className="mb-0">
                    Specific Market
                </label>
            </div>
            {data?.specificNations === true && (
                <div>
                    <label htmlFor="market">Markets</label>
                    <MultipleSelectDropdown
                        data={countries}
                        displayName={"countryName"}
                        valueName={"isocode"}
                        selectedData={data?.applicableNations}
                        setSelectedData={(selMarkets) => {
                            dispatch(
                                handlePromotionDataChange({
                                    name: "applicableNations",
                                    value: selMarkets,
                                })
                            );
                        }}
                        randomIndex={0 + "applicableNations"}
                    />
                </div>
            )}
            <div>
                <label htmlFor="">Sell From *</label>
                <input
                    type="date"
                    name="sellFrom"
                    value={data.sellFrom || ""}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="">Sell To *</label>
                <input
                    type="date"
                    name="sellTo"
                    value={data.sellTo || ""}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="">Booking Window From *</label>
                <input
                    type="date"
                    name="bookingWindowFrom"
                    value={data.bookingWindowFrom || ""}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="">Booking Window To *</label>
                <input
                    type="date"
                    name="bookingWindowTo"
                    value={data.bookingWindowTo || ""}
                    onChange={handleChange}
                />
            </div>
            <div className="flex items-center justify-left gap-3">
                <input
                    type="checkbox"
                    name="isCombinedPromotion"
                    checked={data?.isCombinedPromotion}
                    onChange={handleChkBoxChange}
                    className="w-[17px] h-[17px] flex item-center justify-center"
                    id="isCombinedPromotion"
                />
                <label htmlFor="isCombinedPromotion" className="mb-0">
                    Is Combined Promotion
                </label>
            </div>
            <div>
                <label htmlFor="basePlan">
                    Combined Promotions
                    {data?.isCombinedPromotion === true ? " *" : ""}
                </label>
                <div>
                    <div>
                        <MultipleSelectDropdown
                            data={promotions}
                            displayName={"name"}
                            valueName={"_id"}
                            selectedData={data?.combinedPromotions}
                            setSelectedData={(selPromotions) => {
                                dispatch(
                                    handlePromotionDataChange({
                                        name: "combinedPromotions",
                                        value: selPromotions,
                                        index: 0,
                                    })
                                );
                            }}
                            randomIndex={0 + "promotions"}
                        />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center gap-3">
                <input
                    type="checkbox"
                    name="isFeatured"
                    checked={data?.isFeatured}
                    onChange={handleChkBoxChange}
                    className="w-[17px] h-[17px] flex item-center justify-center"
                    id="isFeatured"
                />
                <label htmlFor="isFeatured" className="mb-0">
                    Is Featured
                </label>
            </div>
            <div>
                <label htmlFor="basePlan">Featured Note</label>
                <div>
                    <input
                        type="text"
                        name="featuredNote"
                        value={data.featuredNote || ""}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="flex items-center justify-center gap-3">
                <input
                    type="checkbox"
                    name="applicableOnRatePromotion"
                    checked={data?.applicableOnRatePromotion}
                    onChange={handleChkBoxChange}
                    className="w-[17px] h-[17px] flex item-center justify-center"
                    id="applicableOnRatePromotion"
                />
                <label htmlFor="applicableOnRatePromotion" className="mb-0">
                    Applicable On Rate Promotion
                </label>
            </div>
            <div className="flex items-center justify-left gap-3">
                <input
                    type="checkbox"
                    name="isActive"
                    checked={data?.isActive}
                    onChange={handleChkBoxChange}
                    className="w-[17px] h-[17px] flex item-center justify-center"
                    id="isActive"
                />
                <label htmlFor="isActive" className="mb-0">
                    Is Active
                </label>
            </div>
        </div>
    );
}
