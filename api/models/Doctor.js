/**
 * Doctor.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    },
    email: {
      type: 'string',
      email: true,
      required: true,
      unique: true
    },
    phoneNumber: {
      type: 'string',
      required: true,
      unique: true
    },
    gender: {
      type: 'string',
      required: true
    },
    specialization: {
      type: 'string',
      required: false
    },
    rate: {
      type: 'float',
      defaultsTo: 1.0
    },
    callPoints: {
      type: 'float',
      defaultsTo: 0.0
    }
  }
};

