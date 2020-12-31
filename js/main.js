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
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('bookId');

    let review = {
        book_id: bookId,
        stars: $('#stars').val(),
        text: $('#text').val()
    }

    $.ajax({
        url:`https://ex-books.herokuapp.com/api/reviews`, 
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
        url: `https://ex-books.herokuapp.com/api/users/${window.localStorage.getItem('user_id')}/books`,
        data: book,
        type: 'POST',
        success: function (res) {
            console.log(res)
            alert("Added Successfully!");
        }
    })
}

function deleteReview(reviewId){    
    $.ajax({
        url: `https://ex-books.herokuapp.com/api/reviews/${reviewId}`,
        type: 'DELETE',
        success: function (res) {
            alert("Deleted Successfully!");
            window.location.replace('/AllBooks.html');
        }
    })
}

function deleteBook(bookId){  
    $.ajax({
        url: `https://ex-books.herokuapp.com/api/users/${window.localStorage.getItem('user_id')}/books/${bookId}`,
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
        url: `https://ex-books.herokuapp.com/api/reviews?book_id=${bookId}`,
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
                    document.getElementById("reviews").innerHTML += `<button type="button" onclick="getReview('${reviews[i]._id}')";" class="tm-more-button tm-more-button-welcome">edit review</a>` +
                    `<button type="button" onclick="deleteReview('${reviews[i]._id}');" class="tm-more-button tm-more-button-welcome">delete review</button>`;

            }
        }
    })
}

function updateReview(reviewId)
{
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('bookId');

    let review = {
        book_id: bookId,
        stars: $('#stars').val(),
        text: $('#text').val()
    }

    alert("edited");    
    $.ajax({
        url: `https://ex-books.herokuapp.com/api/reviews/${reviewId}`,
        type: 'PUT',
        data:review,
        success: function (review) {
            console.log(",aa");
            console.log("maayan");
            window.location.href=`/book.html?bookId=${bookId}` //return to bookpage after posting review

        }
    })  
}

function getReview(reviewId)
{
    // window.location.href='updateReview.html';
    console.log(reviewId);

    $.ajax({
        url: `https://ex-books.herokuapp.com/api/reviews/${reviewId}`,
        type: 'GET',
        success: function (res) {
            document.getElementById("reviews").innerHTML += `<form action="#" 
            class="tm-contact-form"><div class="col-lg-6 col-md-6"><div 
            class="form-group"><input type="number" id="stars" min="1" max="5" class="form-control" 
            placeholder='${res.stars}' /></div><div class="form-group"><textarea id="text" 
            class="form-control" rows="6" placeholder='${res.text}'></textarea></div>
            <div class="form-group"><button class="tm-more-button" onclick="updateReview('${reviewId}')" 
            type="button" >update</button> </div></div></form>`;


            //updateReview(reviewId);
            //console.log(res);

            //window.location.href='updateReview.html';

            // document.getElementById("stars").innerHTML="maa";
            // $('#stars').text(res.stars)
            // $('#text').text(res.text)

        }
    }) 

}

function AllBooksInSystem() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('bookId');
    let books = { id: bookId }
    $.ajax({
        url: 'https://ex-books.herokuapp.com/api/books',
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
        url: `https://ex-books.herokuapp.com/api/users/${window.localStorage.getItem('user_id')}/books`,
        type: 'GET',
        success: function (books) {
            const num= books.length;
            
            for (let i=0; i<num; ++i)
            {   
                document.getElementById("bookName").innerHTML += `<img src='${books[i].cover}' alt="Popular" >`;
                document.getElementById("bookName").innerHTML += '<br>';
                document.getElementById("bookName").innerHTML += books[i].name;
                document.getElementById("bookName").innerHTML += '<br>';

                document.getElementById("bookName").innerHTML += `<button type="button" onclick="deleteBook('${books[i].id}');" class="tm-more-button tm-more-button-welcome">delete book</button>`; 
            }

        }

    })
 }

 function getUser() { 

    $.ajax({
        url: `https://ex-books.herokuapp.com/api/users/${window.localStorage.getItem('user_id')}`,
        type: 'GET',
        success: function (user) {
            document.getElementById("hiUser").innerHTML += user.first_name;
            document.getElementById("hiUser").innerHTML += " ";
            document.getElementById("hiUser").innerHTML += user.last_name;

        }

    })
 }

//simulate login:
function login() {
    window.localStorage.setItem('user_id', '5fe7601e77765782e215f29d')
}

login();
