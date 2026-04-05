import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', 
  logging: false
});

const Post = sequelize.define('Post', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING, 
    allowNull: false
  },
  published_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW 
  }
}, {
  underscored: true, 
  timestamps: true
});

export { sequelize, Post };