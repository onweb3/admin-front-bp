import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useHandleClickOutside } from "../../hooks";
import { changeCurrency } from "../../redux/slices/generalSlice";

export default function CurrenciesDropdown({ setIsCurrenciesDropdownOpen }) {
    const { currencies } = useSelector((state) => state.general);

    const dispatch = useDispatch();
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setIsCurrenciesDropdownOpen(false));

    return (
        <div
            className="absolute z-10 right-0 bg-white shadow-[0_5px_10px_rgb(30_32_37_/_12%)] rounded min-w-[180px] py-2"
            ref={wrapperRef}
        >
            {currencies?.map((currency, index) => {
                return (
                    <div
                        key={index}
                        className="flex items-center gap-[10px] text-sm py-[6px] px-4 cursor-pointer hover:bg-[#f3f6f9]"
                        onClick={() => {
                            dispatch(changeCurrency(currency));
                            setIsCurrenciesDropdownOpen(false);
                        }}
                    >
                        <img
                            src={currency?.country?.flag}
                            alt=""
                            className="w-[25px]"
                        />
                        {currency?.isocode} ({currency?.currencySymbol})
                    </div>
                );
            })}
        </div>
    );
}
