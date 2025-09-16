const { shoppingLists } = require('../models/shoppingListModel');

const shoppingListService = {
  getAll: () => shoppingLists,
  getById: (id) => shoppingLists.find(l => l.id === id),
  create: (list) => {
    shoppingLists.push(list);
    return list;
  },
  update: (id, updatedList) => {
    const index = shoppingLists.findIndex(l => l.id === id);
    if (index !== -1) {
      shoppingLists[index] = { ...shoppingLists[index], ...updatedList };
      return shoppingLists[index];
    }
    return null;
  },
  remove: (id) => {
    const index = shoppingLists.findIndex(l => l.id === id);
    if (index !== -1) {
      return shoppingLists.splice(index, 1)[0];
    }
    return null;
  }
};

module.exports = shoppingListService;