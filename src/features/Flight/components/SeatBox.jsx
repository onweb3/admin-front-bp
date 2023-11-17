import { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdOutlineAirlineSeatReclineExtra } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { handleSeatCountChange } from "../../../redux/slices/FlightOrderSlice";

export default function SeatBox({
    status,
    row,
    col,
    price,
    group,
    selectedSegmentIndex,
    seat,
}) {
    const { singleFlightDetails, flightAncillaries } = useSelector(
        (state) => state.flightOrder
    );
    const dispatch = useDispatch();
    const [selected, setSelected] = useState(false);
    const onHandleChange = () => {
        dispatch(
            handleSeatCountChange({
                name: "seatNumber",
                value: seat,
                name1: "seatSsr",
                index1: selectedSegmentIndex,
            })
        );
    };

    const selectedSeat = () => {
        const seatSsrArray = flightAncillaries.seatSsr;
        let seatFound = false; // Flag to track if a matching seat is found

        // Iterate over the seatSsrArray
        for (const seatSsrItem of seatSsrArray) {
            if (
                seatSsrItem?.selectedSeats &&
                seatSsrArray.indexOf(seatSsrItem) === selectedSegmentIndex &&
                Array.isArray(seatSsrItem?.selectedSeats)
            ) {

                // Iterate over the selectedSeats array for each seatSsrItem
                for (const selectedSeat of seatSsrItem?.selectedSeats) {
                    if (selectedSeat.seatNumber === seat.seatNumber) {

                        setSelected(true);
                        seatFound = true;
                        break; // Exit the loop once a matching seat is found
                    }
                }

                if (seatFound) {
                    break; // Exit the outer loop as well, since the seat was found
                }
            }
        }

        if (!seatFound) {
            setSelected(false);
        }
    };

    useEffect(() => {
        selectedSeat();
    }, [flightAncillaries.seatSsr, selectedSegmentIndex]);
    return (
        <>
            <button
                type="button"
                className={`block h-[20px] w-[20px] border-[2px] relative group hover:border-blue-500 ${
                    status !== "R" &&
                    (selected
                        ? "bg-teal-400"
                        : group === 1
                        ? "bg-blue-100"
                        : group === 2
                        ? "bg-purple-200"
                        : group === 3
                        ? "bg-violet-500"
                        : group === 4
                        ? "bg-orange-200"
                        : group === 5
                        ? "bg-pink-300"
                        : "")
                } ${
                    status === "R" && "bg-red-500"
                } cursor-pointer rounded-tl-lg rounded-bl-lg`}
                onClick={() => {
                    if (selected) {
                        onHandleChange();
                    } else {
                        onHandleChange();
                    }
                }}
                disabled={status === "R"}
            >
                {selected && (
                    <MdOutlineAirlineSeatReclineExtra className="transform -scale-x-100" />
                )}
                {
                    <div
                        className={`p-2 z-50 group-hover:flex hidden absolute text-[16px] w-[100px] text-left ${
                            status === "R"
                                ? "bg-blue-100 text-blue-500"
                                : "bg-white"
                        } bottom-[30px] -left-3 rounded-lg shadow-lg border-[1px] border-black flex-col justify-start`}
                    >
                        {" "}
                        {status !== "R" ? (
                            <>
                                {`${row} - ${col}`}

                                <span className="text-green-600">{`${price} AED`}</span>
                                <span className="absolute -bottom-[20px] text-[30px] text-black left-2">
                                    <IoMdArrowDropdown />
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="text-green-600">Booked</span>
                                <span className="absolute -bottom-[20px] text-[30px] text-black left-2">
                                    <IoMdArrowDropdown />
                                </span>
                            </>
                        )}
                    </div>
                }
            </button>
        </>
    );
}
