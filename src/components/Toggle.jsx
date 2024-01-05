import React from "react";

const Toggle = ({ value, onChange, disabled = false }) => {
    return (
        <div className="relative">
            <label className="toggle">
                <input
                    className="toggle-checkbox"
                    type="checkbox"
                    checked={value}
                    onChange={onChange}
                    disabled={disabled}
                />
                <div className="toggle-switch"></div>
            </label>
        </div>
    );
};

export default Toggle;
