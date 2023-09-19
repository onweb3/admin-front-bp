import React, { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../axios";
import {
    BtnLoader,
    MultipleSelectDropdown,
    PageLoader,
    Pagination,
} from "../../components";
import { ResellersTableRow } from "../../features/Resellers";

export default function SingleResellerAdminAccessPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [admins, setAdmins] = useState([]);
    const [data, setData] = useState({
        a2as: [],
        hotels: [],
        fligths: [],
        quotations: [],
        attractions: [],
        visas: [],
    });

    const navigate = useNavigate();
    const { id } = useParams();

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchAdmins = async () => {
        try {
            const response = await axios.get(`/access/admins`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            console.log(response, "response");
            setAdmins(response.data.admins);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchAdminAccess = async () => {
        try {
            const response = await axios.get(`/access/b2b/${id}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            const { a2as, hotels, attractions, quotations, visas, fligths } =
                response.data.adminAccess;

            setData({ a2as, hotels, attractions, quotations, visas, fligths });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAdminAccess();
        fetchAdmins();
    }, []);

    const handleAccessChange = (selectedData, module) => {
        setData((prev) => {
            return { ...prev, [module]: selectedData };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            await axios.patch(`/access/update/${id}`, data, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
            navigate(`/b2b/${id}/details`);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4">
            <div className="overflow-x-auto">
                {/* <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                        <tr>
                            <th className="font-[500] p-3">Module</th>
                            <th className="font-[500] p-3">Admins</th>

                            <th className="font-[500] p-3">Action</th>
                        </tr>
                    </thead> */}
                <div className="bg-white rounded p-6 shadow-sm">
                    <form action="" onSubmit={handleSubmit}>
                        {" "}
                        <div>
                            <h2 className="font-[600] text-lg mb-3">
                                Sales Representatives{" "}
                            </h2>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="">Attraction</label>

                                    <MultipleSelectDropdown
                                        data={admins}
                                        displayName={"name"}
                                        valueName={"_id"}
                                        selectedData={data?.attractions}
                                        setSelectedData={(selAccess) => {
                                            handleAccessChange(
                                                selAccess,
                                                "attractions"
                                            );
                                        }}
                                        randomIndex={"attractions"}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">A2a</label>

                                    <MultipleSelectDropdown
                                        data={admins}
                                        displayName={"name"}
                                        valueName={"_id"}
                                        selectedData={data?.a2as}
                                        setSelectedData={(selAccess) => {
                                            handleAccessChange(
                                                selAccess,
                                                "a2as"
                                            );
                                        }}
                                        randomIndex={"a2as"}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Hotel</label>

                                    <MultipleSelectDropdown
                                        data={admins}
                                        displayName={"name"}
                                        valueName={"_id"}
                                        selectedData={data?.hotels}
                                        setSelectedData={(selAccess) => {
                                            handleAccessChange(
                                                selAccess,
                                                "hotels"
                                            );
                                        }}
                                        randomIndex={"hotels"}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Flight</label>

                                    <MultipleSelectDropdown
                                        data={admins}
                                        displayName={"name"}
                                        valueName={"_id"}
                                        selectedData={data?.fligths}
                                        setSelectedData={(selAccess) => {
                                            handleAccessChange(
                                                selAccess,
                                                "fligths"
                                            );
                                        }}
                                        randomIndex={"fligths"}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Quotation</label>

                                    <MultipleSelectDropdown
                                        data={admins}
                                        displayName={"name"}
                                        valueName={"_id"}
                                        selectedData={data?.quotations}
                                        setSelectedData={(selAccess) => {
                                            handleAccessChange(
                                                selAccess,
                                                "quotations"
                                            );
                                        }}
                                        randomIndex={"quotations"}
                                    />
                                </div>{" "}
                                <div>
                                    <label htmlFor="">Visa</label>

                                    <MultipleSelectDropdown
                                        data={admins}
                                        displayName={"name"}
                                        valueName={"_id"}
                                        selectedData={data?.visas}
                                        setSelectedData={(selAccess) => {
                                            handleAccessChange(
                                                selAccess,
                                                "visas"
                                            );
                                        }}
                                        randomIndex={"visas"}
                                    />
                                </div>{" "}
                            </div>
                            <div className="mt-4 flex items-center justify-end gap-[12px]">
                                <button
                                    className="bg-slate-300 text-textColor px-[15px]"
                                    type="button"
                                    onClick={() => navigate(-1)}
                                >
                                    Cancel
                                </button>
                                <button className="w-[120px]">
                                    {isLoading ? <BtnLoader /> : "Update"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                {/* </table> */}
            </div>
        </div>
    );
}
