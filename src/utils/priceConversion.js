const priceConversion = (price, selectedCurrency, showIsocode = false) => {
    if (
        !price ||
        !selectedCurrency?.isocode ||
        !selectedCurrency?.conversionRate
    ) {
        return 0;
    }

    const convertedPrice = (price * selectedCurrency?.conversionRate)?.toFixed(
        2
    );

    return !showIsocode
        ? convertedPrice
        : `${convertedPrice} ${selectedCurrency?.isocode}`;
};

export default priceConversion;
