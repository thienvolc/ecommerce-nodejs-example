import ApikeyService from '../services/ApikeyService.js';
import { asyncErrorWrapper } from '../helpers/asyncErrorWrapper.js';
import { Headers } from './../utils/authUtils.js';
import { ForbiddenError } from './../utils/responses/index.js';

class ApikeyValidator {
    static validate = async (req, res, next) => {
        const apikey = this.extractApikeyFromHeaders(req.headers);
        const permissions = await ApikeyService.verify(apikey);

        this.attachPermissionToRequest(req, permissions);
        return next();
    };

    static extractApikeyFromHeaders(headers) {
        const apikey = headers[Headers.API_KEY];
        if (!apikey) {
            throw new ForbiddenError('API Key is missing');
        }
        return apikey;
    }

    static attachPermissionToRequest(req, permissions) {
        req.permissions = permissions;
    }
}

class ApiPermission {
    static middleware = (permission) => (req, res, next) => {
        // const permissions = req.permissions || [];
        // this.checkPermission(permission, permissions);
        return next();
    };

    static checkPermission = (requiredPermission, availablePermissions) => {
        if (!availablePermissions) {
            throw new ForbiddenError('Invalid request permissions!');
        }

        if (!requiredPermission) {
            throw new ForbiddenError('Missing required permission!');
        }

        if (!availablePermissions.includes(requiredPermission)) {
            throw new ForbiddenError('Permission denied!');
        }
    };
}

export const apikey = asyncErrorWrapper(ApikeyValidator.validate);
export const permission = (permission) => asyncErrorWrapper(ApiPermission.middleware(permission));
