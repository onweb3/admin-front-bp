import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import axios from "../../axios";
import { PageLoader } from "../../components";
// import { config } from "../../constants";

export default function SingleAttractionItineraryPage() {
  const [itinerary, setItinerary] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();
  const { jwtToken } = useSelector((state) => state.admin);

  const fetchItinerary = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/attractions/itineraries/single/${id}`,
        {
          headers: { authorization: `Bearer ${jwtToken}` },
        }
      );
      console.log(response.data);
      setItinerary(response.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchItinerary();
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = "#fff";

    return () => {
      document.body.style.backgroundColor = "#f3f3f9";
    };
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="w-[21cm] mx-auto">
      <div className="flex items-start justify-between border-b border-dashed mb-4 pb-4">
        <div>
          <h1 className="font-bold text-2xl">{itinerary?.queryDetails}</h1>
          <span className="text-sm text-grayColor">
            Reference No - {itinerary?.referenceNo}
          </span>
        </div>

        <div className="text-right">
          <span className="block font-medium text-base">
            {itinerary?.agentName}
          </span>
          <span className="block text-sm text-grayColor mt-[3px]">
            {itinerary?.agentEmail}
          </span>
          <span className="block text-sm text-grayColor mt-[3px]">
            {itinerary?.agentMobileNumber || ""}
          </span>
        </div>
      </div>
      <div>
        {itinerary?.itineraries?.map((singleItenerary, index) => {
          return (
            <div key={index} className="mb-5 last:mb-0">
              <h1 className="font-[700] text-lg">Day {index + 1}</h1>
              {singleItenerary?.items?.map((item, itemIndex) => {
                if (item?.isCustom)
                  return (
                    <>
                      <div key={itemIndex} className="mb-4 last:mb-0">
                        <h1 className="font-medium flex flex-col gap-2">
                          <span className="">{item?.attractionTitle}</span>
                          <span>
                            {item?.itineraryTitle
                              ? item?.itineraryTitle + " "
                              : " "}
                          </span>
                        </h1>

                        <div
                          dangerouslySetInnerHTML={{
                            __html: item?.description,
                          }}
                          className="text-[15px] text-[#222] leading-[28px] mt-1"
                        ></div>
                        <div className="mt-3">
                          <span className="font-medium">{item?.note}</span>
                        </div>
                        <div className="grid grid-cols-3 mt-4">
                          {item?.images?.map((img, index) => {
                            const url = import.meta.env.VITE_SERVER_URL + img;

                            return (
                              <div className="relative">
                                <img
                                  src={url}
                                  alt=""
                                  className="w-full h-[200px] object-cover"
                                  key={index}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  );
                return (
                  <div key={itemIndex} className="mb-4 last:mb-0">
                    <h1 className="font-medium flex flex-col gap-2">
                      <span className="">{item?.attraction?.title}</span>
                      <span>
                        {item?.itineraryTitle
                          ? item?.itineraryTitle + " "
                          : " "}
                      </span>
                    </h1>
                    {/* <h1 className="font-medium">
                                            {item?.itineraryTitle
                                                ? item?.itineraryTitle + " - "
                                                : ""}
                                            {item?.attraction?.title}
                                        </h1> */}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item?.attraction?.itineraryDescription,
                      }}
                      className="text-[15px] text-[#222] leading-[28px] mt-1"
                    ></div>
                    <div className="mt-3">
                      <span className="font-medium">{item?.note}</span>
                    </div>
                    <div className="grid grid-cols-3 mt-4">
                      {item?.attraction?.images
                        ?.slice(0, 3)
                        ?.map((img, index) => {
                          return (
                            <img
                              src={import.meta.env.VITE_SERVER_URL + img}
                              alt=""
                              className="w-full h-[200px] object-cover"
                              key={index}
                            />
                          );
                        })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
