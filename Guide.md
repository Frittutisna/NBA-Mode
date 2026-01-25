# NBA Mode v0-beta.1.3

## Table of Contents
- [TLDR: What Do I Do?](#tldr-what-is-this-and-what-do-i-do)
- [Links: Balancer, Flowchart, Script](#links-balancer-flowchart-script)
- [Overview: Those Long Setting Codes](#overview-those-long-setting-codes)
- [Comparison: What's The Difference?](#comparison-whats-the-difference)
- [Changelog: What Changed From v0-beta.0?](#changelog-what-changed-from-v0-beta0)
- [Lineup: Away And Home, Captains](#lineup-away-and-home-captains)
- [Score: Check The TDIFF](#score-check-the-tdiff)
- [Ending: Elam, Tiebreaker](#ending-elam-tiebreaker)
- [Format: Best-Of-7, Round Robin, Knockouts](#format-best-of-7-round-robin-knockouts)
- [Manual: What Do I *Really* Do?](#manual-what-do-i-really-do)

## TLDR: What Is This And What Do I Do?
In very simple terms: *just answer as correctly and as quickly as you can*
- If you're **just playing**: Join the right lobby, line up correctly, and click Ready. If you're confused about anything, you can (in order of priority):
    - Just play along. People often say this is a game mode best understood through playing, not reading
    - Try `/nba help` or `/nba whatIs` in the chat, or
    - Read further
- If you're **just watching**: Grab a bowl of popcorn before spectating the lobby of your choice.
- **Unless you have to, feel more than welcome to stop reading this guide here.** I promise you, unless you **really** have to, you **shouldn't** read the rest of this guide.
- If you're **hosting the tour** or **hosting a lobby** for your team, see [Manual: What Do I *Really* Do?](#manual-what-do-i-really-do).

## Links: Balancer, Flowchart, Script
- [Link to the Balancer](https://github.com/Frittutisna/Balancer)
- [Link to the Flowchart](https://github.com/Frittutisna/NBA-Mode/blob/main/Flowchart/Flowchart.pdf)
- [Link to the Script](https://github.com/Frittutisna/NBA-Mode/blob/main/Script.js)

## Overview: Those Long Setting Codes
<table style="text-align:center">
    <tr>
        <th style="text-align:center"><strong>Phase</strong></th>
        <th style="text-align:center"><strong>Estimated Runtime</strong></th>
        <th style="text-align:center"><strong>Song Count</strong></th>
        <th style="text-align:center"><strong>Guess Time</strong></th>
        <th style="text-align:center"><strong>Difficulty</strong></th>
        <th style="text-align:center"><strong>Song Mix</strong></th>
        <th style="text-align:center"><strong>Code</strong></th>
    </tr>
    <tr>
        <td style="text-align:center">Regulation</td>
        <td style="text-align:center">1.5 hours</td>
        <td style="text-align:center">12-40</td>
        <td style="text-align:center">10</td>
        <td style="text-align:center">0-40</td>
        <td style="text-align:center">Watched with Random Rig Distribution</td>
        <td style="text-align:center">
            <details>
                <summary>Click to view code</summary>
                <code style="word-break: break-all">e0g14211111001314000011110000001411111111111100a051o000000f11100k012r02i0a46533a11002s011111111100140111002s01a111111111102a11111111111hg1ka03-11111--</code>
            </details>
        </td>
    </tr>
</table>

## Comparison: What's The Difference?
<table>
    <thead>
        <tr>
            <th style="text-align:center" rowspan="2">Differences</th>
            <th style="text-align:center" rowspan="2">MLB</th>
            <th style="text-align:center" rowspan="2">NBA</th>
            <th style="text-align:center" colspan="2">NFL</th>
        </tr>
        <tr>
            <th style="text-align:center">Regulation</th>
            <th style="text-align:center">Overtime</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="text-align:center">Estimated Runtime</td>
            <td style="text-align:center">2 hours</td>
            <td style="text-align:center">1.5 hours</td>
            <td style="text-align:center" colspan="2">1 hour</td>
        </tr>
        <tr>
            <td style="text-align:center">Song Count</td>
            <td style="text-align:center">16-30</td>
            <td style="text-align:center">12-40</td>
            <td style="text-align:center">11-20</td>
            <td style="text-align:center">0-5</td>
        </tr>
        <tr>
            <td style="text-align:center">Guess Time</td>
            <td style="text-align:center">20</td>
            <td style="text-align:center">10</td>
            <td style="text-align:center" colspan="2">15</td>
        </tr>
        <tr>
            <td style="text-align:center">Song Difficulty</td>
            <td style="text-align:center">0-100</td>
            <td style="text-align:center" colspan="3">0-40</td>
        </tr>
        <tr>
            <td style="text-align:center">Song Mix</td>
            <td style="text-align:center">Random</td>
            <td style="text-align:center" colspan="3" >Watched with Random Rig Distribution</td>
        </tr>
        <tr>
            <td style="text-align:center">DIFF</td>
            <td style="text-align:center" rowspan="4">Yes</td>
            <td style="text-align:center" rowspan="4">No</td>
            <td style="text-align:center" colspan="2">Yes</td>
        </tr>
        <tr>
            <td style="text-align:center">ODIFF</td>
            <td style="text-align:center" colspan="2" rowspan="7">No</td>
        </tr>
        <tr><td style="text-align:center">Base Running</td></tr>
        <tr><td style="text-align:center">Base Stealing</td></tr>
        <tr>
            <td style="text-align:center">Hot Streak</td>
            <td style="text-align:center" rowspan="6">No</td>
            <td style="text-align:center" rowspan="4">Yes</td>
        </tr>
        <tr><td style="text-align:center">Fast Break</td></tr>
        <tr><td style="text-align:center">Elam Ending</td></tr>
        <tr><td style="text-align:center">Buzzer Beater</td></tr>
        <tr>
            <td style="text-align:center">OP/DP Split</td>
            <td style="text-align:center" rowspan="5">No</td>
            <td style="text-align:center" colspan="2" rowspan="2">Yes</td>
        </tr>
        <tr><td style="text-align:center">Rouge</td></tr>
        <tr>
            <td style="text-align:center">Mercy Rule</td>
            <td style="text-align:center">Yes</td>
            <td style="text-align:center">Yes</td>
            <td style="text-align:center">No</td>
        </tr>
        <tr>
            <td style="text-align:center">Sudden Death</td>
            <td style="text-align:center" rowspan="2">No</td>
            <td style="text-align:center" rowspan="2">No</td>
            <td style="text-align:center" rowspan="2">Yes</td>
        </tr>
        <tr><td style="text-align:center">Tie</td></tr>
    </tbody>
</table>

## Changelog: What Changed From v0-beta.0?
### Format Change
- Subsumed `Rebound` under `Turnover`
### Script Changes
- Fixed queue management for Fast Break logic
- Fixed display swap for HTML output
- Fixed duplicate messages from multiple script holders
- Reflected Fast Break bonus in generated pattern and HTML output

## Lineup: Away And Home, Captains
The team listed first (above) on Challonge is the **Away** team for each series. Line up as follows before each series: **Away** (Slots 1-4: T1, T2, T3, T4), then **Home** (Slots 5-8: T1, T2, T3, T4). The T1 of each team is also designated as their **Captain**, which carries a **+1 bonus** for their correct guesses. There is **no need to swap** Slots between consecutive games; the Script does that **automatically**. 
 
## Score: Check The TDIFF
<details>
    <summary><b>Click to know more about Scoring</b></summary>
    <p>The <b>Away</b> team attacks (has <b>possession</b>) first to start <b>odd</b>-numbered quarters and vice-versa. Possession <b>swaps</b> after every song <b>except</b> after a <code>Slam Dunk</code> or between Quarters. Players who got <b>≥3</b> songs right in a row is on a <b>Hot Streak</b>, and their correct guesses has a <b>+1 bonus</b> for TDIFF calculations. If <b>both</b> teams have <b>≥1</b> player(s) that got the same song right, the <b>fastest</b> player to do so gets a <b>+1 bonus</b> for their team's TDIFF calculations. To calculate points, subtract the Defending team’s score from the Attacking team’s score. Point-scoring plays are worth <b>+1 point</b> (not TDIFF bonus) in Song <b>10</b> of each Quarter. 
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
        <td style="text-align:center" rowspan="2">3</td>
        <td style="text-align:center" rowspan="4">N/A</td>
        <td style="text-align:center">Keep</td>
    </tr>
    <tr>
        <td style="text-align:center"><code>3-Pointer</code></td>
        <td style="text-align:center">4 or 3</td>
        <td style="text-align:center" rowspan="6">Swap</td>
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
        <td style="text-align:center"><code>Turnover</code></td>
        <td style="text-align:center">-1 or -2</td>
        <td style="text-align:center" rowspan="3">N/A</td>
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

## Ending: Elam, Tiebreaker
Each Quarter ends after a team reached **≥8** points or after **10** songs, whichever happens first. If Regulation doesn't break the tie, consult the following tiebreakers:
1. Weighted Total (counting Captains twice)
2. Captains (Slots 1 vs 5)
3. T2s (Slots 2 vs 6)
4. T3s (Slots 3 vs 7)
5. Defending Team for the Last Song

## Format: Best-Of-7, Round Robin, Knockouts
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
- Announce team compositions, as well as Challonge and lobby links.
- Note the results of each game in Challonge.
- If necessary, ping teams that advance to the **Conference Finals** and/or **NBA Finals**.
- Announce the final results.

### If you're hosting a lobby for your team:
Install the [Script](#links-balancer-flowchart-script) (**only** the lobby host needs to install and operate the **Script**) on your browser through TamperMonkey, then do the following:
- Apply the **Regulation** setting code (see [Overview](#overview-those-long-setting-codes)).
- Invite the right players to the lobby, make sure they're lined up correctly (see [Lineup](#lineup-away-and-home-captains)), then type `/nba howTo` and follow the instructions there.
- After everyone is ready, type `/nba start` and start playing. If you started the game by mistake, type `/nba resetGame`, return to lobby, then type `/nba start` to restart.
- The Script will automatically download the **Scoresheet** after each Game. Open it on your browser, copy the top row, then paste it in `#game-reporting` with the Scoresheet and JSON.
- Repeat from Step 1 for a new lobby, from Step 2 for the same lobby and a new opponent, or from Step 3 for the same lobby and opponent.