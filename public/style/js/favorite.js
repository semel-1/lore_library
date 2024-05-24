var  heart = document.getElementById("heart");
heart.onclick = function(){
    if (heart.classList.contains("bi-heart")){
        heart.className= 'bi-heart-fill';
    }
    else {
        heart.classList = ' bi-heart';
    }

}


var bookmark = document.getElementById("bookmark");
bookmark.onclick= function(){
    if (bookmark.classList.contains("bi-bookmark")){
        bookmark.className = 'bi-bookmark-fill';
    }
    else{
        bookmark.className = 'bi-bookmark';
    }
}



var show = document.getElementById ("show");
show.onclick = function () {
    var x = document.getElementsByClassName ("add-comment");
    x[0].style.display = "block"
}

var close = document.getElementById("close");
close .onclick = function (){
    var x = document.getElementsByClassName("add-comment");
    x[0].style.display = "none"
}
