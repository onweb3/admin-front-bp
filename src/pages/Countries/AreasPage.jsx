import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import { Link, useParams } from "react-router-dom";

import axios from "../../axios";
import {
    addArea,
    deleteArea,
    updateArea,
} from "../../redux/slices/generalSlice";
import { PageLoader } from "../../components";
import { AreasModal } from "../../features/Areas";

export default function AreasPage() {
    const [areasModal, setAreasModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedArea, setSelectedArea] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({ areas: [], city: {} });

    const { jwtToken } = useSelector((state) => state.admin);
    const dispatch = useDispatch();
    const { countryId, stateId, cityId } = useParams();

    const delArea = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/areas/delete/${id}`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                dispatch(deleteArea(id));
                const filteredAreas = data.areas?.filter((item) => {
                    return item?._id !== id;
                });
                setData((prev) => {
                    return { ...prev, areas: filteredAreas };
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchAreas = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(`/areas/city/${cityId}`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setData((prev) => {
                return {
                    ...prev,
                    areas: response.data?.areas,
                    city: response?.data?.city,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const addNewArea = (newArea) => {
        dispatch(addArea(newArea));
        setData((prev) => {
            return { ...prev, areas: [newArea, ...prev.areas] };
        });
    };

    const updateAreaInfo = (area) => {
        dispatch(updateArea(area));
        const tempAreas = data.areas;
        const objIndex = tempAreas.findIndex((item) => {
            return item?._id === area._id;
        });
        if (objIndex !== -1) {
            tempAreas[objIndex] = area;
            setData((prev) => {
                return { ...prev, areas: tempAreas };
            });
        }
    };

    useEffect(() => {
        fetchAreas();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Areas</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/countries" className="text-textColor">
                        Countries{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {countryId?.slice(0, 3)}...{countryId?.slice(-3)}
                    </span>
                    <span>{">"} </span>
                    <Link
                        to={`/countries/${countryId}/states`}
                        className="text-textColor"
                    >
                        States{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {stateId?.slice(0, 3)}...{stateId?.slice(-3)}
                    </span>
                    <span>{">"} </span>
                    <Link
                        to={`/countries/${countryId}/states/${stateId}/cities`}
                        className="text-textColor"
                    >
                        Cities{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {cityId?.slice(0, 3)}...{cityId?.slice(-3)}
                    </span>
                    <span>{">"} </span>
                    <span>Areas</span>
                </div>
            </div>

            {areasModal?.isOpen && (
                <AreasModal
                    areasModal={areasModal}
                    setAreasModal={setAreasModal}
                    selectedArea={selectedArea}
                    addNewArea={addNewArea}
                    updateAreaInfo={updateAreaInfo}
                />
            )}

            {isLoading ? (
                <div>
                    <PageLoader />
                </div>
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium capitalize">
                                All Areas - ({data.city?.cityName} -{" "}
                                {data.city?.state?.stateName} -{" "}
                                {data.city?.country?.countryName})
                            </h1>
                            <button
                                className="px-3"
                                onClick={() =>
                                    setAreasModal({
                                        isOpen: true,
                                        isEdit: false,
                                    })
                                }
                            >
                                + Add Area
                            </button>
                        </div>
                        {!data.areas || data.areas?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Areas Found
                                </span>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">
                                            Area Code
                                        </th>
                                        <th className="font-[500] p-3">
                                            Area Name
                                        </th>
                                        <th className="font-[500] p-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {data.areas?.map((area, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="border-b border-tableBorderColor"
                                            >
                                                <td className="p-3">
                                                    {area?.areaCode}
                                                </td>
                                                <td className="p-3 capitalize">
                                                    {area?.areaName}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-[10px]">
                                                        <button
                                                            className="h-auto bg-transparent text-red-500 text-xl"
                                                            onClick={() =>
                                                                delArea(
                                                                    area?._id
                                                                )
                                                            }
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                        <button
                                                            className="h-auto bg-transparent text-green-500 text-xl"
                                                            onClick={() => {
                                                                setSelectedArea(
                                                                    area
                                                                );
                                                                setAreasModal({
                                                                    isOpen: true,
                                                                    isEdit: true,
                                                                });
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
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
