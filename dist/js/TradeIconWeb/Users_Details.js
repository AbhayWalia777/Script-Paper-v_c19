var totalPageNo = 0;
var isCallf = false;
var _currentpage = 1;
var _NotificationTotalPageNo = 0;
var _NotificationPreviousTotalPageNo = 0;
var _NotificationCurrentPageNo = 1;
var _NotificationCallBack = false;
$(document).ready(function () {
    $('#TableAllUsers').DataTable({
        "paging": false,
        "lengthChange": false,
        "info": false,
        "ordering": true,
        "searching": true,
        "responsive": true
    });
    $('#TblNotifications').DataTable({
        "paging": false,
        "lengthChange": false,
        "info": false,
        "ordering": true,
        "searching": true,
        "responsive": true
    });
    GetData(1);
});

function GetData(page) {
    $.ajax({
        type: 'Get',
        datatype: 'json',
        contentType: 'application/json',
        url: '/Admin/_GetAllUser?PageNo=' + page,
        success: function (response) {
            var lstData = JSON.parse(response);
            var TableAllUsers = $('#TableAllUsers').DataTable();
            TableAllUsers.clear().draw();
            TableAllUsers.innerHTML = "";

            if (lstData.length > 0) {
                $("tbody td").css("white-space", "nowrap");
                for (var i = 0; i < lstData.length; i++) {
                    var result = lstData[i];
                    TotalPageNo = parseInt(result.TOTAL_PAGE);
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
}
function SetPagination() {
    $('#UserTblPaging').twbsPagination({
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

    var View = '<a href="#" onclick="GetNotification(' + item.UserID+');">History</a>';

    var table = $('#TableAllUsers').DataTable().row.add([
        item.UserID,
        item.UserName,
        item.RoleName,
        item.Source,
        item.UserIP,
        item.LastUserLogin,
        View
    ]).order([0, 'desc']).draw();
}

function GetNotification(UserId) {
    var Input = { 'AdminsUserId': UserId, 'PageNumber': _NotificationCurrentPageNo};
    $.ajax({
        type: 'Get',
        datatype: 'json',
        contentType: 'application/json',
        data: Input,
        url: '/Trade/notificationForUserWise',
        success: function (response) {
            var lstData = JSON.parse(response);
            var TblNotifications = $('#TblNotifications').DataTable();
            TblNotifications.clear().draw();
            TblNotifications.innerHTML = "";
            var _CheckCurrentPage;
            if (lstData != null) {
                if (lstData.length > 0) {
                    for (var i = 0; i < lstData.length; i++) {
                        var result = lstData[i];
                        _NotificationTotalPageNo = result.Total_Page;
                        _CheckCurrentPage = result.Total_Page;
                        if (result.Type == 5) {
                            SetAllNotificationDetails(result);
                        }
                    }
                    if (_NotificationPreviousTotalPageNo != _CheckCurrentPage) {
                        NotificationPaginationDestroy();
                    }

                    if (lstData.length > 0) {
                        _NotificationPreviousTotalPageNo = lstData[0].Total_Page;
                    }
                    else {
                        _NotificationPreviousTotalPageNo = 1;
                    }
                    SetNotificationPagination();
                    var htmlData = _CheckCurrentPage > 0 ? "Showing Page " + _NotificationCurrentPageNo + " Of " + _CheckCurrentPage + " Pages" : "No Data Found.";
                    $('#TblNotifications_info').html(htmlData);
                }
            }

        },
        error: function (response) {
            console.log(response);
        }
    });
    $('#NotificationModal').show();
}
function SetAllNotificationDetails(item) {
    var table = $('#TblNotifications').DataTable().row.add([
        item.Source,
        item.UserIP,
        item.CreatedDate,
        item.Description,
        item.CreatedDate
    ]).order([0, 'desc']).draw();
}
function SetNotificationPagination() {
    $('#TransactionPagination').twbsPagination({
        totalPages: _NotificationTotalPageNo,
        visiblePages: 2,
        onPageClick: function (event, page) {
            if (_NotificationCallBack) {
                _NotificationCurrentPageNo = page;
                GetNotification();
            }
            else
                _NotificationCallBack = true;
        }
    });
}
function NotificationPaginationDestroy() {
    $('#TransactionPagination').empty();
    $('#TransactionPagination').removeData("twbs-pagination");
    $('#TransactionPagination').unbind("page");
}