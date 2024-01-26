function Testservercode() {
    var servercode = $('#serverCode').val();
    /*servercode == "1050" ? $('#SubmitButton').css('display', 'inherit') : $('#SubmitButton').css('display', 'none');*/
    //servercode != "1050" ? $('#SubmitButton2').css('display', 'inherit') : $('#SubmitButton2').css('display', 'none');
}
$('#SubmitButton2').on('click', function () {
    if ($('#serverCode').val() != "1050") {
        toastr.error('Access Denied,Invaild Server Code');
        return false;
    }
    else {
        $('#LoginForm').submit();
    }
});
$('.Terms').on('click', function () {
    $('.content-main').css('display','none');
    $('#buySellModel').css('display', 'inherit');
});
function HidePopUp() {
    $('.content-main').css('display', 'inherit');
    $('#buySellModel').css('display', 'none');
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