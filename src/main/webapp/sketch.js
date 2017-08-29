var board, game;
var engine = new STOCKFISH();

var init = function () {
    var cfg = {
        draggable: true,
        orientation: 'white',
        dropOffBoard: 'snapback',
        showNotation: true,
        pieceTheme: 'libraries/img/chesspieces/wikipedia/{piece}.png',
        moveSpeed: 'slow',
        snapbackSpeed: 500,
        snapSpeed: 100,
        sparePieces: false,
        position: 'start',

        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    };
    playerColor = 'b';
    board = new ChessBoard('board', cfg);
    game = new Chess();
};

var onDragStart = function(source, piece, position, orientation) {
    if (game.game_over() === true ||
        (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
};

var onDrop = function(source, target) {
    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return 'snapback';

    updateStatus();
    $('#row').html(game.pgn({ max_width: innerWidth*.2, newline_char: "<br />" }));
};

var prepareMove = function () {
    if(!game.game_over()) {
        if (game.turn() !== playerColor) {
            var moves = '';
            var history = game.history({verbose: true});
            for (var i = 0; i < history.length; ++i) {
                var move = history[i];
                moves += ' ' + move.from + move.to + (move.promotion ? move.promotion : '');
            }
            uciCmd('position startpos moves' + moves);
            if (time.depth) {
                uciCmd('go depth ' + time.depth);
            } else if (time.nodes) {
                uciCmd('go nodes ' + time.nodes);
            } else {
                uciCmd('go wtime ' + time.wtime + ' winc ' + time.winc + ' btime ' + time.btime + ' binc ' + time.binc);
            }
            isEngineRunning = true;
        }
    }
};

var onSnapEnd = function() {
    board.position(game.fen());
};

var updateStatus = function() {
    var status = '';

    var moveColor = 'White';
    if (game.turn() === 'b') {
        moveColor = 'Black';
    }

    // checkmate?
    if (game.in_checkmate() === true) {
        status = 'Game over, ' + moveColor + ' is in checkmate.';
    }

    // draw?
    else if (game.in_draw() === true) {
        status = 'Game over, drawn position';
    }

    // game still on
    else {
        status = moveColor + ' to move';

        // check?
        if (game.in_check() === true) {
            status += ', ' + moveColor + ' is in check';
        }
    }

};

$(document).ready(init());