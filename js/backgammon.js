URL_backgammon_API = "http://localhost:8080/backgammon/start"


backgammonGameInfo = {
    sessionId: "",
    backgammonBoard: {}
}

function startGame() {
    $.get(URL_backgammon_API + "/start", function (result) {
        backgammonGameInfo.sessionId = result.sessionId;
        initBoard();
        getBoard();
    });
}

function getBoard() {
    $.get(URL_backgammon_API + "/board/" + backgammonGameInfo.sessionId, function (result) {
        backgammonGameInfo.backgammonBoard = result.backgammonBoard;
        drawBoard(backgammonGameInfo.backgammonBoard);
    });
}

function sendPlayerMove(pitId) {
    request = $.get(URL_backgammon_API + "/move/" + backgammonGameInfo.sessionId + "/" + pitId);
    request.done(function (result) {
        backgammonGameInfo.backgammonBoard = result.backgammonBoard;
        drawBoard(backgammonGameInfo.backgammonBoard);
    });
    request.fail(function (xhr, statusText, errorThrown) {
        alert(JSON.parse(xhr.responseText).message);
    });
}

function initBoard() {
    $(".playerPanel").show();
    $(".board table").show();
    $(".winnerPanel").hide();
}


function completeGame(backgammonBoard) {
    $(".winnerPanel").show();
    $(".winnerName").html("Player " + backgammonBoard.winnerPlayer);
}

function drawBoard(backgammonBoard) {
    $(".playerName").html("Player " + backgammonBoard.currentPlayer);
    for (const player in backgammonBoard.boards) {
        pits = backgammonBoard.boards[player].pits;
        for (const pit in pits) {
            $("#player" + player + "Pit" + pit).html(pits[pit]);
        }
        $("#player" + player + "Treasure").html(backgammonBoard.boards[player].treasure);
    }
    if (backgammonBoard.gameState === 'COMPLETED') {
        completeGame(backgammonBoard);
    }
}

function bindButtons() {
    $(".startButton").click(function () {
        startGame();
    });

    $(".pitButton").click(function () {
        id = $(this).find(".pitText").attr("id");
        pitId = id.substr(-1);
        playerName = id.substr(6, 3);
        if (backgammonGameInfo.backgammonBoard.currentPlayer != playerName) {
            alert("It is not your turn");
            return;
        }
        sendPlayerMove(pitId);
    });
}

function setBoardSize() {
    ratio = $(".board").width() / 358;
    $(".board").height(ratio * 366);
    $(".board table tbody").height(ratio*366);
  
}

function createBoardButtons() {
    pitSize = 12;
    players = ['ONE', 'TWO']
    $.each(players, function (index, player) {
        rowData = "<tr>";
        treasure = '<td rowspan=2 class="treasure">' +
                '<a class="button " href="#" >' +
                '<span id="player{PLAYERNAME}Treasure" class="text" >1</span>' +
                '</a>' +
                '</td>';
        for (pit = 0; pit < pitSize; pit++) {
            // if (player === 'ONE' && pit === 0) {
            //     rowData = rowData + treasure.replace("{PLAYERNAME}", "ONE");
            // }
            rowData = rowData + '<td class="pit">' +
                    '<a class="button pitButton" href="#" >' +
                    '<span id="player' + player + 'Pit' + pit + '" class="text pitText">1</span>' +
                    '</a>' +
                    '</td>';

            if (pit === 5) {
                rowData = rowData + '<td class="boardCenter ">&nbsp;</td>';
            }
            // if (player === 'ONE' && pit === 5) {
            //     rowData = rowData + treasure.replace("{PLAYERNAME}", "TWO");
            // }
        }
        rowData = rowData + "</tr>";
        $('.board table> tbody:last').append($(rowData));
    });
}


function setWindowSizeListener() {
    $(window).resize(function () {
        setBoardSize();
    });
}

function initApplication() {
    setWindowSizeListener();
    setBoardSize();
    createBoardButtons();
    bindButtons();
}

