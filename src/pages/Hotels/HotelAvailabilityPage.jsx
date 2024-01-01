import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { BtnLoader, MultipleSelectDropdown, PageLoader, SelectDropdown } from "../../components";
import { HotelAvailabilityModal, HotelAvailabilityTable } from "../../features/HotelAvailability";
import axios from "../../axios";
import { hasPermission } from "../../utils";

function HotelAvailabilityPage() {
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [hotels, setHotels] = useState([]);
    const [filters, setFilters] = useState({
        fromDate: "",
        toDate: "",
    });
    const [selectedHotel, setSelectedHotel] = useState({});
    const [selectedContractGroups, setSelectedContractGroups] = useState([]);
    const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);

    const { jwtToken, admin } = useSelector((state) => state.admin);

    const isEditPermission = hasPermission({
        roles: admin?.roles,
        name: "hotel-availability",
        permission: "update",
    });

    const handleChange = (e) => {
        setFilters((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const fetchAvailability = async () => {
        try {
            setIsLoading(true);

            const response = await axios.post(
                "/hotels/allocations/availability",
                {
                    ...filters,
                    hotelId: selectedHotel?._id,
                    contractGroups: selectedContractGroups,
                },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            setData(response?.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchHotels = async () => {
        try {
            const response = await axios.get("/hotels/all/room-and-contract-group", {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setHotels(response?.data);
            console.log(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchHotels();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Inventory Control</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/hotels" className="text-textColor">
                        Hotels
                    </Link>
                    <span>{">"} </span>
                    <span>Availability</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">Inventory Control</h1>
                    </div>

                    <div className="p-4 grid grid-cols-12 gap-3">
                        <div className="col-span-3">
                            <label htmlFor="" className="font-[600]">
                                Hotel Name
                            </label>
                            <div className="relative">
                                <SelectDropdown
                                    data={hotels}
                                    valueName={"_id"}
                                    displayName={"hotelName"}
                                    placeholder={"Select Hotel"}
                                    selectedData={selectedHotel?._id}
                                    setSelectedData={(val) => {
                                        setSelectedHotel(hotels?.find((item) => item._id === val));
                                        setSelectedContractGroups([]);
                                    }}
                                />
                            </div>
                        </div>
                        {selectedHotel?.hotelName && (
                            <div className="col-span-2">
                                <label htmlFor="">Contract Groups</label>
                                <MultipleSelectDropdown
                                    data={selectedHotel?.contractGroups || []}
                                    displayName={"contractName"}
                                    valueName={"_id"}
                                    selectedData={selectedContractGroups}
                                    setSelectedData={setSelectedContractGroups}
                                    randomIndex={"contracts01"}
                                />
                            </div>
                        )}
                        <div className="col-span-2">
                            <label htmlFor="" className="font-[600]">
                                From Date
                            </label>
                            <input
                                type="date"
                                value={filters.fromDate}
                                name="fromDate"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-span-2">
                            <label htmlFor="" className="font-[600]">
                                To Date
                            </label>
                            <input type="date" value={filters.toDate} name="toDate" onChange={handleChange} />
                        </div>
                        <div className="col-span-1 flex items-end">
                            <button
                                className="px-3 w-full"
                                disabled={
                                    !selectedHotel?._id ||
                                    !filters.fromDate ||
                                    !filters.toDate ||
                                    isLoading ||
                                    selectedContractGroups?.length < 1
                                }
                                onClick={fetchAvailability}
                            >
                                {isLoading ? <BtnLoader /> : "View"}
                            </button>
                        </div>
                        {isEditPermission &&
                            filters.fromDate &&
                            filters.toDate &&
                            selectedHotel?.hotelName &&
                            selectedContractGroups?.length > 0 && (
                                <div className="col-span-1 flex items-end ">
                                    <button
                                        className="px-3 bg-orange-500"
                                        onClick={() => setAvailabilityModalOpen(true)}
                                    >
                                        Change
                                    </button>
                                    {availabilityModalOpen && (
                                        <HotelAvailabilityModal
                                            selectedHotel={selectedHotel}
                                            setAvailabilityModalOpen={setAvailabilityModalOpen}
                                            fromDate={filters.fromDate}
                                            toDate={filters.toDate}
                                            selectedContractGroups={selectedContractGroups}
                                        />
                                    )}
                                </div>
                            )}
                    </div>

                    {isLoading ? (
                        <PageLoader />
                    ) : !data.hotel?.hotelName ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Contracts will be displayed here!!!
                            </span>
                        </div>
                    ) : (
                        <div>
                            <HotelAvailabilityTable data={data} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HotelAvailabilityPage;
