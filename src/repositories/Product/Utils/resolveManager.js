import { ProductType } from './RepositoryFactory.js';
import {
    FurnitureRepositoryManager,
    ClothingRepositoryManager,
    ElectronicsRepositoryManager,
    ProductRepositoryManager,
} from '../RepositoryManagers/index.js';

export const resolveRepositoryManagerByProductType = (productType) => {
    const factoryKeyMap = {
        [ProductType.FURNITURE]: FurnitureRepositoryManager,
        [ProductType.CLOTHING]: ClothingRepositoryManager,
        [ProductType.ELECTRONICS]: ElectronicsRepositoryManager,
        [ProductType.BASE]: ProductRepositoryManager,
    };
    return factoryKeyMap[productType];
};
