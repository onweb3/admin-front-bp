import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Toggle } from "../../../components";
import { handlePromotionDataChange } from "../../../redux/slices/hotelPromotionsFormSlice";

export default function PromotionalTypesForm({ isEditPermission = true }) {
    const { data } = useSelector((state) => state.hotelPromotionsForm);
    const dispatch = useDispatch();

    return (
        <div className={"p-4 " + (isEditPermission ? "pointer-events-auto" : "pointer-events-none")}>
            <h3 className="font-medium mb-2">Promotion Types</h3>
            <div className="grid grid-cols-6 gap-3">
                <div className="relative">
                    <label htmlFor="">Discount</label>
                    <Toggle
                        name="isDiscountAvailable"
                        value={data.isDiscountAvailable}
                        onChange={(e) => {
                            dispatch(
                                handlePromotionDataChange({
                                    name: "isDiscountAvailable",
                                    value: e.target.checked,
                                })
                            );
                        }}
                    />
                </div>
                <div className="relative">
                    <label htmlFor="">Stay Pay</label>
                    <Toggle
                        name="isStayPayAvailable"
                        value={data.isStayPayAvailable}
                        onChange={(e) => {
                            dispatch(
                                handlePromotionDataChange({
                                    name: "isStayPayAvailable",
                                    value: e.target.checked,
                                })
                            );
                        }}
                    />
                </div>
                <div className="relative">
                    <label htmlFor="">Service Upgrade</label>
                    <Toggle
                        name="isRoomTypeUpgradeAvailable"
                        value={data.isRoomTypeUpgradeAvailable}
                        onChange={(e) => {
                            dispatch(
                                handlePromotionDataChange({
                                    name: "isRoomTypeUpgradeAvailable",
                                    value: e.target.checked,
                                })
                            );
                        }}
                    />
                </div>
                <div className="relative">
                    <label htmlFor="">Meal Upgrade</label>
                    <Toggle
                        name="isMealUpgradeAvailable"
                        value={data.isMealUpgradeAvailable}
                        onChange={(e) => {
                            dispatch(
                                handlePromotionDataChange({
                                    name: "isMealUpgradeAvailable",
                                    value: e.target.checked,
                                })
                            );
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
