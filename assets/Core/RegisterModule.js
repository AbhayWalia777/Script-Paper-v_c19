function validateInput(inputElement, regexPattern, errorMessageElement, errorMessage) {
    var inputValue = inputElement.val();
    if (!inputValue.match(regexPattern)) {
        inputElement.val('');
        errorMessageElement.text(errorMessage);
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
                    $("#SponsoridMsg").text("Invalid Sponsor ID");
                }
            })
            .fail(function (error) {
                // Handle failure
            });
    }
}

$(document).ready(function () {
    $('#RegisterBtn').on('click', function () {
        var fullNameValid = validateInput($("#FullNameid"), /^[A-Za-z]+$/, $("#FullNameMsg"), "Please enter valid data");
        var phoneValid = validateInput($("#PhoneNoid"), /^[0-9]+$/, $("#PhoneNoMsg"), "Please enter valid Number");

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
                        $("#SponsoridMsg").text("Success! Sponsor Name: " + res);
                    } else {
                        $("#Sponsorid").val('').focus();
                        $("#SponsoridMsg").text("Invalid Sponsor ID");
                    }
                })
                .fail(function (error) {
                    // Handle failure
                });
        }
    });
});
