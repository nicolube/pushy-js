import React, { Component } from 'react'
import P5 from "p5";
import Sketch from 'react-p5';
import { Game } from '../lib/game';
import { MapComponent } from '../lib/map';

type Props = {}
type State = {}

class Pushy extends Component<Props, State> {

    game: Game = new Game()

    size: number = 64;
    scale: number = 1;

    setup = (p5: P5, parent: Element) => {
        p5.createCanvas(this.game.map.width * this.size, this.game.map.height * this.size).parent(parent);
    }

    drawBackground(p5: P5) {
        for (let x = 0; x < this.game.map.width; x++) {
            for (let y = 0; y < this.game.map.height; y++) {
                let component: MapComponent | undefined = this.game.map.content[x][y];
                if (component) {

                }
                else {
                    if ((x + y) % 2)
                        p5.fill(200)
                    else
                        p5.fill(220)
                    p5.rect(x * this.size, y * this.size, this.size, this.size)
                }
            }
        }
    }

    draw = (p5: P5) => {
        this.drawBackground(p5)
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