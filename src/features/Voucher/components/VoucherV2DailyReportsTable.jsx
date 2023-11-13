import React from "react";

import { Pagination } from "../../../components";
import VoucherV2DailyReportsTableRow from "./VoucherV2DailyReportsTableRow";

export default function VoucherV2DailyReportsTable({ vouchers, filters, setFilters }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                    <tr>
                        <th className="font-[500] p-3">#</th>
                        <th className="font-[500] p-3">Ref Number</th>
                        <th className="font-[500] p-3">On Date</th>
                        <th className="font-[500] p-3">Passenger Name</th>
                        <th className="font-[500] p-3">Tour Name</th>
                        <th className="font-[500] p-3 whitespace-nowrap">Pickup Time</th>
                        <th className="font-[500] p-3 whitespace-nowrap">Return Time</th>
                        <th className="font-[500] p-3">Pickup From</th>
                        <th className="font-[500] p-3">Status</th>
                        <th className="font-[500] p-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {vouchers?.map((voucher, index) => {
                        return (
                            <VoucherV2DailyReportsTableRow
                                key={index}
                                voucher={voucher}
                                index={index}
                                filters={filters}
                            />
                        );
                    })}
                </tbody>
            </table>

            <div className="p-4">
                <Pagination
                    limit={filters?.limit}
                    skip={filters?.skip}
                    total={filters?.totalVouchers}
                    incOrDecSkip={(number) =>
                        setFilters((prev) => {
                            return {
                                ...prev,
                                skip: prev.skip + number,
                            };
                        })
                    }
                    updateSkip={(skip) =>
                        setFilters((prev) => {
                            return { ...prev, skip };
                        })
                    }
                />
            </div>
        </div>
    );
}
