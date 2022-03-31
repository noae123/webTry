<template>
  <div class="contianer">
    <NoaPlayer img-src="/graphics/sunFlowers.jpg"
               song-name="מה השם שלי? נעה!!!!"
               song-src="/audio/נועה קירל ואילן פלד - טרילילי טרללה _ Noa Kirel & Ilan Peled - Trilili Tralala (Prod by K-Kov).mp3"/>
    <NoaPlayer img-src="/graphics/DolphineSky.jpg"
               song-author="Insider"
               song-name="How Noiseless Props Are Made For Movies And TV Shows  Movies"
               song-src="/audio/Y2Mate.is - How Noiseless Props Are Made For Movies And TV Shows  Movies Insider-x6btmJSRueE-160k-1648481317613.mp3"/>
    <NoaPlayer img-src="/graphics/AS.jpg"
               song-name="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has"
               song-src="/audio/sting_shape_of_my_heart_official_music_video_-2000703457510585365.mp3"/>
    <NoaPlayer UserImg='/graphics/BarakLav.png' UserProfile='Barak Lavi'
               backword="true"
               img-src="/graphics/backImg.jpg"
               song-author="נונו"
               song-name="ליביניג דה דרים - מוקדש לברק לביא, הנה ההפתעה! מקווה ממש שאתה נהנה לראות את האנימציה ובכלל נהנה מהשיר!! אני חושבת שהשיר חמוד, ומקווה שנהנת מאוד מהחתונה אתמול, קיצר בוא נהנה מהשיר"
               song-src="/audio/Y2Mate.is - נונו - ליבינג דה דרים  Nunu - Living The Dream-yeRbmgX9evc-160k-1646207034301.mp3"/>
  </div>
</template>

<script>
import NoaPlayer from "@/components/NoaPlayer";

export default {
  name: 'FeedPage',
  components: {
    NoaPlayer
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.contianer {
  max-width: none;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
