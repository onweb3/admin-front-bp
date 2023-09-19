import {
    AdminLayout,
    EditProfileLayout,
    SingleResellerLayout,
} from "../layouts";
import A2aAddTicketPage from "../pages/A2A/A2aAddTicketPage";
import A2AEditTicketPage from "../pages/A2A/A2aEditTicketPage";
import A2AEnquiryPage from "../pages/A2A/A2AEnquiryPage";
import A2AListPage from "../pages/A2A/A2AListPage";
import A2aSummaryPage from "../pages/A2A/A2aSummaryPage";
import A2ATicketListPage from "../pages/A2A/A2ATicketListPage";
import AddAdminPage from "../pages/Admin/AddAdminPage";
import AdminsListPage from "../pages/Admin/AdminsListPage";
import EditAdminPage from "../pages/Admin/EditAdminPage";
import AddAirlinePage from "../pages/Airline/AddAirlinePage";
import AirlinesListPage from "../pages/Airline/AirlinesListPage";
import EditAirlinePage from "../pages/Airline/EditAirlinePage";
import AddAirportPage from "../pages/Airport/AddAirportPage";
import AirportsListPage from "../pages/Airport/AirportsListPage";
import EditAirportPage from "../pages/Airport/EditAirportPage";
import AddApiPage from "../pages/ApiMaster/AddApiPage";
import ApisListPage from "../pages/ApiMaster/ApisListPage";
import EditApiPage from "../pages/ApiMaster/EditApiPage";
import AddActivityPage from "../pages/Attraction/AddActivityPage";
import AddAttractionPage from "../pages/Attraction/AddAttractionPage";
import AttractionCategoriesPage from "../pages/Attraction/AttractionCategoriesPage";
import AttractionSingleTicketPage from "../pages/Attraction/AttractionSingleTicketPage";
import AttractionsListPage from "../pages/Attraction/AttractionsListPage";
import AttractionsTicketsPage from "../pages/Attraction/AttractionsTicketsPage";
import EditActivityPage from "../pages/Attraction/EditActivityPage";
import EditAttractionPage from "../pages/Attraction/EditAttractionPage";
import SingleAttrReviewsPage from "../pages/Attraction/SingleAttrReviewsPage";
import AddAttractionItineraryPage from "../pages/AttractionItinerary/AddAttractionItineraryPage";
import AttractionItinerariesPage from "../pages/AttractionItinerary/AttractionItinerariesPage";
import EditAttractionItineraryPage from "../pages/AttractionItinerary/EditAttractionItineraryPage";
import SingleAttractionItineraryPage from "../pages/AttractionItinerary/SingleAttractionItineraryPage";
import AttractionTicketInventoryPage from "../pages/AttractionTicketInventory/AttractionTicketInventoryPage";
import AddBlogPage from "../pages/Blogs/AddBlogPage";
import BlogsCategoriesPage from "../pages/Blogs/BlogsCategoriesPage";
import BlogsPage from "../pages/Blogs/BlogsPage";
import EditBlogPage from "../pages/Blogs/EditBlogPage";
import CountriesPage from "../pages/Countries/CountriesPage";
import CurrenciesPage from "../pages/Countries/CurrenciesPage";
import DestinationsPage from "../pages/Countries/DestinationsPage";
import StatesPage from "../pages/Countries/StatesPage";
import CouponsPage from "../pages/CouponsPage";
import Dashboard from "../pages/Dashboard";
import DriversPage from "../pages/DriversPage";
import EmailSettingsEmailsPage from "../pages/EmailSettings/EmailSettingsEmailsPage";
import EmailSettingsPage from "../pages/EmailSettings/EmailSettingsPage";
import EmailSettingsServicesPage from "../pages/EmailSettings/EmailSettingsServicesPage";
import ErrorPage from "../pages/ErrorPage";
import AddCardSettingsPage from "../pages/Home/AddCardSettingsPage";
import CardsSettingsPage from "../pages/Home/CardsSettingsPage";
import EditCardSettingsPage from "../pages/Home/EditCardSettingsPage";
import FooterSettingsPage from "../pages/Home/FooterSettingsPage";
import HeroSettingsPage from "../pages/Home/HeroSettingsPage";
import LogoSettingsPage from "../pages/Home/LogoSettingsPage";
import OtherDetailsSettingsPage from "../pages/Home/OtherDetailsSettingsPage";
import SectionsSettingsPage from "../pages/Home/SectionsSettingsPage";
import AddHotelPage from "../pages/Hotels/AddHotelPage";
import AddPromotionPage from "../pages/Hotels/AddPromotionPage";
import AddRoomTypePage from "../pages/Hotels/AddRoomTypePage";
import EditHotelPage from "../pages/Hotels/EditHotelPage";
import EditRoomTypePage from "../pages/Hotels/EditRoomTypePage";
import HotelAmenitiesPage from "../pages/Hotels/HotelAmenitiesPage";
import HotelAvailabilityPage from "../pages/Hotels/HotelAvailabilityPage";
import HotelContractPage from "../pages/Hotels/HotelContractPage";
import HotelReservation from "../pages/Hotels/HotelReservation";
import HotelsListPage from "../pages/Hotels/HotelsListPage";
import LoginPage from "../pages/LoginPage";
import AttractionsBookingOrdersPage from "../pages/Orders/AttractionsBookingOrdersPage";
import AttractionsTicketsOrders from "../pages/Orders/AttractionsTicketsOrders";
import OtpSettingsPage from "../pages/OtpSettingsPage";
import PaymentServicesPage from "../pages/PaymentSettings/PaymentServicesPage";
import RefundPage from "../pages/Refund/RefundPage";
import B2bListPage from "../pages/Resellers/B2bListPage";
import SingleResellerAttractionBookingOrdersPage from "../pages/Resellers/SingleResellerAttractionBookingOrders";
import SingleResellerAttractionTicketOrdersPage from "../pages/Resellers/SingleResellerAttractionTicketOrders";
import SingleResellerDetailsPage from "../pages/Resellers/SingleResellerDetailsPage";
import SingleResellerSubAgentsPage from "../pages/Resellers/SingleResellerSubAgentsPage";
import SingleResellerTransactionsPage from "../pages/Resellers/SingleResellerTransactionsPage";
import SpecialMarkupPage from "../pages/Resellers/SpecialMarkupPage";
import ChangePasswordPage from "../pages/Settings/ChangePasswordPage";
import EditProfilePage from "../pages/Settings/EditProfilePage";
import ProfilePage from "../pages/Settings/ProfilePage";
import SubscribersPage from "../pages/SubscribersPage";
import TransactionsPage from "../pages/TransactionsPage";
import UsersPage from "../pages/Users/UsersPage";
import SingleVisaApplication from "../pages/Visa/SingleVisaApplication";
import VisaAddCountryPage from "../pages/Visa/VisaAddCountryPage";
import VisaAddPage from "../pages/Visa/VisaAddPage";
import VisaCountry from "../pages/Visa/VisaCountry";
import VisaRequestPage from "../pages/Visa/VisaRequestPage";
import VisaTypePage from "../pages/Visa/VisaTypePage";
import WithdrawRequestPage from "../pages/Withdraw/B2bWithdrawRequestPage";
import AdminPrivateRoute from "./AdminPrivateRoute";
import HotelRoomTypePage from "../pages/Hotels/HotelRoomTypesPage";
import HotelPromortionsPage from "../pages/Hotels/HotelPromotionsPage";
import AddAllocationPage from "../pages/Hotels/AddAllocationPage";
import HotelAddOnsPage from "../pages/Hotels/HotelAddOnsPage";
import AddAddOnsPage from "../pages/Hotels/AddAddOnsPage";
import EditAddOnsPage from "../pages/Hotels/EditAddOnsPage";
import A2aQuotaPage from "../pages/A2A/A2aQuotaPage";
import EditContractPage from "../pages/Hotels/EditContractPage";
import EditPromotionPage from "../pages/Hotels/EditPromotionsPage";
import HotelOrderDetailsPage from "../pages/Hotels/HotelOrderDetailsPage";
import HotelSubAmenitiesPage from "../pages/Hotels/HotelSubAmenitiesPage";
import HotelBoardTypesPage from "../pages/Hotels/HotelBoardTypesPage";
import ProfileListPage from "../pages/Markup Profile/ProfileListPage";
import AddMarkupProfilePage from "../pages/Markup Profile/AddMarkupProfilePage";
import AddContractPage from "../pages/Hotels/AddContractPage";
import ChangeAvailabilityPage from "../pages/Hotels/ChangeAvailabilityPage";
import AccommodationTypesPage from "../pages/Hotels/AccommodationTypesPage";
import CitiesPage from "../pages/Countries/CitiesPage";
import EditMarkupProfilePage from "../pages/Markup Profile/EditMarkupProfilePage";
import EditB2bMarkupProfilePage from "../pages/Markup Profile/EditB2bMarkupProfilePage";
import HotelBedRoomTypesPage from "../pages/Hotels/HotelBedRoomTypesPage";
import AddA2APage from "../pages/A2A/A2aMarkupPage";
import AdminRolesPage from "../pages/Admin/AdminRolesPage";
import AddAdminRolePage from "../pages/Admin/AddAdminRolePage";
import HotelChainsListPage from "../pages/Hotels/HotelChainsListPage";
import HotelRequestsPage from "../pages/Hotels/HotelRequestsPage";
import HotelStarCategoriesPage from "../pages/Hotels/HotelStarCategoriesPage";
import EditAdminRolePage from "../pages/Admin/EditAdminRolePage";
import AreasPage from "../pages/Countries/AreasPage";
import AddVoucherPage from "../pages/Voucher/AddVoucherPage";
import VouchersListPage from "../pages/Voucher/VouchersListPage";
import VouchersDailyReportPage from "../pages/Voucher/VouchersDailyReportPage";
import EditVoucherPage from "../pages/Voucher/EditVoucherPage";
import SingleVoucherPage from "../pages/Voucher/SingleVoucherPage";
import PrivateRoute from "./PrivateRoute";
import AttractionOrdersStatistics from "../pages/Attraction/AttractionOrdersStatistics";
import AddResellerPage from "../pages/Resellers/AddResellerPage";
import UpdateResellerDetailsPage from "../pages/Resellers/UpdateResellerDetailsPage";
import TransferListPage from "../pages/Transfers/TransferListPage";
import VehicleList from "../pages/Transfers/VehicleList";
import AddTransferPage from "../pages/Transfers/AddTransferPage";
import EditTransferPage from "../pages/Transfers/EditTransferPage";
import AddVehiclePage from "../pages/Transfers/AddVehiclePage";
import EditVehiclePage from "../pages/Transfers/EditVehiclePage";
import QuotationListPage from "../pages/Quotation/QuotationListPage";
import SingleQuotationDetailPage from "../pages/Quotation/SingleQuotationDetailPage";
import QuotationDashboard from "../pages/Quotation/QuotationDashboradPage";
import EditQuotationPage from "../pages/Quotation/EditQuotationPage";
import AddQuotationPage from "../pages/Quotation/AddQuotation";
import HotelsGroupsPage from "../pages/Hotels/HotelsGroupsPage";
import PromotionBannerUpdatePage from "../pages/Hotels/PromotionBannerUpdatePage";
import EditHotelLayout from "../layouts/EditHotelLayout";
import TerminalPage from "../pages/Airport/TerminalPage";
import HotelComparisonList from "../pages/Hotels/HotelComparisonList";
import HotelContractGroupsPage from "../pages/Hotels/HotelContractGroupsPage";
import B2bConfigurationPage from "../pages/B2bConfiguration/B2bConfigurationPage";
import UpdateResellerConfigPage from "../pages/Resellers/UpdateResellerConfigPage";
import HotelContractGroupsContractPage from "../pages/Hotels/HotelContractGroupsContractsPage";
import AddGroupPage from "../pages/Transfers/AddGroupAreaPage";
import GroupAreaListPage from "../pages/Transfers/GroupAreaListPage";
import EdiGroupAreaPage from "../pages/Transfers/EditGroupAreaPage";
import QuotationSingleEmailPage from "../pages/Quotation/QuotationSingleEmailPage";
import RoomOccupacniesListPage from "../pages/Hotels/RoomOccupacniesListPage";
import AddRoomOccupanciesPage from "../pages/Hotels/AddRoomOccupanciesPage";
import EditRoomOccupanciesPage from "../pages/Hotels/EditRoomOccupanciesPage";
import SingleResellerAdminAccessPage from "../pages/Resellers/SingleResellerAdminAccessPage";
import VisaEnquiryPage from "../pages/Visa/VisaEnquiryPage";
import VisaNationalityPage from "../pages/Visa/VisaNationalityPage";
import B2cVisaNationalityPage from "../pages/Visa/VisaNationalityPage";
import AddVisaTypeNationality from "../pages/Visa/AddVisaTypeNationality";
import AddSubAgentPage from "../pages/Resellers/AddSubAgentPage";
import SubAgentsListPage from "../pages/Resellers/SubAgentsListPage";
import FlightBookingsListPage from "../pages/Flight/FlightBookingsListPage";
import SingleFlightBookingDetailsPage from "../pages/Flight/SingleFlightBookingDetailsPage";
import InsurancePlanListingPage from "../pages/Insurance/InsurancePlanListingPage";
import InsursanceEnquiryPage from "../pages/Insurance/InsuranceEnquiryPage";
import AddVisaTypeNationalityPage from "../pages/Visa/AddVisaTypeNationalityPage";
import EditVisaTypeNationalityPage from "../pages/Visa/EditVisaTypeNationalityPage";
import SingelInsuranceEnquiryDetailsPage from "../pages/Insurance/SingelInsuranceEnquiryDetailsPage";
import AddAttrReviewPage from "../pages/Attraction/AddAttReviewPage";
import EditAttrReviewPage from "../pages/Attraction/EditAttrReviewPage";
import AffiliateSettingsPage from "../pages/Affiliate/AffiliateSettingsPage";
import AffiliateProductPage from "../pages/Affiliate/AffiliateProductPage";
import AffiliateReportPage from "../pages/Affiliate/AffiliateReportsPages";
import AffiliateReedemRequestPage from "../pages/Affiliate/AffiliateReedemRequestPage";
import SingleUserLayout from "../layouts/SingleUserLayout";
import SingleUserDetailsPage from "../pages/Users/SingleUserDetailsPage";
import SingleUserAttractionBookingOrdersPage from "../pages/Users/SingleUserAttractionBooking";
import SingleUserAttractionTicketOrdersPage from "../pages/Users/SingleUserAttractionTicketOrderPage";

