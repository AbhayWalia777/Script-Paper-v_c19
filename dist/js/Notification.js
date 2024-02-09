var _NotificationTotalPageNo = 0;
var _NotificationPreviousTotalPageNo = 0;
var _NotificationCurrentPageNo = 1;
var _NotificationCallBack = false;

$(document).ready(function () {
    var NewUI = '';
    if ($('#dataTableNotifications').length) {
        $('#dataTableNotifications').DataTable({
            searching: false,
            responsive: true,
            info: false,
            lengthChange: false,
            paging: false,
            order: [[0, 0, "desc"]]
        });
    }
    GetNotification();
    $.ajax({
        url: '/Trade/UpdateNotificationStatus',
        type: 'GET',
        success: function () {
        },
        error: function () {
        }
    });

    function ShowToastNotificaiton() {
        var dateTime = document.getElementById('lastNoticationTime').value;
        if (dateTime === '') {
            var a = new Date();
            dateTime = a.getFullYear() +
                '-' + (a.getMonth() + 1) +
                '-' + a.getDate() +
                ' ' + a.getHours() +
                ':' + (a.getMinutes() + 1) +
                ':' + a.getSeconds();
        }
        $.ajax({
            url: '/Trade/GetNotificationToast?dateTime=' + dateTime,
            type: 'GET',
            success: function (data) {
                for (var i = 0; i < data.length; i++) {
                    toastr.success(data[i].UserID + ' ' + data[i].Desc);
                }
                if (data.length >= 1) {
                    document.getElementById('lastNoticationTime').value = data[data.length - 1].Date;
                }
                else {
                    document.getElementById('lastNoticationTime').value = dateTime;
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
    setInterval(ShowToastNotificaiton, 60000);
});

function PaginationColor() {
    $('ul.pagination >li>a').css({ 'background-color': 'black', 'color': 'white' });
    $('ul.pagination >li.active>a').css({ 'background-color': '#337ab7', 'color': 'white' });
    $('.table-bordered>thead>tr>th, .table-bordered>tbody>tr>th, .table-bordered>tfoot>tr>th, .table-bordered>thead>tr>td, .table-bordered>tbody>tr>td, .table-bordered>tfoot>tr>td').css('border', '1px solid var(--main-color-on-layoutchange)');
    $('.table-bordered').css('border', '1px solid var(--main-color-on-layoutchange)');
}

function GetNotification() {
    var Input = { 'showLogsForAllUsers': $('#IsShowingAllLogs').val(), 'PageNumber': _NotificationCurrentPageNo };
    $.ajax({
        type: 'Get',
        datatype: 'json',
        contentType: 'application/json',
        data: Input,
        url: '/Trade/notificationForUserWise',
        success: function (response) {
            var lstData = JSON.parse(response);
            var table = $('#dataTableNotifications').DataTable();
            table.clear().draw();
            table.innerHTML = ' ';
            var _CheckCurrentPage;
            if (lstData != null) {
                if (lstData.length > 0) {
                    for (var i = 0; i < lstData.length; i++) {
                        var result = lstData[i];
                        _NotificationTotalPageNo = result.Total_Page;
                        _CheckCurrentPage = result.Total_Page;
                        SetAllNotificationDetails(result);
                        var titles = ['Id', 'Email', 'Description', 'Type', 'CreatedDate'];
                        $('td:lt(5)').each(function (index) {
                            $(this).attr('data-title', titles[index]);
                        });
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
                    $('#dataTableNotifications_info').html(htmlData);
                }
            }
        },
        error: function (response) {
            console.log(response);
        }
    });
}

function SetAllNotificationDetails(item) {
    var NotificationType = "";
    if (item.Type == 1) {
        NotificationType = "Trade Auto Sqr Offed";
    } else if (item.Type == 2) {
        NotificationType = "Balance Is Lower Than Threashold";
    } else if (item.Type == 3) {
        NotificationType = "Trade Booked Manually";
    } else if (item.Type == 4) {
        NotificationType = "Trade Square Off Manually";
    } else if (item.Type == 5) {
        NotificationType = "User Logged";
    } else if (item.Type == 6) {
        NotificationType = "New User Signed Up";
    } else if (item.Type == 7) {
        NotificationType = "Revert Trading";
    } else if (item.Type == 8) {
        NotificationType = "Weekly Balance Settlement";
    } else if (item.Type == 9) {
        NotificationType = "Fund Manager Subscription";
    }
    var isSeen = item.Seen == 0 ? " New" : "";
 
    // Add the row to the DataTable with the specified columns
    $('#dataTableNotifications').DataTable().row.add([
        item.Id + isSeen,
        item.Email,
        item.Description,
        NotificationType,
        item.CreatedDateString 
        ]).draw();


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
