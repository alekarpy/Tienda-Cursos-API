// Utility functions can be added here
export const formatResponse = (success, data, message = '') => {
  return {
    success,
    data,
    message
  };
};

export const paginate = (model, page, limit, populate = '') => {
  const skip = (page - 1) * limit;
  
  return model.find().populate(populate).skip(skip).limit(limit);
};