import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../axios";
import HotelStarCategoryMarkupModal from "./HotelStarCategoryMarkupModal";
// import BookingsOrdersSingleRow from "./BookingsOrdersSingleRow";

export default function HotelStarCategoryRow({ setCategories, category }) {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        markupType: category.markupType || "flat",
        markup: category.markup || 0,
        markupTypeApi: category.markupTypeApi || "flat",
        markupApi: category.markup || 0,
        isEdit: false,
    });
    const [isPageLoading, setIsPageLoading] = useState(false);
    const { jwtToken } = useSelector((state) => state.admin);

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
                    // onClick={() => {
                    //     setDropdownVisible(!dropdownVisible);
                    //     fetchHotels();
                    // }}
                >
                    {dropdownVisible === true ? (
                        <>{`${category.name}`} </>
                    ) : (
                        <>
                            {" "}
                            <span>{`${category.name}`} </span>{" "}
                        </>
                    )}
                </td>
                <td className="p-3 capitalize">
                    <span>{category?.markup}</span>
                </td>
                <td className="p-3 capitalize">
                    <span>{category?.markupType}</span>
                </td>
                <td className="p-3 capitalize">
                    <span>{category?.markupApi}</span>
                </td>
                <td className="p-3 capitalize">
                    <span>{category?.markupTypeApi}</span>
                </td>
                <td className="p-3 flex justify-end">
                    <button
                        className="w-[50px]"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Edit{" "}
                    </button>
                </td>
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
                                    <th className="font-[500] p-3">Hotels </th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {hotelList?.hotel?.map((hotel, index) => {
                                    return (
                                        <HotelListRow
                                            key={index}
                                            hotel={hotel}
                                            roomType={roomType}
                                            setRoomType={setRoomType}
                                        />
                                    );
                                })} */}
                                <div>sda</div>
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
