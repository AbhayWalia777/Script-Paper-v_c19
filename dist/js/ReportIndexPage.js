var LevelLoginUser = '';
var BrokerWise = '';
var AdminWise = '';
var UserWise = '';
var SubBrokerWise = '';
var cbxreportemailcheckbox = '';

var IsAdmin = 0;
var UserId = 0;
var IsNotOwn = 0;
var CbxReportEmail = 0;

$(document).ready(function () {

    LevelLoginUser = $('#LevelLoginUser').text();
    BrokerWise = document.getElementById('IsBrokerWise');
    AdminWise = document.getElementById('IsAdminWise');
    UserWise = document.getElementById('IsUserWise');
    SubBrokerWise = document.getElementById('IsSubBrokerWise');
    cbxreportemailcheckbox = document.getElementById('cbxSendmail');

    $('.select2').select2();
    SwitchDataTheme();
    // Calculate the maximum and minimum dates
    var today = new Date();
    var maxDate = new Date(today.getTime()).toISOString().split('T')[0];
    var minDate = new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    $('#Export1_Start_Date').val(new Date(new Date().getTime()).toISOString().split('T')[0]);
    $('#Export1_End_Date').val(new Date(new Date().getTime()).toISOString().split('T')[0]);

    // Set the maximum and minimum dates using jQuery
    $('#Export1_Start_Date').attr('max', maxDate);
    $('#Export1_End_Date').attr('max', maxDate);
    $('#Export1_Start_Date').attr('min', minDate);
    $('#Export1_End_Date').attr('min', minDate);
});

