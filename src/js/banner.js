 //banner轮播图
 let banner_images = ['']
 let curr_banner_idx = 0;
 const banner = document.querySelector(".banner img");
 setInterval(function () {
     curr_banner_idx++;
     if (curr_banner_idx >= banner_images.length)
         curr_banner_idx = 0;
     banner.src = banner_images[curr_banner_idx];
 },3000);