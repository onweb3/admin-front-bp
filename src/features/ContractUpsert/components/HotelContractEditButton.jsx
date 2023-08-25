import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import axios from "../../../axios";
import { BtnLoader } from "../../../components";
import { hasPermission } from "../../../utils";

export default function HotelContractEditButtons({
    next,
    prev,
    goForward,
    goBack,
}) {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { jwtToken, admin } = useSelector((state) => state.admin);
    const {
        data,
        roomRates,
        mealSupplements,
        cancellationPolicies,
        extraSupplements,
        childPolicies,
        childMealPolicies,
    } = useSelector((state) => state.hotelContractForm);
    const navigate = useNavigate();
    const { contractGroupId, contractId } = useParams();

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            setError("");

            let formData = {
                ...data,
                contractGroup: contractGroupId,
                roomRates,
                mealSupplements,
                cancellationPolicies,
                extraSupplements,
                childPolicies,
                // childMealPolicies,
            };

            await axios.patch(
                `/hotels/contracts/update/${contractId}`,
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
        <div className="p-4">
            {error && (
                <span className="text-sm text-red-500 block mt-4">{error}</span>
            )}

            <div className="flex items-center justify-end gap-[12px]">
                {prev ? (
                    <button
                        className="bg-slate-300 text-textColor px-[15px]"
                        type="button"
                        onClick={goBack}
                    >
                        Back
                    </button>
                ) : (
                    <button
                        className="bg-slate-300 text-textColor px-[15px]"
                        type="button"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                )}
                {hasPermission({
                    roles: admin?.roles,
                    name: "contracts",
                    permission: "update",
                }) && (
                    <button
                        className="w-[100px] bg-primaryColor"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? <BtnLoader /> : "Update"}
                    </button>
                )}
                {next && (
                    <button
                        className="w-[100px] bg-primaryColor"
                        type="button"
                        onClick={goForward}
                    >
                        next
                    </button>
                )}
            </div>
        </div>
    );
}
