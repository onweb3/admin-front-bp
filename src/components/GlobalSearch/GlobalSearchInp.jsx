import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";

export default function GlobalSearchInp() {
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    return (
        <div>
            <div
                className="relative cursor-text rounded-[0.25rem] w-[280px] h-[35px] border bg-[#f0f0f0] hover:transition-all hover:bg-transparent hover:border hover:border-[#ced4da]"
                onClick={() => setIsSearchModalOpen(true)}
            >
                <div className="flex items-center h-full gap-[5px] pl-[10px]">
                    <span className="">
                        <BiSearch />
                    </span>
                    <span className="text-[13px] text-grayColor">Search</span>
                </div>
                <div className="absolute top-[50%] right-[10px] translate-y-[-50%] flex items-center gap-1">
                    <span className="text-[12px] bg-[#ced4da] rounded px-2">Ctrl</span>
                    <span className="text-[12px] bg-[#ced4da] rounded px-2">K</span>
                </div>
            </div>

            {/* {isSearchModalOpen && <div>Hello</div>} */}
        </div>
    );
}
