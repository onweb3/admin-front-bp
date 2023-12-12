import React, { useEffect, useState } from "react";
import { BsFillFileEarmarkPersonFill } from "react-icons/bs";
import { GrNotes } from "react-icons/gr";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import axios from "../../axios";
import { PageLoader } from "../../components";
import { VisaApplicationSingleTableRow } from "../../features/Visa";
import ApproveVisaModal from "../../features/Visa/components/ApproveVisaModal";
import { priceConversion } from "../../utils";

function SingleVisaApplication() {
    const { id } = useParams();
    const { orderedBy } = useParams();
    const { travellerId } = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [singleVisaApplication, setSingleVisaApplication] = useState({});

    const { jwtToken } = useSelector((state) => state.admin);
    const { selectedCurrency } = useSelector((state) => state.general);

    const fetchSingleRequest = async () => {
        try {
            console.log("fetching Single Request");
            setIsLoading(true);

            const response = await axios.get(
                `/visa/application/${orderedBy}/${id}/single/${travellerId}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setSingleVisaApplication(response.data);

            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchSingleRequest();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Visa Application
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/visa/request" className="text-textColor">
                        Visa Application{" "}
                    </Link>
                    <span>{id.slice(0, 5)}</span>
                </div>
            </div>
            {isLoading ? (
                <div>
                    <PageLoader />
                </div>
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">Visa Order</h1>
                        </div>
                        <div>
                            <div className="p-4 grid grid-cols-2 gap-[20px]">
                                <div>
                                    <div className="flex items-center gap-[8px] mb-3">
                                        <span>
                                            <GrNotes />
                                        </span>
                                        <span className="font-[600] text-[15px] ">
                                            Visa Details
                                        </span>
                                    </div>
                                    <div className="">
                                        <span className="block text-[12px] text-grayColor">
                                            Visa Name
                                        </span>
                                        <span className="block text-[15px]">
                                            {
                                                singleVisaApplication?.visaType
                                                    ?.visaName
                                            }
                                        </span>
                                    </div>
                                    <div className="mt-3">
                                        <span className="block text-[12px] text-grayColor">
                                            Visa Country
                                        </span>
                                        <span className="block text-[15px] capitalize">
                                            {
                                                singleVisaApplication?.visaType
                                                    ?.visa?.country?.countryName
                                            }
                                        </span>
                                    </div>
                                    <div className="mt-3">
                                        <span className="block text-[12px] text-grayColor">
                                            Visa Age Limit
                                        </span>
                                        <span className="block text-[15px]">
                                            {singleVisaApplication?.visaType
                                                ?.ageFrom +
                                                " - " +
                                                singleVisaApplication?.visaType
                                                    ?.ageTo}
                                        </span>
                                    </div>
                                    <div className="mt-3">
                                        <span className="block text-[12px] text-grayColor">
                                            Entry Type
                                        </span>
                                        <span className="block text-[15px] capitalize">
                                            {
                                                singleVisaApplication?.visaType
                                                    ?.entryType
                                            }
                                        </span>
                                    </div>
                                    <div className="mt-3">
                                        <span className="block text-[12px] text-grayColor">
                                            Validity Time
                                        </span>
                                        <span className="block text-[15px]">
                                            {singleVisaApplication?.visaType
                                                ?.validity +
                                                " " +
                                                singleVisaApplication?.visaType
                                                    ?.validityTimeFormat}
                                        </span>
                                    </div>
                                    <div className="mt-3">
                                        <span className="block text-[12px] text-grayColor">
                                            Stay period
                                        </span>
                                        <span className="block text-[15px]">
                                            {singleVisaApplication?.visaType
                                                ?.stayPeriod +
                                                " " +
                                                singleVisaApplication?.visaType
                                                    ?.stayPeriodFormat}
                                        </span>
                                    </div>
                                    <div className="mt-3">
                                        <span className="block text-[12px] text-grayColor">
                                            Processing Time
                                        </span>
                                        <span className="block text-[15px]">
                                            {singleVisaApplication?.visaType
                                                ?.processingTime +
                                                " " +
                                                singleVisaApplication?.visaType
                                                    ?.processingTimeFormat}
                                        </span>
                                    </div>
                                    <div className="mt-3">
                                        <span className="block text-[12px] text-grayColor">
                                            Visa TotalCost
                                        </span>
                                        <span className="block text-[15px]">
                                            {priceConversion(
                                                singleVisaApplication?.totalCost,
                                                selectedCurrency,
                                                true
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-[8px] mb-3">
                                        <span>
                                            <BsFillFileEarmarkPersonFill />
                                        </span>
                                        <span className="font-[600] text-[15px]">
                                            Enquiry Details
                                        </span>
                                    </div>
                                    <div className="mt-3">
                                        <span className="block text-[12px] text-grayColor">
                                            Reference Number
                                        </span>
                                        <span className="block text-[15px]">
                                            {
                                                singleVisaApplication?.referenceNumber
                                            }
                                        </span>
                                    </div>
                                    {singleVisaApplication.reseller ? (
                                        <>
                                            <div className="mt-3">
                                                <span className="block text-[12px] text-grayColor">
                                                    Reseller
                                                </span>
                                                <span className="block text-[15px]">
                                                    {
                                                        singleVisaApplication
                                                            ?.reseller?.name
                                                    }
                                                </span>
                                            </div>
                                            <div className="mt-3">
                                                <span className="block text-[12px] text-grayColor">
                                                    Reseller Agent Code
                                                </span>
                                                <span className="block text-[15px]">
                                                    {
                                                        singleVisaApplication
                                                            ?.reseller
                                                            ?.agentCode
                                                    }
                                                </span>
                                            </div>
                                            <div className="mt-3">
                                                <span className="block text-[12px] text-grayColor">
                                                    Reseller Company Name
                                                </span>
                                                <span className="block text-[15px] capitalize">
                                                    {
                                                        singleVisaApplication
                                                            ?.reseller
                                                            ?.companyName
                                                    }
                                                </span>
                                            </div>
                                            <div className="mt-3">
                                                <span className="block text-[12px] text-grayColor">
                                                    Reseller Phone Number
                                                </span>
                                                <span className="block text-[15px]">
                                                    {
                                                        singleVisaApplication
                                                            ?.reseller
                                                            ?.phoneNumber
                                                    }
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="mt-3">
                                                <span className="block text-[12px] text-grayColor">
                                                    User
                                                </span>
                                                <span className="block text-[15px]">
                                                    {
                                                        singleVisaApplication
                                                            ?.user?.name
                                                    }
                                                </span>
                                            </div>

                                            <div className="mt-3">
                                                <span className="block text-[12px] text-grayColor">
                                                    User Email
                                                </span>
                                                <span className="block text-[15px] capitalize">
                                                    {
                                                        singleVisaApplication
                                                            ?.user?.email
                                                    }
                                                </span>
                                            </div>
                                            <div className="mt-3">
                                                <span className="block text-[12px] text-grayColor">
                                                    User Phone Number
                                                </span>
                                                <span className="block text-[15px]">
                                                    {singleVisaApplication?.user
                                                        ?.phoneNumber || "N/A"}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                    <div className="mt-3">
                                        <span className="block text-[12px] text-grayColor">
                                            Applied at
                                        </span>
                                        <span className="block text-[15px]">
                                            {singleVisaApplication?.createdAt?.slice(
                                                0,
                                                10
                                            )}
                                        </span>
                                    </div>
                                    {/* <div className="mt-3">
                  <span className="block text-[12px] text-grayColor">
                    Document Status
                  </span>
                  <span className="block text-[15px]">
                    {singleVisaApplication?.isDocumentUplaoded === true
                      ? "Uploaded"
                      : "Not Uploaded"}
                  </span>
                </div> */}{" "}
                                    <div className="mt-3">
                                        <span className="block text-[12px] text-grayColor">
                                            Nationality
                                        </span>
                                        <span className="block text-[15px]">
                                            {
                                                singleVisaApplication
                                                    ?.nationality?.slug
                                            }
                                        </span>
                                    </div>
                                    <div className="mt-3">
                                        <span className="block text-[12px] text-grayColor">
                                            Total Amount
                                        </span>
                                        <span className="text-[15px] flex items-center gap-[10px]">
                                            {priceConversion(
                                                singleVisaApplication?.totalPrice,
                                                selectedCurrency,
                                                true
                                            )}{" "}
                                        </span>
                                    </div>
                                    <div className="mt-3">
                                        <span className="block text-[12px] text-grayColor">
                                            Status
                                        </span>
                                        <span className="text-[15px] flex items-center gap-[10px] capitalize">
                                            {singleVisaApplication?.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">
                                                No.
                                            </th>
                                            <th className="font-[500] p-3">
                                                Title
                                            </th>
                                            <th className="font-[500] p-3">
                                                First Name
                                            </th>
                                            <th className="font-[500] p-3">
                                                Last Name
                                            </th>
                                            <th className="font-[500] p-3">
                                                Passport Number
                                            </th>

                                            <th className="font-[500] p-3">
                                                Phone Number
                                            </th>
                                            <th className="font-[500] p-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {singleVisaApplication?.travellers?.map(
                                            (item, index) => (
                                                <VisaApplicationSingleTableRow
                                                    orderedBy={orderedBy}
                                                    singleVisaApplication={
                                                        singleVisaApplication
                                                    }
                                                    item={item}
                                                    key={index}
                                                    index={index}
                                                />
                                            )
                                        )}
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

export default SingleVisaApplication;
