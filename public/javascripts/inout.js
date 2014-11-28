function send(user_id) {
    $(function() {
        $.get("/inout/" + user_id);
    });
}