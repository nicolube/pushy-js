enum Color {
    REG,
    GREEN,
    BLUE
}

export class MapComponent {

}

export class Wall extends MapComponent {

}

export class Crate extends MapComponent {

}

export class Home extends MapComponent {

}
export class ColoredComponent extends MapComponent {

    color: Color

    constructor(color: Color) {
        super()
        this.color = color;
    }

}

export class Ball extends ColoredComponent {


}

export class Player extends MapComponent {
    id: number

    constructor(id: number) {
        super()
        this.id = id;
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
    
        this.content[0][0] = new Wall();
    }

}
