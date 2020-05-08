class Game():

    def __init__(self):
        self.board = [0 for i in range(24)]
        self.players = []

    def add_player(self,player):
        self.players.append(player)

    @property
    def number_of_players(self):
        return len(self.players)