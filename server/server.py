from flask import Flask
from flask import request, jsonify, abort, make_response
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, send, emit
import random, json
from backgammon.game import Game

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

GAMES = {}

def generate_game_code():
    valid = False
    while not valid:
        code = ""
        for i in range(3):
            code += (chr(random.randint(65,90))) # choose uppercase letter
        for i in range(3):
            code += (chr(random.randint(48,57))) # choose number
        valid = code not in GAMES
    GAMES[code] = Game()
    return code
    
@app.route("/api/game/create", methods=["GET"])
@cross_origin()
def create_game():
    if request.method == "GET":
        code = generate_game_code()
        if request.args.get("name"):
            # print(request.args.get("name"))
            GAMES[code].add_player(request.args.get("name"))
        else:
            return make_response(jsonify({"error":"please enter a display name"}), 400)
        return jsonify({"gameCode":code})

@app.route("/api/game/join", methods=["POST"])
@cross_origin()
def join_game():
    if "gameCode" in request.args:
        gameCode = request.args.get("gameCode")
        if gameCode:
            if gameCode in GAMES:
                # handle joining the game
                if (GAMES[gameCode].number_of_players == 1):
                    if request.args.get("name"):
                        if request.args.get("name") not in GAMES[gameCode].players:
                            GAMES[gameCode].add_player(request.args.get("name"))
                            GAMES[gameCode].start_game()
                            return jsonify({"response":"OK"})
                        else:
                            return make_response(jsonify({"error":"name already in use in the game"}), 400)
                    else:
                        return make_response(jsonify({"error":"please enter a display name"}), 400)
                else:
                    return make_response(jsonify({"error":"game already full"}), 400)
            else:
                return make_response(jsonify({"error":"game not found"}), 400)
        else:
            return make_response(jsonify({"error":"game code cannot be empty"}), 400)

    else:
        return make_response(jsonify({"error":"supply a game code"}), 400)

@app.route("/api/game", methods=["GET"])
@cross_origin()
def games():
    return jsonify({"games":GAMES})

@app.route("/api/game/<gameCode>", methods=["GET","POST"])
@cross_origin()
def game(gameCode):
    if request.method == "GET":
        return json.dumps(GAMES[gameCode].__dict__)
    elif request.method == "POST":
        from_index = request.args.get("fromIndex")
        to_index = request.args.get("toIndex")
        GAMES[gameCode].move(int(from_index), int(to_index))
        return jsonify({"response":"OK"})

@app.route("/api/game/<gameCode>/roll", methods=["POST"])
@cross_origin()
def roll_dice(gameCode):
    if request.method == "POST":
        GAMES[gameCode].roll()
        return jsonify({"response":"OK"})

@socketio.on('message')
def handle_message(message):
    print('received message: ' + message)

@socketio.on('SUBSCRIBE')
def subscribe_to_game(code):
    print("subscribing to game")
    emit("SUBSCRIBED", json.dumps(GAMES[code].__dict__))

@socketio.on('ROLL')
def roll_socket(gameCode):
    GAMES[gameCode].roll()
    emit("NEWDATA", json.dumps(GAMES[gameCode].__dict__))

@socketio.on('MOVE')
def move_piece_socket(game_code, from_index, to_index):
    GAMES[game_code].move(int(from_index), int(to_index))
    emit("MOVED", json.dumps(GAMES[game_code].__dict__))

if __name__ == '__main__':
    socketio.run(app, debug=False)