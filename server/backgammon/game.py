from copy import deepcopy

class Game():

    def __init__(self):
        self.board = self.setInitialBoard([0 for i in range(24)])
        self.players = []

    def setInitialBoard(self, board):
        new_board = deepcopy(board)
        new_board[0] = 2
        new_board[5] = -5
        new_board[7] = -3
        new_board[11] = 5
        new_board[12] = -5
        new_board[16] = 3
        new_board[18] = 5
        new_board[23] = -2
        return new_board

    def add_player(self,player):
        self.players.append(player)

    @property
    def number_of_players(self):
        return len(self.players)

    def move(self, from_index, to_index):
        turn = self.board[from_index] < 0 # <0 = white, >0 = black

        if turn: # white
            self.board[from_index] += 1
            self.board[to_index] -= 1

        else: # black
            self.board[from_index] -= 1
            self.board[to_index] += 1