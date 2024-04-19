import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { useHandleClickOutside, useImageChange } from "../../../hooks";
import { BtnLoader } from "../../../components";
import axios from "../../../axios";
// import { config } from "../../../constants";

export default function AddVehicleTrimModal({
  vehicleTrimModal,
  setVehicleTrimModal,
  selectedVehicleTrim,
  addVehicleTrim,
  updateVehicleTrim,
}) {
  const [data, setData] = useState({
    trimName: (vehicleTrimModal?.isEdit && selectedVehicleTrim?.trimName) || "",
    airportSeatingCapacity:
      (vehicleTrimModal?.isEdit &&
        selectedVehicleTrim?.airportSeatingCapacity) ||
      "",
    normalSeatingCapacity:
      (vehicleTrimModal?.isEdit &&
        selectedVehicleTrim?.normalSeatingCapacity) ||
      "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const wrapperRef = useRef();
  useHandleClickOutside(wrapperRef, () =>
    setVehicleTrimModal({ isEdit: false, isOpen: false })
  );
  const { jwtToken } = useSelector((state) => state.admin);
  const { modelId } = useParams();

  const handleChange = (e) => {
    setData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      setError("");

      if (vehicleTrimModal?.isEdit) {
        const response = await axios.patch(
          `/transfers/vehicles/trim/update/${selectedVehicleTrim?._id}`,
          { ...data, vehicleModel: modelId },
          {
            headers: { Authorization: `Bearer ${jwtToken}` },
          }
        );

        updateVehicleTrim(response.data);
      } else {
        const response = await axios.post(
          "/transfers/vehicles/trim/add",
          { ...data, vehicleModel: modelId },
          {
            headers: { Authorization: `Bearer ${jwtToken}` },
          }
        );
        addVehicleTrim(response.data);
      }
      setVehicleTrimModal({ isOpen: false, isEdit: false });
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong, Try again");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
      <div
        ref={wrapperRef}
        className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-medium">
            {vehicleTrimModal?.isEdit
              ? "Update Vehicle Trim"
              : "Add Vehicle Trim"}
          </h2>
          <button
            className="h-auto bg-transparent text-textColor text-xl"
            onClick={() =>
              setVehicleTrimModal({ isOpen: false, isEdit: false })
            }
          >
            <MdClose />
          </button>
        </div>
        <div className="p-4">
          <form action="" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="">Trim Name *</label>
              <input
                type="text"
                placeholder="Enter Trim Name"
                name="trimName"
                value={data.trimName || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mt-4">
              <label htmlFor="">Airport Seating Capacity *</label>
              <input
                type="number"
                placeholder="Enter Airport Seating Capacity"
                name="airportSeatingCapacity"
                value={data.airportSeatingCapacity || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mt-4">
              <label htmlFor="">Normal Seating Capacity *</label>
              <input
                type="number"
                placeholder="Enter Normal Seating Capacity"
                name="normalSeatingCapacity"
                value={data.normalSeatingCapacity || ""}
                onChange={handleChange}
                required
              />
            </div>
            {error && (
              <span className="text-sm block text-red-500 mt-2">{error}</span>
            )}
            <div className="mt-4 flex items-center justify-end gap-[12px]">
              <button
                className="bg-slate-300 text-textColor px-[15px]"
                type="button"
                onClick={() =>
                  setVehicleTrimModal({
                    isOpen: false,
                    isEdit: false,
                  })
                }
              >
                Cancel
              </button>
              <button className="w-[150px]">
                {isLoading ? (
                  <BtnLoader />
                ) : vehicleTrimModal?.isEdit ? (
                  "Update Trim"
                ) : (
                  "Add Trim"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
