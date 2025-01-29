// import { Types } from 'mongoose';
// import slugify from 'slugify';
// import _ from 'lodash';

const castMongooseObjectId = (id) => new Types.ObjectId(id);

const createProductSlugFromName = (name) => {
    const timestamps = Date.now();
    const uniqueSlug = name + ' ' + timestamps;
    return slugify(uniqueSlug, { lower: true, strict: true });
};

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

const convertToUpdateNestedObject = (product) => {
    const updatedProduct = updateNestedObjectParser(product);
    return removeNullAndUndefinedProperties(updatedProduct);
};

const updateNestedObjectParser = (obj) => {
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

const removeNullAndUndefinedProperties = (objToClean) => {
    if (isValidObject(objToClean)) {
        Object.keys(objToClean).forEach((key) => {
            if (objToClean[key] == null) {
                delete objToClean[key];
            }
        });
    }
};

const isValidObject = (obj) => obj && typeof obj === 'object' && Object.keys(obj).length > 0;

const generateSelectProjectionForFields = (fieldsToSelect = []) =>
    Object.fromEntries(fieldsToSelect.map((field) => [field, 1]));

const generateUnselectProjectionForFields = (fieldsToExclude = []) =>
    Object.fromEntries(fieldsToExclude.map((field) => [field, 0]));

const extractFieldsFromObject = ({ fields = [], object = {} }) => _.pick(object, fields);

export {
    castMongooseObjectId,
    createProductSlugFromName,
    convertToUpdateNestedObject,
    updateNestedObjectParser,
    removeNullAndUndefinedProperties,
    isValidObject,
    generateSelectProjectionForFields,
    generateUnselectProjectionForFields,
    extractFieldsFromObject,
};
