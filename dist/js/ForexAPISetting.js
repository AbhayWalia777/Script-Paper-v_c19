
function SaveAPI() {
    var API1 = $('#SpForexApi').val();
    var API2 = $('#SpForexApi1').val();
    var request = $.ajax({
        url: "/SystemConfig/UpdateSupportForexApi",
        type: "POST",
        data: { Api1: API1, Api2: API2 },
        dataType: 'json',
        traditional: true,
        success: function (data) {
            var results = JSON.parse(data);
            if (results.exceptionDTO.id == 1) {
                toastr.success(results.exceptionDTO.Msg);
            }
            else if (results.exceptionDTO.id == 0) {
                toastr.error(results.exceptionDTO.Msg);
            }
            else if (results.exceptionDTO.id == 2) {
                toastr.info(results.exceptionDTO.Msg);
            }
            return false;
        }
    });
}


