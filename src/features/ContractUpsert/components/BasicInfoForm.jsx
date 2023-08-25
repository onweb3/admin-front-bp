import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { handleContractDataChange } from "../../../redux/slices/hotelContractSlice";
import { MultipleSelectDropdown, SelectDropdown } from "../../../components";
import { useParams } from "react-router-dom";

export default function BasicInfoForm() {
    const dispatch = useDispatch();
    const { data, boardTypes, markets, contracts } = useSelector(
        (state) => state.hotelContractForm
    );
    const { countries } = useSelector((state) => state.general);
    const { contractId } = useParams();

    const filteredContracts =
        contracts?.filter((item) => {
            return item?._id !== contractId;
        }) || [];

    const handleInpChange = (e) => {
        dispatch(
            handleContractDataChange({
                name: e.target.name,
                value: e.target.value,
            })
        );
    };

    const handleChkChange = (e) => {
        dispatch(
            handleContractDataChange({
                name: e.target.name,
                value: e.target.checked,
            })
        );
    };

    return (
        <div className="p-4 grid grid-cols-4 gap-3">
            <div>
                <label htmlFor="basePlan">Base Plan</label>
                <select
                    id=""
                    name="basePlan"
                    value={data?.basePlan || ""}
                    onChange={handleInpChange}
                >
                    <option value="" hidden>
                        Select Base Plan
                    </option>
                    {boardTypes.map((boardType, index) => (
                        <option key={index} value={boardType?._id}>
                            {boardType?.boardName}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="rateName">Rate Name</label>
                <input
                    type="text"
                    name="rateName"
                    value={data.rateName || ""}
                    onChange={handleInpChange}
                    placeholder="Ex: sample contract"
                />
            </div>
            <div>
                <label htmlFor="rateCode">Rate Code</label>
                <input
                    type="text"
                    name="rateCode"
                    value={data.rateCode || ""}
                    onChange={handleInpChange}
                    placeholder="Ex: EXP001"
                />
            </div>
            <div>
                <label htmlFor="priority">Priority</label>
                <input
                    type="number"
                    name="priority"
                    value={!isNaN(data.priority) ? data.priority : ""}
                    onChange={handleInpChange}
                    placeholder="0"
                />
            </div>
            <div>
                <label htmlFor="sellFrom">Sell From</label>
                <input
                    type="date"
                    name="sellFrom"
                    value={data.sellFrom || ""}
                    onChange={handleInpChange}
                />
            </div>
            <div>
                <label htmlFor="sellTo">Sell To</label>
                <input
                    type="date"
                    name="sellTo"
                    value={data.sellTo || ""}
                    onChange={handleInpChange}
                />
            </div>
            <div>
                <label htmlFor="checkIn">Check In</label>
                <input
                    type="time"
                    name="checkInTime"
                    value={data.checkInTime || ""}
                    onChange={handleInpChange}
                />
            </div>
            <div>
                <label htmlFor="checkOut">Check Out</label>
                <input
                    type="time"
                    name="checkOutTime"
                    value={data.checkOutTime || ""}
                    onChange={handleInpChange}
                />
            </div>
            <div className="flex items-center justify-start gap-[10px] min-h-[40px]">
                <input
                    type="checkbox"
                    name="isSpecialRate"
                    checked={data?.isSpecialRate}
                    onChange={handleChkChange}
                    className="w-[17px] h-[17px]"
                    id="isSpecialRate"
                />
                <label htmlFor="isSpecialRate" className="mb-0">
                    Is Special Rate
                </label>
            </div>
            {data?.isSpecialRate === true && (
                <>
                    <div>
                        <label htmlFor="">Parent Contract</label>
                        <SelectDropdown
                            data={filteredContracts}
                            placeholder={"Select Parent Contract"}
                            displayName={"rateName"}
                            bracketValue={"rateCode"}
                            selectedData={data?.parentContract}
                            setSelectedData={(val) =>
                                dispatch(
                                    handleContractDataChange({
                                        name: "parentContract",
                                        value: val,
                                    })
                                )
                            }
                            valueName={"_id"}
                        />
                    </div>
                    <div>
                        <label htmlFor="">Booking Window From</label>
                        <input
                            type="date"
                            name="bookingWindowFrom"
                            value={data.bookingWindowFrom || ""}
                            onChange={handleInpChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="">Booking Window To</label>
                        <input
                            type="date"
                            name="bookingWindowTo"
                            value={data.bookingWindowTo || ""}
                            onChange={handleInpChange}
                        />
                    </div>
                </>
            )}

            <div className="flex items-center justify-start gap-[10px] min-h-[40px]">
                <input
                    type="checkbox"
                    name="isTourismFeeIncluded"
                    checked={data?.isTourismFeeIncluded}
                    onChange={handleChkChange}
                    className="w-[17px] h-[17px]"
                    id="isTourismFeeIncluded"
                />
                <label htmlFor="isTourismFeeIncluded" className="mb-0">
                    Is Tourism Fee Included
                </label>
            </div>
            <div className="flex items-center justify-start gap-[10px] min-h-[40px]">
                <input
                    type="checkbox"
                    name="isActive"
                    checked={data?.isActive}
                    onChange={handleChkChange}
                    className="w-[17px] h-[17px]"
                    id="isActive"
                />
                <label htmlFor="isActive" className="mb-0">
                    Is Active
                </label>
            </div>
            <div className="flex items-center justify-start gap-[10px] min-h-[40px]">
                <input
                    type="checkbox"
                    name="applyPromotion"
                    checked={data?.applyPromotion}
                    onChange={handleChkChange}
                    className="w-[17px] h-[17px]"
                    id="applyPromotion"
                />
                <label htmlFor="applyPromotion" className="mb-0">
                    Apply Promotion
                </label>
            </div>
            <div>
                <div className="flex items-center justify-start gap-[10px] min-h-[40px]">
                    <input
                        type="checkbox"
                        name="specificNations"
                        checked={data?.specificNations || false}
                        onChange={handleChkChange}
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
                                    handleContractDataChange({
                                        name: "applicableNations",
                                        value: selMarkets,
                                    })
                                );
                            }}
                            randomIndex={0 + "applicableNations"}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
