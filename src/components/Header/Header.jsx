import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FiChevronDown } from "react-icons/fi";

import AdminDropdown from "./AdminDropdown";
import { avatarImg } from "../../assets/images";
import CurrenciesDropdown from "./CurrenciesDropdown";
import { config } from "../../constants";
import GlobalSearchInp from "../GlobalSearch/GlobalSearchInp";
import DraftModal from "./DraftModal";

export default function Header() {
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [isCurrenciesDropdownOpen, setIsCurrenciesDropdownOpen] =
    useState(false);

  const [draftModal, setDraftModal] = useState(false);

  const { admin } = useSelector((state) => state.admin);
  const { selectedCurrency } = useSelector((state) => state.general);

  const [hotelDraft, setHotelDraft] = useState();
  const [attrDraft, setAttrDraft] = useState();

  const { details } = useSelector((state) => state.hotelForm);
  const { data } = useSelector((state) => state.attractionForm);

  useEffect(() => {
    setHotelDraft(JSON.parse(localStorage.getItem("hotelDetails")));
    setAttrDraft(JSON.parse(localStorage.getItem("attractionData")));
  }, [
    localStorage.getItem("hotelDetails"),
    details,
    data,
    localStorage.getItem("attractionData"),
  ]);

  return (
    <div className="w-full bg-white h-[70px] px-5">
      <div className="h-full flex items-center justify-between">
        <div>
          <GlobalSearchInp />
        </div>
        <div className="flex items-center gap-[2em] h-full">
          {/* {hotelDraft?.hotelName ||
          hotelDraft?.address ||
          hotelDraft?.postalCode ||
          hotelDraft?.carParkingSlots ||
          hotelDraft?.country ||
          hotelDraft?.state ||
          hotelDraft?.starCategory ||
          hotelDraft?.landMark ||
          hotelDraft?.longitude ||
          hotelDraft?.latitude ||
          attrDraft?.title ||
          attrDraft?.destination ||
          attrDraft?.category ||
          attrDraft?.duration ||
          attrDraft?.city ||
          attrDraft?.mapLink ? (
            <div className="relative">
              <div
                className="  flex gap-2 cursor-pointer"
                onClick={() => {
                  setDraftModal(!draftModal);
                }}
              >
                <h1 className="text-red-500">Draft</h1>
                <h1 className="text-red-500 py-1">
                  {" "}
                  <FiChevronDown />
                </h1>
              </div>

              {draftModal ? (
                <DraftModal
                  setDraftModal={setDraftModal}
                  draftModal={draftModal}
                />
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )} */}

          <div className="relative h-full">
            <div
              className="h-full flex items-center gap-[10px] text-sm font-medium cursor-pointer"
              onClick={() => setIsCurrenciesDropdownOpen(true)}
            >
              <img src={selectedCurrency?.flag} alt="" className="w-[25px]" />
              {selectedCurrency?.isocode} <FiChevronDown />
            </div>
            {isCurrenciesDropdownOpen && (
              <CurrenciesDropdown
                setIsCurrenciesDropdownOpen={setIsCurrenciesDropdownOpen}
              />
            )}
          </div>
          <div className="relative h-full">
            <div
              className="bg-[#f3f3f9] h-[100%] flex gap-[10px] items-center px-[12px] cursor-pointer"
              onClick={() => setIsAdminDropdownOpen(true)}
            >
              <div className="w-[30px] h-[30px] rounded-full overflow-hidden">
                <img
                  src={
                    admin?.avatar
                      ? config.SERVER_URL + admin?.avatar
                      : avatarImg
                  }
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="">
                <span className="block text-sm font-medium">{admin?.name}</span>
                <span className="block text-[12px] text-grayColor">
                  {admin?.email}
                </span>
              </div>
            </div>

            {isAdminDropdownOpen && (
              <AdminDropdown setIsAdminDropdownOpen={setIsAdminDropdownOpen} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
