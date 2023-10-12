import React, { useState } from "react";
import { PageLoader, Pagination } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import axios from "../../axios";
import { deleteCurrency } from "../../redux/slices/generalSlice";
import { AddCurrencyModal } from "../../features/Countries";

export default function CurrenciesPage() {
    const [currencyModal, setCurrencyModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedCurrency, setSelectedCurrency] = useState({});

    const { currencies, isGeneralLoading } = useSelector(
        (state) => state.general
    );
    const { jwtToken } = useSelector((state) => state.admin);
    const dispatch = useDispatch();

    const delCurrency = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/currencies/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });
                dispatch(deleteCurrency(id));
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Currencies</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Currencies</span>
                </div>
            </div>

            {currencyModal?.isOpen && (
                <AddCurrencyModal
                    currencyModal={currencyModal}
                    setCurrencyModal={setCurrencyModal}
                    selectedCurrency={selectedCurrency}
                />
            )}

            {isGeneralLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Currencies</h1>
                            <button
                                className="px-3"
                                onClick={() =>
                                    setCurrencyModal({
                                        isOpen: true,
                                        isEdit: false,
                                    })
                                }
                            >
                                + Add Currency
                            </button>
                        </div>
                        {!currencies || currencies?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Currencies Found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">
                                                Currency
                                            </th>
                                            <th className="font-[500] p-3">
                                                Symbol
                                            </th>
                                            <th className="font-[500] p-3">
                                                Country
                                            </th>
                                            <th className="font-[500] p-3">
                                                Conversion Rate
                                            </th>
                                            <th className="font-[500] p-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {currencies?.map((currency, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor"
                                                >
                                                    <td className="p-3">
                                                        {currency?.currencyName}
                                                    </td>
                                                    <td className="p-3 capitalize">
                                                        {
                                                            currency?.currencySymbol
                                                        }{" "}
                                                        ({currency?.isocode})
                                                    </td>
                                                    <td className="p-3 capitalize">
                                                        {
                                                            currency?.country
                                                                ?.countryName
                                                        }
                                                    </td>
                                                    <td className="p-3 capitalize">
                                                        {
                                                            currency?.conversionRate
                                                        }{" "}
                                                        {currency?.isocode}
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex gap-[10px]">
                                                            <button
                                                                className="h-auto bg-transparent text-red-500 text-xl"
                                                                onClick={() =>
                                                                    delCurrency(
                                                                        currency?._id
                                                                    )
                                                                }
                                                            >
                                                                <MdDelete />
                                                            </button>
                                                            <button
                                                                className="h-auto bg-transparent text-green-500 text-xl"
                                                                onClick={() => {
                                                                    setSelectedCurrency(
                                                                        currency
                                                                    );
                                                                    setCurrencyModal(
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
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
