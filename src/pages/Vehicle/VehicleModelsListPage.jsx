import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { AiFillEye } from "react-icons/ai";

import axios from "../../axios";
import { PageLoader } from "../../components";
import { AddVehicleModelModal } from "../../features/Vehicle";
// import { config } from "../../constants";

export default function VehicleModelsListPage() {
  const [vehicleModels, setVehicleModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [vehicleModelModal, setVehicleModelModal] = useState({
    isOpen: false,
    isEdit: false,
  });
  const [selectedVehicleModel, setSelectedVehicleModel] = useState({});
  const [vehicleMake, setVehicleMake] = useState({});
  const [bodyTypes, setBodyTypes] = useState([]);

  const { jwtToken } = useSelector((state) => state.admin);
  const { makeId } = useParams();

  const fetchVehicleModels = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/transfers/vehicles/makes/single/${makeId}/models`,
        {
          headers: { authorization: `Bearer ${jwtToken}` },
        }
      );
      setVehicleModels(response?.data?.vehicleModels);
      setVehicleMake(response?.data?.vehicleMake);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const addVehicleModel = (newVehicleModel) => {
    setVehicleModels((prev) => {
      return [newVehicleModel, ...prev];
    });
  };

  const updateVehicleModel = (updatedVehicleModel) => {
    const objIndex = vehicleModels.findIndex((vModel) => {
      return vModel?._id === updatedVehicleModel?._id;
    });

    let temp = vehicleModels;
    temp[objIndex] = updatedVehicleModel;
  };

  const deleteVehicleModel = async (id) => {
    try {
      const isConfirm = window.confirm("Are you sure to delete?");

      if (isConfirm) {
        await axios.delete(`/transfers/vehicles/models/delete/${id}`, {
          headers: { authorization: `Bearer ${jwtToken}` },
        });

        const filteredVehicleModels = vehicleModels.filter((vModel) => {
          return vModel?._id !== id;
        });
        setVehicleModels(filteredVehicleModels);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchVehicleModels();
  }, []);

  useEffect(() => {
    const fetchBodyTypes = async () => {
      try {
        const response = await axios.get(
          `/transfers/vehicles/body-types/all/names`,
          {
            headers: { authorization: `Bearer ${jwtToken}` },
          }
        );
        setBodyTypes(response?.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchBodyTypes();
  }, []);

  return (
    <div>
      <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
        <h1 className="font-[600] text-[15px] uppercase">Vehicle Models</h1>
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
          <Link to="/transfers/vehicles/makes" className="text-textColor">
            Makes{" "}
          </Link>
          <span>{">"} </span>
          <span>
            {makeId?.slice(0, 3)}...{makeId?.slice(-3)}{" "}
          </span>
          <span>{">"} </span>
          <span>Models</span>
        </div>
      </div>

      {vehicleModelModal?.isOpen && (
        <AddVehicleModelModal
          vehicleModelModal={vehicleModelModal}
          setVehicleModelModal={setVehicleModelModal}
          selectedVehicleModel={selectedVehicleModel}
          addVehicleModel={addVehicleModel}
          updateVehicleModel={updateVehicleModel}
          bodyTypes={bodyTypes}
        />
      )}

      {isLoading ? (
        <PageLoader />
      ) : (
        <div className="p-6">
          <div className="bg-white rounded shadow-sm">
            <div className="flex items-center justify-between border-b border-dashed p-4">
              <h1 className="font-medium">
                All Vehicle Models{" "}
                {vehicleMake && `(${vehicleMake?.companyName})`}
              </h1>
              <button
                className="px-3"
                onClick={() =>
                  setVehicleModelModal({
                    isOpen: true,
                    isEdit: false,
                  })
                }
              >
                + Add Model
              </button>
            </div>
            {vehicleModels?.length < 1 ? (
              <div className="p-6 flex flex-col items-center">
                <span className="text-sm text-grayColor block mt-[6px]">
                  Oops.. No Vehicle Models found
                </span>
              </div>
            ) : (
              <div>
                <table className="w-full">
                  <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                    <tr>
                      <th className="font-[500] p-3">Model Name</th>
                      <th className="font-[500] p-3">Image</th>
                      <th className="font-[500] p-3">Body Type</th>
                      <th className="font-[500] p-3 text-center">Trim List</th>
                      <th className="font-[500] p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {vehicleModels?.map((vModel, index) => {
                      return (
                        <tr
                          key={index}
                          className="border-b border-tableBorderColor"
                        >
                          <td className="p-3">{vModel?.modelName}</td>
                          <td className="p-3">
                            {vModel?.vehicleImage ? (
                              <img
                                src={
                                  import.meta.env.VITE_SERVER_URL +
                                  vModel?.vehicleImage
                                }
                                alt=""
                                className="w-[90px] max-h-[90px]"
                              />
                            ) : (
                              "N/A"
                            )}
                          </td>
                          <td className="p-3">{vModel?.bodyType?.bodyType}</td>
                          <td className="p-3 text-center">
                            <Link to={`${vModel?._id}/trim`}>
                              <button className="bg-transparent text-[#222] text-lg h-auto">
                                <AiFillEye />
                              </button>
                            </Link>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-[10px]">
                              <button
                                className="h-auto bg-transparent text-red-500 text-xl"
                                onClick={() => deleteVehicleModel(vModel?._id)}
                              >
                                <MdDelete />
                              </button>
                              <button
                                className="h-auto bg-transparent text-green-500 text-xl"
                                onClick={() => {
                                  setSelectedVehicleModel(vModel);
                                  setVehicleModelModal({
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
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
