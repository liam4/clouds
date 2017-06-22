'use strict'

const CLOUD_DELAY_TIME = 6000
const SPEED = 1.00
const OPACITY = 0.70
const INITIAL_CLOUDS = 10
const CLOUD_IMAGE = 'assets/cloud2.png'

const clouds = []

let width, height
const updateWH = function() {
  width = window.innerWidth
  height = window.innerHeight
}
updateWH()

const initialHeight = height
const initialWidth = width

const cloudImage = document.createElement('img')
cloudImage.src = CLOUD_IMAGE
cloudImage.style.display = 'none'
document.body.appendChild(cloudImage)

const canvas = document.getElementById('target')
canvas.width = width
canvas.height = height

const flippedCloudCanvas = document.createElement('canvas')
cloudImage.addEventListener('load', () => {
  flippedCloudCanvas.width = cloudImage.width
  flippedCloudCanvas.height = cloudImage.height
  const flipCtx = flippedCloudCanvas.getContext('2d')
  flipCtx.translate(cloudImage.width, 0)
  flipCtx.scale(-1, 1)
  flipCtx.drawImage(cloudImage, 0, 0)
})

const addCloud = function() {
  const cloud = {
    x: width,
    y: (Math.random() - 0.5) * height,
    speed: 0.1 + SPEED * Math.random() * 0.5,
    opacity: Math.random() * OPACITY,
    flipped: Math.random() > 0.5
  }
  clouds.push(cloud)
  return cloud
}

for (let i = 0; i < INITIAL_CLOUDS; i++) {
  const cloud = addCloud()
  cloud.x = (Math.random() - 0.5) * width
}

setInterval(function() {
  updateWH()
  for (let cloud of clouds) {
    cloud.x -= cloud.speed
    if (cloud.x < -cloudImage.width) {
      clouds.splice(clouds.indexOf(cloud), 1)
    }
  }
}, 5)

const render = function() {
  const ctx = canvas.getContext('2d')

  canvas.width = width
  canvas.height = height

  // Clear
  ctx.fillStyle = 'red'
  ctx.fillRect(0, 0, width, height)

  // Sky

  // const skyGradient = ctx.createRadialGradient(
  //   initialWidth, initialHeight * 1.8, initialWidth * 1.3,
  //   initialWidth, initialHeight * 1.8, 0)
  // skyGradient.addColorStop(0, '#046')
  // skyGradient.addColorStop(0.7, '#DFD')
  // ctx.fillStyle = skyGradient
  // ctx.fillRect(0, 0, width, height)

  const skyGradient = ctx.createLinearGradient(0, 0, width, height)
  skyGradient.addColorStop(0, '#222222')
  skyGradient.addColorStop(1, '#111111')
  ctx.fillStyle = skyGradient
  ctx.fillRect(0, 0, width, height)

  // Clouds
  for (let cloud of clouds) {
    let image
    ctx.globalAlpha = cloud.opacity
    if (cloud.flipped) {
      image = flippedCloudCanvas
    } else {
      image = cloudImage
    }
    ctx.drawImage(image, cloud.x, cloud.y)
  }
  ctx.globalAlpha = 1

  requestAnimationFrame(render)
}

const laterCloud = function() {
  addCloud()
  setTimeout(laterCloud, Math.random() * CLOUD_DELAY_TIME)
}

render()
laterCloud()
