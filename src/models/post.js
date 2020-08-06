'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Comment, {foreignKey : 'post_id'})
    }
  };
  Post.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    tags: DataTypes.STRING,
    status: {
      type : DataTypes.ENUM,
      values: ["active", "deactive"]
    },
    author_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};