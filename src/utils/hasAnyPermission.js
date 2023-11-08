const hasAnyViewPermission = ({ roles, names }) => {
    let returnValue = false;

    for (let i = 0; i < roles?.length; i++) {
        let role = roles[i];
        for (let j = 0; j < role?.roles?.length; j++) {
            if (
                names?.includes(role?.roles[j]?.name) &&
                role?.roles[j]?.permissions?.includes("view")
            ) {
                returnValue = true;
                break;
            }
        }
    }

    return returnValue;
};

export default hasAnyViewPermission;
