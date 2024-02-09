
var UserWise = '';
var SubBrokerWise = '';
var IsAdmin = 0;
var CbxReportEmail = 0;
var UserID = 0;
var IsNotOwn = 0;
var PdfView = "";
var Excel = "";
var OnScreen = "";





$(document).ready(function () {
    var today = new Date();
    document.getElementById('rptStartDate').valueAsDate = today;
    document.getElementById('rptEndDate').valueAsDate = today;
    UserWise = document.getElementById('User');
    SubBrokerWise = document.getElementById('SubBroker');
    All = document.getElementById('All');
    OnScreen = document.getElementById('rdOnScreen');
    Excel = document.getElementById('rdExcel');
    PdfView = document.getElementById('rdPdfView');


    $('.blank1').select2({
        placeholder: "Head",
        
    });
    $('.blank1').val(null).trigger('change');
    $('.blank2').select2({
        placeholder: "Client",
        allowClear: true
    });
    $('.blank3').select2({
        placeholder: "Filter",
        allowClear: true
    });
    $('.blank1').select2({
        placeholder: "Head"
    });
    /*   $('#btnGetLedger').click(function () {
           toastr.error("Please make selection for Client");
       });  
    $('#btnSendEmail').click(function () {
        toastr.error("Email Id Not Found");
    }); */

    $('#myTable').DataTable({
        "paging": true,
        "lengthChange": false,
        "info": false,
        "ordering": true,
        "searching": true,
        "responsive": true
    });

    $('#myTableDiv').hide();
    // $("#Head").on('change', function () {
    //     $('#myTableDiv').show();
    // });
});
function CommonFunctionAdminWise() {

    OnScreenReport = OnScreen.checked ? true : false;
    ExcelReport = Excel.checked ? true : false;
    PdfReport = PdfView.checked ? true : false;
    if ($('#Head option:selected').val() == "User") {
        IsAdmin = 0;
        IsNotOwn = 1;
        if ($('#UserIds option:selected').text() != '--Select--') {
            UserID = $('#UserIds').val();
        }
        else {
            toastr.error("Please Fill All The Required Fields");
            return false;
        }
    }
    if ($('#Head option:selected').val() == "SubBroker") {
        IsAdmin = 0;
        IsNotOwn = 1;
        if ($('#UserIds option:selected').text() != '--Select--') {
            UserID = $('#UserIds').val();
        }
        else {
            toastr.error("Please Fill All The Required Fields");
            return false;
        }
    }
    if ($('#Head option:selected').val() == "All") {
        IsAdmin = 1;
        IsNotOwn = 1;
        if ($('#UserIds option:selected').text() != '--Select--') {
            UserID = $('#UserIds').val();
        }
        else {
            toastr.error("Please Fill All The Required Fields");
            return false;
        }
    }
    

}

$(document).on('change', '#Head', function () {
    if ($('#Head option:selected').val() == "User") {
        GetUserList(0);
        return false;
    }
    else if ($('#Head option:selected').val() == "SubBroker") {
        GetUserList(3);
        return false;
    }
    else if ($('#Head option:selected').val() == "All") {
        GetUserList(0);
        return false;
    }
});



function GetUserList(IsAdminOrBroker) {

    var input = "";
    input = { 'IsAdmin': IsAdminOrBroker };
    var request = $.ajax({
        url: "/Trade/GetUsersListByAdminOrBroker",
        type: "Get",
        data: input,
        success: function (data) {
            SetDropDownData(data);
        }
    });

}
function GetData() {
    var reportType = $("#rdOnScreen").val();
    var StartDate = $("#rptStartDate").val();
    var EndDate = $("#rptEndDate").val();
    var UserID = $('#UserIds').val() != null ? $('#UserIds').val() : 0;
    var AmountData = $("#CashWiseFilter option:selected").val();
    input = { 'reportType': reportType, 'startDate': StartDate, 'endDate': EndDate, 'IsAdminWise': IsAdmin, 'UserID': UserID, 'IsNotOwn': IsNotOwn, 'IsReportEmailRequired': CbxReportEmail, 'AmountData': AmountData };
    $.ajax({
        type: 'GET',
        datatype: 'json',
        url: '/Report/GetLedgerReportOnScreen',
        data: input,
        async: true,
        success: function (responseData) {
            //var responseData = JSON.parse(response);
            $('#myTableDiv').show();
            var tblTransaction = $('#myTable').DataTable();
            tblTransaction.clear().draw();
            tblTransaction.innerHTML = "";
            var lstData = responseData;
            if (lstData.length > 0) {
                for (var i = 0; i < lstData.length; i++) {
                    var result = lstData[i];
                    //TotalPageNo = parseInt(result.Total_Pages);
                    SetWalletTransactionDetails(result);
                }
            }
            else {
                TotalPageNo = 0;
            }
          // SetPagination();

        },
        error: function (response) {
            console.log(response);
        }
    });

}
function SetWalletTransactionDetails(item) {
    
    var empty = "";
    var table = $('#myTable').DataTable().row.add([
        item.Date_Time_String,
        item.Id,
        "Self",
        empty,        
        item.amount.indexOf('+') == -1 ? parseFloat(item.amount).toFixed(2) : "0",
            item.amount.indexOf('+') != -1 ? parseFloat(item.amount).toFixed(2) : "0",
        parseFloat(item.Closingbalance).toFixed(2),
        item.amount.indexOf('+')!=-1?"Cr":"Dr",
        item.Description,        
    ]).order([0, 'desc']).draw();
}



