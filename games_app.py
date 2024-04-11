# Flask server to display data from redis database

from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import requests
import os
import json

def create_app():
    app = Flask(__name__)


    @app.route("/", methods=["GET", "POST"])
    def index():
        return render_template("index.html")


    @app.route('/games/<name>', methods=['GET', 'POST'])
    def get_game(name):
        target_id = find_target_game_id(name)
        gamePrice = get_game_price(target_id)
        return jsonify({'name': name,
                        'price': gamePrice})
        

    @app.route('/gamedata/<name>', methods=['GET', 'POST'])
    def display_game_data_from_steam(name):
        target_id = find_target_game_id(name)
        url = 'http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=' + str(target_id) + '&count=3&maxlength=500&format=json'
        response = requests.get(url)
        news_list = []
        for news in response.json()['appnews']['newsitems']:
            news_list.append(news['contents'])
        return news_list


    @app.route('/get_price/<game_id>', methods=['GET'])
    def get_game_price(game_id):
        params = {"appids": int(game_id), "cc": "us", "filters": "price_overview"}
        request = requests.get("http://store.steampowered.com/api/appdetails?appids=", params=params)
        json = request.json()
        if json[str(game_id)]["data"] == []:
            return "$0.00"
        return json[str(game_id)]["data"]["price_overview"]["final_formatted"]


    @app.route('/get_steamID/<game_name>', methods=['GET'])  
    def find_game_id(game_name):
        if game_name in game_names:
            target_id = ""
            for id in app_ids:
                if id["name"] == game_name:
                    target_id = id["appid"]
                    break
            return str(target_id)
        else:
            return "Game not found"
    
    return app
        

def get_app_ids_for_steam_games():
    params = {"l": "english", "cc": "us"}
    request = requests.get("http://api.steampowered.com/ISteamApps/GetAppList/v0002/", params=params)
    json = request.json()
    return json["applist"]["apps"]

def find_target_game_id(game_name):
    if game_name in game_names:
        target_id = ""
        for id in app_ids:
            if id["name"] == game_name:
                target_id = id["appid"]
                break
        return target_id
    else:
        return "Game not found"


def launch():
    return create_app()

if __name__ == "__main__":
    app = create_app()
    app_ids = get_app_ids_for_steam_games()
    game_names = []
    for id in app_ids:
        game_names.append(id["name"])
    app.run(debug=True, port=80, host='0.0.0.0')
