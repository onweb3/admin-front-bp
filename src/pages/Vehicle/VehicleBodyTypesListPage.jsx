import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { AddVehicleBodyTypeModal } from "../../features/Vehicle";
// import { config } from "../../constants";

export default function VehicleBodyTypesListPage() {
  const [vehicleBodyTypes, setVehicleBodyTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [vehicleBodyTypesModal, setVehicleBodyTypesModal] = useState({
    isOpen: false,
    isEdit: false,
  });
  const [selectedVehicleBodyType, setSelectedVehicleBodyType] = useState({});
  const [filters, setFilters] = useState({
    skip: 0,
    limit: 10,
    totalVehicleBodyTypes: 0,
  });

  const { jwtToken } = useSelector((state) => state.admin);

  const fetchVehicleBodyTypes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/transfers/vehicles/body-types/all?skip=${filters.skip}&limit=${filters.limit}`,
        {
          headers: { authorization: `Bearer ${jwtToken}` },
        }
      );
      setVehicleBodyTypes(response?.data?.vehicleBodyTypes);
      setFilters((prev) => {
        return {
          ...prev,
          totalVehicleBodyTypes: response?.data?.totalVehicleBodyTypes,
        };
      });
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const addVehicleBodyType = (newBodyType) => {
    setVehicleBodyTypes((prev) => {
      return [newBodyType, ...prev];
    });
  };

  const updateVehicleBodyType = (updateVehicleBodyType) => {
    const objIndex = vehicleBodyTypes.findIndex((bodyType) => {
      return bodyType?._id === updateVehicleBodyType?._id;
    });

    let temp = vehicleBodyTypes;
    temp[objIndex] = updateVehicleBodyType;
  };

  const deleteVehicleBodyType = async (id) => {
    try {
      const isConfirm = window.confirm("Are you sure to delete?");

      if (isConfirm) {
        await axios.delete(`/transfers/vehicles/body-types/delete/${id}`, {
          headers: { authorization: `Bearer ${jwtToken}` },
        });

        const filteredBodyTypes = vehicleBodyTypes.filter((bodyType) => {
          return bodyType?._id !== id;
        });
        setVehicleBodyTypes(filteredBodyTypes);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchVehicleBodyTypes();
  }, [filters.skip]);

  return (
    <div>
      <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
        <h1 className="font-[600] text-[15px] uppercase">Vehicle Body Types</h1>
        <div className="text-sm text-grayColor">
          <Link to="/" className="text-textColor">
            Dashboard{" "}
          </Link>
          <span>{">"} </span>
          <Link to="/transfers" className="text-textColor">
            Transfers{" "}
          </Link>
          <span>{">"} </span>
          <Link to="/transfers/vehicles" className="text-textColor">
            Vehicles{" "}
          </Link>
          <span>{">"} </span>
          <span>Body Types</span>
        </div>
      </div>

      {vehicleBodyTypesModal?.isOpen && (
        <AddVehicleBodyTypeModal
          vehicleBodyTypesModal={vehicleBodyTypesModal}
          setVehicleBodyTypesModal={setVehicleBodyTypesModal}
          selectedVehicleBodyType={selectedVehicleBodyType}
          addVehicleBodyType={addVehicleBodyType}
          updateVehicleBodyType={updateVehicleBodyType}
        />
      )}

      {isLoading ? (
        <PageLoader />
      ) : (
        <div className="p-6">
          <div className="bg-white rounded shadow-sm">
            <div className="flex items-center justify-between border-b border-dashed p-4">
              <h1 className="font-medium">All Vehicle Body Types</h1>
              <button
                className="px-3"
                onClick={() =>
                  setVehicleBodyTypesModal({
                    isOpen: true,
                    isEdit: false,
                  })
                }
              >
                + Add Body Type
              </button>
            </div>
            {vehicleBodyTypes?.length < 1 ? (
              <div className="p-6 flex flex-col items-center">
                <span className="text-sm text-grayColor block mt-[6px]">
                  Oops.. No Vehicle Body Types Found
                </span>
              </div>
            ) : (
              <div>
                <table className="w-full">
                  <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                    <tr>
                      <th className="font-[500] p-3">Image</th>
                      <th className="font-[500] p-3">Body Type</th>
                      <th className="font-[500] p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {vehicleBodyTypes?.map((bodyType, index) => {
                      return (
                        <tr
                          key={index}
                          className="border-b border-tableBorderColor"
                        >
                          <td className="p-3 capitalize">
                            <div>
                              <img
                                src={
                                  import.meta.env.VITE_SERVER_URL +
                                  bodyType?.bodyImg
                                }
                                className="w-[90px]"
                                alt=""
                              />
                            </div>
                          </td>
                          <td className="p-3 capitalize">
                            {bodyType?.bodyType}
                          </td>
                          <td className="p-3">
                            <div className="flex gap-[10px]">
                              <button
                                className="h-auto bg-transparent text-red-500 text-xl"
                                onClick={() =>
                                  deleteVehicleBodyType(bodyType?._id)
                                }
                              >
                                <MdDelete />
                              </button>
                              <button
                                className="h-auto bg-transparent text-green-500 text-xl"
                                onClick={() => {
                                  setSelectedVehicleBodyType(bodyType);
                                  setVehicleBodyTypesModal({
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

                <div className="p-4">
                  <Pagination
                    limit={filters?.limit}
                    skip={filters?.skip}
                    total={filters?.totalVehicleBodyTypes}
                    incOrDecSkip={(number) =>
                      setFilters((prev) => {
                        return {
                          ...prev,
                          skip: prev.skip + number,
                        };
                      })
                    }
                    updateSkip={(skip) =>
                      setFilters((prev) => {
                        return { ...prev, skip };
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
