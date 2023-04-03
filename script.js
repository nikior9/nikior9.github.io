const imgSize = 100; // in pixels 
const delay = 1000; // in milliseconds
const speed = 100; // in pixels per second
const duplicateTimeout = 2 * 60 * 1000; // in milliseconds

//document.body.style.cursor = *https://raw.githubusercontent.com/nikior9/nikior9.github.io/main/click.png*;

fetch('images_table.txt')
  .then(response => response.text())
  .then(text => {
    const entries = text.trim().split('\n');
    const data = entries.map(entry => {
      const [imageUrl, link] = entry.split('::');
      return { imageUrl, link };
    });

    let i = 0;
    const duplicates = [];
    function addImage() {
      const { imageUrl, link } = data[i];
      const img = document.createElement('img');
      img.src = imageUrl;
      img.style.position = 'absolute';
      img.style.width = `${imgSize}px`;
     // img.style.height = `${imgSize}px`;
      img.style.left = `${Math.random() * 100}%`;
      img.style.top = `${Math.random() * 100}%`;
      document.body.appendChild(img);

      img.addEventListener('click', () => {
        window.open(link);
      });

      let y = 0;
      const intervalId = setInterval(() => {
        y += speed * delay / 1000;
        if (parseFloat(img.style.top) + y + imgSize >= window.innerHeight) {
          clearInterval(intervalId);
          return;
        }
        const duplicate = document.createElement('img');
        duplicate.src = imageUrl;
        duplicate.style.position = 'absolute';
        duplicate.style.width = `${imgSize}px`;
        duplicate.style.height = `${imgSize}px`;
        duplicate.style.left = img.style.left;
        duplicate.style.top = `${parseFloat(img.style.top) + y}px`;
        duplicate.addEventListener('click', () => {
          window.open(link);
        });
        document.body.appendChild(duplicate);
        duplicates.push(duplicate);
      }, delay);

      setTimeout(() => {
        img.remove();
        duplicates.forEach(duplicate => duplicate.remove());
        const index = duplicates.indexOf(img);
        if (index >= 0) {
          duplicates.splice(index, 1);
        }
      }, duplicateTimeout);

      i = (i + 1) % data.length;
      setTimeout(addImage, delay);
    }

    addImage();
  });
