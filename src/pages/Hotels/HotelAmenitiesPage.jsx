import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AiFillEye } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";

import axios from "../../axios";
import { PageLoader } from "../../components";
import { HotelAmenityModal } from "../../features/HotelFacility";
// import { config } from "../../constants";
import { hasPermission } from "../../utils";

export default function HotelAmenitiesPage() {
  const [amenities, setAmenities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hotelAmenityModal, setHotelAmenityModal] = useState({
    isOpen: false,
    isEdit: false,
  });
  const [selectedHotelAmenity, setselectedHotelAmenity] = useState({});
  const [searchText, setSearchText] = useState("");

  const { jwtToken, admin } = useSelector((state) => state.admin);

  const isCreatePermission = hasPermission({
    roles: admin?.roles,
    name: "hotel-amenities",
    permission: "create",
  });
  const isEditPermission = hasPermission({
    roles: admin?.roles,
    name: "hotel-amenities",
    permission: "update",
  });
  const isDeletePermission = hasPermission({
    roles: admin?.roles,
    name: "hotel-amenities",
    permission: "delete",
  });

  const fetchHotelFacilities = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/hotels/amenities/groups/all", {
        headers: { authorization: `Bearer ${jwtToken}` },
      });
      setAmenities(response?.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const addHotelAmenity = (newAmenity) => {
    setAmenities((prev) => {
      return [newAmenity, ...prev];
    });
  };

  const updateHotelAmenity = (updatedAmenity) => {
    const objIndex = amenities.findIndex((amenity) => {
      return amenity?._id === updatedAmenity?._id;
    });

    let temp = amenities;
    temp[objIndex] = updatedAmenity;
    setAmenities(temp);
  };

  const deleteHotelAmenity = async (id) => {
    try {
      const isConfirm = window.confirm("Are you sure to delete?");

      if (isConfirm) {
        await axios.delete(`/hotels/amenities/groups/delete/${id}`, {
          headers: { authorization: `Bearer ${jwtToken}` },
        });

        const filteredHotelAmenities = amenities.filter((amenity) => {
          return amenity?._id !== id;
        });
        setAmenities(filteredHotelAmenities);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filteredAmenities = amenities?.filter((item) => {
    return searchText
      ? item?.name?.toLowerCase()?.includes(searchText?.toLowerCase())
      : true;
  });

  useEffect(() => {
    fetchHotelFacilities();
  }, []);

  return (
    <div>
      <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
        <h1 className="font-[600] text-[15px] uppercase">Hotel Amenities</h1>
        <div className="text-sm text-grayColor">
          <Link to="/" className="text-textColor">
            Dashboard{" "}
          </Link>
          <span>{">"} </span>
          <Link to="/hotels" className="text-textColor">
            Hotels{" "}
          </Link>
          <span>{">"} </span>
          <span>Amenities</span>
        </div>
      </div>

      {hotelAmenityModal?.isOpen && (
        <HotelAmenityModal
          hotelAmenityModal={hotelAmenityModal}
          setHotelAmenityModal={setHotelAmenityModal}
          selectedHotelAmenity={selectedHotelAmenity}
          addHotelAmenity={addHotelAmenity}
          updateHotelAmenity={updateHotelAmenity}
          isParent={true}
        />
      )}

      {isLoading ? (
        <PageLoader />
      ) : (
        <div className="p-6">
          <div className="bg-white rounded shadow-sm">
            <div className="flex items-center justify-between border-b border-dashed p-4">
              <h1 className="font-medium">All Amenities</h1>
              <div className="flex items-center gap-[10px]">
                <input
                  type="text"
                  placeholder="Search here..."
                  onChange={(e) => setSearchText(e.target.value)}
                />
                {isCreatePermission && (
                  <button
                    className="px-3 whitespace-nowrap"
                    onClick={() =>
                      setHotelAmenityModal({
                        isOpen: true,
                        isEdit: false,
                      })
                    }
                  >
                    + Add Amenity
                  </button>
                )}
              </div>
            </div>
            {!filteredAmenities || filteredAmenities?.length < 1 ? (
              <div className="p-6 flex flex-col items-center">
                <span className="text-sm text-grayColor block mt-[6px]">
                  Oops.. No Amenities Found
                </span>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                  <tr>
                    <th className="font-[500] p-3">Name</th>
                    <th className="font-[500] p-3 text-center">
                      Sub Amenities
                    </th>
                    {(isEditPermission || isDeletePermission) && (
                      <th className="font-[500] p-3">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredAmenities?.map((amenity, index) => {
                    return (
                      <tr
                        key={index}
                        className="border-b border-tableBorderColor"
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-[15px]">
                            {amenity?.icon ? (
                              <img
                                src={
                                  import.meta.env.VITE_SERVER_URL +
                                  amenity?.icon
                                }
                                alt=""
                                className="w-[40px] max-h-[40px]"
                              />
                            ) : (
                              <span className="text-lg w-[40px] flex items-center justify-center">
                                <FaCheck />
                              </span>
                            )}
                            <span className="capitalize">{amenity?.name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-lg">
                          <Link
                            to={`${amenity?._id}/sub-amenities`}
                            className="block w-max mx-auto "
                          >
                            <AiFillEye />
                          </Link>
                        </td>
                        {(isEditPermission || isDeletePermission) && (
                          <td className="p-3">
                            <div className="flex gap-[10px]">
                              {isDeletePermission && (
                                <button
                                  className="h-auto bg-transparent text-red-500 text-xl"
                                  onClick={() =>
                                    deleteHotelAmenity(amenity?._id)
                                  }
                                >
                                  <MdDelete />
                                </button>
                              )}
                              {isEditPermission && (
                                <button
                                  className="h-auto bg-transparent text-green-500 text-xl"
                                  onClick={() => {
                                    setselectedHotelAmenity(amenity);
                                    setHotelAmenityModal({
                                      isOpen: true,
                                      isEdit: true,
                                    });
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}
