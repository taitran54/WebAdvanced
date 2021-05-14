
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
                if (obj.success){
                    let body = render_post(obj)
                    // console.log(data)

                    var content = document.getElementById("page-content")
                    // console.log (content)
                    // content.prepend(body)

                    var temp = document.getElementById("post-status")
                    // console.log (temp)
                    content.insertBefore(body, temp.nextSibling)
                } else {
                    alert('Fail')
                }
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
        panel_div.innerHTML += '<button class="btn btn-danger fa fa-eraser pull-right" aria-hidden="true" onclick="deletePos(\'' + obj.status_id + '\')></button>'
    }

    if (obj.isEdit){
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
    
    var like_div = document.createElement("div")
    like_div.className = 'fb-time-action like-info'
    if (obj.isLike) {
        like_div.innerHTML +=  '<a href="../status" class="cmt-thumb">Bạn</a>' + '<span>và</span>'
    }

    like_div.innerHTML += obj.number_like + ' người đã thích'
    // So nguoi like status (return later)
    // like_div.innerHTML += 
    
    var status_container = document.createElement("div")
    status_container.className = 'fb-status-container fb-border fb-gray-bg'
    status_container.appendChild(like_div)

    var nodeChild = create_ul_cmt([], obj.status_id, obj.user_id, obj.user_image)
    status_container.appendChild(nodeChild)

    panel_div.appendChild(status_container)

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
    if (seconds < 60) return seconds + " seconds";
    else if (minutes < 60) return minutes + " minutes";
    else if (hours < 24) return hours + " hours";
    else return days + " days"
}

function likePost (status_id) {
    // console.log(status_id)
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
    var id_post = 'status_' + obj.status_id
    var post_div = document.getElementById(id_post)
    like_div = post_div.getElementsByClassName("fb-time-action like-info")[0]
    // console.log(like_div)

    if (obj.isLiked) {
        btn_like.className = 'btn btn-primary'
        like_div.innerHTML = '<a href="../status" class="cmt-thumb">Bạn</a>' + '<span>và</span>' + like_div.innerHTML
    }
    else {
        btn_like.className = 'btn btn-light'
        like_div.removeChild(like_div.childNodes[0])
        like_div.removeChild(like_div.childNodes[0])
    }

}

function create_ul_cmt (array_obj_cmt, status_id, user_id, user_avatar){
    //Render ul incluce cmmt
    //  array_obj_cmt have all cmt object in array
    //  status_id
    //  user_id
    //  user_avatar
    var result_ul = document.createElement('ul')
    result_ul.className = "fb-comments"

    var i
    for (i = 0; i < array_obj_cmt.length; ++i){
        var nodeChild = render_cmt(array_obj_cmt[i])
        result_ul.appendChild(nodeChild)
    }

    var nodeChild = render_cmt_input(status_id, user_id, user_avatar)
    result_ul.appendChild(nodeChild)

    return result_ul
}

function render_cmt (obj){
    //function return li of one cmt
    // require in comment obj
    //      comment_user_name
    //      comment_content
    //      comment_id
    //      isDelete (bool)
    //      commet_user_image
    //      date_comment
  
    var cmt_div = document.createElement("div")
    cmt_div.className = "cmt-details"
    cmt_div.innerHTML += '<a href="#">' + obj.comment_user_name + '</a>'

    cmt_div.innerHTML += '<span> ' + obj.comment_content + '</span>'
    cmt_div.innerHTML += '<p>' + get_text_from_date(obj.date_comment) + '</p>'


    var cmt_avatar = document.createElement('a')
    cmt_avatar.className = 'cmt-thumb'
    cmt_avatar.href = '../status/' + obj.comment_user_id
    cmt_avatar.innerHTML = '<img src="' + obj.commet_user_image +'" alt="">'

    var li_cmt = document.createElement("li")
    li_cmt.appendChild(cmt_avatar)
    li_cmt.appendChild(cmt_div)

    return li_cmt
}

function render_cmt_input(status_id, current_user_id, current_user_image){
    // This function render an input comment
    //      require:
    //          current_user_id is id of user which is logging
    //          current_user_image is avatar of user  which is logging
    //          status_id
    var cmt_avatar = document.createElement('a')
    cmt_avatar.className = 'cmt-thumb'
    cmt_avatar.href = '../status/' + current_user_id
    cmt_avatar.method = 'GET'
    cmt_avatar.innerHTML = '<img src="' + current_user_image + '" alt="">'


    var cmt_form = document.createElement('div')
    cmt_form.className = 'cmt-form'

    cmt_form.innerHTML = '<textarea type="text" class="form-control" placeholder="Write a comment..." onkeypress="commentStatus(event,'
                        + '\'' + status_id + '\','
                        + '\'' + current_user_id + '\''
                        +')" name=""></textarea>'
    
    var li_cmt = document.createElement("li")
    li_cmt.appendChild(cmt_avatar)
    li_cmt.appendChild(cmt_form)

    return li_cmt
}

function commentStatus(e, status_id, user_id){
    var key = e.keyCode;
    // console.log(key)
    // If the user has pressed enter
    if (key == 13) {
        var id_div = 'status_' + status_id
        var panel_post = document.getElementById(id_div)
        var textarea_content = panel_post.getElementsByTagName('textarea')[0]
        
        $.ajax({
            url: '../status/comment/' + status_id,
            type: 'POST',
            data: { cmt_content : textarea_content.value },
            dataType: 'html',
            success: (data) => {
                // console.log(data)
                textarea_content.value = ''

                let obj_comment = JSON.parse(data)

                if (obj_comment.success){
                    var cmt_li = render_cmt(obj_comment)
                    var ul_cmt = panel_post.getElementsByTagName('ul')[0]
                    ul_cmt.insertBefore(cmt_li, ul_cmt.lastChild)
                }
                else {
                    alert('Fail')
                }
            },
            error: (xhr, ajaxOptions, thrownError) => {
                alert ('Sorry, There is some error')
            }
        })
    }
}

function test(e, b, c){
    console.log(e)
    var key = e.keyCode;
    console.log(key)
    // If the user has pressed enter
    if (key == 13) {
        alert("Hello")
    }
}

// var cmt = JSON.parse('{ "comment_user_name" : "Tai", "comment_content": "Toi la Tai", "date_comment": "2021-05-12T07:00:40.253Z" , "comment_user_id" : "123", "isLike": true }')
// console.log("TEST COMMENT: ",render_cmt(cmt) )