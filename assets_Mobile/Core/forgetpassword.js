function SendOtp() {
    var mail = $('#email').val();

    if (mail != "") {
        var obj = { email: mail };
        $.post("/home/SendForgotPasswordOtp", obj).done(function (response, status) {
            var res = response;
            if (res.message != "") {
                SuccessAlert(res.message);
            }
            if (res.otp != null & res.otp != "") {
                $("#hdotp").val(res.otp);
                $("#hduid").val(res.uid.toString());
                $("#otpArea").show();
                $("#pwdarea").show();
                $('#btnotp').hide();
                $('#cnfrmBtn').show();
            }
        })
            .fail(function (error) {

            })

    }
    else {
        ErrorAlert("Please Enter Your Mail Id");
    }
}
function confirmOtp() {
    var otp = $('#otp').val();
    var hdotp = $('#hdotp').val();
    if (otp == hdotp) {
        var pwd = $('#pwd').val();
        var hduid = $('#hduid').val();
        if (pwd != null && pwd != '') {
            var obj = { uid: hduid, password: pwd };
            $.post("/home/UpdateForgotPassword", obj).done(function (response, status) {
                var res = response;
                SuccessAlert("Password Updated Successfully");
                setTimeout(_Redirect, 2000);
            });
        }
        else {
            ErrorAlert("Enter Your Password");
            return false;
        }
    }
    else {
        ErrorAlert("Otp Does Not Matched");
        return false;
    }
}
// Function to be executed after 3 seconds
function _Redirect() {
    window.location.href = '/Home/Login';
}