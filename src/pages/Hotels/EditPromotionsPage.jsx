import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    PromotionBasicForm,
    PromotionalTypesForm,
    PromoMealUpgradeForm,
    PromoRoomTypeUpgradeForm,
    PromoCancellationForm,
    PromoDiscountForm,
    PromoRoomDiscountForm,
    PromoStayPayForm,
    PromotionEditFormButtons,
    PromoExcludedDatesForm,
} from "../../features/HotelPromotion";
import {
    fetchInitialDataWithPromotion,
    resetPromotionForm,
} from "../../redux/slices/hotelPromotionsFormSlice";
import { PageLoader } from "../../components";
import { hasPermission } from "../../utils";

const sections = {
    "-discount": "Discount",
    "-staypay": "StayPay",
    "-roomtype-upgrade": "Room Type Upgrade",
    "-meal-upgrade": "Meal Upgrade",
    // "-room-discount": "Room Discount",
    "-excluded-dates": "Excluded Dates",
    "-cancel-policy": "Cancellation Policy",
    // "-tandc": "Terms & Conditions",
};

export default function EditPromotionPage() {
    const [selectedSection, setSelectedSection] = useState("-discount");

    const { id, promotionId } = useParams();

    const dispatch = useDispatch();
    const { admin } = useSelector((state) => state.admin);
    const { data, isPromotionLoading } = useSelector((state) => state.hotelPromotionsForm);

    const isEditPermission = hasPermission({
        roles: admin?.roles,
        name: "contracts",
        permission: "update",
    });

    useEffect(() => {
        dispatch(fetchInitialDataWithPromotion({ promotionId, id }));
    }, []);

    useEffect(() => {
        return () => dispatch(resetPromotionForm());
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Edit Promotion</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/hotels" className="text-textColor">
                        Hotels
                    </Link>
                    <span>{">"} </span>
                    <Link to="/" className="text-textColor">
                        {id?.slice(0, 3)}...{id?.slice(-3)}{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Promotions </span>
                    <span>{">"} </span>
                    <span>Edit </span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm p-[10px]">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">Edit Promotion</h1>
                    </div>

                    {isPromotionLoading ? (
                        <PageLoader />
                    ) : (
                        <>
                            <PromotionBasicForm isEditPermission={isEditPermission} />
                            <PromotionalTypesForm isEditPermission={isEditPermission} />

                            <div className="p-4">
                                <ul className="dir-btn">
                                    {Object.keys(sections)?.map((section, index) => {
                                        if (
                                            (section === "-discount" &&
                                                data?.isDiscountAvailable === false) ||
                                            (section === "-staypay" && data?.isStayPayAvailable === false) ||
                                            (section === "-roomtype-upgrade" &&
                                                data?.isRoomTypeUpgradeAvailable === false) ||
                                            (section === "-meal-upgrade" &&
                                                data?.isMealUpgradeAvailable === false)
                                        ) {
                                            return <React.Fragment key={index}></React.Fragment>;
                                        }

                                        return (
                                            <li
                                                key={index}
                                                className={selectedSection === section ? "active" : ""}
                                                onClick={() => {
                                                    setSelectedSection(section);
                                                }}
                                            >
                                                <span>{sections[section]}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            {data.isDiscountAvailable && selectedSection === "-discount" && (
                                <PromoDiscountForm isEditPermission={isEditPermission} />
                            )}
                            {data.isStayPayAvailable && selectedSection === "-staypay" && (
                                <PromoStayPayForm isEditPermission={isEditPermission} />
                            )}
                            {data.isRoomTypeUpgradeAvailable && selectedSection === "-roomtype-upgrade" && (
                                <PromoRoomTypeUpgradeForm isEditPermission={isEditPermission} />
                            )}
                            {data.isMealUpgradeAvailable && selectedSection === "-meal-upgrade" && (
                                <PromoMealUpgradeForm isEditPermission={isEditPermission} />
                            )}
                            {/* {selectedSection === "-room-discount" && (
                                    <PromoRoomDiscountForm />
                            )} */}
                            {selectedSection === "-excluded-dates" && (
                                <PromoExcludedDatesForm isEditPermission={isEditPermission} />
                            )}
                            {selectedSection === "-cancel-policy" && (
                                <PromoCancellationForm isEditPermission={isEditPermission} />
                            )}
                            {/* {selectedSection === "-tandc" && <PromoStayPayForm />} */}
                            <PromotionEditFormButtons isEditPermission={isEditPermission} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
