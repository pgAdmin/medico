/**
 * Session.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    token: {
      type: 'string',
      required: true
    },
    userId: {
      type: 'string',
      required: true
    },
    type: {
      type: 'string',
      required: true
    }
  }
};

