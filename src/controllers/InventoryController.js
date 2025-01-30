import InventoryService from '../services/InventoryService.js';
import { ResponseSender, CREATED, OK } from '../utils/responses/index.js';
import { asyncErrorDecorator } from '../helpers/asyncErrorWrapper.js';

class InventoryController {
    addStockToInventory = async (req, res) => {
        const metadata = await InventoryService.addStockToInventory(req.body);
        const response = new OK({ message: 'Get cart info success', metadata });
        ResponseSender.send(res, response);
    };
}

export default asyncErrorDecorator.decorateAllStaticMethods(InventoryController);
