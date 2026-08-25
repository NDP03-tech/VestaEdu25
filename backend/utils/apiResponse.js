const success = (res, data, meta = undefined, statusCode = 200) => {
  const payload = { success: true, data };
  if (meta) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

const failure = (res, message, statusCode = 500, details = undefined) => {
  const payload = { success: false, message };
  if (process.env.NODE_ENV !== "production" && details)
    payload.details = details;
  return res.status(statusCode).json(payload);
};

const pagination = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
  hasNext: page * limit < total,
});

module.exports = { success, failure, pagination };
