var _NotificationTotalPageNo = 0;
var _NotificationPreviousTotalPageNo = 0;
var _NotificationCurrentPageNo = 1;
GetNotification();
function GetNotification() {
    var Input = { 'showLogsForAllUsers': '', 'PageNumber': _NotificationCurrentPageNo };
    $.ajax({
        type: 'Get',
        datatype: 'json',
        contentType: 'application/json',
        data: Input,
        url: '/Trade/notificationForUserWise',
        success: function (response) {
            var lstData = JSON.parse(response);
            $('#NotificationArea').html('');
            if (lstData != null) {
                if (lstData.length > 0) {
                    for (var i = 0; i < lstData.length; i++) {
                        var result = lstData[i];
                        SetAllNotificationDetails(result);
                    }
                    if (lstData.length > 0) {
                        _NotificationPreviousTotalPageNo = lstData[0].Total_Page;
                    }
                    else {
                        _NotificationPreviousTotalPageNo = 0;
                    }
                    SetPagination();
                }
            }
        },
        error: function (response) {
            console.log(response);
        }
    });
}
function SetPagination() {
    $('#btnPrev').removeAttr('disabled'); $('#btnNext').removeAttr('disabled');
    if (_NotificationPreviousTotalPageNo == 0) {
        $('#btnPrev').attr('disabled', 'disabled'); $('#btnNext').attr('disabled', 'disabled');
    }
    if (_NotificationCurrentPageNo == 1) {
        $('#btnPrev').attr('disabled', 'disabled');
    }
    if (_NotificationCurrentPageNo == _NotificationPreviousTotalPageNo) {
        $('#btnNext').attr('disabled', 'disabled');
    }
}
function ChangePage(Order) {
    if (Order == 0) {
        _NotificationCurrentPageNo -= 1;
    }
    if (Order == 1) {
        _NotificationCurrentPageNo += 1;
    }
    GetNotification();
}
function SetAllNotificationDetails(item) {
    var NotificationType = "";
    var Logo = `<ion-icon Name="mail"  role="img" class="ios hydrated"></ion-icon>`;
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
        Logo = `<ion-icon Name="lock-open"  role="img" class="ios hydrated"></ion-icon>`;
    } else if (item.Type == 6) {
        NotificationType = "New User Signed Up";
    } else if (item.Type == 7) {
        NotificationType = "Revert Trading";
    } else if (item.Type == 8) {
        NotificationType = "Weekly Balance Settlement";
    } else if (item.Type == 9) {
        NotificationType = "Fund Manager Subscription";
    } else if (item.Type == 10) {
        NotificationType = "Trade Converted to Longterm";
    }
    var isSeen = item.Seen == 0 ? " New" : "";
    // Assuming you have a datetime value from your AJAX response

    // // Format the datetime
    // var formattedDateTime = new Date(item.CreatedDate).toLocaleString('en-US', {
    //     year: '2-digit',
    //     month: 'short',
    //     day: 'numeric',
    //     hour: '2-digit',
    //     minute: '2-digit',
    //     hour12: true
    // });
    var dateObject = new Date(item.CreatedDate);
    // Get individual components
    var year = dateObject.getFullYear() % 100; // Extract last two digits
    var month = dateObject.toLocaleString('en-US', { month: 'short' });
    var day = dateObject.getDate();
    var hour = dateObject.getHours();
    var minute = dateObject.getMinutes();
    var period = hour >= 12 ? 'PM' : 'AM';

    // Format the datetime string
    var formattedDateTime = `${day} ${month} ${year}, ${hour}:${minute.toString().padStart(2, '0')} ${period}`;


    $('#NotificationArea').append(`
                                                                     <ul class="listview simple-listview notification-list" id="NotificationArea">
                            <li class="notification-item">
                                <div class="col-12 p-0 notification-row">
                                            <div class="col-1 p-0 notification-icon">
                                                ${Logo}
                                    </div>
                                            <div class="col-7 p-0 notification-content">
                                                <h6 class="notification-title">${NotificationType}</h6>
                                    </div>
                                            <div class="col-4 p-0 notification-time">
                                                <span class="notification-time-text">${formattedDateTime}</span>
                                    </div>
                                </div>
                                <div class="col-12 notification-details">
                                    <p class="notification-Description">
                                                        ${item.Description}
                                    </p>
                                </div>
                            </li>
                        </ul>

                                                            `);

    // Add the row to the DataTable with the specified columns
    // $('#dataTableNotifications').DataTable().row.add([
    //     item.Id + isSeen,
    //     item.Email,
    //     item.Description,
    //     NotificationType,
    //     item.CreatedDateString
    // ]).draw();


}