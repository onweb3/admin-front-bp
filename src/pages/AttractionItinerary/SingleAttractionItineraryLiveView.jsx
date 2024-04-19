import React from "react";
import { RxCrossCircled } from "react-icons/rx";
// import { config } from "../../constants";

const SingleAttractionItineraryLiveView = ({
  data,
  handleDeleteImage,
  initialData,
}) => {
  const getAttraction = (id) => {
    return initialData.attractions?.filter((ele) => {
      return ele?._id === id;
    })[0];
  };
  // const getActivity = (id) => {
  //     return initialData.activities?.filter((ele) => {
  //         return ele?._id === id;
  //     })[0];
  // };

  return (
    <div className="">
      <h2 className="bg-gray-400 text-white font-medium py-1 text-center">
        Live View
      </h2>
      <div className="w-[100%] mx-auto mt-2 pb-2 shadow-md">
        <div className="flex items-start justify-between border-b border-dashed mb-4 pb-4">
          <div>
            <h1 className="font-bold text-2xl">{data?.queryDetails}</h1>
            <span className="text-sm text-grayColor">
              Reference No - {data?.referenceNo}
            </span>
          </div>

          <div className="text-right">
            <span className="block font-medium text-base">
              {data?.agentName}
            </span>
            <span className="block text-sm text-grayColor mt-[3px]">
              {data?.agentEmail}
            </span>
            <span className="block text-sm text-grayColor mt-[3px]">
              {data?.agentMobileNumber || ""}
            </span>
          </div>
        </div>
        <div>
          {data?.itineraries?.map((singleItenerary, itineraryIndex) => {
            return (
              <div key={itineraryIndex} className="mb-5 last:mb-0">
                <h1 className="font-[700] text-lg">Day {itineraryIndex + 1}</h1>
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
                                  <span
                                    className="absolute top-1 right-1 text-red-500 cursor-pointer"
                                    onClick={() => {
                                      handleDeleteImage(
                                        itineraryIndex,
                                        itemIndex,
                                        index
                                      );
                                    }}
                                  >
                                    <RxCrossCircled />
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    );

                  const attraction = getAttraction(item?.attraction);
                  return (
                    <div key={itemIndex} className="mb-4 last:mb-0">
                      <h1 className="font-medium flex flex-col gap-2">
                        <span className="">{attraction?.title}</span>
                        <span>
                          {item?.itineraryTitle
                            ? item?.itineraryTitle + " "
                            : " "}
                        </span>
                      </h1>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: attraction?.itineraryDescription || "",
                        }}
                        className="text-[15px] text-[#222] leading-[28px] mt-1"
                      ></div>
                      <div className="mt-3">
                        <span className="font-medium">{item?.note}</span>
                      </div>
                      <div className="grid grid-cols-3 mt-4">
                        {attraction?.images?.slice(0, 3)?.map((img, index) => {
                          return (
                            <>
                              <img
                                src={import.meta.env.VITE_SERVER_URL + img}
                                alt=""
                                className="w-full h-[200px] object-cover"
                                key={index}
                              />
                            </>
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
    </div>
  );
};

export default SingleAttractionItineraryLiveView;
