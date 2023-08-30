import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios";

import {
    handleOkToBoardChange,
    updateSelectedVisa,
    handleQuotationDisableChange,
    updateSelectedVisNationality,
} from "../../redux/slices/quotationSlice";

export default function VisaQuotaionForm() {
    const {
        visas,
        selectedVisa,
        selectedVisaCountry,
        otbPrice,
        isVisaQuotationDisabled,
        selectedVisaNationality,
    } = useSelector((state) => state.quotations);
    const { jwtToken } = useSelector((state) => state.admin);

    const [visa, setVisa] = useState([]);
    const [nationalities, setNationalitiies] = useState([]);
    const [selectedNationality, setSelectedNationality] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const fetchVisasNationality = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`/quotations/inital/nationality`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setNationalitiies(res.data || []);
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);

            console.log(err);
        }
    };
    const fetchVisaData = async () => {
        try {
            const res = await axios.get(
                `/quotations/inital/visa-type/${selectedVisaNationality}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setVisa(res.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchVisasNationality();
    }, []);

    useEffect(() => {
        if (nationalities.length > 0) {
            fetchVisaData();
        }
    }, [selectedVisaNationality, nationalities]);

    return (
        <div>
            <div className="flex items-center mb-7 gap-4">
                <input
                    type="checkbox"
                    className="w-[16px] h-[16px]"
                    checked={!isVisaQuotationDisabled}
                    onChange={(e) =>
                        dispatch(
                            handleQuotationDisableChange({
                                name: "isVisaQuotationDisabled",
                                value: !e.target.checked,
                            })
                        )
                    }
                />
                <h1 className="text-base font-[600] text-blue-500">
                    Visa Quotation
                </h1>
            </div>
            {isVisaQuotationDisabled === false ? (
                <>
                    <div className="flex items-start gap-[2em]">
                        <label htmlFor="" className="w-[100%] max-w-[180px]">
                            Visas
                        </label>
                        <div className=" gap-[2em]">
                            {
                                <select
                                    name="selected"
                                    value={selectedVisaNationality || ""}
                                    onChange={(e) => {
                                        setSelectedNationality(e.target.value);
                                        dispatch(
                                            updateSelectedVisNationality(
                                                e.target.value
                                            )
                                        );
                                        setVisa([]);
                                    }}
                                    id=""
                                    required
                                    className="w-[300px] mb-5"
                                >
                                    {" "}
                                    <option value="">select</option>
                                    {nationalities.map((nationality, index) => (
                                        <option
                                            key={index}
                                            value={nationality._id}
                                        >
                                            {nationality.nationality}
                                        </option>
                                    ))}
                                </select>
                            }
                            {selectedVisaNationality ? (
                                <div className="flex flex-wrap items-center gap-[30px]">
                                    {isLoading
                                        ? "Loading ..."
                                        : visa?.map((visa, index) => {
                                              return (
                                                  <div
                                                      className="flex items-center gap-[10px]"
                                                      key={index}
                                                  >
                                                      <input
                                                          type="radio"
                                                          className="w-[18px] h-[18px]"
                                                          name="visa"
                                                          value={visa?.visaId}
                                                          onChange={() =>
                                                              dispatch(
                                                                  updateSelectedVisa(
                                                                      visa
                                                                  )
                                                              )
                                                          }
                                                          defaultChecked={
                                                              selectedVisa ===
                                                              visa?.visaId
                                                          }
                                                      />
                                                      <label className="mb-0">
                                                          {visa?.visaName}{" "}
                                                          <span className="text-sm text-gray-500"></span>
                                                          <span className="text-sm text-gray-500">
                                                              (
                                                              {visa?.adultPrice}{" "}
                                                              AED)
                                                          </span>
                                                      </label>
                                                  </div>
                                              );
                                          })}
                                </div>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                    {selectedVisa && Object.keys(selectedVisa)?.length > 0 && (
                        <div className="flex items-start gap-[2em] mt-6">
                            <label
                                htmlFor=""
                                className="w-[100%] max-w-[180px]"
                            >
                                OTB Price
                            </label>
                            <input
                                type="number"
                                placeholder="Enter the price"
                                value={otbPrice || ""}
                                onChange={(e) =>
                                    dispatch(
                                        handleOkToBoardChange(e.target.value)
                                    )
                                }
                                onWheel={(e) => e.target.blur()}
                            />
                        </div>
                    )}
                    {/* <div className="flex items-start gap-[2em] mt-6">
                        <label htmlFor="" className="w-[100%] max-w-[180px]">
                            Total
                        </label>
                        <span className="text-sm font-medium">
                            {Object.keys(selectedVisa).length > 0
                                ? selectedVisa?.price + Number(otbPrice)
                                : "0.00"}{" "}
                            AED
                        </span>
                    </div> */}
                </>
            ) : (
                ""
            )}
            {/* <div className="flex items-center gap-[10px] mt-5">
                <input
                    type="checkbox"
                    className="w-[16px] h-[16px]"
                    checked={isVisaQuotationDisabled}
                    onChange={(e) =>
                        dispatch(
                            handleQuotationDisableChange({
                                name: "isVisaQuotationDisabled",
                                value: e.target.checked,
                            })
                        )
                    }
                />
                <label htmlFor="" className="mb-0">
                    Please check this box if you don't need visa quotation
                </label>
            </div> */}
        </div>
    );
}
