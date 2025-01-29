import ApikeyService from '../services/ApikeyService.js';
import { asyncErrorDecorator } from '../helpers/asyncErrorWrapper.js';
import { ResponseSender, CREATED, OK } from '../utils/responses/index.js';

class ApikeyController {
    static createReadWriteKey = async (req, res, next) => {
        const apikey = await ApikeyService.createReadWriteKey();

        const response = new CREATED({ message: 'API Key created successfully', metadata: apikey });
        ResponseSender.send(res, response);
    };
}

export default asyncErrorDecorator.decorateAllStaticMethods(ApikeyController);