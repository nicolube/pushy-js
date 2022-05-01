import P5 from 'p5'
import React, { Component } from 'react'
import Sketch from 'react-p5'
import { GameMap, MapComponent, Player } from '../lib/map'
import { getTexture } from '../lib/textures'

type Props = {}

type State = {}

export default class PushyEditor extends Component<Props, State> {
  state = {}

  size: number = 64;
  map = new GameMap(20, 12);

  setup = (p5: P5, parent: Element) => {
    p5.createCanvas(this.map.width * this.size, this.map.height * this.size).parent(parent);
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
    for (let x = 0; x < this.map.width; x++) {
      for (let y = 0; y < this.map.height; y++) {
        if ((x + y) % 2)
          p5.fill(200)
        else
          p5.fill(220)
        p5.rect(x * this.size, y * this.size, this.size, this.size);
        
        let comp = this.map.content[x][y];
        if (comp)
          this.drawComponent(p5, comp, x, y);
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