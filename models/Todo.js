const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Todo', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });
};
