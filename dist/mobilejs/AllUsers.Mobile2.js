
//#region Document Ready Function
$(document).ready(function () {
    //#region Call User Get Details 
    GetUserData(1);
    //#endregion

    //#region Voice Recognition
    $(".searchButton").on('click', function () {
        if (window.hasOwnProperty('webkitSpeechRecognition')) {
            var recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = "en-US";
            recognition.start();
            $("#microphone").modal('show');
            recognition.onresult = function (e) {
                $("#searchText").val(e.results[0][0].transcript);
                recognition.stop();
                $("#microphone").modal('hide');
            }
            recognition.onerror = function (e) {
                recognition.stop();
                $("#microphone").modal('hide');
            }
        }
        else {
            toastr.error("Your Browser Does Not Support's This Feature.");
        }
    });
    //#endregion Voice Recognition
    $("#searchText").on('keyup', function () {
        if ($('#searchText').val() != '') {
            $.ajax({
                type: 'Get',
                datatype: 'json',
                contentType: 'application/json',
                url: '/Admin/GetAllUserForMobile?searchedData=' + $('#searchText').val(),
                success: function (response) {
                    var parsedUserData = JSON.parse(response);
                    $('#UserListDiv').html('');
                    for (var i = 0; i < parsedUserData.length; i++) {
                        var result = parsedUserData[i];
                        SetAllUsersDetails(result);
                    }
                },
                error: function (response) {
                    console.log(response);
                }
            });
        }
        else {
            GetUserData(1);
        }
    });
    $("#searchText").on('change', function () {
        if ($('#searchText').val() != '') {
            $.ajax({
                type: 'Get',
                datatype: 'json',
                contentType: 'application/json',
                url: '/Admin/GetAllUserForMobile?searchedData=' + $('#searchText').val(),
                success: function (response) {
                    var parsedUserData = JSON.parse(response);
                    $('#UserListDiv').html('');
                    for (var i = 0; i < parsedUserData.length; i++) {
                        var result = parsedUserData[i];
                        SetAllUsersDetails(result);
                    }
                },
                error: function (response) {
                    console.log(response);
                }
            });
        }
        else {
            GetUserData(1);
        }
    });



    $("#UserListDiv").delegate('.AllUserRow', 'click', function () {
        if (screen.width <= 768) {
            var userId = $(this).attr('id');
            var tenantId = $(this).attr('data-tenantId');

            var EditUserUrl = '/Admin/ManageUser/' + userId;
            var ChangePasswordUrl = '/Admin/ChangePassword/' + userId;
            var AddBalanceUrl = '/Admin/AddBalance?UserId=' + userId + '&TenantId=' + tenantId + '&returnUrl=AllUsers';
            var WithdrawalUrl = '/Admin/Withdrawal?UserId=' + userId + '&TenantId=' + tenantId + '&returnUrl=AllUsers';
            var ScriptExposureUrl = '/Admin/ManageBrokerage/?ID=' + userId;
            $('.mobileEditBtn').attr('href', EditUserUrl);
            $('.mobilePasswordBtn').attr('href', ChangePasswordUrl);
            $('.mobileDepositBtn').attr('href', AddBalanceUrl);
            $('.mobileWithdrawalBtn').attr('href', WithdrawalUrl);
            $('.mobileScriptExposureBtn').attr('href', ScriptExposureUrl);

            $('.mobile-context-menu').css('display', 'block');
        }
    });
});
//#endregion

document.body.addEventListener('click', function (event) {
    var element = document.querySelector('ul.mobile-context-menu-list.list-flat');
    var element2 = document.querySelector('#UserListDiv');
    if (element != '' && element != null) {
        if (!element.contains(event.target) && !element2.contains(event.target)) {
            $('.mobile-context-menu').css('display', 'none');
        }
    }
});


function GetUserData(page) {
    $.ajax({
        type: 'Get',
        datatype: 'json',
        contentType: 'application/json',
        url: '/Admin/GetAllUserForMobile?PageNo=' + page,
        success: function (response) {
            var parsedUserData = JSON.parse(response);
            if (parsedUserData.length > 0) {
                $('#UserListDiv').html('');
                for (var i = 0; i < parsedUserData.length; i++) {
                    var result = parsedUserData[i];
                    SetAllUsersDetails(result);
                }
            }
            else {
                $('#UserListDiv').html('<b>No Data Available</b>');
                $('#UserListDiv').css('text-align', 'center')
            }
        },
        error: function (response) {
            console.log(response);
        }
    });
}


