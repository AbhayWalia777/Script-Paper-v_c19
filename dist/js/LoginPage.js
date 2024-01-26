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
function SendOtp() {
    var mail = $('#ForgotPwd-modal #email').val();

    if (mail != "") {
        var obj = { email: mail };
        $.post("/home/SendForgotPasswordOtp", obj).done(function (response, status) {
            var res = response;
            if (res.message != "") {
                //$("#ForgotPwd-modal #error").text(res.message);
                $("#ForgotPasswordModalErrorMessageDiv").css("display", "none");
                $("#ForgotPasswordModalSuccessMessageDiv").css("display", "block");
                $("#ForgotPasswordModalSuccessMessageDiv").css("margin-top", "12px");
                $("#ForgotPasswordModalSuccessMessage").text(res.message);
                //$("#ForgotPwd-modal #error").text(res.message);
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
        //$("#error").text("Please Enter email");
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
                $('#inf-modal .modal-body').html('<p>Password Updated Successfully</p>');
                $('#ForgotPwd-modal').modal('hide');
                $('#inf-modal').modal('show');
            })
        }
        else {
            $("#ForgotPasswordModalSuccessMessageDiv").css("display", "none");
            $("#ForgotPasswordModalErrorMessageDiv").css("display", "block");
            $("#ForgotPasswordModalErrorMessage").text("Enter Your Password");
            return false;
        }
    }
    else {
        //$("#ForgotPwd-modal #error").text("Otp not matched");
        //$("#ForgotPwd-modal #error").text("Otp not matched");

        $("#ForgotPasswordModalSuccessMessageDiv").css("display", "none");
        $("#ForgotPasswordModalErrorMessageDiv").css("display", "block");
        $("#ForgotPasswordModalErrorMessage").text("Otp Does Not Matched");

        return false;
    }
}
$('.ThemeManagement').on('click', function () {
    var NewEmail = $('#EmailOrUsername').val();
    if (NewEmail != localStorage.getItem('OldEmailForTheme')) {
        localStorage.setItem('IsDark', 'NO');
    }
    localStorage.setItem('OldEmailForTheme', $('#EmailOrUsername').val());
});
function showForgotModal() {
    $("#ForgotPwd-modal input").val('');
    $("#ForgotPwd-modal #otpArea").hide();
    $("#ForgotPwd-modal #pwdarea").hide();
    $('#ForgotPwd-modal #btnotp').show();
    $('#ForgotPwd-modal #cnfrmBtn').hide();
    $("#ForgotPwd-modal").modal('show');
}


// Function to save credentials to localStorage
function saveCredentials() {
    var rememberMeCheckbox = document.getElementById("customControlAutosizing");
    var emailInput = document.getElementById("EmailOrUsername");
    var passwordInput = document.getElementById("Password");

    if (rememberMeCheckbox.checked) {
        // If "Remember Me" is checked, save credentials to localStorage
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("emailOrUsername", emailInput.value);
        localStorage.setItem("password", passwordInput.value);
    } else {
        // If not checked, remove credentials from localStorage
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("emailOrUsername");
        localStorage.removeItem("password");
    }
}

// Function to populate form fields from localStorage on page load
function populateFormFields() {
    var rememberMeCheckbox = document.getElementById("customControlAutosizing");
    var emailInput = document.getElementById("EmailOrUsername");
    var passwordInput = document.getElementById("Password");

    var rememberMe = localStorage.getItem("rememberMe");

    if (rememberMe === "true") {
        // If "Remember Me" was checked, populate fields from localStorage
        rememberMeCheckbox.checked = true;
        emailInput.value = localStorage.getItem("emailOrUsername");
        passwordInput.value = localStorage.getItem("password");
    }
}

// Call the populateFormFields function on page load
window.onload = populateFormFields;
