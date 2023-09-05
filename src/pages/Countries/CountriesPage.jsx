import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import { AiFillEye } from "react-icons/ai";

import { PageLoader } from "../../components";
import axios from "../../axios";
import { deleteCountry } from "../../redux/slices/generalSlice";
import AddCountryModal from "../../features/Countries/components/AddCountryModal";
import { hasPermission } from "../../utils";

export default function CountriesPage() {
    const [countryModal, setCountryModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedCountry, setSelectedCountry] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCountries, setFilteredCountries] = useState([]);

    const { countries, isGeneralLoading } = useSelector((state) => state.general);
    const { jwtToken, admin } = useSelector((state) => state.admin);
    const dispatch = useDispatch();

    useEffect(() => {
        const tempFilteredCountries = countries?.filter((item) => {
            return (
                item?.countryName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                item?.isocode?.toLowerCase()?.includes(searchQuery?.toLowerCase())
            );
        });
        setFilteredCountries(tempFilteredCountries);
    }, [countries, searchQuery]);

    const handleDelete = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/countries/delete/${id}`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                dispatch(deleteCountry(id));
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Countries</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Countries</span>
                </div>
            </div>

            {countryModal?.isOpen && (
                <AddCountryModal
                    countryModal={countryModal}
                    setCountryModal={setCountryModal}
                    selectedCountry={selectedCountry}
                />
            )}

            {isGeneralLoading ? (
                <div>
                    <PageLoader />
                </div>
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Countries</h1>
                            <div className="flex items-center gap-[10px]">
                                <input
                                    type="text"
                                    placeholder="Search here..."
                                    className="min-w-[200px]"
                                    name="searchQuery"
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    value={searchQuery || ""}
                                />

                                {hasPermission({
                                    roles: admin?.roles,
                                    name: "countries",
                                    permission: "create",
                                }) && (
                                    <button
                                        className="w-[200px]"
                                        onClick={() =>
                                            setCountryModal({
                                                isEdit: false,
                                                isOpen: true,
                                            })
                                        }
                                    >
                                        + Add Country
                                    </button>
                                )}
                            </div>
                        </div>
                        {!filteredCountries || filteredCountries?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Countries Found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">ISO code</th>
                                            <th className="font-[500] p-3">Country</th>
                                            <th className="font-[500] p-3">Phonecode</th>
                                            <th className="font-[500] p-3">States</th>
                                            {(hasPermission({
                                                roles: admin?.roles,
                                                name: "countries",
                                                permission: "update",
                                            }) ||
                                                hasPermission({
                                                    roles: admin?.roles,
                                                    name: "countries",
                                                    permission: "delete",
                                                })) && <th className="font-[500] p-3">Action</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {filteredCountries?.map((country, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor"
                                                >
                                                    <td className="p-3">{country?.isocode}</td>
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-[10px]">
                                                            <img
                                                                src={country?.flag}
                                                                alt=""
                                                                className="w-[30px]"
                                                            />
                                                            <span className="capitalize">
                                                                {country?.countryName}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3">{country?.phonecode}</td>
                                                    <td className="p-3">
                                                        <Link to={`${country?._id}/states`}>
                                                            <button className="h-auto bg-transparent text-[#333] text-xl">
                                                                <AiFillEye />
                                                            </button>
                                                        </Link>
                                                    </td>
                                                    {(hasPermission({
                                                        roles: admin?.roles,
                                                        name: "countries",
                                                        permission: "update",
                                                    }) ||
                                                        hasPermission({
                                                            roles: admin?.roles,
                                                            name: "countries",
                                                            permission: "delete",
                                                        })) && (
                                                        <td className="p-3">
                                                            <div className="flex gap-[10px]">
                                                                {hasPermission({
                                                                    roles: admin?.roles,
                                                                    name: "countries",
                                                                    permission: "delete",
                                                                }) && (
                                                                    <button
                                                                        className="h-auto bg-transparent text-red-500 text-xl"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                country?._id
                                                                            )
                                                                        }
                                                                    >
                                                                        <MdDelete />
                                                                    </button>
                                                                )}
                                                                {hasPermission({
                                                                    roles: admin?.roles,
                                                                    name: "countries",
                                                                    permission: "update",
                                                                }) && (
                                                                    <button
                                                                        className="h-auto bg-transparent text-green-500 text-xl"
                                                                        onClick={() => {
                                                                            setSelectedCountry(
                                                                                country
                                                                            );
                                                                            setCountryModal({
                                                                                isOpen: true,
                                                                                isEdit: true,
                                                                            });
                                                                        }}
                                                                    >
                                                                        <BiEditAlt />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
