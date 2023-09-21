import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../axios";
import HotelStarCategoryMarkupModal from "./HotelStarCategoryMarkupModal";
import RoomTypeListRow from "./RoomTypeListRow";
// import BookingsOrdersSingleRow from "./BookingsOrdersSingleRow";

export default function HotelRoomTypeTableRow({ hotel, type }) {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);
    const { profileId, marketId } = useParams();
    const { id } = useParams();

    const [roomTypes, setRoomTypes] = useState([]);
    const [isPageLoading, setIsPageLoading] = useState(false);

    const fetchRoomTypes = async () => {
        try {
            setIsPageLoading(true);

            if (type === "market") {
                if (marketId) {
                    const response = await axios.get(
                        `/market/get-all-roomTypes/${hotel._id}/${marketId}`,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );

                    setRoomTypes(response.data);
                } else {
                    const response = await axios.get(
                        `/market/b2b/get-all-roomTypes/${hotel._id}/${id}`,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );

                    setRoomTypes(response.data);
                }
            } else {
                if (profileId) {
                    const response = await axios.get(
                        `/profile/get-all-roomTypes/${hotel._id}/${profileId}`,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );

                    setRoomTypes(response.data);
                } else {
                    const response = await axios.get(
                        `/profile/b2b/get-all-roomTypes/${hotel._id}/${id}`,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );

                    setRoomTypes(response.data);
                }
            }

            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchRoomTypes();
    }, []);

    return (
        <>
            <tr
                className={
                    "border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9] shadow-sm w-full" +
                    (dropdownVisible ? "bg-[#f3f6f9]" : "")
                }
            >
                {" "}
                <td
                    className="p-3 font-[600] "
                    onClick={() => {
                        setDropdownVisible(!dropdownVisible);
                        fetchRoomTypes();
                    }}
                >
                    {dropdownVisible === true ? (
                        <>{`${hotel?.hotelName}`} </>
                    ) : (
                        <>
                            {" "}
                            <>{`${hotel?.hotelName}`} </>
                        </>
                    )}
                </td>
                {/* <td className="p-3 flex justify-end">
                    <button
                        className="w-[50px]"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Edit{" "}
                    </button>
                </td> */}
                {/* )} */}
            </tr>
            <tr>
                <td colSpan={7}>
                    <div className={`w-full`}>
                        <table
                            className={`w-full border shadow-lg
                     ${
                         dropdownVisible && isModalOpen === false
                             ? ""
                             : " hidden "
                     }
                    `}
                        >
                            <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left w-full">
                                <tr>
                                    <th className="font-[500] p-3">
                                        RoomTypes{" "}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <RoomTypeListRow
                                    // key={index}
                                    hotelId={hotel._id}
                                    roomTypes={roomTypes}
                                    setRoomTypes={setRoomTypes}
                                    type={type}
                                />
                            </tbody>
                        </table>
                    </div>
                </td>
            </tr>
            {isModalOpen ? (
                <HotelStarCategoryMarkupModal
                    setIsModalOpen={setIsModalOpen}
                    setCategories={setCategories}
                    category={category}
                />
            ) : (
                ""
            )}
        </>
    );
}
