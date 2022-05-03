import { Textures } from "./textures";

export enum Color {
    BLUE,
    GREEN,
    RED,
}

export enum HouseType {
    NORMAL,
    GREEN,
    YELLOW,
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
    protected serIdentifier: string;

    constructor(serIdentifier: string) {
        this.serIdentifier = serIdentifier;
    }

    isMoveable = () => {
        return this.moveable;
    }

    isSolid = () => {
        return this.solid;
    }

    abstract getTexture(): Textures;

    serialize = (): string => {
        return this.serIdentifier;
    }
}

export class Wall extends MapComponent {
    rand = Math.random()

    constructor() {
        super("W")
    }

    getTexture = (): Textures => {
        if (this.rand < .8)
            return Textures.WALL1;
        else
            return Textures.WALL2;
    }
}

export class Crate extends MapComponent {
    constructor() {
        super("C");
        this.moveable = true;
    }
    getTexture = (): Textures => {
        return Textures.CRATE;
    }
}

export abstract class ColoredComponent extends MapComponent {

    color: Color

    constructor(serIdentifier: string, color: Color) {
        super(serIdentifier)
        this.color = color;
    }


    serialize = (): string => {
        return `${this.serIdentifier},${this.color}`;
    }

}

export class Ball extends ColoredComponent {

    constructor(color: Color) {
        super("B", color);
        this.moveable = true;
    }

    getTexture = (): Textures => {
        return Textures.BALL_BLUE + this.color;
    }
}

export class Field extends ColoredComponent {

    constructor(color: Color) {
        super("F", color);
        this.solid = false;
    }

    getTexture = (): Textures => {
        return Textures.FIELD_BLUE + this.color;
    }
}

export class House extends MapComponent {
    type: HouseType
    constructor(type: HouseType) {
        super("H");
        this.type = type;
        this.solid = false;
    }

    getTexture = (): Textures => {
        return Textures.HOUSE_GREEN + this.type;
    }

    serialize = (): string => {
        return `${this.serIdentifier},${this.type}`;
    }
}

export class Paint extends ColoredComponent {

    constructor(color: Color) {
        super("D", color);
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
        super("P")
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

    serialize = (): string => {
        return `${this.serIdentifier},${this.id}`;
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


export interface MapData {
    width: number,
    height: number,
    content: (null | string)[][],
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

    serialize = (): MapData => {
        let data: (null | string)[][] = [];
        for (let x = 0; x < this.width; x++) {
            let collumn: (null | string)[] = [];
            for (let y = 0; y < this.height; y++) {
                if (this.content[x][y])
                    collumn.push(this.content[x][y].serialize());
                else {
                    collumn.push(null)
                }
            }
            data.push(collumn);
        }
        return {
            width: this.width,
            height: this.height,
            content: data
        }
    }

    private static componentFromStaring = (raw: string): MapComponent | undefined => {
        let indentifier = raw[0];
        switch (indentifier) {
            case "W":
                return new Wall();
            case "C":
                return new Crate();
            case "B":
                return new Ball(parseInt(raw.split(",")[1]));
            case "D":
                return new Paint(parseInt(raw.split(",")[1]));
            case "F":
                return new Field(parseInt(raw.split(",")[1]));
            case "H":
                return new House(parseInt(raw.split(",")[1]));
            case "P":
                return new Player(parseInt(raw.split(",")[1]));
        }
    }

    static deserialize = (mapData: MapData) => {
        let data: (null | string)[][] = mapData.content;
        let result = new GameMap(mapData.width, mapData.height);
        for (let x = 0; x < mapData.width; x++) {
            for (let y = 0; y < mapData.height; y++) {
                let compString = data[x][y];
                if (!compString) continue;
                let comp = this.componentFromStaring(compString)
                if (comp)
                    result.content[x][y] = comp;
            }
        }
        return result
    }
}
