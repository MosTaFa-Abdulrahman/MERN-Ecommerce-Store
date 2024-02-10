const { isValidObjectId } = require("mongoose");

const checkId = (req, res, next) => {
  !isValidObjectId(req.params.id) &&
    res.status(401).json(`Invalid Object of: ${req.params.id}`);

  next();
};

module.exports = { checkId };
