import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../axios";
import { Pagination } from "../../../components";
import A2aProfileRow from "./A2aProfileRow";
import AttractionProfileRow from "./AttractionProfileRow";
import VisaProfileRow from "./visaProfileRow";
// import BookingsOrdersSingleRow from "./BookingsOrdersSingleRow";

export default function QuotationProfileTable({}) {
    const [quotation, setQuotation] = useState({
        hotelMarkupType: "flat",
        hotelMarkup: 0,
        landmarkMarkupType: "flat",
        landmarkMarkup: 0,
        visaMarkupType: "flat",
        visaMarkup: 0,
    });
    const [isLandMarkModalOpen, setIsLandmarkModalOpen] = useState(false);
    const [isHotelModalOpen, setIsHotelModalOpen] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(false);

    const [isVisaModalOpen, setIsVisaModalOpen] = useState(false);
    const { profileId } = useParams();
    const { id } = useParams();

    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);
    console.log(quotation, "quotationnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");

    const handleChange = (e) => {
        setQuotation((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const fetchQuotationInitialData = async () => {
        try {
            setIsPageLoading(true);
            // const searchQuery = `skip=${filters?.skip}&limit=${filters.limit}`;

            if (profileId) {
                const response = await axios.get(
                    `/profile/get-all-quotation/${profileId}`,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );

                setQuotation(response.data);
            } else {
                const response = await axios.get(
                    `/profile/b2b/get-all-quotation/${id}`,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );

                setQuotation(response.data);
            }

            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchQuotationInitialData();
    }, []);

    const handleSubmit = async (value) => {
        // setQuotation((prev) => ({
        //     ...prev,
        //     ...formData,
        // }));
        if (profileId) {
            const response = await axios.post(
                `/profile/update-quotation-profile/${profileId}`,
                quotation,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
        } else {
            const response = await axios.post(
                `/profile/b2b/update-quotation-profile/${id}`,
                quotation,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
        }

        if (value === "visa") {
            setIsVisaModalOpen(false);
        } else if (value === "hotel") {
            setIsHotelModalOpen(false);
        } else if (value === "landmark") {
            setIsLandmarkModalOpen(false);
        }
    };

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                        <tr>
                            <th className="font-[500] p-3">Index</th>
                            <th className="font-[500] p-3">Name</th>

                            <th className="font-[500] p-3">Markup Type</th>
                            <th className="font-[500] p-3">Markup </th>

                            <th className="font-[500] p-3">Edit</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        <tr className="border-b border-tableBorderColor">
                            <td className="p-3">1</td>
                            <td className="p-3">Landmark</td>
                            {isLandMarkModalOpen ? (
                                <td className="p-3">
                                    <select
                                        name="landmarkMarkupType"
                                        value={
                                            quotation?.landmarkMarkupType || ""
                                        }
                                        onChange={handleChange}
                                    >
                                        <option value="" hidden>
                                            Markup Type
                                        </option>
                                        <option value="flat">flat</option>
                                        <option value="percentage">
                                            percentage
                                        </option>
                                    </select>{" "}
                                </td>
                            ) : (
                                <td className="p-3 capitalize">
                                    <span>
                                        {quotation?.landmarkMarkupType
                                            ? quotation?.landmarkMarkupType
                                            : "N/A"}{" "}
                                    </span>
                                </td>
                            )}
                            {isLandMarkModalOpen ? (
                                <td className="p-3">
                                    <input
                                        type="number"
                                        name="landmarkMarkup"
                                        value={quotation?.landmarkMarkup || ""}
                                        onChange={handleChange}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-1 w-[150px]"
                                    />
                                </td>
                            ) : (
                                <td className="p-3 capitalize">
                                    <span>{quotation?.landmarkMarkup}</span>
                                </td>
                            )}
                            {isLandMarkModalOpen ? (
                                <td
                                    className="p-3"
                                    onClick={(e) => {
                                        handleSubmit("landmark");
                                    }}
                                >
                                    <button className="w-[50px] bg-green-500">
                                        Apply{" "}
                                    </button>
                                </td>
                            ) : (
                                <td
                                    className="p-3"
                                    onClick={() => setIsLandmarkModalOpen(true)}
                                >
                                    <button className="w-[50px]">Edit </button>
                                </td>
                            )}
                        </tr>
                        <tr className="border-b border-tableBorderColor">
                            <td className="p-3">2</td>
                            <td className="p-3">Hotel</td>
                            {isHotelModalOpen ? (
                                <td className="p-3">
                                    <select
                                        name="hotelMarkupType"
                                        value={quotation?.hotelMarkupType || ""}
                                        onChange={handleChange}
                                    >
                                        <option value="" hidden>
                                            Markup Type
                                        </option>
                                        <option value="flat">flat</option>
                                        <option value="percentage">
                                            percentage
                                        </option>
                                    </select>{" "}
                                </td>
                            ) : (
                                <td className="p-3 capitalize">
                                    <span>
                                        {quotation?.hotelMarkupType
                                            ? quotation.hotelMarkupType
                                            : "N/A"}{" "}
                                    </span>
                                </td>
                            )}
                            {isHotelModalOpen ? (
                                <td className="p-3">
                                    <input
                                        type="number"
                                        name="hotelMarkup"
                                        value={quotation?.hotelMarkup || ""}
                                        onChange={handleChange}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-1 w-[150px]"
                                    />
                                </td>
                            ) : (
                                <td className="p-3 capitalize">
                                    <span>{quotation?.hotelMarkup || 0}</span>
                                </td>
                            )}{" "}
                            {isHotelModalOpen ? (
                                <td
                                    className="p-3"
                                    onClick={(e) => {
                                        handleSubmit("hotel");
                                    }}
                                >
                                    <button className="w-[50px] bg-green-500">
                                        Add{" "}
                                    </button>
                                </td>
                            ) : (
                                <td
                                    className="p-3"
                                    onClick={() => setIsHotelModalOpen(true)}
                                >
                                    <button className="w-[50px]">Edit </button>
                                </td>
                            )}{" "}
                        </tr>
                        <tr className="border-b border-tableBorderColor">
                            <td className="p-3">3</td>
                            <td className="p-3">Visa</td>
                            {isVisaModalOpen ? (
                                <td className="p-3">
                                    <select
                                        name="visaMarkupType"
                                        value={quotation?.visaMarkupType || ""}
                                        onChange={handleChange}
                                    >
                                        <option value="" hidden>
                                            Markup Type
                                        </option>
                                        <option value="flat">flat</option>
                                        <option value="percentage">
                                            percentage
                                        </option>
                                    </select>{" "}
                                </td>
                            ) : (
                                <td className="p-3 capitalize">
                                    <span>
                                        {quotation?.visaMarkupType
                                            ? quotation.visaMarkupType
                                            : "N/A"}{" "}
                                    </span>
                                </td>
                            )}
                            {isVisaModalOpen ? (
                                <td className="p-3">
                                    <input
                                        type="number"
                                        name="visaMarkup"
                                        value={quotation?.visaMarkup || ""}
                                        onChange={handleChange}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-1 w-[150px]"
                                    />
                                </td>
                            ) : (
                                <td className="p-3 capitalize">
                                    <span>{quotation?.visaMarkup}</span>
                                </td>
                            )}{" "}
                            {isVisaModalOpen ? (
                                <td
                                    className="p-3"
                                    onClick={(e) => {
                                        handleSubmit("visa");
                                    }}
                                >
                                    <button className="w-[50px] bg-green-500">
                                        Add{" "}
                                    </button>
                                </td>
                            ) : (
                                <td
                                    className="p-3"
                                    onClick={() => setIsVisaModalOpen(true)}
                                >
                                    <button className="w-[50px]">Edit </button>
                                </td>
                            )}{" "}
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="p-4">
                {/* <Pagination
                    // limit={filters?.limit}
                    // skip={filters?.skip}
                    // total={filters?.totalOrders}
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
                /> */}
            </div>
        </div>
    );
}
