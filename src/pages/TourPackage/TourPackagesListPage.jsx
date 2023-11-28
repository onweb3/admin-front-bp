import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../axios";
import { useSelector } from "react-redux";
import { PageLoader, Pagination } from "../../components";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";

export default function TourPackagesListPage() {
    const [tourPackages, setTourPackages] = useState([]);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalTourPackages: 0,
    });

    const { jwtToken } = useSelector((state) => state.admin);

    const deleteTourPackage = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete this package?");
            if (isConfirm) {
                await axios.delete(`/tour-packages/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredTourPackages = tourPackages.filter((tPackage) => {
                    return tPackage?._id !== id;
                });
                setTourPackages(JSON.parse(JSON.stringify(filteredTourPackages)));
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchTourPackages = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(
                `/tour-packages/all?skip=${filters.skip}&limit=${filters.limit}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setTourPackages(response.data?.tourPackages);
            setFilters((prev) => {
                return { ...prev, totalTourPackages: response?.data?.totalTourPackages };
            });
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchTourPackages();
    }, [filters.skip]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Tour Package</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Tour Packages </span>
                </div>
            </div>

            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Tour Packages</h1>
                            <Link to="add">
                                <button className="px-3">+ Add Tour Package</button>
                            </Link>
                        </div>
                        {tourPackages?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Tour Packages Found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">Package Name</th>
                                            <th className="font-[500] p-3">No Of Days</th>
                                            <th className="font-[500] p-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {tourPackages?.map((tPackage, tPackageIndex) => {
                                            return (
                                                <tr
                                                    key={tPackageIndex}
                                                    className="border-b border-tableBorderColor"
                                                >
                                                    {/* <td className="p-3">
                                                        <div className="flex items-center gap-[10px]">
                                                            <img
                                                                src={
                                                                    config.SERVER_URL +
                                                                    blog?.thumbnail
                                                                }
                                                                alt=""
                                                                className="w-[40px] rounded max-h-[40px]"
                                                            />
                                                            <span>{blog?.title}</span>
                                                        </div>
                                                    </td> */}
                                                    <td className="p-3">{tPackage?.packageName}</td>
                                                    <td className="p-3 capitalize">
                                                        {tPackage?.noOfDays}
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex gap-[10px]">
                                                            <button
                                                                className="h-auto bg-transparent text-red-500 text-xl"
                                                                onClick={() =>
                                                                    deleteTourPackage(tPackage?._id)
                                                                }
                                                            >
                                                                <MdDelete />
                                                            </button>
                                                            {/* <Link to={`${blog?._id}/edit`}> */}
                                                            <button className="h-auto bg-transparent text-green-500 text-xl">
                                                                <BiEditAlt />
                                                            </button>
                                                            {/* </Link> */}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                <div className="p-4">
                                    <Pagination
                                        limit={filters?.limit}
                                        skip={filters?.skip}
                                        total={filters?.totalTourPackages}
                                        incOrDecSkip={(number) =>
                                            setFilters((prev) => {
                                                return {
                                                    ...prev,
                                                    skip: prev.skip + number,
                                                };
                                            })
                                        }
                                        updateSkip={(skip) =>
                                            setFilters((prev) => {
                                                return { ...prev, skip };
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
