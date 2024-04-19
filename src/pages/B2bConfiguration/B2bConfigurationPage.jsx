import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { isImageValid } from "../../utils";
import axios from "../../axios";
import { BtnLoader, PageLoader, Toggle } from "../../components";
// import { config } from "../../constants";

export default function B2bConfigurationPage() {
  const [newImages, setNewImages] = useState([]);
  const [data, setData] = useState({
    hotelBackgroundImages: [],
    showContractHotels: false,
    showHotelBedHotels: false,
  });
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { jwtToken } = useSelector((state) => state.admin);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    for (let i = 0; i < e.target?.files?.length; i++) {
      if (isImageValid(e.target.files[i])) {
        setNewImages((prev) => {
          return [...prev, e.target.files[i]];
        });
      } else {
        alert("Upload png, jpg, jpeg or webp");
      }
    }
  };

  const removeNewImage = (index) => {
    const filteredImages = newImages?.filter((_, ind) => {
      return ind !== index;
    });
    setNewImages(filteredImages);
  };

  const removeOldImage = (index) => {
    const filteredImages = data?.hotelBackgroundImages?.filter((_, ind) => {
      return ind !== index;
    });
    setData({
      ...data,
      hotelBackgroundImages: filteredImages,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setError("");
      setIsLoading(true);

      const formData = new FormData();
      formData.append("oldImages", JSON.stringify(data.hotelBackgroundImages));
      formData.append("showContractHotels", data.showContractHotels);
      formData.append("showHotelBedHotels", data.showHotelBedHotels);
      for (let i = 0; i < newImages?.length; i++) {
        formData.append("images", newImages[i]);
      }

      await axios.patch("/b2b-configurations/upsert", formData, {
        headers: { authorization: `Bearer ${jwtToken}` },
      });
      setNewImages([]);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err?.response?.data?.error || "Something went wrong, try again");
    }
  };

  const fetchConfigurationData = async (req, res) => {
    try {
      setIsPageLoading(true);
      const response = await axios.get("/b2b-configurations", {
        headers: { authorization: `Bearer ${jwtToken}` },
      });
      setData((prev) => {
        return {
          ...prev,
          hotelBackgroundImages: response.data?.hotelBackgroundImages || [],
          showContractHotels: response.data.showContractHotels || false,
          showHotelBedHotels: response.data.showHotelBedHotels || false,
        };
      });

      setIsPageLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchConfigurationData();
  }, []);

  return (
    <div>
      <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
        <h1 className="font-[600] text-[15px]">B2B Configurations</h1>
        <div className="text-sm text-grayColor">
          <Link to="/" className="text-textColor">
            Dashboard{" "}
          </Link>
          <span>{">"} </span>
          <Link to="/b2b" className="text-textColor">
            B2B{" "}
          </Link>
          <span>{">"} </span>
          <span>Configurations</span>
        </div>
      </div>
      {isPageLoading ? (
        <PageLoader />
      ) : (
        <div className="p-6">
          <form action="" onSubmit={handleSubmit}>
            <div className="bg-white rounded p-6 shadow-sm">
              <div>
                <h1 className="font-[600] text-[17px] mb-2">
                  Hotel Home Background Images
                </h1>
                <div>
                  <label htmlFor="">Image *</label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    multiple={true}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-[1.5em] mt-5">
                  {data.hotelBackgroundImages?.map((image, index) => {
                    return (
                      <div
                        className="relative group w-[130px] aspect-video rounded overflow-hidden cursor-pointer"
                        key={index}
                        onClick={() => removeOldImage(index)}
                      >
                        <img
                          src={import.meta.env.VITE_SERVER_URL + image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div className="hidden group-hover:flex absolute inset-0 bg-[#0005] text-xl items-center justify-center cursor-pointer text-red-500">
                          <MdDelete />
                        </div>
                      </div>
                    );
                  })}
                  {newImages.map((image, index) => {
                    return (
                      <div
                        className="relative group w-[130px] aspect-video rounded overflow-hidden cursor-pointer"
                        key={index}
                        onClick={() => removeNewImage(index)}
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div className="hidden group-hover:flex absolute inset-0 bg-[#0005] text-xl items-center justify-center cursor-pointer text-red-500">
                          <MdDelete />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-7">
                <h1 className="font-[600] text-[17px] mb-2">
                  Hotel Configurations
                </h1>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label htmlFor="">Show Contract Hotels</label>
                    <Toggle
                      onChange={(e) =>
                        setData((prev) => {
                          return {
                            ...prev,
                            showContractHotels: e.target.checked,
                          };
                        })
                      }
                      value={data.showContractHotels || false}
                    />
                  </div>
                  <div>
                    <label htmlFor="">Show HotelBed Hotels</label>
                    <Toggle
                      onChange={(e) =>
                        setData((prev) => {
                          return {
                            ...prev,
                            showHotelBedHotels: e.target.checked,
                          };
                        })
                      }
                      value={data.showHotelBedHotels || false}
                    />
                  </div>
                </div>
              </div>
              {error && (
                <span className="text-sm block text-red-500 mt-2">{error}</span>
              )}
              <div className="mt-4 flex items-center justify-end gap-[12px]">
                <button
                  className="bg-slate-300 text-textColor px-[15px]"
                  type="button"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button className="w-[100px]">
                  {isLoading ? <BtnLoader /> : "Update"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
