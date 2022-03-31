<template>
  <div>
    <NoaRecored></NoaRecored>
  </div>
</template>

<script>

import NoaRecored from "@/components/NoaRecored";

export default {
  name: "RecoredPage",
  components: {NoaRecored}
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
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