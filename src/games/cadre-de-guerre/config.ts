export class Config {
    // game dimensions
    public static readonly GAME_WIDTH = 1280;
    public static readonly GAME_HEIGHT = 720;
    public static readonly TITLE = '';
    // Double check that, it's wonky
    public static ASSETS = (process.env.TARGET === 'electron') ? 'assets' : '/src/games/cadre-de-guerre/assets';
}

