import { SiAmericanairlines } from "react-icons/si";
import { FiHome } from "react-icons/fi";
import {
    MdAddBusiness,
    MdAdminPanelSettings,
    MdAttractions,
    MdEventAvailable,
    MdLocalAirport,
    MdOutlineFastfood,
    MdOutlineHotelClass,
    MdOutlineSummarize,
    MdSegment,
} from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { ImAirplane } from "react-icons/im";
import {
    HiOutlineCurrencyDollar,
    HiOutlineDocumentReport,
    HiOutlineDocumentText,
    HiOutlineLocationMarker,
    HiOutlineShoppingCart,
    HiOutlineTicket,
    HiOutlineUsers,
} from "react-icons/hi";
import { RiHotelFill, RiHotelLine } from "react-icons/ri";
import {
    BiCategoryAlt,
    BiGitCompare,
    BiHotel,
    BiMessageDetail,
    BiTransferAlt,
} from "react-icons/bi";
import {
    AiFillCar,
    AiOutlineApi,
    AiOutlineGroup,
    AiOutlineSchedule,
    AiOutlineShop,
    AiOutlineShoppingCart,
    AiOutlineSwap,
    AiOutlineUngroup,
} from "react-icons/ai";
import { RiRefund2Line, RiProfileLine } from "react-icons/ri";
import { GiWavyItinerary } from "react-icons/gi";
import { FaGlobe } from "react-icons/fa";
import { BsFillChatLeftQuoteFill } from "react-icons/bs";

