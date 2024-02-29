import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  handleHotelDetailsChange,
  removeHotelOpenDay,
  selectHotelOpenDay,
  initialHotelDetailsDraft,
} from "../../../redux/slices/hotelFormSlice";
import { MultipleSelectDropdown, SelectDropdown } from "../../../components";

const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export default function HotelDetailsForm({
  selectedSection,
  isEditPermission = true,
}) {
  const [isHbIdCopied, setIsHbIdCopied] = useState(false);

  const { details, accommodationTypes, boards, hotelChains } = useSelector(
    (state) => state.hotelForm
  );
  const { states, cities, countries, areas } = useSelector(
    (state) => state.general
  );
  const dispatch = useDispatch();

  const availableStates = states?.filter((item) => {
    return item?.country === details.country;
  });
  const availableCities = cities?.filter((item) => {
    return item?.country === details.country;
  });
  const availableAreas = areas?.filter((item) => {
    return item?.country === details.country;
  });

  const handleChange = (e) => {
    dispatch(
      handleHotelDetailsChange({
        name: e.target?.name,
        value: e.target?.value,
      })
    );
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsHbIdCopied(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isHbIdCopied]);

  let hotelDetails = localStorage.getItem("hotelDetails");
  let hotelDetailsObject = JSON.parse(hotelDetails);

  let hotelDescription = localStorage.getItem("hotelDescription");
  let hotelDescriptionObject = JSON.parse(hotelDescription);

  let hotelFaq = localStorage.getItem("hotelFaq");
  let hotelFaqObject = JSON.parse(hotelFaq);

  let hotelAmenety = localStorage.getItem("hotelAmeneties");
  let hotelAmenetyObject = JSON.parse(hotelAmenety);

  let hotelRestaurant = localStorage.getItem("hotelRestaurant");
  let hotelRestaurantObject = JSON.parse(hotelRestaurant);

  let hotelBars = localStorage.getItem("hotelBars");
  let hotelBarsObject = JSON.parse(hotelBars);

  let salesContact = localStorage.getItem("salesContacts");
  let salesObject = JSON.parse(salesContact);

  let accountContacts = localStorage.getItem("accountContacts");
  let accountContactObject = JSON.parse(accountContacts);

  let hotelContacts = localStorage.getItem("hotelContacts");
  let hotelContactObject = JSON.parse(hotelContacts);

  let reservationContacts = localStorage.getItem("reservationContacts");
  let reservationContactsObject = JSON.parse(reservationContacts);

  useEffect(() => {
    dispatch(
      initialHotelDetailsDraft({
        hotelDetailsObject: hotelDetailsObject,
        hoteDescription: hotelDescriptionObject,
        hotelFaqObject: hotelFaqObject || [],
        hotelAmenetyObject: hotelAmenetyObject || [],
        hotelRestaurantObject: hotelRestaurantObject || [],
        hotelBarsObject: hotelBarsObject || [],
        salesObject: salesObject || [],
        accountContactObject: accountContactObject || [],
        hotelContactObject: hotelContactObject || [],
        reservationContactsObject: reservationContactsObject || [],
      })
    );
  }, []);

  return (
    <div className={selectedSection === "-details" ? "block" : "hidden"}>
      <div className="grid grid-cols-4 gap-[20px]">
        <div>
          <label htmlFor="">Hotel Name *</label>
          <input
            type="text"
            name="hotelName"
            value={details?.hotelName || ""}
            onChange={handleChange}
            placeholder="Ex: Abc Hotel"
            disabled={!isEditPermission}
          />
        </div>
        <div>
          <label htmlFor="">Chain *</label>
          <SelectDropdown
            data={hotelChains}
            valueName={"_id"}
            displayName={"chainName"}
            placeholder="Select Chain"
            selectedData={details.hotelChain || ""}
            setSelectedData={(val) => {
              dispatch(
                handleHotelDetailsChange({
                  name: "hotelChain",
                  value: val,
                })
              );
            }}
            bracketValue={"chainCode"}
            disabled={!isEditPermission}
          />
        </div>
        <div>
          <label htmlFor="">Accommodation Type *</label>
          <SelectDropdown
            data={accommodationTypes}
            valueName={"_id"}
            displayName={"accommodationTypeName"}
            placeholder="Select Accommodation Type"
            selectedData={details.accommodationType || ""}
            setSelectedData={(val) => {
              dispatch(
                handleHotelDetailsChange({
                  name: "accommodationType",
                  value: val,
                })
              );
            }}
            disabled={!isEditPermission}
          />
        </div>
        <div>
          <label htmlFor="">County *</label>
          <SelectDropdown
            data={countries}
            valueName={"_id"}
            displayName={"countryName"}
            placeholder="Select Country"
            selectedData={details.country || ""}
            setSelectedData={(val) => {
              dispatch(
                handleHotelDetailsChange({
                  name: "country",
                  value: val,
                })
              );
            }}
            disabled={!isEditPermission}
          />
        </div>
        <div>
          <label htmlFor="">Emirate *</label>
          <SelectDropdown
            data={availableStates}
            valueName={"_id"}
            displayName={"stateName"}
            placeholder="Select Emirate"
            selectedData={details.state || ""}
            setSelectedData={(val) => {
              dispatch(
                handleHotelDetailsChange({
                  name: "state",
                  value: val,
                })
              );
            }}
            disabled={!isEditPermission}
          />
        </div>
        <div>
          <label htmlFor="">City *</label>
          <SelectDropdown
            data={availableCities}
            valueName={"_id"}
            displayName={"cityName"}
            placeholder="Select City"
            selectedData={details.city || ""}
            setSelectedData={(val) => {
              dispatch(
                handleHotelDetailsChange({
                  name: "city",
                  value: val,
                })
              );
            }}
            disabled={!isEditPermission}
          />
        </div>
        <div>
          <label htmlFor="">Area *</label>
          <SelectDropdown
            data={availableAreas}
            valueName={"_id"}
            displayName={"areaName"}
            placeholder="Select Area"
            selectedData={details.area || ""}
            setSelectedData={(val) => {
              dispatch(
                handleHotelDetailsChange({
                  name: "area",
                  value: val,
                })
              );
            }}
            disabled={!isEditPermission}
          />
        </div>
        <div>
          <label htmlFor="">Address *</label>
          <input
            type="text"
            name="address"
            value={details?.address || ""}
            onChange={handleChange}
            placeholder="Enter Address"
            disabled={!isEditPermission}
          />
        </div>
        <div>
          <label htmlFor="">Landmark</label>
          <input
            type="text"
            name="landMark"
            value={details?.landMark || ""}
            onChange={handleChange}
            placeholder="Ex: Near Burj Khalifa"
            disabled={!isEditPermission}
          />
        </div>
        <div>
          <label htmlFor="">Street</label>
          <input
            type="text"
            name="street"
            value={details?.street || ""}
            onChange={handleChange}
            placeholder="Enter Street"
            disabled={!isEditPermission}
          />
        </div>
        <div>
          <label htmlFor="">Postal Code</label>
          <input
            type="number"
            name="postalCode"
            value={details?.postalCode || ""}
            onChange={handleChange}
            placeholder="Enter Postal Code"
            disabled={!isEditPermission}
          />
        </div>
        <div>
          <label htmlFor="">Website</label>
          <input
            type="text"
            name="website"
            value={details?.website || ""}
            onChange={handleChange}
            placeholder="Ex: https://hotel-name.com"
            disabled={!isEditPermission}
          />
        </div>
        <div>
          <label htmlFor="">Star Category *</label>
          <select
            id=""
            name="starCategory"
            value={details?.starCategory || ""}
            onChange={handleChange}
            disabled={!isEditPermission}
          >
            <option value="" hidden>
              Select Star Category
            </option>
            <option value="2">2 Star</option>
            <option value="3">3 Star</option>
            <option value="4">4 Star</option>
            <option value="5">5 Star</option>
            <option value="apartment">Apartment</option>
            <option value="hostel">Hostel</option>
            <option value="unrated">Unrated</option>
          </select>
        </div>
        <div>
          <label htmlFor="">Latitude *</label>
          <input
            type="text"
            name="latitude"
            value={details?.latitude || ""}
            onChange={handleChange}
            placeholder="Ex: 25.276987"
            disabled={!isEditPermission}
          />
        </div>
        <div>
          <label htmlFor="">Longitude *</label>
          <input
            type="text"
            name="longitude"
            value={details?.longitude || ""}
            onChange={handleChange}
            placeholder="Ex: 55.296249"
            disabled={!isEditPermission}
          />
        </div>
        <div>
          <label htmlFor="">Check In Time *</label>
          <input
            type="time"
            placeholder=""
            name="checkInTime"
            value={details?.checkInTime || ""}
            onChange={handleChange}
            disabled={!isEditPermission}
          />
        </div>
        <div>
          <label htmlFor="">Check Out Time *</label>
          <input
            type="time"
            placeholder=""
            name="checkOutTime"
            value={details?.checkOutTime || ""}
            onChange={handleChange}
            disabled={!isEditPermission}
          />
        </div>
        <div>
          <label htmlFor="">Rooms Count</label>
          <input
            type="number"
            placeholder="0"
            name="roomsCount"
            value={!isNaN(details?.roomsCount) ? details?.roomsCount : ""}
            onChange={handleChange}
            disabled={!isEditPermission}
          />
        </div>
        <div>
          <label htmlFor="">Floors Count</label>
          <input
            type="number"
            name="floorsCount"
            value={!isNaN(details?.floorsCount) ? details?.floorsCount : ""}
            onChange={handleChange}
            placeholder="0"
            disabled={!isEditPermission}
          />
        </div>
        <div>
          <label htmlFor="">Car Parking Slots</label>
          <input
            type="number"
            placeholder="0"
            name="carParkingSlots"
            value={
              !isNaN(details?.carParkingSlots) ? details?.carParkingSlots : ""
            }
            onChange={handleChange}
            disabled={!isEditPermission}
          />
        </div>
        <div>
          <label htmlFor="">Distance From City (km)</label>
          <input
            type="number"
            placeholder="0"
            name="distanceFromCity"
            value={
              !isNaN(details?.distanceFromCity) ? details?.distanceFromCity : ""
            }
            onChange={handleChange}
            disabled={!isEditPermission}
          />
        </div>
        <div>
          <label htmlFor="">Board Types</label>
          <div className="">
            <MultipleSelectDropdown
              data={boards}
              displayName={"boardName"}
              selectedData={details.boardTypes || []}
              setSelectedData={(selBoards) =>
                dispatch(
                  handleHotelDetailsChange({
                    name: "boardTypes",
                    value: selBoards,
                  })
                )
              }
              valueName={"_id"}
              randomIndex={"boardTypes"}
              disabled={!isEditPermission}
            />
          </div>
        </div>
        <div>
          <label htmlFor="">Open Days *</label>
          <div className="flex items-center gap-[2px]">
            {days?.map((day, index) => {
              return (
                <span
                  key={index}
                  className={
                    "w-[25px] h-[25px] text-white cursor-pointer capitalize rounded flex items-center justify-center " +
                    (details?.openDays?.includes(day)
                      ? "bg-orange-500"
                      : "bg-gray-500")
                  }
                  onClick={() => {
                    if (details?.openDays?.includes(day)) {
                      dispatch(removeHotelOpenDay(day));
                    } else {
                      dispatch(selectHotelOpenDay(day));
                    }
                  }}
                >
                  {day?.slice(0, 1)}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
