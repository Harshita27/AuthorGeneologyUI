var _ = require('lodash');

function Author(_node) {
  _.extend(this, _node.properties);

  if (this.id) {
    this.id = this.id.toNumber();
  }
  if (this.authorName) {
    this.authorName = this.authorName;
  }
}

module.exports = Author;