const ThemeRoutes = [
    {
        path: "/",
        element: (
            <AdminPrivateRoute>
                <AdminLayout />
            </AdminPrivateRoute>
        ),
        children: [
            { path: "", element: <Dashboard /> },
            { path: "/attractions", element: <AttractionsListPage /> },
            {
                path: "/attractions/categories",
                element: <AttractionCategoriesPage />,
            },
            { path: "/attractions/add", element: <AddAttractionPage /> },
            {
                path: "/attractions/:id/reviews",
                element: <SingleAttrReviewsPage />,
            },

            {
                path: "/attractions/:id/reviews/add",
                element: <AddAttrReviewPage />,
            },
            {
                path: "/attractions/:id/reviews/:reviewId/edit",
                element: <EditAttrReviewPage />,
            },

            {
                path: "/attractions/:id/activities/:activityId/tickets",
                element: <AttractionsTicketsPage />,
            },
            {
                path: "/attractions/statistics",
                element: <AttractionOrdersStatistics />,
            },
            {
                path: "/attractions/orders/bookings",
                element: <AttractionsBookingOrdersPage />,
            },
            {
                path: "/attractions/orders/tickets",
                element: <AttractionsTicketsOrders />,
            },
            { path: "/attractions/:id/edit", element: <EditAttractionPage /> },
            {
                path: "/attractions/:id/edit/activities/add",
                element: <AddActivityPage />,
            },
            {
                path: "/attractions/:id/edit/activities/:activityId/edit",
                element: <EditActivityPage />,
            },
            {
                path: "/hotels",
                element: <HotelsListPage />,
            },
            {
                path: "/hotels/comparison-list",
                element: <HotelComparisonList />,
            },
            {
                path: "/hotels/room-occupancies",
                element: <RoomOccupacniesListPage />,
            },
            {
                path: "/hotels/room-occupancies/add",
                element: <AddRoomOccupanciesPage />,
            },
            {
                path: "/hotels/room-occupancies/:occupancyId/edit",
                element: <EditRoomOccupanciesPage />,
            },
            {
                path: "/hotels/add",
                element: <AddHotelPage />,
            },
            {
                path: "/hotels/:id/edit",
                element: <EditHotelPage />,
            },
            {
                path: "/hotels/:id/room-types/add",
                element: <AddRoomTypePage />,
            },
            {
                path: "/hotels/:id/room-types/:roomTypeId/edit",
                element: <EditRoomTypePage />,
            },
            {
                path: "/hotels/boards",
                element: <HotelBoardTypesPage />,
            },
            {
                path: "/hotels/groups",
                element: <HotelsGroupsPage />,
            },
            {
                path: "/hotels/chains",
                element: <HotelChainsListPage />,
            },
            {
                path: "/hotels/star-categories",
                element: <HotelStarCategoriesPage />,
            },
            {
                path: "/hotels/requests",
                element: <HotelRequestsPage />,
            },
            {
                path: "/hotels/amenities",
                element: <HotelAmenitiesPage />,
            },
            {
                path: "/hotels/amenities/:id/sub-amenities",
                element: <HotelSubAmenitiesPage />,
            },
            {
                path: "/hotels/:id",
                element: <EditHotelLayout />,
                children: [
                    {
                        path: "contract-groups",
                        element: <HotelContractGroupsPage />,
                    },
                    {
                        path: "contract-groups/:contractGroupId/contracts",
                        element: <HotelContractGroupsContractPage />,
                    },
                    {
                        path: "contracts",
                        element: <HotelContractPage />,
                    },
                    {
                        path: "promotions",
                        element: <HotelPromortionsPage />,
                    },
                    {
                        path: "add-ons",
                        element: <HotelAddOnsPage />,
                    },
                    {
                        path: "add-allocation",
                        element: <AddAllocationPage />,
                    },
                    {
                        path: "room-types",
                        element: <HotelRoomTypePage />,
                    },
                    {
                        path: "hb-room-types",
                        element: <HotelBedRoomTypesPage />,
                    },
                ],
            },
            {
                path: "/hotels/:id/contract-groups/:contractGroupId/contracts/add",
                element: <AddContractPage />,
            },
            {
                path: "/hotels/:id/contract-groups/:contractGroupId/contracts/:contractId/edit",
                element: <EditContractPage />,
            },
            {
                path: "/hotels/:id/promotions/add",
                element: <AddPromotionPage />,
            },
            {
                path: "/hotels/:id/promotions/:promotionId/edit",
                element: <EditPromotionPage />,
            },
            {
                path: "/hotels/:id/promotions/:promotionId/banner",
                element: <PromotionBannerUpdatePage />,
            },
            {
                path: "/hotels/:id/add-ons/add",
                element: <AddAddOnsPage />,
            },
            {
                path: "/hotels/:id/add-ons/:addOnsId/edit",
                element: <EditAddOnsPage />,
            },
            {
                path: "/hotels/availability",
                element: <HotelAvailabilityPage />,
            },
            // {
            //     path: "/hotels/availability/:id/change",
            //     element: <ChangeAvailabilityPage />,
            // },
            {
                path: "/hotels/reservation",
                element: <HotelReservation />,
            },
            {
                path: "/hotels/reservation/:id",
                element: <HotelOrderDetailsPage />,
            },
            {
                path: "/hotels/accommodation-types",
                element: <AccommodationTypesPage />,
            },
            {
                path: "/visa",
                element: <VisaTypePage />,
            },
            {
                path: "/visa/nationalities",
                element: <B2cVisaNationalityPage />,
            },
            {
                path: "/visa/nationalities/:id/edit",
                element: <AddVisaTypeNationality />,
            },
            {
                path: "/visa/nationalities/:id/edit/:section/add",
                element: <AddVisaTypeNationalityPage />,
            },
            {
                path: "/visa/nationalities/:id/edit/:section/edit/:visaId",
                element: <EditVisaTypeNationalityPage />,
            },
            {
                path: "/visa/add",
                element: <VisaAddPage />,
            },
            {
                path: "/visa/:id/edit",
                element: <VisaAddPage />,
            },
            {
                path: "/visa/country",
                element: <VisaCountry />,
            },
            {
                path: "/visa/country/add",
                element: <VisaAddCountryPage />,
            },
            {
                path: "/visa/country/:id/edit",
                element: <VisaAddCountryPage />,
            },
            {
                path: "/visa/request",
                element: <VisaRequestPage />,
            },
            {
                path: "/visa/:orderedBy/:id/application/:travellerId",
                element: <SingleVisaApplication />,
            },
            {
                path: "/visa/enquires",
                element: <VisaEnquiryPage />,
            },
            {
                path: "/a2a",
                element: <A2AListPage />,
            },
            {
                path: "/a2a/:id",
                element: <A2ATicketListPage />,
            },
            {
                path: "/a2a/add",
                element: <AddA2APage />,
            },
            {
                path: "/a2a/:id/quota/:ticketId",
                element: <A2aQuotaPage />,
            },
            {
                path: "/a2a/:id/add",
                element: <A2aAddTicketPage />,
            },
            {
                path: "/a2a/:id/edit/:ticketId",
                element: <A2AEditTicketPage />,
            },
            {
                path: "/a2a/enquiry",
                element: <A2AEnquiryPage />,
            },
            {
                path: "/a2a/summary",
                element: <A2aSummaryPage />,
            },
            {
                path: "/vouchers",
                element: (
                    <PrivateRoute name="tour-schedules" permission="view">
                        <VouchersListPage />
                    </PrivateRoute>
                ),
            },
            {
                path: "/vouchers/daily-reports",
                element: (
                    <PrivateRoute name="daily-reports" permission="view">
                        <VouchersDailyReportPage />
                    </PrivateRoute>
                ),
            },
            {
                path: "/vouchers/add",
                element: (
                    <PrivateRoute name="tour-schedules" permission="create">
                        <AddVoucherPage />
                    </PrivateRoute>
                ),
            },
            {
                path: "/vouchers/:id",
                element: (
                    <PrivateRoute name="tour-schedules" permission="view">
                        <SingleVoucherPage />
                    </PrivateRoute>
                ),
            },
            {
                path: "/vouchers/:id/edit",
                element: (
                    <PrivateRoute name="tour-schedules" permission="update">
                        <EditVoucherPage />
                    </PrivateRoute>
                ),
            },
            {
                path: "/markup/profile",
                element: <ProfileListPage />,
            },
            {
                path: "/markup/profile/add",
                element: <AddMarkupProfilePage />,
            },
            {
                path: "/markup/profile/:profileId/edit",
                element: <EditMarkupProfilePage />,
            },
            {
                path: "/refund/list",
                element: <RefundPage />,
            },
            { path: "/blogs", element: <BlogsPage /> },
            { path: "/blogs/add", element: <AddBlogPage /> },
            { path: "/blogs/:id/edit", element: <EditBlogPage /> },
            { path: "/blogs/categories", element: <BlogsCategoriesPage /> },
            {
                path: "/countries",
                element: (
                    <PrivateRoute name="countries" permission="view">
                        <CountriesPage />
                    </PrivateRoute>
                ),
            },
            {
                path: "/destinations",
                element: <DestinationsPage />,
            },
            { path: "/subscribers", element: <SubscribersPage /> },
            {
                path: "/home/settings/logo",
                element: <LogoSettingsPage />,
            },
            {
                path: "/home/settings/hero",
                element: <HeroSettingsPage />,
            },
            {
                path: "/home/settings/cards",
                element: <CardsSettingsPage />,
            },
            {
                path: "/home/settings/cards/add",
                element: <AddCardSettingsPage />,
            },
            {
                path: "/home/settings/cards/:id/edit",
                element: <EditCardSettingsPage />,
            },
            {
                path: "/home/settings/sections",
                element: <SectionsSettingsPage />,
            },
            {
                path: "/home/settings/footer",
                element: <FooterSettingsPage />,
            },
            {
                path: "/home/settings/contact-details",
                element: <OtherDetailsSettingsPage />,
            },
            { path: "/users", element: <UsersPage /> },
            { path: "/coupons", element: <CouponsPage /> },
            { path: "/drivers", element: <DriversPage /> },
            {
                path: "/admins",
                element: <AdminsListPage />,
            },
            {
                path: "/admins/add",
                element: <AddAdminPage />,
            },
            {
                path: "/admins/:id/edit",
                element: <EditAdminPage />,
            },
            {
                path: "/admins/roles",
                element: <AdminRolesPage />,
            },
            {
                path: "/admins/roles/add",
                element: <AddAdminRolePage />,
            },
            {
                path: "/admins/roles/:id/edit",
                element: <EditAdminRolePage />,
            },
            { path: "/profile", element: <ProfilePage /> },
            {
                path: "/profile/edit",
                element: <EditProfileLayout />,
                children: [
                    {
                        path: "",
                        element: <EditProfilePage />,
                    },
                    {
                        path: "password",
                        element: <ChangePasswordPage />,
                    },
                ],
            },
            {
                path: "/currencies",
                element: <CurrenciesPage />,
            },
            {
                path: "/b2b",
                element: <B2bListPage />,
            },
            {
                path: "/b2b/add",
                element: <AddResellerPage />,
            },
            {
                path: "/b2b/:id/edit",
                element: <UpdateResellerDetailsPage />,
            },
            {
                path: "/b2b/:id/edit/configurations",
                element: <UpdateResellerConfigPage />,
            },
            {
                path: "/b2b/:id",
                element: <SingleResellerLayout />,
                children: [
                    { path: "details", element: <SingleResellerDetailsPage /> },
                    {
                        path: "transactions",
                        element: <SingleResellerTransactionsPage />,
                    },
                    {
                        path: "attractions-ticket-orders",
                        element: <SingleResellerAttractionTicketOrdersPage />,
                    },
                    {
                        path: "attractions-booking-orders",
                        element: <SingleResellerAttractionBookingOrdersPage />,
                    },
                    {
                        path: "sub-agents",
                        element: <SingleResellerSubAgentsPage />,
                    },
                    {
                        path: "special-markup",
                        element: <SpecialMarkupPage />,
                    },
                    {
                        path: "special-markup/profile/edit",
                        element: <EditB2bMarkupProfilePage />,
                    },
                    {
                        path: "admin-access",
                        element: <SingleResellerAdminAccessPage />,
                    },
                ],
            },
            {
                path: "/b2b/:id/sub-agents/add",
                element: <AddSubAgentPage />,
            },
            {
                path: "/b2b/configurations",
                element: <B2bConfigurationPage />,
            },
            {
                path: "/sub-agents",
                element: <SubAgentsListPage />,
            },
            // {
            //     path: "/sub-agents/:id",
            //     element: <SingleResellerLayout />,
            //     children: [
            //         { path: "details", element: <SingleResellerDetailsPage /> },
            //         {
            //             path: "transactions",
            //             element: <SingleResellerTransactionsPage />,
            //         },
            //         {
            //             path: "attractions-ticket-orders",
            //             element: <SingleResellerAttractionTicketOrdersPage />,
            //         },
            //         {
            //             path: "attractions-booking-orders",
            //             element: <SingleResellerAttractionBookingOrdersPage />,
            //         },
            //     ],
            // },
            {
                path: "/email-settings",
                element: <EmailSettingsPage />,
            },
            {
                path: "/email-settings/services",
                element: <EmailSettingsServicesPage />,
            },
            {
                path: "/email-settings/emails",
                element: <EmailSettingsEmailsPage />,
            },
            // {
            //     path: "/email-settings/compose",
            //     element: <ComposeEmailPage />,
            // },
            // {
            //     path: "/email-settings/sent",
            //     element: <SentEmailsListPage />,
            // },
            {
                path: "/transactions",
                element: <TransactionsPage />,
            },
            {
                path: "/payment-settings/services",
                element: <PaymentServicesPage />,
            },
            {
                path: "/otp-settings",
                element: <OtpSettingsPage />,
            },
            {
                path: "/api-master",
                element: <ApisListPage />,
            },
            {
                path: "/api-master/add",
                element: <AddApiPage />,
            },
            {
                path: "/api-master/:id/edit",
                element: <EditApiPage />,
            },
            {
                path: "/withdraw-requests",
                element: <WithdrawRequestPage />,
            },
            {
                path: "/attractions/itineraries",
                element: <AttractionItinerariesPage />,
            },
            {
                path: "/attractions/itineraries/add",
                element: <AddAttractionItineraryPage />,
            },
            {
                path: "/attractions/itineraries/:id/edit",
                element: <EditAttractionItineraryPage />,
            },
            {
                path: "/flights/bookings",
                element: <FlightBookingsListPage />,
            },
            {
                path: "/flights/bookings/:bookingId",
                element: <SingleFlightBookingDetailsPage />,
            },
            {
                path: "/airports",
                element: <AirportsListPage />,
            },
            {
                path: "/airports/add",
                element: <AddAirportPage />,
            },
            {
                path: "/airports/:id/edit",
                element: <EditAirportPage />,
            },
            {
                path: "/airports/:id/terminal",
                element: <TerminalPage />,
            },
            {
                path: "/airlines",
                element: <AirlinesListPage />,
            },
            {
                path: "/airlines/add",
                element: <AddAirlinePage />,
            },
            {
                path: "/airlines/:id/edit",
                element: <EditAirlinePage />,
            },
            {
                path: "/attractions/tickets/inventory",
                element: <AttractionTicketInventoryPage />,
            },
            {
                path: "/countries/:countryId/states",
                element: <StatesPage />,
            },
            {
                path: "/countries/:countryId/states/:stateId/cities",
                element: <CitiesPage />,
            },
            {
                path: "/countries/:countryId/states/:stateId/cities/:cityId/areas",
                element: <AreasPage />,
            },

            //transfer

            {
                path: "/transfers",
                element: <TransferListPage />,
            },
            {
                path: "/transfers/add",
                element: <AddTransferPage />,
            },
            {
                path: "/transfers/area-group/add",
                element: <AddGroupPage />,
            },
            {
                path: "/transfers/area-group/:id/edit",
                element: <EdiGroupAreaPage />,
            },
            {
                path: "/transfers/area-group",
                element: <GroupAreaListPage />,
            },
            {
                path: "/transfers/:id/edit",
                element: <EditTransferPage />,
            },
            {
                path: "/transfers/vehicle",
                element: <VehicleList />,
            },
            {
                path: "/transfers/vehicle/add",
                element: <AddVehiclePage />,
            },
            {
                path: "/transfers/vehicle/:id/edit",
                element: <EditVehiclePage />,
            },

            //quotation

            {
                path: "/quotations",
                element: <QuotationListPage />,
            },
            {
                path: "/quotations/dashboard",
                element: <QuotationDashboard />,
            },
            {
                path: "/quotations/:quotationNumber",
                element: <SingleQuotationDetailPage />,
            },
            {
                path: "/quotations/:quotationNumber/email/:amendementNumber",
                element: <QuotationSingleEmailPage />,
            },
            {
                path: "/quotations/:quotationNumber/edit/:amendementNumber",
                element: <EditQuotationPage />,
            },
            {
                path: "/quotations/add",
                element: <AddQuotationPage />,
            },

            // Insurance
            {
                path: "/insurance/plans",
                element: <InsurancePlanListingPage />,
            },
            {
                path: "/insurance/enquiries",
                element: <InsursanceEnquiryPage />,
            },
            {
                path: "/insurance/enquiries/:contractId",
                element: <SingelInsuranceEnquiryDetailsPage />,
            },

            //affiliate

            {
                path: "/affiliate/settings",
                element: <AffiliateSettingsPage />,
            },

            {
                path: "/affiliate/products",
                element: <AffiliateProductPage />,
            },
            {
                path: "/affiliate/reports",
                element: <AffiliateReportPage />,
            },
            {
                path: "/affiliate/redeem/requests",
                element: <AffiliateReedemRequestPage />,
            },

            //users

            {
                path: "/users/:id",
                element: <SingleUserLayout />,
                children: [
                    { path: "details", element: <SingleUserDetailsPage /> },
                    {
                        path: "transactions",
                        element: <SingleResellerTransactionsPage />,
                    },
                    {
                        path: "attractions-ticket-orders",
                        element: <SingleUserAttractionTicketOrdersPage />,
                    },
                    {
                        path: "attractions-booking-orders",
                        element: <SingleUserAttractionBookingOrdersPage />,
                    },
                ],
            },
            ,
        ],
    },
    {
        path: "/attractions/itineraries/:id/preview",
        element: <SingleAttractionItineraryPage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/page-not-found",
        element: <ErrorPage />,
    },
    {
        path: "/attractions/:id/activities/:activityId/tickets/:ticketId",
        element: <AttractionSingleTicketPage />,
    },
];

export default ThemeRoutes;
