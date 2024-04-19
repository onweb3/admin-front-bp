import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { useImageChange } from "../../hooks";
import axios from "../../axios";
import { BtnLoader, PageLoader } from "../../components";
// import { config } from "../../constants";

export default function PromotionBannerUpdatePage() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    showPromoBanner: false,
    promoBannerImage: "",
  });
  const [error, setError] = useState("");

  const { jwtToken } = useSelector((state) => state.admin);
  const { id, promotionId } = useParams();
  const {
    image: promotionImg,
    handleImageChange: handlePromotionImgChange,
    error: promotionImgError,
    setImage: setPromoImage,
  } = useImageChange();
  const navigate = useNavigate();
  const promoInputRef = useRef(null);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("showPromoBanner", data.showPromoBanner);
      formData.append("promoBannerImage", promotionImg);
      formData.append("oldImage", data.promoBannerImage);

      await axios.patch(
        `/hotels/promotions/update-banner/${promotionId}`,
        formData,
        {
          headers: { authorization: `Bearer ${jwtToken}` },
        }
      );
      navigate(`/hotels/${id}/promotions`);
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong, Try again");
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setIsPageLoading(true);
      const response = await axios.get(
        `/hotels/promotions/banner-info/${promotionId}`,
        {
          headers: { authorization: `Bearer ${jwtToken}` },
        }
      );
      setData((prev) => {
        return {
          ...prev,
          promoBannerImage: response.data.promoBannerImage || "",
          showPromoBanner: response?.data?.showPromoBanner || false,
        };
      });
      setIsPageLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
        <h1 className="font-[600] text-[15px] uppercase">
          Update Promotion Banner
        </h1>
        <div className="text-sm text-grayColor">
          <Link to="/" className="text-textColor">
            Dashboard{" "}
          </Link>
          <span>{">"} </span>
          <Link to="/hotels" className="text-textColor">
            Hotels
          </Link>
          <span>{">"} </span>
          <span>
            {id?.slice(0, 3)}...{id?.slice(-3)}{" "}
          </span>
          <span>{">"} </span>
          <Link to={`/hotels/${id}/promotions/`} className="text-textColor">
            Promotions{" "}
          </Link>
          <span>{">"} </span>
          <span>
            {promotionId?.slice(0, 3)}...{promotionId?.slice(-3)}{" "}
          </span>
          <span>{">"} </span>
          <span>Banner </span>
        </div>
      </div>

      <div className="p-6 ">
        <div className="bg-white rounded shadow-sm p-[10px]">
          <div className="flex items-center justify-between border-b border-dashed p-4">
            <h1 className="font-medium">Update Promotion Banner</h1>
          </div>
          {isPageLoading ? (
            <PageLoader />
          ) : (
            <div className="p-4">
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="flex items-center gap-[10px]">
                  <input
                    type="checkbox"
                    className="w-[16px] h-[16px]"
                    id="show-promotion"
                    onChange={(e) => {
                      setData((prev) => {
                        return {
                          ...prev,
                          showPromoBanner: e.target.checked,
                        };
                      });
                    }}
                    checked={data.showPromoBanner || false}
                  />
                  <label htmlFor="show-promotion" className="mb-0">
                    Show Promotion
                  </label>
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="">
                  Promotion Image {data.showPromoBanner === true ? "*" : ""}
                </label>
                <input
                  type="file"
                  onChange={handlePromotionImgChange}
                  accept="image/*"
                  ref={promoInputRef}
                />
                {promotionImgError && (
                  <span className="block text-sm mt-2 text-red-500">
                    {promotionImgError}
                  </span>
                )}

                {(promotionImg || data.promoBannerImage) && (
                  <div className="mt-3">
                    <img
                      src={
                        promotionImg
                          ? URL.createObjectURL(promotionImg)
                          : import.meta.env.VITE_SERVER_URL +
                            data.promoBannerImage
                      }
                      alt=""
                      className="h-[100px] object-cover"
                    />
                    <span
                      className="text-red-500 underline text-sm mt-2 block cursor-pointer"
                      onClick={() => {
                        setData((prev) => {
                          return {
                            ...prev,
                            promoBannerImage: "",
                          };
                        });
                        setPromoImage("");
                        promoInputRef.current.value = null;
                      }}
                    >
                      Remove
                    </span>
                  </div>
                )}
              </div>

              {error && (
                <span className="text-sm text-red-500 block mt-4">{error}</span>
              )}
              <div className="mt-4 flex items-center justify-end gap-[12px]">
                <button
                  className="bg-slate-300 text-textColor px-[15px]"
                  type="button"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button className="w-[100px]" onClick={handleSubmit}>
                  {isLoading ? <BtnLoader /> : "Update"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
