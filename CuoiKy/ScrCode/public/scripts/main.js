
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
    panel_div.id = "status_" + obj.status_id

    if (obj.isDelete) {
        panel_div.innerHTML += '<button class="btn btn-danger fa fa-eraser pull-right" aria-hidden="true"></button>'
    }

    if (obj.isEdite){
        panel_div.innerHTML += '<button class="btn btn-info fa fa-pencil pull-right" aria-hidden="true"></button>'
    }

    var p_user_status = document.createElement("p")
    p_user_status.className = 'fb-user-status'
    p_user_status.innerHTML = obj.content

    // add div into panel_div
    panel_div.appendChild(avatar_div)
    panel_div.appendChild(user_details)

    panel_div.innerHTML += '<div class="clearfix"></div>'

    panel_div.appendChild(p_user_status)
    
    if (!obj.isLike){
        var temp_string = 'btn btn-light'
    }
    else {
        var temp_string = 'btn btn-primary'
    }

    panel_div.innerHTML += '<div class="fb-status-container fb-border">'
                        +  '    <div class="fb-time-action">'
                        +  '        <button class="' + temp_string + '"'
                        +  '     id="like_button_' + obj.status_id + '"'
                        +  '     title="Like this" onclick = "likePost(\'' + obj.status_id + '\')">Like</button>'
                        +  '        <span>-</span>'
                        +  '        <a href="#" title="Leave a comment">Comments</a>'
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
    // console.log(post_date)
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

function likePost (status_id) {
    console.log(status_id)
    $.ajax({
        url: "../status/like/" + status_id,
        type: "POST",
        dataType: "html",
        success: (data) =>  {
            let obj = JSON.parse(data)
            change_like_btn(obj)
        },
        error: (xhr, ajaxOptions, thrownError) => {
            console.log(xhr)
        }
    })
}

function change_like_btn (obj) {
    // console.log(obj)
    var id_btn ="like_button_" +  obj.status_id
    // var div = document.getElementById(id_div)
    var btn_like = document.getElementById(id_btn)
    // console.log(id_btn)
    if (obj.isLiked) {
        btn_like.className = 'btn btn-primary'
    }
    else {
        btn_like.className = 'btn btn-light'
    }

}