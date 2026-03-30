<template>
  <ClientOnly>
    <div class="mask" >
      <div class="loader"></div>
    </div>
  </ClientOnly>
</template>



<style lang="less" scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: #fff;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  z-index: 101;
}

/* HTML:  */
.loader {
  width: 60px;
  aspect-ratio: 1;
  background:
    linear-gradient(45deg, #60B99A 50%, #0000 0),
    linear-gradient(45deg, #0000 50%, #60B99A 0),
    linear-gradient(-45deg, #f77825 50%, #0000 0),
    linear-gradient(-45deg, #0000 50%, #f77825 0),
    linear-gradient(#554236 0 0);
  background-size: 50% 50%;
  background-repeat: no-repeat;
  animation: l18 1.5s infinite;
}

@keyframes l18 {
  0% {
    background-position: 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%
  }

  25% {
    background-position: 0 100%, 100% 0, 50% 50%, 50% 50%, 50% 50%
  }

  50% {
    background-position: 0 100%, 100% 0, 100% 100%, 0 0, 50% 50%
  }

  75% {
    background-position: 50% 50%, 50% 50%, 100% 100%, 0 0, 50% 50%
  }

  100% {
    background-position: 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%
  }
}
</style>
