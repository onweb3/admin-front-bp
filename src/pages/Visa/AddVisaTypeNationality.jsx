import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import VisaApplicationTable from "../../features/Visa/components/VisaApplicationTable";
import { formatDate } from "../../utils";
import AddNationalityModal from "../../features/Visa/components/AddNationalityModal";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import AddVisaTypeModal from "../../features/Visa/components/AddVisaTypeModal";

export default function AddVisaTypeNationality() {
    const [visaTypes, setVisaTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalVisaTypes: 0,
        searchQuery: "",
        requestedBy: "b2c",
    });
    const [error, setError] = useState("");

    const [nationalityModal, setNationalityModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const { id } = useParams();
    const { jwtToken } = useSelector((state) => state.admin);
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedVisaType, setSelectedVisaType] = useState({});

    const prevSearchParams = (e) => {
        let params = {};
        for (let [key, value] of searchParams.entries()) {
            params[key] = value;
        }
        return params;
    };

    const handleChange = (e) => {
        let params = prevSearchParams();
        setSearchParams({
            ...params,
            [e.target.name]: e.target.value,
            skip: 0,
        });
    };

    const deleteNationality = async (visaTpeId) => {
        try {
            const response = await axios.delete(
                `/visa/nationality/delete/${id}/visa-type/${visaTpeId}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            const filteredNationality = visaTypes?.filter((visaType, ind) => {
                return visaType.visaId !== visaTpeId;
            });

            setVisaTypes(filteredNationality);
        } catch (err) {
            setError(
                err?.response?.data?.error ||
                    "Something went wrong! try again.."
            );
            // setErrorStatus(true);
        }
    };

    const fetchVisaTypes = async ({ skip, limit, searchQuery }) => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/visa/nationality/visa-types/${id}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            console.log(response.data, "response");

            setVisaTypes(response.data.visaTypes);
            // setFilters((prev) => {
            //     return {
            //         ...prev,
            //         totalVisaEnquiries: response.data?.totalVisa,
            //     };
            // });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setVisaTypes([]);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let skip =
            Number(searchParams.get("skip")) > 0
                ? Number(searchParams.get("skip")) - 1
                : 0;
        let limit =
            Number(searchParams.get("limit")) > 0
                ? Number(searchParams.get("limit"))
                : 10;
        let searchQuery = searchParams.get("searchQuery") || "";

        setFilters((prev) => {
            return { ...prev, skip, limit, searchQuery };
        });
        fetchVisaTypes({ skip, limit, searchQuery });
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Nationality - Visa Types
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/airports" className="text-textColor">
                        Visa{" "}
                    </Link>
                    <span>{">"} </span>

                    <span> Nationality - Visa Types</span>
                </div>
            </div>

            {nationalityModal?.isOpen && (
                <AddVisaTypeModal
                    nationalityModal={nationalityModal}
                    setNationalityModal={setNationalityModal}
                    selectedVisaType={selectedVisaType}
                    visaTypes={visaTypes}
                    setVisaTypes={setVisaTypes}
                />
            )}

            {isLoading ? (
                <div>
                    <PageLoader />
                </div>
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium capitalize">
                                Nationality - (Visa Types)
                            </h1>
                            <button
                                className="px-3"
                                onClick={() => {
                                    setNationalityModal({
                                        isOpen: true,
                                        isEdit: false,
                                    });
                                    // setSelectedTerminal({
                                    //     terminalCode: "",
                                    //     terminalName: "",
                                    //     access: [],
                                    // });
                                }}
                            >
                                + Add Visa Type
                            </button>
                        </div>
                        {!visaTypes || visaTypes?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Nationalities Found
                                </span>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">
                                            Index
                                        </th>
                                        <th className="font-[500] p-3">
                                            VisaType Name
                                        </th>
                                        <th className="font-[500] p-3">
                                            Adult Price
                                        </th>
                                        <th className="font-[500] p-3">
                                            Child Price
                                        </th>
                                        <th className="font-[500] p-3">
                                            Adult Cost
                                        </th>
                                        <th className="font-[500] p-3">
                                            Child Cost
                                        </th>

                                        <th className="font-[500] p-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {visaTypes?.map((visaType, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="border-b border-tableBorderColor"
                                            >
                                                <td className="p-3 capitalize">
                                                    {index + 1}
                                                </td>
                                                <td className="p-3">
                                                    {visaType?.visaName}
                                                </td>
                                                <td className="p-3 capitalize">
                                                    {visaType?.adultPrice}
                                                </td>
                                                <td className="p-3 capitalize">
                                                    {visaType?.childPrice}
                                                </td>
                                                <td className="p-3 capitalize">
                                                    {visaType?.adultCost}
                                                </td>
                                                <td className="p-3 capitalize">
                                                    {visaType?.childCost}
                                                </td>

                                                <td className="p-3">
                                                    <div className="flex gap-[10px]">
                                                        <button
                                                            className="h-auto bg-transparent text-red-500 text-xl"
                                                            onClick={() =>
                                                                deleteNationality(
                                                                    visaType?.visaId
                                                                )
                                                            }
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                        <button
                                                            className="h-auto bg-transparent text-green-500 text-xl"
                                                            onClick={() => {
                                                                setSelectedVisaType(
                                                                    visaType
                                                                );
                                                                setNationalityModal(
                                                                    {
                                                                        isOpen: true,
                                                                        isEdit: true,
                                                                    }
                                                                );
                                                            }}
                                                        >
                                                            <BiEditAlt />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
