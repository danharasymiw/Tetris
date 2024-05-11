//  Tetris
function new_board(): number[][] {
    return [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [-1, -1, -1, -1, -1]]
}

let board = new_board()
let piece_x = 2
let piece_y = -2
let piece_1 = [[1, 0], [1, 0]]
let piece_2 = [[0, 0], [1, 1]]
let piece_3 = [[1, 0], [0, 0]]
let pieces = [piece_1, piece_2, piece_3]
let board_indexes = [0, 1, 2, 3, 4]
let reversed_board_indexes = [4, 3, 2, 1, 0]
let piece_indexes = [0, 1]
let curr_piece = pieces[randint(0, 2)]
let piece_num = 1
function draw_piece() {
    
    for (let y of piece_indexes) {
        for (let x of piece_indexes) {
            if (curr_piece[y][x]) {
                led.plot(piece_x + x, piece_y + y)
            }
            
        }
    }
}

function draw_board() {
    for (let y of board_indexes) {
        for (let x of board_indexes) {
            if (board[y][x]) {
                led.plot(x, y)
            }
            
        }
    }
}

function redraw() {
    basic.clearScreen()
    //  led.plot(0, 0)
    draw_board()
    draw_piece()
}

let is_playing = true
function add_piece_to_board(): boolean {
    
    piece_y = piece_y - 1
    for (let y of piece_indexes) {
        for (let x of piece_indexes) {
            if (curr_piece[y][x]) {
                if (y + piece_y <= 0) {
                    return false
                }
                
                board[y + piece_y][x + piece_x] = piece_num
            }
            
        }
    }
    piece_y = -2
    piece_x = 2
    curr_piece = pieces[randint(0, 2)]
    return true
}

function piece_collides(piece_x: number, piece_y: number): boolean {
    
    for (let y of piece_indexes) {
        for (let x of piece_indexes) {
            if (curr_piece[y][x] && (0 <= piece_y + y && piece_y + y < board_indexes.length + 2) && (0 <= piece_x + x && piece_x + x < board_indexes.length + 2) && board[piece_y + y][piece_x + x]) {
                return true
            }
            
        }
    }
    return false
}

function move_piece(direction: number) {
    
    if (piece_on_board(piece_x + direction, piece_y) && !piece_collides(piece_x + direction, piece_y)) {
        piece_x = piece_x + direction
    }
    
    redraw()
}

input.onButtonPressed(Button.A, function on_button_pressed_a() {
    move_piece(-1)
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    move_piece(1)
})
function rows_completed(): any[] {
    let count: number;
    let rows = []
    for (let y of board_indexes) {
        count = 0
        for (let x of board_indexes) {
            if (board[y][x]) {
                count = count + 1
            }
            
            if (count >= 5) {
                board[y] = [0, 0, 0, 0, 0]
                rows.push(y)
            }
            
        }
    }
    return rows
}

function shift_down(rows: any[]) {
    
    for (let row_num of rows) {
        for (let y = row_num; y > 0; y += -1) {
            board[Math.trunc(y)] = board[Math.trunc(y) - 1]
        }
        redraw()
        basic.pause(500)
    }
    board[0] = [0, 0, 0, 0, 0]
    redraw()
}

function piece_on_board(x: any, y: number): boolean {
    
    for (let piece_y of piece_indexes) {
        for (let piece_x of piece_indexes) {
            if (curr_piece[piece_y][piece_x] && !on_board(piece_x + x, piece_y + y)) {
                return false
            }
            
        }
    }
    return true
}

function on_board(x: any, y: any) {
    return 0 <= x && x < 5 && (0 <= y && y < 5)
}

basic.forever(function on_forever() {
    
    while (true) {
        while (true) {
            basic.pause(750)
            basic.clearScreen()
            piece_y = piece_y + 1
            if (piece_collides(piece_x, piece_y)) {
                if (!add_piece_to_board()) {
                    break
                }
                
                piece_num = piece_num + 1
                shift_down(rows_completed())
            }
            
            redraw()
        }
        basic.showNumber(piece_num)
    }
})
