import { StaticMethodDecorator } from '../utils/decorators.js';

export const asyncErrorWrapper = (middleware) => 
    (req, res, next) => Promise.resolve(middleware(req, res, next)).catch(next);

export const asyncErrorDecorator = new StaticMethodDecorator(asyncErrorWrapper);
