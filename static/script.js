

// display form data onto webpage below submit button using price from flask
document.getElementById('game').addEventListener('submit', function(e) {
    e.preventDefault();
    var gameName = document.getElementsByName('gameName')[0].value;
    var xhr = new XMLHttpRequest();
    var url = '/games/' + gameName;
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            var steam_price = data['price'];
            var gameData = '<p>' + gameName + ' is ' + steam_price + ' on the Steam store</p>';
            document.getElementById('rawData1').innerHTML = gameData;
            document.getElementById('rawData1').style.display = 'inline-block';
        }
    };
    xhr.send();
});
// add news for the game searched from flask
document.getElementById('game').addEventListener('submit', function(e) {
    e.preventDefault();
    var gameName = document.getElementsByName('gameName')[0].value;
    var xhr = new XMLHttpRequest();
    var url = '/gamedata/' + gameName;
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            var news = '<p>News for ' + gameName + '</p>';
            document.getElementById('rawData2').innerHTML = news;
            var newsList = document.createElement('ul');
            document.getElementById('rawData2').appendChild(newsList);
            for (var i = 0; i < data.length; i++) {
                var news = '<li>' + data[i] + '</li>';
                newsList.innerHTML += news;
                var line_break = document.createElement('br');
                newsList.appendChild(line_break);
            }
            document.getElementById('rawData2').style.display = 'inline-block';
            var favoriteButton = document.getElementById('favoriteButton')
            favoriteButton.style.display = 'inline';
            checkIfFavorited(gameName)
        }
    };
    xhr.send();
});

// Adds game to favorites
function change()
{
    var elem = document.getElementById("favoriteButton");
    var gameName = document.getElementsByName('gameName')[0].value;
    if (elem.value=="Remove from Favorites") {
        var xhr = new XMLHttpRequest();
        var url = '/remove_favorite/' + gameName;
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            if (xhr.status === 200) {
                elem.value = "Add to Favorites";}
            else elem.value = xhr.status;
        }; 
        xhr.send();
    }
    else {
        var xhr = new XMLHttpRequest();
        var url = '/add_favorite/' + gameName;
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            if (xhr.status === 200) {
                elem.value = "Remove from Favorites";}
            else elem.value = xhr.status;
        }; 
        xhr.send();
    }
}

function checkIfFavorited(gameName)
{
    var elem = document.getElementById("favoriteButton");
    var xhr = new XMLHttpRequest();
    var url = '/check_favorite/' + gameName;
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            if (xhr.responseText == "True")
                elem.value = "Remove from Favorites";}
            else elem.value = "Add to Favorites";
    }; 
    xhr.send();
}