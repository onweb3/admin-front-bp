import React, { useEffect, useState } from "react";
import { PageLoader, Pagination } from "../../components";
import { Link, useSearchParams } from "react-router-dom";
import { VisaTypeListSingleRow } from "../../features/Visa";
import axios from "../../axios";
import { useSelector } from "react-redux";

function VisaTypePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [visaList, setVisaList] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalVisaTypeList: 0,
        name: "",
    });
    const [searchParams, setSearchParams] = useSearchParams();

    const { jwtToken } = useSelector((state) => state.admin);

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
    const fetchVisaType = async ({ skip, limit, name }) => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/visa/visa-type/all?skip=${skip}&limit=${limit}&searchInput=${name}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            setVisaList(response.data.visaTypeList);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalVisaTypeList: response.data?.totalVisaTypeList,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
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
        let name = searchParams.get("name") || "";

        setFilters((prev) => {
            return { ...prev, skip, limit, name };
        });
        fetchVisaType({ skip, limit, name });
    }, [searchParams, isDeleted]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Visa</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Visa</span>
                </div>
            </div>

            {isLoading ? (
                <div>
                    <PageLoader />
                </div>
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">Visa Type</h1>
                            <div className="flex items-center gap-[15px]">
                                <form
                                    action=""
                                    className="flex items-center gap-[10px]"
                                >
                                    <input
                                        type="text"
                                        name="name"
                                        value={filters.name || ""}
                                        onChange={handleChange}
                                        placeholder="Search here..."
                                    />

                                    <button className="px-5">Search</button>
                                </form>
                                <Link to={`/visa/add`}>
                                    <button className="w-[120px] bg-orange-500">
                                        + Add Visa
                                    </button>
                                </Link>
                            </div>
                        </div>
                        {visaList?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No visa found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">
                                                SI No
                                            </th>
                                            <th className="font-[500] p-3">
                                                Title
                                            </th>
                                            <th className="font-[500] p-3">
                                                Destination
                                            </th>
                                            {/* <th className="font-[500] p-3">Net Price</th>
                      <th className="font-[500] p-3">Purchase Cost</th>
                      <th className="font-[500] p-3">B2C Mark UP</th> */}
                                            <th className="font-[500] p-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {visaList?.map((visaList, index) => {
                                            return (
                                                <VisaTypeListSingleRow
                                                    visaList={visaList}
                                                    key={visaList._id}
                                                    index={index}
                                                    setIsDeleted={setIsDeleted}
                                                    isDeleted={isDeleted}
                                                />
                                            );
                                        })}
                                    </tbody>
                                </table>

                                <div className="p-4">
                                    <Pagination
                                        limit={filters?.limit}
                                        skip={filters?.skip}
                                        total={filters?.totalVisaTypeList}
                                        incOrDecSkip={(number) =>
                                            setSearchParams((prev) => {
                                                return {
                                                    ...prev,
                                                    skip:
                                                        filters.skip +
                                                        number +
                                                        1,
                                                };
                                            })
                                        }
                                        updateSkip={(skip) =>
                                            setSearchParams((prev) => {
                                                return {
                                                    ...prev,
                                                    skip: skip + 1,
                                                };
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default VisaTypePage;
