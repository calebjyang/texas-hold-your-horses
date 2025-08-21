Texas Hold Your Horses — Game Design (MVP)

1) High-level

Real-time, browser multiplayer betting game. Five 2-card hands are dealt face-up except one hidden Dark Horse. Players bet chips on any hands, click READY, and the round advances when all are ready or the timer hits 0. Payouts go to bettors of winning hand(s).

Rounds

Out of the Gate (pre-flop)

In the Running (post-flop)

Final Furlong (post-turn)

Photo Finish (reveal & payout)

2) Core entities

Player: {id, name, chips, isReady, bets: Record<handId, amount>}

Hand: {id, label, cards: [c1,c2], pot, isDarkHorse?}

Room: {code, players[], round, timer, hands[], board, history[]}

Board: {flop:[c,c,c], turn:c?, river:c?}

3) Table limits

Players: 2–6

Min bet: configurable (default 10)

Max total bet per round per player: optional cap (e.g., 25% of stack)

4) Round flow
A. Out of the Gate

Server deals 5 hands (10 cards; Dark Horse face-down).

Timer starts (e.g. 45s).

Players place bets and click READY.

Advance when all ready or timer=0.

B. In the Running

Server deals flop (3).

Betting + READY loop.

C. Final Furlong

Server deals turn (1).

Betting + READY loop.

D. Photo Finish

Server deals river (1), reveals Dark Horse, determines winners, pays out, resets to Out of the Gate.

5) Payouts

Each community hand is ranked (with its two cards + board).

Highest ranked wins. Ties split proportionally.

Each hand’s pot = all bets on it.

Payouts go only to bettors of the winning hand. House keeps unclaimed pots.

6) Readiness & timers

Bets locked when player clicks READY.

If timer expires: players not ready bet 0.

UI: green checkmark on avatars, countdown in header.

If all ready early → round advances immediately.

7) State machine
stateDiagram-v2
    [*] --> LOBBY
    LOBBY --> OUT_OF_GATE: startGame
    OUT_OF_GATE --> IN_THE_RUNNING: allReady || timer0
    IN_THE_RUNNING --> FINAL_FURLONG: allReady || timer0
    FINAL_FURLONG --> PHOTO_FINISH: allReady || timer0
    PHOTO_FINISH --> OUT_OF_GATE: settlePayouts & reset

8) Networking

Client → Server

room/join {code, name}

room/leave {}

bet/place {handId, amount}

player/ready {ready:true}

chat/send {text | reaction}

Server → Client

room/state {room}

round/advance {round, timer, boardDelta}

bet/updated {playerId, handId, pot}

player/ready {playerId, isReady}

cards/dealt {hands?, boardDelta}

payouts/settled {results[], chipDeltas}

toast {type, message}

Rules: server is authoritative for cards, rounds, and chip balances.

9) Data shapes
type Rank = '2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'10'|'J'|'Q'|'K'|'A'|'?'
type Suit = '♣'|'♦'|'♥'|'♠'
type Card = { rank: Rank, suit: Suit }

type Player = {
  id: string; name: string; chips: number;
  isReady: boolean; bets: Record<string, number>;
}

type Hand = {
  id: string; label: string; cards: [Card, Card];
  pot: number; isDarkHorse?: boolean;
}

type Board = { flop: Card[]; turn?: Card; river?: Card }

type Room = {
  code: string;
  players: Player[];
  round: 'Out of the Gate'|'In the Running'|'Final Furlong'|'Photo Finish';
  timer: number; hands: Hand[]; board: Board;
  history: Array<{ winners: string[]; payouts: Record<string, number> }>;
}

10) Frontend contract

GameHeader: round, timer, avatars, readiness.

CommunityCardRail: 5 hands, Dark Horse hidden.

CommunityBoard: flop/turn/river animations.

BettingDashboard: bet + READY.

EventToast: toasts from server.

ChatDrawer: messages/reactions.

11) Server responsibilities

Room creation/join.

Round timer + progression.

Deal/reveal cards.

Collect bets, lock on READY.

Compute payouts.

Sync all state.

Validate chip counts.

12) Edge cases

Disconnect → auto not ready, bets frozen or 0.

Simultaneous bets → last write wins before READY.

All fail to bet → round advances, no payout.

Tie winners → split pot proportionally.

13) Config flags

ROUND_SECONDS=45

MIN_BET=10

MAX_PLAYERS=6

ANTE=0

HOUSE_EDGE=0

14) MVP acceptance criteria

Players can create/join room.

Five hands + Dark Horse visible.

Board cards animate correctly.

Bets + pots update live.

READY logic works.

Payouts accurate.

Chat + toasts functional.

Deployable web app, reconnect restores state.

15) Future features

Skins, sounds, rake/fees, leaderboards, spectator mode, mobile layout polish, moderation, analytics, tutorial.