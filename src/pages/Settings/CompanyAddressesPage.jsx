import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import { Link } from "react-router-dom";
import { PageLoader } from "../../components";

export default function CompanyAddressesPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [addresses, setAddresses] = useState([]);

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchAddresses = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("/company/addresses/all", {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setAddresses(response?.data?.companyAddresses);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteAddress = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure you want to delete?");
            if (isConfirm) {
                await axios.delete(`/company/addresses/delete/${id}`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });

                const filteredAddresses = addresses.filter((address) => {
                    return address?._id !== id;
                });
                setAddresses(filteredAddresses);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Addresses</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Company </span>
                    <span>{">"} </span>
                    <span>Addresses</span>
                </div>
            </div>

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Addresses</h1>
                            <Link to="add">
                                <button className="px-3">+ Add Address</button>
                            </Link>
                        </div>
                        {addresses?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Addresses Found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">Location</th>
                                            <th className="font-[500] p-3">companyName</th>
                                            <th className="font-[500] p-3">Country</th>
                                            <th className="font-[500] p-3">Address</th>
                                            <th className="font-[500] p-3">Phone Number</th>
                                            <th className="font-[500] p-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {addresses?.map((address, index) => {
                                            return (
                                                <tr key={index} className="border-b border-tableBorderColor">
                                                    <td className="p-3">{address?.location}</td>
                                                    <td className="p-3">{address?.companyName}</td>
                                                    <td className="p-3 capitalize">
                                                        {address?.state?.stateName},{" "}
                                                        {address?.country?.countryName}
                                                    </td>
                                                    <td className="p-3">{address?.address}</td>
                                                    <td className="p-3">{address?.phoneNumber}</td>
                                                    <td className="p-3">
                                                        <div className="flex gap-[10px]">
                                                            <button
                                                                className="h-auto bg-transparent text-red-500 text-xl"
                                                                onClick={() => deleteAddress(address?._id)}
                                                            >
                                                                <MdDelete />
                                                            </button>
                                                            <Link to={`${address?._id}/edit`}>
                                                                <button className="h-auto bg-transparent text-green-500 text-xl">
                                                                    <BiEditAlt />
                                                                </button>
                                                            </Link>
                                                        </div>
                                                    </td>
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
