import React, { useEffect } from "react";
import { useState } from "react";
import { PageLoader, Pagination } from "../../components";
import { Link, useSearchParams } from "react-router-dom";
import {
  VisaCountrySingleRow,
  VisaTypeListSingleRow,
} from "../../features/Visa";
import { useSelector } from "react-redux";

import axios from "../../axios";

function VisaCountry() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleted , setIsDeleted] = useState(false)
  const [visaList, setVisaList] = useState([]);
  const [filters, setFilters] = useState({
    skip: 0,
    limit: 10,
    totalVisaList: 0,
     name : ""
});

const [searchParams, setSearchParams] = useSearchParams();
const { jwtToken } = useSelector((state) => state.admin);

const prevSearchParams = (e) => {
    let params = {};
    for (let [key, value] of searchParams.entries()) {
        params[key] = value;
    }
    return params;
};

const handleChange = (e) => {
    let params = prevSearchParams();
    setSearchParams({
        ...params,
        [e.target.name]: e.target.value,
        skip: 0,
    });
};
  const fetchVisaCountry = async ({skip, limit, name}) => {
    try {
      setIsLoading(true);

      const response = await axios.get(`/visa/all?skip=${skip}&limit=${limit}&search=${name}`, {
        headers: { authorization: `Bearer ${jwtToken}` },
      });
      setVisaList(response.data.visaList);
      setFilters((prev) => {
        return {
          ...prev,
          totalVisaList: response.data?.totalVisaList,
        };
      });
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
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

    setFilters((prev) => {
        return { ...prev, skip, limit, name };
    });
    fetchVisaCountry({ skip, limit, name });
}, [searchParams, isDeleted]);


  return (
    <div>
      <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
        <h1 className="font-[600] text-[15px] uppercase">Visa</h1>
        <div className="text-sm text-grayColor">
          <Link to="/" className="text-textColor">
            Dashboard{" "}
          </Link>
          <span>{">"} </span>
          <span>Visa-Country</span>
        </div>
      </div>

      {isLoading ? (
        <div>
          <PageLoader />
        </div>
      ) : (
        <div className="p-6">
          <div className="bg-white rounded shadow-sm">
            <div className="flex items-center justify-between border-b border-dashed p-4">
              <h1 className="font-medium">Visa Countries</h1>
              <div className="flex items-center gap-[15px]">
                <form action="" className="flex items-center gap-[10px]">
                  <input type="text" 
                   name="name"
                   value={filters.name || ""}
                   onChange={handleChange} placeholder="Search here..." />
                  <button className="px-5">Search</button>
                </form>
                <Link to={`/visa/country/add`}>
                  <button className="w-[130px] bg-orange-500">
                    + Add Country
                  </button>
                </Link>
              </div>
            </div>
            {/* {attractions?.length < 1 ? (
                                <div className="p-6 flex flex-col items-center">
                                    <span className="text-sm text-grayColor block mt-[6px]">
                                        Oops.. No Attractions found
                                    </span>
                                </div>
                            ) : ( */}
            <div>
              <table className="w-full">
                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                  <tr>
                    <th className="font-[500] p-3">Iso</th>
                    <th className="font-[500] p-3">Country</th>
                    <th className="font-[500] p-3">Name</th>
                    <th className="font-[500] p-3">Description </th>
                    <th className="font-[500] p-3">Sample Visa</th>
                    {/* <th className="font-[500] p-3">
                      B2C Price
                    </th> */}
                    <th className="font-[500] p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {visaList?.map((visaList, index) => {
                    return (
                      <VisaCountrySingleRow
                        visaList={visaList}
                        key={visaList._id}
                        setIsDeleted= {setIsDeleted} 
                        isDeleted={isDeleted}
                      />
                    );
                  })}
                </tbody>
              </table>

              <div className="p-4">
                <Pagination
                limit={filters?.limit}
                skip={filters?.skip}
                total={filters?.totalVisaList}
                incOrDecSkip={(number) =>
                    setSearchParams((prev) => {
                        return {
                            ...prev,
                            skip:
                                filters.skip +
                                number +
                                1,
                        };
                    })
                }
                updateSkip={(skip) =>
                    setSearchParams((prev) => {
                        return {
                            ...prev,
                            skip: skip + 1,
                        };
                    })
                }
                />
              </div>
            </div>
            {/* )} */}
          </div>
        </div>
      )}
    </div>
  );
}

export default VisaCountry;
