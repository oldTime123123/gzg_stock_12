<script setup lang="ts">

</script>
<template>
    <div class="mask " >
        <div class="loader"></div>
        <div class="loadingText ">
            <!-- {{ loadingText }} ... -->
        </div>
    </div>
</template>


<style lang="less" scoped>
.mask{
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background: rgba(0,0,0,.7);
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    z-index:101;
}
.loadingText{
    margin-top: 10px;
    font-size: 20px;
    font-weight: bold;
    color: #fff;

}
        .loader {
            width: 80px;
            aspect-ratio: 1;
            border-radius: 50%;
            background:
                radial-gradient(farthest-side, var(--mainColor) 94%, #0000) top/8px 8px no-repeat,
                conic-gradient(#0000 30%, var(--mainColor));
            -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 8px), #000 0);
            animation: l13 1s infinite linear;
        }
    
        @keyframes l13 {
            100% {
                transform: rotate(1turn)
            }
        }
</style>