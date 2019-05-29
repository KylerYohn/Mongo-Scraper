let Id;

$(".starter").on("click", function(event){
     Id = $(this).attr("data-id");
})
$(".addComment").on("click", function(event){
    event.preventDefault();
    console.log($("#name").val());
    console.log($("#comment-text").val())
  
    console.log(Id);
    $.ajax({
        method: "POST",
        url: "/articles/" + Id,
        data: {
            UserName: $("#name").val(),
            comment: $("#comment-text").val()
        }
    }).then(
        $("#name").val(""),
        $("#comment-text").val("")
        
    )

})

$(".delete").on("click", function(){
    let ID = $(this).attr("data-id")
    $.ajax({
        method: "DELETE",
        url: "/deleteComment/" + ID
    }).then(function(){
        console.log("hello")
        window.location.reload();
    })
})

