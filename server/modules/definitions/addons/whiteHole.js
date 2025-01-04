/* BLACK HOLE ADDON */
/* Adds a black hole with gravitational attraction into the addons menu upgrades */

// The black hole settings
const range = 1e5;
const mass = 1e13;
const G = 6.67e-11;
const sizeChangeMultiplier = 2;
const ignored = [];
const ignoredTypes = ["wall"];

// Precalculated things
const rangeSquared = range ** 2;
const a = G * mass;

// The actual black hole tank
Class.whiteHole = {
    PARENT: "genericTank",
    COLOR: "white",
    LABEL: "White Hole",
    BODY: {
        DAMAGE: 0,
        HEALTH: 1,
        SPEED: 10,
        FOV: 3
    },
    ON: [
        {
            event: "tick",
            handler: ({ body }) => { // Runs every tick to attract nearby entities
                // Get the black hole's id and position
                const { id, x: x1, y: y1 } = body;
                // Loop over all the entities
                for (let entity of entities) {
                    // Skip it if it's our body or it should be ignored
                    if (entity.id === id || ignoredTypes.includes(entity.type) || ignored.some(func => func(entity))) continue;
                    // Get its position
                    const { x: x2, y: y2 } = entity;
                    // Calculate the distance
                    let xx = (x2 - x1);
                    let yy = (y2 - y1);
                    let dist = xx ** 2 + yy ** 2;
                    // Check if it's in range
                    if (dist <= rangeSquared) {
                        // Get the attraction force
                        let F = a / dist;
                        entity.velocity.x += F * xx;
                        entity.velocity.y += F * yy;
                    }
                }
            }
        },
        {
            event: "define",
            handler: ({ body }) => { // Runs when an entity is defined to the black hole
                // Make sure we disable collisions and avoid getting pushed around
                body.removeFromGrid();
                body.skipLife = true;
            }
        }
    ]
};

// Add it to the addons menu upgrades
Class.testing.UPGRADES_TIER_0.push("whiteHole");