const imgSize = 100; // in pixels
const delay = 1000; // in milliseconds
const speed = 20; // in pixels per second

fetch('images_table.txt')
  .then(response => response.text())
  .then(text => {
    const entries = text.trim().split('\n');
    const data = entries.map(entry => {
      const [imageUrl, link] = entry.split('::');
      return { imageUrl, link };
    });

    let i = 0;
    function addImage() {
      if (i >= data.length) {
        return;
      }

      const { imageUrl, link } = data[i];
      const img = document.createElement('img');
      img.src = imageUrl;
      img.style.position = 'absolute';
      img.style.width = `${imgSize}px`;
      img.style.height = `${imgSize}px`;
      img.style.left = `${Math.random() * 100}%`;
      img.style.top = `${Math.random() * 100}%`;
      document.body.appendChild(img);

      img.addEventListener('click', () => {
        window.open(link);
      });

      let y = 0;
      setInterval(() => {
        y += speed * delay / 1000;
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
        if (y >= window.innerHeight) {
          img.remove();
        }
      }, delay);

      i++;
      setTimeout(addImage, delay);
    }

    addImage();
  });
