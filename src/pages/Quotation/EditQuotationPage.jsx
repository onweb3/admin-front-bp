import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import axios from "../../axios";
import { PageLoader } from "../../components";
import ExcSupplementQuotationForm from "../../features/Quotation/ExcSupplementQuotationForm";
import ExcursionQuotationForm from "../../features/Quotation/ExcursionQuotationForm";
import GuideQuotationForm from "../../features/Quotation/GuideQuotationForm";
import HotelQuotationForm from "../../features/Quotation/HotelQuotationForm";
import QuotationPax from "../../features/Quotation/QuotationPax";
import QuotationSubmissionForm from "../../features/Quotation/QuotationSubmissionForm";
import TransferQuotationForm from "../../features/Quotation/TransferQuotationForm";
import VisaQuotaionForm from "../../features/Quotation/VisaQuotationForm";

import {
    clearAllQtnData,
    setInititalData,
    setQuotationData,
    handleTransferChange,
} from "../../redux/slices/quotationSlice";

export default function EditQuotationPage() {
    const [isLoading, setIsLoading] = useState(true);

    const { jwtToken } = useSelector((state) => state.admin);
    const { initialDataFetching } = useSelector((state) => state.quotations);
    const { quotationNumber, amendementNumber } = useParams();
    const dispatch = useDispatch();
    const [error, setError] = useState("");

    const fetchInitialData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`/quotations/inital/all`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            dispatch(setInititalData(response?.data));
            // setResponseAirport(response?.data?.airports);
            setIsLoading(false);
        } catch (err) {
            setError(err?.response?.data);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchQuotaionDetails = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `/quotations/amendment/${amendementNumber}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );
            console.log(response.data, "ammendments");
            dispatch(setQuotationData(response.data));
            // let transfers =
            //     response?.data.amendment.transferQuotation.stayTransfers.map(
            //         (st) => {
            //             return {
            //                 stays: st.transfers,
            //                 stayNo: st.stayNo,
            //             };
            //         }
            //     );

            // console.log(transfers, "transfer transfers");

            // dispatch(handleTransferChange({ value: transfers }));
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    }, [dispatch, jwtToken, quotationNumber]);

    useEffect(() => {
        fetchQuotaionDetails();
    }, [fetchQuotaionDetails]);

    useEffect(() => {
        return () => dispatch(clearAllQtnData());
    }, []);

    return (
        <div className="w-[100%] p-[20px] max-w-[750px] mx-auto ">
            {isLoading ? (
                <PageLoader />
            ) : (
                <>
                    <QuotationPax isEdit={true} />
                    <span className="block py-10">
                        <hr />
                    </span>

                    <HotelQuotationForm />
                    <span className="block py-10">
                        <hr />
                    </span>

                    <TransferQuotationForm isEdit={true} />
                    <span className="block py-10">
                        <hr />
                    </span>
                    <ExcursionQuotationForm />
                    <span className="block py-10">
                        <hr />
                    </span>
                    <GuideQuotationForm />
                    <span className="block py-10">
                        <hr />
                    </span>

                    <ExcSupplementQuotationForm />
                    <span className="block py-10">
                        <hr />
                    </span>
                    <VisaQuotaionForm />
                    <span className="block py-10">
                        <hr />
                    </span>
                    <QuotationSubmissionForm isEdit={true} />
                </>
            )}
        </div>
    );
}
