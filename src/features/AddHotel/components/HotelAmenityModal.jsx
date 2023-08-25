import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { FiChevronDown } from "react-icons/fi";

import { useHandleClickOutside } from "../../../hooks";
import { addNewSelectedHotelAmenity } from "../../../redux/slices/hotelFormSlice";
import { SelectDropdown } from "../../../components";

export default function HotelAmenityModal({ setIsAmenityModalOpen }) {
    const [data, setData] = useState({
        isPaid: false,
        isFeatured: false,
    });
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedAmenity, setSelectedAmenity] = useState({});

    const { amenities } = useSelector((state) => state.hotelForm);
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setIsAmenityModalOpen(false));
    const dispatch = useDispatch();

    const filteredData = amenities?.filter((item) =>
        searchQuery ? item?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) : true
    );

    const handleChkChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.checked };
        });
    };

    const handleSubmit = () => {
        setError("");
        if (!selectedAmenity.name) {
            return setError("Please select hotel amenity");
        }
        dispatch(
            addNewSelectedHotelAmenity({
                amenity: selectedAmenity?._id,
                amenityGroup: selectedAmenity?.parentAmenity,
                name: selectedAmenity?.name,
                ...data,
            })
        );
        setIsAmenityModalOpen(false);
    };

    console.log(selectedAmenity);

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[80vh] rounded max-w-[500px] shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)]"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium">Add Amenity</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsAmenityModalOpen(false)}
                    >
                        <MdClose />
                    </button>
                </div>

                <div className="p-4">
                    <div>
                        <label htmlFor="">Amenity *</label>
                        {/* <div className="relative">
                            <div
                                className="border border-[#ced4da] rounded text-[14px] w-[100%] h-[40px] flex items-center justify-between px-2 cursor-pointer"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <span>{selectedAmenity.name || "Select Amenity"}</span>
                                <FiChevronDown />
                            </div>
                            {isDropdownOpen && (
                                <div className="absolute top-[100%] left-0 w-[100%] overflow-y-auto max-h-[300px] bg-white shadow-lg">
                                    <div className="sticky top-0">
                                        <input
                                            type="text"
                                            placeholder="Search here..."
                                            className="border-0 border-b rounded-none"
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    {filteredData?.length < 1 ? (
                                        <span className="text-center block my-2 text-sm">
                                            No Amenities Found..!
                                        </span>
                                    ) : (
                                        filteredData?.map((item, index) => {
                                            return (
                                                <span
                                                    key={index}
                                                    className="block hover:bg-[#f3f6f9] cursor-pointer px-5 py-2 capitalize text-[15px]"
                                                    onClick={() => {
                                                        setSelectedAmenity(item);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                >
                                                    {item?.name}
                                                </span>
                                            );
                                        })
                                    )}
                                </div>
                            )}
                        </div> */}
                        <div>
                            <SelectDropdown
                                data={filteredData}
                                valueName={"_id"}
                                displayName={"name"}
                                placeholder={"Select Amenity"}
                                selectedData={selectedAmenity._id}
                                setSelectedData={(val) => {
                                    setSelectedAmenity(amenities?.find((item) => item._id === val));
                                }}
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-[10px]">
                        <input
                            type="checkbox"
                            name="isPaid"
                            id="isPaid"
                            className="w-[16px] h-[16px]"
                            onChange={handleChkChange}
                        />
                        <label htmlFor="isPaid" className="mb-0">
                            Is Paid Amenity?
                        </label>
                    </div>
                    <div className="mt-4 flex items-center gap-[10px]">
                        <input
                            type="checkbox"
                            name="isFeatured"
                            id="isFeatured"
                            className="w-[16px] h-[16px]"
                            checked={data.isFeatured}
                            onChange={handleChkChange}
                        />
                        <label htmlFor="isFeatured" className="mb-0">
                            Is Featured Amenity?
                        </label>
                    </div>
                    {error && <span className="block mt-4 text-sm text-red-500">{error}</span>}
                    <div className="flex items-center justify-end mt-5">
                        <button className="w-[160px]" onClick={handleSubmit}>
                            Add Amenity
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
