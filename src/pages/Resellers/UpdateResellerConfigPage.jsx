import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { BtnLoader, MultipleSelectDropdown, PageLoader, Toggle } from "../../components";

export default function UpdateResellerConfigPage() {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState({
        showAttraction: false,
        showInsurance: false,
        showHotel: false,
        showFlight: false,
        showVisa: false,
        showA2a: false,
        showQuotaion: false,
        reseller: {},
        allowedPaymentMethods: [],

        // add new api integrations 
        showAttractionApi: false,
        showHotelApi:  false,
        showFlightApi:  false,
        showVisaApi:  false,
        showA2aApi: false,
        showQuotaionApi:  false,
        showInsuranceApi: false,
    });

    const { id } = useParams();
    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            setError("");

            await axios.patch(
                `/resellers/update/${id}/configurations`,
                {
                    showAttraction: data.showAttraction,
                    showInsurance: data.showInsurance,
                    showHotel: data.showHotel,
                    showFlight: data.showFlight,
                    showVisa: data.showVisa,
                    showA2a: data.showA2a,
                    showQuotaion: data.showQuotaion,
                    allowedPaymentMethods: data.allowedPaymentMethods,
                    showAttractionApi:data.showAttractionApi,
                    showHotelApi: data.showHotelApi,
                    showA2aApi: data.showA2aApi,
                    showFlightApi: data.showFlightApi,
                    showInsuranceApi: data.showInsuranceApi,
                    showQuotaionApi: data.showQuotaionApi,
                    showVisaApi: data.showVisaApi
                },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
            navigate(`/b2b/${id}/details`);
        } catch (err) {
            setIsLoading(false);
            setError(err?.response?.data?.error || "Something went wrong, try again");
        }
    };

    const fetchReseller = async (e) => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(`/resellers/single/${id}/configurations`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            console.log(response.data);
            setData((prev) => {
                return {
                    ...prev,
                    reseller: response.data,
                    showAttraction: response.data?.configuration?.showAttraction || false,
                    showInsurance: response.data?.configuration?.showInsurance || false,
                    showHotel: response.data?.configuration?.showHotel || false,
                    showFlight: response.data?.configuration?.showFlight || false,
                    showVisa: response.data?.configuration?.showVisa || false,
                    showA2a: response.data?.configuration?.showA2a || false,
                    showQuotaion: response.data?.configuration?.showQuotaion || false,

                    //add api integration configurations for new
                    showAttractionApi: response?.data?.configuration?.showAttractionApi || false,
                    showHotelApi: response?.data?.configuration?.showHotelApi || false,
                    showFlightApi: response?.data?.configuration?.showFlightApi || false,
                    showVisaApi: response?.data?.configuration?.showVisaApi || false,
                    showA2aApi: response?.data?.configuration?.showA2aApi || false,
                    showQuotaionApi: response?.data?.configuration?.showQuotaionApi || false,
                    showInsuranceApi: response?.data?.configuration?.showInsuranceApi || false,
                    allowedPaymentMethods:
                        response?.data?.configuration?.allowedPaymentMethods || [],
                };
            });
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleToggleChange = (name, value) => {
        setData((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    useEffect(() => {
        fetchReseller();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Reseller Configuration</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/b2b" className="text-textColor">
                        b2b{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to={`/b2b/${id}/details`} className="text-textColor">
                        {id?.slice(0, 3)}...{id?.slice(-3)}
                    </Link>
                    <span>{">"} </span>
                    <Link to={`/b2b/${id}/edit`} className="text-textColor">
                        Edit{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Configurations</span>
                </div>
            </div>
            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="p-4 bg-white rounded shadow-sm">
                        <div className="mb-5">
                            <h2 className="font-[600]">
                                {data.reseller?.companyName} - ({data.reseller?.agentCode})
                            </h2>
                            <span className="text-sm text-grayColor block">
                                {data?.reseller?.email}
                            </span>
                        </div>
                        <div className="grid grid-cols-5 gap-4">
                            <div>
                                <label htmlFor="">Show Attraction</label>
                                <Toggle
                                    onChange={(e) =>
                                        handleToggleChange("showAttraction", e.target.checked)
                                    }
                                    value={data.showAttraction || false}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Show Hotel</label>
                                <Toggle
                                    onChange={(e) =>
                                        handleToggleChange("showHotel", e.target.checked)
                                    }
                                    value={data.showHotel || false}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Show Flight</label>
                                <Toggle
                                    onChange={(e) =>
                                        handleToggleChange("showFlight", e.target.checked)
                                    }
                                    value={data.showFlight || false}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Show Visa</label>
                                <Toggle
                                    onChange={(e) =>
                                        handleToggleChange("showVisa", e.target.checked)
                                    }
                                    value={data.showVisa || false}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Show A2A</label>
                                <Toggle
                                    onChange={(e) =>
                                        handleToggleChange("showA2a", e.target.checked)
                                    }
                                    value={data.showA2a || false}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Show Quotaion</label>
                                <Toggle
                                    onChange={(e) =>
                                        handleToggleChange("showQuotaion", e.target.checked)
                                    }
                                    value={data.showQuotaion || false}
                                />
                            </div>
                            <div className="">
                                <label htmlFor="">Show Insurance</label>
                                <Toggle
                                    onChange={(e) =>
                                        handleToggleChange("showInsurance", e.target.checked)
                                    }
                                    value={data.showInsurance || false}
                                />
                            </div>
                        </div>

                        <div className="pt-10">
                            <div>
                                <h1 className="text-lg font-semibold uppercase">Api Integration Access</h1>
                            </div>
                            <div className="grid grid-cols-5 gap-4">
                            <div>
                                <label htmlFor="">Attraction API</label>
                                <Toggle
                                    onChange={(e) =>
                                        handleToggleChange("showAttractionApi", e.target.checked)
                                    }
                                    value={data.showAttractionApi || false}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Hotel API</label>
                                <Toggle
                                    onChange={(e) =>
                                        handleToggleChange("showHotelApi", e.target.checked)
                                    }
                                    value={data.showHotelApi || false}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Flight API</label>
                                <Toggle
                                    onChange={(e) =>
                                        handleToggleChange("showFlightApi", e.target.checked)
                                    }
                                    value={data.showFlightApi || false}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Visa API</label>
                                <Toggle
                                    onChange={(e) =>
                                        handleToggleChange("showVisaApi", e.target.checked)
                                    }
                                    value={data.showVisaApi || false}
                                />
                            </div>
                            <div>
                                <label htmlFor="">A2A API</label>
                                <Toggle
                                    onChange={(e) =>
                                        handleToggleChange("showA2aApi", e.target.checked)
                                    }
                                    value={data.showA2aApi || false}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Quotaion API</label>
                                <Toggle
                                    onChange={(e) =>
                                        handleToggleChange("showQuotaionApi", e.target.checked)
                                    }
                                    value={data.showQuotaionApi || false}
                                />
                            </div>
                            <div className="">
                                <label htmlFor="">Insurance API</label>
                                <Toggle
                                    onChange={(e) =>
                                        handleToggleChange("showInsuranceApi", e.target.checked)
                                    }
                                    value={data.showInsuranceApi || false}
                                />
                            </div>
                        </div>
                        </div>
                        <div className="mt-8 grid grid-cols-4 gap-4">
                            <div>
                                <label htmlFor="">Allowed Payment Methods *</label>
                                <MultipleSelectDropdown
                                    data={[
                                        { value: "wallet" },
                                        { value: "ccavenue" },
                                        { value: "pay-later" },
                                    ]}
                                    valueName="value"
                                    displayName="value"
                                    selectedData={data.allowedPaymentMethods}
                                    setSelectedData={(val) => {
                                        setData((prev) => {
                                            return { ...prev, allowedPaymentMethods: val };
                                        });
                                    }}
                                    randomIndex={"allowedPaymentMethods0001"}
                                />
                            </div>
                        </div>

                        {error && <span className="text-sm block text-red-500 mt-2">{error}</span>}
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>
                            <button className="w-[200px]" onClick={handleSubmit}>
                                {isLoading ? <BtnLoader /> : "Update Configuration"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
