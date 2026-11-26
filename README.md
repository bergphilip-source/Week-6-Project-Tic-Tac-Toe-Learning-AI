# Week-6-Project-Tic-Tac-Toe-Learning-AI
Philip Berg

Open `index.html` in a browser to play Tic-Tac-Toe against the AI.

Run `python "Week 6 assignment"` to train the Python Q-learning agent for
50,000 games as X against a random O opponent. Training results and the
learned Q-table are saved to the console and `q_table.json`. The script then
evaluates the greedy policy (exploration off) against random O for 1,000 games
and reports win, draw, and loss rates. Then you can play as O against the
trained agent as X in the console.

Why does play() build a new string instead of changing the old one? (Think about what your Q-table uses as its keys.)
Play adds new strings to learn in addition to what it alreay knows.
winner() can return four different things. What does each one mean to the agent?
Everything comes back as winner except if its a draw.
How many squares does moves() return on an empty board, and how many after four turns?
1 square. and 4 after four turns.

Trained the Q-learning agent for 50,000 games, with Agent as X against a random O opponent.
Agent X wins: 45,307 (90.6%)
Opponent O wins: 2,572 (5.1%)
Draws: 2,121 (4.2%)

4.1:
draw 2
loss 3
win 0