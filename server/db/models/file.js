'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    static associate({ User }) {
      this.belongsTo(User, { foreignKey: 'user_id' });
    }
  }
  File.init({
    user_id: DataTypes.INTEGER,
    file_name: DataTypes.STRING,
    extension: DataTypes.STRING,
    mime_type: DataTypes.STRING,
    size: DataTypes.BIGINT,
    upload_date: DataTypes.DATE,
    file_path: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'File',
  });
  return File;
};