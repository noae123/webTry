<template>
  <div class="player">
    <div class="userUploader">
      <img :src="UserImg" class="user_img">
      <span class="UserProfileName">{{ UserProfile }}</span>
    </div>
    <div id="imgbox" ref="imgbox" class="imgbox" @click="onClick">
      <img :src="imgSrc" class="mmg">
      <VueP5 @sketch="sketch"></VueP5>
    </div>
    <div ref="audioTitle" class="Audio_Title">
      <div ref="scrollTitle">{{ songName }}</div>
    </div>
    <div ref="audioAT" class="Audio_Title">
      <div ref="scrollAT">{{ SongAuthor }}</div>
    </div>
    <audio id='audioPlayer' ref="audio_noa" :src="songSrc"
           controls controlsList="nodownload" @play="onPlay"></audio>
    <div class="actionLine">
      <img src="@/assets/Like.svg">
      <img src="@/assets/Comment.svg">
      <img src="@/assets/Save.svg">
    </div>
  </div>
</template>

<script>
import VueP5 from './p5';

export default {
  name: "NoaPlayer",
  components: {VueP5},
  props: [
    'songName',
    'songSrc',
    'SongAuthor',
    'imgSrc',
    'Likes',
    'UserProfile',
    'UserImg',
    'backword'
  ],

  data: () => ({
    p5: null,
    newDelay: null,
  }),

  methods: {
    onPlay() {
      this.p5.userStartAudio();
    },
    onClick() {
      if (this.$refs.audio_noa.paused) {
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
        //can.parent(this.$refs.imgbox)
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

  mounted() {
    let defaultDelay = 75;
    let defaultWidth = 3734;
    if (this.$refs.scrollTitle.offsetWidth > this.$refs.audioTitle.offsetWidth) {
      let width = this.$refs.scrollTitle.offsetWidth;
      this.newDelay = defaultDelay * (width / defaultWidth) * 1000;
      if (this.backword == "true") {
        this.$refs.scrollTitle.animate([
          // keyframes
          {transform: 'translate(-90%, 0)'},
          {transform: 'translate(10%, 0)'}
        ], {
          // timing options
          duration: this.newDelay,
          iterations: Infinity
        });
      } else {
        this.$refs.scrollTitle.animate([
          // keyframes
          {transform: 'translate(0, 0)'},
          {transform: 'translate(-90%, 0)'}
        ], {
          // timing options
          delay: 2000,
          duration: this.newDelay,
          iterations: Infinity
        });
      }
    }
    if (this.$refs.scrollAT.offsetWidth > this.$refs.audioAT.offsetWidth) {
      let width = this.$refs.scrollAT.offsetWidth;
      this.newDelay = defaultDelay * (width / defaultWidth) * 1000;
      this.$refs.scrollAT.animate([
        // keyframes
        {transform: 'translate(0, 0)'},
        {transform: 'translate(-90%, 0)'}
      ], {
        // timing options
        delay: 2000,
        duration: this.newDelay,
        iterations: Infinity
      });
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
.UserProfileName {
  margin-left: 12px;
}

.userUploader {
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
}

.user_img {
  margin-left: 5%;
  width: 32px;
  height: 32px;
}

ul {
  list-style-type: none;
}

.player {
  margin-top: 20px;
  position: relative;
  width: 100vw;
  max-width: 614px;
  max-height: 1021px;
  height: 110vh;
  background-color: #f1f3f4;
}

.player .imgbox {
  position: relative;
  width: 100%;
  height: 76vh;
  max-height: 750px;
  cursor: pointer;
}

.player .imgbox img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.player audio {
  width: 100%;
  outline: none;
  text-align: center;
}

.Audio_Title {
  margin-left: 5%;
  display: flex;
  position: relative;
  padding-top: 8px;
  overflow: hidden;
  white-space: nowrap;
  width: 90%;
}

@keyframes marquee {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-100%, 0);
  }
}

.Audio_Title ul {
  width: 48.6vw;
  display: flex;
}
</style>