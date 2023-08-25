import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addStayPaysRows,
    deletePromotionItemRow,
    handlePromotionDataChange,
    handlePromotionRowDataChange,
} from "../../../redux/slices/hotelPromotionsFormSlice";
import { MultipleSelectDropdown } from "../../../components";

export default function PromoStayPayForm() {
    const dispatch = useDispatch();

    const { stayPays, boardTypes, roomTypes, data } = useSelector(
        (state) => state.hotelPromotionsForm
    );

    const handleInpChange = (e) => {
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

    const handleChange = (e, index) => {
        dispatch(
            handlePromotionRowDataChange({
                typeName: "stayPays",
                index,
                name: e.target.name,
                value: e.target.value,
            })
        );
    };

    return (
        <div className="p-4">
            <div className="grid grid-cols-4 gap-3 mb-6">
                <div>
                    <label htmlFor="basePlan">Stay Pay Free On </label>
                    <select
                        id=""
                        name="stayPayFreeOn"
                        value={data.stayPayFreeOn || ""}
                        onChange={handleInpChange}
                    >
                        <option value="" hidden>
                            Select Stay Pay Free On
                        </option>
                        <option value="cheapest">Cheapest</option>
                        <option value="first-night">First Night</option>
                        <option value="last-night">Last Night</option>
                        <option value="highest">Highest</option>
                    </select>
                </div>
                <div className="flex items-center justify-center gap-3">
                    <input
                        type="checkbox"
                        name="multipleStayPay"
                        checked={data?.multipleStayPay}
                        onChange={handleChkBoxChange}
                        className="w-[17px] h-[17px] flex item-center justify-center"
                        id="multipleStayPay"
                    />
                    <label htmlFor="multipleStayPay" className="mb-0">
                        Multiple Stay Pay
                    </label>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                        <tr>
                            <th className="p-2 border w-[35px]">
                                <div className="flex items-center justify-center">
                                    <button
                                        className="w-[25px] h-[25px] rounded-full bg-green-500"
                                        onClick={() =>
                                            dispatch(addStayPaysRows())
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                            </th>
                            <th className="font-[500] p-2 border">Rate Code</th>
                            <th className="font-[500] p-2 border">From Date</th>
                            <th className="font-[500] p-2 border">To Date</th>
                            <th className="font-[500] p-2 border">
                                Book Before
                            </th>
                            <th className="font-[500] p-2 border">
                                Board Types
                            </th>

                            <th className="font-[500] p-2 border">
                                Room Types
                            </th>
                            <th className="font-[500] p-2 border">Stay</th>
                            <th className="font-[500] p-2 border">Free</th>
                            {/* <th className="font-[500] p-2 border">Market</th> */}
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {stayPays.map((stayPay, index) => (
                            <tr className="border-b border-tableBorderColor">
                                <td className="p-2 border w-[35px] min-w-[35px]">
                                    <div className="flex items-center justify-center">
                                        <button
                                            className="w-[25px] h-[25px] rounded-full bg-red-500"
                                            onClick={() => {
                                                dispatch(
                                                    deletePromotionItemRow({
                                                        name: "stayPays",
                                                        index,
                                                    })
                                                );
                                            }}
                                        >
                                            -
                                        </button>
                                    </div>
                                </td>
                                <td className="border w-[100px] min-w-[100px]">
                                    <input
                                        type="text"
                                        name="rateCode"
                                        value={stayPay?.rateCode || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    />
                                </td>
                                <td className="border w-[140px] min-w-[140px]">
                                    <input
                                        type="date"
                                        name="fromDate"
                                        value={stayPay?.fromDate || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%]  px-2 border-0"
                                    />
                                </td>
                                <td className="border w-[140px] min-w-[140px]">
                                    <input
                                        type="date"
                                        name="toDate"
                                        value={stayPay?.toDate || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%]  px-2 border-0"
                                    />
                                </td>
                                <td className="border w-[100px] min-w-[100px]">
                                    <input
                                        type="number"
                                        name="bookBefore"
                                        value={stayPay?.bookBefore}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    />
                                </td>

                                <td className="border w-[180px] min-w-[180px]">
                                    <div>
                                        <MultipleSelectDropdown
                                            data={boardTypes}
                                            displayName={"boardName"}
                                            valueName={"_id"}
                                            selectedData={stayPay.boardTypes}
                                            setSelectedData={(
                                                selBoardTypes
                                            ) => {
                                                dispatch(
                                                    handlePromotionRowDataChange(
                                                        {
                                                            typeName:
                                                                "stayPays",
                                                            name: "boardTypes",
                                                            value: selBoardTypes,
                                                            index,
                                                        }
                                                    )
                                                );
                                            }}
                                            randomIndex={index + "stayPays"}
                                        />
                                    </div>
                                </td>
                                <td className="border w-[180px] min-w-[180px]">
                                    <div>
                                        <MultipleSelectDropdown
                                            data={roomTypes}
                                            displayName={"roomName"}
                                            valueName={"_id"}
                                            selectedData={stayPay.roomTypes}
                                            setSelectedData={(
                                                selBoardTypes
                                            ) => {
                                                dispatch(
                                                    handlePromotionRowDataChange(
                                                        {
                                                            typeName:
                                                                "stayPays",
                                                            name: "roomTypes",
                                                            value: selBoardTypes,
                                                            index,
                                                        }
                                                    )
                                                );
                                            }}
                                            randomIndex={index + "stayPays"}
                                        />
                                    </div>
                                </td>
                                <td className="border w-[70px] min-w-[70px]">
                                    <input
                                        type="number"
                                        name="stayCount"
                                        value={stayPay?.stayCount}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    />
                                </td>
                                <td className="border w-[70px] min-w-[70px]">
                                    <input
                                        type="number"
                                        name="freeCount"
                                        value={stayPay?.freeCount}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
