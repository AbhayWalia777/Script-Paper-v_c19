var TotalPageNo = 0;
var isCallf = false;
var IsAllowedToManageBalance = "";
var IsAllowedScriptWiseExposure = "";

$(document).ready(function () {
    IsAllowedToManageBalance = $('#IsAllowedToManageBalance').val();
    IsAllowedScriptWiseExposure = $('#IsAllowedScriptWiseExposure').val();
    var table = $('#tblAllUserList').DataTable({
        "order": [[0, "asc"]],
        "paging": false,
        "searching": true,
        responsive: true
    });
    $('.select2').select2();
    GetData(1);
});
function DisableControll() {
    $(this).prop('disabled', true);
}
function GetData(page) {
    $.ajax({
        type: 'Get',
        datatype: 'json',
        contentType: 'application/json',
        url: '/Admin/_GetAllUser?PageNo=' + page,
        success: function (response) {
            var lstData = JSON.parse(response);
            var tblAllUserList = $('#tblAllUserList').DataTable();
            tblAllUserList.clear().draw();
            tblAllUserList.innerHTML = "";

            if (lstData.length > 0) {
                $("tbody td").css("white-space", "nowrap");
                for (var i = 0; i < lstData.length; i++) {
                    var result = lstData[i];
                    TotalPageNo = parseInt(result.Total_Page);
                    SetAllUsersDetails(result);
                }
            }
            else {
                TotalPageNo = 0;
            }
            SetPagination();

        },
        error: function (response) {
            console.log(response);
        }
    });
    $('#tblAllUserList').DataTable();
}
function SetPagination() {
    $('.pagination').twbsPagination({
        totalPages: TotalPageNo,
        visiblePages: 2,
        onPageClick: function (event, page) {
            if (isCallf)
                GetData(page);
            else
                isCallf = true;
        }
    });
}

function SetAllUsersDetails(item) {
    var DeleteAction = "";
    var Watchlist = "";
    var FullNameUrl = "";
    var ViewAllUsers = "";
    var ExchangeWiseExposure = "";
    if ((RoleId == 4 && ($("#companyInitial").val() == "SC" || $("#companyInitial").val() == "DT") || $("#companyInitial").val() == "EXPO") || (RoleId == 4 && $("#companyInitial").val() == "KT")) {
        Watchlist = '<a href="/Watchlist/Index/?UserID=' + item.UserID + '" class="btn btn-warning margin-right-5px">Watchlist </a>'
    }
    if ($("#companyInitial").val() == "EXPO") {
        ViewAllUsers = '<a href="/Admin/ViewUsers?AdminId=' + item.UserID + '"><button type="button" class="btn btn-warning btn-sm margin-right-5px">View Users<i class="fa fa-user-alt"></i></button> </a>';
    }
    if (RoleId == 5) {
        DeleteAction = '<a href="javascript:void(0)" id="' + item.UserID + '" class="delete-prompt margin-right-5px">' +
            '<button type="button" class="btn btn-danger btn-sm" ><i class="fa fa fa-trash-o"></i></button></a>';
        FullNameUrl = '<a id="aUserLogin" class="aUserLogin" data-id="' + item.UserID + '" target="_blank" href="/Admin/UserLoginFromAdmin?UserID=' + item.UserID + '">' + item.Fullname + '</a>';
    } else {
        FullNameUrl = item.Fullname;
    }
    var Action = '<a href="/Admin/ManageUser/' + item.UserID + '"><button type="button" class="btn btn-primary btn-sm margin-right-5px" ><i class="fa fa-pencil"></i></button></a>' +
        '<a href = "/Admin/ChangePassword/' + item.UserID + '" > <button type="button" class="btn btn-info btn-sm margin-right-5px" ><i class="fa fa-key"></i></button></a>';
    if (IsAllowedToManageBalance == "0") {
        Action += '<a href="/Admin/Addbalance?UserID=' + item.UserID + '&TenantId=' + item.TenantId + '&returnUrl=AllUsers" class="btn btn-success margin-right-5px">Deposit </a><a href="/Admin/Withdrawal/?UserID=' + item.UserID + '&TenantId=' + item.TenantId + '&returnUrl=AllUsers" class="btn btn-warning margin-right-5px">Withdrawal </a>';
    }
    if (IsAllowedScriptWiseExposure == "1") {
        Action += '<a href="/Admin/ManageBrokerage/?ID=' + item.UserID + '" class="btn btn-warning margin-right-5px">Script Exposure</a>';
    }
    Action += DeleteAction;
    Action += Watchlist;
    Action += ViewAllUsers;
    var netProfit = item.Totalloss + item.Totalprofit;
    var getLevel = $('#HdnLevel').text();
    if (getLevel != 1) {
        var table = $('#tblAllUserList').DataTable().row.add([
            item.CreatedDateString,
            item.Username,
            item.Sponsorid,
            FullNameUrl,
            item.Email,
            item.ExpiryDateString,
            item.RoleName,
            netProfit.toFixed(2),
            item.Balance,
            item.IsActive,
            Action
        ]).order([0, 'desc']).draw();
    }
    else {
        var table = $('#tblAllUserList').DataTable().row.add([
            item.Companyname,
            item.CreatedDateString,
            item.Username,
            item.Sponsorid,
            FullNameUrl,
            item.Email,
            item.ExpiryDateString,
            item.RoleName,
            netProfit.toFixed(2),
            item.Balance,
            item.IsActive,
            Action
        ]).order([0, 'desc']).draw();
    }
    var ctable = document.getElementById("tblAllUserList");
    if (getLevel != 1) {
        for (var i = 0; i < ctable.rows.length; i++) {
            var Bindded_Amount = parseFloat($(ctable.rows[i].cells[7]).text());
            if (Bindded_Amount >= 0) {
                $(ctable.rows[i].cells[7]).css({ "color": "white", "font-weight": "bold", "background-color": "green" });
            }
            if (Bindded_Amount < 0) {
                $(ctable.rows[i].cells[7]).css({ "color": "white", "font-weight": "bold", "background-color": "red" });
            }
            if (i != 0) {
                var expval = $(ctable.rows[i].cells[5]).text();
                var Expirydate = new Date(expval);
                var today = new Date();
                if (Expirydate < today) {
                    $(ctable.rows[i].cells[5]).css({ "color": "white", "font-weight": "bold", "background-color": "red" });
                }
            }
        }
    }
    else {
        for (var i = 0; i < ctable.rows.length; i++) {
            var Bindded_Amount = parseFloat($(ctable.rows[i].cells[8]).text());
            if (Bindded_Amount >= 0) {
                $(ctable.rows[i].cells[8]).css({ "color": "white", "font-weight": "bold", "background-color": "green" });
            }
            if (Bindded_Amount < 0) {
                $(ctable.rows[i].cells[8]).css({ "color": "white", "font-weight": "bold", "background-color": "red" });
            }
            if (i != 0) {
                var expval = $(ctable.rows[i].cells[6]).text();
                var Expirydate = new Date(expval);
                var today = new Date();
                if (Expirydate < today) {
                    $(ctable.rows[i].cells[6]).css({ "color": "white", "font-weight": "bold", "background-color": "red" });
                }
            }
        }
    }




}


