const IMAGE_TABLE_FILE = 'image_table.txt'; // path to the text file containing image URLs and links
const IMAGE_SIZE = 100; // width and height of images in pixels
const IMAGE_INTERVAL = 1000; // time interval between image appearances in milliseconds
const IMAGE_SPEED = 10; // speed at which images move down in pixels per second
// load the image table from the text file
const imageTable = [];
fetch(IMAGE_TABLE_FILE)
	.then(response => response.text())
	.then(text => {
		const lines = text.trim().split('\n');
		lines.forEach(line => {
			const [imageUrl, link] = line.split('::');
			imageTable.push({ imageUrl, link });
		});
	});
// create a new image element with a random position and link, and start its animation
function createImage() {
	// choose a random image URL and link from the table
	const { imageUrl, link } = imageTable[Math.floor(Math.random() * imageTable.length)];
	// create the image element and set its attributes
	const img = document.createElement('img');
	img.src = imageUrl;
	img.width = IMAGE_SIZE;
	img.height = IMAGE_SIZE;
	img.style.left = `${Math.random() * (window.innerWidth - IMAGE_SIZE)}px`;
	img.style.top = '-100px';
	// add a click event listener to open the link in a new window
	img.addEventListener('click', () => window.open(link));
	// append the image element to the document body
	document.body.appendChild(img);
	// start the animation
	let lastTime = null;
	function animate(time) {
		if (lastTime !== null) {
			const deltaTime = (time - lastTime) / 1000;
			img.style.top = `${parseFloat(img.style.top) + IMAGE_SPEED * deltaTime}px`;
			if (parseFloat(img.style.top) > window.innerHeight) {
				clearInterval(animationId);
				document.body.removeChild(img);
			} else if (parseFloat(img.style.top) % 10 === 0) {
				const duplicate = img.cloneNode();
				duplicate.style.opacity = 0.5;
				document.body.appendChild(duplicate);
			}
		}
		lastTime = time;
	}
	const animationId = setInterval(() => requestAnimationFrame(animate), 0);
}
// start creating images at the specified interval
setInterval(createImage, IMAGE_INTERVAL);
