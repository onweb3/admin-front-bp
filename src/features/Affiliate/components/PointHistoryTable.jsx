import React from "react";

import { Pagination } from "../../../components";
import PointHistoryRow from "./PointHistoryRow";

export default function PointHistoryTable({
    orders,
    filters,
    setFilters,
    section,
}) {
    return (
        <div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                        <tr>
                            <th className="font-[500] p-3">Index</th>
                            <th className="font-[500] p-3">Transation </th>
                            <th className="font-[500] p-3">Points</th>
                            <th className="font-[500] p-3">Previous Points</th>
                            <th className="font-[500] p-3">Transation Type</th>
                            <th className="font-[500] p-3">Status</th>
                            <th className="font-[500] p-3">Date </th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {orders?.map((order, index) => {
                            return (
                                <PointHistoryRow
                                    key={order?._id}
                                    order={order}
                                    index={index}
                                />
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="p-4">
                <Pagination
                    limit={filters?.limit}
                    skip={filters?.skip}
                    total={filters?.totalOrders}
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
