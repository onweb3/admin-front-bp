import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
// import { config } from "../../constants";
import WhatsappAddModal from "../../features/Whatsapp/compnents/WhatsappAddModal";
import { AiFillEdit, AiOutlineLogout } from "react-icons/ai";
export default function WhatsappClientListPage() {
  const [whatsappLists, setWhatsappLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    skip: 0,
    limit: 10,
    totalAirlines: 0,
    searchQuery: "",
  });
  const [error, setError] = useState("");

  const [isModal, setIsModal] = useState(false);

  const { jwtToken } = useSelector((state) => state.admin);

  const fetchList = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/whatsapp-service/all", {
        headers: { authorization: `Bearer ${jwtToken}` },
      });

      setWhatsappLists(response?.data);

      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = async (id) => {
    try {
      const isConfirm = window.confirm("Are you sure ?");
      if (isConfirm) {
        let response = await axios.delete(`/whatsapp-service/logout`, {
          headers: { authorization: `Bearer ${jwtToken}` },
        });

        if (response.data === true) {
          const updatedWhatsappLists = whatsappLists.map((item, index) => {
            if (index === 0) {
              return { ...item, status: false };
            } else {
              return item;
            }
          });
          setWhatsappLists(updatedWhatsappLists);
        }
      }
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong, Try again");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div>
      <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
        <h1 className="font-[600] text-[15px] uppercase">Whatsapp Lists</h1>
        <div className="text-sm text-grayColor">
          <Link to="/" className="text-textColor">
            Dashboard{" "}
          </Link>
          <span>{">"} </span>
          <span>Whatsapp</span>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded shadow-sm">
          <div className="flex items-center justify-between border-b border-dashed p-4">
            <h1 className="font-medium">All Whatsapp List</h1>
            <div className="flex items-center gap-3">
              {/* <button
                                className="px-3"
                                onClick={() => {
                                    setIsModal(true);
                                }}
                            >
                                + Add Whatsapp
                            </button> */}
            </div>
          </div>
          {isLoading ? (
            <PageLoader />
          ) : whatsappLists?.length < 1 ? (
            <div className="p-6 flex flex-col items-center">
              <span className="text-sm text-grayColor block mt-[6px]">
                Oops.. No Whatsapp Found
              </span>
            </div>
          ) : (
            <div>
              <table className="w-full">
                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                  <tr>
                    <th className="font-[500] p-3">Name</th>
                    <th className="font-[500] p-3">Phone Code</th>
                    <th className="font-[500] p-3">Phone Number</th>{" "}
                    <th className="font-[500] p-3">Status</th>
                    <th className="font-[500] p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {whatsappLists?.map((whatsapp, index) => {
                    console.log(whatsapp, "whatsapp");
                    return (
                      <tr
                        key={index}
                        className="border-b border-tableBorderColor"
                      >
                        <td className="p-3">{whatsapp?.name}</td>
                        <td className="p-3 uppercase">{whatsapp?.phoneCode}</td>
                        <td className="p-3 uppercase">
                          {whatsapp?.phoneNumber}
                        </td>
                        <td
                          className={`p-3 uppercase ${
                            whatsapp?.status === true
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {whatsapp?.status === true ? "Active" : "NonActive"}
                        </td>

                        <td className="p-3">
                          <div className="flex gap-[10px]">
                            {whatsapp?.status === true ? (
                              <button
                                className="h-auto bg-transparent text-red-500 text-xl"
                                onClick={logout}
                              >
                                <AiOutlineLogout />{" "}
                              </button>
                            ) : (
                              <button
                                className="h-auto bg-transparent text-green-500 text-xl"
                                onClick={() => {
                                  setIsModal(true);
                                }}
                              >
                                <AiFillEdit />{" "}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {error && (
                <span className="text-sm block text-red-500 mt-2">{error}</span>
              )}
            </div>
          )}
        </div>
      </div>
      {isModal && (
        <WhatsappAddModal
          isModal={isModal}
          setIsModal={setIsModal}
          setWhatsappLists={setWhatsappLists}
          whatsappLists={whatsappLists}
        />
      )}
    </div>
  );
}
