import { Types } from 'mongoose';
import slugify from 'slugify';

export const castMongooseObjectId = (id) => new Types.ObjectId(id);

export const createProductSlugFromName = (name) => {
    const timestamps = Date.now();
    const uniqueSlug = name + ' ' + timestamps;
    return slugify(uniqueSlug, { lower: true, strict: true });
};

export const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

export const convertToUpdateNestedObject = (product) => {
    const updatedProduct = updateNestedObjectParser(product);
    return removeNullAndUndefinedProperties(updatedProduct);
};

export const updateNestedObjectParser = (obj) => {
    const final = {};

    if (!isObject(obj)) return obj;

    Object.keys(obj).forEach((key) => {
        const value = obj[key];
        if (isObject(value)) {
            const nested = updateNestedObjectParser(value);
            Object.keys(nested).forEach((nestedKey) => {
                final[`${key}.${nestedKey}`] = nested[nestedKey];
            });
        } else {
            final[key] = value;
        }
    });

    return final;
};

export const removeNullAndUndefinedProperties = (objToClean) => {
    if (isValidObject(objToClean)) {
        Object.keys(objToClean).forEach((key) => {
            if (objToClean[key] == null) {
                delete objToClean[key];
            }
        });
    }
};

export const isValidObject = (obj) => obj && typeof obj === 'object' && Object.keys(obj).length > 0;

export const generateSelectProjectionForFields = (fieldsToSelect = []) =>
    Object.fromEntries(fieldsToSelect.map((field) => [field, 1]));

export const generateUnselectProjectionForFields = (fieldsToExclude = []) =>
    Object.fromEntries(fieldsToExclude.map((field) => [field, 0]));

export const extractFieldsFromObject = ({ fields = [], object = {} }) => _.pick(object, fields);
