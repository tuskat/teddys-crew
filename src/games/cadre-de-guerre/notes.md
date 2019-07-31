# Entities Hierarchy

Players, Enemies and Neutrals are all following the sames rules.
As such, it is important to make them herit the same classes.

Look at compision/inheritances :
https://medium.com/developers-writing/typed-object-composition-with-typescript-and-es7-decorators-292afc26c7bd

All entities have in common :
- sprite class
- life
- state
- speed
- target
- receptor for emitters. (e.g instead of Player class in enemy, player will poll his position and faction, and others entities will react accordingly. This is because we want both neutrals and allies)

- all are contructed the same
- all have a blockingState

# To Do

- Fix color tint bug
- Add entity class that inherit from phaser object
- player inherit from Entity
- enemy inherit from Entity
- neutrals will inherit from Entity
