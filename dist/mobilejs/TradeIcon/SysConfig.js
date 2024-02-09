$(window).on('load', function () {
SwitchData();
});

$(document).ready(function () {
    
   
    $("#btnUpdate").on('click', function () {
        //debugger;
        if ($('input[Name="ActiveLossReset"]').val() < 0) {
          toastr.error("Active Loss can not be less than zero.");
            return false;
        }
        if ($('input[Name="ActiveProfitReset"]').val() < 0) {
          toastr.error("Active Profit can not be less than zero.");
            return false;
        }
        if ($('input[Name="SLTriggerCount"]').val() == '') {
          toastr.error("Trigger count can not be blank");
            return false;
        }
        if ($('input[Name="SLTriggerCount"]').val() > 20)
        {
          toastr.error("Trigger count can not be greater then 20");
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




 function SwitchData(){
        var data = localStorage.getItem('IsDark');
        if (data == 'NO') {
    }
    else {
        $('.content-wrapper').css({'background-color': 'black' ,'color' : 'white'});
        $('.form-horizontal').css({'background-color': 'black' ,'color' : 'white'});
        $('.datatableheader').css('background-color','var(--main-color-on-layoutchange)');
        $('li').css('color','white');
        $('.content-header>.breadcrumb>li>a').css('color','white');
        $('#mainWindow').css('background-color','black');
        $('.box-title').css('color','white');
        $('.form-control').css({'border':'2px solid var(--main-color-on-layoutchange)','color':'white','background-color':'black'});
        $('.main-footer').css({'background-color':'black','color':'white'});
        $('.table-bordered>thead>tr>th, .table-bordered>tbody>tr>th, .table-bordered>tfoot>tr>th, .table-bordered>thead>tr>td, .table-bordered>tbody>tr>td, .table-bordered>tfoot>tr>td').css('border','1px solid var(--main-color-on-layoutchange)');
        $('.table-bordered').css('border','1px solid var(--main-color-on-layoutchange)');
        $('input').css({'border':'2px solid var(--main-color-on-layoutchange)','background-color':'black','color':'white'});
        $('.form-control').css({'border':'2px solid var(--main-color-on-layoutchange)','color':'white','background-color':'black'});
        $('#btnUpdate').css({'border':'','color':'','background-color':''});
    }
}