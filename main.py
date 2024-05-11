
# Tetris
def new_board():
    return [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [-1, -1, -1, -1, -1]
    ]

board = new_board()

piece_x = 2
piece_y = -2

piece_1 = [
    [1, 0],
    [1, 0]
]

piece_2 = [
    [0, 0],
    [1, 1]
]

piece_3 = [
    [1, 0],
    [0, 0]
]

pieces = [piece_1, piece_2, piece_3]

board_indexes = [0, 1, 2, 3, 4]
reversed_board_indexes = [4, 3, 2, 1, 0]
piece_indexes = [0, 1]

curr_piece = pieces[randint(0, 2)]

piece_num = 1

def draw_piece():
    global curr_piece, piece_x, piece_y

    for y in piece_indexes:
        for x in piece_indexes:
            if curr_piece[y][x]:
                led.plot(piece_x + x, piece_y + y)

def draw_board():
    for y in board_indexes:
        for x in board_indexes:
            if board[y][x]:
                led.plot(x, y)

def redraw():
    basic.clear_screen()
    # led.plot(0, 0)
    draw_board()
    draw_piece()

is_playing = True

def add_piece_to_board():
    global piece_x, piece_y, curr_piece, board, piece_num
    piece_y = piece_y - 1
    for y in piece_indexes:
       for x in piece_indexes:
            if curr_piece[y][x]:
                if y + piece_y <= 0:
                    return False
                board[y + piece_y][x + piece_x] = piece_num
    piece_y = -2
    piece_x = 2
    curr_piece = pieces[randint(0, 2)]

    return True

def piece_collides(piece_x, piece_y):
    global curr_piece, board
    for y in piece_indexes:
        for x in piece_indexes:
            if curr_piece[y][x] and \
                0 <= piece_y + y < len(board_indexes) + 2 and \
                0 <= piece_x + x < len(board_indexes) + 2 and \
                board[piece_y + y][piece_x + x]:
                    return True
    return False


def move_piece(direction):
    global piece_x, piece_y
    if piece_on_board(piece_x + direction, piece_y) and \
        not piece_collides(piece_x + direction, piece_y):
       piece_x = piece_x + direction
  
    redraw()

def on_button_pressed_a():
    move_piece(-1)
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_b():
    move_piece(1)
input.on_button_pressed(Button.B, on_button_pressed_b)

def rows_completed():
    rows = []
    for y in board_indexes:
        count = 0
        for x in board_indexes:
            if board[y][x]:
                count = count + 1
            if count >= 5:
                board[y] = [0, 0, 0, 0, 0]
                rows.append(y)
    return rows

def shift_down(rows):
    global board
    
    for row_num in rows:
        for y in range(row_num, 0, -1):
            board[int(y)] = board[int(y)-1]
        redraw()
        basic.pause(500)
    board[0] = [0, 0, 0, 0, 0]
    redraw()   

def piece_on_board(x, y):
    global curr_piece
    for piece_y in piece_indexes:
        for piece_x in piece_indexes:
            if curr_piece[piece_y][piece_x] and \
                not on_board(piece_x + x, piece_y + y):
                return False
    return True

def on_board(x, y):
    return 0 <= x < 5 and 0 <= y < 5

def on_forever():
    global piece_x, piece_y, pieces, curr_piece, piece_num, is_playing
    while True:
        while True:
            basic.pause(750)
            basic.clear_screen()
            piece_y = piece_y + 1

            if piece_collides(piece_x, piece_y):
                if not add_piece_to_board():
                    break

                piece_num = piece_num + 1

                shift_down(rows_completed())
            
            redraw()

        basic.show_number(piece_num)


basic.forever(on_forever)