function showActionForm(user_id) {
    $(function(user_id) {
        //$.get("/in/" + user_id);
        location.href="/in/" + user_id;
    });
}

function deleteAction(item_id, in_out) {
    $(function() {
        var user_id = getUserIdFromPath();
        $.get("/setting/delete/" + user_id, {action_id: item_id, in_out: in_out});
        $("#" + item_id).remove();
    });
}

function testAction(action_type, action_contents) {
    var user_id = getUserIdFromPath();
    $(function() {
        $.get("/setting/test/"+ user_id, {type:action_type, contents:action_contents});
    });
}

function getUserIdFromPath() {
        //現在のパスを取得  例 /setting/takatori
        var location_url = location.pathname;
        // パス名からユーザIDを取り出す パスの９文字目から切り出す(/setting/の８文字文削る）
        var user_id = location_url.substr(9);
        return user_id;
}