$(document).ready(function () {
    
   
    $("#btnUpdate").on('click', function () {
        //debugger;
        if ($('input[Name="ActiveLossReset"]').val() < 0) {
            alert("Active Loss can not be less than zero.");
            return false;
        }
        if ($('input[Name="ActiveProfitReset"]').val() < 0) {
            alert("Active Profit can not be less than zero.");
            return false;
        }
        if ($('input[Name="SLTriggerCount"]').val() == '') {
            alert("Trigger count can not be blank");
            return false;
        }
        if ($('input[Name="SLTriggerCount"]').val() > 20)
        {
            alert("Trigger count can not be greater then 20");
            return false;
        }
    //    var objConfigDTO = new FormData();
    //    var ApiData = { 'APIID': $('input[Name="objAPIDTO.APIID"]').val(), 'APIKey': $('[Name="objAPIDTO.APIKey"]').val().trim(), 'APISecretKey': $('input[Name="objAPIDTO.APISecretKey"]').val(), 'RedirectURL': $('input[Name="objAPIDTO.RedirectURL"]').val(), 'MyUserID': $('input[Name="objAPIDTO.MyUserID"]').val() };
    //    var ConfigData = { 'ID': $('input[Name="objConfigDTO.ID"]').val(), 'ActiveProfitReset': $('input[Name="objConfigDTO.ActiveProfitReset"]').val(), 'ActiveLossReset': $('input[Name="objConfigDTO.ActiveLossReset"]').val(), 'IsLive': $('input[Name="objConfigDTO.IsLive"]').prop('checked') };
    //    objConfigDTO.append('objAPIDTO', ApiData);
    //    objConfigDTO.append('objConfigDTO', ConfigData);
    //    $.ajax(
    //               {
    //                   url: '/SystemConfig/AddConfig/',
    //                   type: 'POST',
    //                   data: objConfigDTO,
    //                   contentType: false, // Not to set any content header
    //                   processData: false,
    //                   success: function (data) {
    //                   },
    //                   error: function () {
    //                   }
    //               });

    });
});