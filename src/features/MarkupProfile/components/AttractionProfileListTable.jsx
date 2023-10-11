import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../axios";
import AttractionProfileRow from "./AttractionProfileRow";
import AttracitonMarkupModal from "./AttractionMarkupModal";
import { BiEditAlt } from "react-icons/bi";
// import BookingsOrdersSingleRow from "./BookingsOrdersSingleRow";

export default function AttractionProfileListTable({
    setFormData,
    type,
    // attractionList,
    // setAttractionList,
    // setInitalAttractionList,
    // filters,
    // setFilters,
    // activity,
    // setActivity,
    // section,
}) {
    const [initalAttractionList, setInitalAttractionList] = useState([]);
    const [attractionList, setAttractionList] = useState([]);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const [activity, setActivity] = useState([]);
    const { id } = useParams();

    const { profileId, marketId } = useParams();
    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);
    const [filter, setFilter] = useState({
        attractionName: "",
    });

    const fetchAttractionInitialData = async () => {
        try {
            setIsPageLoading(true);

            if (type === "market") {
                if (marketId) {
                    const response = await axios.get(
                        `/market/get-all-attraction-activities/${marketId}`,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );

                    setAttractionList(response.data.attraction);
                    setFormData((prev) => {
                        return { ...prev, name: response.data.name };
                    });
                    setInitalAttractionList(response.data.attraction);
                } else {
                    const response = await axios.get(
                        `/market/b2b/get-all-attraction-activities/${id}`,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );

                    setAttractionList(response.data);

                    setInitalAttractionList(response.data);
                }
            } else {
                if (profileId) {
                    const response = await axios.get(
                        `/profile/get-all-attraction-activities/${profileId}`,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );

                    setAttractionList(response.data.attraction);
                    setFormData((prev) => {
                        return { ...prev, name: response.data.name };
                    });
                    setInitalAttractionList(response.data.attraction);
                } else {
                    const response = await axios.get(
                        `/profile/b2b/get-all-attraction-activities/${id}`,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );

                    setAttractionList(response.data);

                    setInitalAttractionList(response.data);
                }
            }

            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAttractionInitialData();
    }, []);

    const handleFilter = (e, value) => {
        e.preventDefault();

        if (value === "attraction") {
            const regex = new RegExp(e.target.value, "i");
            setAttractionList(
                attractionList.filter((attraction) =>
                    regex.test(attraction.name)
                )
            );
        }

        if (value === "clear") {
            setAttractionList((previous) => {
                const updatedList = initalAttractionList.map((attr) => {
                    const matchingAttr = previous.find(
                        (prevAttr) =>
                            prevAttr._id.toString() === attr._id.toString()
                    );
                    if (matchingAttr) {
                        return matchingAttr;
                    } else {
                        return attr;
                    }
                });
                return updatedList;
            });
        }

        setFilter((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    return (
        <div>
            <div className="overflow-x-auto">
                <div className="flex justfiy-between  items-center w-full">
                    <div className="flex w-[200px] items-center pb-5 gap-[10px]">
                        <button
                            className={"p-2"}
                            onClick={(e) => handleFilter(e, "clear")}
                        >
                            Clear
                        </button>

                        <input
                            type="text"
                            placeholder="attraction name..."
                            className={"min-w-[200px]"}
                            name="attractionName"
                            onChange={(e) => {
                                handleFilter(e, "attraction");
                            }}
                            value={filter.attractionName || ""}
                        />
                    </div>

                    <div className="flex justify-end items-center w-full">
                        <button
                            className="w-[150px] flex gap-2 items-center p-4"
                            onClick={(e) => {
                                setIsModal(true);
                            }}
                        >
                            <BiEditAlt />
                            Edit Markup
                        </button>
                    </div>
                </div>

                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                        <tr className="flex justify-center item-center">
                            <th className="font-[500] p-3">Attraction Name</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm ">
                        {attractionList?.map((attraction, index) => {
                            return (
                                <AttractionProfileRow
                                    key={index}
                                    attraction={attraction}
                                    setAttractionList={setAttractionList}
                                    setInitalAttractionList={
                                        setInitalAttractionList
                                    }
                                    type={type}
                                />
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {isModal && (
                <AttracitonMarkupModal
                    setIsModal={setIsModal}
                    type={type}
                    setAttractionList={setAttractionList}
                    setInitalAttractionList={setInitalAttractionList}
                />
            )}

            {/* <div className="p-4">
                <Pagination
                    limit={filters?.limit}
                    skip={filters?.skip}
                    total={filters?.totalOrders}
                    incOrDecSkip={(number) =>
                        setFilters((prev) => {
                            return {
                                ...prev,
                                skip: prev.skip + number,
                            };
                        })
                    }
                    updateSkip={(skip) =>
                        setFilters((prev) => {
                            return { ...prev, skip };
                        })
                    }
                />
            </div> */}
        </div>
    );
}
