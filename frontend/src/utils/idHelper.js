// Helper function để xử lý ID field từ Mongoose (_id) sang Sequelize (id)
export const getId = (item) => {
  return item?.id || item?._id || item?.ID;
};

// Helper function để tạo key cho React lists
export const createKey = (item, fallback = 'key') => {
  return getId(item) || fallback;
};

// Helper function để map data với key
export const mapWithKey = (data, keyField = 'id') => {
  return data.map((item, index) => ({
    ...item,
    key: getId(item) || `${keyField}-${index}`
  }));
};

// Helper function để tìm item bằng ID
export const findById = (data, id) => {
  return data.find(item => getId(item) === id);
};

// Helper function để filter bằng ID
export const filterById = (data, id) => {
  return data.filter(item => getId(item) !== id);
};
