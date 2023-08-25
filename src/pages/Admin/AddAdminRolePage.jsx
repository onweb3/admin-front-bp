import React, { useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { BtnLoader } from "../../components";
import axios from "../../axios";
import adminRoles from "../../data/adminRoles";

export default function AddAdminRolePage() {
    const [data, setData] = useState([...adminRoles] || []);
    const [selectedType, setSelectedType] = useState("core");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [roleName, setRoleName] = useState("");

    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);

    const handleItemChange = (item, option) => {
        const objIndex = data.findIndex((itm) => {
            return itm?.name === item?.name;
        });
        if (data[objIndex]?.permissions?.includes(option)) {
            const filteredOptions = data[objIndex]?.permissions?.filter(
                (opt) => {
                    return opt !== option;
                }
            );
            let tempData = data;
            tempData[objIndex].permissions = filteredOptions;
            setData(() => {
                return [...tempData];
            });
        } else {
            let tempData = data;
            tempData[objIndex].permissions = [
                ...tempData[objIndex].permissions,
                option,
            ];
            setData(() => {
                return [...tempData];
            });
        }
    };

    const handleSubmit = async (e) => {
        try {
            setIsLoading(true);
            setError("");

            await axios.post(
                `/roles/create`,
                { roleName, roles: data },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
            navigate("/admins/roles");
        } catch (err) {
            setError(
                err?.response?.data?.error || "something went wrong, try again"
            );
            setIsLoading(false);
        }
    };

    const filteredData = data.filter((item) => {
        return item?.category === selectedType;
    });
    const selectionCategories = [...new Set(data.map((item) => item.category))];

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Add Admin Role
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/admins" className="text-textColor">
                        Admins{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/admins/roles" className="text-textColor">
                        Roles{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Add</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded p-6 shadow-sm">
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <label htmlFor="">Role Name</label>
                            <input
                                type="text"
                                placeholder="Ex: Accounting Team"
                                onChange={(e) => {
                                    setRoleName(e.target.value);
                                }}
                                value={roleName || ""}
                            />
                        </div>
                        <div>
                            <label htmlFor="">Type</label>
                            <select
                                name=""
                                id=""
                                onChange={(e) =>
                                    setSelectedType(e.target.value)
                                }
                                className="capitalize"
                                value={selectedType || ""}
                            >
                                {selectionCategories.map((item, index) => {
                                    return (
                                        <option
                                            value={item}
                                            key={index}
                                            className="capitalize"
                                        >
                                            {item}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="mt-5">
                        <table className="w-full">
                            <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                                <tr>
                                    <th className="font-[500] p-3 text-left">
                                        Name
                                    </th>
                                    <th className="font-[500] p-3">View</th>
                                    <th className="font-[500] p-3">Create</th>
                                    <th className="font-[500] p-3">Update</th>
                                    <th className="font-[500] p-3">Delete</th>
                                    <th className="font-[500] p-3">Approve</th>
                                    <th className="font-[500] p-3">Cancel</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData?.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="p-3 border capitalize text-sm">
                                                {item?.displayName}
                                            </td>
                                            <td className="p-3 border">
                                                <span
                                                    className={
                                                        "flex items-center justify-center mx-auto w-[30px] h-[30px] rounded-full cursor-pointer " +
                                                        (item.permissions?.includes(
                                                            "view"
                                                        )
                                                            ? "bg-[#333] text-white"
                                                            : "bg-[#f3f6f9]")
                                                    }
                                                    onClick={() =>
                                                        handleItemChange(
                                                            item,
                                                            "view"
                                                        )
                                                    }
                                                >
                                                    <AiOutlineUserAdd />
                                                </span>
                                            </td>
                                            <td className="p-3 border">
                                                <span
                                                    className={
                                                        "flex items-center justify-center mx-auto w-[30px] h-[30px] rounded-full cursor-pointer " +
                                                        (item.permissions?.includes(
                                                            "create"
                                                        )
                                                            ? "bg-[#333] text-white"
                                                            : "bg-[#f3f6f9]")
                                                    }
                                                    onClick={() =>
                                                        handleItemChange(
                                                            item,
                                                            "create"
                                                        )
                                                    }
                                                >
                                                    <AiOutlineUserAdd />
                                                </span>
                                            </td>
                                            <td className="p-3 border">
                                                <span
                                                    className={
                                                        "flex items-center justify-center mx-auto w-[30px] h-[30px] rounded-full cursor-pointer " +
                                                        (item.permissions?.includes(
                                                            "update"
                                                        )
                                                            ? "bg-[#333] text-white"
                                                            : "bg-[#f3f6f9]")
                                                    }
                                                    onClick={() =>
                                                        handleItemChange(
                                                            item,
                                                            "update"
                                                        )
                                                    }
                                                >
                                                    <AiOutlineUserAdd />
                                                </span>
                                            </td>
                                            <td className="p-3 border">
                                                <span
                                                    className={
                                                        "flex items-center justify-center mx-auto w-[30px] h-[30px] rounded-full cursor-pointer " +
                                                        (item.permissions?.includes(
                                                            "delete"
                                                        )
                                                            ? "bg-[#333] text-white"
                                                            : "bg-[#f3f6f9]")
                                                    }
                                                    onClick={() =>
                                                        handleItemChange(
                                                            item,
                                                            "delete"
                                                        )
                                                    }
                                                >
                                                    <AiOutlineUserAdd />
                                                </span>
                                            </td>
                                            <td className="p-3 border">
                                                <span
                                                    className={
                                                        "flex items-center justify-center mx-auto w-[30px] h-[30px] rounded-full cursor-pointer " +
                                                        (item.permissions?.includes(
                                                            "approve"
                                                        )
                                                            ? "bg-[#333] text-white"
                                                            : "bg-[#f3f6f9]")
                                                    }
                                                    onClick={() =>
                                                        handleItemChange(
                                                            item,
                                                            "approve"
                                                        )
                                                    }
                                                >
                                                    <AiOutlineUserAdd />
                                                </span>
                                            </td>
                                            <td className="p-3 border">
                                                <span
                                                    className={
                                                        "flex items-center mx-auto justify-center w-[30px] h-[30px] rounded-full cursor-pointer " +
                                                        (item.permissions?.includes(
                                                            "cancel"
                                                        )
                                                            ? "bg-[#333] text-white"
                                                            : "bg-[#f3f6f9]")
                                                    }
                                                    onClick={() =>
                                                        handleItemChange(
                                                            item,
                                                            "cancel"
                                                        )
                                                    }
                                                >
                                                    <AiOutlineUserAdd />
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
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
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>
                        <button className="w-[120px]" onClick={handleSubmit}>
                            {isLoading ? <BtnLoader /> : "Add New Role"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
