# Cadre de Guerre

## Synopsis

"Cadre de Guerre" is a cute parody of [Redacted], it stars some bears like creatures with insect masks fighting some obscure-like (deep-sea inspired) creatures.
The goal is to fight off waves of enemies. It is a reversed dungeon : each wave will completely change the room.
You will have a say on which room you raid (at a later date)

## Controls

- Click somewhere to dash. Dash is an attack
- Click on character to use defensive skill (will vary later)
- Right click to use long range attack (will vary later)

## Genre

It's a roguelite. As such, you get currency while fighting.
Once you die you can use that currency to improve your Cadre de Guerre.
Dying mean you'll be randomly attributed a different Cadre de Guerre and as such,
skills and passives will be completely different (at a later date)

## To do

- Separate controls from player logic to allow coop (coop does not have to exist yet)
- click on character skill
- right click skill
- enemies wind up before attacking
- room manager

### Room Manager

The room manager will decide many things. As a random dungeon,
it'd probably be much more interesting if not all of the rooms happen to be "Kill X".

Room manager should be able to first :
- have wave rules
- be capable to switch layout on waves end
- contain some interesting stuff for the user (extra currency and life pickups (more tbd))

Later room manager will be able to :
- have varied waves/rooms objectives (survival, extermination, sabotage, defense, etc)
- have non-fighting rooms (shop, npc rooms, shrines, etc...)
- have player choices in where they go

### Enemies

Enemies  are at the beginning divided in 4 types :
- shoot but doesn't move
- move in sequence, always hurt (unless dash)
- chase the player, hurt only on dashes
- chest kind enemies, flee user

##MVP

- Sound/Music are present
- Basic sprite implementation
- Start Screen, Hub Screen and Fight Screen
- Room manager
