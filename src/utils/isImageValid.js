const types = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/webp",
    "video/x-matroska",
    "video/mp4",
];
const isImageValid = (image) => {
    if (!image) {
        return false;
    }

    if (!types.includes(image?.type)) {
        return false;
    }

    return true;
};

export default isImageValid;
