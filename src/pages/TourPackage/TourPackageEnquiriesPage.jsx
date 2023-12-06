import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { PageLoader, Pagination } from "../../components";
import axios from "../../axios";
import { formatDate } from "../../utils";

export default function TourPackageEnquiriesPage() {
    const [packageEnquiries, setPackageEnquiries] = useState([]);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalPackageEnquiries: 0,
    });

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchTourPackageEnquiries = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(
                `/tour-packages/enquiries/b2b/all?skip=${filters.skip}&limit=${filters.limit}`,
                { headers: { authorization: `Bearer ${jwtToken}` } }
            );

            setPackageEnquiries(response.data?.packageEnquiries);
            setFilters((prev) => {
                return { ...prev, totalPackageEnquiries: response?.data?.totalPackageEnquiries };
            });
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchTourPackageEnquiries();
    }, [filters.skip]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Tour Package Enquiries</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/tour-packages" className="text-textColor">
                        Tour Packages{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Enquiries </span>
                </div>
            </div>

            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Tour Packages Enquiries</h1>
                        </div>
                        {packageEnquiries?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Tour Packages Enquiries Found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">Ref.No</th>
                                            <th className="font-[500] p-3">Package</th>
                                            <th className="font-[500] p-3">Departure Date</th>
                                            <th className="font-[500] p-3">Pax</th>
                                            <th className="font-[500] p-3">Reseller</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {packageEnquiries?.map((enquiry, enquiryIndex) => {
                                            return (
                                                <tr
                                                    key={enquiryIndex}
                                                    className="border-b border-tableBorderColor"
                                                >
                                                    <td className="p-3">
                                                        #{enquiry?.tPRefNumber}
                                                        <span className="block text-sm text-grayColor mt-1">
                                                            {formatDate(enquiry?.createdAt, true)}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">
                                                        <Link
                                                            to={`/tour-packages/${enquiry?.tourPackageId?._id}`}
                                                            className="underline text-blue-500"
                                                        >
                                                            {enquiry?.tourPackageId?.packageName}
                                                        </Link>
                                                    </td>
                                                    <td className="p-3">
                                                        {formatDate(enquiry?.departureDate)}
                                                    </td>
                                                    <td className="p-3">
                                                        {enquiry?.noOfAdults || 0}ADT,{" "}
                                                        {enquiry?.noOfChildren || 0}CHD
                                                    </td>
                                                    <td className="p-3">
                                                        {enquiry?.resellerId?.companyName} (
                                                        {enquiry?.resellerId?.agentCode})
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                <div className="p-4">
                                    <Pagination
                                        limit={filters?.limit}
                                        skip={filters?.skip}
                                        total={filters?.totalPackageEnquiries}
                                        incOrDecSkip={(number) =>
                                            setFilters((prev) => {
                                                return {
                                                    ...prev,
                                                    skip: prev.skip + number,
                                                };
                                            })
                                        }
                                        updateSkip={(skip) =>
                                            setFilters((prev) => {
                                                return { ...prev, skip };
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
