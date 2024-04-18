import React from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "../../../axios";
import { config } from "../../../constants";

function VisaCountrySingleRow({ visaList, setIsDeleted, isDeleted }) {
    const { jwtToken } = useSelector((state) => state.admin);

    const deleteVisa = async (id) => {
        try {
            console.log(id, "id");
            const response = await axios.delete(`/visa/country/${id}/delete`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsDeleted(!isDeleted);
        } catch (err) {}
    };

    console.log(visaList, "visaList");
    return (
        <tr className="border-b border-tableBorderColor">
            <td className="p-3">{visaList.country.isocode}</td>
            <td className="p-3 capitalize">{visaList.country.countryName}</td>
            <td className="p-3 capitalize">{visaList.name}</td>
            <td className="p-3 capitalize">{visaList.description}</td>
            <td className="p-3 font-[500]">
                <img
                    src={import.meta.env.VITE_SERVER_URL + visaList?.sampleVisa}
                    alt=""
                    className="w-12 h-12 object-fill"
                />
            </td>
            {/* <td className="font-[500] p-3">135 AED</td> */}
            <td className="p-3">
                <div className="flex items-center gap-[10px]">
                    <button
                        className="h-auto bg-transparent text-red-500 text-xl"
                        onClick={() => {
                            if (window.confirm("Are you sure to delete?")) {
                                deleteVisa(visaList._id);
                            }
                        }}
                    >
                        <MdDelete />
                    </button>
                    <Link to={`/visa/country/${visaList._id}/edit`}>
                        <button className="h-auto bg-transparent text-green-500 text-xl">
                            <BiEditAlt />
                        </button>
                    </Link>
                </div>
            </td>
        </tr>
    );
}

export default VisaCountrySingleRow;