$("#UserIds").on('change', function () {
    if ($('#UserIds').val() != '') {
        $.ajax({
            type: 'Get',
            datatype: 'json',
            contentType: 'application/json',
            url: '/Admin/_GetUserBySearch?UserID=' + $('#UserIds').val(),
            success: function (response) {
                var lstData = JSON.parse(response);
                var tblAllUserList = $('#tblAllUserList').DataTable();
                tblAllUserList.clear().draw();
                tblAllUserList.innerHTML = "";
                TotalPageNo = 1;
                SetAllUsersDetails(lstData);
                $("tbody td").css("white-space", "nowrap");
                SetPagination();
            },
            error: function (response) {
                console.log(response);
            }
        });
    }
    else {
        GetData(1);
    }
});

function SwitchDataTheme() {
    var data = localStorage.getItem('IsDark');
    if (data == 'NO') {
    }
    else {
        $('.content-wrapper').css({ 'background-color': 'black', 'color': 'white' });
        $('.datatableheader').css('background-color', 'var(--main-color-on-layoutchange)');
        $('li').css('color', 'white');
        $('.content-header>.breadcrumb>li>a').css('color', 'white');
        $('#mainWindow').css('background-color', 'black');
        $('.box-title').css('color', 'white');
        $('.even').removeClass('even');
        $('.odd').removeClass('odd');
        $('#tblAllUserList').removeClass('table-striped');
        $('.form-control').css({ 'border': '2px solid var(--main-color-on-layoutchange)', 'color': 'white', 'background-color': 'black' });
        $('.dataTables_empty').css({ 'border-top-color': 'black', 'background-color': 'black' });
        $('li.disabled > a').css({ 'background-color': 'black', 'color': 'white' });
        $('.main-footer').css({ 'background-color': 'black', 'color': 'white' });
        $('.table-bordered>thead>tr>th, .table-bordered>tbody>tr>th, .table-bordered>tfoot>tr>th, .table-bordered>thead>tr>td, .table-bordered>tbody>tr>td, .table-bordered>tfoot>tr>td').css('border', '1px solid var(--main-color-on-layoutchange)');
        $('.table-bordered').css('border', '1px solid var(--main-color-on-layoutchange)');
        $('input').css({ 'border': '2px solid var(--main-color-on-layoutchange)', 'background-color': 'black', 'color': 'white' });
        $('.box-header').css('color', 'white');
        $('label').css('color', 'white');
        $('.input-group-addon').css({ 'border': '1px solid var(--main-color-on-layoutchange)', 'background-color': 'black', 'color': 'white' });
        $('.select2-selection').css({ 'border': '2px solid var(--main-color-on-layoutchange)', 'background-color': 'black', 'color': 'white' });
        $('.select2-selection__rendered').css({ 'color': 'white' });
        $('.select2-results').css({ 'background-color': 'black' });
        $('tbody').css('color', 'white');
        $('ul.pagination >li>a').css({ 'background-color': 'black', 'color': 'white' });
        $('ul.pagination >li.active>a').css({ 'background-color': '#337ab7', 'color': 'white' });
        if (MySkin.SkinName != '') {
            NewUI = MySkin.SkinName;
        }
        else {
            if (typeof (Storage) !== 'undefined') {
                NewUI = localStorage.getItem('skin')
            }
        }
        if (NewUI == 'skin-black' || NewUI == 'skin-black-light') {
            $('.fixed-column').css('color', 'black');
            $('#tblAllUserList').css('color', 'black');
        }
        else {
            $('.fixed-column').css('color', 'white');
            $('.tblAllUserList').css('color', 'white');
        }
    }
}