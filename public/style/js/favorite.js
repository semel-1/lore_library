document.getElementById("heart").onclick = function () {
    const heart = document.getElementById("heart");
    const bookId = heart.getAttribute('data-book-id');

    fetch(`/auth/favorite/${bookId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.favorite) {
                heart.className = 'bi-heart-fill';
            } else {
                heart.className = 'bi-heart';
            }
        })
        .catch(err => console.error(err));
};



document.getElementById("bookmark").onclick = function () {
    const bookmark = document.getElementById("bookmark");
    const bookId = bookmark.getAttribute('data-book-id');

    fetch(`/auth/readLater/${bookId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.readLater) {
                bookmark.className = 'bi-bookmark-fill';
            } else {
                bookmark.className = 'bi-bookmark';
            }
        })
        .catch(err => console.error(err));
};



var show = document.getElementById("show");
show.onclick = function () {
    var x = document.getElementsByClassName("add-comment");
    x[0].style.display = "block"
}

var close = document.getElementById("close");
close.onclick = function () {
    var x = document.getElementsByClassName("add-comment");
    x[0].style.display = "none"
}