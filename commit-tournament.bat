@echo off
echo ============================================================
echo  MCU - Committing Multiplayer Tournament System to Git
echo ============================================================

git add .
git commit -m "feat: implement real-player multiplayer tournament system

- TeamBuilder.tsx: Complete rewrite of BATTLE_TEAM tab
  - Removed all bot/AI logic entirely
  - Real-player queue matchmaking (tournament_queue socket)
  - Private room creation with shareable room codes
  - Join by room code flow
  - Ready-state toggling per player
  - Host-controlled tournament start and bracket simulation
  - Round advancement and champion crowning
  - In-lobby friend invite modal with online status
  - Squad Roster Builder tab preserved with synergy detection

- server.ts: Full tournament backend
  - tournamentRooms and tournamentQueue in-memory state
  - tournament_create_room, tournament_join_room, tournament_queue handlers
  - tournament_toggle_ready, tournament_start, tournament_simulate_match
  - tournament_advance_round, tournament_leave_room, tournament_cancel_queue
  - Bracket generation, bye-round handling, champion crowning logic
  - tournament_invite_friend emits team_battle_invite_received to target

- Navbar.tsx: Global tournament invite notification
  - Listens for team_battle_invite_received socket event
  - Floating amber banner with inviter name, format, room code
  - One-click navigation to Ascension/Tournament page
  - Auto-dismisses after 15 seconds"

echo.
echo Done! Press any key to exit.
pause
