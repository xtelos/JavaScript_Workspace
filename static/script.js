

// display form data onto webpage below submit button using price from flask
document.getElementById('game').addEventListener('submit', function(e) {
    e.preventDefault();
    var gameName = document.getElementsByName('gameName')[0].value;
    fetch('/games/' + gameName, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        var steam_price = data['price'];
        var gameData = '<p>' + gameName + ' is ' + steam_price + ' on the Steam store</p>';
        document.getElementById('rawData1').innerHTML = gameData;
        document.getElementById('rawData1').style.display = 'inline-block';
    });

    // fetch news data for game
    fetch('/gamedata/' + gameName, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
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
    });
});