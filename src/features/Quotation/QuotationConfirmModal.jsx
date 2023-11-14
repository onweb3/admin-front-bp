import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";

import axios from "../../axios";
import { useHandleClickOutside } from "../../hooks";
import { BtnLoader } from "../../components";
import { useNavigate, useParams } from "react-router-dom";

export default function QuotationConfirmModal({
    amendment,
    setQuotation,
    edit,
    setIsModal,
}) {
    const [data, setData] = useState({
        comments: "",
        selectedStay: 0,
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setIsModal(false));
    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleCheckChange = (e, id) => {
        console.log("call", e.target.checked);
        setData((prev) => {
            return { ...prev, [e.target.name]: id };
        });
    };
    const { quotationNumber } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setError("");
            setIsLoading(true);
            if (edit) {
                const response = await axios.patch(
                    `/quotations/confirm/${amendment._id}`,
                    {
                        comments: data.comments,
                        selectedStay: data.selectedStay,
                    },
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
                navigate(`/quotations/${quotationNumber}`);
            } else {
                const response = await axios.patch(
                    `/quotations/confirm/${amendment._id}`,
                    {
                        comments: data.comments,
                        selectedStay: data?.selectedStay,
                    },
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );

                if (data.selectedStay !== null) {
                    setQuotation((prev) => {
                        return {
                            ...prev,
                            confirmedAmendment: amendment?._id,
                            status: "confirmed",
                            amendments: prev?.amendments?.map((amen) => {
                                return {
                                    ...amen,
                                    hotelQuotation: {
                                        ...amen.hotelQuotation,
                                        stays: amen?.hotelQuotation?.stays?.map(
                                            (stays, ind) => {
                                                if (ind == data?.selectedStay) {
                                                    return {
                                                        ...stays,
                                                        selected: true,
                                                    };
                                                } else {
                                                    return stays;
                                                }
                                            }
                                        ),
                                    },
                                };
                            }),
                        };
                    });
                } else {
                    setQuotation((prev) => {
                        return {
                            ...prev,
                            confirmedAmendment: amendment._id,
                            status: "confirmed",
                        };
                    });
                }
            }

            setIsLoading(false);
            setIsModal(false);
        } catch (err) {
            console.log(err);
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
                    <h2 className="font-medium mb-2">Confirm Modal </h2>
                    {!edit && (
                        <button
                            className="h-auto bg-transparent text-textColor text-xl"
                            onClick={() => setIsModal(false)}
                        >
                            <MdClose />
                        </button>
                    )}
                </div>
                {amendment?.hotelQuotation?.stays?.length > 0 && (
                    <div className="p-4">
                        {" "}
                        {amendment?.hotelQuotation ? (
                            !amendment?.hotelQuotation.isAlreadyBooked ? (
                                <div>
                                    {amendment?.hotelQuotation?.stays?.map(
                                        (stay, index) => {
                                            return (
                                                <div className="pb-2">
                                                    <div className="flex items-center gap-4 mb-2">
                                                        <input
                                                            type="checkbox"
                                                            name="selectedStay"
                                                            id="selectedStay"
                                                            className="w-[16px] h-[16px]"
                                                            checked={
                                                                data?.selectedStay ==
                                                                index
                                                                    ? true
                                                                    : false
                                                            }
                                                            onChange={(e) => {
                                                                handleCheckChange(
                                                                    e,
                                                                    index
                                                                );
                                                            }}
                                                        />{" "}
                                                        <h2 className="cust-border  font-[600]">
                                                            Option {index + 1}
                                                        </h2>
                                                    </div>
                                                    <table className="w-full text-left">
                                                        <thead>
                                                            <tr>
                                                                <th className="font-medium text-[15px] border px-[10px]">
                                                                    Name of
                                                                    Hotel
                                                                </th>

                                                                {amendment
                                                                    ?.hotelQuotation
                                                                    ?.stays
                                                                    ?.length >
                                                                    0 &&
                                                                    amendment?.hotelQuotation?.stays[0]?.roomOccupancyList?.map(
                                                                        (
                                                                            roomOccupancy,
                                                                            index
                                                                        ) => {
                                                                            return (
                                                                                <th
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    className="font-medium text-[15px] border px-[10px]"
                                                                                >
                                                                                    {
                                                                                        roomOccupancy?.occupancyShortName
                                                                                    }
                                                                                </th>
                                                                            );
                                                                        }
                                                                    )}
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-[15px]">
                                                            {stay?.hotels?.map(
                                                                (
                                                                    item,
                                                                    multiHotelIndex
                                                                ) => {
                                                                    return (
                                                                        <tr
                                                                            key={
                                                                                multiHotelIndex
                                                                            }
                                                                            className=""
                                                                        >
                                                                            <td className="border px-[10px]">
                                                                                {item?.hotelName ||
                                                                                    "N/A"}
                                                                                <br />
                                                                            </td>

                                                                            {multiHotelIndex <
                                                                                1 &&
                                                                                stay?.roomOccupancyList?.map(
                                                                                    (
                                                                                        roomOccupancy,
                                                                                        index
                                                                                    ) => {
                                                                                        return (
                                                                                            <td
                                                                                                rowSpan={
                                                                                                    stay
                                                                                                        ?.hotels
                                                                                                        ?.length >
                                                                                                    0
                                                                                                        ? stay
                                                                                                              ?.hotels
                                                                                                              ?.length
                                                                                                        : 0
                                                                                                }
                                                                                                key={
                                                                                                    index
                                                                                                }
                                                                                                className="border px-[10px]"
                                                                                            >
                                                                                                {roomOccupancy?.priceWithTransfer
                                                                                                    ? Math.ceil(
                                                                                                          roomOccupancy?.priceWithTransfer
                                                                                                      ) +
                                                                                                      " " +
                                                                                                      amendment?.quotationCurrency
                                                                                                    : "N/A"}
                                                                                            </td>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                        </tr>
                                                                    );
                                                                }
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            ) : (
                                <>
                                    {" "}
                                    <div className="mt-5 text-[15px]">
                                        {amendment?.noOfAdults && (
                                            <div>
                                                Per person Adult price:{" "}
                                                {Math.ceil(
                                                    amendment?.perPersonAdultPrice
                                                )}{" "}
                                                {amendment?.quotationCurrency}
                                            </div>
                                        )}
                                        {amendment?.noOfChildren ? (
                                            <div className="mt-1">
                                                Per person Child price:{" "}
                                                {Math.ceil(
                                                    amendment?.perPersonChildPrice
                                                )}{" "}
                                                {amendment?.quotationCurrency}
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                    {/* <div>
                                    {amendment?.hotelQuotation?.stays?.map(
                                        (stay, index) => {
                                            return (
                                                <div className="mt-6">
                                                    <h2 className="cust-border mb-2 font-[600]">
                                                        Stay Option {index + 1}
                                                    </h2>
                                                    <table className="w-full text-left">
                                                        <thead>
                                                            <tr>
                                                                <th className="font-[500] text-[15px] border px-[10px] py-[10px]">
                                                                    Checkin Date
                                                                </th>
                                                                <th className="font-[500] text-[15px] border px-[10px] py-[10px]">
                                                                    Checkout Date
                                                                </th>
                                                                <th className="font-[500] text-[15px] border px-[10px] py-[10px]">
                                                                    Star Category
                                                                </th>
                                                                <th className="font-medium text-[15px] border px-[10px]">
                                                                    Name of Hotel
                                                                </th>
                                                                <th className="font-medium text-[15px] border px-[10px]">
                                                                    Location
                                                                </th>
                                                                {amendment
                                                                    ?.hotelQuotation
                                                                    ?.stays?.length >
                                                                    0 &&
                                                                    amendment?.hotelQuotation?.stays[0]?.roomOccupancyList?.map(
                                                                        (
                                                                            roomOccupancy,
                                                                            index
                                                                        ) => {
                                                                            return (
                                                                                <th
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    className="font-medium text-[15px] border px-[10px]"
                                                                                >
                                                                                    {
                                                                                        roomOccupancy?.occupancyShortName
                                                                                    }
                                                                                </th>
                                                                            );
                                                                        }
                                                                    )}
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-[15px]">
                                                            {stay?.hotels?.map(
                                                                (
                                                                    item,
                                                                    multiHotelIndex
                                                                ) => {
                                                                    return (
                                                                        <tr
                                                                            key={
                                                                                multiHotelIndex
                                                                            }
                                                                            className=""
                                                                        >
                                                                            <td className="border px-[10px] py-[5px]">
                                                                                {item?.checkInDate
                                                                                    ? new Date(
                                                                                          item?.checkInDate
                                                                                      ).toDateString()
                                                                                    : "N/A"}
                                                                            </td>
                                                                            <td className="border px-[10px] py-[5px]">
                                                                                {item?.checkOutDate
                                                                                    ? new Date(
                                                                                          item?.checkOutDate
                                                                                      ).toDateString()
                                                                                    : "N/A"}
                                                                            </td>
                                                                            <td className="border px-[10px] py-[5px]">
                                                                                {item?.starCategory
                                                                                    ? item?.starCategory
                                                                                    : "N/A"}
                                                                            </td>
                                                                            <td className="border px-[10px]">
                                                                                {item?.hotelName ||
                                                                                    "N/A"}
                                                                                <br />
                                                                                {item?.roomOccupancyName && (
                                                                                    <>
                                                                                        <span className="">
                                                                                            *{" "}
                                                                                            {
                                                                                                item?.roomOccupancyName
                                                                                            }
                                                                                        </span>
                                                                                        <br />
                                                                                    </>
                                                                                )}
                                                                                <span className="block mt-1">
                                                                                    *{" "}
                                                                                    {item.isBreakfastIncluded
                                                                                        ? "Breakfast Included"
                                                                                        : "Room Only"}
                                                                                </span>
                                                                                <span className="block mt-1">
                                                                                    *{" "}
                                                                                    {item?.isRefundable
                                                                                        ? "Refundable"
                                                                                        : "Non Refundable"}
                                                                                </span>
                                                                            </td>
                                                                            <td className="border px-[10px]">
                                                                                {item?.city ||
                                                                                    "N/A"}
                                                                            </td>
                                                                            {multiHotelIndex <
                                                                                1 &&
                                                                                stay?.roomOccupancyList?.map(
                                                                                    (
                                                                                        roomOccupancy,
                                                                                        index
                                                                                    ) => {
                                                                                        return (
                                                                                            <td
                                                                                                rowSpan={
                                                                                                    stay
                                                                                                        ?.hotels
                                                                                                        ?.length >
                                                                                                    0
                                                                                                        ? stay
                                                                                                              ?.hotels
                                                                                                              ?.length
                                                                                                        : 0
                                                                                                }
                                                                                                key={
                                                                                                    index
                                                                                                }
                                                                                                className="border px-[10px]"
                                                                                            >
                                                                                                {roomOccupancy?.priceWithTransfer
                                                                                                    ? roomOccupancy?.priceWithTransfer?.toFixed(
                                                                                                          2
                                                                                                      ) +
                                                                                                      " " +
                                                                                                      amendment?.quotationCurrency
                                                                                                    : "N/A"}
                                                                                            </td>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                        </tr>
                                                                    );
                                                                }
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            );
                                        }
                                    )}
                                </div> */}
                                </>
                            )
                        ) : (
                            <div className="mt-5 text-[15px]">
                                {amendment?.noOfAdults && (
                                    <div>
                                        Per person Adult price:{" "}
                                        {Math.ceil(
                                            amendment?.perPersonAdultPrice
                                        )}{" "}
                                        {amendment?.quotationCurrency}
                                    </div>
                                )}
                                {amendment?.noOfChildren ? (
                                    <div className="mt-1">
                                        Per person Child price:{" "}
                                        {Math.ceil(
                                            amendment?.perPersonChildPrice
                                        )}{" "}
                                        {amendment?.quotationCurrency}
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                        )}
                    </div>
                )}
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div className="">
                            <label htmlFor="">Comments *</label>
                            <textarea
                                type="text"
                                value={data.comments || ""}
                                name="comments"
                                onChange={handleChange}
                                placeholder="Enter Comments"
                                required
                            />
                        </div>

                        {error && (
                            <span className="text-sm block text-red-500 mt-2">
                                {error}
                            </span>
                        )}
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            {!edit && (
                                <button
                                    className="bg-slate-300 text-textColor px-[15px]"
                                    type="button"
                                    onClick={() => setIsModal(false)}
                                >
                                    Cancel
                                </button>
                            )}
                            <button className="w-[160px]">
                                {isLoading ? (
                                    <BtnLoader />
                                ) : (
                                    "Confirm Quotation"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
