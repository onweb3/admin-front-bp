import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { SiYourtraveldottv } from "react-icons/si";

import { BtnLoader, PageLoader, RichTextEditor } from "../../components";
import axios from "../../axios";
import { ActivityPrivateTransfersSection } from "../../features/Attractions";
import AddQuotationDetails from "../../features/Attractions/components/AddQuotaionDetails";

export default function EditActivityPage() {
    const [data, setData] = useState({
        name: "",
        description: "",
        adultAgeLimit: "",
        childAgeLimit: "",
        infantAgeLimit: "",
        adultCost: "",
        childCost: "",
        infantCost: "",
        isVat: false,
        vat: "",
        base: "person",
        isSharedTransferAvailable: false,
        sharedTransferPrice: "",
        sharedTransferCost: "",
        activityType: "normal",
        isPrivateTransferAvailable: false,
        isQuotation: false,
        qtnActivityType: "ticket",
        isPromoCode: false,
        promoCode: "",
        promoAmountAdult: "",
        promoAmountChild: "",
        isB2bPromoCode: false,
        b2bPromoCode: "",
        b2bPromoAmountAdult: "",
        b2bPromoAmountChild: "",
        ticketPricing: {
            adultPrice: "",
            childPrice: "",
            sicWithTicketAdultPrice: "",
            sicWithTicketChildPrice: "",
            vehicleType: [],
        },
        transferPricing: {
            vehicleType: [],
            sicPrice: "",
        },
        carouselPosition: "",
        isCarousel: false,
    });

    const [section, setSection] = useState("activity");

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [attraction, setAttraction] = useState({});
    const [privateTransfers, setPrivateTransfers] = useState([]);

    const { id, activityId } = useParams();
    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            await axios.patch(
                `/attractions/activities/update/${activityId}`,
                {
                    ...data,
                    attraction: id,
                    bookingType: attraction?.bookingType,
                    privateTransfers,
                },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
            navigate(-1);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const fetchActivity = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(
                `/attractions/activities/${activityId}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            const {
                name,
                description,
                adultAgeLimit,
                childAgeLimit,
                infantAgeLimit,
                adultCost,
                childCost,
                infantCost,
                isVat,
                vat,
                base,
                isSharedTransferAvailable,
                sharedTransferPrice,
                sharedTransferCost,
                activityType,
                isPrivateTransferAvailable,
                privateTransfers,
                isQuotation,
                qtnActivityType,
                ticketPricing,
                transferPricing,
                isPromoCode,
                promoCode,
                promoAmountAdult,
                promoAmountChild,

                carouselPosition,
                isCarousel,
                isB2bPromoCode,
                b2bPromoCode,
                b2bPromoAmountAdult,
                b2bPromoAmountChild,
            } = response.data;
            setData((prev) => ({
                ...prev,
                name,
                description,
                adultAgeLimit,
                childAgeLimit,
                infantAgeLimit,
                adultCost,
                childCost,
                infantCost,
                isVat: isVat || false,
                vat,
                base,
                isSharedTransferAvailable: isSharedTransferAvailable || false,
                sharedTransferPrice,
                sharedTransferCost,
                activityType: activityType || "",
                isPrivateTransferAvailable: isPrivateTransferAvailable || false,
                isQuotation: isQuotation || false,
                qtnActivityType: qtnActivityType || "ticket",
                ticketPricing: ticketPricing || prev.ticketPricing,
                transferPricing: transferPricing || prev.transferPricing,
                isPromoCode: isPromoCode || false,
                promoCode,
                promoAmountAdult,
                promoAmountChild,
                isB2bPromoCode: isB2bPromoCode || false,
                b2bPromoCode,
                b2bPromoAmountAdult,
                b2bPromoAmountChild,
                isCarousel: isCarousel || false,
            }));

            setAttraction(response?.data?.attraction);
            setPrivateTransfers(privateTransfers || []);

            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchActivity();
    }, []);

    const handleSectionChange = (e, value) => {
        e.preventDefault();
        setSection(value);
    };

    console.log(attraction.isApiConnected, "attraction");

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Edit Activity
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
                        {id?.slice(0, 3)}...{id?.slice(-3)}{" "}
                    </span>
                    <span>{">"} </span>
                    <Link
                        to={`/attractions/${id}/edit`}
                        className="text-textColor"
                    >
                        Edit{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Activities</span>
                    <span>{">"} </span>
                    <span>
                        {activityId?.slice(0, 3)}...
                        {activityId?.slice(-3)}{" "}
                    </span>
                    <span>{">"} </span>
                    <span>Edit</span>
                </div>
            </div>

            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded p-6 shadow-sm">
                        <div className="flex items-center gap-[13px] px-4 border-b border-b-dahsed">
                            <button
                                className={
                                    "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                    (section === "activity"
                                        ? "border-b border-b-orange-500"
                                        : "")
                                }
                                onClick={(e) => {
                                    handleSectionChange(e, "activity");
                                }}
                            >
                                Activity
                            </button>

                            <button
                                className={
                                    "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                    (section === "quotation"
                                        ? "border-b border-b-orange-500"
                                        : "")
                                }
                                onClick={(e) => {
                                    handleSectionChange(e, "quotation");
                                }}
                            >
                                Quotation
                            </button>
                        </div>
                        <form action="" onSubmit={handleSubmit}>
                            <div
                                className={` ${
                                    section === "activity" ? "" : "hidden"
                                }`}
                            >
                                <div className="grid grid-cols-3 items-end gap-5 pt-6">
                                    <div>
                                        <label htmlFor="">Name</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Pearl Heli Tour (12 Mins. Ride)"
                                            name="name"
                                            value={data.name || ""}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">Activity Type</label>
                                        <select
                                            name="activityType"
                                            value={data.activityType || ""}
                                            onChange={handleChange}
                                            id=""
                                            required
                                        >
                                            <option value="" hidden>
                                                Select Activity Type
                                            </option>
                                            <option value="normal">
                                                Normal Activity
                                            </option>
                                            {attraction?.bookingType ===
                                                "booking" && (
                                                <option value="transfer">
                                                    Transfer Activity
                                                </option>
                                            )}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="">Base</label>
                                        <select
                                            name="base"
                                            value={data.base || ""}
                                            onChange={handleChange}
                                            required
                                            id=""
                                        >
                                            <option value="person">
                                                Person
                                            </option>
                                            <option value="private">
                                                Private
                                            </option>
                                            <option value="hourly">
                                                Hourly
                                            </option>
                                        </select>
                                    </div>
                                    <div className="">
                                        <label htmlFor="">
                                            Adult Age Limit
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="Ex: 60"
                                            name="adultAgeLimit"
                                            value={data.adultAgeLimit || ""}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            Child Age Limit
                                        </label>
                                        <input
                                            type="number"
                                            name="childAgeLimit"
                                            value={data.childAgeLimit || ""}
                                            onChange={handleChange}
                                            required
                                            placeholder="Ex: 18"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            Infant Age Limit
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            placeholder="Ex: 2"
                                            name="infantAgeLimit"
                                            value={data.infantAgeLimit || ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {/* {data.activityType ===
                                                      "normal" && (
                                                      <>
                                                            <div className="">
                                                                  <label htmlFor="">
                                                                        B2B
                                                                        Price
                                                                        (Adult)
                                                                  </label>
                                                                  <input
                                                                        type="number"
                                                                        placeholder="Enter adult price"
                                                                        name="adultPrice"
                                                                        value={
                                                                              data.adultPrice ||
                                                                              ""
                                                                        }
                                                                        onChange={
                                                                              handleChange
                                                                        }
                                                                        required
                                                                  />
                                                            </div>
                                                            <div>
                                                                  <label htmlFor="">
                                                                        B2B
                                                                        Price
                                                                        (Child)
                                                                  </label>
                                                                  <input
                                                                        type="number"
                                                                        name="childPrice"
                                                                        value={
                                                                              data.childPrice ||
                                                                              ""
                                                                        }
                                                                        onChange={
                                                                              handleChange
                                                                        }
                                                                        required
                                                                        placeholder="Enter child price"
                                                                  />
                                                            </div>
                                                            <div>
                                                                  <label htmlFor="">
                                                                        B2B
                                                                        Price
                                                                        (Infant)
                                                                  </label>
                                                                  <input
                                                                        type="text"
                                                                        placeholder="Enter infant price"
                                                                        name="infantPrice"
                                                                        value={
                                                                              data.infantPrice ||
                                                                              ""
                                                                        }
                                                                        onChange={
                                                                              handleChange
                                                                        }
                                                                  />
                                                            </div>
                                                      </>
                                                )} */}
                                    {/* {(attraction?.bookingType ===
                                                      "booking" ||
                                                      attraction?.isApiConnected ==
                                                            true) &&
                                                      data.activityType ===
                                                            "normal" && ( */}
                                    <>
                                        <div className="">
                                            <label htmlFor="">
                                                Purchase Cost (Adult)
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="Enter adult cost"
                                                name="adultCost"
                                                value={data.adultCost || ""}
                                                readOnly={
                                                    attraction.isApiConnected
                                                }
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="">
                                                Purchase Cost (Child)
                                            </label>
                                            <input
                                                type="number"
                                                name="childCost"
                                                value={data.childCost || ""}
                                                readOnly={
                                                    attraction.isApiConnected
                                                }
                                                onChange={handleChange}
                                                placeholder="Enter child cost"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="">
                                                Purchase Cost (Infant)
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter infant cost"
                                                name="infantCost"
                                                value={data.infantCost || ""}
                                                readOnly={
                                                    attraction.isApiConnected
                                                }
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </>
                                    {/* )} */}
                                </div>
                                <div className="mt-5 grid grid-cols-3 gap-5 items-end">
                                    <div>
                                        <div className="flex items-center gap-[10px]">
                                            <input
                                                type="checkbox"
                                                className="w-[16px] h-[16px]"
                                                checked={data.isPromoCode}
                                                onChange={(e) =>
                                                    setData((prev) => {
                                                        return {
                                                            ...prev,
                                                            isPromoCode:
                                                                e.target
                                                                    .checked,
                                                        };
                                                    })
                                                }
                                            />
                                            <label htmlFor="" className="mb-0">
                                                PromoCode Available
                                            </label>
                                        </div>
                                        {data.isPromoCode && (
                                            <div className="mt-2">
                                                <label htmlFor="">
                                                    PromoCode
                                                </label>
                                                <input
                                                    type="text"
                                                    name="promoCode"
                                                    value={data.promoCode || ""}
                                                    onChange={handleChange}
                                                    className="uppercase"
                                                    placeholder="Enter  promo code"
                                                    required
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {data.isPromoCode && (
                                        <div>
                                            <label htmlFor="">
                                                PromoCode Amount Adult
                                            </label>
                                            <input
                                                type="number"
                                                name="promoAmountAdult"
                                                value={
                                                    data.promoAmountAdult || ""
                                                }
                                                onChange={handleChange}
                                                placeholder="Enter promo amount"
                                                required
                                            />
                                        </div>
                                    )}
                                    {data.isPromoCode && (
                                        <div>
                                            <label htmlFor="">
                                                PromoCode Amount Child
                                            </label>
                                            <input
                                                type="number"
                                                name="promoAmountChild"
                                                value={
                                                    data.promoAmountChild || ""
                                                }
                                                onChange={handleChange}
                                                placeholder="Enter promo amount"
                                                required
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="mt-5 grid grid-cols-3 gap-5 items-end">
                                    <div>
                                        <div className="flex items-center gap-[10px]">
                                            <input
                                                type="checkbox"
                                                className="w-[16px] h-[16px]"
                                                checked={data.isB2bPromoCode}
                                                onChange={(e) =>
                                                    setData((prev) => {
                                                        return {
                                                            ...prev,
                                                            isB2bPromoCode:
                                                                e.target
                                                                    .checked,
                                                        };
                                                    })
                                                }
                                            />
                                            <label htmlFor="" className="mb-0">
                                                B2b PromoCode Available
                                            </label>
                                        </div>
                                        {data.isB2bPromoCode && (
                                            <div className="mt-2">
                                                <label htmlFor="">
                                                    PromoCode
                                                </label>
                                                <input
                                                    type="text"
                                                    name="b2bPromoCode"
                                                    value={
                                                        data.b2bPromoCode || ""
                                                    }
                                                    onChange={handleChange}
                                                    className="uppercase"
                                                    placeholder="Enter  promo code"
                                                    required
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {data.isB2bPromoCode && (
                                        <div>
                                            <label htmlFor="">
                                                PromoCode Amount Adult
                                            </label>
                                            <input
                                                type="number"
                                                name="b2bPromoAmountAdult"
                                                value={
                                                    data.b2bPromoAmountAdult ||
                                                    ""
                                                }
                                                onChange={handleChange}
                                                placeholder="Enter promo amount"
                                                required
                                            />
                                        </div>
                                    )}
                                    {data.isB2bPromoCode && (
                                        <div>
                                            <label htmlFor="">
                                                PromoCode Amount Child
                                            </label>
                                            <input
                                                type="number"
                                                name="b2bPromoAmountChild"
                                                value={
                                                    data.b2bPromoAmountChild ||
                                                    ""
                                                }
                                                onChange={handleChange}
                                                placeholder="Enter promo amount"
                                                required
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="mt-5 grid grid-cols-3 gap-5 items-end">
                                    <div>
                                        <div className="flex items-center gap-[10px]">
                                            <input
                                                type="checkbox"
                                                className="w-[16px] h-[16px]"
                                                checked={
                                                    data.isSharedTransferAvailable
                                                }
                                                onChange={(e) =>
                                                    setData((prev) => {
                                                        return {
                                                            ...prev,
                                                            isSharedTransferAvailable:
                                                                e.target
                                                                    .checked,
                                                        };
                                                    })
                                                }
                                            />
                                            <label htmlFor="" className="mb-0">
                                                Shared Transfer Available
                                            </label>
                                        </div>
                                        {data.isSharedTransferAvailable && (
                                            <div className="mt-2">
                                                <label htmlFor="">
                                                    Shared Transfer Price
                                                </label>
                                                <input
                                                    type="number"
                                                    name="sharedTransferPrice"
                                                    value={
                                                        data.sharedTransferPrice ||
                                                        ""
                                                    }
                                                    onChange={handleChange}
                                                    placeholder="Enter shared transfer price"
                                                    required
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {data.isSharedTransferAvailable && (
                                        <div>
                                            <label htmlFor="">
                                                Shared Transfer Cost
                                            </label>
                                            <input
                                                type="number"
                                                name="sharedTransferCost"
                                                value={
                                                    data.sharedTransferCost ||
                                                    ""
                                                }
                                                onChange={handleChange}
                                                placeholder="Enter shared transfer cost"
                                                required
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="mt-5">
                                    <div className="flex items-center gap-[10px]">
                                        <input
                                            type="checkbox"
                                            className="w-[16px] h-[16px]"
                                            checked={
                                                data.isPrivateTransferAvailable
                                            }
                                            onChange={(e) =>
                                                setData((prev) => {
                                                    return {
                                                        ...prev,
                                                        isPrivateTransferAvailable:
                                                            e.target.checked,
                                                    };
                                                })
                                            }
                                        />
                                        <label htmlFor="" className="mb-0">
                                            Private Transfer Available
                                        </label>
                                    </div>
                                    {data.isPrivateTransferAvailable && (
                                        <ActivityPrivateTransfersSection
                                            privateTransfers={privateTransfers}
                                            setPrivateTransfers={
                                                setPrivateTransfers
                                            }
                                        />
                                    )}
                                </div>

                                <div className="mt-5">
                                    <div className="flex items-center gap-[10px]">
                                        <input
                                            type="checkbox"
                                            className="w-[16px] h-[16px]"
                                            checked={data.isVat}
                                            onChange={(e) =>
                                                setData((prev) => {
                                                    return {
                                                        ...prev,
                                                        isVat: e.target.checked,
                                                    };
                                                })
                                            }
                                        />
                                        <label htmlFor="" className="mb-0">
                                            Enable/Add Vat
                                        </label>
                                    </div>
                                    {data.isVat && (
                                        <div className="mt-2">
                                            <label htmlFor="">Vat</label>
                                            <input
                                                type="number"
                                                name="vat"
                                                onChange={handleChange}
                                                value={data.vat || ""}
                                                placeholder="Enter Vat"
                                                required
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-3 mt-5">
                                    <label htmlFor="">Description</label>
                                    <div className="border border-t-0">
                                        <RichTextEditor
                                            getValue={(value) => {
                                                setData((prev) => {
                                                    return {
                                                        ...prev,
                                                        description: value,
                                                    };
                                                });
                                            }}
                                            initialValue={
                                                data?.description || ""
                                            }
                                        />
                                    </div>
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
                                    <button className="w-[150px]">
                                        {isLoading ? (
                                            <BtnLoader />
                                        ) : (
                                            "Update Activity"
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div
                                className={` ${
                                    section === "quotation" ? "" : "hidden"
                                }`}
                            >
                                <div
                                    className={` ${
                                        section === "quotation"
                                            ? "w-full pt-6"
                                            : "hidden"
                                    }`}
                                >
                                    <AddQuotationDetails
                                        data={data}
                                        setData={setData}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
