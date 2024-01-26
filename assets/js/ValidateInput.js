$(document).ready(function () {
    $("form").submit(function (event) {
        // Remove any existing error styling
        $(".error-field").removeClass("error-field");

        // Check for empty required fields
        var emptyFields = $("input[required]").filter(function () {
            return !$(this).val();
        });

        if (emptyFields.length > 0) {
            // Add error styling to empty required fields
            emptyFields.addClass("error-field");

            // Focus on the first empty required field
            emptyFields.first().focus();

            // Prevent form submission
            event.preventDefault();
        }
    });
});