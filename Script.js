// ==UserScript==
// @name         AMQ NBA Mode
// @namespace    https://github.com/Frittutisna
// @version      0-beta.0.0
// @description  Script to track NBA Mode on AMQ
// @author       Frittutisna
// @match        https://*.animemusicquiz.com/*
// ==/UserScript==

(function() {
    'use strict';

    let playersCache = [];

    let config = {
        delay               : 500,
        gameNumber          : 1,
        hostId              : 0,
        teamNames           : {away: "Away", home: "Home"},
        captains            : [1, 5],
        targetScore         : 8,
        quarterMaxSongs     : 10,
        totalQuarters       : 4,
        isSwapped           : false,
        isTest              : false,
        seriesLength        : 7,
        seriesStats         : {awayWins: 0, homeWins: 0, history: []},
        links               : {
            guide           : "https://github.com/Frittutisna/NBA-Mode/blob/main/Guide.md",
            flowchart       : "https://github.com/Frittutisna/NBA-Mode/blob/main/Flowchart/Flowchart.pdf"
        },
        selectors           : {
            playIcon        : "fa-play-circle",
            pauseIcon       : "fa-pause-circle",
            pauseBtn        : "qpPauseButton",
            returnBtn       : "qpReturnToLobbyButton",
            lobbyName       : "mhRoomNameInput",
            lobbyChange     : "mhChangeButton",
            swalConfirm     : '.swal2-confirm'
        }
    };

    const match = {
        isActive        : false,
        quarter         : 1,
        songInQuarter   : 0,
        totalScore      : {away: 0, home: 0},
        quarterScore    : {away: 0, home: 0},
        possession      : 'away',
        history         : [],
        pendingPause    : false,
        streaks         : {}, 
        answerQueue     : []  
    };

    const gameConfig = {
        awaySlots           : [1, 2, 3, 4],
        homeSlots           : [5, 6, 7, 8],
        posNames            : ["T1", "T2", "T3", "T4"] 
    };

    const TERMS = {
        "away"              : "The team listed first on Challonge. Starts Q1 and Q3 with possession",
        "home"              : "The team listed second on Challonge. Starts Q2 and Q4 with possession",
        "possession"        : "The state of being the Attacking Team. Swaps after every song unless after a Slam Dunk or between Quarters",
        "captain"           : "Slots 1 and 5. Correct guesses count +1 to TDIFF",
        "hot streak"        : "Player that gets ≥ 3 in a row. Correct guesses count +1 to TDIFF",
        "fast break"        : "If both teams answer correctly, the team with the fastest correct player gets +1 to their TDIFF sum",
        "tdiff"             : "Total Difference: Attacking - Defending + Fast Break",
        "slam dunk"         : "TDIFF ≥ 5: Attacking Team gets 3 points and keeps possession",
        "3-pointer"         : "TDIFF = 4 or 3: Attacking Team gets 3 points. Possession swaps",
        "2-pointer"         : "TDIFF = 2 or 1: Attacking Team gets 2 points. Possession swaps",
        "free throw"        : "TDIFF = 0: Attacking Team gets 1 point. Possession swaps",
        "rebound"           : "TDIFF = -1: No points awarded. Possession swaps",
        "turnover"          : "TDIFF = -2. Defending Team gets 1 point. Possession swaps",
        "block"             : "TDIFF = -3 or -4. Defending Team gets 2 points. Possession swaps",
        "steal"             : "TDIFF ≤ -5. Defending Team gets 3 points. Possession swaps",
        "buzzer beater"     : "On Song 10 of a Quarter, point-scoring plays are worth +1 point",
        "elam ending"       : `A Quarter ends if a team scores ≥${config.targetScore} points in said quarter, or after ${config.quarterMaxSongs} songs`,
    };

    const COMMAND_DESCRIPTIONS = {
        "end"               : "Stop the game tracker",
        "export"            : "Download the HTML scoresheet",
        "flowchart"         : "Show link to the flowchart",
        "guide"             : "Show link to the guide",
        "howTo"             : "Show the step-by-step setup tutorial",
        "resetEverything"   : "Hard reset: Wipe all settings, series history, and teams to default",
        "resetGame"         : "Wipe current Game progress and stop tracker",
        "resetSeries"       : "Wipe all series history and reset to Game 1",
        "setGame"           : "Set the current game number (/nba setGame [1-7])",
        "setHost"           : "Set the script host (/nba setHost [1-8])",
        "setSeries"         : "Set the series length (/nba setSeries [1/2/7]",
        "setTeams"          : "Set team names (/nba setTeams [Away] [Home])",
        "setTest"           : "Enable/disable loose lobby validation (/nba setTest [true/false])",
        "start"             : "Start the game tracker",
        "swap"              : "Swap Away and Home teams",
        "whatIs"            : "Explain a term (/nba whatIs [Term])"
    };

    const parseBool = (val) => {
        if (typeof val === 'boolean') return val;
        const s = String(val).toLowerCase().trim();
        if (['t', '1', 'y', 'true', 'yes'].includes(s)) return true;
        if (['f', '0', 'n', 'false', 'no'].includes(s)) return false;
        return null;
    };

    const toTitleCase = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const getArrowedTeamName = (side) => {
        const actualSide = config.isSwapped ? (side === 'home' ? 'away' : 'home') : side;
        const actualName = config.teamNames[actualSide];
        return actualSide === 'away' ? `← ${actualName}` : `${actualName} →`;
    };

    const getCleanTeamName = (side) => {
        const actualSide = config.isSwapped ? (side === 'home' ? 'away' : 'home') : side;
        return config.teamNames[actualSide];
    };

    const getPlayerNameAtTeamId = (teamId) => {
        if          (typeof quiz    !== 'undefined' && quiz     .inQuiz) {
            const p = Object.values(quiz    .players)   .find(player => player.teamNumber == teamId);
            if (p) return p.name;
        } else if   (typeof lobby   !== 'undefined' && lobby    .inLobby) {
            const p = Object.values(lobby   .players)   .find(player => player.teamNumber == teamId);
            if (p) return p.name;
        } else if   (playersCache.length > 0) {
            const p = playersCache                      .find(player => player.teamNumber == teamId);
            if (p) return p.name;
        }

        return null;
    };

    const updateLobbyName = (awayClean, homeClean) => {
        if (config.isTest) {
            systemMessage("Test Mode active: Skipping lobby name update");
            return;
        }

        const awayAbbr  = awayClean.substring(0, 3).toUpperCase();
        const homeAbbr  = homeClean.substring(0, 3).toUpperCase();
        const newTitle  = `NBA Tour: ${awayAbbr} @ ${homeAbbr}`;
        const nameInput = document.getElementById(config.selectors.lobbyName);
        const changeBtn = document.getElementById(config.selectors.lobbyChange);

        if (nameInput && changeBtn) {
            nameInput.value = newTitle;
            changeBtn.click();
            systemMessage(`Lobby name updated to: ${nameInput.value}`);
        }
    };

    const messageQueue = {
        queue           : [],
        isProcessing    : false,
        add             : function(msg, isSystem = false) {
            const LIMIT = 150;
            if (msg.length <= LIMIT) this.queue.push({msg, isSystem});
            else {
                let remaining = msg;
                while (remaining.length > 0) {
                    if (remaining.length <= LIMIT) {this.queue.push({msg: remaining, isSystem}); break}
                    let splitIndex  = -1;
                    
                    let idx = remaining.lastIndexOf('|', LIMIT);
                    if (idx !== -1) splitIndex = idx;
                    else {
                        idx = remaining.lastIndexOf('.', LIMIT);
                        if (idx !== -1) splitIndex = idx;
                        else {
                            idx = remaining.lastIndexOf(',', LIMIT);
                            if (idx !== -1) splitIndex = idx;
                            else {
                                idx = remaining.lastIndexOf(' ', LIMIT);
                                if (idx !== -1) splitIndex = idx;
                                else splitIndex = LIMIT;
                            }
                        }
                    }

                    let cutEnd      = 0;
                    let nextStart   = 0;

                    if (splitIndex  === LIMIT) {
                        cutEnd      =   LIMIT;
                        nextStart   =   LIMIT;
                    } else {
                        cutEnd      =   splitIndex;
                        nextStart   =   splitIndex + 1;
                        if (nextStart < remaining.length && remaining[nextStart] === ' ') nextStart++;
                    }
                    
                    this.queue.push({msg: remaining.substring(0, cutEnd), isSystem});
                    remaining = remaining.substring(nextStart);
                }
            }

            this.process();
        },

        process: function() {
            if (this.isProcessing || this.queue.length === 0) return;
            this.isProcessing   = true;
            const item          = this.queue.shift();

            if (item.isSystem) {
                if (typeof gameChat !== 'undefined') gameChat.systemMessage(item.msg);
            } else if (typeof socket !== 'undefined') {
                socket.sendCommand({
                    type    : "lobby",
                    command : "game chat message",
                    data    : {msg: item.msg, teamMessage: false}
                });
            }

            setTimeout(() => {
                this.isProcessing = false;
                this.process();
            }, config.delay);
        }
    };

    const systemMessage = (msg) => {messageQueue.add(msg, true)};
    const chatMessage   = (msg) => {messageQueue.add(msg, false)};

    const sendGameCommand = (cmd) => {
        const s = config.selectors;

        if (cmd === "return to lobby") {
            const returnBtn = document.getElementById(s.returnBtn);

            if (returnBtn) {
                returnBtn.click();

                setTimeout(() => {
                    const confirmBtn = document.querySelector(s.swalConfirm);
                    if (confirmBtn) confirmBtn.click();
                }, config.delay);
            }
        } else if (cmd === "pause game" || cmd === "resume game") {
            const pauseBtn = document.getElementById(s.pauseBtn);

            if (pauseBtn) {
                const icon = pauseBtn.querySelector("i");

                if (icon) {
                    const isPaused  = icon.classList.contains(s.playIcon);
                    const isPlaying = icon.classList.contains(s.pauseIcon);

                    if      (cmd === "resume game"  && isPaused)    pauseBtn.click();
                    else if (cmd === "pause game"   && isPlaying)   pauseBtn.click();
                } else                                              pauseBtn.click();
            }
        } else if (typeof socket !== 'undefined') socket.sendCommand({type: "quiz", command: cmd});
    };

    const resetMatchData = () => {
        match.isActive      = false;
        match.quarter       = 1;
        match.songInQuarter = 0;
        match.totalScore    = {away: 0, home: 0};
        match.quarterScore  = {away: 0, home: 0};
        match.possession    = 'away';
        match.history       = [];
        match.pendingPause  = false;
        match.streaks       = {};
        match.answerQueue   = [];
    };

    const resetEverything = () => {
        match.isActive      = false;
        resetMatchData();
        config.gameNumber   = 1;
        config.hostId       = 0;
        config.teamNames    = {away: "Away", home: "Home"};
        config.captains     = [1, 5];
        config.isSwapped    = false;
        config.isTest       = false;
        config.seriesLength = 7;
        config.seriesStats  = {awayWins: 0, homeWins: 0, history: []};
        systemMessage("Everything has been reset");
    };

    const resolveTie = (awaySlots, homeSlots, silent = false) => {
        const q4History = match.history.filter(r => r.q === 4);

        const getStat = (side, targetIndices) => {
            let total   = 0;
            const slots = side === 'away' ? awaySlots : homeSlots;

            q4History.forEach(row => {
                const arr = side === 'away' ? row.awayArr : row.homeArr;

                targetIndices.forEach(idx => {
                    if (arr[idx] === 1) {
                        const slotId    =   slots[idx];
                        const isCaptain =   config.captains.includes(slotId);
                        total           +=  (isCaptain ? 2 : 1);
                    }
                });
            });

            return total;
        };

        const msg = (txt) => {if (!silent) chatMessage(txt)};

        const awayWeighted  = getStat('away', [0, 1, 2, 3]);
        const homeWeighted  = getStat('home', [0, 1, 2, 3]);
        if (awayWeighted !== homeWeighted) {
            msg(`Tiebreaker: ${getArrowedTeamName(awayWeighted > homeWeighted ? 'away' : 'home')} wins on Weighted Total Tiebreaker (${awayWeighted}-${homeWeighted})`);
            return awayWeighted > homeWeighted ? 'away' : 'home';
        }

        const awayCapt = getStat('away', [0]);
        const homeCapt = getStat('home', [0]);
        if (awayCapt !== homeCapt) {
            msg(`Tiebreaker: ${getArrowedTeamName(awayCapt > homeCapt ? 'away' : 'home')} wins on Captain Tiebreaker (${awayCapt}-${homeCapt})`);
            return awayCapt > homeCapt ? 'away' : 'home';
        }

        const awayT2 = getStat('away', [1]);
        const homeT2 = getStat('home', [1]);
        if (awayT2 !== homeT2) {
            msg(`Tiebreaker: ${getArrowedTeamName(awayT2 > homeT2 ? 'away' : 'home')} wins on T2 Tiebreaker (${awayT2}-${homeT2})`);
            return awayT2 > homeT2 ? 'away' : 'home';
        }

        const awayT3 = getStat('away', [2]);
        const homeT3 = getStat('home', [2]);
        if (awayT3 !== homeT3) {
            msg(`Tiebreaker: ${getArrowedTeamName(awayT3 > homeT3 ? 'away' : 'home')} wins on T3 Tiebreaker (${awayT3}-${homeT3})`);
            return awayT3 > homeT3 ? 'away' : 'home';
        }

        const lastEntry     = match.history[match.history.length - 1];
        const winnerSide    = lastEntry.poss === 'away' ? 'home' : 'away';
        msg(`Tiebreaker: ${getArrowedTeamName(winnerSide)} wins on Defending Tiebreaker`);
        return winnerSide;
    };

    const endGame = (winnerSide) => {
        let seriesFinished  = false;

        if (config.seriesLength > 1) {
            const finalScoreStr = config.isSwapped ? `${match.totalScore.home}-${match.totalScore.away}` : `${match.totalScore.away}-${match.totalScore.home}`;
            config.seriesStats.history.push(finalScoreStr);
            let actualWinnerSide = winnerSide;

            if (config.isSwapped) {
                 if         (winnerSide === 'away') actualWinnerSide = 'home';
                 else if    (winnerSide === 'home') actualWinnerSide = 'away';
            }

            if      (actualWinnerSide === 'away') config.seriesStats.awayWins++;
            else if (actualWinnerSide === 'home') config.seriesStats.homeWins++;
            
            const winThreshold = config.seriesLength / 2;
            if (config.seriesStats.awayWins > winThreshold || config.seriesStats.homeWins > winThreshold) seriesFinished = true;
        } else seriesFinished = true;

        if (!config.isTest) downloadScoresheet();

        match.isActive      = false;
        match.pendingPause  = false;

        if (!seriesFinished) {
            config.gameNumber++;
            config.isSwapped = !config.isSwapped;
        } else if (config.seriesLength > 1) {
            const sStats    = config.seriesStats;
            const winner    = sStats.awayWins > sStats.homeWins ? config.teamNames.away : config.teamNames.home;
            const wPts      = Math.max(sStats.awayWins, sStats.homeWins);
            const lPts      = Math.min(sStats.awayWins, sStats.homeWins);
            chatMessage(`Series finished | ${winner} won ${wPts}-${lPts}.`);
        }

        setTimeout(() => sendGameCommand("return to lobby"), config.delay);
    };

    const validateLobby = () => {
        if (config.hostId === 0)                            return {valid: false, msg: "Error: Host not set, use /nba setHost [1-8]"};
        if (typeof lobby === 'undefined' || !lobby.inLobby) return {valid: false, msg: "Error: Not in lobby"};
        const players   = Object.values(lobby.players);
        const notReady  = players.filter(p => !p.ready);
        if (notReady.length > 0)                            return {valid: false, msg: "Error: Not all players are ready"};
        if (!config.isTest && players.length !== 8)         return {valid: false, msg: "Error: Not exactly 8 players, use /nba setTest True to bypass"};
        return {valid: true};
    };

    const startGame = () => {
        const check = validateLobby();
        if (!check.valid) {systemMessage(check.msg); return}
        resetMatchData();
        match.isActive = true;
        chatMessage(`Game ${config.gameNumber}: ${getArrowedTeamName('away')} @ ${getArrowedTeamName('home')} is close to tip-off!`);
    };

    const processRound = (payload) => {
        if (!match.isActive) return;
        match.songInQuarter++;
        const wasPendingPause   = match.pendingPause;
        match.pendingPause      = false;
        const players           = payload.players;
        const resultsMap        = {};
        players.forEach(p => {resultsMap[p.gamePlayerId] = p.correct});

        const checkSlot = (targetTeamId) => {
            const p = Object.values(quiz.players).find(x => x.teamNumber == targetTeamId);
            if (!p || !p.name) return false;
            return resultsMap[p.gamePlayerId] === true;
        };

        const getPlayerId = (targetTeamId) => {
            const p = Object.values(quiz.players).find(x => x.teamNumber == targetTeamId);
            return p ? p.gamePlayerId : null;
        };

        const currentAwaySlots = config.isSwapped ? gameConfig.homeSlots : gameConfig.awaySlots;
        const currentHomeSlots = config.isSwapped ? gameConfig.awaySlots : gameConfig.homeSlots;

        const computeTeamStats = (slots) => {
            let sum             = 0;
            let correctCount    = 0;
            let pattern         = "";

            slots.forEach(slotId => {
                const isCorrect = checkSlot(slotId);
                const pid       = getPlayerId(slotId);
                if (pid != null && match.streaks[pid] === undefined) match.streaks[pid] = 0;

                if (isCorrect) {
                    correctCount++;
                    if (pid != null) match.streaks[pid]++;
                    let val = 1
                    if (config.captains.includes(slotId))       val += 1;
                    if (pid != null && match.streaks[pid] >= 3) val += 1;
                    sum     += val;
                    pattern += val.toString();
                } else {
                    if (pid != null) match.streaks[pid] = 0;
                    pattern += "0";
                }
            });
            return {sum, correctCount, pattern};
        };

        const awayStats = computeTeamStats(currentAwaySlots);
        const homeStats = computeTeamStats(currentHomeSlots);

        let fastBreakBonus  = 0; 
        let fastBreakWinner = null;

        if (awayStats.correctCount > 0 && homeStats.correctCount > 0) {
            for (const pid of match.answerQueue) {
                if (resultsMap[pid]) {
                    const pObj = Object.values(quiz.players).find(p => p.gamePlayerId === pid);

                    if (pObj) {
                        if (currentAwaySlots.includes(pObj.teamNumber)) {
                            fastBreakBonus  = 1;
                            fastBreakWinner = 'away';
                        } else {
                            fastBreakBonus  = -1; 
                            fastBreakWinner = 'home';
                        }
                    }

                    break;
                }
            }
        }

        let tdiff = 0;
        let fbVal = 0;
        
        if (match.possession === 'away') {
            if (fastBreakWinner === 'away') fbVal = 1;
            tdiff = (awayStats.sum + fbVal) - homeStats.sum;
        } else {
            if (fastBreakWinner === 'home') fbVal = 1;
            tdiff = (homeStats.sum + fbVal) - awayStats.sum;
        }

        let result = {name: "", pts: 0, swap: true, team: "none"};

        if      (tdiff >=   5)  result = {name: "Slam Dunk",    pts: 3, swap: false,    team: "att"};
        else if (tdiff >=   3)  result = {name: "3-Pointer",    pts: 3, swap: true,     team: "att"};
        else if (tdiff >=   1)  result = {name: "2-Pointer",    pts: 2, swap: true,     team: "att"};
        else if (tdiff ===  0)  result = {name: "Free Throw",   pts: 1, swap: true,     team: "att"};
        else if (tdiff ===  -1) result = {name: "Rebound",      pts: 0, swap: true,     team: "none"};
        else if (tdiff ===  -2) result = {name: "Turnover",     pts: 1, swap: true,     team: "def"};
        else if (tdiff >=   -4) result = {name: "Block",        pts: 2, swap: true,     team: "def"};
        else                    result = {name: "Steal",        pts: 3, swap: true,     team: "def"};

        const isBuzzerBeater    = match.songInQuarter === config.quarterMaxSongs;
        let resultDisplayName   = result.name;

        if (isBuzzerBeater && result.name !== "Rebound") result.pts += 1;
        let scoringTeam = null;

        if      (result.team === "att") scoringTeam = match.possession;
        else if (result.team === "def") scoringTeam = match.possession === 'away' ? 'home' : 'away';

        if (scoringTeam) {
            match.totalScore    [scoringTeam] += result.pts;
            match.quarterScore  [scoringTeam] += result.pts;
        }

        const prevPoss = match.possession;
        if (result.swap) match.possession = match.possession === 'away' ? 'home' : 'away';
        
        let displayAwayPattern  = awayStats.pattern;
        let displayHomePattern  = homeStats.pattern;
        let displayScoreStr     = `${match.totalScore.away}-${match.totalScore.home}`;

        if (config.isSwapped) {
            displayScoreStr     = `${match.totalScore.home}-${match.totalScore.away}`;
            const temp          = displayAwayPattern;
            displayAwayPattern  = displayHomePattern;
            displayHomePattern  = temp;
        }

        const fbText    = fastBreakWinner       ? ` (${getCleanTeamName(fastBreakWinner)} Fast Break)`  : "";
        const bbText    = isBuzzerBeater        ? ` Buzzer Beater`                                      : "";  
        let resText     = resultDisplayName;

        if      (result.team !== "none"     && scoringTeam) resText = `${getCleanTeamName(scoringTeam)} ${resultDisplayName}`;
        else if (result.name === "Rebound")                 resText = "Rebound"; 

        let mainMsg = `${displayAwayPattern} ${displayHomePattern}${fbText}${bbText} ${resText} ${displayScoreStr}`;
        
        const qEndScore = config.targetScore;
        const qEndSong  = config.quarterMaxSongs;
        const isQEnd    = match.quarterScore.away >= qEndScore || match.quarterScore.home >= qEndScore || match.songInQuarter >= qEndSong;
        const isGameEnd = isQEnd && (match.quarter >= config.totalQuarters);
        let suffixMsg   = "";

        if (isGameEnd) {
            suffixMsg = " | End of Game, returning to lobby";
            
            if (config.seriesLength > 1 && match.totalScore.away !== match.totalScore.home) {
                const gameWinner        = match.totalScore.away > match.totalScore.home ? 'away' : 'home';
                let tempAwayWins        = config.seriesStats.awayWins;
                let tempHomeWins        = config.seriesStats.homeWins;
                let actualWinnerSide    = config.isSwapped ? ((gameWinner === `away`) ? 'home' : `away`) : gameWinner
                
                if (actualWinnerSide === 'away')    tempAwayWins++;
                else                                tempHomeWins++;
                
                const aName = config.teamNames.away;
                const hName = config.teamNames.home;
                
                if      (tempAwayWins > tempHomeWins)   suffixMsg += ` | ${aName} leads the series ${tempAwayWins}-${tempHomeWins}`;
                else if (tempHomeWins > tempAwayWins)   suffixMsg += ` | ${hName} leads the series ${tempHomeWins}-${tempAwayWins}`;
                else                                    suffixMsg += ` | Series tied at ${tempAwayWins}-${tempHomeWins}`;
            }
        } else if (isQEnd) {
            const nextQ         = match.quarter + 1;
            const nextPossSide  = (nextQ % 2 !== 0) ? 'away' : 'home';
            const nextPossStr   = getArrowedTeamName(nextPossSide);
            suffixMsg = ` | End of Q${match.quarter} | Next Possession: ${nextPossStr}`;
        } else {
            let nextPossStr = getArrowedTeamName(match.possession);
            suffixMsg       = ` | Next Possession: ${nextPossStr}`;
        }

        if (!isGameEnd) {
            const hotPlayers    = Object.entries(match.streaks).filter(([_, streak]) => streak >= 3).map(([pid, _]) => {
                    const p     = Object.values(quiz.players).find(pl => pl.gamePlayerId == pid);
                    return p    ? p.name : null;
            }).filter(name => name);

            if (hotPlayers.length > 0) suffixMsg += ` | Hot Streak: ${hotPlayers.join(", ")}`;
        }

        chatMessage(mainMsg + suffixMsg);

        match.history.push({
            q       : match.quarter,
            song    : match.songInQuarter,
            poss    : prevPoss,
            result  : resultDisplayName,
            score   : displayScoreStr,
            awayArr : currentAwaySlots.map(s => checkSlot(s) ? 1 : 0),
            homeArr : currentHomeSlots.map(s => checkSlot(s) ? 1 : 0)
        });

        if (isQEnd) {
            if (isGameEnd) {
                if (match.totalScore.away !== match.totalScore.home) {
                    const winner = match.totalScore.away > match.totalScore.home ? 'away' : 'home';
                    endGame(winner);
                } else {
                    const winnerSide = resolveTie(currentAwaySlots, currentHomeSlots);
                    endGame(winnerSide);
                }
            } else {
                match.quarter++;
                match.songInQuarter = 0;
                match.quarterScore  = {away: 0, home: 0};
                match.possession    = (match.quarter % 2 !== 0) ? 'away' : 'home';
            }
        } else if (wasPendingPause) sendGameCommand("resume game");
    };

    const downloadScoresheet = () => {
        if (!match.history.length) {
            systemMessage("Error: No data to export");
            return;
        }

        const awayNameClean = config.isSwapped ? config.teamNames.home : config.teamNames.away;
        const homeNameClean = config.isSwapped ? config.teamNames.away : config.teamNames.home;
        
        const date  = new Date();
        const yy    = String(date.getFullYear   ())     .slice      (2);
        const mm    = String(date.getMonth      () + 1) .padStart   (2, '0');
        const dd    = String(date.getDate       ())     .padStart   (2, '0');
        
        const safeAway = awayNameClean.replace(/[^a-z0-9]/gi, '_');
        const safeHome = homeNameClean.replace(/[^a-z0-9]/gi, '_');
        const fileName = `${yy}${mm}${dd}-${config.gameNumber}-${safeAway}-${safeHome}.html`;

        const lastEntry = match.history[match.history.length - 1];
        const titleStr  = `Game ${config.gameNumber}: ${awayNameClean} ${lastEntry.score} ${homeNameClean}`;

        const awaySlots     = config.isSwapped ? gameConfig.homeSlots : gameConfig.awaySlots;
        const homeSlots     = config.isSwapped ? gameConfig.awaySlots : gameConfig.homeSlots;
        const subHeaders    = gameConfig.posNames; 

        let html = `
        <html>
        <head>
            <meta charset="utf-8">
            <title>${titleStr}</title>
            <style>
                body    {font-family: sans-serif; padding: 20px;}
                table   {border-collapse: collapse; text-align: center; margin: 0 auto;}
                th, td  {border: 1px solid black; padding: 8px;}
            </style>
        </head>
        <body>
            <table>
                <thead>
                    <tr><th colspan="15" style="font-size: 1.5em; font-weight: bold;">${titleStr}</th></tr>
                    <tr>
                        <th rowspan="2">Quarter</th>
                        <th rowspan="2">Song</th>
                        <th rowspan="2">Possession</th>
                        <th colspan="4">${awayNameClean}</th>
                        <th colspan="4">${homeNameClean}</th>
                        <th rowspan="2">Result</th>
                        <th colspan="2">Score</th>
                        <th rowspan="2">Winner</th>
                    </tr>
                    <tr>
                        ${subHeaders.map(h => `<th>${h}</th>`).join('')}
                        ${subHeaders.map(h => `<th>${h}</th>`).join('')}
                        <th>${awayNameClean}</th>
                        <th>${homeNameClean}</th>
                    </tr>
                </thead>
                <tbody>
        `;

        const qCounts = {};
        match.history.forEach(row => {qCounts[row.q] = (qCounts[row.q] || 0) + 1});
        const printedQ = {};

        match.history.forEach(row => {
            const possName                  = row.poss === 'away' ? config.teamNames.away : config.teamNames.home;
            const awayCells                 = generateCells(row.awayArr, awaySlots);
            const homeCells                 = generateCells(row.homeArr, homeSlots);
            const [scoreAway, scoreHome]    = row.score.split('-').map(Number);

            html += `<tr>`;
            if (!printedQ[row.q]) {
                html            +=  `<td rowspan="${qCounts[row.q]}">${row.q}</td>`;
                printedQ[row.q] =   true;
            }
            html += `
                    <td>${row.song}</td>
                    <td>${possName}</td>
                    ${awayCells}
                    ${homeCells}
                    <td>${row.result}</td>
                    <td>${scoreAway}</td>
                    <td>${scoreHome}</td>
                </tr>`;
        });
        html += `</tbody></table></body></html>`;

        const blob  = new Blob([html], {type: "text/html"});
        const a     = document.createElement('a');
        a.href      = URL.createObjectURL(blob);
        a.download  = fileName;
        a.click();
    };

    const printHelp = (topic = null) => {
        if (topic) {
            const actualKey = Object.keys(COMMAND_DESCRIPTIONS).find(key => key.toLowerCase() === topic);
            if (actualKey)  chatMessage(`/nba ${actualKey}: ${COMMAND_DESCRIPTIONS[actualKey]}`);
            else            chatMessage("Unknown command, type /nba help for a list");
        } else {
            const cmds = Object.keys(COMMAND_DESCRIPTIONS).join(", ");
            chatMessage("Commands: " + cmds);
        }
    };

    const printHowTo = () => {
        systemMessage("1. /nba setHost [1-8]: Set the slot of the lobby host, defaults to 0 and cannot start unless changed");
        systemMessage("2. /nba setTeams [Away] [Home]: Set the team names, defaults to Away and Home");
        systemMessage("3. /nba setSeries [1/2/7]: Set the series length, defaults to 7");
        systemMessage("4. /nba setGame [1-7]: Set the game number, defaults to 1");
        systemMessage("5. /nba start: Start the game");
    };

    const setup = () => {
        new Listener("Host Game",       (p) => {playersCache = p.players})                                                      .bindListener();
        new Listener("Join Game",       (p) => {playersCache = p.quizState.players})                                            .bindListener();
        new Listener("Game Starting",   (p) => {playersCache = p.players})                                                      .bindListener();
        new Listener("Player Left",     (p) => {playersCache = playersCache.filter(x => x.gamePlayerId !== p.gamePlayerId)})    .bindListener();
        new Listener("New Player",      (p) => {playersCache.push(p)})                                                          .bindListener();
        
        new Listener("game chat update", (payload) => {
            payload.messages.forEach(msg => {
                if (msg.message.startsWith("/nba")) {
                    const parts             = msg.message.split(" ");
                    const cmd               = parts[1] ? parts[1].toLowerCase() : "help";
                    const arg               = parts.slice(2).join(" ").toLowerCase();
                    const isHost            = (msg.sender === selfName);
                    const publicCommands    = ["flowchart", "guide", "help", "whatis"];

                    if (publicCommands.includes(cmd)) {
                        setTimeout(() => {
                            if (cmd === "whatis") {
                                if (!arg || arg === "help") chatMessage("Available terms: " + Object.keys(TERMS).sort().join(", "));
                                else {
                                    if (TERMS[arg])         chatMessage(`${arg}: ${TERMS[arg]}`);
                                    else                    chatMessage(`Unknown term '${arg}'.`);
                                }
                            }
                            else if (cmd === "help")        printHelp(arg || null);
                            else if (cmd === "flowchart")   chatMessage(`Flowchart: ${config.links.flowchart}`);
                            else if (cmd === "guide")       chatMessage(`Guide: ${config.links.guide}`);
                        }, config.delay);

                        return;
                    }

                    if (isHost) {
                        setTimeout(() => {
                            if      (cmd === "start")       startGame();
                            else if (cmd === "export")      downloadScoresheet();
                            else if (cmd === "end")         {match.isActive = false; systemMessage("Stopped")}
                            else if (cmd === "setteams") {
                                if (parts.length === 4) {
                                    config.teamNames.away = toTitleCase(parts[2]);
                                    config.teamNames.home = toTitleCase(parts[3]);
                                    updateLobbyName(config.teamNames.away, config.teamNames.home);
                                } else systemMessage("Error: Use /nba setTeams [Away] [Home]");
                            }
                            else if (cmd === "setgame") {
                                const num = parseInt(parts[2]);
                                if (num >= 1 && num <= 7) {config.gameNumber = num; systemMessage(`Game Number: ${num}`)}
                                else                                                systemMessage("Error: Use /nba setGame [1-7]");
                            }
                            else if (cmd === "sethost") {
                                const num = parseInt(parts[2]);
                                if (num >= 1 && num <= 8) { 
                                    config.hostId   = num; 
                                    const hName     = getPlayerNameAtTeamId(num) || `Player ${num}`;
                                    systemMessage(`Host: ${hName}`); 
                                } else systemMessage("Error: Use /nba setHost [1-8]");
                            }
                            else if (cmd === "setseries") {
                                const num = parseInt(parts[2]);
                                if ([1, 2, 7].includes(num)) {config.seriesLength = num;    systemMessage(`Series Length: ${num}`)}
                                else                                                        systemMessage("Error: Use /nba setSeries [1/2/7]");
                            }
                            else if (cmd === "settest") {
                                const b = parseBool(parts[2]);
                                if (b !== null) {config.isTest = b; systemMessage(`Test Mode: ${b}`)}
                                else systemMessage("Error: Use /nba setTest [True/False]");
                            }
                            else if (cmd === "swap") {
                                config.isSwapped = !config.isSwapped;
                                systemMessage(`Swapped teams`);
                            }
                            else if (cmd === "resetgame") {
                                resetMatchData();
                                systemMessage("Game has been reset");
                            }
                            else if (cmd === "reseteverything") resetEverything();
                            else if (cmd === "resetseries") {
                                resetMatchData();
                                config.gameNumber   = 1;
                                config.seriesStats  = {awayWins: 0, homeWins: 0, history: []};
                                systemMessage("Series has been reset");
                            }
                            else if (cmd === "howto") printHowTo();
                        }, config.delay);
                    }
                }
            });
        }).bindListener();

        new Listener("answer results", (payload) => {
            if (match.isActive) setTimeout(() => processRound(payload), config.delay);
        }).bindListener();

        new Listener("player answers", (payload) => {
            if (!match.isActive) return;

            payload.answers.forEach(ans => {
                if (!match.answerQueue.includes(ans.gamePlayerId)) {
                    match.answerQueue.push(ans.gamePlayerId);
                }
            });
        }).bindListener();

        new Listener("play next song", () => {
            if (match.isActive) {
                match.answerQueue = [];
                if (match.pendingPause) sendGameCommand("pause game");
            }
        }).bindListener();
    };

    function init() {
        if (typeof quiz !== 'undefined' && typeof Listener !== 'undefined') setup();
        else                                                                setTimeout(init, config.delay);
    }

    init();
})();