import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";

import axios from "../../axios";
import { PageLoader } from "../../components";

export default function BankAccountsListPage() {
    const [bankAccounts, setBankAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchBankAccounts = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(`/company/bank-info/all`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setBankAccounts(response?.data);

            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteBankAccount = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete this account");
            if (isConfirm) {
                await axios.delete(`/company/bank-info/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredBankAccounts = bankAccounts?.filter((item) => {
                    return item?._id !== id;
                });
                setBankAccounts(filteredBankAccounts);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchBankAccounts();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Bank Accounts</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Bank Accounts</span>
                </div>
            </div>

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Bank Accounts</h1>
                            <Link to="add">
                                <button className="px-3">+ Add Bank Account</button>
                            </Link>
                        </div>
                        {bankAccounts?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Bank Accounts Found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">Country</th>
                                            <th className="font-[500] p-3">Bank Name</th>
                                            <th className="font-[500] p-3">Address</th>
                                            <th className="font-[500] p-3">Account Number</th>
                                            <th className="font-[500] p-3">IFSC Code</th>
                                            <th className="font-[500] p-3">IBAN Code</th>
                                            <th className="font-[500] p-3">Swift Code</th>
                                            <th className="font-[500] p-3">Holder Name</th>
                                            <th className="font-[500] p-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {bankAccounts?.map((bank, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor"
                                                >
                                                    <td className="p-3 uppercase">
                                                        {bank?.countryCode}
                                                    </td>
                                                    <td className="p-3 capitalize">
                                                        {bank?.bankName}
                                                    </td>
                                                    <td className="p-3">
                                                        {bank?.branchAddress || "N/A"}
                                                    </td>
                                                    <td className="p-3">{bank?.accountNumber}</td>
                                                    <td className="p-3">
                                                        {bank?.ifscCode || "N/A"}
                                                    </td>
                                                    <td className="p-3">
                                                        {bank?.ibanCode || "N/A"}
                                                    </td>
                                                    <td>{bank?.swiftCode || "N/A"}</td>
                                                    <td className="p-3">
                                                        {bank?.accountHolderName}
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex gap-[10px]">
                                                            <button
                                                                className="h-auto bg-transparent text-red-500 text-xl"
                                                                onClick={() =>
                                                                    deleteBankAccount(bank?._id)
                                                                }
                                                            >
                                                                <MdDelete />
                                                            </button>
                                                            <Link to={`${bank?._id}/edit`}>
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
