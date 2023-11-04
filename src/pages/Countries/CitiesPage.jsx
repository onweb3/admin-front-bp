import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import { Link, useParams } from "react-router-dom";
import { AiFillEye } from "react-icons/ai";

import axios from "../../axios";
import { addCity, deleteCity, updateCity } from "../../redux/slices/generalSlice";
import { PageLoader } from "../../components";
import { CitiesModal } from "../../features/Areas";

export default function CitiesPage() {
    const [citiesModal, setCitiesModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedCity, setSelectedCity] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({ cities: [], state: {} });
    const [filteredCities, setFilteredCities] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const { jwtToken } = useSelector((state) => state.admin);
    const dispatch = useDispatch();
    const { countryId, stateId } = useParams();

    const delCity = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/cities/delete/${id}`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                dispatch(deleteCity(id));
                const filteredCities = data.cities?.filter((item) => {
                    return item?._id !== id;
                });
                setData((prev) => {
                    return { ...prev, cities: filteredCities };
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchCities = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(`/cities/state/${stateId}`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setData((prev) => {
                return {
                    ...prev,
                    cities: response.data?.cities,
                    state: response?.data?.state,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const addNewCity = (newCity) => {
        dispatch(addCity(newCity));
        setData((prev) => {
            return { ...prev, cities: [newCity, ...prev.cities] };
        });
    };

    const updateCityInfo = (city) => {
        dispatch(updateCity(city));
        const tempCities = data.cities;
        const objIndex = tempCities.findIndex((item) => {
            return item?._id === city._id;
        });
        if (objIndex !== -1) {
            tempCities[objIndex] = city;
            setData((prev) => {
                return { ...prev, cities: JSON.parse(JSON.stringify(tempCities)) };
            });
        }
    };

    useEffect(() => {
        const tempFilteredCities = data.cities?.filter((item) => {
            return (
                item?.cityName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                item?.cityCode?.toLowerCase()?.includes(searchQuery?.toLowerCase())
            );
        });
        setFilteredCities(tempFilteredCities);
    }, [data.cities, searchQuery]);

    useEffect(() => {
        fetchCities();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Cities</h1>
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
                    <Link to={`/countries/${countryId}/states`} className="text-textColor">
                        States{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {stateId?.slice(0, 3)}...{stateId?.slice(-3)}
                    </span>
                    <span>{">"} </span>
                    <span>Cities</span>
                </div>
            </div>

            {citiesModal?.isOpen && (
                <CitiesModal
                    citiesModal={citiesModal}
                    setCitiesModal={setCitiesModal}
                    selectedCity={selectedCity}
                    addNewCity={addNewCity}
                    updateCityInfo={updateCityInfo}
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
                                All Cities - ({data.state?.stateName} -{" "}
                                {data.state?.country?.countryName})
                            </h1>
                            <div className="flex items-center gap-[10px]">
                                <input
                                    type="text"
                                    placeholder="Search here..."
                                    className="min-w-[200px]"
                                    name="searchQuery"
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    value={searchQuery || ""}
                                />
                                <button
                                    className="w-[150px]"
                                    onClick={() =>
                                        setCitiesModal({
                                            isOpen: true,
                                            isEdit: false,
                                        })
                                    }
                                >
                                    + Add City
                                </button>
                            </div>
                        </div>
                        {!filteredCities || filteredCities?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Cities Found
                                </span>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">City Code</th>
                                        <th className="font-[500] p-3">City Name</th>
                                        <th className="font-[500] p-3">Areas</th>
                                        <th className="font-[500] p-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {filteredCities?.map((city, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="border-b border-tableBorderColor"
                                            >
                                                <td className="p-3">{city?.cityCode}</td>
                                                <td className="p-3 capitalize">{city?.cityName}</td>
                                                <td className="p-3">
                                                    <Link to={`${city?._id}/areas`}>
                                                        <button className="h-auto bg-transparent text-[#333] text-xl">
                                                            <AiFillEye />
                                                        </button>
                                                    </Link>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-[10px]">
                                                        <button
                                                            className="h-auto bg-transparent text-red-500 text-xl"
                                                            onClick={() => delCity(city?._id)}
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                        <button
                                                            className="h-auto bg-transparent text-green-500 text-xl"
                                                            onClick={() => {
                                                                setSelectedCity(city);
                                                                setCitiesModal({
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
