import React, { useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { HiOutlineTicket } from "react-icons/hi";
import { useSelector } from "react-redux";

import { formatDate, priceConversion } from "../../../utils";

function A2AEnquiryTable({ item, index }) {
    const [isDropdownView, setIsDropdownView] = useState(false);

    const { selectedCurrency } = useSelector((state) => state.general);
    return (
        <>
            <tr
                className="border-b border-tableBorderColor text-textColor"
                onClick={() => setIsDropdownView(!isDropdownView)}
            >
                <td className="p-3">{index + 1}</td>
                <td className="p-3">
                    <div className="space-y-1">
                        <p className="">{item?.reseller?.name}</p>
                        {/* <span className="bg-gray-100 px-2 py-1 rounded">
                            10038
                        </span> */}
                    </div>
                </td>
                <td className="p-3 capitalize">
                    <p className="">{`${item?.a2aTicket?.airportFromIata} - ${item?.a2aTicket?.airportToIata} - ${item?.a2aTicket?.airportFromIata}`}</p>
                    <p className="text-gray-500">{`(${item?.a2aTicket?.onwardDate?.slice(
                        0,
                        10
                    )}) - (${item?.a2aTicket?.returnDate?.slice(0, 10)})`}</p>
                </td>
                <td className="p-3">{formatDate(item?.createdAt)}</td>
                <td className="p-3 capitalize">
                    {item?.noOfTravellers} Passenger
                </td>
                <td className="p-3 capitalize">
                    {item?.markup === 0
                        ? "N/A"
                        : priceConversion(item?.markup, selectedCurrency, true)}
                </td>
                <td className="p-3 capitalize">
                    {priceConversion(item?.totalAmount, selectedCurrency, true)}
                </td>
            </tr>
            {isDropdownView && (
                <tr className="border-b border-tableBorderColor">
                    <td colSpan="7" className="p-3">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <h2 className="font-[500] flex items-center gap-2">
                                    <span className="text-lg">
                                        <FaUserFriends />
                                    </span>
                                    <span className="">Profile</span>
                                </h2>
                                {item?.passengerDetails?.map(
                                    (traveller, index) => (
                                        <>
                                            <p className="text-gray-600 text-[14px] font-[700]">
                                                Passenger {index + 1}
                                            </p>
                                            <div className="grid grid-cols-2 gap-1">
                                                <p className="text-[14px] text-gray-500">
                                                    Name
                                                </p>
                                                <p className="text-[15px] capitalize ">
                                                    {traveller?.title +
                                                        " " +
                                                        traveller?.firstName +
                                                        " " +
                                                        traveller?.lastName}{" "}
                                                </p>
                                                <p className="text-[14px] text-gray-500">
                                                    Passport Number
                                                </p>
                                                <p className="text-[15px] capitalize ">
                                                    {traveller?.passportNo}{" "}
                                                </p>
                                                <p className="text-[14px] text-gray-500">
                                                    Reference
                                                </p>
                                                <p className="text-[15px] capitalize ">
                                                    {traveller?.reference}{" "}
                                                </p>

                                                <p className="text-[14px] text-gray-500">
                                                    Phone Number
                                                </p>
                                                <p className="text-[15px] capitalize ">
                                                    {"+" +
                                                        traveller?.code +
                                                        " " +
                                                        traveller?.phoneNumber}{" "}
                                                </p>
                                            </div>
                                            {traveller?.isInfant && (
                                                <>
                                                    <p className="text-gray-600 font-[600] text-xs uppercase py-1">
                                                        Infant Details
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-1 p-2">
                                                        <p className="text-[14px] text-gray-500">
                                                            Infant Name
                                                        </p>
                                                        <p className="text-[15px] capitalize ">
                                                            {traveller
                                                                ?.infantDetails
                                                                ?.title +
                                                                " " +
                                                                traveller
                                                                    ?.infantDetails
                                                                    ?.firstName +
                                                                " " +
                                                                traveller
                                                                    ?.infantDetails
                                                                    ?.lastName}{" "}
                                                        </p>
                                                        <p className="text-[14px] text-gray-500">
                                                   Infant Passport No
                                                </p>
                                                <p className="text-[15px] capitalize ">
                                                    {traveller?.infantDetails?.passportNo}{" "}
                                                </p>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )
                                )}
                            </div>
                            <div>
                                <h2 className="font-[500] flex items-center gap-2">
                                    <span className="text-lg">
                                        <HiOutlineTicket />
                                    </span>
                                    <span className="">Ticket</span>
                                </h2>
                                <p className="text-gray-600 text-[14px] font-[700]">
                                    A2A Ticket Details
                                </p>
                                <div className="grid grid-cols-2 gap-1">
                                    <p className="text-[14px] text-gray-500">
                                        Reference
                                    </p>
                                    <p className="text-[15px] capitalize ">
                                        {item?.referenceNumber}
                                    </p>
                                    <p className="text-[14px] text-gray-500">
                                        PNR Number
                                    </p>
                                    <p className="text-[15px] capitalize ">
                                        {item?.a2aTicket?.pnrNo}
                                    </p>
                                    <p className="text-[14px] text-gray-500">
                                        Airline Onward
                                    </p>
                                    <p className="text-[15px] capitalize ">
                                        {item?.a2aTicket?.airlineOnward}{" "}
                                    </p>
                                    <p className="text-[14px] text-gray-500">
                                        Airline Return
                                    </p>
                                    <p className="text-[15px] capitalize ">
                                        {item?.a2aTicket?.airlineReturn}
                                    </p>
                                    <p className="text-[14px] text-gray-500">
                                        Airport onward
                                    </p>
                                    <p className="text-[15px] capitalize ">
                                        {item?.a2aTicket?.airportFromName}
                                    </p>
                                    <p className="text-[14px] text-gray-500">
                                        Airport Return
                                    </p>
                                    <p className="text-[15px] capitalize ">
                                        {item?.a2aTicket?.airportToName}
                                    </p>{" "}
                                    <p className="text-[14px] text-gray-500">
                                        Onward
                                    </p>
                                    <p className="text-[15px] capitalize ">
                                        {`${formatDate(
                                            item?.a2aTicket?.onwardDate
                                        )} (${
                                            item?.a2aTicket?.takeOffTimeOnward
                                        } - ${
                                            item?.a2aTicket?.landingTimeOnward
                                        }) `}
                                    </p>
                                    <p className="text-[14px] text-gray-500">
                                        Return
                                    </p>
                                    <p className="text-[15px] capitalize ">
                                        {`${formatDate(
                                            item?.a2aTicket?.returnDate
                                        )} (${
                                            item?.a2aTicket?.takeOffTimeReturn
                                        } - ${
                                            item?.a2aTicket?.landingTimeReturn
                                        }) `}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}

export default A2AEnquiryTable;
