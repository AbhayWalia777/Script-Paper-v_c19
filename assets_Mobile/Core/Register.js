function validateInput(inputElement, regexPattern, errorMessageElement, errorMessage) {
    var inputValue = inputElement.val();
    if (!inputValue.match(regexPattern)) {
        inputElement.val('');
        ErrorAlert(errorMessage);
        return false;
    }
    return true;
}

function submitFormIfValid() {
    var sponsorId = $("#Sponsorid").val();
    if (sponsorId == "" || sponsorId == null || sponsorId == undefined) {
        $('#RegisterUserForm').submit();
    } else {
        var obj = { Sponsorid: sponsorId };
        $.post("/home/GetSponserData", obj)
            .done(function (res, status) {
                if (res != "" && res != null) {
                    $('#RegisterUserForm').submit();
                } else {
                    $("#Sponsorid").val('').focus();
                    ErrorAlert("Invalid Sponsor ID");
                }
            })
            .fail(function (error) {
                // Handle failure
            });
    }
}

$(document).ready(function () {
    $('#RegisterBtn').on('click', function () {
        var fullNameValid = validateInput($("#FullNameid"), /^[A-Za-z ]+$/, $("#FullNameMsg"), "Please enter valid Full Name");
        var phoneValid = validateInput($("#PhoneNoid"), /^[0-9]{10,}$/, $("#PhoneNoMsg"), "Please enter valid Number");

        if ($('#Email').val() == "") {
            ErrorAlert('Enter your Email');
            return false;
        }
        if ($('#Password').val() == "") {
            ErrorAlert('Enter your password');
            return false;
        }
        if ($('#ConfirmPassword').val() == "") {
            ErrorAlert('Enter your Confirm Password');
            return false;
        }



        if (fullNameValid && phoneValid) {
            submitFormIfValid();
        }
    });

    $("#Sponsorid").on('change', function () {
        var sponsorId = $("#Sponsorid").val();
        if (sponsorId != "" || sponsorId != null || sponsorId != undefined) {
            var obj = { Sponsorid: sponsorId };
            $.post("/home/GetSponserData", obj)
                .done(function (res, status) {
                    if (res != "" && res != null) {
                        $("#Sponsorid").attr("readonly", true);
                        SuccessAlert("Success! Sponsor Name: " + res);
                    } else {
                        $("#Sponsorid").val('').focus();
                        ErrorAlert("Invalid Sponsor ID");
                    }
                })
                .fail(function (error) {
                    // Handle failure
                });
        }
    });
});