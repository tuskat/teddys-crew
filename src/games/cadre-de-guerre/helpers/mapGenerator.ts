
export class mapGenerator {
  private scene: Phaser.Scene;
  private groundLayer;
  private objectLayer;
  private map;

  constructor(params) {
    this.scene = params.scene;
  }

    create ()
    {
        // Creating a blank tilethis.map with the specified dimensions
        this.map = this.scene.make.tilemap({ tileWidth: 16, tileHeight: 16, width: 64, height: 45 });

        let tiles = this.map.addTilesetImage('game-tiles');

        this.groundLayer = this.map.createBlankDynamicLayer('Ground Layer', tiles);
        // this.objectLayer = this.map.createBlankDynamicLayer('Object Layer', tiles);
        this.groundLayer.setScale(1);
        // this.objectLayer.setScale(2.65);
        // this.cameras.main.setScroll(-27, -27);

        // Walls & corners of the room
        // Top, Bottom, Left, Right
        this.groundLayer.fill(172, 0, 0, this.map.width, 1);
        this.groundLayer.fill(240, 0, this.map.height - 1, this.map.width, 1);
        this.groundLayer.fill(205, 0, 0, 1, this.map.height);
        this.groundLayer.fill(207, this.map.width - 1, 0, 1, this.map.height); // right
        // top left, top right, bottom left, bottom right
        this.groundLayer.putTileAt(171, 0, 0);
        this.groundLayer.putTileAt(173, this.map.width - 1, 0);
        this.groundLayer.putTileAt(241, this.map.width - 1, this.map.height - 1);
        this.groundLayer.putTileAt(239, 0, this.map.height - 1);

        this.groundLayer.setCollision([172,240,205,207,171,173,241,239], true);
        this.randomizeRoom(); // Initial randomization
    }

    randomizeRoom ()
    {
        // Fill the floor with random ground tiles
        this.groundLayer.weightedRandomize(1, 1, this.map.width - 2, this.map.height - 2, [
            { index: 42, weight: 20 }, // Regular floor tile (4x more likely)
            { index: 38, weight: 5 }, // Tile variation with 1 rock
            { index: 36, weight: 3 }, // Tile variation with 1 rock
            { index: 71, weight: 1 } // Tile variation with 1 rock
        ]);

        // Fill the floor of the room with random, weighted tiles
        // this.objectLayer.weightedRandomize(1, 1, this.map.width - 2, this.map.height - 2, [
        //     { index: -1, weight: 50 }, // Place an empty tile most of the tile
        //     { index: 13, weight: 3 }, // Empty pot
        //     { index: 32, weight: 2 }, // Full pot
        //     { index: 127, weight: 1 }, // Open crate
        //     { index: 108, weight: 1 }, // Empty crate
        //     { index: 109, weight: 2 }, // Open barrel
        //     { index: 110, weight: 2 }, // Empty barrel
        //     { index: 166, weight: 0.25 }, // Chest
        //     { index: 167, weight: 0.25 } // Trap door
        // ]);
    }
}
