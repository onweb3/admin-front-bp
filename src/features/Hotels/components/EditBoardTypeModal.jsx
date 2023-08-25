import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { BtnLoader } from "../../../components";
import { useHandleClickOutside } from "../../../hooks";
import axios from "../../../axios";

export default function EditBoardTypeModal({
    setIsAddBoardTypeModal,
    selectedBoardType,
    boardTypes,
    setBoardTypes,
}) {
    const [data, setData] = useState({
        boardName: selectedBoardType?.boardName || "",
        boardShortName: selectedBoardType?.boardShortName || "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setIsAddBoardTypeModal(false));

    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleCheckBoxChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.checked };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const response = await axios.patch(
                `/hotels/board-types/update/${selectedBoardType?._id}`,
                { ...data, hotelId: id },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            const tempBoardTypes = boardTypes;
            const objIndex = boardTypes?.findIndex((item) => {
                return item?._id === response?.data?._id;
            });
            tempBoardTypes[objIndex] = response.data;
            setBoardTypes(tempBoardTypes);

            setIsLoading(false);
            setIsAddBoardTypeModal(false);
        } catch (err) {
            console.log(err, "errmessage");
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium">Edit Board</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsAddBoardTypeModal(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Board Name *</label>
                            <input
                                type="text"
                                name="boardName"
                                value={data.boardName || ""}
                                onChange={handleChange}
                                required
                                placeholder="Ex: Half Board"
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Board Short Name *</label>
                            <input
                                type="text"
                                name="boardShortName"
                                value={data.boardShortName || ""}
                                onChange={handleChange}
                                required
                                placeholder="Ex: HB"
                            />
                        </div>
                        {/* <div className="flex items-center justify-start mt-4 gap-3">
                            <input
                                type="checkbox"
                                name="isRoomOnly"
                                checked={data?.isRoomOnly}
                                onChange={handleCheckBoxChange}
                                className="w-[17px] h-[17px]"
                                id="isRoomOnly"
                            />
                            <label htmlFor="isRoomOnly" className="mb-0">
                                Is Room Only
                            </label>
                        </div> */}

                        {error && (
                            <span className="block mt-2 text-sm text-red-500">
                                {error}
                            </span>
                        )}
                        <div className="flex items-center justify-end mt-5">
                            <button className="w-[140px]">
                                {isLoading ? <BtnLoader /> : "Update"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
