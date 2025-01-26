import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const Headers = {
    AUTHORIZATION: 'Authorization',
    REFRESH_TOKEN: 'x-refresh-token',
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
};
