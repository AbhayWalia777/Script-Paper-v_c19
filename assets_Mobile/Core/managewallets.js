var TotalPageNo = 0;
var isCallf = false;
var Page_No = 1;

document.getElementById("NavbarWallet").classList.add("active");
function ChangePage(Order) {
    if (Order == 0) {
        Page_No -= 1;
    }
    if (Order == 1) {
        Page_No += 1;
    }
    GetData();
}
function SetPagination() {
    $('#btnPrev').removeAttr('disabled'); $('#btnNext').removeAttr('disabled');
    if (Page_No == 0) {
        $('#btnPrev').attr('disabled', 'disabled'); $('#btnNext').attr('disabled', 'disabled');
    }
    if (Page_No == 1) {
        $('#btnPrev').attr('disabled', 'disabled');
    }
    if (Page_No == TotalPageNo) {
        $('#btnNext').attr('disabled', 'disabled');
    }
}

$(document).ready(function () {
    var today = new Date();
    var date = new Date();
    date.setDate(date.getDate() - 30);

    var ddToday = String(today.getDate()).padStart(2, '0');
    var mmToday = String(today.getMonth() + 1).padStart(2, '0');
    var yyyyToday = today.getFullYear();
    var todayFormatted = yyyyToday + '-' + mmToday + '-' + ddToday;

    var ddPrevious = String(date.getDate()).padStart(2, '0');
    var mmPrevious = String(date.getMonth() + 1).padStart(2, '0');
    var yyyyPrevious = date.getFullYear();
    var previousDayFormatted = yyyyPrevious + '-' + mmPrevious + '-' + ddPrevious;

    $('#rptStartDate').val(previousDayFormatted);
    $('#rptEndDate').val(todayFormatted);
    GetData();
});

function GetData() {
    var req = {
        PageNo: Page_No,
        startDate: $('#rptStartDate').val(),
        endDate: $('#rptEndDate').val(),
        userId: 0
    };
    $.ajax({
        type: 'POST',
        datatype: 'json',
        url: '/Admin/GetWalletData',
        data: req,
        success: function (response) {
            var responseData = JSON.parse(response);
            $('#watchlistDiv').html('');
            var lstData = responseData;
            if (lstData.length > 0) {
                for (var i = 0; i < lstData.length; i++) {
                    var result = lstData[i];
                    TotalPageNo = parseInt(result.TOTAL_PAGES);
                    SetWalletTransactionDetails(result);
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
function SetWalletTransactionDetails(item) {
    var balance = parseFloat(item.Amount);
    var _balanceHtml = '';
    if (balance >= 0) {
        _balanceHtml = `<h6 class="card-subtitle" style="color:dodgerblue">
                                                                            ${balance.toFixed(2)}
                                                                </h6>`;
    } else {
        _balanceHtml = `<h6 class="card-subtitle" style="color:orangered">
                                                                                    ${balance.toFixed(2)}
                                                                        </h6>`;
    }
    $('#watchlistDiv').append(`
                                                            <li style="padding: 17px;">
                                                            <a href="#">
                                                                <div class="col-12 p-0" style="display: flex;">
                                                                        <div class="col-5 p-0">
                                                                                    ${_balanceHtml}
                                                                            </div>
                                                                    <div class="col-7 p-0" style="display: flex;justify-content: right;">
                                                                                <h6 class="card-subtitle">${item.Date_Time_string}</h6>
                                                                    </div>

                                                                </div>
                                                                <div class="col-12 p-0 pt-2" style="display: flex;">
                                                                                                <h6 class="card-subtitle">${item.Description}</h6>
                                                                </div>
                                                            </a>
                                                        </li>

                                                    `);
}