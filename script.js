// Load the image/link pairs from a text file
const imageLinks = [];
fetch('image_table.txt')
  .then(response => response.text())
  .then(text => {
    const lines = text.split('\n');
    for (const line of lines) {
      const [imageUrl, link] = line.split('::');
      imageLinks.push({ imageUrl, link });
    }
  });

// Create a function to generate a random position for an image
function getRandomPosition() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const x = Math.floor(Math.random() * (screenWidth - 100));
  const y = Math.floor(Math.random() * (screenHeight - 100));
  return { x, y };
}

// Create a function to create a new image element with a given URL and link
function createImageElement(imageUrl, link) {
  const img = document.createElement('img');
  img.src = imageUrl;
  img.style.position = 'absolute';
  const { x, y } = getRandomPosition();
  img.style.left = `${x}px`;
  img.style.top = `${y}px`;
  img.addEventListener('click', () => window.open(link));
  document.body.appendChild(img);
  return img;
}

// Create a function to animate an image down the screen and leave duplicates behind
function animateImage(img) {
  const intervalId = setInterval(() => {
    const { top } = img.getBoundingClientRect();
    if (top + img.height >= window.innerHeight) {
      clearInterval(intervalId);
      img.remove();
      return;
    }
    const duplicate = img.cloneNode();
    document.body.appendChild(duplicate);
    duplicate.addEventListener('click', () => window.open(img.link));
    duplicate.style.top = `${top + 10}px`;
  }, 100);

  return intervalId;
}

// Start animating images with a 1 second interval
let currentImageIndex = 0;
setInterval(() => {
  const { imageUrl, link } = imageLinks[currentImageIndex % imageLinks.length];
  const img = createImageElement(imageUrl, link);
  animateImage(img);
  currentImageIndex++;
}, 1000);
