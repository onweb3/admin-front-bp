import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { FiDownload, FiMail } from "react-icons/fi";

import axios from "../../axios";
import { PageLoader } from "../../components";
// import { config } from "../../constants";
import { GiConfirmed } from "react-icons/gi";
import QuotationConfirmModal from "../../features/Quotation/QuotationConfirmModal";
import { BiCheck } from "react-icons/bi";

export default function SingleQuotationDetailsPage() {
  const [quotation, setQuotation] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModal, setIsModal] = useState(false);
  const [selectedAmendment, setSelectedAmendment] = useState({});

  const [transfers, setTransfers] = useState([]);

  const { quotationNumber } = useParams();
  const { jwtToken } = useSelector((state) => state.admin);

  const fetchQuotaionDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `/quotations/single/${quotationNumber}`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      setQuotation(data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  }, [jwtToken, quotationNumber]);

  useEffect(() => {
    fetchQuotaionDetails();
  }, [fetchQuotaionDetails]);

  if (isLoading) {
    return <PageLoader />;
  }
  console.log(quotation, "quotation");

  return (
    <div>
      <div className="flex items-start gap-[10px] justify-between p-12">
        <div>
          <h1 className="font-[600] mb-3">Quotation Details</h1>
          <table>
            <tbody className="text-[15px]">
              <tr>
                <td className="pr-[12px] py-1">Quotation Number</td>
                <td className="px-[10px]">:</td>
                <td className="px-[10px]">{quotationNumber}</td>
              </tr>
              <tr>
                <td className="pr-[12px] py-1">Total Amendments</td>
                <td className="px-[10px]">:</td>
                <td className="px-[10px]">{quotation?.amendments?.length}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-5">
        {quotation?.amendments?.map((amendment, index) => {
          return (
            <AmendmentTable
              key={amendment._id}
              amendment={amendment}
              quotation={quotation}
              index={index}
              quotationNumber={quotationNumber}
              setIsModal={setIsModal}
              isModal={isModal}
              setQuotation={setQuotation}
              setSelectedAmendment={setSelectedAmendment}
            />
          );
        })}
      </div>
      {isModal && (
        <QuotationConfirmModal
          key={selectedAmendment._id}
          amendment={selectedAmendment}
          setQuotation={setQuotation}
          setIsModal={setIsModal}
        />
      )}
    </div>
  );
}

