
// var content = document.getElementById("status_content")
// var xhttp = new XMLHttpRequest();
// xhttp.open('POST', '../status', true)
// xhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//       set_post(this);
//     }
// };

$(document).ready(function() {
    $("#btn-post-status").click(function(){
        // alert("button");
        var content = $( "#status_content" ).val()
        $.ajax({
            url: "../status",
            type: "POST",
            data: { content : content },
            dataType: "html",
            success: (data) => {
                let obj = JSON.parse(data)
                // console.log(obj)
                var avatar_div = document.createElement("div")
                avatar_div.className = "fb-user-thumb"
                avatar_div.innerHTML = '<img src="'+ obj.user_image +'"/>'

                // console.log(avatar_div)
                var body = document.getElementById("panel-status")
                console.log(body)
                body.prepend(avatar_div)
                
            },
            error: (xhr, ajaxOptions, thrownError) => {
                console.log(xhr)
            }
        })
    
    }); 
});
