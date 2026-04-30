document.addEventListener('DOMContentLoaded', () => {
    // Project Slider Functionality
    document.querySelectorAll('.project-slider').forEach(slider => {
        const slides = slider.querySelectorAll('.project-slide');
        const nextBtn = slider.querySelector('.next-btn');
        const prevBtn = slider.querySelector('.prev-btn');
        const dots = slider.querySelectorAll('.dot');
        let currentSlide = 0;

        function goToSlide(n) {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            currentSlide = (n + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                goToSlide(currentSlide + 1);
            });
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                goToSlide(currentSlide - 1);
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                goToSlide(index);
            });
        });
    });

    // Project Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || filter === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtnLight = document.querySelector('.lightbox-prev');
    const nextBtnLight = document.querySelector('.lightbox-next');

    let currentGallery = [];
    let currentGalleryIndex = 0;

    function openLightbox(imgSrc, captionText, gallery = [], index = 0) {
        lightboxImg.src = imgSrc;
        lightboxCaption.innerText = captionText;
        currentGallery = gallery;
        currentGalleryIndex = index;

        if (currentGallery.length > 1) {
            prevBtnLight.style.display = 'block';
            nextBtnLight.style.display = 'block';
        } else {
            prevBtnLight.style.display = 'none';
            nextBtnLight.style.display = 'none';
        }

        lightbox.classList.add('active');
    }

    document.querySelectorAll('.project-img-wrapper').forEach(wrapper => {
        wrapper.addEventListener('click', function () {
            const img = this.querySelector('img.project-img');
            const projectCard = this.closest('.project-card');
            const title = projectCard.querySelector('h3').innerText;

            if (img) {
                const highresSrc = img.getAttribute('data-highres') || img.src;
                const slider = this.closest('.project-slider');
                let gallery = [];
                let index = 0;

                if (slider) {
                    const allImgs = Array.from(slider.querySelectorAll('img.project-img'));
                    gallery = allImgs.map(i => ({
                        src: i.getAttribute('data-highres') || i.src,
                        caption: title
                    }));
                    index = allImgs.indexOf(img);
                } else {
                    gallery = [{ src: highresSrc, caption: title }];
                }

                openLightbox(highresSrc, title, gallery, index);
            }
        });
    });

    // Lightbox Navigation
    if (prevBtnLight && nextBtnLight) {
        prevBtnLight.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentGallery.length > 0) {
                currentGalleryIndex = (currentGalleryIndex - 1 + currentGallery.length) % currentGallery.length;
                lightboxImg.src = currentGallery[currentGalleryIndex].src;
            }
        });

        nextBtnLight.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentGallery.length > 0) {
                currentGalleryIndex = (currentGalleryIndex + 1) % currentGallery.length;
                lightboxImg.src = currentGallery[currentGalleryIndex].src;
            }
        });
    }

    // Close Lightbox
    if (closeBtn) {
        closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));
    }
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg && e.target !== prevBtnLight && e.target !== nextBtnLight) {
                lightbox.classList.remove('active');
            }
        });
    }
});
