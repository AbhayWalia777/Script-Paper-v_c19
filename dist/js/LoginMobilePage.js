        $("#switch").click(function () {
                var data = localStorage.getItem('IsDark');
                if (data == null || data == '') {
                    localStorage.setItem('IsDark', 'YES')
                }
                else if (data == 'NO') {
                    localStorage.setItem('IsDark', 'YES');
                    $('body').addClass('bodyDark');
                    $('body').removeClass('bodyLight');
                    $("#switch").prop('checked', true);
                }
                else if (data == 'YES') {
                    localStorage.setItem('IsDark', 'NO');
                    $('body').addClass('bodyLight');
                    $('body').removeClass('bodyDark');
                    $("#switch").prop('checked', false);
                }

        });
        $(window).on('load',function () {
            var data = localStorage.getItem('IsDark');
            if (screen.width < 768) {

                if (data == 'NO') {
                    $('body').addClass('bodyLight');
                    $('body').removeClass('bodyDark');
                    $("#switch").prop('checked', false);
                }
                else {
                    $('body').addClass('bodyDark');
                    $('body').removeClass('bodyLight');
                    $("#switch").prop('checked', true);
                }
            }

        });

        function showForgotModal() {
            $("#ForgotPwd-modal input").val('');
            $("#ForgotPwd-modal #otpArea").hide();
            $("#ForgotPwd-modal #pwdarea").hide();
            $('#ForgotPwd-modal #btnotp').show();
            $('#ForgotPwd-modal #cnfrmBtn').hide();
            $("#ForgotPwd-modal").modal('show');
        }
        function SendOtp() {
            var mail = $('#ForgotPwd-modal #email').val();

            if (mail != "") {
                var obj = { email: mail };
                $.post("/home/SendForgotPasswordOtp", obj).done(function (response, status) {
                    var res = response;
                    if (res.message != "") {
                        $("#ForgotPasswordModalErrorMessageDiv").css("display", "none");
                        $("#ForgotPasswordModalSuccessMessageDiv").css("display", "block");
                        $("#ForgotPasswordModalSuccessMessageDiv").css("margin-top", "12px");
                        $("#ForgotPasswordModalSuccessMessage").text(res.message);
                    }
                    if (res.otp != null & res.otp != "") {
                        $("#ForgotPwd-modal #hdotp").val(res.otp);
                        $("#ForgotPwd-modal #hduid").val(res.uid.toString());
                        $("#ForgotPwd-modal #otpArea").show();
                        $("#ForgotPwd-modal #pwdarea").show();
                        $('#ForgotPwd-modal #btnotp').hide();
                        $('#ForgotPwd-modal #cnfrmBtn').show();
                    }
                })
                    .fail(function (error) {

                    })

            }
            else {
                $("#ForgotPasswordModalErrorMessageDiv").css("display", "block");
                $("#ForgotPasswordModalErrorMessageDiv").css("margin-top", "12px");
                $("#ForgotPasswordModalErrorMessage").text("Please Enter Your Mail Id");
            }
        }
        function confirmOtp() {
            var otp = $('#ForgotPwd-modal #otp').val();
            var hdotp = $('#ForgotPwd-modal #hdotp').val();
            if (otp == hdotp) {
                var pwd = $('#ForgotPwd-modal #pwd').val();
                var hduid = $('#ForgotPwd-modal #hduid').val();
                if (pwd != null && pwd != '') {
                    var obj = { uid: hduid, password: pwd };
                    $.post("/home/UpdateForgotPassword", obj).done(function (response, status) {
                        var res = response;
                        $('#ForgotPwd-modal').modal('hide');
                        toastr.success("Password Updated Successfully");
                    });
                }
                else {
                    $("#ForgotPasswordModalSuccessMessageDiv").css("display", "none");
                    $("#ForgotPasswordModalErrorMessageDiv").css("display", "block");
                    $("#ForgotPasswordModalErrorMessage").text("Enter Your Password");
                    return false;
                }
            }
            else {

                $("#ForgotPasswordModalSuccessMessageDiv").css("display", "none");
                $("#ForgotPasswordModalErrorMessageDiv").css("display", "block");
                $("#ForgotPasswordModalErrorMessage").text("Otp Does Not Matched");
                return false;
            }
}
$(document).ready(function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            $.ajax({
                url: `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
                type: "GET",
                success: function (data) {
                    $('#User_Location').val(data.display_name);
                },
                error: function (error) {
                    $('#User_Location').val(error);
                }
            });
        }, function (error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    $('#User_Location').val("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    $('#User_Location').val("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    $('#User_Location').val("The request to get user location timed out.");
                    break;
                default:
                    $('#User_Location').val("An unknown error occurred.");
                    break;
            }
        });
    } else {
        $('#User_Location').val("Geolocation is not supported by this browser.");
    }

});