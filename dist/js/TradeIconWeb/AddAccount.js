$(document).ready(function () {
    $('.multiselect').multiselect(
        {
            buttonClass: 'form-control',

        });
    $('.multiselect').addClass('form-control');
    $('button').on('click', function () {
        $('.btn-group').addClass('open');
    });
    $('.nav-link-Layout').on('click', function () { toastr.error('Please save previous changes'); });
    $('#FormSubmitButton').on('click', function () {
            var UserNameError = $('#GetErrorOnUserName').text();
            if (UserNameError == '') {
                $('#ManageUserForm').submit();
            }
            else {
                $(window).scrollTop($('#UserName').position().top);
                $('#UserName').focus();
                return false;
            }
    });
    var GetUserId = $('#GetUserId').text();
    if (GetUserId == 0) {
        var UserNameTb = $('#UserName');
        UserNameTb.removeAttr('readonly');
        UserNameTb.attr('onkeyup', "this.value=this.value.replace(/[^A-Za-z0-9 ]/g, '');");
        UserNameTb.attr('maxlength', '8');
        $("#UserName").val('.');
        $('#UserName').css('color', 'white');
    }
});
function toggle() {
    var state = $('#txtPassword').is(':password') == false ? true : false;
    if (state) {
        document.getElementById("txtPassword").setAttribute("type", "password");
    }
    else {
        document.getElementById("txtPassword").setAttribute("type", "text");
    }
}
function toggleConfirm() {
    var state = $('#txtConfirmPassword').is(':password') == false ? true : false;
    if (state) {
        document.getElementById("txtConfirmPassword").setAttribute("type", "password");
    }
    else {
        document.getElementById("txtConfirmPassword").setAttribute("type", "text");
    }
}
$("#UserName").keyup(function () {

    $('#UserName').css('color', 'black');
    var UserName = $("#UserName").val();
    if (UserName.length == 8) {
        var input = { 'EmailOrMobile': UserName };
        $.ajax({
            type: 'Get',
            contentType: 'application/json',
            data: input,
            datatype: 'json',
            async: false,
            url: '/Admin/CheckEmailMobileExists',
            success: function (response) {
                CheckEmailavail(response);
            },
            error: function (response) {
                console.log(response);
            }
        });
    }
    else {

    }
});

function CheckEmailavail(response) {
    if (response != null) {
        var lstData = JSON.parse(response);
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