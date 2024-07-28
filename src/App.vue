<script setup>
import PianoRoll from './components/PianoRoll.vue'
</script>

<template>
  <PianoRoll/>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');
:root {
  font-size: 16px;
  font-family: 'Open Sans', sans-serif;
  --white: white;
  --blue: #232323;
  --orange: #232323;
  --transition-speed: 500ms;
}
body{
  background-color: #2f2f2f;
}
#navbar{
  width: 4rem;
  height: 100vh;
  z-index: 1000;
}
#navbar:hover{
  width: 12rem;
}
#non-navbar{
  margin-left: 4rem;
}
#brand{
  height: 4rem;
}
*{
  font-weight: 300;
  color: white;
}
</style>
