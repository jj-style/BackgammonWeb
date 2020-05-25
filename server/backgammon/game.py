from copy import deepcopy
import random

class Game():

    def __init__(self):
        self.board = self.set_initial_board([0 for i in range(24)])
        self.taken_pieces = [1,1]
        self.players = []
        self.current_player = None
        self.dice = []

    def start_game(self):
        self.current_player = random.randint(0,1)
        # self.current_player = 1

    def set_initial_board(self, board):
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

    @property
    def current_player_name(self):
        return self.players[self.current_player]

    def roll(self):
        num1 = random.randint(1,6)
        num2 = random.randint(1,6)
        if num1 == num2:
            self.dice = [num1 for i in range(4)]
        else:
            self.dice = [num1, num2]
        # self.dice = [1,6]

    def switch_turn(self):
        self.dice = []
        self.current_player ^= 1

    def dests(self, source):
        if self.current_player == 0:
            valid_dests = [ source - d for d in self.dice if source-d in range(len(self.board)) and self.board[source - d] <= 1 ]
        else:
            valid_dests = [ source + d for d in self.dice if source+d in range(len(self.board)) and self.board[source + d] >= -1 ]
        return valid_dests

    def compute_all_moves(self):
        if self.current_player == 0:
            if -1 in self.taken_pieces:
                all_moves = { 24:self.dests(24) }
            else:
                all_moves = { source:self.dests(source) for source in range(len(self.board)) if self.board[source] < 0 }
        else:
            if 1 in self.taken_pieces:
                all_moves = { -1:self.dests(-1) }
            else:
                all_moves = { source:self.dests(source) for source in range(len(self.board)) if self.board[source] > 0 }
        
        return { key:value for key,value in all_moves.items() if value }
        
    def move(self, from_index, to_index):

        if from_index == -1 or from_index == 24: # moving off taken pieces move
            if from_index == -1:
                num = 1
            else:
                num = -1
            self.taken_pieces.remove(num)

            if abs(self.board[to_index]) == 1 and num*self.board[to_index] == -1:
                num += num
                self.taken_pieces.append(self.board[to_index])
            self.board[to_index] += num
        
        else: # normal move
            turn = self.board[from_index] < 0 # <0 = white, >0 = black

            if turn: # white
                self.board[from_index] += 1
                if self.board[to_index] <= 0:
                    self.board[to_index] -= 1
                else:
                    self.board[to_index] = -1
                    self.taken_pieces.append(1)

            else: # black
                self.board[from_index] -= 1
                if self.board[to_index] >= 0:
                    self.board[to_index] += 1
                else:
                    self.board[to_index] = 1
                    self.taken_pieces.append(-1)

        self.dice.remove(abs(from_index-to_index))
        self.current_player ^= len(self.dice) == 0