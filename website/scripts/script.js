const buttonRight = document.getElementById('right');
const buttonLeft = document.getElementById('left');

buttonRight.onclick = function () {
  document.getElementById('list').scrollLeft += 340;
};
buttonLeft.onclick = function () {
  document.getElementById('list').scrollLeft -= 340;
};



function show() {
  var list = document.getElementById("navbar_list");
  var blur = document.getElementById("blur");
  var credits = document.getElementById("credits");
  var show = document.getElementById("show");
  var hide = document.getElementById("hide");
  list.style.opacity = 1;
  credits.style.opacity = 1;
  hide.style.display = "block";
  show.style.display = "none";
  blur.style.height = "calc(100vh - 50px)";
  document.getElementById("l2").style.opacity=0;
  document.getElementById("l3").style.transform="rotate(-45deg)";
  document.getElementById("l1").style.transform="rotate(45deg)";
}
function hide() {
  var list = document.getElementById("navbar_list");
  var blur = document.getElementById("blur");
  var credits = document.getElementById("credits");
  var show = document.getElementById("show");
  var hide = document.getElementById("hide");
  list.style.opacity = 0;
  credits.style.opacity = 0;
  hide.style.display = "none";
  show.style.display = "block";
  blur.style.height = "0vh";
  document.getElementById("l2").style.opacity=1;
  document.getElementById("l3").style.transform="rotate(0deg)";
  document.getElementById("l1").style.transform="rotate(0deg)";
}
particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 1000,
      "density": {
        "enable": true,
        "value_area": 789.1476416322727
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.7,
      "random": false,
      "anim": {
        "enable": true,
        "speed": 0.5,
        "opacity_min": 0,
        "sync": false
      }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 0.4,
        "size_min": 0,
        "sync": false
      }
    },
    "line_linked": {
      "enable": false,
      "distance": 150,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 0.1,
      "direction": "none",
      "random": true,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "bubble"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 83.91608391608392,
        "size": 1,
        "duration": 3,
        "opacity": 1,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
});
