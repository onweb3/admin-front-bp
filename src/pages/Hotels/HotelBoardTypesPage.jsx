import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import AddBoardTypeModal from "../../features/Hotels/components/AddBoardTypeModal";
import EditBoardTypeModal from "../../features/Hotels/components/EditBoardTypeModal";
import { hasPermission } from "../../utils";

export default function HotelBoardTypesPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isAddBoardTypeModal, setIsAddBoardTypeModal] = useState(false);
    const [isEditBoardTypeModal, setIsEditBoardTypeModal] = useState(false);
    const [selectedBoardType, setSelectedBoardType] = useState({});
    const [boardTypes, setBoardTypes] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalBoardTypes: 0,
        searchQuery: "",
    });

    const { jwtToken, admin } = useSelector((state) => state.admin);

    const isCreatePermission = hasPermission({
        roles: admin?.roles,
        name: "hotel-boards",
        permission: "create",
    });
    const isEditPermission = hasPermission({
        roles: admin?.roles,
        name: "hotel-boards",
        permission: "update",
    });
    const isDeletePermission = hasPermission({
        roles: admin?.roles,
        name: "hotel-boards",
        permission: "delete",
    });

    const fetchBoardTypes = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/hotels/board-types/all?skip=${filters.skip}&limit=${filters.limit}&searchQuery=${filters.searchQuery}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setBoardTypes(response.data?.boardTypes);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalBoardTypes: response?.data?.totalBoardTypes,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteBoardType = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/hotels/board-types/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });
                const filteredBoardTypes = boardTypes?.filter((item) => {
                    return item?._id !== id;
                });
                setBoardTypes(filteredBoardTypes);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchBoardTypes();
    }, [filters.skip, filters.limit]);

    return (
        <>
            <div>
                <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                    <h1 className="font-[600] text-[15px] uppercase">Boards</h1>
                    <div className="text-sm text-grayColor">
                        <Link to="/" className="text-textColor">
                            Dashboard{" "}
                        </Link>
                        <span>{">"} </span>
                        <Link to="/hotels" className="text-textColor">
                            Hotels{" "}
                        </Link>
                        <span>{">"} </span>
                        <span>Boards</span>
                    </div>
                </div>

                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div>
                            <div className="flex items-center justify-between border-b border-dashed p-4">
                                <h1 className="font-medium">Board</h1>
                                <div className="flex items-center gap-3">
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            if (filters?.skip !== 0) {
                                                setFilters((prev) => {
                                                    return {
                                                        ...prev,
                                                        skip: 0,
                                                    };
                                                });
                                            } else {
                                                fetchBoardTypes();
                                            }
                                        }}
                                        className="flex items-center gap-3"
                                    >
                                        <input
                                            type="text"
                                            placeholder="Search here..."
                                            onChange={(e) => {
                                                setFilters((prev) => {
                                                    return {
                                                        ...prev,
                                                        searchQuery: e.target.value,
                                                    };
                                                });
                                            }}
                                            value={filters.searchQuery || ""}
                                        />
                                        <button type="submit" className="px-3 bg-primaryColor">
                                            Search
                                        </button>
                                    </form>
                                    {isCreatePermission && (
                                        <button className="px-3" onClick={() => setIsAddBoardTypeModal(true)}>
                                            + Add Board
                                        </button>
                                    )}
                                </div>
                            </div>
                            {isLoading ? (
                                <PageLoader />
                            ) : boardTypes?.length < 1 ? (
                                <div className="p-6 flex flex-col items-center">
                                    <span className="text-sm text-grayColor block mt-[6px]">
                                        Oops.. No Board Types Found
                                    </span>
                                </div>
                            ) : (
                                <div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                                <tr>
                                                    <th className="font-[500] p-3">Board Name</th>
                                                    <th className="font-[500] p-3">Board Short Name</th>
                                                    {(isEditPermission || isDeletePermission) && (
                                                        <th className="font-[500] p-3">Action</th>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                {boardTypes?.map((boardType, index) => {
                                                    return (
                                                        <tr
                                                            className="border-b border-tableBorderColor"
                                                            key={index}
                                                        >
                                                            <td className="p-3 capitalize">
                                                                {boardType?.boardName}
                                                            </td>
                                                            <td className="p-3 capitalize">
                                                                {boardType?.boardShortName}
                                                            </td>
                                                            {(isEditPermission || isDeletePermission) && (
                                                                <td className="p-3">
                                                                    <div className="flex gap-[10px]">
                                                                        {isDeletePermission && (
                                                                            <button
                                                                                className="h-auto bg-transparent text-red-500 text-xl"
                                                                                onClick={() =>
                                                                                    deleteBoardType(
                                                                                        boardType?._id
                                                                                    )
                                                                                }
                                                                            >
                                                                                <MdDelete />
                                                                            </button>
                                                                        )}

                                                                        {isEditPermission && (
                                                                            <button
                                                                                className="h-auto bg-transparent text-green-500 text-xl"
                                                                                onClick={() => {
                                                                                    setIsEditBoardTypeModal(
                                                                                        true
                                                                                    );
                                                                                    setSelectedBoardType(
                                                                                        boardType
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <BiEditAlt />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="p-4">
                                        <Pagination
                                            limit={filters?.limit}
                                            skip={filters?.skip}
                                            total={filters?.totalBoardTypes}
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
                </div>
            </div>
            <div>
                {isAddBoardTypeModal && (
                    <AddBoardTypeModal
                        setIsAddBoardTypeModal={setIsAddBoardTypeModal}
                        setBoardTypes={setBoardTypes}
                    />
                )}
                {isEditBoardTypeModal && (
                    <EditBoardTypeModal
                        selectedBoardType={selectedBoardType}
                        setIsAddBoardTypeModal={setIsEditBoardTypeModal}
                        boardTypes={boardTypes}
                        setBoardTypes={setBoardTypes}
                    />
                )}
            </div>
        </>
    );
}
