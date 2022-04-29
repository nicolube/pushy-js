import React, { Component } from 'react'
import P5 from "p5";
import Sketch from 'react-p5';
import { Game } from '../lib/game';
import { MapComponent, Player, Wall } from '../lib/map';
import { getTexture, Textures } from '../lib/textures';

type Props = {}
type State = {}

class Pushy extends Component<Props, State> {

    game: Game = new Game()

    size: number = 64;
    scale: number = 1;

    setup = (p5: P5, parent: Element) => {
        p5.createCanvas(this.game.map.width * this.size, this.game.map.height * this.size).parent(parent);
    }

    drawComponent = (p5: P5, component: MapComponent, x: number, y: number) => {
        p5.push()
        p5.translate((x+.5) * this.size, (y+.5) * this.size);
        p5.imageMode("center");
        let texture = getTexture(p5, component.getTexture())
        if (component instanceof Player) {
                p5.rotate(-p5.HALF_PI * component.getDirection())
        }
        p5.image(texture, 0, 0);
        p5.pop()
    }
    draw = (p5: P5) => {
        for (let x = 0; x < this.game.map.width; x++) {
            for (let y = 0; y < this.game.map.height; y++) {
                if ((x + y) % 2)
                    p5.fill(200)
                else
                    p5.fill(220)
                p5.rect(x * this.size, y * this.size, this.size, this.size)

                let component: MapComponent | undefined = this.game.map.content[x][y];
                if (component) {
                    this.drawComponent(p5, component, x, y)
                }
            }
        }
    }


    render() {
        return (
            <div>
                <Sketch setup={this.setup} draw={this.draw} />
            </div>
        )
    }
}

export default Pushy