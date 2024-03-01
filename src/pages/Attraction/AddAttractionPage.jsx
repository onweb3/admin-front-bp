import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  AttrAvailabilityForm,
  AttrDescriptionForm,
  AttrDetailsForm,
  AttrMediaForm,
} from "../../features/Attractions";
import {
  clearAttractionData,
  fetchInitialData,
  handleInitiateLocalStorageData,
} from "../../redux/slices/attractionFormSlice";
import { Link } from "react-router-dom";
import AddAttrSubmission from "../../features/Attractions/components/AddAttrSubmission";
import { useImageChange } from "../../hooks";

export default function AddAttractionPage() {
  const [section, setSection] = useState(2);
  const [newImages, setNewImages] = useState([]);

  const dispatch = useDispatch();

  const {
    image: logoImg,
    handleImageChange: handleLogoImgChange,
    error: logoImgError,
  } = useImageChange();

  useEffect(() => {
    dispatch(fetchInitialData());
  }, [dispatch]);

  useEffect(() => {
    return () => dispatch(clearAttractionData());
  }, []);

  let attrData = JSON.parse(localStorage.getItem("attractionData"));

  useEffect(() => {
    dispatch(handleInitiateLocalStorageData({ attrData: attrData }));
  }, []);

  return (
    <div>
      <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
        <h1 className="font-[600] text-[15px] uppercase">Add Attraction</h1>
        <div className="text-sm text-grayColor">
          <Link to="/" className="text-textColor">
            Dashboard{" "}
          </Link>
          <span>{">"} </span>
          <Link to="/attractions" className="text-textColor">
            Attractions{" "}
          </Link>
          <span>{">"} </span>
          <span>Add</span>
        </div>
      </div>
      <div className="p-6">
        <div className="bg-white rounded shadow-sm">
          <div className="grid grid-cols-4">
            <div
              className={
                "p-3 cursor-pointer font-medium text-sm " +
                (section === 2 ? "bg-[#e1e5ee]" : "bg-[#f3f6f9]")
              }
              onClick={() => setSection(2)}
            >
              Details
            </div>
            <div
              className={
                "p-3 cursor-pointer font-medium text-sm " +
                (section === 3 ? "bg-[#e1e5ee]" : "bg-[#f3f6f9]")
              }
              onClick={() => setSection(3)}
            >
              Availability
            </div>
            <div
              className={
                "p-3 cursor-pointer font-medium text-sm " +
                (section === 4 ? "bg-[#e1e5ee]" : "bg-[#f3f6f9]")
              }
              onClick={() => setSection(4)}
            >
              Descriptions
            </div>
            <div
              className={
                "p-3 cursor-pointer font-medium text-sm " +
                (section === 5 ? "bg-[#e1e5ee]" : "bg-[#f3f6f9]")
              }
              onClick={() => setSection(5)}
            >
              Media
            </div>
          </div>

          <div className="p-4">
            <AttrDetailsForm section={section} />
            <AttrAvailabilityForm section={section} />
            <AttrDescriptionForm section={section} />
            <AttrMediaForm
              section={section}
              newImages={newImages}
              setNewImages={setNewImages}
              logoImgError={logoImgError}
              handleLogoImgChange={handleLogoImgChange}
              logoImg={logoImg}
            />
            <AddAttrSubmission
              newImages={newImages}
              next={section !== 5}
              setSection={setSection}
              prev={section !== 2}
              logoImg={logoImg}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
