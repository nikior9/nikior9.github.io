const imgSize = 100; // in pixels
    const delay = 1000; // in milliseconds
    const speed = 200; // in pixels per second
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
          img.style.width = `100%`;
          img.style.height = `${imgSize}px`;
          img.style.left = `${Math.random() * 100}%`;
          img.style.top = `${Math.random() * 100}%`;
          document.body.appendChild(img);

          img.addEventListener('click', () => {
            window.open(link);
          });

          let lastUpdateTime = Date.now();
          let y = 0;
          const updatePosition = () => {
            const currentTime = Date.now();
            const timeElapsed = currentTime - lastUpdateTime;
            const distance = speed * timeElapsed / 1000;
            y += distance;
            img.style.top = `${parseFloat(img.style.top) + distance}px`;
            if (parseFloat(img.style.top) + imgSize >= window.innerHeight) {
              clearInterval(intervalId);
              return;
            }
            duplicates.forEach((value, key) => {
              if (currentTime - value >= duplicateLifetime) {
                key.remove();
                duplicates.delete(key);
              } else {
                const distance = speed * (currentTime - value) / 1000;
                key.style.top = `${parseFloat(key.style.top) + distance}px`;
              }
            });
            lastUpdateTime = currentTime;
          };

          const intervalId = setInterval(updatePosition, 10);

          setTimeout(() => {
            img.remove();
            clearInterval(intervalId);
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
