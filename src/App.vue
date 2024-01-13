<template>
  <div class="app">
  <v-app>
    
    <header
      class="header"
    >
      <h3>Поделим счет?</h3>

    </header>

    <router-view/>

  </v-app>
 </div>
</template>

<script setup>

</script>

<style scoped lang="scss">
.header{
  background-color: #CCB19C;
  color: #156F15;
  text-align: center;

  font: {
    size: 30px;
    family: 'Courier New', Courier, monospace;
  }
}

</style>