import React from "react";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import { isPdfValid } from "../../../utils";

export default function ContractFileForm({
    selectedSection,
    newFiles,
    setNewFiles,
}) {
    const { files } = useSelector((state) => state.hotelContractForm);
    const dispatch = useDispatch();

    const handleFileChange = (e) => {
        for (let i = 0; i < e.target?.files?.length; i++) {
            if (isPdfValid(e.target.files[i])) {
                setNewFiles([...newFiles, e.target.files[i]]);
            } else {
                alert("Upload pdf files only");
            }
        }
    };

    const removeNewFile = (index) => {
        const filteredFiles = newFiles?.filter((_, ind) => {
            return ind !== index;
        });
        setNewFiles(filteredFiles);
    };

    return (
        <div className="">
            <div className="mt-4">
                <label htmlFor="">File</label>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                />
            </div>

            <div className="flex flex-wrap items-center gap-[1.5em] mt-5">
                {newFiles.map((file, index) => {
                    return (
                        <div
                            className="relative group w-[130px] aspect-video rounded overflow-hidden cursor-pointer"
                            key={index}
                            onClick={() => removeNewFile(index)}
                        >
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                PDF
                            </div>
                            <div className="hidden group-hover:flex absolute inset-0 bg-[#0005] text-xl items-center justify-center cursor-pointer text-red-500">
                                <MdDelete />
                            </div>
                        </div>
                    );
                })}
                {files?.map((file, index) => {
                    return (
                        <div
                            className="relative group w-[130px] aspect-video rounded overflow-hidden cursor-pointer"
                            key={index}
                            // onClick={() => dispatch(removeFile(index))}
                        >
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                PDF
                            </div>
                            <div className="hidden group-hover:flex absolute inset-0 bg-[#0005] text-xl items-center justify-center cursor-pointer text-red-500">
                                <MdDelete />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
