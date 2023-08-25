import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import axios from "../../../axios";
import { BtnLoader } from "../../../components";

export default function PromotionEditFormButtons() {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { jwtToken } = useSelector((state) => state.admin);
    const {
        data,
        validDays,
        discounts,
        stayPays,
        roomTypeUpgrades,
        mealUpgrades,
        roomDiscounts,
        cancellationPolicies,
    } = useSelector((state) => state.hotelPromotionsForm);
    const navigate = useNavigate();
    const { id, promotionId } = useParams();

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            setError("");

            let formData = {
                ...data,
                hotel: id,
                validDays,
                roomDiscounts,
                cancellationPolicies,
                discounts,
                stayPays,
                mealUpgrades,
                roomTypeUpgrades,
            };

            await axios.patch(
                `/hotels/promotions/update/${promotionId}`,
                formData,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
            navigate(-1);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    return (
        <div>
            {error && (
                <span className="text-sm text-red-500 block mt-4">{error}</span>
            )}

            <div className="mt-4 flex items-center justify-end gap-[12px]">
                <button
                    className="bg-slate-300 text-textColor px-[15px]"
                    type="button"
                    onClick={() => navigate(-1)}
                >
                    Cancel
                </button>
                <button
                    className="w-[100px] bg-primaryColor"
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? <BtnLoader /> : "Update"}
                </button>
            </div>
        </div>
    );
}
