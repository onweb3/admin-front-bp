import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { ResellersTableRow } from "../../features/Resellers";
import ProfileTableRow from "../../features/MarkupProfile/components/ProfileTableRow";
import AddMarkupModal from "../../features/Resellers/components/AddMarkupModal";
import AddProfileMarkupModal from "../../features/MarkupProfile/components/AddProfileMarkupModal";

export default function ProfileListPage() {
    const [profiles, setProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        name: "",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const fetchProfiles = async ({ skip, limit, name }) => {
        try {
            console.log("fetching resellers");
            setIsLoading(true);

            const response = await axios.get(
                `/profile/get-all-profiles?skip=${skip}&limit=${limit}&name=${name}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            console.log(response.data);

            setProfiles(response.data);
            // setFilters((prev) => {
            //     return {
            //         ...prev,
            //         totalResellers: response.data?.totalResellers,
            //     };
            // });
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
        fetchProfiles({ skip, limit, name });
    }, [searchParams]);

    return (
        <>
            <div>
                <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                    <h1 className="font-[600] text-[15px] uppercase">
                        Profile
                    </h1>
                    <div className="text-sm text-grayColor">
                        <Link to="/" className="text-textColor">
                            Dashboard{" "}
                        </Link>
                        <span>{">"} </span>
                        <span>Markup Profile </span>
                    </div>
                </div>

                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Markup Profile</h1>
                            <div className="flex items-center gap-[15px]">
                                <form
                                    action=""
                                    // onSubmit={(e) => {
                                    //     e.preventDefault();
                                    //     fetchAttractions({ ...filters });
                                    //     let params = prevSearchParams();
                                    //     setSearchParams({
                                    //         ...params,
                                    //         search: filters.searchInput,
                                    //         skip: 0,
                                    //     });
                                    // }}
                                    className="flex items-center gap-[10px]"
                                >
                                    <input
                                        type="text"
                                        placeholder="Search here..."
                                        value={filters.searchInput || ""}
                                        onChange={(e) =>
                                            setFilters((prev) => {
                                                return {
                                                    ...prev,
                                                    searchInput: e.target.value,
                                                };
                                            })
                                        }
                                    />
                                    <button className="px-5">Search</button>
                                </form>
                                <div>
                                    <button
                                        className="w-[150px] bg-orange-500"
                                        onClick={(e) => setIsModalOpen(true)}
                                    >
                                        + Add Profile
                                    </button>
                                </div>
                                {/* <Link to={`add?${searchParams}`}> */}

                                {/* </Link> */}
                            </div>
                        </div>
                        {isLoading ? (
                            <PageLoader />
                        ) : profiles?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Markup Profile found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                            <tr>
                                                <th className="font-[500] p-3">
                                                    Index
                                                </th>
                                                <th className="font-[500] p-3">
                                                    Profile Name
                                                </th>
                                                <th className="font-[500] p-3">
                                                    Category
                                                </th>

                                                <th className="font-[500] p-3">
                                                    Update All
                                                </th>
                                                <th className="font-[500] p-3">
                                                    Update Selected
                                                </th>
                                                <th className="font-[500] p-3">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {profiles?.map((profile, index) => {
                                                return (
                                                    <ProfileTableRow
                                                        profile={profile}
                                                        index={index}
                                                        profiles={profiles}
                                                        setProfiles={
                                                            setProfiles
                                                        }
                                                    />
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <AddProfileMarkupModal setIsModalOpen={setIsModalOpen} />
            )}
        </>
    );
}
