const Permissions = {
    READ: '0000',
    WRITE: '1111',
};

Permissions.isValidPermission = function (code) {
    return Object.values(this).includes(code);
};

export { Permissions };
