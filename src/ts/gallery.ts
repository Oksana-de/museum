import data from './data.json';

const numberOfPictures: number = data.gallery.length;
const pictureInnerWrapper: HTMLElement | null = document.querySelector('.picture-inner-wrapper');

let picturesArray: number[] = [];

for (let i: number = 0; i < numberOfPictures; i++) {
    picturesArray.push(i);
}

shuffle(picturesArray);

picturesArray.map((picture) => {
    const img: HTMLImageElement  = document.createElement('img');
    img.classList.add('picture-gal');

    img.src = `assets/img/gallery/${data.gallery[picture].src}`;
    img.alt = data.gallery[picture].title;
    
    pictureInnerWrapper?.append(img);
});

// ----------- Animation for appearance each of the Element --------- //
const ioObserver: IntersectionObserver = new IntersectionObserver (entries => {
    entries.map(entry => {
        entry.intersectionRatio > 0 ?
        entry.target.classList.add('appearance') :
        entry.target.classList.remove('appearance');
    })
})

const gallerysPictures: NodeListOf<HTMLImageElement> = document.querySelectorAll('.picture-inner-wrapper .picture-gal');

gallerysPictures.forEach(gallerysImage => ioObserver.observe(gallerysImage));

// -------- Helper Function ------- //

function shuffle(array: number[]) {
    let currentIndex: number = array.length;
    let randomIndex: number;

    for (const index of array) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}
