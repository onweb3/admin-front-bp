import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import { useHandleClickOutside } from "../../../hooks";
import axios from "../../../axios";
import { BtnLoader, PageLoader, SelectDropdown } from "../../../components";

export default function WhatsappAddModal({
    setIsModal,
    isModal,
    setWhatsappLists,
    whatsappLists,
}) {
    const [data, setData] = useState({
        name: whatsappLists[0].name || "",
        phoneNumber: whatsappLists[0].phoneNumber || "",
        phoneCode: whatsappLists[0].phoneCode || "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [qrLoading, setQrLoading] = useState(false);
    const { countries } = useSelector((state) => state.general);
    const [qrCode, setQrCode] = useState("");
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setIsModal(false));
    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setError("");
            setIsLoading(true);

            const response = await axios.post(
                "/whatsapp-service/add",
                { ...data },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setQrCode(response.data.qrCode);
            setIsLoading(false);
            // setIsModal(false);
        } catch (err) {
            console.log(err);
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const reloadQrCode = async (e) => {
        try {
            e.preventDefault();
            setError("");
            setQrLoading(true);

            const response = await axios.get("/whatsapp-service/reload", {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setQrCode(response.data);
            setQrLoading(false);
            // setIsModal(false);
        } catch (err) {
            console.log(err);
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setQrLoading(false);
        }
    };

    const verifyQrCode = async (e) => {
        try {
            e.preventDefault();
            setError("");
            setIsLoading(true);

            const response = await axios.get("/whatsapp-service/confirm", {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            setWhatsappLists([response.data]);
            setIsModal(false);
            setIsLoading(false);
            // setIsModal(false);
        } catch (err) {
            console.log(err);
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
                    <h2 className="font-medium mb-2">Add Config</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsModal(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                {qrCode ? (
                    <div className="p-4">
                        {" "}
                        <div className="flex flex-col items-center justify-center ">
                            {qrLoading ? (
                                <PageLoader />
                            ) : (
                                <>
                                    <div className="px-5">
                                        <h3>Note</h3>
                                        <ul className="list-disc">
                                            {" "}
                                            <li>
                                                If the link expires, please
                                                reload the image.
                                            </li>
                                            <li>
                                                If WhatsApp is connected on your
                                                device, click on confirm.
                                            </li>
                                        </ul>
                                    </div>
                                    <img src={qrCode} />
                                </>
                            )}
                        </div>
                        {error && (
                            <span className="text-sm block text-red-500 mt-2">
                                {error}
                            </span>
                        )}
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={reloadQrCode}
                            >
                                reload
                            </button>
                            {isLoading ? (
                                <button className="w-[160px]">
                                    <BtnLoader />
                                </button>
                            ) : (
                                <button
                                    className="w-[160px]"
                                    onClick={verifyQrCode}
                                >
                                    Confirm
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="p-4">
                        <form action="" onSubmit={handleSubmit}>
                            <div className="mt-4">
                                <label htmlFor="">Name </label>
                                <input
                                    type="text"
                                    value={data?.name || ""}
                                    name="name"
                                    onChange={handleChange}
                                    placeholder="Enter name"
                                    required
                                />
                            </div>
                            <div className="mt-4">
                                <div className="mt-4">
                                    <SelectDropdown
                                        data={countries}
                                        valueName={"phonecode"}
                                        displayName={"phonecode"}
                                        placeholder="Select phonecode"
                                        selectedData={data.phoneCode || ""}
                                        setSelectedData={(val) => {
                                            setData((prevData) => ({
                                                ...prevData,
                                                ["phoneCode"]: val,
                                            }));
                                        }}
                                        // bracketValue={"chainCode"}
                                        // disabled={!isEditPermission}
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label htmlFor="">Phone Number </label>
                                <input
                                    type="number"
                                    value={data?.phoneNumber || ""}
                                    name="phoneNumber"
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    required
                                />
                            </div>
                            {error && (
                                <span className="text-sm block text-red-500 mt-2">
                                    {error}
                                </span>
                            )}

                            <div className="mt-4 flex items-center justify-end gap-[12px]">
                                <button
                                    className="bg-slate-300 text-textColor px-[15px]"
                                    type="button"
                                    onClick={() => setIsModal(false)}
                                >
                                    Cancel
                                </button>
                                <button className="w-[160px]">
                                    {isLoading ? <BtnLoader /> : "Get Qr"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
