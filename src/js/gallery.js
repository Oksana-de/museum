const numberOfPictures = 15;
const pictureInnerWrapper = document.querySelector('.picture-inner-wrapper');

let picturesArray = [];

for (let i = 1; i <= 15; i++) {
    picturesArray.push(i);
}

shuffle(picturesArray);

picturesArray.map((picture, index) => {
    const img = document.createElement('img');
    img.classList.add('picture-gal');

    img.src = `assets/img/gallery/gallery${picture.toString().padStart(2, '0')}.jpg`;
    img.alt = `gallery${picture.toString().padStart(2, '0')}`;

    
    pictureInnerWrapper.append(img);
});

function shuffle(array) {
    let currentIndex = array.length;
    let randomIndex;

    for (const index of array) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}