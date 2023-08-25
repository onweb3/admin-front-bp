import React, { useState } from 'react'
import { BiEditAlt } from 'react-icons/bi'
import { MdDelete } from 'react-icons/md'
import { Link } from 'react-router-dom'
import StatusModal from './StatusModal'

function VisaRequestSingleRow() {
    const [status, setStatus] = useState('')
    const [modal, setModal] = useState(false)
    return (
        <>
            <tr className="border-b border-tableBorderColor">
                <td className="p-3">#123</td>
                <td className="p-3 capitalize">Sam Philipie</td>
                <td className="p-3 capitalize">30 Days of Dubai</td>
                <td className="p-3 capitalize">United Arab Emirates</td>
                <td className="p-3 capitalize">122 AED</td>
                <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    {/* {isStatusLoading ? (
                    <div>
                        <div className="w-[25px] h-[25px] rounded-full border-4 border-primaryColor border-r-transparent animate-spin"></div>
                    </div>
                ) : status === "pending" ? (
                    <div className="flex items-center gap-[10px]">
                        <button
                            className="h-[35px] w-[35px] bg-green-500 flex items-center justify-center text-xl"
                            onClick={() => handleStatusChange("ok")}
                        >
                            <FiCheck />
                        </button>
                        <button
                            className="h-[35px] w-[35px] bg-red-500 flex items-center justify-center text-xl"
                            onClick={() => handleStatusChange("cancelled")}
                        >
                            <MdClose />
                        </button>
                    </div>
                ) : status === "cancelled" ? (
                    <div>
                        <span className="py-1 px-2 text-[12px] font-medium rounded text-[#f06548] bg-[#f065481a]">Cancelled</span>
                    </div>
                ) : ( */}
                    <div className="max-w-[120px]">
                        <select
                            name=""
                            id=""
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value)
                                e.target.value === "reject" ? setModal(true) : setModal(false)
                            }}
                        >
                            <option value="approve">Approve</option>
                            <option value="reject">Reject</option>
                        </select>
                    </div>
                    {/* )} */}
                </td>
            </tr>
            {modal && status === "reject" && (
                <StatusModal setModal={setModal} />
            )}
        </>
    )
}

export default VisaRequestSingleRow