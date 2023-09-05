import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { AiOutlineCloudDownload, AiOutlineMail, AiOutlinePhone } from "react-icons/ai";

import { PageLoader } from "../../components";
import axios from "../../axios";
import { formatDate } from "../../utils";
import { HotelReservationCancelModal, HotelReservationConfirmModal } from "../../features/Hotels";
import { config } from "../../constants";

export default function HotelOrderDetailsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [hotelOrder, setHotelOrder] = useState({});
    const [isConfirmModalOpen, setIsConfirmModal] = useState(false);
    const [isCancelModalOpen, setIsCancelModal] = useState(false);

    const { jwtToken } = useSelector((state) => state.admin);
    const { id } = useParams();

    const fetchHotelOrder = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`/hotels/orders/b2b/single/${id}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setHotelOrder(response.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchHotelOrder();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Hotel Order Details</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/hotels" className="text-textColor">
                        Hotels{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/reservations" className="text-textColor">
                        Reservations{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {id?.slice(0, 3)}...{id?.slice(-3)}
                    </span>
                </div>
            </div>

            {isLoading ? (
                <PageLoader />
            ) : (
                <div>
                    <div className="p-6 pb-0">
                        <div
                            className={
                                "w-full rounded shadow-sm p-3 " +
                                (hotelOrder?.status === "cancelled"
                                    ? "bg-[#f065481A] text-[#f06548]"
                                    : hotelOrder?.status === "confirmed"
                                    ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                    : "bg-[#f7b84b1A] text-[#f7b84b]")
                            }
                        >
                            <span className="capitalize font-medium text-[15px]">
                                {hotelOrder?.status === "cancel-pending"
                                    ? "Order cancellation request recieved from B2B"
                                    : `Hotel Order ${hotelOrder?.status}`}
                                .
                            </span>
                            <span className="text-sm ml-3">
                                ({formatDate(hotelOrder.lastStatusChange, true)})
                            </span>
                            {hotelOrder?.status === "cancelled" && (
                                <span className="block text-sm mt-1">
                                    {hotelOrder?.cancellationRemark}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="bg-white p-4 shadow-sm rounded">
                            <div className="flex items-start justify-between gap-[20px]">
                                <div className="flex gap-[20px]">
                                    <div className="w-[200px] h-[100px] rounded overflow-hidden">
                                        <img
                                            src={
                                                hotelOrder?.hotel?.images[0]?.isRelative
                                                    ? config.SERVER_URL +
                                                      hotelOrder?.hotel?.images[0]?.path
                                                    : hotelOrder?.hotel?.images[0]?.path
                                            }
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h1 className="font-[600] text-lg">
                                            {hotelOrder?.referenceNumber}
                                        </h1>
                                        <span className="block text-sm text-grayColor mt-1">
                                            {formatDate(hotelOrder?.createdAt, true)}
                                        </span>
                                        <span className="block mt-2 font-[500] text-sm">
                                            <Link
                                                to={`/b2b/${hotelOrder?.reseller?._id}/details`}
                                                className="underline text-blue-500"
                                            >
                                                {hotelOrder?.reseller?.companyName}
                                            </Link>{" "}
                                            - ({hotelOrder?.reseller?.agentCode})
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-[25px]">
                                    <div className="text-center">
                                        <span className="block text-sm text-grayColor font-medium">
                                            Net Price
                                        </span>
                                        <span className="font-[600] text-lg">
                                            {hotelOrder?.netPrice} AED
                                        </span>
                                    </div>
                                    <div>
                                        {hotelOrder?.status === "booked" ||
                                        hotelOrder?.status === "cancel-pending" ? (
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <select
                                                    className="h-[35px] py-0 w-[90px] capitalize"
                                                    onChange={(e) => {
                                                        if (e.target.value === "confirm") {
                                                            setIsConfirmModal(true);
                                                        } else if (e.target.value === "cancel") {
                                                            setIsCancelModal(true);
                                                        }
                                                    }}
                                                    value={hotelOrder.status}
                                                >
                                                    <option value="" hidden>
                                                        {hotelOrder.status}
                                                    </option>
                                                    {hotelOrder?.status === "booked" && (
                                                        <option value="confirm">Confirm</option>
                                                    )}
                                                    <option value="cancel">Cancel</option>
                                                </select>
                                                {isConfirmModalOpen && (
                                                    <HotelReservationConfirmModal
                                                        setIsConfirmModal={setIsConfirmModal}
                                                        orderId={hotelOrder?._id}
                                                        setOrderData={setHotelOrder}
                                                    />
                                                )}
                                                {isCancelModalOpen && (
                                                    <HotelReservationCancelModal
                                                        setIsCancelModal={setIsCancelModal}
                                                        orderId={hotelOrder?._id}
                                                        setOrderData={setHotelOrder}
                                                        netPrice={hotelOrder?.netPrice}
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            <span
                                                className={
                                                    "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                                    (hotelOrder?.status === "cancelled"
                                                        ? "bg-[#f065481A] text-[#f06548]"
                                                        : hotelOrder?.status === "confirmed"
                                                        ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                                        : "bg-[#f7b84b1A] text-[#f7b84b]")
                                                }
                                            >
                                                {hotelOrder?.status}
                                            </span>
                                        )}
                                    </div>
                                    <button className="px-3 bg-[#299cdb] flex items-center gap-2">
                                        <span className="text-lg">
                                            <AiOutlineCloudDownload />
                                        </span>
                                        Download
                                    </button>
                                </div>
                            </div>
                            <div className="mt-6 grid grid-cols-2 gap-6 w-full">
                                <div>
                                    <table className="w-full text-[15px]">
                                        <tbody>
                                            <tr className="odd:bg-[#f3f6f9]">
                                                <td className="p-2 w-[180px]">Supplier</td>
                                                <td className="p-2 font-medium uppercase text-green-500">
                                                    {hotelOrder?.supplier}
                                                </td>
                                            </tr>
                                            <tr className="odd:bg-[#f3f6f9]">
                                                <td className="p-2 w-[180px]">Hotel</td>
                                                <td className="p-2">
                                                    {hotelOrder?.hotel?.hotelName}
                                                </td>
                                            </tr>
                                            <tr className="odd:bg-[#f3f6f9]">
                                                <td className="p-2">CheckIn Date</td>
                                                <td className="p-2">
                                                    {formatDate(hotelOrder?.fromDate)}
                                                </td>
                                            </tr>
                                            <tr className="odd:bg-[#f3f6f9]">
                                                <td className="p-2">CheckOut Date</td>
                                                <td className="p-2">
                                                    {formatDate(hotelOrder?.toDate)}
                                                </td>
                                            </tr>
                                            <tr className="odd:bg-[#f3f6f9]">
                                                <td className="p-2">Room Type</td>
                                                <td className="p-2 capitalize">
                                                    {hotelOrder?.roomType?.roomName}
                                                </td>
                                            </tr>
                                            <tr className="odd:bg-[#f3f6f9]">
                                                <td className="p-2">Board Type</td>
                                                <td className="p-2 capitalize">
                                                    {hotelOrder?.boardType?.boardName} (
                                                    {hotelOrder?.boardType?.boardShortName})
                                                </td>
                                            </tr>
                                            <tr className="odd:bg-[#f3f6f9]">
                                                <td className="p-2">Base Plan</td>
                                                <td className="p-2 capitalize">
                                                    {hotelOrder?.basePlan
                                                        ? `${hotelOrder?.basePlan?.boardName} (${hotelOrder?.basePlan?.boardShortName})`
                                                        : "N/A"}
                                                </td>
                                            </tr>
                                            <tr className="odd:bg-[#f3f6f9]">
                                                <td className="p-2">Meal Supplement</td>
                                                <td className="p-2">
                                                    {hotelOrder?.extraMealSupplement
                                                        ? `${hotelOrder?.extraMealSupplement?.boardName} (${hotelOrder?.extraMealSupplement?.boardShortName})`
                                                        : "N/A"}
                                                </td>
                                            </tr>
                                            <tr className="odd:bg-[#f3f6f9]">
                                                <td className="p-2">Special Request</td>
                                                <td className="p-2">
                                                    {hotelOrder?.specialRequest
                                                        ? hotelOrder?.specialRequest
                                                        : "N/A"}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div>
                                        {hotelOrder?.mandatoryAddOns?.length > 0 && (
                                            <div className="mt-7">
                                                <h1 className="font-[600] flex items-center gap-[10px] text-[15px] mb-2">
                                                    <BsFillArrowRightCircleFill /> Mandatory Add Ons
                                                </h1>
                                                <ul className="list-disc pl-4 text-[15px] leading-[26px]">
                                                    {hotelOrder?.mandatoryAddOns?.map(
                                                        (addOn, index) => {
                                                            return (
                                                                <li key={index}>
                                                                    {addOn?.addOnName} - (
                                                                    {addOn?.dates?.map(
                                                                        (date, dtIndex) => (
                                                                            <span key={dtIndex}>
                                                                                {formatDate(date)}
                                                                                {dtIndex !==
                                                                                    addOn?.dates
                                                                                        ?.length -
                                                                                        1 && ", "}
                                                                            </span>
                                                                        )
                                                                    )}
                                                                    )
                                                                </li>
                                                            );
                                                        }
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                        {hotelOrder?.addOnSupplements?.length > 0 && (
                                            <div className="mt-7">
                                                <h1 className="font-[600] flex items-center gap-[10px] text-[15px] mb-2">
                                                    <BsFillArrowRightCircleFill /> Supplement Add
                                                    Ons
                                                </h1>
                                                <ul className="list-disc pl-4 text-[15px] leading-[26px]">
                                                    {hotelOrder?.addOnSupplements?.map(
                                                        (addOn, index) => {
                                                            return (
                                                                <li key={index}>
                                                                    {addOn?.addOnName} - (all days)
                                                                </li>
                                                            );
                                                        }
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                        {hotelOrder?.appliedPromotions?.length > 0 && (
                                            <div className="mt-7">
                                                <h1 className="font-[600] flex items-center gap-[10px] text-[15px] mb-2">
                                                    <BsFillArrowRightCircleFill /> Applied
                                                    Promotions
                                                </h1>
                                                <ul className="list-disc pl-4 text-[15px] leading-[26px]">
                                                    {hotelOrder?.appliedPromotions?.map(
                                                        (item, itemIndex) => {
                                                            return <li key={itemIndex}>{item}</li>;
                                                        }
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                        <div className="mt-7">
                                            <h1 className="font-[600] flex items-center gap-[10px] text-[15px] mb-2">
                                                <BsFillArrowRightCircleFill /> Contact Details
                                            </h1>
                                            <div className="flex gap-[25px] flex-wrap text-[15px]">
                                                <div className="flex items-center gap-[10px]">
                                                    <span>
                                                        <AiOutlineMail />
                                                    </span>
                                                    {hotelOrder?.contactDetails?.email}
                                                </div>
                                                <div className="flex items-center gap-[10px]">
                                                    <span>
                                                        <AiOutlinePhone />
                                                    </span>
                                                    {hotelOrder?.contactDetails?.country?.phonecode}{" "}
                                                    {hotelOrder?.contactDetails?.phoneNumber}
                                                </div>
                                            </div>
                                        </div>
                                        {hotelOrder?.status === "cancelled" && (
                                            <div className="mt-7">
                                                <h1 className="font-[600] flex items-center gap-[10px] text-[15px] mb-2">
                                                    <BsFillArrowRightCircleFill /> Order Cancelled
                                                </h1>
                                                <div>
                                                    <table className="w-full text-[15px]">
                                                        <tbody>
                                                            <tr className="odd:bg-[#f3f6f9]">
                                                                <td className="p-2">
                                                                    Cancelled By
                                                                </td>
                                                                <td className="p-2">
                                                                    {hotelOrder?.cancelledBy}
                                                                </td>
                                                            </tr>
                                                            <tr className="odd:bg-[#f3f6f9]">
                                                                <td className="p-2">
                                                                    Cancellation Charge
                                                                </td>
                                                                <td className="p-2">
                                                                    {hotelOrder?.cancellationCharge}
                                                                </td>
                                                            </tr>
                                                            <tr className="odd:bg-[#f3f6f9]">
                                                                <td className="p-2">
                                                                    Cancellation Remark
                                                                </td>
                                                                <td className="p-2">
                                                                    {hotelOrder?.cancellationRemark}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                        {hotelOrder?.isApiConnected === false && (
                                            <div className="mt-7">
                                                <h1 className="font-[600] flex items-center gap-[10px] text-[15px] mb-2">
                                                    <BsFillArrowRightCircleFill /> Contracts By Day
                                                </h1>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-[14px]">
                                                        <tbody>
                                                            <tr className="odd:bg-[#f3f6f9]">
                                                                <td className="p-2 text-sm text-grayColor font-medium">
                                                                    Date
                                                                </td>
                                                                <td className="p-2 text-sm text-grayColor font-medium">
                                                                    Contract
                                                                </td>
                                                                <td className="p-2 text-sm text-grayColor font-medium">
                                                                    Special Rate
                                                                </td>
                                                                <td className="p-2 text-sm text-grayColor font-medium">
                                                                    Room Price
                                                                </td>
                                                                <td className="p-2 text-sm text-grayColor font-medium">
                                                                    Meal Supp Price
                                                                </td>
                                                                <td className="p-2 text-sm text-grayColor font-medium">
                                                                    Ex.Bed Price
                                                                </td>
                                                                <td className="p-2 text-sm text-grayColor font-medium">
                                                                    Chd suppl Price
                                                                </td>
                                                                <td className="p-2 text-sm text-grayColor font-medium">
                                                                    Net Price
                                                                </td>
                                                            </tr>
                                                            {hotelOrder?.contracts?.map(
                                                                (contract, index) => {
                                                                    return (
                                                                        <tr
                                                                            key={index}
                                                                            className="odd:bg-[#f3f6f9]"
                                                                        >
                                                                            <td className="p-2">
                                                                                {formatDate(
                                                                                    contract?.date
                                                                                )}
                                                                            </td>
                                                                            <td className="p-2">
                                                                                {
                                                                                    contract
                                                                                        ?.contract
                                                                                        ?.rateCode
                                                                                }
                                                                            </td>
                                                                            <td className="p-2">
                                                                                {contract?.isSpecialRate ===
                                                                                true
                                                                                    ? "yes"
                                                                                    : "no"}{" "}
                                                                                {(contract?.isSpecialRate ===
                                                                                    true) ===
                                                                                true
                                                                                    ? `(${contract?.appliedRateCode})`
                                                                                    : ""}
                                                                            </td>
                                                                            <td className="p-2 whitespace-nowrap">
                                                                                {
                                                                                    contract?.roomPrice
                                                                                }{" "}
                                                                                AED
                                                                            </td>
                                                                            <td className="p-2 whitespace-nowrap">
                                                                                {
                                                                                    contract?.mealSupplementPrice
                                                                                }{" "}
                                                                                AED
                                                                            </td>
                                                                            <td className="p-2 whitespace-nowrap">
                                                                                {
                                                                                    contract?.extraBedSupplementPrice
                                                                                }{" "}
                                                                                AED
                                                                            </td>
                                                                            <td className="p-2 whitespace-nowrap">
                                                                                {
                                                                                    contract?.childSupplementPrice
                                                                                }{" "}
                                                                                AED
                                                                            </td>
                                                                            <td className="p-2 whitespace-nowrap">
                                                                                {contract?.netPrice}{" "}
                                                                                AED
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                        {hotelOrder?.appliedMealUpgrades?.length > 0 && (
                                            <div className="mt-7">
                                                <h1 className="font-[600] flex items-center gap-[10px] text-[15px] mb-2">
                                                    <BsFillArrowRightCircleFill /> Applied Meal
                                                    Upgrades
                                                </h1>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-[14px]">
                                                        <tbody>
                                                            <tr className="odd:bg-[#f3f6f9]">
                                                                <td className="p-2 text-sm text-grayColor font-medium">
                                                                    Promotion
                                                                </td>
                                                                <td className="p-2 text-sm text-grayColor font-medium">
                                                                    Rate Code
                                                                </td>
                                                                <td className="p-2 text-sm text-grayColor font-medium">
                                                                    Dates
                                                                </td>
                                                            </tr>
                                                            {hotelOrder?.appliedMealUpgrades?.map(
                                                                (mealUpgrade, index) => {
                                                                    return (
                                                                        <tr
                                                                            key={index}
                                                                            className="odd:bg-[#f3f6f9]"
                                                                        >
                                                                            <td className="p-2">
                                                                                {
                                                                                    mealUpgrade
                                                                                        ?.promotion
                                                                                        ?.name
                                                                                }
                                                                            </td>
                                                                            <td className="p-2">
                                                                                {
                                                                                    mealUpgrade?.rateCode
                                                                                }
                                                                            </td>
                                                                            <td className="p-2">
                                                                                {mealUpgrade?.dates?.map(
                                                                                    (
                                                                                        item,
                                                                                        index
                                                                                    ) => {
                                                                                        return (
                                                                                            <span
                                                                                                key={
                                                                                                    index
                                                                                                }
                                                                                            >
                                                                                                {formatDate(
                                                                                                    item
                                                                                                )}
                                                                                                {index <
                                                                                                    mealUpgrade
                                                                                                        ?.dates
                                                                                                        ?.length -
                                                                                                        1 &&
                                                                                                    ", "}
                                                                                            </span>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                        {hotelOrder?.appliedRoomTypeUpgrades?.length > 0 && (
                                            <div className="mt-7">
                                                <h1 className="font-[600] flex items-center gap-[10px] text-[15px] mb-2">
                                                    <BsFillArrowRightCircleFill /> Applied Room Type
                                                    Upgrades
                                                </h1>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-[14px]">
                                                        <tbody>
                                                            <tr className="odd:bg-[#f3f6f9]">
                                                                <td className="p-2 text-sm text-grayColor font-medium">
                                                                    Promotion
                                                                </td>
                                                                <td className="p-2 text-sm text-grayColor font-medium">
                                                                    Rate Code
                                                                </td>
                                                                <td className="p-2 text-sm text-grayColor font-medium">
                                                                    Dates
                                                                </td>
                                                            </tr>
                                                            {hotelOrder?.appliedRoomTypeUpgrades?.map(
                                                                (roomTypeUpgrade, index) => {
                                                                    return (
                                                                        <tr
                                                                            key={index}
                                                                            className="odd:bg-[#f3f6f9]"
                                                                        >
                                                                            <td className="p-2">
                                                                                {
                                                                                    roomTypeUpgrade
                                                                                        ?.promotion
                                                                                        ?.name
                                                                                }
                                                                            </td>
                                                                            <td className="p-2">
                                                                                {
                                                                                    roomTypeUpgrade?.rateCode
                                                                                }
                                                                            </td>
                                                                            <td className="p-2">
                                                                                {roomTypeUpgrade?.dates?.map(
                                                                                    (
                                                                                        item,
                                                                                        index
                                                                                    ) => {
                                                                                        return (
                                                                                            <span
                                                                                                key={
                                                                                                    index
                                                                                                }
                                                                                            >
                                                                                                {formatDate(
                                                                                                    item
                                                                                                )}
                                                                                                {index <
                                                                                                    roomTypeUpgrade
                                                                                                        ?.dates
                                                                                                        ?.length -
                                                                                                        1 &&
                                                                                                    ", "}
                                                                                            </span>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                        {hotelOrder?.appliedStayPays?.length > 0 && (
                                            <div className="mt-7">
                                                <h1 className="font-[600] flex items-center gap-[10px] text-[15px] mb-2">
                                                    <BsFillArrowRightCircleFill /> Applied Staypays
                                                </h1>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-[14px]">
                                                        <tbody>
                                                            <tr className="odd:bg-[#f3f6f9]">
                                                                <td className="p-2 text-sm text-grayColor font-medium">
                                                                    Promotion
                                                                </td>
                                                                <td className="p-2 text-sm text-grayColor font-medium">
                                                                    Rate Code
                                                                </td>
                                                                <td className="p-2 text-sm text-grayColor font-medium">
                                                                    Dates
                                                                </td>
                                                                <td className="p-2 text-sm text-grayColor font-medium">
                                                                    Discount
                                                                </td>
                                                            </tr>
                                                            {hotelOrder?.appliedStayPays?.map(
                                                                (staypay, index) => {
                                                                    return (
                                                                        <tr
                                                                            key={index}
                                                                            className="odd:bg-[#f3f6f9]"
                                                                        >
                                                                            <td className="p-2">
                                                                                {
                                                                                    staypay
                                                                                        ?.promotion
                                                                                        ?.name
                                                                                }
                                                                            </td>
                                                                            <td className="p-2">
                                                                                {staypay?.rateCode}
                                                                            </td>
                                                                            <td className="p-2">
                                                                                {staypay?.dates?.map(
                                                                                    (
                                                                                        item,
                                                                                        index
                                                                                    ) => {
                                                                                        return (
                                                                                            <span
                                                                                                key={
                                                                                                    index
                                                                                                }
                                                                                            >
                                                                                                {formatDate(
                                                                                                    item
                                                                                                )}
                                                                                                {index <
                                                                                                    staypay
                                                                                                        ?.dates
                                                                                                        ?.length -
                                                                                                        1 &&
                                                                                                    ", "}
                                                                                            </span>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </td>
                                                                            <td className="p-2">
                                                                                {staypay?.discount}{" "}
                                                                                AED
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                        {hotelOrder?.appliedDiscounts?.length > 0 && (
                                            <div className="mt-7">
                                                <h1 className="font-[600] flex items-center gap-[10px] text-[15px] mb-2">
                                                    <BsFillArrowRightCircleFill /> Applied Discounts
                                                </h1>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-[14px]">
                                                        <tbody>
                                                            <tr className="odd:bg-[#f3f6f9]">
                                                                <td className="p-2 text-sm text-grayColor font-medium">
                                                                    Promotion
                                                                </td>
                                                                <td className="p-2 text-sm text-grayColor font-medium">
                                                                    Rate Code
                                                                </td>
                                                                <td className="p-2 text-sm text-grayColor font-medium">
                                                                    Dates
                                                                </td>
                                                                <td className="p-2 text-sm text-grayColor font-medium">
                                                                    Discount
                                                                </td>
                                                            </tr>
                                                            {hotelOrder?.appliedDiscounts?.map(
                                                                (discount, index) => {
                                                                    return (
                                                                        <tr
                                                                            key={index}
                                                                            className="odd:bg-[#f3f6f9]"
                                                                        >
                                                                            <td className="p-2">
                                                                                {
                                                                                    discount
                                                                                        ?.promotion
                                                                                        ?.name
                                                                                }
                                                                            </td>
                                                                            <td className="p-2">
                                                                                {discount?.rateCode}
                                                                            </td>
                                                                            <td className="p-2">
                                                                                {discount?.dates?.map(
                                                                                    (
                                                                                        item,
                                                                                        index
                                                                                    ) => {
                                                                                        return (
                                                                                            <span
                                                                                                key={
                                                                                                    index
                                                                                                }
                                                                                            >
                                                                                                {formatDate(
                                                                                                    item
                                                                                                )}
                                                                                                {index <
                                                                                                    discount
                                                                                                        ?.dates
                                                                                                        ?.length -
                                                                                                        1 &&
                                                                                                    ", "}
                                                                                            </span>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </td>
                                                                            <td className="p-2">
                                                                                {discount?.discount}{" "}
                                                                                AED
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                        <div className="mt-7">
                                            <h1 className="font-[600] flex items-center gap-[10px] text-[15px] mb-2">
                                                <BsFillArrowRightCircleFill /> Rate Key
                                            </h1>
                                            <span className="text-[14px] bg-[#f3f6f9] break-all">
                                                {hotelOrder?.rateKey}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <table className="w-full text-[15px]">
                                        <tbody>
                                            <tr className="odd:bg-[#f3f6f9]">
                                                <td className="p-2 font-medium">Booking ID</td>
                                                <td className="font-medium">
                                                    {hotelOrder?.hotelBookingId || "N/A"}
                                                </td>
                                            </tr>
                                            <tr className="odd:bg-[#f3f6f9]">
                                                <td className="p-2">Number of Nights</td>
                                                <td>{hotelOrder?.noOfNights} Nights</td>
                                            </tr>
                                            <tr className="odd:bg-[#f3f6f9]">
                                                <td className="p-2">Total Rooms</td>
                                                <td>{hotelOrder?.roomsCount} Rooms</td>
                                            </tr>
                                            <tr className="odd:bg-[#f3f6f9]">
                                                <td className="p-2">Total Pax</td>
                                                <td>
                                                    {hotelOrder?.totalAdults} Adults,{" "}
                                                    {hotelOrder?.totalChildren} Children
                                                </td>
                                            </tr>
                                            {hotelOrder?.rooms?.map((room, index) => {
                                                return (
                                                    <React.Fragment key={index}>
                                                        <tr className="bg-primaryColor text-white">
                                                            <td
                                                                className="p-2 font-medium"
                                                                colSpan="2"
                                                            >
                                                                Room {index + 1}
                                                            </td>
                                                        </tr>
                                                        <tr className="odd:bg-[#f3f6f9]">
                                                            <td className="p-2">Pax</td>
                                                            <td>
                                                                {room?.noOfAdults} Adults,{" "}
                                                                {room?.noOfChildren} Children
                                                                {room?.childrenAges?.length > 0 &&
                                                                    `(${room?.childrenAges
                                                                        ?.toString()
                                                                        ?.replace(",", " ,")})`}
                                                            </td>
                                                        </tr>
                                                        <tr className="odd:bg-[#f3f6f9]">
                                                            <td className="p-2">Traveller</td>
                                                            <td className="capitalize">
                                                                {
                                                                    hotelOrder?.travellerDetails[
                                                                        index
                                                                    ]?.title
                                                                }{" "}
                                                                {
                                                                    hotelOrder?.travellerDetails[
                                                                        index
                                                                    ]?.firstName
                                                                }{" "}
                                                                {
                                                                    hotelOrder?.travellerDetails[
                                                                        index
                                                                    ]?.lastName
                                                                }
                                                            </td>
                                                        </tr>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                    <div className="mt-6 px-2">
                                        <table className="w-full text-[15px]">
                                            <tbody>
                                                <tr>
                                                    <td className="font-medium py-1 w-full">
                                                        <div className="flex gap-[15px] items-center w-full">
                                                            <span className="">Gross Price</span>
                                                            <div className="border-b border-dashed flex-1"></div>
                                                            <span className="text-right font-[600]">
                                                                {hotelOrder?.grossPrice}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="text-grayColor py-1 w-full">
                                                        <div className="flex gap-[15px] items-center w-full">
                                                            <span className="">
                                                                Room Price ({hotelOrder?.roomsCount}{" "}
                                                                rooms for {hotelOrder?.noOfNights}{" "}
                                                                nights)
                                                            </span>
                                                            <div className="border-b border-dashed flex-1"></div>
                                                            <span className="text-right">
                                                                {hotelOrder?.roomPrice}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="text-grayColor py-1 w-full">
                                                        <div className="flex gap-[15px] items-center w-full">
                                                            <span className="">
                                                                Extra supplement
                                                            </span>
                                                            <div className="border-b border-dashed flex-1"></div>
                                                            <span className="text-right">
                                                                {hotelOrder?.extraSupplementPrice ||
                                                                    0}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="text-grayColor py-1 w-full">
                                                        <div className="flex gap-[15px] items-center w-full">
                                                            <span className="">
                                                                Meal supplement
                                                            </span>
                                                            <div className="border-b border-dashed flex-1"></div>
                                                            <span className="text-right">
                                                                {hotelOrder?.mealSupplementPrice ||
                                                                    0}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="text-grayColor py-1 w-full">
                                                        <div className="flex gap-[15px] items-center w-full">
                                                            <span className="">
                                                                Mandatory Addon
                                                            </span>
                                                            <div className="border-b border-dashed flex-1"></div>
                                                            <span className="text-right">
                                                                {hotelOrder?.mandatoryAddOnPrice ||
                                                                    0}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="text-grayColor py-1 w-full">
                                                        <div className="flex gap-[15px] items-center w-full">
                                                            <span className="">
                                                                Addon Supplement
                                                            </span>
                                                            <div className="border-b border-dashed flex-1"></div>
                                                            <span className="text-right">
                                                                {hotelOrder?.addOnSupplementPrice ||
                                                                    0}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="text-grayColor py-1 w-full">
                                                        <div className="flex gap-[15px] items-center w-full">
                                                            <span className="">Admin Markup</span>
                                                            <div className="border-b border-dashed flex-1"></div>
                                                            <span className="text-right">
                                                                {hotelOrder?.adminB2bMarkup || 0}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="text-grayColor py-1 w-full">
                                                        <div className="flex gap-[15px] items-center w-full">
                                                            <span className="">
                                                                Agent To Sub Agent Markup
                                                            </span>
                                                            <div className="border-b border-dashed flex-1"></div>
                                                            <span className="text-right">
                                                                {hotelOrder?.subAgentMarkup || 0}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="text-grayColor py-1 w-full">
                                                        <div className="flex gap-[15px] items-center w-full">
                                                            <span className="">Client Markup</span>
                                                            <div className="border-b border-dashed flex-1"></div>
                                                            <span className="text-right">
                                                                {hotelOrder?.clientMarkup || 0}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="font-medium py-1 w-full">
                                                        <div className="flex gap-[15px] items-center w-full">
                                                            <span className="">Total Offer</span>
                                                            <div className="border-b border-dashed flex-1"></div>
                                                            <span className="text-right font-[600]">
                                                                - {hotelOrder?.totalOffer}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="text-grayColor py-1 w-full">
                                                        <div className="flex gap-[15px] items-center w-full">
                                                            <span className="">Stay Pay Offer</span>
                                                            <div className="border-b border-dashed flex-1"></div>
                                                            <span className="text-right">
                                                                - {hotelOrder?.stayPayOffer}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="text-grayColor py-1 w-full">
                                                        <div className="flex gap-[15px] items-center w-full">
                                                            <span className="">Discount Offer</span>
                                                            <div className="border-b border-dashed flex-1"></div>
                                                            <span className="text-right">
                                                                - {hotelOrder?.discountOffer}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="font-medium py-2 w-full">
                                                        <div className="flex gap-[15px] items-center w-full">
                                                            <span className="">Net Price</span>
                                                            <div className="border-b border-dashed flex-1"></div>
                                                            <span className="text-right font-[600] text-lg text-green-500 whitespace-nowrap">
                                                                AED {hotelOrder?.netPrice}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
