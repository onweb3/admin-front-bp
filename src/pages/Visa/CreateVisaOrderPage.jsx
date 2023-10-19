import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../axios";
import { SelectDropdown } from "../../components";

export default function CreateVisaOrderPage() {
    const [visaCountries, setVisaCountries] = useState([]);
    const [visaNationalities, setVisaNationalities] = useState([]);
    const [resellers, setResellers] = useState([]);
    const [data, setData] = useState({
        countryId: "",
        nationalityId: "",
        resellerId: "",
    });
    const { jwtToken } = useSelector((state) => state.admin);

    const fetchCountries = async () => {
        try {
            const response = await axios.get(`/orders/visa/country/all`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setVisaCountries(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchNationality = async () => {
        try {
            const response = await axios.get(`/orders/visa/all/nationality`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setVisaNationalities(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchResellers = async () => {
        try {
            const response = await axios.get(
                `/orders/attraction/list/resellers`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            setResellers(response.data);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            // setIsLoading(false);
        }
    };

    const handleSingleChange = ({ name, value }) => {
        setData((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    useEffect(() => {
        fetchNationality();
        fetchCountries();
        fetchResellers();
    }, []);

    console.log(visaCountries, "visaCountries");
    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">Create Visa Order</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/order" className="text-textColor">
                        Orders{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Visa</span>
                </div>
            </div>{" "}
            <div className="p-6">
                <div className="bg-white rounded p-6 shadow-sm">
                    <form
                        action=""
                        // onSubmit={handleSubmit}
                        className=""
                    >
                        <div>
                            <div className="w-full p-5">
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="">
                                            {" "}
                                            Select country
                                        </label>
                                        <div className="">
                                            <SelectDropdown
                                                data={visaCountries}
                                                setData={setVisaCountries}
                                                displayName={"countryName"}
                                                selectedData={data?.countryId}
                                                setSelectedData={(value) =>
                                                    handleSingleChange({
                                                        name: "countryId",
                                                        value: value,
                                                    })
                                                }
                                                valueName={"_id"}
                                                placeholder={"select a2a "}
                                                randomIndex={"_id"}
                                                disabled={false}
                                                addNewButton={false}
                                            />
                                        </div>
                                    </div>{" "}
                                    <div>
                                        <label htmlFor="">
                                            {" "}
                                            Select Nationality
                                        </label>
                                        <div className="">
                                            <SelectDropdown
                                                data={visaNationalities}
                                                setData={setVisaNationalities}
                                                displayName={"nationality"}
                                                selectedData={
                                                    data?.nationalityId
                                                }
                                                setSelectedData={(value) =>
                                                    handleSingleChange({
                                                        name: "nationalityId",
                                                        value: value,
                                                    })
                                                }
                                                valueName={"_id"}
                                                placeholder={
                                                    "select nationality "
                                                }
                                                randomIndex={"_id"}
                                                disabled={false}
                                                addNewButton={false}
                                            />
                                        </div>
                                    </div>{" "}
                                    <div>
                                        <label htmlFor=""> Reseller</label>
                                        <div className="">
                                            <SelectDropdown
                                                data={resellers}
                                                setData={setResellers}
                                                displayName={"companyName"}
                                                selectedData={data.resellerId}
                                                setSelectedData={(value) =>
                                                    handleSingleChange({
                                                        name: "resellerId",
                                                        value: value,
                                                    })
                                                }
                                                valueName={"_id"}
                                                randomIndex={"companyName"}
                                                disabled={false}
                                                addNewButton={false}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
