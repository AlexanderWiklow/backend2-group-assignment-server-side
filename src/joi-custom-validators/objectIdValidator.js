const { ObjectId } = require("mongodb");

function isValidMongoDBObjectId(value, helpers) {
	if (ObjectId.isValid(value)) {
		return value;
	}

	return helpers.message("Invalid user id");
}

module.exports = { isValidMongoDBObjectId };
