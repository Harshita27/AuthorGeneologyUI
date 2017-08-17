var _ = require('lodash');

function Article(_node) {
  _.extend(this, _node.properties);

  if (this.id) {
    this.id = this.id.toNumber();
  }
  if (this.title) {
    this.title = this.title;
  }
  if (this.key) {
    this.key = this.key;
  }
  if (this.year) {
    this.year = this.year;
  }
  
}

module.exports = Article;
