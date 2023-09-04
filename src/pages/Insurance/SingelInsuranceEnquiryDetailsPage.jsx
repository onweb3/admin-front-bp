import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { AiOutlineCloudDownload } from "react-icons/ai";

import axios from "../../axios";
import { PageLoader } from "../../components";
import { formatDate } from "../../utils";

export default function SingelInsuranceEnquiryDetailsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [contractDetails, setContractDetails] = useState(false);

    const { jwtToken } = useSelector((state) => state.admin);
    const { contractId } = useParams();

    const fetchSingleInsuranceEnquiryDetails = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(`/insurance/contracts/single/${contractId}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setContractDetails(response.data);

            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchSingleInsuranceEnquiryDetails();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Insurance Enquiry Details</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Insurance </span>
                    <span>{">"} </span>
                    <Link to="/insurance/enquiries" className="text-textColor">
                        Enquiries{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Enquiries</span>
                </div>
            </div>

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm p-6">
                        <div className="flex items-start justify-between gap-[20px] mb-5">
                            <div className="">
                                <div className="flex items-center gap-[10px] font-[600] text-lg">
                                    {contractDetails?.planName || "N/A"}
                                </div>
                                <span className="block text-sm text-grayColor">
                                    Booked by{" "}
                                    <span className="underline capitalize">
                                        {contractDetails?.reseller?.companyName} (
                                        {contractDetails?.reseller?.agentCode})
                                    </span>{" "}
                                    at {formatDate(contractDetails?.createdAt)}
                                </span>
                            </div>
                            <div className="flex items-center gap-[25px]">
                                <div className="text-center">
                                    <span className="block text-sm text-grayColor font-medium">
                                        Total Amount
                                    </span>
                                    <span className="font-[600] text-lg">
                                        {contractDetails?.totalAmount} AED
                                    </span>
                                </div>
                                <span
                                    className={
                                        "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                        (contractDetails?.status === "cancelled"
                                            ? "bg-[#f065481A] text-[#f06548]"
                                            : contractDetails?.status === "completed"
                                            ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                            : "bg-[#f7b84b1A] text-[#f7b84b]")
                                    }
                                >
                                    {contractDetails?.status}
                                </span>
                                {contractDetails?.status === "completed" && (
                                    <button
                                        className="px-3 bg-[#299cdb] flex items-center gap-2"
                                        // onClick={handleBookingPdfDownload}
                                    >
                                        <span className="text-lg">
                                            <AiOutlineCloudDownload />
                                        </span>
                                        Download
                                    </button>
                                )}
                            </div>
                        </div>

                        <div>
                            <table className="w-full text-[15px]">
                                <tbody>
                                    <tr className="odd:bg-[#f3f6f9]">
                                        <td className="p-2 w-[180px]">Residence</td>
                                        <td className="p-2">{contractDetails?.residence}</td>
                                    </tr>
                                    <tr className="odd:bg-[#f3f6f9]">
                                        <td className="p-2">Destination</td>
                                        <td className="p-2">{contractDetails?.destination}</td>
                                    </tr>
                                    <tr className="odd:bg-[#f3f6f9]">
                                        <td className="p-2">From Date</td>
                                        <td className="p-2">
                                            {formatDate(contractDetails?.travelFrom)}
                                        </td>
                                    </tr>
                                    <tr className="odd:bg-[#f3f6f9]">
                                        <td className="p-2">To Date</td>
                                        <td className="p-2">
                                            {formatDate(contractDetails?.travelTo)}
                                        </td>
                                    </tr>
                                    <tr className="odd:bg-[#f3f6f9]">
                                        <td className="p-2">Travel Type</td>
                                        <td className="p-2 capitalize">
                                            {contractDetails?.travelType}
                                        </td>
                                    </tr>
                                    <tr className="odd:bg-[#f3f6f9]">
                                        <td className="p-2">Contact Info</td>
                                        <td className="p-2 capitalize">
                                            {contractDetails?.email} ({contractDetails?.phoneCode}{" "}
                                            {contractDetails?.phoneNumber})
                                        </td>
                                    </tr>
                                    <tr className="odd:bg-[#f3f6f9]">
                                        <td className="p-2">Address</td>
                                        <td className="p-2 capitalize">
                                            {contractDetails?.address}
                                        </td>
                                    </tr>
                                    <tr className="odd:bg-[#f3f6f9]">
                                        <td className="p-2">Note</td>
                                        <td className="p-2">{contractDetails?.note}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-5">
                            <h3 className="font-medium">Beneficiaries</h3>
                            <div className="mt-2">
                                <table className="w-full text-[14px]">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="p-2 text-sm text-grayColor font-medium">
                                                #
                                            </th>
                                            <th className="p-2 text-sm text-grayColor font-medium">
                                                Full Name
                                            </th>
                                            <th className="p-2 text-sm text-grayColor font-medium">
                                                Gender
                                            </th>
                                            <th className="p-2 text-sm text-grayColor font-medium">
                                                DOB
                                            </th>
                                            <th className="p-2 text-sm text-grayColor font-medium">
                                                Passport Number
                                            </th>
                                            <th className="p-2 text-sm text-grayColor font-medium">
                                                Consecutive Days
                                            </th>
                                            <th className="p-2 text-sm text-grayColor font-medium">
                                                Price
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contractDetails?.beneficiaryData?.map((item, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor last:border-b-0"
                                                >
                                                    <td className="p-2">{index + 1}</td>
                                                    <td className="p-2 capitalize">
                                                        {item?.firstName} {item?.lastName}
                                                    </td>
                                                    <td className="p-2 capitalize">
                                                        {item?.gender}
                                                    </td>
                                                    <td className="p-2">
                                                        {formatDate(item?.dateOfBirth)}
                                                    </td>
                                                    <td className="p-2">{item?.passportNumber}</td>
                                                    <td className="p-2">
                                                        {item?.consecutiveDays} Days
                                                    </td>
                                                    <td className="p-2">{item?.price} AED</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
