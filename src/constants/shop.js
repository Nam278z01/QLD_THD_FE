const menuShopKey = {
    EDIT: 0,
    CHANGE_STATUS: 1,
    DELETE: 2
};

const menuShop = (isSold) => {
    return [
        {
            key: menuShopKey.EDIT,
            label: 'Edit'
        },
        {
            key: menuShopKey.CHANGE_STATUS,
            label: isSold ? 'Mark as "Unsold"' : 'Mark as “Sold"'
        },
        {
            key: menuShopKey.DELETE,
            label: 'Delete'
        }
    ];
};

export { menuShop, menuShopKey };
