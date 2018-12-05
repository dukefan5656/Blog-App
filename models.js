'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const commentSchema = mongoose.Schema({content: String});

const blogPostSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String},
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  comments: [ commentSchema ],
  created: {type: Date, default: Date.now}
});

const authorSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  userName: {type: String, unique: true}
});


blogPostSchema.pre('findOne', function(next) {
  this.populate('author');
  next();
});

blogPostSchema.pre('find', function(next) {
  this.populate('author');
  next();
});

blogPostSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogPostSchema.methods.serialize = function() {
  return {
    id: this._id,
    author: this.authorName,
    content: this.content,
    title: this.title,
    comments: this.comments,
    created: this.created
  };
};

const Author = mongoose.model('Author', authorSchema);
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = {BlogPost, Author};