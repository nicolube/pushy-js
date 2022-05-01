import P5 from 'p5'
export enum Sounds {
    BOX_MOVE,
    SQISH,
    POP,
    PLING,
    LALALALA
}

export class SoundManager {
    sounds = new Map<Sounds, HTMLAudioElement>();

    constructor() {
        let soundNames: string[] = [];
        for (let name in Sounds)
            soundNames.push(name);
        for (let i = 0; i < soundNames.length / 2; i++) {
            let name = soundNames[i + soundNames.length / 2].toLowerCase();
            console.log(i, name);
            this.sounds.set(i, new Audio(`../sounds/${name}.mp3`));
        }
    }

    play = (sound: Sounds) => {
        (this.sounds.get(sound)?.cloneNode() as HTMLAudioElement).play();
    }
}