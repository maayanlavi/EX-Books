function getBookData() {    
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('bookId');

    $.ajax({
        url: `http://openlibrary.org/works/${bookId}.json`,
        type: 'GET',
        success: function (res) {
            $('#bookTitle').text(res.title)

            $.ajax({
                url: `http://openlibrary.org${res.authors[0].author.key}.json`,
                type: 'GET',
                success: function (res) {
                    $('#authors').text(res.name)
                }
            })
            $('#bookCover').attr('src',`http://covers.openlibrary.org/b/id/${res.covers[0]}-M.jpg`)
        }
    })

}

function showResults() {
    let name = document.getElementById("try").value;
    $.ajax({
        url: `http://openlibrary.org/search.json?title=${name}`,
        type: 'GET',
        success: function (res) {
            if (res.docs.length > 0)
                window.location.href = `book.html?bookId=${res.docs[0].key.split('/')[2]}`;
            else
                alert("Book not found")
        }
    });
}

function loadAddReviewPage()
{
    
    //we use this function to navigate to the 'addReview.html'
    //page and set the query string to contain the book id
    //this way we can read the querystring in javascript code in the function 'addReview()'
    //and make sure the correct book id is sent to the server
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('bookId');
    window.location.href = `addReview.html?bookId=${bookId}`;
}

function addReview() {
    //build the body for the request
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('bookId');

    let review = {
        book_id: bookId,
        stars: $('#stars').val(),
        text: $('#text').val()
    }
    

    $.ajax({
        url:`http://localhost:3000/api/reviews`,       //change the path to the heroku after upload it.
        type: 'POST',
        data:review,
        success: function (review) {
            console.log(review);
            window.location.href=`/book.html?bookId=${bookId}` //return to bookpage after posting review
        }
    });
}


function addToMyBooks(){
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('bookId');
    let book = { id: bookId }
    console.log(book)
    $.ajax({
        url: `http://localhost:3000/api/users/${window.localStorage.getItem('user_id')}/books`,
        data: book,
        type: 'POST',
        success: function (res) {
            console.log(res)
            alert("Added Successfully!");
        }
    })
}

function getBookReviews() { //maayan
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('bookId');
    let book = { id: bookId }
    let theReviews=document.getElementsByClassName("gradient-list");
    $.ajax({
        url: `http://localhost:3000/api/reviews?book_id=${bookId}`,
        data: book,
        type: 'GET',
        success: function (reviews) {
            const num=review.length();
            for (let i=0; i<num; ++i)
                document.getElementsByClassName("gradient-list").innerHTML +='<li>';
            {
                for (let j=0; j<review.stars; ++j)
                    document.getElementsByClassName("gradient-list").innerHTML += '&#9733 ';
                
                document.getElementsByClassName("gradient-list").innerHTML += '<br>';
                document.getElementsByClassName("gradient-list").innerHTML += reviews[i].text;
                document.getElementsByClassName("gradient-list").innerHTML +='</li>'
            }
        }
    })
}

// function updateReview(){} - note: show "update-review button" only if the user is whom wrote it. Dana

// function AllBooksInSystem(){}  Moriel

 function getUserBooks() { //maayan
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('bookId');
    let books = { id: books }
    $.ajax({
        url: `http://localhost:3000/api/users/${window.localStorage.getItem('user_id')}/books`,
        data: book,
        type: 'GET',
        success: function (books) {
            const num=books.length();
            for (let i=0; i<num; ++i)
            {        
                $('#myBooks').attr('src',`http://covers.openlibrary.org/b/id/${books[i].covers[0]}-M.jpg`)        
                document.getElementById("bookName").innerHTML += books[i].name;
                document.getElementById("options").innerHTML += '<a href="#" class="tm-more-button tm-more-button-welcome">edit review</a>' +
                '<a href="#" class="tm-more-button tm-more-button-welcome">delete review</a>' + 
                '<a href="#" class="tm-more-button tm-more-button-welcome">delete book</a>'; 
            }
        }
    })
 }


//simulate login:
function login() {
    window.localStorage.setItem('user_id', '5fe7601e77765782e215f29d')
}

login();
