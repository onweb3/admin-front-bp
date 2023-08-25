function convertMinutesTo24HourTime(minutes) {
    var hours = Math.floor(minutes / 60);
    var remainingMinutes = minutes % 60;

    var formattedTime =
        ("0" + hours).slice(-2) + ":" + ("0" + remainingMinutes).slice(-2);
    return formattedTime;
}

export default convertMinutesTo24HourTime;
