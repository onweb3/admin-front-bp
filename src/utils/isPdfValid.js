const types = ["application/pdf"];

const isPdfValid = (pdf) => {
    if (!pdf) {
        return false;
    }

    if (!types.includes(pdf?.type)) {
        return false;
    }

    return true;
};

export default isPdfValid;
