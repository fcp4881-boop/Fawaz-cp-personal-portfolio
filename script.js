document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Mobile Menu Toggle (Simplified)
    const menuToggle = document.getElementById('menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navList.style.display = navList.style.display === 'flex' ? 'none' : 'flex';
            if (navList.style.display === 'flex') {
                navList.style.flexDirection = 'column';
                navList.style.position = 'absolute';
                navList.style.top = '100%';
                navList.style.left = '0';
                navList.style.width = '100%';
                navList.style.background = '#0d0d0d';
                navList.style.padding = '2rem';
                navList.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
            }
        });
    }

    // Add scroll class to header for styling changes on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(13, 13, 13, 0.95)';
            header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        } else {
            header.style.background = 'rgba(13, 13, 13, 0.8)';
            header.style.boxShadow = 'none';
        }
    });
    // EmailJS Integration
    emailjs.init("zYg2D2WmVG0zH6HaG");

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.disabled = true;

            emailjs.sendForm('service_m7gkp2h', 'template_cf1yrft', this)
                .then(() => {
                    btn.innerText = 'Message Sent!';
                    contactForm.reset();
                    setTimeout(() => {
                        btn.innerText = originalBtnText;
                        btn.disabled = false;
                    }, 3000);
                }, (error) => {
                    console.error('FAILED...', error);
                    btn.innerText = 'Failed to Send';
                    setTimeout(() => {
                        btn.innerText = originalBtnText;
                        btn.disabled = false;
                    }, 3000);
                });
        });
    }

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

        // Show Lightbox
        lightbox.style.display = 'flex';
        // Trigger reflow for animation
        void lightbox.offsetWidth;
        lightbox.classList.add('active');
    }

    // Attach click events to project overlays
    document.querySelectorAll('.project-img-wrapper').forEach(wrapper => {
        wrapper.addEventListener('click', function () {
            const img = this.querySelector('img.project-img');
            const projectCard = this.closest('.project-card') || this.closest('.education-content');

            let title = '';
            if (projectCard.querySelector('.project-content h3')) {
                title = projectCard.querySelector('.project-content h3').innerText;
            } else if (projectCard.querySelector('.education-text h3')) {
                title = projectCard.querySelector('.education-text h3').innerText;
            }

            if (img) {
                const highresSrc = img.getAttribute('data-highres') || img.src;

                // Check if it's part of a slider
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

    // Attach click events to "View Certificate" buttons
    document.querySelectorAll('.view-cert-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const highresSrc = this.getAttribute('data-highres');
            const title = this.getAttribute('data-title');
            if (highresSrc) {
                openLightbox(highresSrc, title, [{ src: highresSrc, caption: title }], 0);
            }
        });
    });

    // Lightbox Navigation Logic
    if (prevBtnLight && nextBtnLight) {
        prevBtnLight.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentGallery.length > 0) {
                currentGalleryIndex = (currentGalleryIndex - 1 + currentGallery.length) % currentGallery.length;
                lightboxImg.src = currentGallery[currentGalleryIndex].src;
                lightboxCaption.innerText = currentGallery[currentGalleryIndex].caption;
            }
        });

        nextBtnLight.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentGallery.length > 0) {
                currentGalleryIndex = (currentGalleryIndex + 1) % currentGallery.length;
                lightboxImg.src = currentGallery[currentGalleryIndex].src;
                lightboxCaption.innerText = currentGallery[currentGalleryIndex].caption;
            }
        });
    }

    // Close lightbox on 'X' click
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            lightbox.classList.remove('active');
            setTimeout(() => {
                lightbox.style.display = 'none';
            }, 300); // Wait for transition
        });
    }

    // Close lightbox on clicking outside image
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) {
                lightbox.classList.remove('active');
                setTimeout(() => {
                    lightbox.style.display = 'none';
                }, 300);
            }
        });
    }
});
