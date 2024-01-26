$(document).ready(function () {
    // Geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var { latitude, longitude } = position.coords;
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
            var errorMsg = {
                1: "User denied the request for Geolocation.",
                2: "Location information is unavailable.",
                3: "The request to get user location timed out.",
                default: "An unknown error occurred."
            }[error.code] || "An unknown error occurred.";
            $('#User_Location').val(errorMsg);
        });
    } else {
        $('#User_Location').val("Geolocation is not supported by this browser.");
    }

    // Send OTP
    function sendOtp() {
        var mail = $('#ForgotPwd-modal #email').val();
        if (mail) {
            $.post("/home/SendForgotPasswordOtp", { email: mail })
                .done(function (res) {
                    if (res.message) {
                        $("#ForgotPasswordModalErrorMessageDiv").hide();
                        $("#ForgotPasswordModalSuccessMessageDiv").show().css("margin-top", "12px");
                        $("#ForgotPasswordModalSuccessMessage").text(res.message);
                    }
                    if (res.otp) {
                        $('#ForgotPwd-modal #hdotp').val(res.otp);
                        $('#ForgotPwd-modal #hduid').val(res.uid.toString());
                        $('#ForgotPwd-modal #otpArea, #ForgotPwd-modal #pwdarea').show();
                        $('#ForgotPwd-modal #btnotp').hide();
                        $('#ForgotPwd-modal #cnfrmBtn').show();
                    }
                })
                .fail(function (error) {
                    // Handle failure
                });
        } else {
            $("#ForgotPasswordModalErrorMessageDiv").show().css("margin-top", "12px");
            $("#ForgotPasswordModalErrorMessage").text("Please Enter Your Mail Id");
        }
    }

    // Confirm OTP
    function confirmOtp() {
        var otp = $('#ForgotPwd-modal #otp').val();
        var hdotp = $('#ForgotPwd-modal #hdotp').val();
        if (otp == hdotp) {
            var pwd = $('#ForgotPwd-modal #pwd').val();
            var hduid = $('#ForgotPwd-modal #hduid').val();
            if (pwd) {
                $.post("/home/UpdateForgotPassword", { uid: hduid, password: pwd })
                    .done(function () {
                        $('#inf-modal .modal-body').html('<p>Password Updated Successfully</p>');
                        $('#ForgotPwd-modal').modal('hide');
                        $('#inf-modal').modal('show');
                    });
            } else {
                $("#ForgotPasswordModalSuccessMessageDiv").hide();
                $("#ForgotPasswordModalErrorMessageDiv").show();
                $("#ForgotPasswordModalErrorMessage").text("Enter Your Password");
            }
        } else {
            $("#ForgotPasswordModalSuccessMessageDiv").hide();
            $("#ForgotPasswordModalErrorMessageDiv").show();
            $("#ForgotPasswordModalErrorMessage").text("Otp Does Not Matched");
        }
    }

    // Theme Management
    $('.ThemeManagement').on('click', function () {
        var newEmail = $('#EmailOrUsername').val();
        if (newEmail != localStorage.getItem('OldEmailForTheme')) {
            localStorage.setItem('IsDark', 'NO');
        }
        localStorage.setItem('OldEmailForTheme', newEmail);
    });

    // Show Forgot Password Modal
    function showForgotModal() {
        $("#ForgotPwd-modal input").val('');
        $("#ForgotPwd-modal #otpArea, #ForgotPwd-modal #pwdarea").hide();
        $('#ForgotPwd-modal #btnotp').show();
        $('#ForgotPwd-modal #cnfrmBtn').hide();
        $("#ForgotPwd-modal").modal('show');
    }

    // Save Credentials to localStorage
    function saveCredentials() {
        var rememberMeCheckbox = document.getElementById("customControlAutosizing");
        var emailInput = document.getElementById("EmailOrUsername");
        var passwordInput = document.getElementById("Password");

        if (rememberMeCheckbox.checked) {
            localStorage.setItem("rememberMe", "true");
            localStorage.setItem("emailOrUsername", emailInput.value);
            localStorage.setItem("password", passwordInput.value);
        } else {
            localStorage.removeItem("rememberMe");
            localStorage.removeItem("emailOrUsername");
            localStorage.removeItem("password");
        }
    }

    // Populate form fields from localStorage
    function populateFormFields() {
        var rememberMeCheckbox = document.getElementById("customControlAutosizing");
        var emailInput = document.getElementById("EmailOrUsername");
        var passwordInput = document.getElementById("Password");
        var rememberMe = localStorage.getItem("rememberMe");

        if (rememberMe === "true") {
            rememberMeCheckbox.checked = true;
            emailInput.value = localStorage.getItem("emailOrUsername");
            passwordInput.value = localStorage.getItem("password");
        }
    }

    // Event listeners
    $('#RegisterBtn').on('click', function () {
        // Validation logic here if needed
    });

    $("#Sponsorid").on('change', function () {
        // Handling Sponsor ID change
    });

    $("#ForgotPwd-modal #btnotp").on('click', sendOtp);
    $("#ForgotPwd-modal #cnfrmBtn").on('click', confirmOtp);
    $(".showForgotModal").on('click', showForgotModal);
    $("#customControlAutosizing").on('change', saveCredentials);

    // Call the populateFormFields function on page load
    populateFormFields();
});
