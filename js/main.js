// $(function() {
//     getAllBooks();
// })

// function getAllBooks() {
//     $.ajax({
//         url: `http://localhost:3000/api/books`,
//         type: 'GET',
//         success: function (match) {
//             recreateTable(match);
//         }
//     });
// }


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
    //alert(name);
    $.ajax({
        url: `http://openlibrary.org/search.json?title=${name}`,
        type: 'GET',
        //data: user,
        success: function (res) {
            if (res.docs.length > 0)
                window.location.href = `/book.html?bookId=${res.docs[0].key.split('/')[2]}`;
            else
                alert("Book not found")
        }
    });
}