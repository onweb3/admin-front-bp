import React from "react";

import AddVoucherV2HotelSingleItem from "./AddVoucherV2HotelSingleItem";

const HOTEL_DEFAULT_DATA = {
    hotelId: "",
    confirmationNumber: "",
    checkInDate: "",
    checkInNote:
        "Standard Check in Time is 1500 hrs (except at Atlantis the Palm). Early check in is subject to being booked in advance or as per hotel availability & in this case, may charge directly to the guest.",
    checkOutDate: "",
    checkOutNote:
        "(Standard Check Out Time:12.00) Late checkout subject to hotel availability & hotel may charge directly to the guest.",
    roomDetails: "",
    noOfRooms: "",
};

export default function AddVoucherV2HotelSection({ hotels, setHotels, initialData }) {
    const addNewHotel = () => {
        const tempHotels = hotels;
        tempHotels.push(HOTEL_DEFAULT_DATA);
        setHotels(JSON.parse(JSON.stringify(tempHotels)));
    };

    const deleteAddedHotel = (hotelIndex) => {
        const tempHotels = hotels;
        tempHotels?.splice(hotelIndex, 1);
        setHotels(JSON.parse(JSON.stringify(tempHotels)));
    };

    const handleHotelDataChange = (e, hotelIndex) => {
        const tempHotels = hotels;
        tempHotels[hotelIndex][e.target.name] = e.target.value;
        setHotels(JSON.parse(JSON.stringify(tempHotels)));
    };

    const handleHotelIdChange = (value, hotelIndex) => {
        const tempHotels = hotels;
        tempHotels[hotelIndex]["hotelId"] = value;
        setHotels(JSON.parse(JSON.stringify(tempHotels)));
    };

    return (
        <React.Fragment>
            <h2 className="font-medium mb-2">Hotel</h2>
            {hotels?.map((item, hotelIndex) => {
                return (
                    <AddVoucherV2HotelSingleItem
                        key={hotelIndex}
                        item={item}
                        hotelIndex={hotelIndex}
                        handleHotelDataChange={handleHotelDataChange}
                        handleHotelIdChange={handleHotelIdChange}
                        initialData={initialData}
                        deleteAddedHotel={deleteAddedHotel}
                    />
                );
            })}
            <span className="text-green-500 underline cursor-pointer" onClick={addNewHotel}>
                Add
            </span>
        </React.Fragment>
    );
}
