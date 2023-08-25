import React, { useRef } from "react";
import { MdClose } from "react-icons/md";
import { useHandleClickOutside } from "../../../hooks";

export default function BalanceModal({ setIsBalanceModalOpen, balanceDetail }) {
      const wrapperRef = useRef();
      useHandleClickOutside(wrapperRef, () => setIsBalanceModalOpen(false));

      console.log(setIsBalanceModalOpen, "setIsBalanceModalOpen");

      return (
            <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
                  <div
                        ref={wrapperRef}
                        className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
                  >
                        <div className="flex items-center justify-between border-b p-4">
                              <h2 className="font-medium mb-2">
                                    Balance DetailS
                              </h2>
                              <button
                                    className="h-auto bg-transparent text-textColor text-xl"
                                    onClick={() => setIsBalanceModalOpen(false)}
                              >
                                    <MdClose />
                              </button>
                        </div>
                        <div className="p-4 flex flex-col justify-center item-center">
                              <table>
                                    <tr>
                                          <td className="pr-2 py-2 text-gray-500">
                                                Advanced Deposit
                                          </td>
                                          <td className="p-2">:</td>
                                          <td className="pl-2 py-2">
                                                {balanceDetail.advancedDeposit}
                                          </td>
                                    </tr>
                                    <tr>
                                          <td className="pr-2 py-2 text-gray-500">
                                                Total Open
                                          </td>
                                          <td className="p-2">:</td>
                                          <td className="pl-2 py-2">
                                                {balanceDetail.totalOpen}
                                          </td>
                                    </tr>
                                    <tr>
                                          <td className="pr-2 py-2 text-gray-500">
                                                Total Paid
                                          </td>
                                          <td className="p-2">:</td>
                                          <td className="pl-2 py-2">
                                                {balanceDetail.totalPaid}
                                          </td>
                                    </tr>
                                    <tr>
                                          <td className="pr-2 py-2 text-gray-500">
                                                Grace Period Days
                                          </td>
                                          <td className="p-2">:</td>
                                          <td className="pl-2 py-2">
                                                {balanceDetail.gracePeriodDays}
                                          </td>
                                    </tr>
                                    <tr>
                                          <td className="pr-2 py-2 text-gray-500">
                                                Total Credit
                                          </td>
                                          <td className="p-2">:</td>
                                          <td className="pl-2 py-2">
                                                {balanceDetail.totalCredit}
                                          </td>
                                    </tr>
                                    <tr>
                                          <td className="pr-2 py-2 text-gray-500">
                                                Total Available
                                          </td>
                                          <td className="p-2">:</td>
                                          <td className="pl-2 py-2">
                                                {balanceDetail.totalAvailable}
                                          </td>
                                    </tr>
                                    <tr>
                                          <td className="pr-2 py-2 text-gray-500">
                                                Total Activity
                                          </td>
                                          <td className="p-2">:</td>
                                          <td className="pl-2 py-2">
                                                {balanceDetail.totalActivity}
                                          </td>
                                    </tr>
                                    <tr>
                                          <td className="pr-2 py-2 text-gray-500">
                                                Balance
                                          </td>
                                          <td className="p-2">:</td>
                                          <td className="pl-2 py-2">
                                                {balanceDetail.balance}
                                          </td>
                                    </tr>
                                    <tr>
                                          <td className="pr-2 py-2 text-gray-500">
                                                Credit Days
                                          </td>
                                          <td className="p-2">:</td>
                                          <td className="pl-2 py-2">
                                                {balanceDetail.creditDays}
                                          </td>
                                    </tr>
                              </table>
                        </div>
                  </div>
            </div>
      );
}
