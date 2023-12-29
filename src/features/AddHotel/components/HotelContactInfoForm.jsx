import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsFillArrowRightCircleFill } from "react-icons/bs";

import {
    addAccountsContact,
    addHotelContact,
    addReservationsContact,
    addSalesContact,
    handleAccountsDataChange,
    handleHotelContactDataChange,
    handleReservationsDataChange,
    handleSalesDataChange,
    removeAccountsContact,
    removeHotelContact,
    removeReservationsContact,
    removeSalesContact,
} from "../../../redux/slices/hotelFormSlice";
import MultiContactForm from "./MultiContactForm";

export default function HotelContactInfoForm({ selectedSection, isEditPermission = true }) {
    const { accountsContacts, salesContacts, reservationsContacts, hotelContacts } = useSelector(
        (state) => state.hotelForm
    );
    const dispatch = useDispatch();

    return (
        <div className={selectedSection === "-contact" ? "block" : "hidden"}>
            <div className="">
                <h1 className="font-[600] flex items-center gap-[10px] mb-3">
                    <BsFillArrowRightCircleFill /> Hotel Contact
                </h1>
                <MultiContactForm
                    data={hotelContacts}
                    addItem={() => dispatch(addHotelContact())}
                    removeItem={(indx) => dispatch(removeHotelContact(indx))}
                    handleChange={({ index, name, value }) =>
                        dispatch(handleHotelContactDataChange({ index, name, value }))
                    }
                    isEditPermission={isEditPermission}
                />
            </div>

            <div className="mt-8">
                <h1 className="font-[600] flex items-center gap-[10px] mb-3">
                    <BsFillArrowRightCircleFill /> Sales Contact
                </h1>
                <MultiContactForm
                    data={salesContacts}
                    addItem={() => dispatch(addSalesContact())}
                    removeItem={(indx) => dispatch(removeSalesContact(indx))}
                    handleChange={({ index, name, value }) =>
                        dispatch(handleSalesDataChange({ index, name, value }))
                    }
                    isEditPermission={isEditPermission}
                />
            </div>

            <div className="mt-8">
                <h1 className="font-[600] flex items-center gap-[10px] mb-3">
                    <BsFillArrowRightCircleFill /> Accounts Contact
                </h1>
                <MultiContactForm
                    data={accountsContacts}
                    addItem={() => dispatch(addAccountsContact())}
                    removeItem={(indx) => dispatch(removeAccountsContact(indx))}
                    handleChange={({ index, name, value }) =>
                        dispatch(handleAccountsDataChange({ index, name, value }))
                    }
                    isEditPermission={isEditPermission}
                />
            </div>

            <div className="mt-8">
                <h1 className="font-[600] flex items-center gap-[10px] mb-3">
                    <BsFillArrowRightCircleFill /> Reservation Contact
                </h1>
                <MultiContactForm
                    data={reservationsContacts}
                    addItem={() => dispatch(addReservationsContact())}
                    removeItem={(indx) => dispatch(removeReservationsContact(indx))}
                    handleChange={({ index, name, value }) =>
                        dispatch(handleReservationsDataChange({ index, name, value }))
                    }
                    isEditPermission={isEditPermission}
                />
            </div>
        </div>
    );
}
