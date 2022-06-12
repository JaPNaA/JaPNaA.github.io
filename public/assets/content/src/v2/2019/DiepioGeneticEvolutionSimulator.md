# diep.io Genetic Evolution Simulator

---

link: /Thingy_2019/diepioGeneticEvolutionSimulator/
timestamp: 2019/7/24
shortDesc: diep.io, except it's not a game, and you watch the computer play
tags: diep, io, genetic evolution, simulator, mobile, clone, copy, tanks, optimized, quadtree, physics, circles
author: JaPNaA
backgroundCSS: url(/Thingy_2019/0p/diepioGeneticEvolutionSimulator/normal.png)

---

This is simulation simulates tanks from [diep.io](https://diep.io) slowly evolving, getting higher levels, having babies, mutating, and growing extra canons.

In the default configuration, 6400 entities, 192 of which are tanks, spread across 24000x24000 pixels of land. And somehow it runs smoothly on my tablet.

<!view-project>

If you think you're computer can handle it, you can turn up the amount of tanks, entities, and map size to suit your preferences. Or, if you have a computer with less processing power than my tablet, you can turn down the settings.

## How the tanks works

In the simulation, the tanks have "genes". These genes are the foundation for it's evolution. Every time the tank reproduces, the tank's genes are averaged with it's mate, and a bit of mutation is applied to their baby.

Some of these mutations are great, for example, an extra canon

<!img src="/Thingy_2019/0p/diepioGeneticEvolutionSimulator/2CanonTank.png" --"A tank with 2 canons">

And some of them, not so good

<!img src="/Thingy_2019/0p/diepioGeneticEvolutionSimulator/0CanonTank.png" --"A poor tank with no canons">

The good mutations live long enough to reproduce and more copies of itself, while the bad ones die to other tanks. Natural selection!

You can see it's genes, as well as other stats when you hover over (or tap) a tank.

<!img src="/Thingy_2019/0p/diepioGeneticEvolutionSimulator/menu.png" --"A menu with quite a lot of numbers">

---

If you want to know what all of these stats mean, then uhh, here you go!:

-   **Genetic Tank**: This is the name of the type of entity, others include "Bullet", "Player", "Triangle", "Square", etc.
-   **TeamID**: The ID of the tank, tanks with the same TeamID don't attack or damage each other
-   **TimeToNewTeam**: If defined, once it hits 0, the tank gets a new unused TeamID, allowing everything to hurt it
-   **Level**: The level of the tank, every level, the tank gets to increase a stat in it's `Build`
-   **TotalXP**: The total amount of XP that the tank has gained, higher XP results in a higher level
-   **isSearchingForMate**: Indicates whether the tank is searching for a mate or not
-   **Build** (all the same ones from diep.io, ranges from 0..7)
    -   **healthRegeneration**: How quickly the tank passively regenerates health
        <br> 0 -> no passive regeneration
        <br> 7 -> quite a lot
        <br> _Note: health can still be regenerated after 60 seconds if the tank hasn't taken any damage_
    -   **maxHealth**: How much extra health the tank gets
    -   **bodyDamage**: How much damage the tank does if it slams against something else with it's body
    -   **bulletSpeed**: How fast the bullets are
    -   **bulletPenetration**: How much health the bullets have
    -   **bulletDamage**: How much damage a bullet does when it hits something
    -   **reload**: How fast the tank shoots
    -   **movementSpeed**: How fast the tank moves
-   **Genes**
    -   **accuracy**: How accurate the tank is at aiming (worse aim can lead to winning some battles)
    -   **aggression**: How likely the tank is to attack another tank
        -   **Build**
            -   healthRegeneration, maxHealth, bodyDamage, bulletSpeed, bulletPenetration, bulletDamage, reload, movementSpeed
            -   These affect the likeliness that a tank will choose to increase their respective stats
    -   **care**: How much a tank cares about it's babies. This affects the amount XP they give, and how they set the babies' `TimeToNewTeam` timer
    -   **class**: An object that represents the Tank's canon's angle/width/length, etc.
    -   **comfortableDistance**: How close until the tank backs off from it's target
    -   **idealDistance**: How close until the tank stops moving towards it's target
    -   **levelToReproduction**: The level the tank must reach before it searches for a mate
    -   **mutationRate**: How much mutation will it's baby have
    -   **range**: How far it can see
-   **Number of canons**: The number of canons the tank has
-   **Power divisor**: Divides the bullet's damage. This becomes more relevant when the tank has more canons

---

All my projects are open source, so you can take a look at the code here:

<!view-source>
