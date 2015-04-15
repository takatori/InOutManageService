$(function(){
    $.ajax({
        type: 'GET',
        url : 'http://localhost:3000/apis/accounts',
        success: function(users) {
            users.forEach(function(user){
                var grayscale = '';
                if (user.status === 'in') {
                    grayscale = '0%';
                } else {
                    grayscale = '100%';
                }
                
                $('#user-thumbnail-wrapper').append(
                    '<div class="col-lg-2"><div id='+ user.id +' class="user">'
                        + '<a href="#"><img class="img-circle" src="'+ user.icon_img + '" width="140" height="140" style="-webkit-filter:grayscale(' + grayscale +');"></a>' +
                        '</div></div>');
            });
        },
        error: function(err) {
            console.log(err);
        }
    });

    $(document).on('click', '.user', function(){
        var id = $(this).attr('id');
        var $self = $(this);
        $.ajax({
            type: 'GET',
            url : 'http://localhost:3000/apis/accounts/' + id + '/inout',
            success: function(status) {
                var grayscale = '';
                if (status === 'in') {
                    grayscale = '0%';
                } else {
                    grayscale = '100%';
                }                
                $self.find('img').attr({style:'-webkit-filter:grayscale(' + grayscale +');'});
            },
            error: function(err) {
                console.log(err);
            }
        });        
    });
});



