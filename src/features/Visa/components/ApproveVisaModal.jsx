import React, { useEffect, useRef, useState } from "react";
import { useHandleClickOutside } from "../../../hooks";
import { MdClose } from "react-icons/md";
import axios from "../../../axios";
import { useSelector } from "react-redux";
import { BtnLoader } from "../../../components";
import { useParams } from "react-router-dom";



function ApproveVisaModal({setStatus ,setApproveModal , travellerId , visaId }) {
    const wrapperRef = useRef();
    
    const { orderedBy } = useParams();
    const[files ,setFiles] = useState("")
    const [pdfFile, setPdfFile] = useState(null);
    const [isStatusLoading, setIsStatusLoading] = useState(false);


    const handleChange = (event) => {
       setFiles(URL.createObjectURL(event.target.files[0]));
      setPdfFile(event.target.files[0]);
    };

    const { jwtToken } = useSelector((state) => state.admin);


    const onSubmit= async()=>{

      try{

        const formData = new FormData()
        formData.append('orderedBy' , orderedBy)
        formData.append('pdfFile', pdfFile);
        


        setIsStatusLoading(true);
            await axios.patch(
                `/visa/application/${visaId}/approve/${travellerId}`,
                formData,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setStatus("approved")


            setApproveModal(false)
            setIsStatusLoading(false);

      }catch(err){

        console.log(err)

      }
    }
    

    useHandleClickOutside(wrapperRef, () => setApproveModal(false));

  return (
    <div
    className={
      "fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 " 
    }
  >
    <div
      ref={wrapperRef}
      className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
    >
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="font-medium mb-2">Upload Visa</h2>
        <button
          className="h-auto bg-transparent text-textColor text-xl"
          onClick={() => setApproveModal(false)}
        >
          <MdClose />
        </button>
      </div>
      <div className="p-4">
        <div>
          <label htmlFor="">Visa</label>
          <input type="file" accept="application/pdf" onChange={handleChange} />
               {files && <embed src={files} type="application/pdf" />}
        </div>
        <div className="mt-2">
            <p className="text-gray-400 text-[13px]">Upload the file with extension Pdf only</p>
        </div>

        <div className="flex items-center justify-end mt-6">
          <button
            className="px-3"

            onClick={onSubmit}
          > 
          {isStatusLoading ? <BtnLoader /> : "Upload"}

            
          </button>
        </div>
      </div>
    </div>
  </div>
  )
}

export default ApproveVisaModal