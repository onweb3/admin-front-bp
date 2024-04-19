import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { BtnLoader, RichTextEditor } from "../../components";
import AddSectionModal from "../../features/Attractions/components/AddSectionModal";
import AddDetailModal from "../../features/Visa/components/AddDetailsModal";
import AddFaqsModal from "../../features/Visa/components/AddFaqsModal";
import { useHandleClickOutside, useImageChange } from "../../hooks";
import axios from "../../axios";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
// import { config } from "../../constants";

function VisaAddCountryPage() {
  const { countries, isGeneralLoading } = useSelector((state) => state.general);

  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [isAddFAQSModalOpen, setIsFAQSModalOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editIndex, setEditIndex] = useState("");

  const { jwtToken } = useSelector((state) => state.admin);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    name: "",
    country: "",
    description: "",
    sampleVisa: "",
    faqs: [],
    details: [],
    inclusions: [],
    termsAndConditions: "",
  });
  const { image, handleImageChange, error: imageError } = useImageChange();

  const [filters, setFilters] = useState({
    skip: 0,
    limit: 10,
    totalResellers: 0,
  });

  const [inputValue, setInputValue] = useState("");
  const { id } = useParams();

  const handleChange = (e) => {
    setData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleInclusionChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClick = () => {
    setData({ ...data, inclusions: [...data.inclusions, inputValue] });
  };

  const fetchVisaType = async () => {
    try {
      setIsLoading(true);

      if (id != null) {
        const response = await axios.get(`/visa/${id}`, {
          headers: { authorization: `Bearer ${jwtToken}` },
        });

        setData(response.data);
        setData(response.data);
      }

      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchVisaType();
  }, [filters.skip, filters.limit]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", data.name);
      formData.append("country", data.country);
      formData.append("description", data.description);
      formData.append("termsAndConditions", data.termsAndConditions);
      formData.append("inclusions", JSON.stringify(data.inclusions));
      formData.append("details", JSON.stringify(data.details));
      formData.append("faqs", JSON.stringify(data.faqs));

      if (id == null) {
        const response = await axios.post(
          "/visa/country-visa/create",
          formData,
          {
            headers: { Authorization: `Bearer ${jwtToken}` },
          }
        );

        navigate("/visa/country");

        // updateCategory(response.data);
      } else {
        const response = await axios.patch(`/visa/update/${id}`, formData, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        navigate("/visa/country");
      }
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong, Try again");
      setIsLoading(false);
    }
  };

  console.log(data, "data");

  return (
    <div>
      <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
        <h1 className="font-[600] text-[15px] uppercase">Visa</h1>
        <div className="text-sm text-grayColor">
          <Link to="/" className="text-textColor">
            Dashboard{" "}
          </Link>
          <span>{">"} </span>
          <Link to="/visa/country" className="text-textColor">
            Visa-country{" "}
          </Link>
          <span>{">"} </span>
          <span>Country</span>
        </div>
      </div>
      <div className="p-6">
        <div className="bg-white rounded shadow-sm">
          <div className="flex items-center justify-between border-b border-dashed p-4">
            <h1 className="font-medium">Add Visa Country</h1>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-3 gap-[20px]">
              <div>
                <label htmlFor="">Country *</label>
                <select
                  name="country"
                  value={data.country || ""}
                  onChange={handleChange}
                >
                  <option hidden>Select Country</option>
                  {countries?.map((countries, index) => {
                    return (
                      <option value={countries?._id} key={index}>
                        {countries?.countryName}
                      </option>
                    );
                  })}{" "}
                </select>
              </div>
              <div className="">
                <label htmlFor="">Name</label>
                <input
                  type=""
                  value={data.name || ""}
                  placeholder="Enter the Visa Name"
                  name="name"
                  // value={data.adultAgeLimit || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="">
                <label htmlFor="">Visa Model</label>
                <input type="file" onChange={handleImageChange} />
                {imageError && (
                  <span className="text-sm block text-red-500 mt-2">
                    {imageError}
                  </span>
                )}
                {(image || data.sampleVisa) && (
                  <div className="w-[130px] max-h-[80px] rounded overflow-hidden mt-2">
                    <img
                      src={
                        image
                          ? URL.createObjectURL(image)
                          : import.meta.env.VITE_SERVER_URL + data?.sampleVisa
                      }
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="my-5">
                <h1 className="text-[14px]">Document Details</h1>
                <div className="mt-2">
                  <div className="border border-t-0">
                    <AddDetailModal
                      data={data}
                      setData={setData}
                      setIsAddSectionModalOpen={setIsAddSectionModalOpen}
                      isAddSectionModalOpen={isAddSectionModalOpen}
                      edit={edit}
                      setEdit={setEdit}
                      editIndex={editIndex}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-[3em]">
                <div
                  className={
                    "flex items-center mb-3 " +
                    (data.sections?.length < 1
                      ? "justify-center"
                      : "justify-center")
                  }
                >
                  <button
                    className="px-3 bg-orange-500"
                    onClick={() => {
                      setIsAddSectionModalOpen(true);
                      setEditIndex("");
                      setEdit(false);
                    }}
                  >
                    + Add Details
                  </button>
                </div>
                {data.details?.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                      <tr>
                        <th className="font-[500] p-3">#</th>
                        <th className="font-[500] p-3">Document Title</th>
                        <th className="font-[500] p-3">Document Body</th>
                        <th className="font-[500] p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.details?.map((details, index) => {
                        return (
                          <tr
                            key={index}
                            className="border-b border-tableBorderColor"
                          >
                            <td className="p-3">#{index + 1}</td>
                            <td className="p-3">{details?.title || "N/A"}</td>
                            <td className="p-3">{details?.body || "N/A"}</td>

                            <td className="p-3">
                              <div className="flex gap-[10px]">
                                <button
                                  className="h-auto bg-transparent text-red-500 text-xl"
                                  onClick={() => {
                                    if (
                                      window.confirm("Are you sure to delete?")
                                    ) {
                                      const updatedData = {
                                        ...data,
                                        details: data.details.filter(
                                          (item, indexs) => indexs !== index
                                        ),
                                      };
                                      setData(updatedData);
                                    }
                                  }}
                                >
                                  <MdDelete />
                                </button>
                                <button
                                  className="h-auto bg-transparent text-green-500 text-xl"
                                  onClick={() => {
                                    setIsAddSectionModalOpen(true);
                                    setEditIndex(index);
                                    setEdit(!edit);
                                  }}
                                >
                                  <BiEditAlt />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <span className="text-sm text-grayColor font-medium text-center block">
                    Document Details not added!!!
                  </span>
                )}
              </div>

              <div className="my-10">
                <h1 className="text-[14px]">FAQS </h1>
                <div className="mt-2">
                  <div className="border border-t-0">
                    <AddFaqsModal
                      data={data}
                      setData={setData}
                      setIsFAQSModalOpen={setIsFAQSModalOpen}
                      isAddFAQSModalOpen={isAddFAQSModalOpen}
                      edit={edit}
                      setEdit={setEdit}
                      editIndex={editIndex}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-[3em]">
                <div
                  className={
                    "flex items-center mb-3 " +
                    (data.faqs?.length < 1
                      ? "justify-center"
                      : "justify-center")
                  }
                >
                  <button
                    className="px-3 bg-orange-500"
                    onClick={() => setIsFAQSModalOpen(true)}
                  >
                    + Add FAQS
                  </button>
                </div>
                {data.faqs?.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                      <tr>
                        <th className="font-[500] p-3">#</th>
                        <th className="font-[500] p-3">Question</th>
                        <th className="font-[500] p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.faqs?.map((faqs, index) => {
                        return (
                          <tr
                            key={index}
                            className="border-b border-tableBorderColor"
                          >
                            <td className="p-3">#{index + 1}</td>
                            <td className="p-3">{faqs?.question || "N/A"}</td>

                            <td className="p-3">
                              <div className="flex gap-[10px]">
                                <button
                                  className="h-auto bg-transparent text-red-500 text-xl"
                                  onClick={() => {
                                    if (
                                      window.confirm("Are you sure to delete?")
                                    ) {
                                      const updatedData = {
                                        ...data,
                                        faqs: data.faqs.filter(
                                          (item, indexs) => indexs !== index
                                        ),
                                      };
                                      setData(updatedData);
                                    }
                                  }}
                                >
                                  <MdDelete />
                                </button>
                                <button
                                  className="h-auto bg-transparent text-green-500 text-xl"
                                  onClick={() => {
                                    setIsFAQSModalOpen(true);
                                    setEditIndex(index);
                                    setEdit(!edit);
                                  }}
                                >
                                  <BiEditAlt />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <span className="text-sm text-grayColor font-medium text-center block">
                    Faqs not added!!!
                  </span>
                )}
              </div>

              <div className="my-10 ">
                <h1 className="text-[14px]">Inclusions</h1>
                <div className="flex mt-5 gap-2">
                  <input
                    type=""
                    placeholder="Enter the Inclusion"
                    name="name"
                    value={inputValue}
                    onChange={handleInclusionChange}
                    required
                  />
                  <button className="px-2 bg-orange-500" onClick={handleClick}>
                    + Add
                  </button>
                </div>
              </div>
              {data.inclusions?.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                    <tr>
                      <th className="font-[500] p-3">#</th>
                      <th className="font-[500] p-3">Title</th>
                      <th className="font-[500] p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.inclusions?.map((inclusions, index) => {
                      return (
                        <tr
                          key={index}
                          className="border-b border-tableBorderColor"
                        >
                          <td className="p-3">#{index + 1}</td>
                          <td className="p-3">{inclusions || "N/A"}</td>
                          <td className="p-3">
                            <div className="flex gap-[10px]">
                              <button
                                className="h-auto bg-transparent text-red-500 text-xl"
                                onClick={() => {
                                  if (
                                    window.confirm("Are you sure to delete?")
                                  ) {
                                    const updatedData = {
                                      ...data,
                                      inclusions: data.inclusions.filter(
                                        (item) => item !== inclusions
                                      ),
                                    };
                                    setData(updatedData);
                                  }
                                }}
                              >
                                <MdDelete />
                              </button>
                              {/* <button
                                                    className="h-auto bg-transparent text-green-500 text-xl"
                                                    onClick={() => {
                                                        setEditIndex(index);
                                                        setIsEditSectionModalOpen(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    <BiEditAlt />
                                                </button> */}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <span className="text-sm text-grayColor font-medium text-center block">
                  Inclusions not added!!!
                </span>
              )}
              <div className="my-10">
                <h1 className="text-[14px]">Description</h1>
                <div className="mt-2">
                  <div className="border border-t-0">
                    <textarea
                      id=""
                      placeholder="Enter The Description"
                      name="description"
                      value={data.description || ""}
                      onChange={handleChange}
                    ></textarea>{" "}
                  </div>
                </div>
              </div>
              <div className="my-10">
                <h1 className="text-[14px]">Terms And Conditions</h1>
                <div className="mt-2">
                  <div className="border border-t-0">
                    <RichTextEditor
                      getValue={(value) =>
                        setData((prev) => {
                          return {
                            ...prev,
                            termsAndConditions: value,
                          };
                        })
                      }
                      initialValue={data?.termsAndConditions || ""}
                    />
                  </div>
                </div>
              </div>
              {error && (
                <span className="text-sm text-red-500 block mt-4">{error}</span>
              )}

              <div className="mt-4 flex items-center justify-end gap-[12px]">
                <button
                  className="bg-slate-300 text-textColor px-[15px]"
                  type="button"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button
                  className="w-[100px] bg-primaryColor"
                  type="button"
                  onClick={handleSubmit}
                >
                  {isLoading ? <BtnLoader /> : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VisaAddCountryPage;
