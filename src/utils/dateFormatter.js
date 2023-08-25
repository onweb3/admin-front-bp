export default function convertIsoDateToYMD(isoDate) {
    const date = new Date(isoDate);

    // Extract year, month, and day values from date object
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // add 1 to get 1-12 range instead of 0-11
    const day = date.getUTCDate();

    // Format values as string in YYYY-MM-DD format
    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;

    return formattedDate;
}
