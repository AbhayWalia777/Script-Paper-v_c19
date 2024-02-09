$(window).on('beforeunload', function () {
    var html = '<div class="Main-Loader">' +
        '<div class="loader-wrapper" style="color: white; font-size: 27px; font-weight: bolder;">' +
        '<div class="loader">' +
        '<div class="loader loader-inner"></div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    $('#Loader-Show').html(html);
});
$(document).ready(function () {
    $('#logoutBtn').on('click', function () {
        var result = confirm("Are you sure you want to Logout?");
        if (result) {
            window.location.href = "/Home/Logout";
        }
    });
    $('#Loader-Show').html("");
});

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
        $(window).on('load', function () {
            var data = localStorage.getItem('IsDark');

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
            var mail = $('#ForgotPwd-modal #Email').val();

            if (mail != "") {
                var obj = { Email: mail };
                $.post("/home/SendForgotPasswordOtp", obj).done(function (response, Status) {
                    var res = response;
                    if (res.Message != "") {
                        $("#ForgotPasswordModalErrorMessageDiv").css("display", "none");
                        $("#ForgotPasswordModalSuccessMessageDiv").css("display", "block");
                        $("#ForgotPasswordModalSuccessMessageDiv").css("margin-top", "12px");
                        $("#ForgotPasswordModalSuccessMessage").text(res.Message);
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
                    var obj = { uid: hduid, Password: pwd };
                    $.post("/home/UpdateForgotPassword", obj).done(function (response, Status) {
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