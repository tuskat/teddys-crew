
export class mapGenerator {
    private scene: Phaser.Scene;
    private groundLayer;
    private objectLayer;
    private map;

    constructor(params) {
        this.scene = params.scene;
    }

    create() {
        // Creating a blank tilethis.map with the specified dimensions
        this.map = this.scene.make.tilemap({ tileWidth: 87, tileHeight: 87, width: 14, height: 8 });

        let tiles = this.map.addTilesetImage('game-tiles');

        this.groundLayer = this.map.createBlankDynamicLayer('Ground Layer', tiles);
        this.objectLayer = this.map.createBlankDynamicLayer('Object Layer', tiles);
        this.groundLayer.setScale(1);
        this.objectLayer.setScale(1);
        // this.cameras.main.setScroll(-27, -27);

        // Walls & corners of the room
        // Top, Bottom, Left, Right
        this.groundLayer.fill(1, 0, 0, this.map.width, 1);
        this.groundLayer.fill(13, 0, this.map.height - 1, this.map.width, 1);
        this.groundLayer.fill(4, 0, 0, 1, this.map.height);
        this.groundLayer.fill(7, this.map.width - 1, 0, 1, this.map.height); // right
        // top left, top right, bottom left, bottom right
        this.groundLayer.putTileAt(0, 0, 0);
        this.groundLayer.putTileAt(3, this.map.width - 1, 0);
        this.groundLayer.putTileAt(12, 0, this.map.height - 1);
        this.groundLayer.putTileAt(15, this.map.width - 1, this.map.height - 1);

        this.randomizeRoom(); // Initial randomization
    }

    randomizeRoom() {
        // Fill the floor with random ground tiles
        this.groundLayer.weightedRandomize(1, 1, this.map.width - 2, this.map.height - 2, [
            { index: 5, weight: 20 }, // Regular floor tile (4x more likely)
            { index: 6, weight: 0.5 }, // Tile variation with 1 rock
            { index: 9, weight: 5 }, // Tile variation with 1 rock
            { index: 10, weight: 0.5 } // Tile variation with 1 rock
        ]);

        // Fill the floor of the room with random, weighted tiles
        // this.objectLayer.weightedRandomize(1, 1, (this.map.width - 2), (this.map.height - 2), [
        //     { index: 81, weight: 90 }, // Place an empty tile most of the tile
        //     { index: 285, weight: 0.5 }, // Empty pot
        //     { index: 353, weight: 0.5 }, // Full pot
        //     { index: 125, weight: 0.25 }, // Chest
        //     { index: 124, weight: 0.25 } // Trap door
        // ]);
        this.groundLayer.setCollision([0, 1, 3, 4, 7, 12, 13, 15]);
        // this.groundLayer.setCollision([172, 240, 205, 207, 171, 173, 241, 239], true);
        // this.objectLayer.setCollision([124,125], true);
    }

    getGroundLayer() { 
        return this.groundLayer;
    }

    getObjectLayer() {
        return this.objectLayer;
    }
}
