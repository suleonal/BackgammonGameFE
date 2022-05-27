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
    request = $.get(URL_backgammon_API + "/move/" + backgammonGameInfo.sessionId + "/" + backgammonGameInfo.moveSrc + "/" + backgammonGameInfo.moveDest);

    request.done(function (result) {
        if (result.backgammonBoard.currentPlayer != backgammonGameInfo.backgammonBoard.currentPlayer) {
            $(".diceData").html("<li>Roll Dice</li>");
        }
        console.log("[Success] New Move: player: " + backgammonGameInfo.backgammonBoard.currentPlayer + " " + backgammonGameInfo.moveSrc + " --> " + backgammonGameInfo.moveDest)
        backgammonGameInfo.moveSrc = magicNumber;
        backgammonGameInfo.moveDest = magicNumber;
        backgammonGameInfo.backgammonBoard = result.backgammonBoard;
        drawBoard(backgammonGameInfo.backgammonBoard);
    });
    request.fail(function (xhr, statusText, errorThrown) {
        msg = JSON.parse(xhr.responseText).message;
        console.log("[Fail] New Move: player: " + backgammonGameInfo.backgammonBoard.currentPlayer + " " + backgammonGameInfo.moveSrc + " --> " + backgammonGameInfo.moveDest + " , msg:" + msg)
        backgammonGameInfo.moveSrc = magicNumber;
        backgammonGameInfo.moveDest = magicNumber;
        alert(msg);
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
    //punish
    punishPlayerOne = "";
    if (backgammonBoard.punishZone.ONE > 0) {

        for (i = 0; i < backgammonBoard.punishZone.ONE; i++) {
            punishPlayerOne = punishPlayerOne + '<li><a href="#" class="stoneButton" id="stoneButton_' + -1 + '" ><img src="./img/white-stamp.png"/></a></li>';
        }

    } else {
        punishPlayerOne = "<li><a href='#' class='stoneButton' id='stoneButton_" + -1 + "' ><span>P</span></a></li>";
    }
    $("#punish_ONE").html(punishPlayerOne);

    punishPlayerTwo = "";
    if (backgammonBoard.punishZone.TWO > 0) {

        for (i = 0; i < backgammonBoard.punishZone.TWO; i++) {
            punishPlayerTwo = punishPlayerTwo + '<li><a href="#" class="stoneButton" id="stoneButton_' + -3 + '" ><img src="./img/black-stamp.png"/></a></li>';
        }

    } else {
        punishPlayerTwo = "<li><a href='#' class='stoneButton' id='stoneButton_" + -3 + "' ><span>P</span></a></li>";
    }

    $("#punish_TWO").html(punishPlayerTwo);

    if (backgammonBoard.moves.length > 0) {
        dicesData = "";
        for (const moveId in backgammonBoard.moves) {
            dice = backgammonBoard.moves[moveId];
            dicesData = dicesData + "<li>" + dice + "</li>";
        }
        $(".diceData").html(dicesData);
    }
    //treasure
    treasurePlayerOne = "";
    if (backgammonBoard.treasureZone.ONE > 0) {
        for (i = 0; i < backgammonBoard.treasureZone.ONE; i++) {
            treasurePlayerOne = treasurePlayerOne + '<li><a href="#" class="stoneButton" id="stoneButton_' + -2 + '" ><img src="./img/white-stamp.png"/></a></li>';
        }

    } else {
        treasurePlayerOne = "<li><a href='#' class='stoneButton' id='stoneButton_" + -2 + "' ><span>T</span></a></li>";
    }
    $("#treasure_ONE").html(treasurePlayerOne);

    treasurePlayerTwo = "";
    if (backgammonBoard.treasureZone.TWO > 0) {
        for (i = 0; i < backgammonBoard.treasureZone.TWO; i++) {
            treasurePlayerTwo = treasurePlayerTwo + '<li><a href="#" class="stoneButton" id="stoneButton_' + -4 + '" ><img src="./img/black-stamp.png"/></a></li>';
        }
    } else {
        treasurePlayerTwo = "<li><a href='#' class='stoneButton' id='stoneButton_" + -4 + "' ><span>T</span></a></li>";
    }
    $("#treasure_TWO").html(treasurePlayerTwo);

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


function displayPossibleDestinations() {

    backgammonBoard = backgammonGameInfo.backgammonBoard;
    src = backgammonGameInfo.moveSrc;

    for (i = 0; i < 24; i++) {
        $("#td_pit_" + i).css('border-color', 'black');
    }

    $("#td_pit_" + src).css('border-color', 'blue');

    for (const moveId in backgammonBoard.moves) {
        dice = backgammonBoard.moves[moveId];
        possibleDest = parseInt(src) + ((backgammonBoard.currentPlayer == "ONE" ? 1 : -1) * dice);
        $("#td_pit_" + possibleDest).css('border-color', 'red');
    }
}

function bindStoneButtons() {
    $(".stoneButton").click(function () {
        for (i = 0; i < 24; i++) {
            $("#td_pit_" + i).css('border-color', 'black');
        }

        if (backgammonGameInfo.moveSrc == magicNumber) {
            backgammonGameInfo.moveSrc = $(this).attr("id").substr(12);
            displayPossibleDestinations();
            return;
        } else {
            backgammonGameInfo.moveDest = $(this).attr("id").substr(12);
        }
        if (backgammonGameInfo.backgammonBoard.currentPlayer == "ONE" && ((backgammonGameInfo.moveDest - backgammonGameInfo.moveSrc) <= 0) && (backgammonGameInfo.moveSrc >= 0) && (backgammonGameInfo.moveSrc <= 0)) {
            alert("Wrong Direction");
            backgammonGameInfo.moveDest = magicNumber;
            backgammonGameInfo.moveSrc = magicNumber;
            return;
        }

        if (backgammonGameInfo.backgammonBoard.currentPlayer == "TWO" && ((backgammonGameInfo.moveDest - backgammonGameInfo.moveSrc) >= 0) && (backgammonGameInfo.moveSrc >= 0) && (backgammonGameInfo.moveSrc >= 0)) {
            alert("Wrong Direction");
            backgammonGameInfo.moveSrc = magicNumber;
            backgammonGameInfo.moveDest = magicNumber;
            return;
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
        //Roll dices
        if (boardRow == 1) {

            rowData = "<td id='Dices' colspan='14'><a href='#' class='diceButton' ><ul class='no-bullets diceData'><li>Roll Dices</li></ul></a></td>"
        } else
            for (pit = 0; pit < pitSize; pit++) {

                pitType = "";

                //pit 12
                if (boardRow == 0) {
                    pitId = Math.abs(pit - 12) + (boardRow * pitSize) - 1;
                    pitType = "pitTop";
                } else {
                    pitId = pit + pitSize;
                    pitType = "pitBottom";
                }

                rowData = rowData + '<td id="td_pit_' + pitId + '" class="pit ' + pitType + '"><ul id="' + (pitId) + '" class="no-bullets"><li>' + (pitId) + '</li></ul></td>';

                pitType = "";
                if (pitId === 6 || pitId == 17) { //punishZone
                    punishId = "punish_" + (pitId == 6 ? 'ONE' : 'TWO');

                    rowData = rowData + '<td class="boardCenter ' + pitType + '"><ul id="' + (punishId) + '" class="no-bullets"><li>&nbsp;</li></ul></td>';
                }
                if (pitId === 0 || pitId == 23) { //treasureZone
                    treasureId = "treasure_" + (pitId == 23 ? 'ONE' : 'TWO');

                    rowData = rowData + '<td class="boardCenter ' + pitType + '"><ul id="' + (treasureId) + '" class="no-bullets"><li>&nbsp;</li></ul></td>';
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

