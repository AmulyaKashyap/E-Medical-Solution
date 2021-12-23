$(document).ready(function(){
    $('.modal').modal();
    $('.parallax').parallax();
    $('.carousel').carousel();
    $('.sidenav').sidenav();
    $(".dropdown-trigger").dropdown({ hover: false });
    $('.parallax').parallax();
    $(".slider").slider();
    $('.fixed-action-btn').floatingActionButton();
    $('.scrollspy').scrollSpy();
    $('.sidenav').sidenav();
    $('.datepicker').datepicker();
    $('.tabs').tabs();
    $('.tooltipped').tooltip();
    $('select').formSelect();
    $(".doctors").carousel({
        numVisible: 6,
        shift : 55,
        padding :20,
    });
    /*$('.carousel .carousel-slider').carousel({
        fullWidth: true,
        indicators: true,
        height : 800,
        interval: 100,
      });*/
    $('.count').counterUp({
        delay: 30,
        time: 1000
      });
      //get button
    mybtn = document.getElementById("goto-top") ;
    
    //When user scroll 20px from top then show the btn
    window.onscroll = function(){scrollFunction()};
    
    function scrollFunction(){
      if(document.body.scrollTop > 20 || document.documentElement.scrollTop > 20){
        mybtn.style.display= "block" ;
      }
      else{
        mybtn.style.display = "none";
      }
    }
});

function toggle(e){
    e.preventDefault(); // The flicker is a codepen thing
    $(this).toggleClass('toggle-on');
  };

function toggleModal(){
    var instance =M.Modal.getInstance($("#modal3"));
    instance.open();
}


function toggleModal_signup(){
    var instance =M.Modal.getInstance($("#modalSign"));
    instance.open();
}
function toggleModal_login(){
    var instance =M.Modal.getInstance($("#loginF"));
    instance.open();
}

function toggleModal_doctor(){
    var instance =M.Modal.getInstance($("#asdoc"));
    instance.open();
}

function toggleModal_patient(){
    var instance =M.Modal.getInstance($("#asuser"));
    instance.open();
}

function toggleModal_confirm(){
    var instance =M.Modal.getInstance($("#confirm"));
    instance.open();
}


const loginText = document.querySelector(".title-text .loginP");
const loginForm = document.querySelector("form.loginP");
const loginBtn = document.querySelector("label.loginP");
const signupBtn = document.querySelector("label.loginD");
const signupLink = document.querySelector("form .loginD-link a");
signupBtn.onclick = (()=>{
  loginForm.style.marginLeft = "-50%";
  loginText.style.marginLeft = "-50%";
});
loginBtn.onclick = (()=>{
  loginForm.style.marginLeft = "0%";
  loginText.style.marginLeft = "0%";
});
signupLink.onclick = (()=>{
  signupBtn.click();
  return false;
});
