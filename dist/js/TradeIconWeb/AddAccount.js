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
                $(window).scrollTop($('#Username').position().top);
                $('#Username').focus();
                return false;
            }
    });
    var GetUserId = $('#GetUserId').text();
    if (GetUserId == 0) {
        var UserNameTb = $('#Username');
        UserNameTb.removeAttr('readonly');
        UserNameTb.attr('onkeyup', "this.value=this.value.replace(/[^A-Za-z0-9 ]/g, '');");
        UserNameTb.attr('maxlength', '8');
        $("#Username").val('.');
        $('#Username').css('color', 'white');
    }
});
function toggle() {
    var state = $('#txtPassword').is(':Password') == false ? true : false;
    if (state) {
        document.getElementById("txtPassword").setAttribute("type", "Password");
    }
    else {
        document.getElementById("txtPassword").setAttribute("type", "text");
    }
}
function toggleConfirm() {
    var state = $('#txtConfirmPassword').is(':Password') == false ? true : false;
    if (state) {
        document.getElementById("txtConfirmPassword").setAttribute("type", "Password");
    }
    else {
        document.getElementById("txtConfirmPassword").setAttribute("type", "text");
    }
}
$("#Username").keyup(function () {

    $('#Username').css('color', 'black');
    var Username = $("#Username").val();
    if (Username.length == 8) {
        var input = { 'EmailOrMobile': Username };
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