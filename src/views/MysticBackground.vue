<template>
  <div class="mystic-bg-wrapper">
    <div class="fixed-full bg-dark">
      <div class="geometric-bg absolute-full"></div>
      <div class="mystic-overlay absolute-full"></div>
      <div class="mystic-symbol">
        <svg viewBox="0 0 100 100" class="full-width full-height">
          <circle cx="50" cy="50" fill="none" r="45" stroke="rgba(108,92,231,0.3)" stroke-width="0.5"></circle>
          <circle cx="50" cy="50" fill="none" r="30" stroke="rgba(108,92,231,0.3)" stroke-width="0.5"></circle>
          <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" stroke="rgba(108,92,231,0.3)" stroke-width="0.3"></path>
          <polygon fill="none" points="50,5 95,50 50,95 5,50" stroke="rgba(108,92,231,0.3)" stroke-width="0.3"></polygon>
        </svg>
      </div>
    </div>
    <div class="floating-circle floating-circle-1"></div>
    <div class="floating-circle floating-circle-2"></div>
  </div>
</template>

<style scoped lang="sass">
.fixed-full
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: -2

.geometric-bg
  background: radial-gradient(circle at 20% 50%, rgba(108, 92, 231, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(162, 155, 254, 0.1) 0%, transparent 50%)

.mystic-overlay
  background: linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(26, 26, 60, 0.95) 50%, rgba(15, 15, 35, 0.95) 100%)

.mystic-symbol
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  width: 700px
  height: 700px
  opacity: 0.06
  animation: spinSlow 60s linear infinite

.floating-circle
  position: fixed
  border-radius: 50%
  background: radial-gradient(circle at 30% 30%, rgba(108, 92, 231, 0.25), transparent 70%)
  filter: blur(50px)
  z-index: -1

.floating-circle-1
  width: 400px
  height: 400px
  top: -150px
  right: -100px
  animation: float 20s ease-in-out infinite

.floating-circle-2
  width: 300px
  height: 300px
  bottom: -100px
  left: -80px
  animation: float 25s ease-in-out infinite reverse

@keyframes float
  0%, 100%
    transform: translate(0, 0)
  25%
    transform: translate(30px, -30px)
  50%
    transform: translate(-20px, 20px)
  75%
    transform: translate(-30px, -20px)

@keyframes spinSlow
  from
    transform: translate(-50%, -50%) rotate(0deg)
  to
    transform: translate(-50%, -50%) rotate(360deg)
</style>
