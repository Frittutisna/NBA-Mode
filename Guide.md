# NBA Mode v0.alpha.0

## Table of Contents
- [TLDR: What Do I Do?](#tldr-what-do-i-do)
- [Links: Balancer, Flowchart, Script](#links-balancer-flowchart-script)
- [Overview: Those Long Setting Codes](#overview-those-long-setting-codes)
- [Comparison: What's The Difference?](#comparison-whats-the-difference)
- [Lineup: Away and Home, Captains](#lineup-away-and-home-captains)
- [Score: Check the TDIFF](#score-check-the-tdiff)
- [Ending: Elam, Overtime](#ending-elam-overtime)
- [Format: Best-of-7, Round Robin, Knockouts](#format-best-of-7-round-robin-knockouts)
- [Manual: What Do I *Really* Do?](#manual-what-do-i-really-do)

## TLDR: What Do I Do?
- If you're **just playing**: Join the right lobby, line up correctly, and click Ready. If you're confused about anything, you can (in order of priority):
    - Just play along. People often say this is a game mode best understood through playing, not reading
    - Try `/nba help` or `/nba whatIs` in the chat, or
    - Read further
- If you're **just watching**: Grab a bowl of popcorn before spectating the lobby of your choice.
- **Unless you have to, feel more than welcome to stop reading this guide here.** I promise you, unless you **really** have to, you **shouldn't** read the rest of this guide.
- If you're **hosting the tour** or **hosting a lobby** for your team, see [Manual: What Do I *Really* Do?](#manual-what-do-i-really-do).

## Links: Balancer, Flowchart, Script
- [Link to the Balancer](https://github.com/Frittutisna/NFL-Mode/blob/main/Balancer/Balancer.py)
- [Link to the Flowchart](https://github.com/Frittutisna/NBA-Mode/blob/main/Flowchart/Flowchart.pdf)
- [Link to the Script](https://github.com/Frittutisna/NBA-Mode/blob/main/Script.js)

## Overview: Those Long Setting Codes
<table style="text-align:center">
    <tr>
        <th style="text-align:center"><strong>Phase</strong></th>
        <th style="text-align:center"><strong>Song Count</strong></th>
        <th style="text-align:center"><strong>Guess Time</strong></th>
        <th style="text-align:center"><strong>Difficulty</strong></th>
        <th style="text-align:center"><strong>Song Mix</strong></th>
        <th style="text-align:center"><strong>Code</strong></th>
    </tr>
    <tr>
        <td style="text-align:center">Regulation</td>
        <td style="text-align:center">24</td>
        <td rowspan="2" style="text-align:center"><strong>10</strong></td>
        <td style="text-align:center">0 - 40</td>
        <td style="text-align:center">Watched Equal</td>
        <td style="text-align:center">
            <details>
                <summary>Click to view code</summary>
                <code style="word-break: break-all">e0g0o21111100130o000031110000000o11111111111100a051o000000f11100k012r02i0a46533a11002s011111111100140111002s01a111111111102a11111111111hg1ka03-11111--</code>
            </details>
        </td>
    </tr>
    <tr>
        <td style="text-align:center">Overtime</td>
        <td style="text-align:center">6</td>
        <td style="text-align:center">0 - 100</td>
        <td style="text-align:center">Random</td>
        <td style="text-align:center">
            <details>
                <summary>Click to view code</summary>
                <code style="word-break: break-all;">e0g06211111001100000631110000000611111111111100a051o000000f11100k012r02i0a46533a11002s0111111111002s0111002s01a111111111102a11111111111hg1ka03-11111--</code>
            </details>
        </td>
    </tr>
</table>

## Comparison: What's The Difference?
<table>
    <thead>
        <tr>
            <th style="text-align:center">Phase</th>
            <th style="text-align:center">Differences</th>
            <th style="text-align:center">NFL</th>
            <th style="text-align:center">NBA</th>
            <th style="text-align:center">MLB</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="9" style="text-align:center"><b>BOTH</b></td>
            <td style="text-align:center">Guess Time</td>
            <td style="text-align:center">15</td>
            <td style="text-align:center">10</td>
            <td style="text-align:center">20</td>
        </tr>
        <tr>
            <td style="text-align:center">OP/DP Split</td>
            <td rowspan="3" style="text-align:center">Yes</td>
            <td rowspan="3" style="text-align:center">No</td>
            <td style="text-align:center">No</td>
        </tr>
        <tr>
            <td style="text-align:center">DIFF</td>
            <td style="text-align:center">Yes</td>
        </tr>
        <tr>
            <td style="text-align:center">Rouge</td>
            <td rowspan="5" style="text-align:center">No</td>
        </tr>
        <tr>
            <td style="text-align:center">Hot Streak</td>
            <td rowspan="5" style="text-align:center">No</td>
            <td rowspan="4" style="text-align:center">Yes</td>
        </tr>
        <tr><td style="text-align:center">Fast Break</td></tr>
        <tr><td style="text-align:center">Buzzer Beater</td></tr>
        <tr><td style="text-align:center">Elam Ending</td></tr>
        <tr>
            <td style="text-align:center">Base Running</td>
            <td style="text-align:center">No</td>
            <td style="text-align:center">Yes</td>
        </tr>
        <tr>
            <td rowspan="4" style="text-align:center"><b>REG</b></td>
            <td style="text-align:center">Song Count</td>
            <td style="text-align:center">16</td>
            <td style="text-align:center">24</td>
            <td style="text-align:center">32</td>
        </tr>
        <tr>
            <td style="text-align:center">Song Mix</td>
            <td colspan="2" style="text-align:center">Watched Equal</td>
            <td style="text-align:center">Random</td>
        </tr>
        <tr>
            <td style="text-align:center">Song Difficulty</td>
            <td colspan="2" style="text-align:center">0-40</td>
            <td style="text-align:center">0-100</td>
        </tr>
        <tr>
            <td style="text-align:center">Mercy Rule</td>
            <td style="text-align:center">Yes</td>
            <td colspan="2" style="text-align:center">No</td>
        </tr>
        <tr>
            <td rowspan="5" style="text-align:center"><b>OT</b></td>
            <td style="text-align:center">Song Count</td>
            <td style="text-align:center">4</td>
            <td style="text-align:center">6</td>
            <td style="text-align:center">8</td>
        </tr>
        <tr>
            <td style="text-align:center">Sudden Death</td>
            <td rowspan="2" style="text-align:center">Yes</td>
            <td rowspan="4" style="text-align:center">No</td>
            <td rowspan="2" style="text-align:center">No</td>
        </tr>
        <tr><td style="text-align:center">Tie</td></tr>
        <tr>
            <td style="text-align:center">Ghost Runner on 2nd</td>
            <td rowspan="2" style="text-align:center">No</td>
            <td rowspan="2" style="text-align:center">Yes</td>
        </tr>
        <tr><td style="text-align:center">1 Out</td></tr>
    </tbody>
</table>

## Lineup: Away and Home, Captains
Teams line up in **Watched Elo** order (Away team on Slots 1-4, then Home team on Slots 5-8). **Captains**' (Slots 1 and 5) correct guesses has a **+1 multiplier** for TDIFF calculations.
 
## Score: Check the TDIFF
<details>
    <summary><b>Click to know more about Scoring</b></summary>
    <p>The <b>Away</b> team attacks (has <b>possession</b>) first 
    to start <b>odd</b>-numbered quarters and vice-versa. 
    Possession <b>swaps</b> after every song <b>except</b> after a 
    <code>Slam Dunk</code> or between Quarters. 
    Players who got <b>≥3</b> songs right in a row is on a
    <b>Hot Streak</b>, and their correct guesses has a 
    <b>+1 multiplier</b> for TDIFF calculations. 
    <b>After</b> multipliers have been applied, if <b>both</b> teams have 
    <b>≥1</b> player(s) that got the same song right, 
    the <b>fastest</b> player to do so gets 
    <b>+1</b> for their team's TDIFF calculations. 
    To calculate points, subtract the Defending team’s score 
    from the Attacking team’s score. 
    Points are doubled for the <b>last</b> song of each Quarter. 
</details>

<table style="text-align:center">
    <tr>
        <th style="text-align:center"><strong>Result</strong></th>
        <th style="text-align:center"><strong>TDIFF</strong></th>
        <th style="text-align:center"><strong>Attacking</strong></th>
        <th style="text-align:center"><strong>Defending</strong></th>
        <th style="text-align:center"><strong>Possession</strong></th>
    </tr>
    <tr>
        <td style="text-align:center"><code>Slam Dunk</code></td>
        <td style="text-align:center">≥5</td>
        <td style="text-align:center">7</td>
        <td rowspan="4" style="text-align:center">N/A</td>
        <td style="text-align:center">Keep</td>
    </tr>
    <tr>
        <td style="text-align:center"><code>3-Pointer</code></td>
        <td style="text-align:center">4 or 3</td>
        <td style="text-align:center">3</td>
        <td rowspan="7" style="text-align:center">Swap</td>
    </tr>
    <tr>
        <td style="text-align:center"><code>2-Pointer</code></td>
        <td style="text-align:center">2 or 1</td>
        <td style="text-align:center">2</td>
    </tr>
    <tr>
        <td style="text-align:center"><code>Free Throw</code></td>
        <td style="text-align:center">0</td>
        <td style="text-align:center">1</td>
    </tr>
    <tr>
        <td style="text-align:center"><code>Rebound</code></td>
        <td style="text-align:center">-1</td>
        <td rowspan="4" style="text-align:center">N/A</td>
    </tr>
    <tr>
        <td style="text-align:center"><code>Turnover</code></td>
        <td style="text-align:center">-2</td>
        <td style="text-align:center">1</td>
    </tr>
    <tr>
        <td style="text-align:center"><code>Block</code></td>
        <td style="text-align:center">-3 or -4</td>
        <td style="text-align:center">2</td>
    </tr>
    <tr>
        <td style="text-align:center"><code>Steal</code></td>
        <td style="text-align:center">≤-5</td>
        <td style="text-align:center">3</td>
    </tr>
</table>

## Ending: Elam, Overtime
Each Quarter ends after a team reached **≥7** points 
or after **6** songs, whichever happens first.
If Regulation doesn't break the tie, 
continue to 8-song **Overtime** (OT1).
**Repeat** Overtime until a winner is found, 
**alternating** first possession between Overtime Quarters.

## Format: Best-of-7, Round Robin, Knockouts
The script will automatically swap Away and Home teams between consecutive games.
- **For 2 teams**: Play a best-of-7.
- **For 4 teams**: Play a double round-robin. The top two teams advance to the **NBA Finals**.
- **For 6 teams**: Play a single round-robin. The top four teams advance to the **Conference Finals**, then the winners advance to the **NBA Finals**.
- **For 8 teams**: Play a double round-robin in 2 conferences. The conference winners advance to the **NBA Finals**.

## Manual: What Do I *Really* Do?
### If you're hosting the tour:
- Open the tour signup prompt and ask for team requests and/or blacklists.
- After the player list has been settled, find the [Balancer](#links-balancer-flowchart-script) and follow the instructions there.
- If the tour has ≥4 teams, ask for 1 lobby host volunteer from each team.
- Read the [Format](#format-best-of-7-round-robin-knockouts) section and prepare the Challonge.
- Announce team compositions and the Challonge link.
- Note the results of each game in Challonge.
- If necessary, ping teams that advance to the **Conference Finals** and/or **NBA Finals**.
- Announce the final results.

### If you're hosting a lobby for your team:
Install the [Script](#links-balancer-flowchart-script) (**only** the lobby host needs to install and operate the **Script**) on your browser through TamperMonkey, then do the following:
- Apply the **Regulation** setting code (see [Overview](#overview-those-long-setting-codes)).
- Invite the right players to the lobby, and make sure they're lined up correctly (see [Lineup](#lineup-away-and-home-captains)).
- After everyone is ready, type `/nba howTo` and follow the instructions there.
- Type `/nba start` and start playing.
    - If you started the game by mistake, type `/nba resetGame`, return to lobby, then type `/nba start` to restart.
    - If someone disconnected mid-game, the script will automatically pause the game for you. Wait for them to return and resume the game themselves.
    - When the Winner has been decided either normally or through Elam Ending on the 4th Quarter, the game will automatically start the vote to return to lobby.
- If it's tied after Regulation:
    - Apply the **Overtime** setting code (see [Overview](#overview-those-long-setting-codes)).
    - Start playing after everyone is ready (**No need to type `/nba start` to start Overtime unless you reset**).
    - If you started Overtime by mistake, type `/nba resetOvertime`, return to lobby, then type `/nba start` to restart Overtime.
    - When the Winner has been decided either normally, through Elam Ending, or if it's still tied after Overtime, the game will automatically start the vote to return to lobby.
    - If it's still tied after Overtime, repeat until a winner is found.
- Type `/nba export` to download the **Scoresheet**.
- Open the Scoresheet and copy the top row.
- Paste it in `#game-reporting` with the Scoresheet and JSON(s) (Regulation and Overtime(s) if necessary).
- Repeat from Step 1 for the next game.