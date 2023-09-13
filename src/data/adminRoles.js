const adminRoles = [
    // ATTRACTION
    {
        name: "attractions",
        displayName: "Attractions",
        category: "attraction",
        permissions: [],
    },
    {
        name: "attractions-categories",
        displayName: "Attractions Categories",
        category: "attraction",
        permissions: [],
    },
    {
        name: "ticket-inventory",
        displayName: "Ticket Inventory",
        category: "attraction",
        permissions: [],
    },
    {
        name: "attr-itineraries",
        displayName: "Attraction Itineraries",
        category: "attraction",
        permissions: [],
    },
    {
        name: "attraction-orders",
        displayName: "Attraction Orders",
        category: "attraction",
        permissions: [],
    },
    {
        name: "attraction-statistics",
        displayName: "Attraction Statistics",
        category: "attraction",
        permissions: [],
    },

    // HOTEL
    {
        name: "hotels",
        displayName: "Hotels",
        category: "hotel",
        permissions: [],
    },
    {
        name: "hotel-boards",
        displayName: "Hotel Boards",
        category: "hotel",
        permissions: [],
    },
    {
        name: "hotel-groups",
        displayName: "Hotel Groups",
        category: "hotel",
        permissions: [],
    },
    {
        name: "hotel-chains",
        displayName: "Hotel Chains",
        category: "hotel",
        permissions: [],
    },
    {
        name: "star-categories",
        displayName: "Star Categories",
        category: "hotel",
        permissions: [],
    },
    {
        name: "hotel-amenities",
        displayName: "Hotel Amenities",
        category: "hotel",
        permissions: [],
    },
    {
        name: "accommodation-types",
        displayName: "Accommodation Types",
        category: "hotel",
        permissions: [],
    },
    {
        name: "room-occupancies",
        displayName: "Room Occupancies",
        category: "hotel",
        permissions: [],
    },
    {
        name: "hotel-availability",
        displayName: "Hotel Availability",
        category: "hotel",
        permissions: [],
    },
    {
        name: "hotel-requests",
        displayName: "Hotel Requests",
        category: "hotel",
        permissions: [],
    },
    {
        name: "reservations",
        displayName: "Reservations",
        category: "hotel",
        permissions: [],
    },
    {
        name: "contracts",
        displayName: "Contracts",
        category: "hotel",
        permissions: [],
    },

    // FLIGHT
    {
        name: "flight-bookings",
        displayName: "Flight Bookings",
        category: "flight",
        permissions: [],
    },
    {
        name: "airports",
        displayName: "Airports",
        category: "flight",
        permissions: [],
    },
    {
        name: "airlines",
        displayName: "Airlines",
        category: "flight",
        permissions: [],
    },

    // VISA
    {
        name: "visa-types",
        displayName: "Visa Types",
        category: "visa",
        permissions: [],
    },
    {
        name: "visa-requests",
        displayName: "Visa Requests",
        category: "visa",
        permissions: [],
    },
    {
        name: "visa-countries",
        displayName: "Visa Countries",
        category: "visa",
        permissions: [],
    },
    {
        name: "visa-enquires",
        displayName: "Visa Enquires",
        category: "visa",
        permissions: [],
    },
    {
        name: "b2c-visa-nationalitites",
        displayName: "B2c Visa Nationalitites",
        category: "visa",
        permissions: [],
    },

    // TOUR
    {
        name: "tour-schedules",
        displayName: "Tour Schedules",
        category: "tour",
        permissions: [],
    },
    {
        name: "daily-reports",
        displayName: "Daily Reports",
        category: "tour",
        permissions: [],
    },

    // A2A
    {
        name: "a2a-list",
        displayName: "A2A List",
        category: "a2a",
        permissions: [],
    },
    {
        name: "a2a-enquiry",
        displayName: "A2A Enquiry",
        category: "a2a",
        permissions: [],
    },
    {
        name: "a2a-summary",
        displayName: "A2A Summary",
        category: "a2a",
        permissions: [],
    },

    // CORE
    {
        name: "admins",
        displayName: "Admins",
        category: "core",
        permissions: [],
    },
    {
        name: "admin-roles",
        displayName: "Admin Roles",
        category: "core",
        permissions: [],
    },
    {
        name: "countries",
        displayName: "Countries",
        category: "core",
        permissions: [],
    },
    {
        name: "b2b-list",
        displayName: "B2B List",
        category: "core",
        permissions: [],
    },
    {
        name: "sub-agents",
        displayName: "Sub Agents List",
        category: "core",
        permissions: [],
    },
    {
        name: "withdraw-requests",
        displayName: "Withdraw Requests",
        category: "core",
        permissions: [],
    },
    {
        name: "b2b-configurations",
        displayName: "B2B Configurations",
        category: "core",
        permissions: [],
    },
    {
        name: "destinations",
        displayName: "Destinations",
        category: "core",
        permissions: [],
    },
    {
        name: "currencies",
        displayName: "Currencies",
        category: "core",
        permissions: [],
    },
    {
        name: "markets",
        displayName: "Markets",
        category: "core",
        permissions: [],
    },

    // ACCOUNT
    {
        name: "transactions",
        displayName: "Transactions",
        category: "account",
        permissions: [],
    },
    {
        name: "refunds-list",
        displayName: "Refunds List",
        category: "account",
        permissions: [],
    },

    // SETTINGS
    {
        name: "markup-profile",
        displayName: "Markup Profile",
        category: "settings",
        permissions: [],
    },
    {
        name: "api-master",
        displayName: "Api Master",
        category: "settings",
        permissions: [],
    },
    {
        name: "home-settings",
        displayName: "Home Settings",
        category: "settings",
        permissions: [],
    },

    //Quotations
    {
        name: "create-quotations",
        displayName: "Create Quotations",
        category: "quotations",
        permissions: [],
    },
    {
        name: "quotations-list",
        displayName: "Quotation Listing",
        category: "quotations",
        permissions: [],
    },
    {
        name: "quotations-dashboard",
        displayName: "Quotation Dashboard",
        category: "quotations",
        permissions: [],
    },

    //Transfers

    {
        name: "create-transfer",
        displayName: "Create Transfer",
        category: "transfer",
        permissions: [],
    },
    {
        name: "transfer-list",
        displayName: "Transfer Listing",
        category: "transfer",
        permissions: [],
    },
    {
        name: "create-group-area",
        displayName: "Create Group Area",
        category: "transfer",
        permissions: [],
    },
    {
        name: "group-area-list",
        displayName: "Group Area",
        category: "transfer",
        permissions: [],
    },
    {
        name: "create-vehicle",
        displayName: "Create Vehicle",
        category: "transfer",
        permissions: [],
    },
    {
        name: "vehicle-list",
        displayName: "Vehicle Listing",
        category: "transfer",
        permissions: [],
    },

    //Insurance
    {
        name: "insurance-plans",
        displayName: "Insurance Plans",
        category: "insurance",
        permissions: [],
    },
    {
        name: "insurance-enquiries",
        displayName: "Insurance Enquiries",
        category: "insurance",
        permissions: [],
    },

    //Affiliation

    {
        name: "affiliate-settings",
        displayName: "Affiliate Settings",
        category: "marketing",
        permissions: [],
    },
    {
        name: "affiliate-reports",
        displayName: "Affiliate Reports",
        category: "marketing",
        permissions: [],
    },
    {
        name: "affiliate-products",
        displayName: "Affiliate Products",
        category: "marketing",
        permissions: [],
    },
    {
        name: "affiliate-redeem-requests",
        displayName: "Affiliate Redeem Requests",
        category: "marketing",
        permissions: [],
    },
];

export default adminRoles;
