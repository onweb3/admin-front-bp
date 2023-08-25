
import React, { useEffect, useRef, useState } from "react";
import { useHandleClickOutside } from "../../../hooks";
import { MdClose } from "react-icons/md";
import axios from "../../../axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { BtnLoader } from "../../../components";

function StatusModal({ setCancelModal ,travellerId,  setStatus, visaId}) {
  const wrapperRef = useRef();
    
     const { orderedBy } = useParams();

    const [reason, setReason] = useState("");
    const [isStatusLoading, setIsStatusLoading] = useState(false);


   

    const { jwtToken } = useSelector((state) => state.admin);

    
      const handleChange = (event) => {
        setReason(event.target.value);
      };

  
    const onSubmit= async(e)=>{

      try{
        e.preventDefault();

        setIsStatusLoading(true);
            await axios.patch(
                `/visa/application/${visaId}/reject/${travellerId}`,
                { reason: reason , orderedBy : orderedBy} ,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setStatus("rejected")


            setCancelModal(false)
            setIsStatusLoading(false);

      }catch(err){

        console.log(err)

      }
    }

    

    useHandleClickOutside(wrapperRef, () => setCancelModal(false));
  return (
    <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
    <div
      ref={wrapperRef}
      className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="font-medium mb-2">
          Send Reason
        </h2>
        <button
          className="h-auto bg-transparent text-textColor text-xl"
          onClick={() =>
            setCancelModal(false)
          }
        >
          <MdClose />
        </button>
      </div>
      <div className="p-4">
        <form action="" >
          <div>
            <label htmlFor="">Decline Reason</label>
            <textarea
              type="text"
              placeholder="...."
              name="reason"
            value={reason || ""}
            onChange={handleChange}
            // required
            />
          </div>
         
          {/* {error && (
                          <span className="text-sm block text-red-500 mt-2">
                              {error}
                          </span>
                      )} */}
          <div className="mt-4 flex items-center justify-end gap-[12px]">
            <button
              className="bg-slate-300 text-textColor px-[15px]"
              type="button"
              onClick={() =>
                setCancelModal(false)
              }
            >
              Cancel
            </button>
            <button className="w-[140px]"
            onClick={onSubmit}
            >
          {isStatusLoading ? <BtnLoader /> : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  )
}

export default StatusModal