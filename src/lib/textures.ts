import P5, { Image } from "p5";

export enum Textures {
    BALL_BLUE,
    BALL_GREEN,
    BALL_RED,
    FIELD_BLUE = 4,
    FIELD_GREEN,
    FIELD_RED,
    PAINT_BLUE = 8,
    PAINT_GREEN,
    PAINT_RED,
    PLAYER_GREEN = 12,
    PLAYER_YELOW,
    WALL1,
    WALL2,
    HOUSE_GREEN = 16,
    HOUSE_YELLOW,
    HOUSE,
    CRATE
}

var atlas: Image;

export const getTexture = (p5: P5, texture: Textures): Image => {
    if (!atlas) {
        atlas = p5.loadImage("textures/atlas.png");
        atlas.loadPixels()
    }
    let x = Math.floor(texture / 4 % 10);
    let y = Math.floor(texture % 4);
    return atlas.get(x * 64, y * 64, 64, 64);
}