const sidebarMenus = {
    Home: [
        {
            name: "Dashboard",
            link: "/",
            icon: <RxDashboard />,
        },
    ],
    Attraction: [
        {
            name: "Attractions List",
            icon: <MdAttractions />,
            link: "/attractions",
            permission: ["attractions", "view"],
        },
        // {
        //     name: "Add Attraction",
        //     icon: <MdAttractions />,
        //     link: "/attractions/add",
        //     permission: ["attraction-all", "view"],
        // },
        {
            name: "Attraction Categories",
            icon: <BiCategoryAlt />,
            link: "/attractions/categories",
            permission: ["attractions-categories", "view"],
        },
        {
            name: "Ticket Inventory",
            icon: <HiOutlineTicket />,
            link: "/attractions/tickets/inventory",
            permission: ["ticket-inventory", "view"],
        },
        {
            name: "Itineraries",
            icon: <GiWavyItinerary />,
            link: "/attractions/itineraries",
            permission: ["attr-itineraries", "view"],
        },
        {
            name: "Attraction Orders",
            icon: <HiOutlineShoppingCart />,
            link: "#",
            dropdown: [
                {
                    name: "Attraction Bookings",
                    link: "/attractions/orders/bookings",
                    permission: ["attraction-orders", "view"],
                },
                {
                    name: "Attraction Tickets",
                    link: "/attractions/orders/tickets",
                    permission: ["attraction-orders", "view"],
                },
                {
                    name: "Order Statistics",
                    link: "/attractions/statistics",
                    permission: ["attraction-statistics", "view"],
                },
            ],
        },
    ],
    Marketing: [
        {
            name: "Affiliate",
            icon: <HiOutlineShoppingCart />,
            link: "#",
            dropdown: [
                {
                    name: "Affiliate Settings",
                    link: "/affiliate/settings",
                    permission: ["affiliate-settings", "view"],
                },
                {
                    name: "Affiliate Products",
                    link: "/affiliate/products",
                    permission: ["affiliate-products", "view"],
                },
                {
                    name: "Affiliate Reports",
                    link: "/affiliate/reports",
                    permission: ["affiliate-reports", "view"],
                },
                {
                    name: "Affiliate Reedem Requests",
                    link: "/affiliate/redeem/requests",
                    permission: ["affiliate-redeem-requests", "view"],
                },
            ],
        },
    ],
    Hotel: [
        {
            name: "Hotels List",
            icon: <BiHotel />,
            link: "/hotels",
            permission: ["hotels", "view"],
        },
        {
            name: "Boards List",
            icon: <MdOutlineFastfood />,
            link: "/hotels/boards",
            permission: ["hotel-boards", "view"],
        },
        {
            name: "Hotel Groups",
            icon: <AiOutlineGroup />,
            link: "/hotels/groups",
            permission: ["hotel-groups", "view"],
        },
        {
            name: "Hotel Chains",
            icon: <AiOutlineUngroup />,
            link: "/hotels/chains",
            permission: ["hotel-chains", "view"],
        },
        {
            name: "Star Categories",
            icon: <MdOutlineHotelClass />,
            link: "/hotels/star-categories",
            permission: ["star-categories", "view"],
        },
        {
            name: "Hotel Amenities",
            icon: <RiHotelFill />,
            link: "/hotels/amenities",
            permission: ["hotel-amenities", "view"],
        },
        {
            name: "Accommodation Types",
            icon: <RiHotelLine />,
            link: "/hotels/accommodation-types",
            permission: ["accommodation-types", "view"],
        },
        {
            name: "Room Occupancies",
            icon: <HiOutlineUsers />,
            link: "/hotels/room-occupancies",
            permission: ["room-occupancies", "view"],
        },
        {
            name: "Inventory Control",
            icon: <MdEventAvailable />,
            link: "/hotels/availability",
            permission: ["hotel-availability", "view"],
        },
        {
            name: "Hotel Requests",
            icon: <BiMessageDetail />,
            link: "/hotels/requests",
            permission: ["hotel-requests", "view"],
        },
        {
            name: "Reservation",
            icon: <AiOutlineShoppingCart />,
            link: "/hotels/reservation",
            permission: ["reservations", "view"],
        },
        {
            name: "Comparison List",
            icon: <BiGitCompare />,
            link: "/hotels/comparison-list",
            permission: ["hotels", "view"],
        },
    ],
    Flight: [
        {
            name: "Bookings",
            icon: <AiOutlineShoppingCart />,
            link: "/flights/bookings",
            permission: ["flight-bookings", "view"],
        },
        {
            name: "Airports",
            icon: <MdLocalAirport />,
            link: "/airports",
            permission: ["airports", "view"],
        },
        {
            name: "Airlines",
            icon: <SiAmericanairlines />,
            link: "/airlines",
            permission: ["airlines", "view"],
        },
    ],
    Visa: [
        {
            name: "Visa Types",
            icon: <MdSegment />,
            link: "/visa",
            permission: ["visa-types", "view"],
        },
        {
            name: "B2c Visa Naitionalities",
            link: "/visa/nationalities",
            icon: <MdOutlineSummarize />,
            permission: ["b2c-visa-nationalitites", "view"],
        },
        {
            name: "Visa Request",
            icon: <HiOutlineDocumentText />,
            link: "/visa/request",
            permission: ["visa-requests", "view"],
        },
        {
            name: "Visa Countries",
            link: "/visa/country",
            icon: <FaGlobe />,
            permission: ["visa-countries", "view"],
        },
        {
            name: "Visa Enquires",
            link: "/visa/enquires",
            icon: <MdOutlineSummarize />,
            permission: ["visa-enquires", "view"],
        },
    ],
    A2A: [
        // {
        //     name: "A2A",
        //     icon: <ImAirplane />,
        //     link: "#",
        //     dropdown: [
        //         {
        //             name: "A2A List",
        //             link: "/a2a",
        //             permission: ["a2a", "view"],
        //         },
        //         {
        //             name: "A2A Enquiry",
        //             link: "/a2a/enquiry",
        //             permission: ["a2a", "view"],
        //         },
        //         {
        //             name: "A2A Summary",
        //             link: "/a2a/summary",
        //             permission: ["a2a", "view"],
        //         },
        //     ],
        // },
        {
            name: "A2A List",
            icon: <ImAirplane />,
            link: "/a2a",
            permission: ["a2a-list", "view"],
        },
        {
            name: "A2A Enquiry",
            icon: <HiOutlineDocumentText />,
            link: "/a2a/enquiry",
            permission: ["a2a-enquiry", "view"],
        },
        {
            name: "A2A Summary",
            icon: <MdOutlineSummarize />,
            link: "/a2a/summary",
            permission: ["a2a-summary", "view"],
        },
    ],
    Quotation: [
        {
            name: "Quotation",
            icon: <BsFillChatLeftQuoteFill />,
            link: "#",
            dropdown: [
                {
                    name: "Quotation Dashboard",
                    link: "/quotations/dashboard",
                    permission: ["quotations-dashboard", "view"],
                },
                {
                    name: "Create Quotation",
                    link: "/quotations/add",
                    permission: ["create-quotations", "view"],
                },
                {
                    name: "Quotation List",
                    link: "/quotations",
                    permission: ["quotations-list", "view"],
                },
            ],
        },
    ],
    Insurance: [
        {
            name: "Insurance Plans",
            icon: <MdOutlineSummarize />,
            link: "/insurance/plans",
            permission: ["insurance-plans", "view"],
        },
        {
            name: "Insurance Enquiries",
            icon: <HiOutlineDocumentText />,
            link: "/insurance/enquiries",
            permission: ["insurance-enquiries", "view"],
        },
    ],
    Transfer: [
        {
            name: "Transfer",
            icon: <BiTransferAlt />,
            link: "#",
            dropdown: [
                {
                    name: "Create Transfer",
                    link: "/transfers/add",
                    permission: ["create-transfer", "view"],
                },
                {
                    name: "Transfer List",
                    link: "/transfers",
                    permission: ["transfer-list", "view"],
                },
                {
                    name: "Create Group Area ",
                    link: "/transfers/area-group/add",
                    permission: ["create-group-area", "view"],
                },
                {
                    name: "Group Area",
                    link: "/transfers/area-group",
                    permission: ["group-area-list", "view"],
                },
            ],
        },
        {
            name: "Vehicle",
            icon: <AiFillCar />,
            link: "#",
            dropdown: [
                {
                    name: "Create Vehicle",
                    link: "/transfers/vehicle/add",
                    permission: ["create-vehicle", "view"],
                },
                {
                    name: "Vehicle List",
                    link: "/transfers/vehicle",
                    permission: ["vehicle-list", "view"],
                },
            ],
        },
    ],
    core: [
        {
            name: "Admin",
            link: "#",
            icon: <MdAdminPanelSettings />,
            role: "super-admin",
            dropdown: [
                {
                    name: "Admin List",
                    link: "/admins",
                    permission: ["admins", "view"],
                },
                {
                    name: "Admin Roles",
                    link: "/admins/roles",
                    permission: ["admin-roles", "view"],
                },
            ],
        },
        {
            name: "B2B",
            icon: <MdAddBusiness />,
            link: "#",
            dropdown: [
                {
                    name: "B2B List",
                    link: "/b2b",
                    permission: ["b2b-list", "view"],
                },
                {
                    name: "Sub Agents List",
                    link: "/sub-agents",
                    permission: ["sub-agents", "view"],
                },
                {
                    name: "Withdraw Requests",
                    link: "/withdraw-requests",
                    permission: ["withdraw-requests", "view"],
                },
                {
                    name: "Configurations",
                    link: "/b2b/configurations",
                    permission: ["b2b-configurations", "view"],
                },
            ],
        },
        {
            name: "Location",
            icon: <HiOutlineLocationMarker />,
            link: "#",
            dropdown: [
                {
                    name: "Countries List",
                    link: "/countries",
                    permission: ["countries", "view"],
                },
                {
                    name: "Destination",
                    link: "/destinations",
                    permission: ["destinations", "view"],
                },
            ],
        },
        {
            name: "Currencies",
            icon: <HiOutlineCurrencyDollar />,
            link: "/currencies",
            permission: ["currencies", "view"],
        },
        {
            name: "Markets",
            icon: <AiOutlineShop />,
            link: "/markets",
            permission: ["markets", "view"],
        },
    ],
    Tour: [
        {
            name: "Tour Schedules",
            icon: <AiOutlineSchedule />,
            link: "/vouchers",
            permission: ["tour-schedules", "view"],
        },
        {
            name: "Daily Reports",
            icon: <HiOutlineDocumentReport />,
            link: "/vouchers/daily-reports",
            permission: ["daily-reports", "view"],
        },
    ],
    Account: [
        {
            name: "Transactions",
            link: "/transactions",
            icon: <AiOutlineSwap />,
            permission: ["transactions", "view"],
        },
        {
            name: "Refund",
            icon: <RiRefund2Line />,
            link: "#",
            dropdown: [
                {
                    name: "Refund List",
                    link: "/refund/list",
                    permission: ["refunds-list", "view"],
                },
            ],
        },
    ],
    // {
    //     name: "Subscribers",
    //     link: "/subscribers",
    //     icon: <MdSubscriptions />,
    // },
    // {
    //     name: "Blogs",
    //     icon: <ImBlog />,
    //     link: "#",
    //     dropdown: [
    //         {
    //             name: "Blogs List",
    //             link: "/blogs",
    //         },
    //         {
    //             name: "Add Blog",
    //             link: "/blogs/add",
    //         },
    //         {
    //             name: "Blogs Categories",
    //             link: "/blogs/categories",
    //         },
    //     ],
    // },
    // {
    //    name: "Coupons",
    //     link: "/coupons",
    //     icon: <RiCoupon2Line />,
    // },
    // {
    //     name: "Drivers",
    //     link: "/drivers",
    //     icon: <RiSteeringFill />,
    // },
    // {
    //     name: "Users",
    //     link: "/users",
    //     icon: <HiOutlineUsers />,
    // },
    Users: [
        {
            name: "Users",
            link: "/users",
            icon: <HiOutlineUsers />,
            permission: ["users", "view"],
        },
    ],
    settings: [
        {
            name: "Markup Profile",
            icon: <RiProfileLine />,
            link: "#",
            dropdown: [
                {
                    name: "Profiles",
                    link: "/markup/profile",
                    permission: ["markup-profile", "view"],
                },
            ],
        },
        {
            name: "API Master",
            icon: <AiOutlineApi />,
            link: "/api-master",
            permission: ["api-master", "view"],
        },
        // {
        //     name: "Email Settings",
        //     icon: <BiMailSend />,
        //     link: "#",
        //     dropdown: [
        //         {
        //             name: "Settings",
        //             link: "/email-settings",
        //         },
        //         {
        //             name: "Email Services",
        //             link: "/email-settings/services",
        //         },
        //         {
        //             name: "Emails",
        //             link: "/email-settings/emails",
        //         },
        //         // {
        //         //     name: "Sent List",
        //         //     link: "/email-settings/sent-list",
        //         // },
        //         // {
        //         //     name: "Compose Email",
        //         //     link: "/email-settings/compose",
        //         // },
        //     ],
        // },
        // {
        //     name: "Payment Settings",
        //     icon: <MdPayment />,
        //     link: "/payment-settings/services",
        // },
        // {
        //     name: "OTP Settings",
        //     icon: <MdPassword />,
        //     link: "/otp-settings",
        // },
        {
            name: "Home Settings",
            icon: <FiHome />,
            link: "#",
            role: "super-admin",
            dropdown: [
                {
                    name: "Logo",
                    link: "/home/settings/logo",
                    permission: ["home-settings", "view"],
                },

                {
                    name: "Hero",
                    link: "/home/settings/hero",
                    permission: ["home-settings", "view"],
                },
                {
                    name: "Cards",
                    link: "/home/settings/cards",
                    permission: ["home-settings", "view"],
                },
                {
                    name: "Sections",
                    link: "/home/settings/sections",
                    permission: ["home-settings", "view"],
                },
                {
                    name: "Footer",
                    link: "/home/settings/footer",
                    permission: ["home-settings", "view"],
                },
                {
                    name: "Contact Details",
                    link: "/home/settings/contact-details",
                    permission: ["home-settings", "view"],
                },
            ],
        },
    ],
};

export default sidebarMenus;
