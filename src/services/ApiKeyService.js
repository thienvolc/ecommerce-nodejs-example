import { Permissions } from '../models/index.js';
import { ApikeyRepository } from '../repositories/index.js';
import { ForbiddenError } from '../utils/responses/index.js';
import { generateRandomKey } from '../utils/authUtils.js';

export default class ApikeyService {
    static createReadWriteKey = async () => {
        const key = generateRandomKey();
        const permissions = [Permissions.READ, Permissions.WRITE];
        return await ApikeyRepository.create({ key, permissions });
    };

    static verify = async (apikey) => {
        const apikeyDetails = await this.#requireApikey(apikey);
        return this.checkPermission(apikeyDetails);
    };

    static #requireApikey = async (key) => {
        const apikeyDetails = await ApikeyRepository.findByKey(key);
        if (!apikeyDetails) {
            throw new ForbiddenError('Invalid API Key');
        }
        return apikeyDetails;
    };

    static checkPermission = async (apikeyDetails) => {
        const { status, permissions } = apikeyDetails;
        if (this.isValidStatus(status)) {
            return permissions;
        }
    };

    static isValidStatus = (status) => status === 'active';
}
