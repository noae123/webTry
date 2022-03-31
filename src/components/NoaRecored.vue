<template>
  <div class="player">
    <div id="recButt" ref="recButt" class="recButt" @click="onRecord">
      <span>Record</span>
      <VueP5 @sketch="sketch"></VueP5>
    </div>
    <audio id='audioPlayer' ref="audio_noa" :src="songSrc"
           controls controlsList="nodownload" @play="onPlay"></audio>
  </div>
</template>

<script>
import VueP5 from './p5';

export default {
  name: "NoaRecored",
  components: {VueP5},
  data: () => ({
    p5: null,
    newDelay: null,
    songSrc: null,
    mic: null,
    recorder: null,
  }),
  methods: {
    recordAudio(p5) {
      this.p5 = p5;

      // create an audio in
      this.mic = new p5.AudioIn();

      // users must manually enable their browser microphone for recording to work properly!
      this.mic.start();

      // create a sound recorder
      this.recorder = new p5.SoundRecorder();

      // connect the mic to the recorder
      this.recorder.setInput(this.mic);

      // create an empty sound file that we will use to playback the recording
      this.songSrc = new p5.SoundFile();
    },

    onRecord() {

    },
    onPlay() {
      this.p5.userStartAudio();
    },
    onClick() {
      console.log(this.songSrc)
      if (this.$refs.audio_noa.paused & this.songSrc != null) {
        this.$refs.audio_noa.play()
      } else {
        this.$refs.audio_noa.pause()
      }
    },
    sketch(p5) {
      // eslint-disable-next-line no-unused-vars
      let can, fft, amp;
      let wave_paused = null;
      let particles = [];
      p5.mouseClicked = () => {
        p5.userStartAudio();
      }
      p5.setup = () => {
        this.p5 = p5;
        //create canvas object
        can = p5.createCanvas(this.$refs.imgbox.clientWidth, this.$refs.imgbox.clientHeight)
        can.position(0, 0);
        p5.angleMode('degrees')

        this.audioContext = p5.getAudioContext();
        // // wire all media elements up to the p5.sound AudioContext
        let mediaSource = this.audioContext.createMediaElementSource(this.$refs.audio_noa);
        mediaSource.connect(p5.soundOut);

        fft = new window.p5.FFT()
        wave_paused = fft.waveform()
      }

      p5.windowResized = () => {
        p5.resizeCanvas(this.$refs.imgbox.clientWidth, this.$refs.imgbox.clientHeight)
      }

      p5.draw = () => {
        p5.clear();
        p5.noFill()
        p5.strokeWeight(4)
        let wave = null;

        p5.translate(p5.width / 2, p5.height / 2)

        fft.analyze()
        amp = fft.getEnergy(20, [200])
        p5.stroke([255, 255, 255, 255]);

        if (!this.$refs.audio_noa.paused) {
          let wave_normal = fft.waveform()
          wave = wave_normal
        } else {
          wave = wave_paused
          p5.triangle(25, 0, -12.5, 25, -12.5, -25);
        }

        for (let t = -1; t <= 1; t += 2) {
          p5.beginShape();
          for (let i = 0; i <= 180; i += 1) {
            let index = Math.floor(p5.map(i, 0, 180, 0, wave.length - 1));
            let r = p5.map(wave[index], -1, 1, 180, 300)
            let x = r * p5.sin(i) * 0.5 * t;
            let y = r * p5.cos(i) * 0.5;
            p5.vertex(x, y);
          }
          p5.endShape();
        }
        p5.strokeWeight(2)
        for (let t = -1; t <= 1; t += 2) {
          p5.beginShape();
          for (let i = 0; i <= 180; i += 1) {
            let index = Math.floor(p5.map(i, 0, 180, 0, wave.length - 1));
            let r = p5.map(wave[index], -1, 1, 120, 180);
            let x = r * p5.sin(i) * 0.5 * t;
            let y = r * p5.cos(i) * 0.5;
            p5.vertex(x, y);
          }
          p5.endShape();
        }


        if (!this.$refs.audio_noa.paused) {
          let p = new Particle(amp, p5);

          particles.push(p);
          if (amp > 180) {
            let a = new Particle(amp, p5);
            particles.push(a);
          }
          if (amp > 220) {
            let a = new Particle(amp, p5);
            particles.push(a);
            a = new Particle(amp, p5);
            particles.push(a);
          }
          for (let i = particles.length - 1; i >= 0; i--) {
            if (!particles[i].delete(p5)) {
              particles[i].update(amp);
              particles[i].show(p5);
            } else {
              particles.splice(i, 1)
            }
          }
        } else {
          for (let i = particles.length - 1; i >= 0; i--) {
            particles.splice(i, 1)
          }
        }
      }
    }
  },
}

class Particle {
  constructor(amp, p5) {
    this.pos = window.p5.Vector.random2D().mult(126)
    this.vel = p5.createVector(p5.random(0.0002, 0.00001))
    this.acc = this.pos.copy().mult(p5.random(0.0002, 0.00001))
    this.w = p5.random(3, 10)
    this.color = [255, 255, 255, p5.random(255 - amp, 255) + 40]
  }

  update(amp) {
    if (amp > 200) {
      this.acc.mult(1 + (amp / 200) / 10)
    }
    this.vel.add(this.acc)
    this.pos.add(this.vel)
  }

  show(p5) {
    p5.noStroke()
    p5.fill(this.color)
    p5.ellipse(this.pos.x, this.pos.y, this.w)
  }

  delete(p5) {
    if (this.pos.x < -p5.width / 2 || this.pos.x > p5.width / 2 || this.pos.y < -p5.height / 2 || this.pos.y > p5.height / 2) {
      return true
    }
    return false
  }
}
</script>

<style scoped>
.player .imgbox {
  position: relative;
  width: 100%;
  height: 76vh;
  max-height: 750px;
  cursor: pointer;
}

.player .imgbox .mmg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000F1C;
}
</style>