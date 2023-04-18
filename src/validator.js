const joi = require("joi");
const validator = require("express-joi-validation").createValidator();

const {
  isValidMongoDBObjectId,
} = require("./joi-custom-validators/objectIdValidator.js");

const schema = {
  user: {
    profile: joi.object({
      username: joi.string().required(),
    }),
    follow: joi.object({
      targetUserID: joi.required().custom(isValidMongoDBObjectId),
    }),
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
    update: joi.object({
      content: joi.string().required(),
    }),
    like: joi.object({
      targetUser: joi.string().required(),
      targetPost: joi.required().custom(isValidMongoDBObjectId),
    }),
    delete: joi.object({
      Id: joi.number().required(),
    }),
  },
};

const validate = {
  user: {
    profile: validator.params(schema.user.profile),
    follow: validator.body(schema.user.follow),
    register: validator.body(schema.user.register),
    login: validator.body(schema.user.login),
  },
  post: {
    create: validator.body(schema.post.create),
    update: validator.body(schema.post.update),
    like: validator.body(schema.post.like),
    delete: validator.params(joi.object({ Id: joi.string().required() })),
  },
};

exports.validate = validate;
