import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { Link } from "react-router-dom";
import HotelBannerAdModal from "../../features/HotelBannerAd/components/HotelBannerAdModal";
// import { config } from "../../constants";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";

export default function HotelBannerAdsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [bannerAds, setBannerAds] = useState([]);
  const [filters, setFilters] = useState({
    skip: 0,
    limit: 10,
    hotelName: "",
    totalBannerAds: 0,
  });
  const [hotelBannerModal, setHotelBannerModal] = useState({
    isOpen: false,
    isEdit: false,
  });
  const [selectedHotelBannerAd, setSelectedHotelBannerAd] = useState({});

  const { jwtToken } = useSelector((state) => state.admin);

  const addHotelBannerAd = (newBannerAd) => {
    setBannerAds((prev) => {
      return [newBannerAd, ...prev];
    });
  };

  const updateHotelBannerAd = (updatedBannerAd) => {
    const objIndex = bannerAds.findIndex((item) => {
      return item?._id === updatedBannerAd?._id;
    });

    let temp = bannerAds;
    temp[objIndex] = updatedBannerAd;
  };

  const deleteHotelBannerAd = async (id) => {
    try {
      const isConfirm = window.confirm("Are you sure to delete?");
      if (isConfirm) {
        await axios.delete(`/hotels/banner-ads/delete/${id}`, {
          headers: { authorization: `Bearer ${jwtToken}` },
        });

        const filteredHotelBannerAds = bannerAds?.filter(
          (item) => item._id !== id
        );
        setBannerAds(filteredHotelBannerAds);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchHotelBannerAds = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/hotels/banner-ads/all?skip=${filters.skip}&limit=${filters.limit}&hotelName=${filters.hotelName}`,
        {
          headers: { authorization: `Bearer ${jwtToken}` },
        }
      );

      setBannerAds(response?.data?.hotelBannerAds?.data);
      setFilters((prev) => {
        return {
          ...prev,
          totalBannerAds: response?.data?.hotelBannerAds?.totalBannerAds,
        };
      });
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchHotelBannerAds();
  }, []);

  return (
    <div>
      <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
        <h1 className="font-[600] text-[15px] uppercase">Hotel Banner Ads</h1>
        <div className="text-sm text-grayColor">
          <Link to="/" className="text-textColor">
            Dashboard{" "}
          </Link>
          <span>{">"} </span>
          <Link to="/hotels" className="text-textColor">
            Hotels{" "}
          </Link>
          <span>{">"} </span>
          <span>Banner Ads</span>
        </div>
      </div>

      {hotelBannerModal?.isOpen && (
        <HotelBannerAdModal
          hotelBannerModal={hotelBannerModal}
          setHotelBannerModal={setHotelBannerModal}
          selectedHotelBannerAd={selectedHotelBannerAd}
          addHotelBannerAd={addHotelBannerAd}
          updateHotelBannerAd={updateHotelBannerAd}
        />
      )}

      {isLoading ? (
        <PageLoader />
      ) : (
        <div className="p-6">
          <div className="bg-white rounded shadow-sm">
            <div className="flex items-center justify-between border-b border-dashed p-4">
              <h1 className="font-medium">All Hotel Banner Ads</h1>
              <button
                className="px-3"
                onClick={() => {
                  setHotelBannerModal({
                    isOpen: true,
                    isEdit: false,
                  });
                }}
              >
                + Add Banner
              </button>
            </div>
            {bannerAds?.length < 1 ? (
              <div className="p-6 flex flex-col items-center">
                <span className="text-sm text-grayColor block mt-[6px]">
                  Oops.. No Hotel Banner Ads Found
                </span>
              </div>
            ) : (
              <div>
                <table className="w-full">
                  <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                    <tr>
                      <th className="font-[500] p-3">Hotel</th>
                      <th className="font-[500] p-3">Banner</th>
                      <th className="font-[500] p-3">Priority</th>
                      <th className="font-[500] p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {bannerAds?.map((item, index) => {
                      return (
                        <tr
                          key={index}
                          className="border-b border-tableBorderColor"
                        >
                          <td className="p-3">
                            <div>
                              <span>{item?.hotel?.hotelName}</span>
                              <span className="block text-grayColor text-[12px]">
                                {item?.hotel?.address}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <img
                              src={
                                import.meta.env.VITE_SERVER_URL +
                                item?.bannerImage
                              }
                              alt=""
                              className="w-[140px]"
                            />
                          </td>
                          <td className="p-3">{item?.priority || 0}</td>
                          <td className="p-3">
                            <div className="flex gap-[10px]">
                              <button
                                className="h-auto bg-transparent text-red-500 text-xl"
                                onClick={() => deleteHotelBannerAd(item?._id)}
                              >
                                <MdDelete />
                              </button>
                              <button
                                className="h-auto bg-transparent text-green-500 text-xl"
                                onClick={() => {
                                  setSelectedHotelBannerAd(item);
                                  setHotelBannerModal({
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
                    total={filters?.totalBannerAds}
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
