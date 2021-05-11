
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
                document.getElementById("status_content").value = ''


                let obj = JSON.parse(data)

                let body = render_post(obj)
                // console.log(obj)

                var content = document.getElementById("page-content")
                // console.log (content)
                // content.prepend(body)

                var temp = document.getElementById("post-status")
                // console.log (temp)
                content.insertBefore(body, temp.nextSibling)
                
            },
            error: (xhr, ajaxOptions, thrownError) => {
                console.log(xhr)
            }
        })
    
    }); 
});

function render_post(obj) {
    // Create div for avatar
    var avatar_div = document.createElement("div")
    avatar_div.className = "fb-user-thumb"
    avatar_div.innerHTML = '<img src="'+ obj.user_image +'"/>'

    // create div for user detail
    var user_details = document.createElement("div")
    user_details.className = "fb-user-details"

    var name_link = document.createElement('a')
    name_link.href = '#'
    name_link.className = '#'
    name_link.innerHTML = obj.user_name
    
    var time_p = document.createElement('p')
    time_p.innerHTML = get_text_from_date(obj.date)

    user_details.appendChild(name_link)
    user_details.appendChild(time_p)

    // create panel - body
    var panel_div = document.createElement("div")
    panel_div.className = "panel-body"

    var p_user_status = document.createElement("p")
    p_user_status.className = 'fb-user-status'
    p_user_status.innerHTML = obj.content

    // add div into panel_div
    panel_div.appendChild(avatar_div)
    panel_div.appendChild(user_details)

    panel_div.innerHTML += '<div class="clearfix"></div>'

    panel_div.appendChild(p_user_status)
    
    panel_div.innerHTML += '<div class="fb-status-container fb-border">'
                        +  '    <div class="fb-time-action">'
                        +  '        <a href="#" title="Like this">Like</a>'
                        +  '        <span>-</span>'
                        +  '        <a href="#" title="Leave a comment">Comments</a>'
                        +  '        <span>-</span>'
                        +  '        <a href="#" title="Send this to friend or post it on your time line">Share</a>'
                        +  '    </div>'
                        +  '</div>'
    

    // console.log(avatar_div)
    var body = document.createElement("div")
    body.className = "panel"
    body.appendChild(panel_div)
    // console.log(body)

    return body
}

function get_text_from_date(date){
    var post_date = new Date(date)
    console.log(post_date)
    var diff = Math.abs(new Date() - post_date)
    // console.log(diff)
    // console.log(msToTime(diff))
    return msToTime(diff) + ' ago'
}
function msToTime(ms) {
    let seconds = (ms / 1000).toFixed(0);
    let minutes = (ms / (1000 * 60)).toFixed(0);
    let hours = (ms / (1000 * 60 * 60)).toFixed(0);
    let days = (ms / (1000 * 60 * 60 * 24)).toFixed(0);
    if (seconds < 60) return seconds + " Seconds";
    else if (minutes < 60) return minutes + " Minutes";
    else if (hours < 24) return hours + " Hours";
    else return days + " Days"
  }