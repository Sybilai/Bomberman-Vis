function Block() {
  this.content = [];
}

Block.prototype.isBlocked =
function() {
  for (var i = 0, _ilen = this.content.length; i < _ilen; ++i) {
    if (this.content[i].isBlocking === true) {
      return true;
    } else if (this.content[i].isBlocking === "mov") {
      return "mov";
    }
  }
  return false;
};

