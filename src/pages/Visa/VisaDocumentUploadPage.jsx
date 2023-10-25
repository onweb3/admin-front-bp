import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";

function VisaDocumentUploadPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { orderId } = useParams();

    const [passportFistPagePhoto, setPassportFistPagePhoto] = useState([]);
    const [passportLastPagePhoto, setPassportLastPagePhoto] = useState([]);
    const [passportSizePhoto, setPassportSizePhoto] = useState([]);
    const [supportiveDoc1, setSupportiveDoc1] = useState([]);
    const [supportiveDoc2, setSupportiveDoc2] = useState([]);
    const [visaOrder, setVisaOrder] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchVisaOrder = async () => {
        try {
            const response = await axios.get(`/orders/visa/single/${orderId}`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setVisaOrder(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchVisaOrder();
    }, []);

    const onChangePassportFistPagePhotoHandler = (e, index) => {
        let temp_images = passportFistPagePhoto;
        temp_images[index] = e.target.files[0];
        setPassportFistPagePhoto(temp_images);
    };
    const onChangePassportLastPagePhotoHandler = (e, index) => {
        let temp2_images = passportLastPagePhoto;
        temp2_images[index] = e.target.files[0];
        setPassportLastPagePhoto(temp2_images);
    };
    const onChangePassportSizePhotoHandler = (e, index) => {
        let temp3_images = passportSizePhoto;
        temp3_images[index] = e.target.files[0];
        setPassportSizePhoto(temp3_images);
    };
    const onChangeSupportiveDoc1Handler = (e, index) => {
        let temp4_images = supportiveDoc1;
        temp4_images[index] = e.target.files[0];
        setSupportiveDoc1(temp4_images);
    };
    const onChangeSupportiveDoc2Handler = (e, index) => {
        let temp5_images = supportiveDoc2;
        temp5_images[index] = e.target.files[0];
        setSupportiveDoc2(temp5_images);
    };

    const submitHandler = async (e) => {
        try {
            e.preventDefault();

            setIsLoading(true);
            const formData = new FormData();
            for (let i = 0; i < passportFistPagePhoto.length; i++) {
                formData.append(
                    "passportFistPagePhoto",
                    passportFistPagePhoto[i]
                );
            }
            for (let i = 0; i < passportLastPagePhoto.length; i++) {
                formData.append(
                    "passportLastPagePhoto",
                    passportLastPagePhoto[i]
                );
            }
            for (let i = 0; i < passportSizePhoto.length; i++) {
                formData.append("passportSizePhoto", passportSizePhoto[i]);
            }
            for (let i = 0; i < supportiveDoc1.length; i++) {
                formData.append("supportiveDoc1", supportiveDoc1[i]);
            }
            for (let i = 0; i < supportiveDoc2.length; i++) {
                formData.append("supportiveDoc2", supportiveDoc2[i]);
            }

            const config = {
                headers: {
                    authorization: `Bearer ${jwtToken}`,
                },
            };
            const data = JSON.parse(localStorage.getItem("visaOrder"));
            const response = await axios.post(
                `/orders/visa/document/${orderId}`,
                formData,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);

            navigate(`/visa/request}`);
        } catch (err) {
            console.log(err, "error", err);
            if (err?.response?.data?.error) {
                setError(err?.response?.data?.error);
                setIsLoading(false);
            }
        }
    };
    // const [travellerDetail, setTravellerDetail] = useState([]);
    // useEffect(() => {
    //     setTravellerDetail([...rows, ...childRows]);
    // }, [rows, childRows]);

    return (
        <div className="p-5 text-darktext">
            <div>
                <div className={`my-2 border-b border-dashed px-3 py-4 `}>
                    <p className="font-[700] text-xl text-gray-400">
                        Upload Details
                    </p>
                </div>
                <form onSubmit={submitHandler} encType="multipart/form-data">
                    <div className="rounded-md shadow bg-white p-6">
                        <div className="mb-2">
                            <p className="font-[300] text-xs text-[#12acfd]">
                                Note: Ensure that all names matches that in the
                                passport
                            </p>
                            <p className="font-[300] text-xs text-[#12acfd]">
                                Ensure that all passports are valid for atleast
                                6 months from the date of visit
                            </p>
                        </div>
                        {visaOrder.travellers?.map((traveller, index) => (
                            <div key={index} className="pb-6 ">
                                <div className="py-2 text-gray-500 font-[550]  bg-gray-50 border-dashed px-2">
                                    <p className="">
                                        {index === 0
                                            ? "Lead passenger"
                                            : traveller?.paxType === "ADT"
                                            ? `${index + 1} Adult`
                                            : `${index + 1} Child`}{" "}
                                    </p>
                                    <div className="flex flex-wrap gap-4 my-2">
                                        <span className="flex gap-2 font-[400] text-sm">
                                            <p className="">Title: </p>
                                            <p className="text-[#12acfd] capitalize">
                                                {traveller.title}{" "}
                                            </p>
                                        </span>
                                        <span className="flex gap-2 font-[400] text-sm">
                                            <p className="">First Name: </p>
                                            <p className="text-[#12acfd] capitalize">
                                                {traveller?.firstName}
                                            </p>
                                        </span>
                                        <span className="flex gap-2 font-[400] text-sm">
                                            <p className="">Last Name: </p>
                                            <p className="text-[#12acfd] capitalize">
                                                {traveller?.lastName}
                                            </p>
                                        </span>
                                        <span className="flex gap-2 font-[400] text-sm">
                                            <p className="">Dob: </p>
                                            <p className="text-[#12acfd]">
                                                {traveller?.dateOfBirth?.day +
                                                    "/" +
                                                    traveller?.dateOfBirth
                                                        ?.month +
                                                    "/" +
                                                    traveller?.dateOfBirth
                                                        ?.year}
                                            </p>
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 my-2">
                                        {/* <span className="flex gap-2 font-[400] text-sm">
                                            <p className="">Visit Date: </p>
                                            <p className="text-[#12acfd] capitalize">
                                                {visaEnquiry?.onwardDate}{" "}
                                            </p>
                                        </span> */}
                                        <span className="flex gap-2 font-[400] text-sm">
                                            <p className="">
                                                Passport Number:{" "}
                                            </p>
                                            <p className="text-[#12acfd] capitalize">
                                                {traveller?.passportNo}
                                            </p>
                                        </span>
                                        <span className="flex gap-2 font-[400] text-sm">
                                            <p className="">
                                                Passport Expiry:{" "}
                                            </p>
                                            <p className="text-[#12acfd] capitalize">
                                                {traveller?.expiryDate?.month +
                                                    "/" +
                                                    traveller?.expiryDate?.year}
                                            </p>
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className="sm:grid sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-5 gap-3 mt-4"
                                    key={index}
                                >
                                    <div className=" flex flex-col">
                                        <label htmlFor="" className="label">
                                            Passport First Page
                                        </label>
                                        <input
                                            className="w-full py-2 p-1 text-primaryColor border-b border-darktext outline-none "
                                            name="passportFistPagePhoto"
                                            type={"file"}
                                            onChange={(e) =>
                                                onChangePassportFistPagePhotoHandler(
                                                    e,
                                                    index
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="">
                                        <label htmlFor="" className="label">
                                            Passport Second Page
                                        </label>
                                        <input
                                            className="w-full py-2 p-1 text-primaryColor border-b border-darktext outline-none "
                                            name="passportLastPagePhoto"
                                            type={"file"}
                                            onChange={(e) =>
                                                onChangePassportLastPagePhotoHandler(
                                                    e,
                                                    index
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="">
                                        <label htmlFor="" className="label">
                                            Passport Size Photo
                                        </label>
                                        <input
                                            className="w-full py-2 p-1 text-primaryColor border-b border-darktext outline-none "
                                            name="passportSizePhoto"
                                            type={"file"}
                                            onChange={(e) =>
                                                onChangePassportSizePhotoHandler(
                                                    e,
                                                    index
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="">
                                        <label htmlFor="" className="label">
                                            Supportive Document 1
                                        </label>
                                        <input
                                            className="w-full py-2 p-1 text-primaryColor border-b border-darktext outline-none "
                                            name="supportiveDoc1"
                                            type={"file"}
                                            onChange={(e) =>
                                                onChangeSupportiveDoc1Handler(
                                                    e,
                                                    index
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="">
                                        <label htmlFor="" className="label">
                                            Supportive Document 2
                                        </label>
                                        <input
                                            className="w-full py-2 p-1 text-primaryColor border-b border-darktext outline-none "
                                            name="supportiveDoc2"
                                            type={"file"}
                                            onChange={(e) =>
                                                onChangeSupportiveDoc2Handler(
                                                    e,
                                                    index
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className=" flex justify-end mt-4">
                            <button className="bg-lightblue rounded-[.25rem] text-sm shadow-mn text-white px-5 h-9">
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default VisaDocumentUploadPage;
