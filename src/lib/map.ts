import { Textures } from "./textures";

export enum Color {
    BLUE,
    GREEN,
    RED,
}

export enum Direction {
    NORTH,
    EAST,
    SOUTH,
    WEST,
}

export abstract class MapComponent {
    protected moveable = false;
    protected solid = true;

    isMoveable = () => {
        return this.moveable;
    }

    isSolid = () => {
        return this.solid;
    }

    abstract getTexture(): Textures;
}

export class Wall extends MapComponent {
    rand = Math.random()

    getTexture = (): Textures => {
        if (this.rand < .8)
            return Textures.WALL1;
        else
            return Textures.WALL2;
    }
}

export class Crate extends MapComponent {
    constructor() {
        super();
        this.moveable = true;
    }
    getTexture = (): Textures => {
        return Textures.CRATE;
    }
}

export class Home extends MapComponent {
    getTexture = (): Textures => {
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

    constructor(color: Color) {
        super(color);
        this.moveable = true;
    }

    getTexture = (): Textures => {
        return Textures.BALL_BLUE + this.color;
    }
}

export class Field extends ColoredComponent {

    constructor(color: Color) {
        super(color);
        this.solid = false;
    }

    getTexture = (): Textures => {
        return Textures.FIELD_BLUE + this.color;
    }
}

export class Paint extends ColoredComponent {

    constructor(color: Color) {
        super(color);
        this.solid = false;
    }

    getTexture = (): Textures => {
        return Textures.PAINT_BLUE + this.color;
    }
}

export class Player extends MapComponent {
    id: number
    direction: Direction = Direction.WEST;
    x: number = 0;
    y: number = 0;

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
        return [this.x, this.y];
    }
}

export class ComponentContainer {
    private component: MapComponent;
    x: number;
    y: number;

    constructor(component: MapComponent, x: number, y: number) {
        this.component = component;
        this.x = x;
        this.y = y;
    }

    get = () => {
        return this.component;
    }
}

export class GameMap {
    width: number
    height: number
    content: MapComponent[][]

    statics: ComponentContainer[] = []
    movables: ComponentContainer[] = []
    players: Player[] = []


    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.content = new Array(width).fill(undefined).map(() => new Array(height).fill(undefined));

        for (let x = 0; x < width; x++) {
            this.content[x][0] = new Wall();
            this.content[x][height - 1] = new Wall();
        }
        for (let y = 1; y < height - 1; y++) {
            this.content[0][y] = new Wall();
            this.content[width - 1][y] = new Wall();
        }

        this.content[5][5] = new Player(0);
        this.content[5][4] = new Player(1);
        this.content[5][6] = new Ball(Color.GREEN);
        this.content[5][7] = new Paint(Color.BLUE);
        this.content[16][8] = new Field(Color.RED);
        this.content[5][8] = new Field(Color.BLUE);
        this.content[4][5] = new Crate();
    }

    updateMap = () => {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                let comp = this.content[x][y];
                if (comp === undefined) continue;
                if (comp instanceof Player) {
                    comp.x = x;
                    comp.y = y;
                    this.players.push(comp);
                } else if (comp.isMoveable()) {
                    this.movables.push(new ComponentContainer(comp, x, y));
                } else {
                    this.statics.push(new ComponentContainer(comp, x, y));
                }
            }
        }
        this.players.sort((a: Player, b: Player) => (a.id - b.id));
    }

    getComponent = (x: number, y: number) => {
        let comp = this.statics.find(c => c.x === x && c.y === y);
        if (comp) return comp;
        comp = this.movables.find(c => c.x === x && c.y === y);
        if (comp) return comp;
        let player = this.players.find(c => c.x === x && c.y === y);
        if (player) return new ComponentContainer(player, x, y);
    }

    remove = (cc: ComponentContainer) => {
        if (cc.get().isMoveable())
            this.movables = this.movables.filter(e => cc !== e);
        else 
            this.statics = this.statics.filter(e => cc !== e);
        
    }

}
