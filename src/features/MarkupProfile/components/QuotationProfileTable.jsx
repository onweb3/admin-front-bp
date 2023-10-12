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
        landAttractionMarkupType: "flat",
        landAttractionMarkup: 0,
        landTransferMarkupType: "flat",
        landTransferMarkup: 0,
        visaMarkupType: "flat",
        visaMarkup: 0,
    });
    const [isLandTransferModalOpen, setIsLandTransferModalOpen] =
        useState(false);
    const [isLandAttractionModalOpen, setIsLandAttractionModalOpen] =
        useState(false);

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
                const {
                    hotelMarkupType,
                    hotelMarkup,
                    landAttractionMarkupType,
                    landAttractionMarkup,
                    landTransferMarkupType,
                    landTransferMarkup,

                    visaMarkupType,
                    visaMarkup,
                } = response.data;
                console.log(
                    hotelMarkup,
                    landAttractionMarkupType,
                    landAttractionMarkup,
                    landTransferMarkupType,
                    landTransferMarkup,

                    visaMarkupType,
                    visaMarkup,
                    "11111"
                );

                setQuotation({
                    hotelMarkup,
                    landAttractionMarkupType,
                    landAttractionMarkup,
                    landTransferMarkupType,
                    landTransferMarkup,

                    visaMarkupType,
                    visaMarkup,
                });
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
        } else if (value === "landAttraction") {
            setIsLandAttractionModalOpen(false);
        } else if (value === "landTransfer") {
            setIsLandTransferModalOpen(false);
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
                            <td className="p-3">Land Attraction</td>
                            {isLandAttractionModalOpen ? (
                                <td className="p-3">
                                    <select
                                        name="landAttractionMarkupType"
                                        value={
                                            quotation?.landAttractionMarkupType ||
                                            ""
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
                                        {quotation?.landAttractionMarkupType
                                            ? quotation?.landAttractionMarkupType
                                            : "N/A"}{" "}
                                    </span>
                                </td>
                            )}
                            {isLandAttractionModalOpen ? (
                                <td className="p-3">
                                    <input
                                        type="number"
                                        name="landAttractionMarkup"
                                        value={
                                            quotation?.landAttractionMarkup ||
                                            ""
                                        }
                                        onChange={handleChange}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-1 w-[150px]"
                                    />
                                </td>
                            ) : (
                                <td className="p-3 capitalize">
                                    <span>
                                        {quotation?.landAttractionMarkup}
                                    </span>
                                </td>
                            )}
                            {isLandAttractionModalOpen ? (
                                <td
                                    className="p-3"
                                    onClick={(e) => {
                                        handleSubmit("landAttraction");
                                    }}
                                >
                                    <button className="w-[50px] bg-green-500">
                                        Apply{" "}
                                    </button>
                                </td>
                            ) : (
                                <td
                                    className="p-3"
                                    onClick={() =>
                                        setIsLandAttractionModalOpen(true)
                                    }
                                >
                                    <button className="w-[50px]">Edit </button>
                                </td>
                            )}
                        </tr>
                        <tr className="border-b border-tableBorderColor">
                            <td className="p-3">1</td>
                            <td className="p-3">Land Transfer</td>
                            {isLandTransferModalOpen ? (
                                <td className="p-3">
                                    <select
                                        name="landTransferMarkupType"
                                        value={
                                            quotation?.landTransferMarkupType ||
                                            ""
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
                                        {quotation?.landTransferMarkupType
                                            ? quotation?.landTransferMarkupType
                                            : "N/A"}{" "}
                                    </span>
                                </td>
                            )}
                            {isLandTransferModalOpen ? (
                                <td className="p-3">
                                    <input
                                        type="number"
                                        name="landTransferMarkup"
                                        value={
                                            quotation?.landTransferMarkup || ""
                                        }
                                        onChange={handleChange}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-1 w-[150px]"
                                    />
                                </td>
                            ) : (
                                <td className="p-3 capitalize">
                                    <span>{quotation?.landTransferMarkup}</span>
                                </td>
                            )}
                            {isLandTransferModalOpen ? (
                                <td
                                    className="p-3"
                                    onClick={(e) => {
                                        handleSubmit("landTransfer");
                                    }}
                                >
                                    <button className="w-[50px] bg-green-500">
                                        Apply{" "}
                                    </button>
                                </td>
                            ) : (
                                <td
                                    className="p-3"
                                    onClick={() =>
                                        setIsLandTransferModalOpen(true)
                                    }
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
