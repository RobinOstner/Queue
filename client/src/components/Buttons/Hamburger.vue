<template>
  <button ref="button">
    <svg viewBox="0 0 120 120">
      <g>
        <path class="line top" d="M35,35h50c14.1,0,50.6,13,20.5,53.5s-121.9,21.6-94.4-40.3S111.6,8.4,85,35L35,85" />
        <path class="line bottom" d="M35,85h50c14.1,0,50.6-13,20.5-53.5S-16.4,9.9,11.1,71.8S111.6,111.6,85,85L35,35" />
        <line class="line cross" x1="35" y1="60" x2="85" y2="60" />
      </g>
    </svg>
  </button>
</template>

<script>
  export default {
    name: "hamburger",
    methods: {
      toggle: function (){
        this.$refs.button.classList.toggle('on');
      }
    }
  };
</script>

<style lang="scss" scoped>
  button {
    border: none;
    background: transparent;
    outline: none;
    cursor: pointer;
    padding: 0;
  }

  button:hover .line {
    stroke: rgb(196, 196, 196);
  }

  svg {
    display: block;
    width: 100%;
    height: 100%;
    margin: 0;
  }

  .line {
    fill: none;
    stroke: white;
    stroke-width: 6px;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  /* Hamburger */
  .line.top,
  .line.bottom {
    stroke-dasharray: 50px 600px;
    stroke-dashoffset: 0px;
  }

  .line.cross {
    stroke-dasharray: 50px 60px;
    stroke-dashoffset: 0px;
  }

  /* Cross */
  .on .line.top,
  .on .line.bottom {
    stroke-dasharray: 70.71px 600px;
    stroke-dashoffset: -392px;
  }

  .on .line.cross {
    stroke-dasharray: 50px 60px;
    stroke-dashoffset: 51px;
  }

  /* Timing */
  $timing: 0.4s;

  .line.cross {
    transition: $timing stroke-dasharray ease $timing, $timing stroke-dashoffset ease $timing, $timing stroke ease 0s;
  }

  .line.top {
    transition: ($timing * 1.5) stroke-dasharray ease 0s, ($timing * 1.5) stroke-dashoffset ease 0s, $timing stroke ease 0s;
  }

  .line.bottom {
    transition: ($timing * 1.5) stroke-dasharray ease $timing, ($timing * 1.5) stroke-dashoffset ease $timing, $timing stroke ease 0s;
  }

  .on .line.cross {
    transition: $timing stroke-dasharray ease 0s, $timing stroke-dashoffset ease 0s, $timing stroke ease 0s;
  }
</style>