function SetAllUsersDetails(item) {

    var netProfit = item.TotalLoss + item.TotalProfit;
    var html = '<div class="row p-2 AllUserRow" id="' + item.UserID + '" data-tenantId="' + item.TenantId+'"' +
        '<div class="col-12" > ' +
        '<div class="watchlist-card c-left-border watchlist-table">' +
        '<div class="card-body" style="padding:5px;">' +
        '   <div class="row">' +
        '<div class="col-xs-3 col-md-3 col-sm-3">' +
        ' <img src="' + item.UserImage + '" class="user-image">' +
        '</div>' +
        '<div class="col-xs-9 col-sm-9 col-md-9">' +
        '     <div class="row BID_ASK_SEGMENT" style="margin-top:-5px;margin-left:-8px">' +
        '             <div class="col-xs-12 col-sm-12 col-md-12" style="margin-left:-15px;display: flex;">' +
        '                  <div class="user-text"><span class="user-text user-text-span">Name : </span>' + item.FullName+'</div>' +
        '             </div>' +
        '             <div class="col-xs-12 col-sm-12 col-md-12" style="margin-left:-15px;display: flex;">' +
        '                  <div class="user-text"><span class="user-text user-text-span">User name : </span>' + item.UserName + '</div>' +
        '             </div>' +
        '             <div class="col-xs-8 col-sm-8 col-md-8" style="margin-left:-15px;display: flex;">' +
        '                  <div class="user-text"><span class="user-text user-text-span">Role: </span>' + item.RoleName + '</div>' +
        '              </div>' +
        '             <div class="col-xs-5 col-sm-5 col-md-5" style="margin-left:-15px;display: flex;">' +
        '                  <div class="user-text"><span class="user-text user-text-span">Active: </span>' + item.IsActive + '</div>' +
        '             </div>' +
        '           </div>' +
        '<div class="col-12 user-text" style="display:flex;margin-left:-8px" >' +
        '<span class="user-text user-text-span" style="margin-top: 0px;margin-right: 6px;">Email: </span>' + item.Email + '</div>' +
        '<div class="col-12 user-text" style="display:flex;margin-left:-8px" >' +
        '<span class="user-text user-text-span" style="margin-top: 0px;margin-right: 6px;">Balance: </span>' + item.Balance + '</div>' +
        '<div class="col-xs-6 col-sm-6 col-md-6 user-text" style="display:flex;margin-left:-23px" >' +
        '<span class="user-text user-text-span" style="margin-top: 0px;margin-right: 6px;">P/L: </span>' + netProfit + '</div>' +
        '<div class="col-xs-6 col-sm-6 col-md-6 user-text" style="display:flex;margin-left:-8px" >' +
        '<span class="user-text user-text-span" style="margin-top: 0px;margin-right: 6px;">Sponsor: </span>' + item.Sponsorid + '</div>' +
        '</div>' +
            '</div>' +

        '        </div>' +
        '     </div>' +
        
        '  </div>' +
        '</div >' +
        '</div >';

    $('#UserListDiv').append(html);
}
//function SetAllUsersDetails(item) {
//    var DeleteAction = "";
//    var Watchlist = "";
//    var FullNameUrl = "";
//    var ViewAllUsers = "";
//    if (RoleId == 4 && ($("#companyInitial").val() == "SC" || $("#companyInitial").val() == "DT") || $("#companyInitial").val() == "EXPO") {
//        Watchlist = '<a href="/Watchlist/Index/?userid=' + item.UserID + '" class="btn btn-warning margin-right-5px">Watchlist </a>'
//    }
//    if ($("#companyInitial").val() == "EXPO") {
//        ViewAllUsers = '<a href="/Admin/ViewUsers?AdminId=' + item.UserID + '"><button type="button" class="btn btn-warning btn-sm margin-right-5px">View Users<i class="fa fa-user-alt"></i></button> </a>';
//    }
//    if (RoleId == 5) {
//        DeleteAction = '<a href="javascript:void(0)" id="' + item.UserID + '" class="delete-prompt margin-right-5px">' +
//            '<button type="button" class="btn btn-danger btn-sm" style="height: 33px;"><i class="fa fa fa-trash-o"></i></button></a>';
//        FullNameUrl = '<a id="aUserLogin" class="aUserLogin" data-id="' + item.UserID + '" target="_blank" href="/Admin/UserLoginFromAdmin?UserId=' + item.UserID + '">' + item.FullName + '</a>';
//    } else {
//        FullNameUrl = item.FullName;
//    }
//    var Action = '<a href="/Admin/ManageUser/' + item.UserID + '"><button type="button" class="btn btn-primary btn-sm margin-right-5px" style="height: 33px;"><i class="fa fa-pencil"></i></button></a>' +
//        '<a href = "/Admin/ChangePassword/' + item.UserID + '" > <button type="button" class="btn btn-info btn-sm margin-right-5px" style="height: 33px;"><i class="fa fa-key"></i></button></a>' +
//        '<a href="/Admin/AddBalance?UserId=' + item.UserID + '&TenantId=' + item.TenantId + '&returnUrl=AllUsers" class="btn btn-success margin-right-5px">Deposit </a> ' +
//        ' <a href="/Admin/Withdrawal/?UserId=' + item.UserID + '&TenantId=' + item.TenantId + '&returnUrl=AllUsers" class="btn btn-warning margin-right-5px">Withdrawal </a>';
//    Action += DeleteAction;
//    Action += Watchlist;
//    Action += ViewAllUsers;
//    var netProfit = item.TotalLoss + item.TotalProfit;
//    var getLevel = $('#HdnLevel').text();
//    if (getLevel != 1) {
//        var table = $('#tblAllUserList').DataTable().row.add([
//            item.CreatedDateString,
//            item.UserName,
//            item.Sponsorid,
//            FullNameUrl,
//            item.Email,
//            item.ExpiryDateString,
//            item.RoleName,
//            netProfit.toFixed(2),
//            item.Balance,
//            item.IsActive,
//            Action
//        ]).order([0, 'desc']).draw();
//    }
//    else {
//        var table = $('#tblAllUserList').DataTable().row.add([
//            item.CompanyName,
//            item.CreatedDateString,
//            item.UserName,
//            item.Sponsorid,
//            FullNameUrl,
//            item.Email,
//            item.ExpiryDateString,
//            item.RoleName,
//            netProfit.toFixed(2),
//            item.Balance,
//            item.IsActive,
//            Action
//        ]).order([0, 'desc']).draw();
//    }


    
//}

