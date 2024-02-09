$('#RegisterBtn').on('click', function () {
    var EmailError = $('#Email-error').html;
    console.log(EmailError);
    if ($('#Fullname').val() == "") {
        toastr.error('Please enter your Name');
    } else if ($('#Username').val() == "") {
        toastr.error('Please enter your Username');
    } else if ($('#Email').val() == "") {
        toastr.error('Please enter your Email');
    } else if (EmailError=='') {
        toastr.error(EmailError);
    }
    else if ($('#Mobileno').val() == "" || $('#Mobileno').val().length != 10) {
        toastr.error('Please enter your correct mobile number');
    } else if ($('#Password').val() == "") {
        toastr.error('Please enter your Password');
    } else if ($('#ConfirmPassword').val() == "") {
        toastr.error('Please confirm Password');
    } else {
        var UserNameError = $('#GetErrorOnUserName').text();
        if (UserNameError == '') {
            $('#RegisterUserForm').submit();
        }
        else {
            $(window).scrollTop($('#Username').position().top);
            $('#Username').focus();
            return false;
        }
    }
});
$("#Username").keyup(function () {

    $('#Username').css('color', 'black');
    var Username = $("#Username").val();
    if (Username.length == 8) {
        var input = { 'EmailOrMobile': Username };
        $.post("/Home/CheckEmailMobileExists", input).done(function (response, Status) {
            CheckEmailavail(response);
        });
    }
    else {
        if (Username.length != 0) {
            document.getElementById("Username").setCustomValidity('Please use exact 8 Digits !!');
            $("#Username").attr('title', 'Please use exact 8 Digits !!');
            $('#GetErrorOnUserName').html('Please use exact 8 Digits !!');
        }
        else {
            $('#GetErrorOnUserName').html('');
            document.getElementById("Username").setCustomValidity('');
            $("#Username").removeAttr('title');
        }
    }
});
function CheckEmailavail(lstData) {
    if (lstData != null) {
        lstData = JSON.parse(lstData);
        if (lstData == true) {
            document.getElementById("Username").setCustomValidity('User Name Already Exists !!');
            $("#Username").attr('title', 'User Name Already Exists !!');
            $('#GetErrorOnUserName').html('User Name Already Exists !!');
            $(window).scrollTop($('#Username').position().top);
            $('#Username').focus();
        }
        else {
            $('#GetErrorOnUserName').html('');
            document.getElementById("Username").setCustomValidity('');
            $("#Username").removeAttr('title');
        }
    }
}