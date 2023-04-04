const imgSize = 150; // in pixels
    const delay = 1000; // in milliseconds
    const speed = 150; // in pixels per second
    const duplicateLifetime = 2 * 60 * 1000; // in milliseconds

    fetch('images.txt')
      .then(response => response.text())
      .then(text => {
        const entries = text.trim().split('\n');
        const data = entries.map(entry => {
          const [imageUrl, link] = entry.split('::');
          return { imageUrl, link };
        });

        let i = 0;
        const duplicates = new Map();
        function addImage() {
          const { imageUrl, link } = data[i];
          const img = document.createElement('img');
          img.src = imageUrl;
          img.style.position = 'absolute';
          //img.style.width = `${imgSize}px`;
          img.style.height = `${imgSize}px`;
          img.style.left = `${Math.random() * 100}%`;
          img.style.top = `${Math.random() * 100}%`;
          document.body.appendChild(img);

          img.addEventListener('click', () => {
            window.open(link);
          });

          let lastTimestamp = performance.now();
          let y = 0;
          const intervalId = setInterval(() => {
            const timestamp = performance.now();
            const elapsed = timestamp - lastTimestamp;
            y += (speed * elapsed) / 1000;
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
            duplicates.set(duplicate, Date.now());
            lastTimestamp = timestamp;
          }, delay);

          setTimeout(() => {
            img.remove();
            duplicates.forEach((value, key) => {
              if (Date.now() - value >= duplicateLifetime) {
                key.remove();
                duplicates.delete(key);
              }
            });
          }, duplicateLifetime);

          i = (i + 1) % data.length;
          setTimeout(addImage, delay);
        }

        addImage();
      });
