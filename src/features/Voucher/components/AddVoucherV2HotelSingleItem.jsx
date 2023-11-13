import React from "react";

import { SelectDropdown } from "../../../components";

export default function AddVoucherV2HotelSingleItem({
    item,
    hotelIndex,
    handleHotelDataChange,
    handleHotelIdChange,
    deleteAddedHotel,
    initialData,
}) {
    return (
        <React.Fragment>
            <div
                key={hotelIndex}
                className="p-4 rounded bg-[#f0f0f0] border-2 border-dashed mt-4 first:mt-0"
            >
                <h2 className="font-medium mb-2">Hotel {hotelIndex + 1}</h2>
                <div className="grid grid-cols-3 gap-[20px]">
                    <div className="col-span-2">
                        <label htmlFor="">Hotel Name</label>
                        <SelectDropdown
                            data={initialData.hotels || []}
                            displayName={"hotelName"}
                            valueName={"_id"}
                            placeholder={"Select Hotel"}
                            selectedData={item?.hotelId}
                            setSelectedData={(val) => {
                                handleHotelIdChange(val, hotelIndex);
                            }}
                            key={"addHotelInVoucher11" + hotelIndex}
                        />
                    </div>
                    <div>
                        <label htmlFor="">Confirmation Number</label>
                        <input
                            type="text"
                            name="confirmationNumber"
                            onChange={(e) => handleHotelDataChange(e, hotelIndex)}
                            value={item.confirmationNumber || ""}
                            placeholder="Enter Confirmation Number"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-[20px] mt-4">
                    <div>
                        <label htmlFor="">Check IN Date *</label>
                        <input
                            type="date"
                            name="checkInDate"
                            onChange={(e) => handleHotelDataChange(e, hotelIndex)}
                            value={item.checkInDate || ""}
                        />
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="">CheckIn Note</label>
                        <input
                            type="text"
                            name="checkInNote"
                            onChange={(e) => handleHotelDataChange(e, hotelIndex)}
                            value={item.checkInNote || ""}
                            placeholder="Enter CheckIn Note"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-[20px] mt-4">
                    <div>
                        <label htmlFor="">Check Out Date *</label>
                        <input
                            type="date"
                            name="checkOutDate"
                            onChange={(e) => handleHotelDataChange(e, hotelIndex)}
                            value={item.checkOutDate || ""}
                        />
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="">CheckOut Note</label>
                        <input
                            type="text"
                            name="checkOutNote"
                            onChange={(e) => handleHotelDataChange(e, hotelIndex)}
                            value={item.checkOutNote || ""}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-[20px] mt-4">
                    <div>
                        <label htmlFor="">Room Details</label>
                        <input
                            type="text"
                            name="roomDetails"
                            onChange={(e) => handleHotelDataChange(e, hotelIndex)}
                            value={item.roomDetails || ""}
                            placeholder="Ex: Deluxe Room"
                        />
                    </div>
                    <div>
                        <label htmlFor="">No Of Rooms</label>
                        <input
                            type="text"
                            name="noOfRooms"
                            onChange={(e) => handleHotelDataChange(e, hotelIndex)}
                            value={item.noOfRooms || ""}
                            placeholder="Enter No Of Rooms"
                        />
                    </div>
                </div>
            </div>
            <span
                className="text-red-500 underline cursor-pointer mr-3"
                onClick={() => deleteAddedHotel(hotelIndex)}
            >
                Delete
            </span>
        </React.Fragment>
    );
}
