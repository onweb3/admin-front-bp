import React, { useRef } from "react";
import { MdClose } from "react-icons/md";

import { useHandleClickOutside } from "../../../hooks";

export default function AttractionOrdersTicketsModal({
    setIsTicketsListModalOpen,
    adultTickets = [],
    childTickets = [],
    infantTickets = [],
}) {
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setIsTicketsListModalOpen(false));

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[800px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium text-base">Purchased Tickets</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsTicketsListModalOpen(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    {adultTickets?.length < 1 && childTickets?.length < 1 && infantTickets?.length < 1 && (
                        <span className="text-center block font-medium text-grayColor">
                            No Tickets Found!
                        </span>
                    )}

                    {adultTickets?.length > 0 && (
                        <>
                            <h4 className="font-medium mb-2 mt-4 first:mt-0">Adult Tickets</h4>
                            <div className="flex flex-wrap items-center gap-[10px]">
                                {adultTickets?.map((ticket, index) => {
                                    return (
                                        <span
                                            key={index}
                                            className="bg-[#f3f6f9] py-1 px-2 text-sm rounded"
                                            onMouseDown={() =>
                                                handleMouseDownOnTicketNumber({
                                                    ticketNo: ticket?.ticketNo,
                                                    loggedFrom: "orders-list",
                                                })
                                            }
                                        >
                                            {ticket?.ticketNo}
                                        </span>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {childTickets?.length > 0 && (
                        <>
                            <h4 className="font-medium mb-2 mt-4 first:mt-0">Child Tickets</h4>
                            <div className="flex flex-wrap items-center gap-[10px]">
                                {childTickets?.map((ticket, index) => {
                                    return (
                                        <span
                                            key={index}
                                            className="bg-[#f3f6f9] py-1 px-2 text-sm rounded"
                                            onMouseDown={() =>
                                                handleMouseDownOnTicketNumber({
                                                    ticketNo: ticket?.ticketNo,
                                                    loggedFrom: "orders-list",
                                                })
                                            }
                                        >
                                            {ticket?.ticketNo}
                                        </span>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {infantTickets?.length > 0 && (
                        <>
                            <h4 className="font-medium mb-2 mt-4 first:mt-0">Infant Tickets</h4>
                            <div className="flex flex-wrap items-center gap-[10px]">
                                {infantTickets?.map((ticket, index) => {
                                    return (
                                        <span
                                            key={index}
                                            className="bg-[#f3f6f9] py-1 px-2 text-sm rounded"
                                            onMouseDown={() =>
                                                handleMouseDownOnTicketNumber({
                                                    ticketNo: ticket?.ticketNo,
                                                    loggedFrom: "orders-list",
                                                })
                                            }
                                        >
                                            {ticket?.ticketNo}
                                        </span>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
