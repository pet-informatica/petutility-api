'use strict';

const path = require('path');
const fs = require('fs');
const sequelize = require(path.join('..', 'models', 'index.js')).sequelize;

module.exports = {
  up: function(queryInterface, Sequelize) {
    var data = fs.readFileSync(path.join(__dirname, 'sql', 'up-singleOpenRecordOfMeetingFunction.sql'), 'utf8');
    return sequelize.query(data);
  },
  down: function(queryInterface, Sequelize) {
    var data = fs.readFileSync(path.join(__dirname, 'sql', 'down-singleOpenRecordOfMeetingFunction.sql'), 'utf8');
    return sequelize.query(data);
  }
}
