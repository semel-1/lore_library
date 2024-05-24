searchFrom = document.querySelector('.search-form');
document.querySelector('#search-btn').onclick = () => {
    searchFrom.classList.toggle('active');
}


window.onscroll =() =>{
    searchFrom.classList.remove('active')
    if(window.scrollY>80){
        document.querySelector('.header .header-2').classList.add('active');
    }else{
        document.querySelector('.header .header-2').classList.remove('active');

    }
}





var swiper = new Swiper(".books-slider", {
  spaceBetween:10,
   loop :true,
   centeredSlides :true,
   autoplay:{
    delay:9500,
    disableOnInteraction:false,
    
   },
 
    breakpoints: {
      0:{
        slidesPerView:1,
      },
      768:{
        slidesPerView:2,
      },
      1024:{
        slidesPerView:3,
      }
    },
  });



  
var swiper = new Swiper(".categories-slider", {
  spaceBetween:30,
   loop :true,
   centeredSlides :true,
   autoplay:{
    delay:9500,
    disableOnInteraction:false,
   },
   navigation:{
    nextEl:".swiper-button-next",
    prevEl:".swiper-button-prev",
   },
    breakpoints: {
      0:{
        slidesPerView:1,
      },
      250:{
        slidesPerView:2,
      },
      450:{
        slidesPerView:3,
      },
      768:{
        slidesPerView:4,
      },
      1024:{
        slidesPerView:5,
      }
    },
  });


  

  var contact_bg = document.getElementById("show-info");
  contact_bg.onclick = function (){
    var x = document.querySelector("#contact .contact");

    let tl = anime.timeline({
      duration: 750,
      easing: "easeOutExpo"
    })
    .add({
      targets: contact_bg,
      opacity: 0,
      translateX: ["0px", "1000px"],
      complete: function () {
        contact_bg.style.Display = "none";
      } 
    })
    .add({
      targets: x,
      opacity: 1,
      translateX: ["-1000px", "0px"],
      complete: function() {
        x.style.pointerEvents = "auto";
      }
    })
  }
