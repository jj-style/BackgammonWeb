from copy import deepcopy
import random

class Game():

    def __init__(self):
        self.board = self.set_initial_board([0 for i in range(24)])
        self.taken_pieces = []
        self.players = []
        self.current_player = None
        self.dice = []
        self.removed_pieces = [0,0] #white, black
        self.game_over = False

    def start_game(self):
        self.current_player = random.randint(0,1)
        # self.current_player = 1 # REMOVE

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

    def set_takeoff_board(self, board):
        new_board = deepcopy(board)
        new_board[0] = -2
        new_board[1] = -3
        new_board[2] = -2
        new_board[3] = -3
        new_board[4] = -2
        new_board[5] = -3
        new_board[23] = 2
        new_board[22] = 3
        new_board[21] = 2
        new_board[20] = 3
        new_board[19] = 2
        new_board[18] = 3
        return new_board

    def set_win_board(self, board):
        new_board = deepcopy(board)
        new_board[0] = -1
        new_board[23] = 1
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
        # self.dice = [1,6] # REMOVE

    def switch_turn(self):
        self.dice = []
        self.current_player ^= 1

    def check_game_over(self):
        self.game_over = self.removed_pieces[self.current_player] == 15
        # for debugging when only have one piece on the board
        if self.current_player == 0:
            won = True
            for i in self.board:
                if i < 0:
                    won = won and False
            self.game_over = won
        else:
            won = True
            for i in self.board:
                if i > 0:
                    won = won and False
            self.game_over = won

    def dests(self, source):
        if self.current_player == 0:
            valid_dests = [ source - d for d in self.dice if source-d in range(len(self.board)) and self.board[source - d] <= 1 ]
        else:
            valid_dests = [ source + d for d in self.dice if source+d in range(len(self.board)) and self.board[source + d] >= -1 ]
        return valid_dests

    def get_highest_spike_with_pieces(self):
        # always return a value otherwise they will have won the game
        if self.current_player == 0:
            for i in range(5,-1,-1):
                if self.board[i] != 0:
                    return i
        else:
            for i in range(18,24,1):
                if self.board[i] != 0:
                    return i

    def takeoff_dests(self, source):
        if self.current_player == 0:
            highest_spike_with_pieces = self.get_highest_spike_with_pieces()
            if max(self.dice) > highest_spike_with_pieces + 1 and source == highest_spike_with_pieces:
                return ["off"] # allow moving off from this piece
            for n in self.dice:
                if self.board[n-1] != 0 and source == n - 1:
                    return ["off"]
        else:
            highest_spike_with_pieces = self.get_highest_spike_with_pieces()
            if max(self.dice) > ((23 - highest_spike_with_pieces) % 6)  + 1 and source == highest_spike_with_pieces:
                return ["off"]
            for n in self.dice:
                if self.board[24-n] != 0 and source == 24-n:
                    return ["off"]
        return []

    def compute_all_moves(self):
        print(f"Computing all possible moves. Dice is ${self.dice}")
        if self.current_player == 0:
            if -1 in self.taken_pieces:
                all_moves = { 24:self.dests(24) }
            else:
                all_moves = { source:self.dests(source) for source in range(len(self.board)) if self.board[source] < 0 }
                if self.can_takeoff():
                    # if you can take off then the moves are the same as normal plus extra for taking off
                    for i in range(6):
                        if i in all_moves:
                            all_moves[i].extend(self.takeoff_dests(i))
                        else:
                            all_moves[i] = self.takeoff_dests(i)
                    
        else:
            if 1 in self.taken_pieces:
                all_moves = { -1:self.dests(-1) }
            else:
                all_moves = { source:self.dests(source) for source in range(len(self.board)) if self.board[source] > 0 }
                if self.can_takeoff():
                    # if you can take off then the moves are the same as normal plus extra for taking off
                    for i in range(18,24):
                        if i in all_moves:
                            all_moves[i].extend(self.takeoff_dests(i))
                        else:
                            all_moves[i] = self.takeoff_dests(i)
        return { key:value for key,value in all_moves.items() if value }

    def can_takeoff(self):
        if self.current_player == 0:
            for i in self.board[6:]:
                if i < 0:
                    return False
            return True
        else:
            for i in self.board[:len(self.board)-6]:
                if i > 0:
                    return False
            return True

    def remove_piece(self):
        self.taken_pieces[self.current_player] += 1
        
    def move(self, from_index, to_index):
        if to_index == "off":
            from_index = int(from_index)

            if self.current_player == 0:
                self.board[from_index] += 1
                self.removed_pieces[0] += 1
                if (from_index + 1) in self.dice:
                    self.dice.remove(from_index + 1)
                else:
                    self.dice.remove(max(self.dice))
            else:
                self.board[from_index] -= 1
                self.removed_pieces[1] += 1
                if (24-from_index) in self.dice:
                    self.dice.remove(24-from_index)
                else:
                    self.dice.remove(max(self.dice))

        else:
            print(f"-----------------{from_index}, {to_index}")
            from_index = int(from_index)
            to_index = int(to_index)

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

        self.check_game_over()

        if not self.game_over:
            self.current_player ^= len(self.dice) == 0