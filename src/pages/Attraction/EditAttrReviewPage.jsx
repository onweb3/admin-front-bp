import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import axios from "../../axios";
import { BtnLoader } from "../../components";
import { useImageChange } from "../../hooks";
// import { config } from "../../constants";

export default function EditAttrReviewPage() {
  const [data, setData] = useState({
    title: "",
    description: "",
    rating: "",
    attraction: "",
    userName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [apis, setApis] = useState([]);
  const { id, reviewId } = useParams();

  const { jwtToken } = useSelector((state) => state.admin);
  const navigate = useNavigate();
  const { image, handleImageChange, error: imageError } = useImageChange();

  const handleChange = (e) => {
    setData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("rating", data.rating);
      formData.append("attraction", id);
      formData.append("userName", data.userName);
      formData.append("image", image);

      await axios.patch(`/attractions/reviews/${reviewId}/update`, formData, {
        headers: { authorization: `Bearer ${jwtToken}` },
      });

      setIsLoading(false);
      navigate(`/attractions/${id}/reviews`);
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong, Try again");
      setIsLoading(false);
    }
  };

  const fetchReview = async () => {
    try {
      const response = await axios.get(
        `/attractions/reviews/single/${reviewId}`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );

      const { title, description, rating, attraction, userName, image } =
        response.data;

      setData((prev) => {
        return {
          ...prev,
          title,
          description,
          rating,
          attraction,
          userName,
          imgUrl: image,
        };
      });
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong, Try again");
    }
  };

  useEffect(() => {
    fetchReview();
  }, []);

  return (
    <div>
      <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
        <h1 className="font-[600] text-[15px]">EDIT REVIEW</h1>
        <div className="text-sm text-grayColor">
          <Link to="/" className="text-textColor">
            Dashboard{" "}
          </Link>
          <span>{">"} </span>
          <Link to="/attractions" className="text-textColor">
            {"Attractions"}
          </Link>
          <span>{">"} </span>
          <Link to={`/attractions/${id}/reviews`} className="text-textColor">
            {"Reviews"}
          </Link>
          <span>{">"} </span>
          <span>Edit</span>
        </div>
      </div>
      <div className="p-6">
        <div className="bg-white rounded p-6 shadow-sm">
          <form action="" onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="">Title</label>
                <input
                  type="text"
                  placeholder="Enter title"
                  name="title"
                  value={data.title || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="">Rating *</label>
                <select
                  id=""
                  name="rating"
                  value={data?.rating || ""}
                  onChange={handleChange}
                >
                  <option value="" hidden>
                    Select Star Category
                  </option>
                  <option value="1">1 Star</option>
                  <option value="2">2 Star</option>
                  <option value="3">3 Star</option>
                  <option value="4">4 Star</option>
                  <option value="5">5 Star</option>
                </select>
              </div>
              <div>
                <label htmlFor="">User Name</label>
                <input
                  type="text"
                  placeholder="Enter User Name"
                  name="userName"
                  value={data.userName || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <div>
                <label htmlFor="">Description </label>
                <textarea
                  type="number"
                  placeholder="Enter description"
                  name="description"
                  value={data.description || ""}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="">User Image</label>
              <input type="file" onChange={handleImageChange} />
              {imageError && (
                <span className="block text-sm text-red-500 mt-2">
                  {imageError}
                </span>
              )}
              {(image || data.imgUrl) && (
                <div className="mt-4 w-[50px] h-[50px]">
                  <img
                    src={
                      image
                        ? URL.createObjectURL(image)
                        : import.meta.env.VITE_SERVER_URL + data.imgUrl
                    }
                    alt=""
                    className="w-[100%] h-[100%] object-cover"
                  />
                </div>
              )}
            </div>
            {error && (
              <span className="text-sm block text-red-500 mt-2">{error}</span>
            )}
            <div className="mt-4 flex items-center justify-end gap-[12px]">
              <button
                className="bg-slate-300 text-textColor px-[15px]"
                type="button"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button className="w-[120px]">
                {isLoading ? <BtnLoader /> : "Edit Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