$("#dropReportType").on('change', function () {
    $("#Export1").css("display", "none");
    $("#Export2").css("display", "none");
    $("#Export3").css("display", "none");
    $("#Export4").css("display", "none");
    $("#Export5").css("display", "none");
    $("#Export6").css("display", "none");
    $("#Export8").css("display", "none");
    $("#Export9").css("display", "none");
    $("#ExportDate").css("display", "none");
    $("#Export5OrExport6").css("display", "none");
    $("#Export3OrExport4").css("display", "none");
    if ($("#dropReportType option:selected").val() != "" && $("#dropReportType option:selected").val() != null) {
        if ($("#dropReportType option:selected").val() == "Export1") {
            $("#Export1").css("display", "block");
            $("#ExportDate").css("display", "block");
            $("#Export3OrExport4").css("display", "block");
        }
        else if ($("#dropReportType option:selected").val() == "Export2") {
            $("#Export2").css("display", "block");
            $("#Export3OrExport4").css("display", "block");
        }
        else if ($("#dropReportType option:selected").val() == "Export3") {
            $("#Export3OrExport4").css("display", "block");
            $("#ExportDate").css("display", "block");
            $("#Export3").css("display", "block");
        }
        else if ($("#dropReportType option:selected").val() == "Export4" || $("#dropReportType option:selected").val() == "Export7") {
            $("#Export3OrExport4").css("display", "block");
            $("#ExportDate").css("display", "block");
            $("#Export4").css("display", "block");
        }
        else if ($("#dropReportType option:selected").val() == "Export5") {
            $("#Export3OrExport4").css("display", "block");
            $("#Export5OrExport6").css("display", "block");
            $("#Export5").css("display", "block");

            $('#Export5_Start_Date').datepicker({
                format: 'mm-dd-yyyy',
                daysOfWeekDisabled: [0, 6],
                autoclose: true,
                useCurrent: true,
                todayHighlight: true,
                todayBtn: true,
                endDate: new Date(),
                todayBtn: "linked"
            });

        }
        else if ($("#dropReportType option:selected").val() == "Export6") {
            $("#Export5OrExport6").css("display", "block");
            $("#Export6").css("display", "block");

            $('#Export5_Start_Date').datepicker({
                format: 'mm-dd-yyyy',
                daysOfWeekDisabled: [0, 6],
                autoclose: true,
                useCurrent: true,
                todayHighlight: true,
                todayBtn: true,
                endDate: new Date(),
                todayBtn: "linked"
            });
        } else if ($("#dropReportType option:selected").val() == "Export8") {
            $("#Export5OrExport6").css("display", "block");
            $("#Export8").css("display", "block");

            $('#Export5_Start_Date').datepicker({
                format: 'mm-dd-yyyy',
                daysOfWeekDisabled: [0, 6],
                autoclose: true,
                useCurrent: true,
                todayHighlight: true,
                todayBtn: true,
                endDate: new Date(),
                todayBtn: "linked"
            });
        }
        else if ($("#dropReportType option:selected").val() == "Export9") {
            $("#Export3OrExport4").css("display", "block");
            $("#ExportDate").css("display", "block");
            $("#Export9").css("display", "block");
        }
    }
});
function CommonFunctionAdminWise() {

    CbxReportEmail = cbxreportemailcheckbox.checked ? true : false;
    if (LevelLoginUser == 1 || LevelLoginUser == 2) {
        if (AdminWise.checked == true || BrokerWise.checked == true || UserWise.checked == true || SubBrokerWise.checked == true) {
            if (AdminWise.checked == true || BrokerWise.checked == true || SubBrokerWise.checked == true) {
                IsAdmin = 1;
                IsNotOwn = 1;
                if ($('#UserIds option:selected').text() != '--Select--') {
                    UserId = $('#UserIds').val();
                }
                else {
                    toastr.error("Please Fill All The Required Fields");
                    return false;
                }
            }
            if (UserWise.checked == true) {
                IsAdmin = 0;
                IsNotOwn = 1;
                if ($('#UserIds option:selected').text() != '--Select--') {
                    UserId = $('#UserIds').val();
                }
                else {
                    toastr.error("Please Fill All The Required Fields");
                    return false;
                }
            }
        }
    }
    if (LevelLoginUser == 3) {
        if (BrokerWise.checked == true || UserWise.checked == true || SubBrokerWise.checked == true) {
            if (BrokerWise.checked == true || SubBrokerWise.checked == true) {
                IsAdmin = 1;
                IsNotOwn = 1;
                if ($('#UserIds option:selected').text() != '--Select--') {
                    UserId = $('#UserIds').val();
                }
                else {
                    toastr.error("Please Fill All The Required Fields");
                    return false;
                }
            }
            if (UserWise.checked == true) {
                IsAdmin = 0;
                IsNotOwn = 1;
                if ($('#UserIds option:selected').text() != '--Select--') {
                    UserId = $('#UserIds').val();
                }
                else {
                    toastr.error("Please Fill All The Required Fields");
                    return false;
                }
            }
        }
    }
    if (LevelLoginUser == 4) {
        if (UserWise.checked == true || SubBrokerWise.checked == true) {
            if (SubBrokerWise.checked == true) {
                IsAdmin = 1;
                IsNotOwn = 1;
                if ($('#UserIds option:selected').text() != '--Select--') {
                    UserId = $('#UserIds').val();
                }
                else {
                    toastr.error("Please Fill All The Required Fields");
                    return false;
                }
            }
            if (UserWise.checked == true) {
                IsAdmin = 0;
                IsNotOwn = 1;
                if ($('#UserIds option:selected').text() != '--Select--') {
                    UserId = $('#UserIds').val();
                }
                else {
                    toastr.error("Please Fill All The Required Fields");
                    return false;
                }
            }
        }
    }
    if (LevelLoginUser == 5) {
        if (UserWise.checked == true) {
            IsAdmin = 0;
            IsNotOwn = 1;
            if ($('#UserIds option:selected').text() != '--Select--') {
                UserId = $('#UserIds').val();
            }
            else {
                toastr.error("Please Fill All The Required Fields");
                return false;
            }
        }
    }

}

