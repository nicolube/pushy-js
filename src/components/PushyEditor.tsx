import P5 from 'p5'
import { Component, useState } from 'react'
import Sketch from 'react-p5'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { Ball, Color, Crate, Field, GameMap, House, HouseType, MapComponent, Paint, Player, Wall } from '../lib/map'
import { getTexture, Textures } from '../lib/textures'
import { download } from '../lib/unit'
import Pushy from './Pushy'

type Props = {
  map?: GameMap
  setMap: (map: GameMap) => any
  setTesting: (state: boolean) => any
  navigate: NavigateFunction
}

type State = {}

class RemoveTool extends MapComponent {
  getTexture = () => {
    return Textures.REMOVE
  }
}

const tools: MapComponent[] = [
  new Wall(),
  new Crate(),
  new Ball(Color.RED),
  new Ball(Color.GREEN),
  new Ball(Color.BLUE),
  new Paint(Color.RED),
  new Paint(Color.GREEN),
  new Paint(Color.BLUE),
  new Field(Color.RED),
  new Field(Color.GREEN),
  new Field(Color.BLUE),
  new Player(0),
  new House(HouseType.NORMAL),
  new RemoveTool("-"),
]

class Editor extends Component<Props, State> {
  size: number = 64;
  map = new GameMap(20, 12);
  toolOffset = [(this.map.width - tools.length) / 2, (this.map.height + .25)];
  tool?: MapComponent;

  setup = (p5: P5, parent: Element) => {
    if (this.props.map)
      this.map = this.props.map;
    p5.createCanvas(this.map.width * this.size, (this.map.height + 1.5) * this.size).parent(parent);
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
    p5.clear();
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

    for (let i = 0; i < tools.length; i++) {
      const tool = tools[i];
      p5.noFill()
      p5.rect((this.toolOffset[0] + i) * this.size, this.toolOffset[1] * this.size, this.size, this.size)
      this.drawComponent(p5, tool, this.toolOffset[0] + i, this.toolOffset[1]);
    }

    if (this.tool) {
      let mx = p5.mouseX / this.size - .5;
      let my = p5.mouseY / this.size - .5;
      this.drawComponent(p5, this.tool, mx, my)
    }
  }


  mouseClicked = (p5: P5) => {
    let mx = p5.mouseX / this.size;
    let my = p5.mouseY / this.size;

    if (my > this.map.height) {
      mx = Math.floor(mx - this.toolOffset[0]);
      my = Math.floor(my - this.toolOffset[1]);
      if (my === 0 && mx < tools.length)
        this.tool = tools[mx];
    } else {
      if (!this.tool) return;
      mx = Math.floor(mx);
      my = Math.floor(my);
      if (mx === 0 || my === 0) return;
      if (mx === this.map.width - 1 || my === this.map.height - 1) return;
      if (!this.map.content[mx]) return;
      if (this.tool instanceof RemoveTool) {
        delete this.map.content[mx][my];
      } else {
        this.map.content[mx][my] = this.tool;
      }

    }
  }

  test = () => {
    this.props.setMap(GameMap.deserialize(this.map.serialize()));
    this.props.setTesting(true);
  }

  render() {

    return (
      <div>
        <Sketch setup={this.setup} draw={this.draw} mouseClicked={this.mouseClicked} mouseDragged={this.mouseClicked} />
        <button onClick={this.test}>Test Map</button>
        <button onClick={() => download("map.json", JSON.stringify(this.map.serialize()))}>Download</button>
      </div>
    )
  }
}

export const PushyEditor = () => {
  const [testMap, setTestMap] = useState<GameMap | undefined>(undefined);
  const [testing, setTesting] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      
      {testing ? <>
      <Pushy map={testMap} />
      <button onClick={() => setTesting(false)}>Exit</button>
      </>: <Editor navigate={navigate} setMap={setTestMap} map={testMap} setTesting={setTesting} />}
      
    </>
  );
}
