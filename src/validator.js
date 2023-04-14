const joi = require("joi");
const validator = require("express-joi-validation").createValidator();

const schema = {
  user: {
    register: joi.object({
      username: joi.string().required(),
      password: joi.string().required(),
    }),
    login: joi.object({
      username: joi.string().required(),
      password: joi.string().required(),
    }),
  },
  post: {
    create: joi.object({
      content: joi.string().required(),
    }),
  },
};

const validate = {
  user: {
    register: validator.body(schema.user.register),
    login: validator.body(schema.user.login),
  },
  post: {
    create: validator.body(schema.post.create),
  },
};

exports.validate = validate;