$("#btnExport1").on('click', function () {
    if ($("#dropReportType option:selected").val() != "" && $("#dropReportType option:selected").val() != null
        && $("#Export1_Start_Date").val() != "" && $("#Export1_Start_Date").val() != null
        && $("#Export1_End_Date").val() != "" && $("#Export1_End_Date").val() != null) {
        CommonFunctionAdminWise();
        var url = "/Report/PrepareLedgerReport?reportType=" + $("#dropReportType option:selected").val() + "&startDate=" + $("#Export1_Start_Date").val() + "&endDate=" + $("#Export1_End_Date").val() + "&IsAdminWise=" + IsAdmin + "&UserId=" + UserId + "&IsNotOwn=" + IsNotOwn + "&IsReportEmailRequired=" + CbxReportEmail;
        $('<a href="' + url + '" target="blank"></a>')[0].click();
    }
    else {
        toastr.error("Please Fill All The Required Fields");
    }
});

$("#btnExport2").on('click', function () {

    if ($("#dropReportType option:selected").val() != "" && $("#dropReportType option:selected").val() != null) {
        CommonFunctionAdminWise();
        var url = "/Report/PrepareActiveTradeReport?reportType=" + $("#dropReportType option:selected").val() + "&IsAdminWise=" + IsAdmin + "&UserId=" + UserId + "&IsNotOwn=" + IsNotOwn + "&IsReportEmailRequired=" + CbxReportEmail;
        $('<a href="' + url + '" target="blank"></a>')[0].click();
    }
    else {
        toastr.error("Please Fill All The Required Fields");
    }
});

$("#btnExport3").on('click', function () {
    if ($("#dropReportType option:selected").val() != "" && $("#dropReportType option:selected").val() != null && $("#Export1_Start_Date").val() != "" && $("#Export1_Start_Date").val() != null
        && $("#Export1_End_Date").val() != "" && $("#Export1_End_Date").val() != null) {
        CommonFunctionAdminWise();
        var url = "/Report/PrepareBrokerageReport?reportType=" + $("#dropReportType option:selected").val() + "&IsAdminWise=" + IsAdmin + "&UserId=" + UserId + "&IsNotOwn=" + IsNotOwn + "&startDate=" + $("#Export1_Start_Date").val() + "&endDate=" + $("#Export1_End_Date").val() + "&IsReportEmailRequired=" + CbxReportEmail;
        $('<a href="' + url + '" target="blank"></a>')[0].click();
    }
    else {
        toastr.error("Please Fill All The Required Fields");
    }
});

$("#btnExport4").on('click', function () {
    if ($("#dropReportType option:selected").val() != "" && $("#dropReportType option:selected").val() != null && $("#Export1_Start_Date").val() != "" && $("#Export1_Start_Date").val() != null
        && $("#Export1_End_Date").val() != "" && $("#Export1_End_Date").val() != null) {
        var ScriptName = '';
        if ($("#DropScriptName option:selected").val() == "" || $("#DropScriptName option:selected").val() == null) {
            toastr.error("Please Fill All The Required Fields");
            return false;
        }
        else {
            ScriptName = $("#DropScriptName option:selected").val();
        }
        CommonFunctionAdminWise();
        var url = "/Report/PrepareScriptWiseReport?reportType=" + $("#dropReportType option:selected").val() + "&IsAdminWise=" + IsAdmin + "&UserId=" + UserId + "&IsNotOwn=" + IsNotOwn + "&ScriptName=" + ScriptName + "&startDate=" + $("#Export1_Start_Date").val() + "&endDate=" + $("#Export1_End_Date").val() + "&IsReportEmailRequired=" + CbxReportEmail;
        $('<a href="' + url + '" target="blank"></a>')[0].click();
    }
    else {
        toastr.error("Please Fill All The Required Fields");
    }
});

