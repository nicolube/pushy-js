import { Ball, ComponentContainer, Crate, Direction, Field, GameMap, Paint } from "./map";
import { SoundManager, Sounds } from "./sounds";

export class Game {
    private soundManager: SoundManager
    map = new GameMap(20, 12);

    constructor(soundManager: SoundManager, map?: GameMap,) {
        this.soundManager = soundManager;
        if (map)
            this.map = map;
        this.map.updateMap();
    }

    getDirectionPos = (direction: Direction, x: number, y: number) => {
        if (direction % 2) {
            x += direction === Direction.EAST ? 1 : -1;
        } else {
            y += direction === Direction.NORTH ? -1 : 1;
        }
        return [x, y];
    }

    onBallMove = (comp: ComponentContainer, mComp: ComponentContainer) => {
        let ball = comp.get() as Ball;
        if (mComp.get() instanceof Paint) {
            let paint = mComp.get() as Paint;
            ball.color = paint.color;
            this.map.remove(mComp);
            this.soundManager.play(Sounds.SQISH);
            return true;
        }
        if (mComp.get() instanceof Field) {
            let field = mComp.get() as Field;
            if (ball.color !== field.color) return false;
            this.map.remove(comp);
            this.soundManager.play(Sounds.PLING);
            return true;
        }
        return false;
    }

    onComponentMove = (comp: ComponentContainer, direction: Direction) => {
        if (comp.get().isMoveable()) {
            let [mx, my] = this.getDirectionPos(direction, comp.x, comp.y);
            let mComp = this.map.getComponent(mx, my);
            if (mComp) {
                if (!(comp.get() instanceof Ball) || !this.onBallMove(comp, mComp)) {
                    return false;
                } 
            };
            if (comp.get() instanceof Crate)
                this.soundManager.play(Sounds.BOX_MOVE);
            comp.x = mx;
            comp.y = my
        }
        else if (comp.get().isSolid()) return false;
        return true;
    }

    onPlayerMove = (id: number, direction: Direction) => {
        if (this.map.players.length < id) return;
        let player = this.map.players[id];
        player.direction = direction;
        let [tx, ty] = this.getDirectionPos(direction, player.x, player.y);

        let comp = this.map.getComponent(tx, ty);
        if (comp) {
            if (!this.onComponentMove(comp, direction)) return
        }
        player.x = tx;
        player.y = ty;
    }
}