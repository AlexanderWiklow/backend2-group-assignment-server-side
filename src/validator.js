const joi = require("joi");
const validator = require("express-joi-validation").createValidator();

const schema = {
	user: {
		register: joi.object({
			username: joi.string().required(),
			password: joi.string().required()
		})
	}
};

const validate = {
	user: {
		register: validator.body(schema.user.register)
	}
};

exports.validate = validate;
