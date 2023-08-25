import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import axios from "../../axios";

import { PageLoader, Pagination } from "../../components";
import WithdrawRequestSingleRow from "../../features/WithdrawRequests/components/WithdrawRequestSingleRow";

export default function WithdrawRequestPage() {
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  const [filters, setFilters] = useState({
    skip: 0,
    limit: 10,
    name: "",
    status: "",
    totalWithdrawRequests: 0,
  });
  const { jwtToken } = useSelector((state) => state.admin);
  const [searchParams, setSearchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);

  const fetchWithdrawalRequests = async ({ skip, limit, name, status }) => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        `/wallets/b2b/withdraw-request/all?skip=${skip}&limit=${limit}&search=${name}&status=${status}`,
        {
          headers: { authorization: `Bearer ${jwtToken}` },
        }
      );

      setWithdrawRequests(response.data.walletRequestDetails);
      setFilters((prev) => {
        return {
          ...prev,
          totalWithdrawRequests: response.data.totalWithdrawRequests,
        };
      });

      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    let params = prevSearchParams();
    setSearchParams({
      ...params,
      [e.target.name]: e.target.value,
      skip: 0,
    });
  };

  const prevSearchParams = (e) => {
    let params = {};
    for (let [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    return params;
  };

  useEffect(() => {
    let skip =
      Number(searchParams.get("skip")) > 0
        ? Number(searchParams.get("skip")) - 1
        : 0;
    let limit =
      Number(searchParams.get("limit")) > 0
        ? Number(searchParams.get("limit"))
        : 10;
    let name = searchParams.get("name") || "";
    let status = searchParams.get("status") || "";

    setFilters((prev) => {
      return { ...prev, skip, limit, name, status };
    });
    fetchWithdrawalRequests({ skip, limit, name, status });
  }, [searchParams]);

  console.log(withdrawRequests, "withdrawRequests");

  return (
    <div>
      <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
        <h1 className="font-[600] text-[15px] uppercase">Withdraw Requests</h1>

        <div className="text-sm text-grayColor">
          <Link to="/" className="text-textColor">
            Dashboard{" "}
          </Link>
          <span>{">"} </span>
          <span>Withdraw Requests</span>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded shadow-sm">
          <div className="flex items-center justify-between border-b border-dashed p-4">
            <h1 className="font-medium">All Withdraw Requests</h1>
            <div className="flex items-center gap-[10px]">
              <select
                name="status"
                value={filters.status || ""}
                onChange={handleChange}
                id=""
              >
                <option value="">All</option>
                <option value="initiated">Initiated</option>
                <option value="pending">Pending</option>

                <option value="approved">Approved</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <input
                type="text"
                placeholder=" Reference Number..."
                className="min-w-[200px]"
                name="name"
                onChange={handleChange}
                value={filters.name || ""}
              />
            </div>
          </div>
          {isLoading ? (
            <PageLoader />
          ) : withdrawRequests?.length < 1 ? (
            <div className="p-6 flex flex-col items-center">
              <span className="text-sm text-grayColor block mt-[6px]">
                Oops.. No Withdraw Requests Found
              </span>
            </div>
          ) : (
            <div>
              <table className="w-full">
                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                  <tr>
                  <th className="font-[500] p-3">Refrence No</th>
                    <th className="font-[500] p-3">Reseller Name</th>
                    <th className="font-[500] p-3">Amount</th>
                    <th className="font-[500] p-3">Date</th>
                    <th className="font-[500] p-3">View</th>
                    <th className="font-[500] p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {withdrawRequests?.map((request, index) => {
                    return (
                      <WithdrawRequestSingleRow key={index} request={request} />
                    );
                  })}
                </tbody>
              </table>

              <div className="p-4">
                <Pagination
                  limit={filters?.limit}
                  skip={filters?.skip}
                  total={filters?.totalWithdrawRequests}
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
          )}
        </div>
      </div>
    </div>
  );
}