const AmendmentTable = ({
  amendment,
  quotation,
  quotationNumber,
  index,
  setIsModal,
  isModal,
  setQuotation,
  setSelectedAmendment,
}) => {
  return (
    <div className="border border-dashed bg-[#f6f6f6] p-5 mb-10">
      <div className="flex justify-between">
        <h3 className="font-[600] text-blue-500 text-base">
          Amendment {quotation?.amendments?.length - index}
          <span className="ml-5 text-green-500">
            ({new Date(amendment?.createdAt).toLocaleDateString()})
          </span>
          {quotation.confirmedAmendment === amendment._id &&
            quotation.status === "confirmed" && (
              <span className="ml-5 text-green-500">{quotation.status}</span>
            )}
        </h3>
        <div className="flex items-center gap-3">
          {index === 0 ? (
            quotation.status !== "confirmed" ? (
              <button
                className="px-3 flex items-center gap-[10px]"
                onClick={() => {
                  setIsModal(true);
                  setSelectedAmendment(amendment);
                }}
              >
                <GiConfirmed /> Confirm Quotation
              </button>
            ) : (
              ""
            )
          ) : (
            ""
          )}

          <Link to={`email/${amendment?._id}`}>
            <button className="px-3 flex items-center gap-[10px]">
              <FiMail /> View Email
            </button>
          </Link>
          <a
            href={import.meta.env.VITE_SERVER_URL + amendment?.pdf}
            target="blank"
          >
            <button className="px-3 flex items-center gap-[10px]">
              <FiDownload /> Download Pdf
            </button>
          </a>
          <a href={import.meta.env.VITE_SERVER_URL + amendment?.sheet} download>
            <button className="flex items-center gap-[10px] px-3">
              <FiDownload />
              Download Sheet
            </button>
          </a>

          <Link to={`/quotations/${quotationNumber}/edit/${amendment?._id}`}>
            <button className="px-3 flex items-center gap-[10px]">Edit</button>
          </Link>
        </div>
      </div>
      <div className="mt-3">
        <table>
          <tbody className="text-[15px]">
            <tr>
              <td className="pr-[12px] py-1">No Of Adults</td>
              <td className="px-[10px]">:</td>
              <td className="px-[10px]">{amendment?.noOfAdults || 0}</td>
            </tr>
            <tr>
              <td className="pr-[12px] py-1">No Of Children</td>
              <td className="px-[10px]">:</td>
              <td className="px-[10px]">{amendment?.noOfChildren || 0}</td>
            </tr>
            <tr>
              <td className="pr-[12px] py-1">Package</td>
              <td className="px-[10px]">:</td>
              <td className="px-[10px]">
                {amendment?.noOfNights}N / {amendment?.noOfNights + 1}D
              </td>
            </tr>
            <tr>
              <td className="pr-[12px] py-1">Check In</td>
              <td className="px-[10px]">:</td>
              <td className="px-[10px]">
                {amendment?.checkOutDate &&
                  new Date(amendment?.checkInDate).toDateString()}
              </td>
            </tr>
            <tr>
              <td className="pr-[12px] py-1">Check Out</td>
              <td className="px-[10px]">:</td>
              <td className="px-[10px]">
                {amendment?.checkOutDate &&
                  new Date(amendment?.checkOutDate).toDateString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="text-[15px] mt-4">
        <h4 className="font-medium text-gray-500 mb-1">Airports</h4>
        <table className="">
          <tbody>
            {amendment.arrivalAirport && (
              <tr>
                <td className="pr-[12px] py-1">Airports From</td>
                <td className="px-[12px]">:</td>
                <td className="px-[12px]">
                  {amendment?.arrivalAirportName} -{" "}
                  {amendment.arrivalTerminalCode}
                </td>
              </tr>
            )}

            {amendment.departureAirport && (
              <tr>
                <td className="pr-[12px] py-1">Airports To</td>
                <td className="px-[12px]">:</td>
                <td className="px-[12px]">
                  {amendment?.departureAirportName} - {""}{" "}
                  {amendment.departureTerminalCode}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {amendment?.hotelQuotation ? (
        !amendment?.hotelQuotation.isAlreadyBooked ? (
          <div>
            {amendment?.hotelQuotation?.stays?.map((stay, index) => {
              return (
                <div className="mt-6">
                  <div className="flex gap-2 items-center mb-2 ">
                    <h2 className="cust-border font-[600]">
                      Stay Option {index + 1}
                    </h2>
                    {stay.selected &&
                      quotation.confirmedAmendment == amendment._id &&
                      quotation.status == "confirmed" && (
                        <div className="flex items-center gap-2">
                          <p>(Confirmed)</p>
                          <div className="text-green-500 text-xl flex items-center">
                            <BiCheck />{" "}
                          </div>
                        </div>
                      )}
                  </div>
                  <table className="w-full text-left">
                    <thead>
                      <tr>
                        <th className="font-[500] text-[15px] border px-[10px] py-[10px]">
                          Checkin Date
                        </th>
                        <th className="font-[500] text-[15px] border px-[10px] py-[10px]">
                          Checkout Date
                        </th>

                        <th className="font-medium text-[15px] border px-[10px]">
                          Name of Hotel
                        </th>
                        <th className="font-medium text-[15px] border px-[10px]">
                          Location
                        </th>
                        {amendment?.hotelQuotation?.stays?.length > 0 &&
                          amendment?.hotelQuotation?.stays[
                            index
                          ]?.roomOccupancyList?.map((roomOccupancy, index) => {
                            return (
                              roomOccupancy?.priceWithTransfer && (
                                <th
                                  key={index}
                                  className="font-medium text-[15px] border px-[10px]"
                                >
                                  {roomOccupancy?.occupancyShortName}
                                </th>
                              )
                            );
                          })}
                      </tr>
                    </thead>
                    <tbody className="text-[15px]">
                      {stay?.hotels?.map((item, multiHotelIndex) => {
                        return (
                          <tr key={multiHotelIndex} className="">
                            <td className="border px-[10px] py-[5px] w-[150px]">
                              {item?.checkInDate
                                ? new Date(item?.checkInDate).toDateString()
                                : "N/A"}
                            </td>
                            <td className="border px-[10px] py-[5px] w-[150px]">
                              {item?.checkOutDate
                                ? new Date(item?.checkOutDate).toDateString()
                                : "N/A"}
                            </td>
                            <td className="border px-[10px] w-[250px]">
                              ({item?.starCategory ? item?.starCategory : "N/A"}{" "}
                              * ) {item?.hotelName || "N/A"} <br />
                              {item?.roomOccupancyName && (
                                <>
                                  <span className="">
                                    * {item?.roomOccupancyName}
                                  </span>
                                  <br />
                                </>
                              )}
                              {/* <span className="block mt-1">
                                                                        *{" "}
                                                                        {item.isBreakfastIncluded
                                                                            ? "Breakfast Included"
                                                                            : "Room Only"}
                                                                    </span> */}
                              {/* <span className="block mt-1">
                                                                        *{" "}
                                                                        {item?.isRefundable
                                                                            ? "Refundable"
                                                                            : "Non Refundable"}
                                                                    </span> */}
                              <span className="block mt-1 capitalize">
                                {item?.roomTypeName} - {item?.boardTypeCode}
                              </span>
                            </td>
                            <td
                              className="border px-[10px] 
                                                                    w-[200px]"
                            >
                              <div className="flex items-center gap-2">
                                <span className="block mt-1">
                                  {item?.area}, {item?.city},{" "}
                                  {item?.country === "united arab emirates"
                                    ? "UAE"
                                    : item?.country}
                                </span>{" "}
                              </div>
                            </td>
                            {multiHotelIndex < 1 &&
                              stay?.roomOccupancyList?.map(
                                (roomOccupancy, index) => {
                                  return (
                                    roomOccupancy?.priceWithTransfer && (
                                      <td
                                        rowSpan={
                                          stay?.hotels?.length > 0
                                            ? stay?.hotels?.length
                                            : 0
                                        }
                                        key={index}
                                        className="border px-[10px]"
                                      >
                                        {roomOccupancy?.priceWithTransfer
                                          ? Math.ceil(
                                              roomOccupancy?.priceWithTransfer
                                            ) +
                                            " " +
                                            amendment?.quotationCurrency
                                          : "N/A"}
                                      </td>
                                    )
                                  );
                                }
                              )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            {" "}
            <div className="mt-5 text-[15px]">
              {amendment?.noOfAdults && (
                <div>
                  Per person Adult price:{" "}
                  {Math.ceil(amendment?.perPersonAdultPrice)}{" "}
                  {amendment?.quotationCurrency}
                </div>
              )}
              {amendment?.noOfChildren ? (
                <div className="mt-1">
                  Per person Child price:{" "}
                  {Math.ceil(amendment?.perPersonChildPrice)}{" "}
                  {amendment?.quotationCurrency}
                </div>
              ) : (
                ""
              )}
            </div>
            {/* <div>
                            {amendment?.hotelQuotation?.stays?.map(
                                (stay, index) => {
                                    return (
                                        <div className="mt-6">
                                            <h2 className="cust-border mb-2 font-[600]">
                                                Stay Option {index + 1}
                                            </h2>
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr>
                                                        <th className="font-[500] text-[15px] border px-[10px] py-[10px]">
                                                            Checkin Date
                                                        </th>
                                                        <th className="font-[500] text-[15px] border px-[10px] py-[10px]">
                                                            Checkout Date
                                                        </th>
                                                        <th className="font-[500] text-[15px] border px-[10px] py-[10px]">
                                                            Star Category
                                                        </th>
                                                        <th className="font-medium text-[15px] border px-[10px]">
                                                            Name of Hotel
                                                        </th>
                                                        <th className="font-medium text-[15px] border px-[10px]">
                                                            Location
                                                        </th>
                                                        {amendment
                                                            ?.hotelQuotation
                                                            ?.stays?.length >
                                                            0 &&
                                                            amendment?.hotelQuotation?.stays[0]?.roomOccupancyList?.map(
                                                                (
                                                                    roomOccupancy,
                                                                    index
                                                                ) => {
                                                                    return (
                                                                        <th
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="font-medium text-[15px] border px-[10px]"
                                                                        >
                                                                            {
                                                                                roomOccupancy?.occupancyShortName
                                                                            }
                                                                        </th>
                                                                    );
                                                                }
                                                            )}
                                                    </tr>
                                                </thead>
                                                <tbody className="text-[15px]">
                                                    {stay?.hotels?.map(
                                                        (
                                                            item,
                                                            multiHotelIndex
                                                        ) => {
                                                            return (
                                                                <tr
                                                                    key={
                                                                        multiHotelIndex
                                                                    }
                                                                    className=""
                                                                >
                                                                    <td className="border px-[10px] py-[5px]">
                                                                        {item?.checkInDate
                                                                            ? new Date(
                                                                                  item?.checkInDate
                                                                              ).toDateString()
                                                                            : "N/A"}
                                                                    </td>
                                                                    <td className="border px-[10px] py-[5px]">
                                                                        {item?.checkOutDate
                                                                            ? new Date(
                                                                                  item?.checkOutDate
                                                                              ).toDateString()
                                                                            : "N/A"}
                                                                    </td>
                                                                    <td className="border px-[10px] py-[5px]">
                                                                        {item?.starCategory
                                                                            ? item?.starCategory
                                                                            : "N/A"}
                                                                    </td>
                                                                    <td className="border px-[10px]">
                                                                        {item?.hotelName ||
                                                                            "N/A"}
                                                                        <br />
                                                                        {item?.roomOccupancyName && (
                                                                            <>
                                                                                <span className="">
                                                                                    *{" "}
                                                                                    {
                                                                                        item?.roomOccupancyName
                                                                                    }
                                                                                </span>
                                                                                <br />
                                                                            </>
                                                                        )}
                                                                        <span className="block mt-1">
                                                                            *{" "}
                                                                            {item.isBreakfastIncluded
                                                                                ? "Breakfast Included"
                                                                                : "Room Only"}
                                                                        </span>
                                                                        <span className="block mt-1">
                                                                            *{" "}
                                                                            {item?.isRefundable
                                                                                ? "Refundable"
                                                                                : "Non Refundable"}
                                                                        </span>
                                                                    </td>
                                                                    <td className="border px-[10px]">
                                                                        {item?.city ||
                                                                            "N/A"}
                                                                    </td>
                                                                    {multiHotelIndex <
                                                                        1 &&
                                                                        stay?.roomOccupancyList?.map(
                                                                            (
                                                                                roomOccupancy,
                                                                                index
                                                                            ) => {
                                                                                return (
                                                                                    <td
                                                                                        rowSpan={
                                                                                            stay
                                                                                                ?.hotels
                                                                                                ?.length >
                                                                                            0
                                                                                                ? stay
                                                                                                      ?.hotels
                                                                                                      ?.length
                                                                                                : 0
                                                                                        }
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                        className="border px-[10px]"
                                                                                    >
                                                                                        {roomOccupancy?.priceWithTransfer
                                                                                            ? roomOccupancy?.priceWithTransfer?.toFixed(
                                                                                                  2
                                                                                              ) +
                                                                                              " " +
                                                                                              amendment?.quotationCurrency
                                                                                            : "N/A"}
                                                                                    </td>
                                                                                );
                                                                            }
                                                                        )}
                                                                </tr>
                                                            );
                                                        }
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    );
                                }
                            )}
                        </div> */}
          </>
        )
      ) : (
        <div className="mt-5 text-[15px]">
          {amendment?.noOfAdults && (
            <div>
              Per person Adult price:{" "}
              {Math.ceil(amendment?.perPersonAdultPrice)}{" "}
              {amendment?.quotationCurrency}
            </div>
          )}
          {amendment?.noOfChildren ? (
            <div className="mt-1">
              Per person Child price:{" "}
              {Math.ceil(amendment?.perPersonChildPrice)}{" "}
              {amendment?.quotationCurrency}
            </div>
          ) : (
            ""
          )}
        </div>
      )}

      {/* <div className="text-[15px] mt-7">
                <h5 className="text-gray-500 font-medium mb-1">Note</h5>
                <ul className="text-[15px] list-disc ml-[16px]">
                    <li>
                        {amendment?.hotelQuotation?.isTourismFeeIncluded ===
                        true
                            ? "Tourism fee included"
                            : "Tourism fee not included"}
                    </li>
                </ul>
            </div> */}

      {amendment?.excursionQuotation && (
        <div className="text-[15px] mt-7">
          <h5 className="text-gray-500 font-medium mb-1">Excursion Quotaion</h5>
          <ul className="text-[15px] list-disc ml-[16px]">
            {amendment?.excursionQuotation?.excursions?.map(
              (excursion, index) => {
                return (
                  <li key={index} className="mb-1">
                    {excursion?.excursionName} -{" "}
                    <span className="capitalize">
                      {excursion?.excursionType.toLowerCase() === "ticket"
                        ? excursion?.transferType.toLowerCase() === "without"
                          ? "Only Ticket"
                          : excursion?.transferType.toLowerCase() === "shared"
                          ? "Tickets With SIC Transfer"
                          : excursion?.transferType.toLowerCase() === "private"
                          ? "Tickets With PVT Transfer"
                          : ""
                        : excursion?.excursionType.toLowerCase() === "transfer"
                        ? excursion?.transferType.toLowerCase() === "private"
                          ? "Only Transfer (Private)"
                          : excursion?.transferType.toLowerCase() === "shared"
                          ? "Only Transfer (SIC)"
                          : ""
                        : ""}
                    </span>
                  </li>
                );
              }
            )}
          </ul>
        </div>
      )}
      {amendment?.guideQuotation && (
        <div className="text-[15px] mt-7">
          <h5 className="text-gray-500 font-medium mb-1">Guide Quotaion</h5>
          <ul className="text-[15px] list-disc ml-[16px]">
            {amendment?.guideQuotation?.guides?.map((guide, index) => {
              return (
                <li key={index} className="mb-1">
                  {guide?.name} -{" "}
                  <span className="capitalize">
                    Duration( {guide?.duration} hr x {guide?.count})
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {amendment?.excSupplementQuotation && (
        <div>
          <h5 className="text-gray-500 font-medium mb-1 mt-7">
            Optional Tours Cost
          </h5>

          <ul className="text-[15px] list-disc ml-[16px]">
            {amendment?.excSupplementQuotation?.excursions?.map(
              (excursion, index) => {
                return (
                  <li
                    key={index}
                    style={{ marginBottom: "2px" }}
                    className="cust-border"
                  >
                    {excursion?.excursionName} -{" "}
                    <span className="capitalize">
                      {excursion?.excursionType.toLowerCase() === "ticket"
                        ? excursion?.value.toLowerCase() === "ticket"
                          ? "Only Ticket"
                          : excursion?.value.toLowerCase() === "shared"
                          ? "Tickets With SIC Transfer"
                          : excursion?.value.toLowerCase() === "private"
                          ? "Tickets With PVT Transfer"
                          : ""
                        : excursion?.excursionType.toLowerCase() === "transfer"
                        ? excursion?.value.toLowerCase() === "private"
                          ? "Only Transfer (Private)"
                          : excursion?.value.toLowerCase() === "shared"
                          ? "Only Transfer (SIC)"
                          : ""
                        : ""}
                    </span>
                    <span>
                      {" "}
                      - (Adult -{" "}
                      {amendment?.quotationCurrency === "AED"
                        ? excursion?.adultPrice
                        : (excursion?.adultPrice / 3.65)?.toFixed(0)}{" "}
                      {amendment?.quotationCurrency}, Child -{" "}
                      {amendment?.quotationCurrency === "AED"
                        ? excursion?.childPrice
                        : (excursion?.childPrice / 3.65)?.toFixed(0)}{" "}
                      {amendment?.quotationCurrency})
                    </span>
                  </li>
                );
              }
            )}
          </ul>
        </div>
      )}

      {amendment?.transferQuotation &&
        amendment?.hotelQuotation &&
        amendment?.transferQuotation?.stayTransfers &&
        amendment?.transferQuotation?.stayTransfers[0].transfers &&
        amendment?.transferQuotation?.stayTransfers[0].transfers[0] && (
          <div className="mt-7 text-[15px]">
            <h5 className="text-gray-500 font-medium mb-1">Transfers</h5>
            <ul className="text-[15px] list-disc ml-[16px]">
              {amendment?.transferQuotation?.stayTransfers?.map(
                (stayTransfer, index) => {
                  return (
                    <li
                      key={index}
                      style={{ marginBottom: "2px" }}
                      className="cust-border"
                    >
                      Stay {stayTransfer?.stayNo}{" "}
                      {stayTransfer?.transfers &&
                      stayTransfer?.transfers?.length > 0
                        ? stayTransfer?.transfers?.map((transfer, index) => {
                            return (
                              <div className="capitalize">
                                {transfer?.transferType === "city-city"
                                  ? `${transfer.transferFromHubName} (${transfer.transferFromName}) - ${transfer.transferToHubName} (${transfer.transferToName})`
                                  : transfer?.transferType === "airport-city"
                                  ? `${transfer.transferFromHubName} (airport) - ${transfer.transferToHubName} (${transfer.transferToName})`
                                  : `${transfer.transferFromHubName} (${transfer.transferFromName}) - ${transfer.transferToHubName} (airport)`}
                              </div>
                            );
                          })
                        : "N/A"}
                    </li>
                  );
                }
              )}
            </ul>
          </div>
        )}

      {amendment?.visa && (
        <div className="mt-7 text-[15px]">
          <h5 className="text-gray-500 font-medium mb-1">Visa</h5>
          <span className="">
            {amendment?.visa?.name} {/* {amendment?.visa?.ppTotalPrice} AED */}
          </span>
          {/* <span className="block mt-1">
                        OTB Price - {amendment?.visa?.otbPrice || 0} AED
                    </span> */}
        </div>
      )}

      {/* <div className="mt-5">
                <span className="text-[15px] text-gray-500 block mt-1">
                    Markup -{" "}
                    <span className="text-[#222] font-medium">
                        {amendment?.markup}
                        {amendment?.markupType === "flat"
                            ? " " + amendment?.quotationCurrency
                            : "%"}
                    </span>
                </span>
            </div> */}
    </div>
  );
};
