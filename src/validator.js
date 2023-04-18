const joi = require("joi");
const validator = require("express-joi-validation").createValidator();

const { isValidMongoDBObjectId } = require("./joi-custom-validators/objectIdValidator.js");

const schema = {
  user: {
    register: joi.object({
      username: joi.string().required(),
      password: joi.string().required()
    }),
    login: joi.object({
      username: joi.string().required(),
      password: joi.string().required()
    })
  },
  post: {
    create: joi.object({
      content: joi.string().required()
    }),
    update: joi.object({
      content: joi.string().required()
    }),
    like: joi.object({
      targetUser: joi.string().required(),
      targetPost: joi.required().custom(isValidMongoDBObjectId)
    })
  }
};

const validate = {
  user: {
    register: validator.body(schema.user.register),
    login: validator.body(schema.user.login)
  },
  post: {
    create: validator.body(schema.post.create),
    update: validator.body(schema.post.update),
    like: validator.body(schema.post.like)
  }
};

exports.validate = validate;
