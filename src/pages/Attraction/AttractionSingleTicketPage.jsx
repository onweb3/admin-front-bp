import React, { useEffect, useState } from "react";
import Barcode from "react-barcode";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import QRCode from "react-qr-code";

import axios from "../../axios";
import { formatDate } from "../../utils";
import { PageLoader } from "../../components";
import { config } from "../../constants";

function AttractionSingleTicketPage() {
    const [ticket, setTicket] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const { ticketId } = useParams();
    const { jwtToken } = useSelector((state) => state.admin);

    const fetchSingleTicket = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(`/attractions/tickets/single/${ticketId}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setTicket(response.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchSingleTicket();
    }, []);

    return isLoading ? (
        <PageLoader />
    ) : (
        <div className="min-w-screen min-h-screen bg-white">
            <main className="w-[700px] mx-auto">
                <div className="primary__section">
                    <div className="flex justify-between pt-7">
                        <div className="h-[100px]">
                            <img
                                src={config.SERVER_URL + ticket?.activity?.attraction?.logo}
                                alt="qr"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="">
                            <Barcode
                                value={ticket?.ticketNo}
                                width={2}
                                height={40}
                                textMargin={0}
                                fontSize={14}
                            />
                        </div>
                    </div>
                </div>
                <div className="secondary__section">
                    <div className="bg-[#e3f2fd] rounded-2xl mt-4 border-2 border-[#a3c4dc] grid grid-cols-12 items-center">
                        <div className="col-span-7 border-r-2 border-dashed border-[#a3c4dc] p-4">
                            <div className=" border-b border-dashed border-[#a3c4dc] ">
                                <h1 className="text-[14px] py-2 font-[600]">
                                    Tour Name : {ticket?.activity?.name}
                                </h1>
                            </div>
                            <div className="grid grid-cols-2 text-[10px] mt-4">
                                <div className="grid grid-cols-2 gap-x-1 gap-y-2">
                                    <div className="">Ticket Type:</div>
                                    <div className="capitalize">{ticket?.ticketFor}</div>
                                    <div className="">Destination:</div>
                                    <div className="capitalize">
                                        {ticket?.activity?.attraction?.destination?.name}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-x-1 gap-y-2">
                                    <div className="">Validity Till:</div>
                                    <div className="">
                                        {ticket?.validity ? formatDate(ticket?.validTill) : "N/A"}
                                    </div>
                                    <div className="">Number:</div>
                                    <div className="">{ticket?.lotNo}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-5 py-10 relative">
                            <div className="h-5 w-5 rounded-full bg-white absolute -top-3 -left-[10px]"></div>
                            <div className="h-5 w-5 rounded-full bg-white absolute -bottom-3 -left-[10px]"></div>
                            <div className="w-full h-full flex justify-center items-center">
                                <div className="">
                                    <div className="flex justify-center">
                                        <div className="h-[70px] w-[70px]">
                                            <QRCode
                                                size={256}
                                                style={{
                                                    height: "auto",
                                                    maxWidth: "100%",
                                                    width: "100%",
                                                }}
                                                value={ticket?.ticketNo}
                                                viewBox={`0 0 256 256`}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-center mt-2">{ticket?.ticketNo}</p>
                                    <p className="text-[9px] text-center">Place Image against the scanner</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="last__section">
                    <div className="grid grid-cols-3 rounded-2xl overflow-hidden mt-7 h-[200px]">
                        {ticket?.activity?.attraction?.images?.slice(0, 3)?.map((img, index) => {
                            return (
                                <div className="h-[100%]" key={index}>
                                    <img
                                        src={config.SERVER_URL + img}
                                        alt="qr"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-7 text-[12px] leading-[22px]">
                    <div
                        dangerouslySetInnerHTML={{
                            __html: ticket?.activity?.description,
                        }}
                        id="ticket-description"
                    ></div>
                </div>
            </main>
        </div>
    );
}

export default AttractionSingleTicketPage;
