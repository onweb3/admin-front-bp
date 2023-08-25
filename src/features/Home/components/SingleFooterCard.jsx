import React, { useState } from "react";
import { BiEditAlt, BiPlus } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import FooterLinkModal from "./FooterLinkModal";

export default function SingleFooterCard({
    item,
    footerIndex,
    setFooterModal,
    setSelectedFooter,
    footer,
    setFooter,
}) {
    const [navLinks, setNavLinks] = useState(item);
    const [footerLinkModal, setFooterLinkModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectLink, setSelectedLink] = useState({
        navIndex: "",
        link: {},
    });

    const deleteFooter = (index) => {
        const filteredFooter = footer.filter((_, footIndex) => {
            return index !== footIndex;
        });
        setFooter(filteredFooter);
    };

    const addNewNavLink = (navLink) => {
        let tempFooter = footer;
        tempFooter[footerIndex]?.navLinks?.push(navLink);
        setFooter(tempFooter);
    };

    const updateNavLink = (navIndex, navLink) => {
        let tempFooter = footer;
        tempFooter[footerIndex].navLinks[navIndex] = navLink;
    };

    const deleteNavLink = (navIndex) => {
        let tempFooter = [...footer];
        const filteredNavLinks = tempFooter[footerIndex]?.navLinks?.filter(
            (_, index) => {
                return navIndex !== index;
            }
        );
        tempFooter[footerIndex].navLinks = filteredNavLinks;
        setFooter(tempFooter);
    };

    return (
        <div>
            <div className="px-2 py-2 bg-[#f3f6f9] flex items-center justify-between">
                <span className="flex items-center gap-[14px] text-[14px]">
                    {item?.title}
                    <div className="flex items-center gap-[5px]">
                        <span
                            className="text-base text-grayColor cursor-pointer hover:text-textColor"
                            onClick={() => {
                                setSelectedFooter({
                                    footerIndex,
                                    footer: item,
                                });
                                setFooterModal({
                                    isOpen: true,
                                    isEdit: true,
                                });
                            }}
                        >
                            <BiEditAlt />
                        </span>
                    </div>
                </span>
                <div className="flex items-center gap-[10px]">
                    <button
                        className="bg-transparent text-textColor text-xl hover:text-red-500"
                        onClick={() => deleteFooter(footerIndex)}
                    >
                        <MdDelete />
                    </button>
                    <button
                        className="bg-transparent text-textColor text-xl hover:text-green-500"
                        onClick={() =>
                            setFooterLinkModal({ isOpen: true, isEdit: false })
                        }
                    >
                        <BiPlus />
                    </button>
                </div>
            </div>
            <ul className="text-sm mt-4">
                {item?.navLinks?.map((link, navIndex) => {
                    return (
                        <li
                            key={navIndex}
                            className="mt-4 flex items-center gap-[10px]"
                        >
                            <span>{link?.name}</span>
                            <div className="flex items-center gap-[5px]">
                                <span
                                    className="text-base text-grayColor cursor-pointer hover:text-textColor"
                                    onClick={() => deleteNavLink(navIndex)}
                                >
                                    <MdDelete />
                                </span>
                                <span
                                    className="text-base text-grayColor cursor-pointer hover:text-textColor"
                                    onClick={() => {
                                        setSelectedLink({
                                            navIndex,
                                            link,
                                        });
                                        setFooterLinkModal({
                                            isOpen: true,
                                            isEdit: true,
                                        });
                                    }}
                                >
                                    <BiEditAlt />
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {footerLinkModal?.isOpen && (
                <FooterLinkModal
                    footerLinkModal={footerLinkModal}
                    setFooterLinkModal={setFooterLinkModal}
                    addNewNavLink={addNewNavLink}
                    updateNavLink={updateNavLink}
                    selectedLink={selectLink}
                />
            )}
        </div>
    );
}
