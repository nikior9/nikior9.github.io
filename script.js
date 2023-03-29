const IMAGE_TABLE_FILE = 'image_table.txt';
const IMAGE_SIZE = 150;
const IMAGE_INTERVAL = 5000;
const IMAGE_SPEED = 20;
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
function createImage() {
	const { imageUrl, link } = imageTable[Math.floor(Math.random() * imageTable.length)];
	const img = document.createElement('img');
	img.src = imageUrl;
	img.width = IMAGE_SIZE;
	img.height = IMAGE_SIZE;
	img.style.left = `${Math.random() * (window.innerWidth - IMAGE_SIZE)}px`;
	img.style.top = `${Math.random() * (window.innerHeight - IMAGE_SIZE)}px`;
	img.addEventListener('click', () => window.open(link));
	document.body.appendChild(img);
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
				duplicate.addEventListener('click', () => window.open(link));
				duplicate.style.zIndex = -1;
				document.body.appendChild(duplicate);
			}
		}
		lastTime = time;
	}
	const animationId = setInterval(() => requestAnimationFrame(animate), 0);
}
setInterval(createImage, IMAGE_INTERVAL);
