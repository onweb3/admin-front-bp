import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "../../axios";
import { PageLoader, Pagination, Toggle } from "../../components";
import { config } from "../../constants";
import AttractionTicketImageModal from "../../features/Attractions/components/AttractionTicketImageModal";

export default function AttractionTicketSettingPage() {
    const [themes, setThemes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { jwtToken } = useSelector((state) => state.admin);

    const fetchTicketThemes = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `/attractions/tickets/setting/all`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setThemes(response?.data);

            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };
    const [image, setImage] = useState("");

    const handleDataChange = async (name) => {
        const response = await axios.patch(
            `/attractions/tickets/setting/status/${name}`,
            {},
            {
                headers: { authorization: `Bearer ${jwtToken}` },
            }
        );
        console.log(name, "name");
        setThemes((prev) => ({
            ...prev,
            selected: name,
        }));
    };

    useEffect(() => {
        fetchTicketThemes();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Airlines</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Attraction Ticket Themes</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Themes</h1>
                        <div className="flex items-center gap-3"></div>
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : themes?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No Themes Found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">Name</th>
                                        <th className="font-[500] p-3">
                                            Image
                                        </th>
                                        <th className="font-[500] p-3">
                                            Status{" "}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {themes.samples?.map((sample, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="border-b border-tableBorderColor"
                                            >
                                                {" "}
                                                <td className="p-3">
                                                    {sample?.name}
                                                </td>
                                                <td className="p-3">
                                                    <BsEyeFill
                                                        onClick={(e) => {
                                                            setImage(
                                                                sample?.image
                                                            );
                                                            setIsModalOpen(
                                                                true
                                                            );
                                                        }}
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-[10px]">
                                                        <Toggle
                                                            name="isDiscountAvailable"
                                                            value={
                                                                sample?.name ===
                                                                themes.selected
                                                                    ? true
                                                                    : false
                                                            }
                                                            onChange={(e) => {
                                                                handleDataChange(
                                                                    sample?.name
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            <AttractionTicketImageModal
                image={image}
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
            />
        </div>
    );
}
