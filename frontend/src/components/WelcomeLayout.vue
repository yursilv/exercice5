<template>
  <div id="welcome_layout">
    <div id="overlay">
      <slot></slot>
    </div>
    <video autoplay muted loop id="background_video" src="../assets/background-loop.mp4" poster="../assets/background-loop.jpg">
    </video>
  </div>
</template>

<script>
/*
  Layout containing a background video used for welcome and registration pages
*/
export default {
  name: 'WelcomeLayout',
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #welcome_layout {
    overflow: hidden;
    position: relative;
    height: 100%;
    width: 100%;
  }
  #background_video {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }
  #overlay {
    position: absolute;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
