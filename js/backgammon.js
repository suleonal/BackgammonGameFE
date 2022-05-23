URL_backgammon_API = "http://localhost:8080/backgammon"


backgammonGameInfo = {
    sessionId: "",
    backgammonBoard: {},
    moveSrc: 51,
    moveDest: 51
}

magicNumber = 51;

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


function rollDice() {
    $.get(URL_backgammon_API + "/roll/" + backgammonGameInfo.sessionId, function (result) {
        backgammonGameInfo.backgammonBoard = result.backgammonBoard;
        drawBoard(backgammonGameInfo.backgammonBoard);
    });
}

function sendPlayerMove() {
    request = $.get(URL_backgammon_API + "/move/" + backgammonGameInfo.sessionId + "/" + backgammonGameInfo.moveSrc + "/" +backgammonGameInfo.moveDest);
    request.done(function (result) {
        backgammonGameInfo.moveSrc = magicNumber;
        backgammonGameInfo.moveDest = magicNumber;
        if(result.backgammonBoard.currentPlayer != backgammonGameInfo.backgammonBoard.currentPlayer){
            $(".diceData").html("<li>Roll Dice</li>");
        }
        backgammonGameInfo.backgammonBoard = result.backgammonBoard;
        drawBoard(backgammonGameInfo.backgammonBoard);
    });
    request.fail(function (xhr, statusText, errorThrown) {
        alert(JSON.parse(xhr.responseText).message);
        backgammonGameInfo.moveSrc = magicNumber;
        backgammonGameInfo.moveDest = magicNumber;
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

    pits = backgammonBoard.pits;
    for (const pit in pits) {
        pitData = pits[pit];
        listData = "";
        for (const stoneId in pitData) {
            stone = pitData[stoneId];
            stoneType = stone.player == 'ONE' ? './img/white-stamp.png' : './img/black-stamp.png';
            listData = listData + '<li><a href="#" class="stoneButton" id="stoneButton_' + pit + '" ><img src="' + stoneType + '"/></a></li>';
        }
        if (listData === "") {
            listData = "<li><a href='#' class='stoneButton' id='stoneButton_" + pit + "' ><span>" + pit + "</span></a></li>"
        }
        $("#" + pit).html(listData);

    }

    if (backgammonBoard.moves.length > 0) {
        dicesData = "";
        for (const moveId in backgammonBoard.moves) {
            dice = backgammonBoard.moves[moveId];
            dicesData = dicesData + "<li>" + dice + "</li>";
        }
        $(".diceData").html(dicesData);
    }


    if (backgammonBoard.gameState === 'COMPLETED') {
        completeGame(backgammonBoard);
    }

    bindStoneButtons();
}

function bindButtons() {
    $(".startButton").click(function () {
        startGame();
    });

    
    $(".diceButton").click(function () {
        rollDice();
    });
    bindStoneButtons();

}

function bindStoneButtons() {
    $(".stoneButton").click(function () {
        if (backgammonGameInfo.moveSrc == magicNumber) {
            backgammonGameInfo.moveSrc = $(this).attr("id").substr(12);
        } else {
            backgammonGameInfo.moveDest = $(this).attr("id").substr(12);
        }
        if (backgammonGameInfo.moveSrc != magicNumber && backgammonGameInfo.moveDest != magicNumber) {
            sendPlayerMove();
        }
    });
}



function setBoardSize() {
    ratio = $(".board").width() / 358;
    $(".board").height(ratio * 366);
    $(".board table tbody").height(ratio * 366);
}

function createBoardButtons() {
    pitSize = 12;
    boardRows = [0, 1, 2]
    $.each(boardRows, function (index, boardRow) {
        rowData = "<tr>";
        if (boardRow == 1) {

            rowData = "<td id='Dices' colspan='13'><a href='#' class='diceButton' ><ul class='no-bullets diceData'><li>Roll Dices</li></ul></a></td>"
        } else
            for (pit = 0; pit < pitSize; pit++) {

                pitType = "";


                if (boardRow == 0) {
                    pitId = Math.abs(pit - 12) + (boardRow * pitSize) - 1;
                    pitType = "pitTop";
                } else {
                    pitId = pit + pitSize;
                    pitType = "pitBottom";
                }

                rowData = rowData + '<td class="pit ' + pitType + '"><ul id="' + (pitId) + '" class="no-bullets"><li>' + (pitId) + '</li></ul>' +
                    '</td>';
                if (pitId === 6 || pitId == 17) {
                    rowData = rowData + '<td class="boardCenter">&nbsp;</td>';
                }

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

