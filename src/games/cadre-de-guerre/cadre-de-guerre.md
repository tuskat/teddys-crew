# Teddy's Crew (TBD)

## Synopsis

it's a cute parody of [Redacted], it stars some bears like creatures with insect masks fighting some obscure-like (deep-sea inspired) creatures.
The goal is to fight off waves of enemies.
It is a reversed dungeon : each wave will completely change the room.

You are fighting the demons under the bed.

## Character
Bears with insects masks. Starters will be :
- Stag Beetle : Offensive slashing dash. 10hp
- Rhino Beetle : Bumping dash. 15hp?
- Rosalia Longhorn : Dash leave trail of fire. 7hp?

## Controls

- Click somewhere to dash. Dash is an attack
- Click on character to use defensive skill (will vary later)
- Right click to use long range attack (will vary later)

## Gameplay

- Each run you start level 1 (levelling system to add to entity class)
- You unlock skills by picking up boons. Right click are projectiles with cooldown
- Character Click are "Ultimates"

Upon dying, you'll be stripped naked of skills. You can assign right click, but  ultimates have to be found again (Make player get one around Level 5)

## Genre

It's a roguelite. As such, you get currency while fighting.
Once you die you can use that currency to improve your Cadre de Guerre.
Dying mean you'll be randomly attributed a different Cadre de Guerre and as such,
skills and passives will be completely different (at a later date)

## To do

- click on character skill
- right click skill

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

### Enemies

Enemies  are at the beginning divided in 4 types :
- shoot but doesn't move (weak to short range)
- move in sequence, switch between hurt and idle (weak to long range)
- chase the player, hurt only on dashes (done) (extremly weak)
- chest kind enemies, flee user (can take some dmg)

##MVP

- Sound/Music are present (in progress)
- Basic sprite implementation
- Hub Screen
- Basic Game Settings

##Useful ressources

http://sbcgames.io/build-maintainable-games-with-phaser-3-2-adding-external-config/

http://sbcgames.io/build-maintainable-games-with-phaser-3-3-user-settings/

##Artstyle to copy...hmm inspire from

https://www.spriters-resource.com/snes/kirbydream3/
