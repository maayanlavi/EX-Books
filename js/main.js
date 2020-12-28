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



function addReview() {
    //TODO - here we need to pass the user ID & book ID to the server and do "POST" to review with him
    $.ajax({
    //  url:        link from moriel
        type: 'POST',
        success: function (review) {
            createReview(review);
        }
    });
}

function createReview(review) {
    // TODO- Here we need that the review will add to "book" page 
    // and the book will add to "all book" page
}


function addToMyBooks(){
    //TODO-here we need that the book will add to "user (my) book"
    alert("Added Successfully!")
}



