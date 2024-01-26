$('#RegisterBtn').on('click', function () {
    var EmailError = $('#Email-error').html;
    console.log(EmailError);
    if ($('#FullName').val() == "") {
        toastr.error('Please enter your name');
    } else if ($('#UserName').val() == "") {
        toastr.error('Please enter your username');
    } else if ($('#Email').val() == "") {
        toastr.error('Please enter your email');
    } else if (EmailError=='') {
        toastr.error(EmailError);
    }
    else if ($('#MobileNo').val() == "" || $('#MobileNo').val().length != 10) {
        toastr.error('Please enter your correct mobile number');
    } else if ($('#Password').val() == "") {
        toastr.error('Please enter your password');
    } else if ($('#ConfirmPassword').val() == "") {
        toastr.error('Please confirm password');
    } else {
        var UserNameError = $('#GetErrorOnUserName').text();
        if (UserNameError == '') {
            $('#RegisterUserForm').submit();
        }
        else {
            $(window).scrollTop($('#UserName').position().top);
            $('#UserName').focus();
            return false;
        }
    }
});
$("#UserName").keyup(function () {

    $('#UserName').css('color', 'black');
    var UserName = $("#UserName").val();
    if (UserName.length == 8) {
        var input = { 'EmailOrMobile': UserName };
        $.post("/Home/CheckEmailMobileExists", input).done(function (response, status) {
            CheckEmailavail(response);
        });
    }
    else {
        if (UserName.length != 0) {
            document.getElementById("UserName").setCustomValidity('Please use exact 8 Digits !!');
            $("#UserName").attr('title', 'Please use exact 8 Digits !!');
            $('#GetErrorOnUserName').html('Please use exact 8 Digits !!');
        }
        else {
            $('#GetErrorOnUserName').html('');
            document.getElementById("UserName").setCustomValidity('');
            $("#UserName").removeAttr('title');
        }
    }
});
function CheckEmailavail(lstData) {
    if (lstData != null) {
        lstData = JSON.parse(lstData);
        if (lstData == true) {
            document.getElementById("UserName").setCustomValidity('User Name Already Exists !!');
            $("#UserName").attr('title', 'User Name Already Exists !!');
            $('#GetErrorOnUserName').html('User Name Already Exists !!');
            $(window).scrollTop($('#UserName').position().top);
            $('#UserName').focus();
        }
        else {
            $('#GetErrorOnUserName').html('');
            document.getElementById("UserName").setCustomValidity('');
            $("#UserName").removeAttr('title');
        }
    }
}