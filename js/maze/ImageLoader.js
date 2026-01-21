// Image Loader Module
export const images = {
    path: new Image(),
    wall: new Image(),
    door: new Image()
};

// Set image sources
images.path.src = "../../assets/images/game play /playground/floor.png";
images.wall.src = "../../assets/images/game play /playground/wall-1.png";
images.door.src = "../../assets/images/game play /playground/door.png";

// Returns a Promise that resolves when all images are loaded
export function loadAllImages() {
    return Promise.all([
        new Promise(resolve => {
            if (images.path.complete) {
                resolve();
            } else {
                images.path.onload = resolve;
            }
        }),
        new Promise(resolve => {
            if (images.wall.complete) {
                resolve();
            } else {
                images.wall.onload = resolve;
            }
        }),
        new Promise(resolve => {
            if (images.door.complete) {
                resolve();
            } else {
                images.door.onload = resolve;
            }
        })
    ]);
}
