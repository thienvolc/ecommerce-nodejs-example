export default class CartRepository {
    static findOneAndUpdate(query, updateOrInsert, options) {
        return Promise.resolve({ query, updateOrInsert, options });
    }
}
