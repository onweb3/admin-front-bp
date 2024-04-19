import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
// import { config } from "../../constants";
import { IoPushOutline } from "react-icons/io5";
export default function NotificationListPage() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ id: "", status: false });
  const [filters, setFilters] = useState({
    skip: 0,
    limit: 10,
    totalNotifications: 0,
    searchQuery: "",
  });

  const { jwtToken } = useSelector((state) => state.admin);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/notification/all?skip=${filters.skip}&limit=${filters.limit}&searchQuery=${filters.searchQuery}`,
        {
          headers: { authorization: `Bearer ${jwtToken}` },
        }
      );

      setNotifications(response?.data?.notifications);
      setFilters((prev) => {
        return {
          ...prev,
          totalNotifications: response?.data?.totalNotifications,
        };
      });
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const isConfirm = window.confirm("Are you sure to delete?");
      if (isConfirm) {
        await axios.delete(`/notification/delete/${id}`, {
          headers: { authorization: `Bearer ${jwtToken}` },
        });

        const filteredNotifications = notifications.filter((notification) => {
          return notification?._id !== id;
        });
        setNotifications(filteredNotifications);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const pushNotification = async (id) => {
    try {
      const isConfirm = window.confirm("Are you sure to send notification?");
      if (isConfirm) {
        await axios.get(`/notification/push/${id}`, {
          headers: { authorization: `Bearer ${jwtToken}` },
        });
      }
      setMessage({ id: id, status: true });
      setTimeout(() => {
        setMessage({ id: "", status: false });
      }, 10000);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div>
      <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
        <h1 className="font-[600] text-[15px] uppercase">Notifications</h1>
        <div className="text-sm text-grayColor">
          <Link to="/" className="text-textColor">
            Dashboard{" "}
          </Link>
          <span>{">"} </span>
          <span>Notifications</span>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded shadow-sm">
          <div className="flex items-center justify-between border-b border-dashed p-4">
            <h1 className="font-medium">All Notifications</h1>
            <div className="flex items-center gap-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (filters?.skip !== 0) {
                    setFilters((prev) => {
                      return {
                        ...prev,
                        skip: 0,
                      };
                    });
                  } else {
                    fetchNotifications();
                  }
                }}
                className="flex items-center gap-3"
              >
                <input
                  type="text"
                  placeholder="Search here..."
                  onChange={(e) => {
                    setFilters((prev) => {
                      return {
                        ...prev,
                        searchQuery: e.target.value,
                      };
                    });
                  }}
                  value={filters.searchQuery || ""}
                />
                <button type="submit" className="px-3 bg-primaryColor">
                  Search
                </button>
              </form>
              <Link to="add">
                <button className="px-3">+ Add Notification</button>
              </Link>
            </div>
          </div>
          {isLoading ? (
            <PageLoader />
          ) : notifications?.length < 1 ? (
            <div className="p-6 flex flex-col items-center">
              <span className="text-sm text-grayColor block mt-[6px]">
                Oops.. No Notification Found
              </span>
            </div>
          ) : (
            <div>
              <table className="w-full">
                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                  <tr>
                    <th className="font-[500] p-3">Title</th>
                    <th className="font-[500] p-3">Body</th>
                    <th className="font-[500] p-3">Image</th>
                    <th className="font-[500] p-3">Notiifcation</th>
                    <th className="font-[500] p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {notifications?.map((notification, index) => {
                    return (
                      <tr
                        key={index}
                        className="border-b border-tableBorderColor"
                      >
                        <td className="p-3">{notification?.title}</td>
                        <td className="p-3 uppercase">{notification?.body}</td>
                        <td className="p-3 uppercase">
                          <img
                            src={
                              import.meta.env.VITE_SERVER_URL +
                              notification?.image
                            }
                            alt=""
                            className="w-[40px] h-[40px] rounded object-cover"
                          />{" "}
                        </td>
                        <td
                          className="p-3"
                          onClick={() => {
                            pushNotification(notification._id);
                          }}
                        >
                          {" "}
                          <button className="h-auto bg-transparent text-green-500 text-xl">
                            <IoPushOutline />
                          </button>
                          {message.id == notification?._id && (
                            <span className="pl-5 text-green-500">
                              Notification Send
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-[10px]">
                            <button
                              className="h-auto bg-transparent text-red-500 text-xl"
                              onClick={() =>
                                deleteNotification(notification?._id)
                              }
                            >
                              <MdDelete />
                            </button>
                            <Link to={`${notification?._id}/edit`}>
                              <button className="h-auto bg-transparent text-green-500 text-xl">
                                <BiEditAlt />
                              </button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="p-4">
                <Pagination
                  limit={filters?.limit}
                  skip={filters?.skip}
                  total={filters?.totalAirlines}
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
