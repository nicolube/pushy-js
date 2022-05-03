import { Component } from 'react'
import P5 from "p5";
import Sketch from 'react-p5';
import { Game } from '../lib/game';
import { Direction, MapComponent, Player } from '../lib/map';
import { getTexture } from '../lib/textures';
import { SoundManager, Sounds } from '../lib/sounds';

type Props = {}
type State = {}

class Pushy extends Component<Props, State> {
    private init = false;
    game?: Game;
    soundManager?: SoundManager;

    size: number = 64;
    scale: number = 1;

    setup = (p5: P5, parent: Element) => {
        this.soundManager = new SoundManager();
        this.game = new Game(this.soundManager)
        p5.createCanvas(this.game.map.width * this.size, this.game.map.height * this.size).parent(parent);
        if (this.init) return;
        this.init = true
    } 

    drawComponent = (p5: P5, component: MapComponent, x: number, y: number) => {
        p5.push()
        p5.translate((x + .5) * this.size, (y + .5) * this.size);
        p5.imageMode("center");
        let texture = getTexture(p5, component.getTexture());
        if (component instanceof Player) {
            p5.rotate(-p5.HALF_PI * component.getDirection())
        }
        p5.image(texture, 0, 0);
        p5.pop();
    }

    draw = (p5: P5) => {
        if (!this.game) return;
        for (let x = 0; x < this.game.map.width; x++) {
            for (let y = 0; y < this.game.map.height; y++) {
                if ((x + y) % 2)
                    p5.fill(200)
                else
                    p5.fill(220)
                p5.rect(x * this.size, y * this.size, this.size, this.size);
            }
        }
        this.game.map.statics.forEach(cc => this.drawComponent(p5, cc.get(), cc.x, cc.y));
        this.game.map.movables.forEach(cc => this.drawComponent(p5, cc.get(), cc.x, cc.y));
        this.game.map.players.forEach(p => this.drawComponent(p5, p, p.x, p.y));
    }

    keyPressed = (p5: P5) => {
        if (!this.game) return;
        switch (p5.key.toLowerCase()) {
            case 'w':
                this.game.onPlayerMove(0, Direction.NORTH);
                break
            case 'd':
                this.game.onPlayerMove(0, Direction.EAST);
                break
            case 's':
                this.game.onPlayerMove(0, Direction.SOUTH);
                break
            case 'a':
                this.game.onPlayerMove(0, Direction.WEST);
                break
            case 'i':
                this.game.onPlayerMove(1, Direction.NORTH);
                break
            case 'l':
                this.game.onPlayerMove(1, Direction.EAST);
                break
            case 'k':
                this.game.onPlayerMove(1, Direction.SOUTH);
                break
            case 'j':
                this.game.onPlayerMove(1, Direction.WEST);
                break
        }

    }

    render() {
        return (
            <div>
                <Sketch setup={this.setup} draw={this.draw} keyPressed={this.keyPressed} />
            </div>
        )
    }
}

export default Pushy