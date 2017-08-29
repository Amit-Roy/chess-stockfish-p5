function Piece(icn) {
    this.x = 0;
    this.y = 0;
    this.over = false;

    this.icn = icn;

    this.render = function (x, y) {
        this.x = x;
        this.y = y;
        this.img = image(this.icn, this.x, this.y);
    };

    this.img.dragged = function (x, y) {
        if (this.over) {
            this.x = x;
            this.y = y;
        }
    };

    this.setHover = function (x, y) {
      var d = dist(x, y, this.x, this.y);
      if (d < sqSize / 2) {
          this.over = true;
      }
    }
}