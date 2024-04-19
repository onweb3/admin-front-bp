import React, { useState } from "react";
import moment from "moment";
import { MdNoTransfer } from "react-icons/md";
import { FaBus } from "react-icons/fa";
import AttractionOrdersTicketsModal from "./AttractionOrdersTicketsModal";
import { AiFillEye } from "react-icons/ai";
import { FiDownload } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

// import { config } from "../../../constants";
import axios from "../../../axios";

export default function SingleAttrOrderActivitiesTableRow({ orderItem }) {
  const [isTicketsListModalOpen, setIsTicketsListModalOpen] = useState(false);

  const { orderId } = useParams();
  const { jwtToken } = useSelector((state) => state.admin);

  const handleDownloadTickets = async () => {
    try {
      const pdfBuffer = await axios.get(
        `/attractions/orders/${orderId}/orderItems/${orderItem?._id}/tickets`,
        {
          headers: { authorization: `Bearer ${jwtToken}` },
          responseType: "arraybuffer",
        }
      );

      console.log(pdfBuffer, "pdfBuffer");
      const blob = new Blob([pdfBuffer.data], {
        type: "application/pdf",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "tickets.pdf";
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <tr>
      <td className="p-3">
        <div className="flex gap-3">
          <div className="w-[80px] max-h-[50px] rounded overflow-hidden">
            <img
              src={
                import.meta.env.VITE_SERVER_URL +
                orderItem?.attraction?.images[0]
              }
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-[500] block mt-1">
              {orderItem?.activity?.name}{" "}
              <span className="capitalize">({orderItem?.bookingType})</span>
            </span>
            <span className="block mt-1">{orderItem?.attraction?.title}</span>
          </div>
        </div>
      </td>
      <td className="p-3">{moment(orderItem?.date).format("MMM D, YYYY")}</td>
      <td className="p-3">
        {orderItem?.adultsCount} ADT, {orderItem?.childrenCount} CHD,{" "}
        {orderItem?.infantCount} INF
      </td>
      <td className="p-3">
        {orderItem?.transferType === "without" ? (
          <span className="flex items-center gap-[7px] mt-2 capitalize">
            <MdNoTransfer /> {orderItem?.transferType} Transfer
          </span>
        ) : (
          <div>
            <span className="flex items-center gap-[7px] mt-2 capitalize">
              <FaBus /> {orderItem?.transferType} Transfer
            </span>
            <div>
              {orderItem?.transferType === "private" &&
                orderItem?.privateTransfers?.map((transfer, index) => {
                  return (
                    <span key={index} className="block mt-[6px]">
                      {transfer?.name} x {transfer?.count}
                    </span>
                  );
                })}
            </div>
          </div>
        )}
      </td>
      <td className="p-3">
        {orderItem?.bookingType === "booking" ? (
          <div className="flex items-center gap-2">
            <span className="bg-[#f3f6f9] py-1 px-2 text-sm rounded">
              {orderItem?.bookingConfirmationNumber || "N/A"}
            </span>
            <button
              className="h-auto bg-transparent text-[#333] text-lg"
              onClick={handleDownloadTickets}
            >
              <FiDownload />
            </button>
          </div>
        ) : orderItem?.bookingType === "ticket" ? (
          <div className="flex items-center gap-2">
            <button
              className="h-auto bg-transparent text-[#333] text-lg"
              onClick={() => setIsTicketsListModalOpen(true)}
            >
              <AiFillEye />
            </button>
            <button
              className="h-auto bg-transparent text-[#333] text-lg"
              onClick={handleDownloadTickets}
            >
              <FiDownload />
            </button>
          </div>
        ) : (
          "N/A"
        )}
        {isTicketsListModalOpen === true && (
          <AttractionOrdersTicketsModal
            setIsTicketsListModalOpen={setIsTicketsListModalOpen}
            adultTickets={orderItem?.adultTickets}
            childTickets={orderItem?.childTickets}
            infantTickets={orderItem?.infantTickets}
          />
        )}
      </td>
      <td className="p-3">{orderItem?.grandTotal} AED</td>
      <td className="p-3">
        <span
          className={
            "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
            (orderItem?.status === "cancelled"
              ? "bg-[#f065481A] text-[#f06548]"
              : orderItem?.status === "confirmed"
              ? "text-[#0ab39c] bg-[#0ab39c1A]"
              : "bg-[#f7b84b1A] text-[#f7b84b]")
          }
        >
          {orderItem?.status}
        </span>
      </td>
    </tr>
  );
}
