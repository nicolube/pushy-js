import { Textures } from "./textures";

enum Color {
    BLUE,
    GREEN,
    RED,
}

enum Direction {
    NORTH,
    EAST,
    SOUTH,
    WEST,
}

export abstract class MapComponent {
    abstract getTexture(): Textures;
}

export class Wall extends MapComponent {
    rand = Math.random()

    getTexture = () : Textures => {
        if (this.rand < .8) 
        return Textures.WALL1;
        else
        return Textures.WALL2;
    }
}

export class Crate extends MapComponent {

    getTexture = () : Textures => {
        return Textures.CRATE;
    }
}

export class Home extends MapComponent {
    getTexture = () : Textures => {
        return Textures.HOUSE;
    }

}
export abstract class ColoredComponent extends MapComponent {

    color: Color

    constructor(color: Color) {
        super()
        this.color = color;
    }

}

export class Ball extends ColoredComponent {


    getTexture = () : Textures => {
        return Textures.BALL_BLUE + this.color;
    }
}

export class Field extends ColoredComponent {


    getTexture = () : Textures => {
        return Textures.FIELD_BLUE + this.color;
    }
}

export class Paint extends ColoredComponent {


    getTexture = () : Textures => {
        return Textures.PAINT_BLUE + this.color;
    }
}

export class Player extends MapComponent {
    id: number
    direction: Direction = Direction.WEST;

    constructor(id: number) {
        super()
        this.id = id;
    }
    getTexture = () => {
        return Textures.PLAYER_GREEN + this.id;
    }

    getDirection = () => {
      return -this.direction;
    }

    getPosition = () => {

    }
}

export class GameMap {
    width: number
    height: number
    content: MapComponent[][]

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.content = new Array(width).fill(undefined).map(() => new Array(height).fill(undefined));

        for (let x = 0; x < width; x++) {
            this.content[x][0] = new Wall();
            this.content[x][height-1] = new Wall();
        }
        for (let y = 1; y < height-1; y++) {
            this.content[0][y] = new Wall();
            this.content[width-1][y] = new Wall();
        }

        this.content[5][5] = new Player(0);
        this.content[5][6] = new Ball(Color.GREEN);
        this.content[5][7] = new Paint(Color.BLUE);
        this.content[5][8] = new Field(Color.RED);
        this.content[4][5] = new Crate();
        
    }

}