$("#btnExport5").on('click', function () {
    if ($("#dropReportType option:selected").val() != "" && $("#dropReportType option:selected").val() != null
        && $("#Export5_Start_Date").val() != "" && $("#Export5_Start_Date").val() != null) {
        CommonFunctionAdminWise();
        var url = "/Report/PrepareTurnoverReport?reportType=" + $("#dropReportType option:selected").val() + "&startDate=" + $("#Export5_Start_Date").val() + "&endDate=" + $("#Export5_Start_Date").val() + "&IsAdminWise=" + IsAdmin + "&UserId=" + UserId + "&IsNotOwn=" + IsNotOwn + "&IsReportEmailRequired=" + CbxReportEmail;
        $('<a href="' + url + '" target="blank"></a>')[0].click();
    }
    else {
        toastr.error("Please Fill All The Required Fields");
    }
});

$("#btnExport6").on('click', function () {
    if ($("#dropReportType option:selected").val() != "" && $("#dropReportType option:selected").val() != null
        && $("#Export5_Start_Date").val() != "" && $("#Export5_Start_Date").val() != null) {
        var url = "/Report/PrepareProfitSharingReport?reportType=" + $("#dropReportType option:selected").val() + "&startDate=" + $("#Export5_Start_Date").val() + "&IsReportEmailRequired=" + CbxReportEmail;
        $('<a href="' + url + '" target="blank"></a>')[0].click();
    }
    else {
        toastr.error("Please Fill All The Required Fields");
    }
});
$("#btnExport8").on('click', function () {
    if ($("#dropReportType option:selected").val() != "" && $("#dropReportType option:selected").val() != null
        && $("#Export5_Start_Date").val() != "" && $("#Export5_Start_Date").val() != null) {
        var url = "/Report/PrepareSummaryReport?reportType=" + $("#dropReportType option:selected").val() + "&startDate=" + $("#Export5_Start_Date").val();
        $('<a href="' + url + '" target="blank"></a>')[0].click();
    }
    else {
        toastr.error("Please Fill All The Required Fields");
    }
});
$("#btnExport9").on('click', function () {
    if ($("#dropReportType option:selected").val() != "" && $("#dropReportType option:selected").val() != null && $("#Export1_Start_Date").val() != "" && $("#Export1_Start_Date").val() != null
        && $("#Export1_End_Date").val() != "" && $("#Export1_End_Date").val() != null) {
        CommonFunctionAdminWise();
        var url = "/Report/PrepareActivityReport?reportType=" + $("#dropReportType option:selected").val() + "&IsAdminWise=" + IsAdmin + "&UserId=" + UserId + "&IsNotOwn=" + IsNotOwn + "&startDate=" + $("#Export1_Start_Date").val() + "&endDate=" + $("#Export1_End_Date").val() + "&IsReportEmailRequired=" + CbxReportEmail;
        $('<a href="' + url + '" target="blank"></a>')[0].click();
    }
    else {
        toastr.error("Please Fill All The Required Fields");
    }
});

function SwitchDataTheme() {
    var data = localStorage.getItem('IsDark');
    if (data == 'NO') {
    }
    else {
        $('.content-wrapper').css({ 'background-color': 'black', 'color': 'white' });
        $('.content').css({ 'background-color': 'black', 'color': 'white' });
        $('.box-default').css({ 'background-color': 'black', 'color': 'white' });
        $('.datatableheader').css('background-color', 'var(--main-color-on-layoutchange)');
        $('li').css('color', 'white');
        $('.content-header>.breadcrumb>li>a').css('color', 'white');
        $('#mainWindow').css('background-color', 'black');
        $('.box-title').css('color', 'white');
        $('li.disabled > a').css({ 'background-color': 'black', 'color': 'white' });
        $('.main-footer').css({ 'background-color': 'black', 'color': 'white' });
        $('input').css({ 'border': '2px solid var(--main-color-on-layoutchange)', 'color': 'white', 'background-color': 'black' });
        $('.form-control').css({ 'border': '2px solid var(--main-color-on-layoutchange)', 'color': 'white', 'background-color': 'black' });
        $('#Export1_Start_Date').css({ 'background-color': 'gray', 'color': 'black' });
        $('#Export1_End_Date').css({ 'background-color': 'gray', 'color': 'black' });
        $('#Export5_Start_Date').css({ 'background-color': 'gray', 'color': 'black' });
        $('#Export5_End_Date').css({ 'background-color': 'gray', 'color': 'black' });

        var NewUI = '';
        if (MySkin.SkinName != '') {
            NewUI = MySkin.SkinName;
        }
        else {
            if (typeof (Storage) !== 'undefined') {
                NewUI = localStorage.getItem('skin');
            }
        }
        if (NewUI == 'skin-black' || NewUI == 'skin-black-light') {
        }
        else {
        }

    }
}

