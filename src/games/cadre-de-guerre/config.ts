export class Config {
    // game dimensions
    public static readonly GAME_WIDTH = 1280;
    public static readonly GAME_HEIGHT = 720;
    public static readonly TITLE = '';
    public static readonly ASSETS = (process.env.NODE_ENV === 'production') ? 'assets' : '/src/games/cadre-de-guerre/assets';
}

