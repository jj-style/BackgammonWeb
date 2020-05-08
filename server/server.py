from flask import Flask
from flask import request, jsonify, abort, make_response
from flask_cors import CORS, cross_origin
import random

app = Flask(__name__)
cors = CORS(app)

game_codes = []

def generate_game_code():
    valid = False
    while not valid:
        code = ""
        for i in range(3):
            code += (chr(random.randint(65,90))) # choose uppercase letter
        for i in range(3):
            code += (chr(random.randint(48,57))) # choose number
        valid = code not in game_codes
    game_codes.append(code)
    return code
    

@app.route("/api/game", methods=["GET"])
@cross_origin()
def games():
    return jsonify({"games":game_codes})

@app.route("/api/game/create", methods=["GET"])
@cross_origin()
def create_game():
    if request.method == "GET":
        code = generate_game_code()
        return jsonify({"gameCode":code})

@app.route("/api/game/join", methods=["POST"])
@cross_origin()
def join_game():
    if "gameCode" in request.args:
        gameCode = request.args.get("gameCode")
        if gameCode:
            if gameCode in game_codes:
                # handle joining the game
                return jsonify({"response":"OK"})
            else:
                return make_response(jsonify({"error":"game not found"}), 400)
        else:
            return make_response(jsonify({"error":"game code cannot be empty"}), 400)

    else:
        return make_response(jsonify({"error":"supply a game code"}), 400)


if __name__ == '__main__':
    app.run(debug=True)