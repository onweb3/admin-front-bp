import { useState } from "react";

const useCsvFileChange = () => {
    const [file, setFile] = useState("");
    const [error, setError] = useState("");

    const handleCsvFileChange = (e) => {
        setFile("");
        setError("");

        if (e.target.files.length < 1) {
            return;
        }

        if (e.target.files[0] && e.target.files[0]?.type === "text/csv") {
            setFile(e.target.files[0]);
        } else {
            setError("Please upload an csv file.");
            e.target.value = "";
        }
    };

    return { file, error, handleCsvFileChange, setError, setFile };
};

export default useCsvFileChange;