$('#IsAdminWise').on('click', function () {

    UserWise.checked = false;
    SubBrokerWise.checked = false;
    if (LevelLoginUser == 1 || LevelLoginUser == 2 || LevelLoginUser == 3)
        BrokerWise.checked = false;
    if (AdminWise.checked == true) {
        $("#DivDropDownUserList").css("display", "none");
        GetUserList(1);
        $('#DivDropDownUserList').css('display', 'Block');
    }
    ChangeCheckOrLevel();

});

$('#IsBrokerWise').on('click', function () {

    SubBrokerWise.checked = false;
    UserWise.checked = false;
    if (LevelLoginUser == 1 || LevelLoginUser == 2)
        AdminWise.checked = false;
    if (BrokerWise.checked == true) {
        $("#DivDropDownUserList").css("display", "none");
        GetUserList(2);
        $('#DivDropDownUserList').css('display', 'Block');
    }
    ChangeCheckOrLevel();

});

$('#IsSubBrokerWise').on('click', function () {

    UserWise.checked = false;
    if (LevelLoginUser == 1 || LevelLoginUser == 2 || LevelLoginUser == 3)
        BrokerWise.checked = false;
    if (LevelLoginUser == 1 || LevelLoginUser == 2)
        AdminWise.checked = false;
    if (SubBrokerWise.checked == true) {
        GetUserList(3);
    }

    ChangeCheckOrLevel();

});

$('#IsUserWise').on('click', function () {
    if (LevelLoginUser == 1 || LevelLoginUser == 2 || LevelLoginUser == 3 || LevelLoginUser == 4)
        SubBrokerWise.checked = false;
    if (LevelLoginUser == 1 || LevelLoginUser == 2 || LevelLoginUser == 3)
        BrokerWise.checked = false;
    if (LevelLoginUser == 1 || LevelLoginUser == 2)
        AdminWise.checked = false;
    if (UserWise.checked == true) {
        GetUserList(0);
    }

    ChangeCheckOrLevel();

});

function GetUserList(IsAdminOrBroker) {
    $("#DivDropDownUserList").css("display", "none");
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
    $('#DivDropDownUserList').css('display', 'Block');
}

function ChangeCheckOrLevel() {

    if (LevelLoginUser == 1 || LevelLoginUser == 2) {
        if (AdminWise.checked == false && BrokerWise.checked == false && UserWise.checked == false && SubBrokerWise.checked == false)
            $('#DivDropDownUserList').css('display', 'none');
    }
    if (LevelLoginUser == 3) {
        if (BrokerWise.checked == false && UserWise.checked == false && SubBrokerWise.checked == false)
            $('#DivDropDownUserList').css('display', 'none');
    }
    if (LevelLoginUser == 4) {
        if (UserWise.checked == false && SubBrokerWise.checked == false)
            $('#DivDropDownUserList').css('display', 'none');
    }
}

function SetDropDownData(data) {
    $('#UserIds').empty();
    $('#UserIds').html('');
    $('#UserIds').append($("<option></option>").val("").html("--Select--"));
    $.each(data, function (i, item) {
        $('#UserIds').append($("<option></option>").val(item.userID).html(item.email));
    });
}
