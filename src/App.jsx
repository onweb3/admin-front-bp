import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRoutes } from "react-router-dom";

import { ThemeRoutes } from "./routes";
import { fetchAdmin } from "./redux/slices/adminSlice";
import { fetchGeneralData1, fetchGeneralData2 } from "./redux/slices/generalSlice";

export default function App() {
    const { isSiteLoading, isLoggedIn } = useSelector((state) => state.admin);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAdmin());
    }, [dispatch]);

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(fetchGeneralData1());
            dispatch(fetchGeneralData2());
        }
    }, [dispatch, isLoggedIn]);

    const routing = useRoutes(ThemeRoutes);
    return isSiteLoading ? <div>Loader...</div> : routing;
}
