import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../axios";

export default function CacheSettingsPage() {
    const [isLoading, setIsLoading] = useState(false);

    const { jwtToken } = useSelector((state) => state.admin);

    const clearCache = async () => {
        try {
            setIsLoading(true);
            await axios.get("/hotels/clear-cache", {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Cache Settings</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/hotels" className="text-textColor">
                        Hotels{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Cache Settings</span>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="p-4">
                        <button
                            onClick={clearCache}
                            className="px-3 bg-red-500"
                            disabled={isLoading}
                        >
                            {isLoading ? "Clearing Cache..." : "Clear Cache"}
                        </button>
                        <span className="block text-sm text-grayColor mt-2">
                            This button will clear all the caches related to hotels.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
