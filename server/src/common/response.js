const sendSuccess = (res, message, data = null, meta = undefined, statusCode = 200) => {
  const payload = {message};

  if (data !== null) {
    payload.data = data;
  }

  if (meta) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};

module.exports = {sendSuccess};
