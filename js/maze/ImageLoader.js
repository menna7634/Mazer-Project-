// Image Loader Module
export const images = {
  path: new Image(),
  wall: new Image(),
  door: new Image(),
  key: new Image(),
  gem: new Image(),
  openDoor: new Image(),
  trap: new Image(),
};

// Set image sources
//assets/images/tiles/door-locked.png
//assets/images/traps/trap_scarab.png
images.path.src = "../../assets/images/gameplay/playground/floor.png";
images.wall.src = "../../assets/images/gameplay/playground/wall-1.png";
images.door.src = "../../assets/images/tiles/door-locked.png";
images.openDoor.src = "../../assets/images/tiles/door-open.png";
images.key.src =
  "../../assets/images/gameplay/components/moving_key-removebg-preview.png";
images.gem.src = "../../assets/images/gameplay/components/favicon.png";
images.trap.src = "../../assets/images/traps/trap_scarab.png";
// Helper function to load a single image
async function loadImage(image) {
  if (image.complete) {
    return; // Already loaded
  }
  // Wait for the image to load
  await new Promise((resolve) => {
    image.onload = resolve;
  });
}

// Load all images in parallel using async/await
export async function loadAllImages() {
  await Promise.all([
    loadImage(images.path),
    loadImage(images.wall),
    loadImage(images.door),
    loadImage(images.key),
    loadImage(images.gem),
    loadImage(images.openDoor),
    loadImage(images.trap),
  ]);
}
