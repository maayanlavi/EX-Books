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


function showResults() {
    var name = document.getElementById("try").value;
    //alert(name);
    $.ajax({
        url: `http://openlibrary.org/search.json?title=${name}`,
        type: 'GET',
        //data: user,
        success: function (name) {
            alert(name);
        }
    });
}