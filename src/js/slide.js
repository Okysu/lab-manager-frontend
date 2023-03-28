function ShowSlides(images) {
    let current_idx = 0;
    // let slide = document.querySelector(".wrapper");
    show_image(images, 0);

    document.querySelector("#arrow-left").addEventListener('click', function () {
        current_idx--;
        if (current_idx < 0) {
            this.style.display = "none";
            current_idx = 0;
        }
        document.querySelector("#arrow-right").style.display = "inline-block";
        show_image(images, current_idx);
    });

    document.querySelector("#arrow-right").addEventListener('click', function () {
        current_idx++;
        if (current_idx >= images.length) {
            this.style.display = "none";
            current_idx = images.length - 1;
        }
        document.querySelector("#arrow-left").style.display = "inline-block";
        show_image(images, current_idx);
    });

    setInterval(function(){
        current_idx++;
        if (current_idx >= images.length) {
            current_idx=0;
        }
        show_image(images, current_idx);
    },10000);
}

function show_image(images, idx) {
    document.querySelector(".wrapper img").src = images[idx].image;
    document.querySelector(".wrapper h3").innerText = images[idx].title;
    document.querySelector(".wrapper .detail").innerText = images[idx].description;
}