function SetDropDownData(data) {
    $('#UserIds').empty();
    $('#UserIds').html('');
    $('#UserIds').append($("<option></option>").val("").html("--Select--"));
    $.each(data, function (i, item) {
        $('#UserIds').append($("<option></option>").val(item.UserID).html(item.Email));
    });
}
$("#btnSendEmail").on('click', function () {
    var abc = $("#CashWiseFilter option:selected").val();
    if (PdfView.checked == true
        && $("#rptStartDate").val() != "" && $("#rptStartDate").val() != null
        && $("#rptEndDate").val() != "" && $("#rptEndDate").val() != null) {
        CommonFunctionAdminWise();
        var url = "/Report/PrepareLedgerReport?reportType=" + $("#rdPdfView").val() + "&startDate=" + $("#rptStartDate").val() + "&endDate=" + $("#rptEndDate").val() + "&IsAdminWise=" + IsAdmin + "&UserID=" + UserID + "&IsNotOwn=" + IsNotOwn + "&IsReportEmailRequired=" + true + "&AmountData=" + $("#CashWiseFilter option:selected").val();
        $('<a href="' + url + '" target="blank"></a>')[0].click();
    }else {
        toastr.error("Please Checked on Pdf View");
    }

});

$("#btnGetLedger").on('click', function () {
    var abc = $("#CashWiseFilter option:selected").val();
        if (PdfView.checked == true 
            && $("#rptStartDate").val() != "" && $("#rptStartDate").val() != null
            && $("#rptEndDate").val() != "" && $("#rptEndDate").val() != null) {
            CommonFunctionAdminWise();
            var url = "/Report/PrepareLedgerReport?reportType=" + $("#rdPdfView").val() + "&startDate=" + $("#rptStartDate").val() + "&endDate=" + $("#rptEndDate").val() + "&IsAdminWise=" + IsAdmin + "&UserID=" + UserID + "&IsNotOwn=" + IsNotOwn + "&IsReportEmailRequired=" + CbxReportEmail + "&AmountData=" + $("#CashWiseFilter option:selected").val();
            $('<a href="' + url + '" target="blank"></a>')[0].click();
        } else if (Excel.checked == true
            && $("#rptStartDate").val() != "" && $("#rptStartDate").val() != null
            && $("#rptEndDate").val() != "" && $("#rptEndDate").val() != null) {
            CommonFunctionAdminWise();
            var url = "/Report/PrepareLedgerReportExcelFormat?reportType=" + $("#rdExcel").val() + "&startDate=" + $("#rptStartDate").val() + "&endDate=" + $("#rptEndDate").val() + "&IsAdminWise=" + IsAdmin + "&UserID=" + UserID + "&IsNotOwn=" + IsNotOwn + "&IsReportEmailRequired=" + CbxReportEmail + "&AmountData="+ $("#CashWiseFilter option:selected").val();
            $('<a href="' + url + '" target="blank"></a>')[0].click();
        } else if (OnScreen.checked == true
            && $("#rptStartDate").val() != "" && $("#rptStartDate").val() != null
            && $("#rptEndDate").val() != "" && $("#rptEndDate").val() != null) {
            CommonFunctionAdminWise();
          //  $('.pagination').empty();
          // $('.pagination').removeData("twbs-pagination");
          //  $('.pagination').unbind("page");
            GetData();
        }
        else {
          
            toastr.error("Please Fill All The Required Fields");
        }
    });
    
