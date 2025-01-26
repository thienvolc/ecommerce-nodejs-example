import ApikeyRepository from '../repositories/ApikeyRepository';
import { ForbiddenError } from '../utils/responses/index.js';

export default class ApikeyService {
    static verify = async (apikey) => {
        const apikeyDetails = await this.#requireApikey(apikey);
        return this.checkPermission(apikeyDetails);
    };

    static #requireApikey = async (key) => {
        const apikeyDetails = await ApikeyRepository.findByKey(key);
        if (!apikeyDetails) {
            throw ForbiddenError('Invalid API Key');
        }
    };

    static checkPermission = async (apikeyDetails) => {
        const { status, permissions } = apikeyDetails;
        if (this.isValidStatus(status)) {
            return permissions;
        }
    };

    static isValidStatus = (status) => status === 'active';
}
