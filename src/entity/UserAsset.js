class UserAsset {
    constructor(id, user, asset, quantity, averagePrice, unitCurrency, purchaseDate) {
        this.id = id;
        this.user = user;
        this.asset = asset;
        this.quantity = quantity;
        this.averagePrice = averagePrice;
        this.unitCurrency = unitCurrency;
        this.purchaseDate = purchaseDate;
    }
}
export default UserAsset;