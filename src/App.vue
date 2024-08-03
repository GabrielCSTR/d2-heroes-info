<template>
  <div id="app">
    <router-view :key="$route.path"></router-view>
    <a class="fixed top-0 right-0" href="https://github.com/GabrielCSTR/d2-heroes-info"><img
        src="@/assets/forkme_right_darkblue.png" alt="Fork on Github">
    </a>
  </div>
</template>

<style></style>
