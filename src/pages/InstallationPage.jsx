import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setAdmin } from "../redux/slices/adminSlice";
import { logoPng } from "../assets/images";
import { BtnLoader } from "../components";
// import { config } from "../constants";
import { useImageChange } from "../hooks";
import axios from "axios";

export default function InstallationPage() {
  const [data, setData] = useState({
    COMPANY_LOGO: "",
    COMPANY_NAME: "",
    FAV_IMAGE: "",
    COMPANY_SHORT_NAME: "",
  });
  const { company } = useSelector((state) => state.admin);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const { image, handleImageChange, error: imageError } = useImageChange();
  const {
    image: logoImg,
    handleImageChange: handleLogoImgChange,
    error: logoImgError,
  } = useImageChange();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      setError("");

      const formData = new FormData();

      formData.append("COMPANY_LOGO", logoImg || "");
      formData.append("COMPANY_NAME", data.COMPANY_NAME || "");

      formData.append("FAV_IMAGE", image || "");
      formData.append("COMPANY_SHORT_NAME", data.COMPANY_SHORT_NAME || "");
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/initial`,
        formData
      );
      console.log(response);
      window.location = "/login";
      console.log("login");

      // dispatch(setAdmin(response.data));
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.error || "Something went wrong, Try again");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex items-center gap-[10px] mb-10">
        <img
          src={`${import.meta.env.VITE_SERVER_URL}/${company.COMPANY_LOGO}`}
          alt=""
          className="w-[230px]"
        />
      </div>
      <div className="w-full max-w-[420px] border p-7 rounded bg-white">
        <div className="mb-5">
          <h1 className="font-[600] text-xl text-center">Installation Setup</h1>
        </div>
        <form action="" onSubmit={handleSubmit}>
          <div className="mt-4">
            <label htmlFor="">Company Name</label>
            <input
              type="text"
              placeholder="Enter company name"
              name="COMPANY_NAME"
              value={data.COMPANY_NAME || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mt-4">
            <label htmlFor="">Company Short Name</label>
            <input
              type="text"
              placeholder="Enter airline code"
              name="COMPANY_SHORT_NAME"
              value={data.COMPANY_SHORT_NAME || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mt-4">
            <label htmlFor="">Company Logo</label>
            <input type="file" onChange={handleLogoImgChange} />
            {imageError && (
              <span className="block text-sm text-red-500 mt-2">
                {imageError}
              </span>
            )}
            {(logoImg || data.COMPANY_LOGO) && (
              <div className="mt-4 w-[50px] h-[50px]">
                <img
                  src={
                    image
                      ? URL.createObjectURL(logoImg)
                      : import.meta.env.VITE_SERVER_URL + data.COMPANY_LOGO
                  }
                  alt=""
                  className="w-[100%] h-[100%] object-cover"
                />
              </div>
            )}
          </div>
          <div className="mt-4">
            <label htmlFor="">Company Favicon</label>
            <input type="file" onChange={handleImageChange} />
            {imageError && (
              <span className="block text-sm text-red-500 mt-2">
                {imageError}
              </span>
            )}
            {(image || data.FAV_IMAGE) && (
              <div className="mt-4 w-[50px] h-[50px]">
                <img
                  src={
                    image
                      ? URL.createObjectURL(image)
                      : import.meta.env.VITE_SERVER_URL + data.FAV_IMAGE
                  }
                  alt=""
                  className="w-[100%] h-[100%] object-cover"
                />
              </div>
            )}
          </div>
          {error && (
            <span className="block text-sm text-red-500 mt-2">{error}</span>
          )}
          <button className="w-full mt-4">
            {isLoading ? <BtnLoader /> : "Install"}
          </button>
        </form>
      </div>
    </div>
  );
}
