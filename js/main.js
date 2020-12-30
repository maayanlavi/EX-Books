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

function deleteReview(reviewId){    //TODO
    $.ajax({
        url: `http://localhost:3000/api/reviews/${reviewId}`,
        type: 'DELETE',
        success: function (res) {
            alert("Deleted Successfully!");
            window.location.replace('/index.html');
        }
    })
}

function deleteBook(bookId){  
    $.ajax({
        url: `http://localhost:3000/api/users/${window.localStorage.getItem('user_id')}/books/${bookId}`,
        type: 'DELETE',
        success: function (res) {
            alert("book deleted!")
            window.location.replace('/myBooks.html');
        }
    })
}

function getBookReviews() { 
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('bookId');

    $.ajax({
        url: `http://localhost:3000/api/reviews?book_id=${bookId}`,
        type: 'GET',
        success: function (reviews) {
            console.log(reviews);
            const num=reviews.length;
            for (let i=0; i<num; ++i) {
                document.getElementById("reviews").innerHTML += '<li>';
                for (let j=0; j<reviews[i].stars; ++j)
                    document.getElementById("reviews").innerHTML += '&#9733 ';
                
                document.getElementById("reviews").innerHTML += '<br>';
                document.getElementById("reviews").innerHTML += reviews[i].text;
                document.getElementById("reviews").innerHTML +='</li>'
                if (reviews[i].user_id ==  window.localStorage.getItem('user_id'))
                    document.getElementById("reviews").innerHTML += '<button type="button" onclick="updateReview();" class="tm-more-button tm-more-button-welcome">edit review</button>' +
                    `<button type="button" onclick="deleteReview('${reviews[i]._id}');" class="tm-more-button tm-more-button-welcome">delete review</button>`;

            }
        }
    })
}

function updateReview()
{
    //build the body for the request
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('bookId');

    let review = {
        book_id: bookId,
        stars: $('#stars').val(),
        text: $('#text').val()
    }

    $.ajax({
        url:`http://localhost:3000/api/reviews?book_id=${bookId}`,       //change the path to the heroku after upload it.
        type: 'PUT',
        data:review,
        success: function (review) {
            console.log(review);
            window.location.href=`/book.html?bookId=${bookId}` //return to bookpage after posting review
        }
    });
}

function AllBooksInSystem() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('bookId');
    let books = { id: bookId }
    $.ajax({
        url: 'http://localhost:3000/api/books',
        type: 'GET',
        success: function (books) {
            const num= books.length;
            for (let i=0; i<num; ++i)
            {   
                document.getElementById("bookName").innerHTML += `<img src='${books[i].cover}' alt="Popular" class="tm-popular-item-img">`;
                document.getElementById("bookName").innerHTML += '<br>';
                document.getElementById("bookName").innerHTML += books[i].name;
                document.getElementById("bookName").innerHTML += '<br>';
                document.getElementById("bookName").innerHTML += `<a href='${books[i].link}' class="tm-more-button tm-more-button-welcome">Book page</a>`;
            }

        }

    })
}

 function getUserBooks() { 
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('bookId');
    let books = { id: bookId }
    $.ajax({
        url: `http://localhost:3000/api/users/${window.localStorage.getItem('user_id')}/books`,
        type: 'GET',
        success: function (books) {
            const num= books.length;
            
            for (let i=0; i<num; ++i)
            {   
                document.getElementById("bookName").innerHTML += `<img src='${books[i].cover}' alt="Popular" class="tm-popular-item-img">`;
                document.getElementById("bookName").innerHTML += '<br>';
                document.getElementById("bookName").innerHTML += books[i].name;
                document.getElementById("bookName").innerHTML += '<br>';

                document.getElementById("bookName").innerHTML += '<button type="button" onclick="updateReview();" class="tm-more-button tm-more-button-welcome">edit review</button>' +
                `<button type="button" onclick="deleteReview('${books[i].id}');" class="tm-more-button tm-more-button-welcome">delete review</button>` + 
                `<button type="button" onclick="deleteBook('${books[i].id}');" class="tm-more-button tm-more-button-welcome">delete book</button>`; 
            }

        }

    })
 }

//simulate login:
function login() {
    window.localStorage.setItem('user_id', '5fe7601e77765782e215f29d')
}

login();
