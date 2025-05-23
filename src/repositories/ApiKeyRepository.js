import { Apikey } from '../models/index.js';

export default class ApikeyRepository {
    static async create({ key, permissions }) {
        return await Apikey.create({ key, permissions });
    }

    static async findByKey(key) {
        return await Apikey.findOne({ key });
    }
}
