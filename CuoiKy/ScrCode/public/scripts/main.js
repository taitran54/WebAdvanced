
// var content = document.getElementById("status_content")
// var xhttp = new XMLHttpRequest();
// xhttp.open('POST', '../status', true)
// xhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//       set_post(this);
//     }
// };

$(document).ready(function() {
    $("#btn-post").click(function(){
        // alert("button");
        var content = $( "#status_content" ).val()
        var request = $.ajax({
            url: "../status",
            type: "POST",
            data: { content : content },
            dataType: "html"
        })
    }); 
});
