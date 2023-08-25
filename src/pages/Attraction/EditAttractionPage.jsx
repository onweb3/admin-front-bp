import React, { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    AttrActivitiesTable,
    AttrAvailabilityForm,
    AttrDescriptionForm,
    AttrDetailsForm,
    AttrMediaForm,
} from "../../features/Attractions";
import axios from "../../axios";
import {
    addInitialData,
    clearAttractionData,
    fetchInitialData,
} from "../../redux/slices/attractionFormSlice";
import { PageLoader } from "../../components";
import EditAttrSubmission from "../../features/Attractions/components/EditAttrSubmission";
import { useImageChange } from "../../hooks";

export default function EditAttractionPage() {
    const [section, setSection] = useState(1);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [newImages, setNewImages] = useState([]);

    const { id } = useParams();
    const dispatch = useDispatch();
    const { jwtToken } = useSelector((state) => state.admin);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const fetchAttraction = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(`/attractions/single/${id}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            dispatch(addInitialData(response.data));
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAttraction();
        dispatch(fetchInitialData());
    }, [dispatch]);


    const {
        image: logoImg,
        handleImageChange: handleLogoImgChange,
        error: logoImgError,
      } = useImageChange();

    useEffect(() => {
        if (searchParams.get("section")) {
            setSection(Number(searchParams.get("section")));
        }
    }, []);

    useEffect(() => {
        return () => dispatch(clearAttractionData());
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Edit Attraction
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/attractions" className="text-textColor">
                        Attractions{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {id?.slice(0, 3)}...{id?.slice(-3)}
                    </span>
                    <span>{">"} </span>
                    <span>Edit</span>
                </div>
            </div>

            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="grid grid-cols-5">
                            <div
                                className={
                                    "p-3 cursor-pointer font-medium text-sm " +
                                    (section === 1
                                        ? "bg-[#e1e5ee]"
                                        : "bg-[#f3f6f9]")
                                }
                                onClick={() => {
                                    setSection(1);
                                    navigate("?section=1", { replace: true });
                                }}
                            >
                                Details
                            </div>
                            <div
                                className={
                                    "p-3 cursor-pointer font-medium text-sm " +
                                    (section === 2
                                        ? "bg-[#e1e5ee]"
                                        : "bg-[#f3f6f9]")
                                }
                                onClick={() => {
                                    setSection(2);
                                    navigate("?section=2", { replace: true });
                                }}
                            >
                                Activities
                            </div>
                            <div
                                className={
                                    "p-3 cursor-pointer font-medium text-sm " +
                                    (section === 3
                                        ? "bg-[#e1e5ee]"
                                        : "bg-[#f3f6f9]")
                                }
                                onClick={() => {
                                    setSection(3);
                                    navigate("?section=3", { replace: true });
                                }}
                            >
                                Availability
                            </div>
                            <div
                                className={
                                    "p-3 cursor-pointer font-medium text-sm " +
                                    (section === 4
                                        ? "bg-[#e1e5ee]"
                                        : "bg-[#f3f6f9]")
                                }
                                onClick={() => {
                                    setSection(4);
                                    navigate("?section=4", { replace: true });
                                }}
                            >
                                Descriptions
                            </div>
                            <div
                                className={
                                    "p-3 cursor-pointer font-medium text-sm " +
                                    (section === 5
                                        ? "bg-[#e1e5ee]"
                                        : "bg-[#f3f6f9]")
                                }
                                onClick={() => {
                                    setSection(5);
                                    navigate("?section=5", { replace: true });
                                }}
                            >
                                Media
                            </div>
                        </div>

                        <div className="p-4">
                            <AttrDetailsForm section={section} isEdit={true} />
                            <AttrActivitiesTable section={section} />
                            <AttrDescriptionForm section={section} />
                            <AttrAvailabilityForm section={section} />
                            <AttrMediaForm
                                section={section}
                                newImages={newImages}
                                setNewImages={setNewImages}
                                logoImgError={logoImgError}
                                handleLogoImgChange={handleLogoImgChange}
                                logoImg={logoImg}
                            />
                            <EditAttrSubmission
                                setSection={setSection}
                                newImages={newImages}
                                next={section !== 5}
                                update={section !== 2}
                                prev={section !== 1}
                                logoImg={logoImg}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
