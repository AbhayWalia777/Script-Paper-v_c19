var _OpeningBalance = 0;
var _CompletedTotalPageNo = 1;
var _CompletedPreviousTotalPageNo = 1;
var _CompletedCurrentPageNo = 1;
var _CompletedCallBack = false;
document.getElementById("NavbarReport").classList.add("active");
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
    loadBarchart();
    //$('.select2').select2();
});
function ChangePage(Order) {
    if (Order == 0) {
        _CompletedCurrentPageNo -= 1;
    }
    if (Order == 1) {
        _CompletedCurrentPageNo += 1;
    }
    loadBarchart();
}
function MonthDifferent(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months;
}
function loadBarchart() {
    var fdate = new Date($('#rptStartDate').val());
    var ndate = new Date($('#rptEndDate').val());
    var diffMonth = MonthDifferent(fdate, ndate);
    if (diffMonth < 0) {
        ErrorAlert("To Date should not less than From date");
        return false;
    }
    else if (diffMonth > 6) {
        ErrorAlert("Please select date between six month range");
        return false;
    }
    //var req = {
    //    fromDate: $('#rptStartDate').val(),
    //    toDate: $('#rptEndDate').val()
    //}
    loadBarchartForTimeChart(0, false, false, false, false)
}
function SetPagination() {
    $('#btnPrev').removeAttr('disabled'); $('#btnNext').removeAttr('disabled');
    if (_CompletedPreviousTotalPageNo == 0) {
        $('#btnPrev').attr('disabled', 'disabled'); $('#btnNext').attr('disabled', 'disabled');
    }
    if (_CompletedCurrentPageNo == 1) {
        $('#btnPrev').attr('disabled', 'disabled');
    }
    if (_CompletedCurrentPageNo == _CompletedPreviousTotalPageNo) {
        $('#btnNext').attr('disabled', 'disabled');
    }
}
$("#cboScriptExchange").on('change', function () {
    try {
        var req = JSON.parse($("#selectedTimeStamp").val());
        if (req != null && req != undefined)
            loadBarchartForTimeChart(req.value, req.minutes, req.hour, req.day, req.months);
    }
    catch (err) {
        console.log(err);
    }
});
$("#position").on('change', function () {
    try {
        var req = JSON.parse($("#selectedTimeStamp").val());
        if (req != null && req != undefined)
            loadBarchartForTimeChart(req.value, req.minutes, req.hour, req.day, req.months);
    }
    catch (err) {
        console.log(err);
    }
});
$("#isLiveOrder").on('change', function () {
    try {
        var req = JSON.parse($("#selectedTimeStamp").val());
        if (req != null && req != undefined)
            loadBarchartForTimeChart(req.value, req.minutes, req.hour, req.day, req.months);
    }
    catch (err) {
        console.log(err);
    }
});
$("#cboStrategyName").on('change', function () {
    try {
        var req = JSON.parse($("#selectedTimeStamp").val());
        if (req != null && req != undefined)
            loadBarchartForTimeChart(req.value, req.minutes, req.hour, req.day, req.months);
    }
    catch (err) {
        console.log(err);
    }
});
$("#cboScriptTradingSymbol").on('change', function () {
    try {
        var req = JSON.parse($("#selectedTimeStamp").val());
        if (req != null && req != undefined)
            loadBarchartForTimeChart(req.value, req.minutes, req.hour, req.day, req.months);
    }
    catch (err) {
        console.log(err);
    }
});
function loadBarchartForTimeChart(Value, Minutes, Hour, Day, Months) {
    var scriptType = $("#cboScriptExchange option:selected").text();
    var Position = $("#position option:selected").val();
    var StrategyName = $("#cboStrategyName option:selected").val();
    var isLiveOrder = $("#isLiveOrder option:selected").val();
    var cboScriptTradingSymbol = $("#cboScriptTradingSymbol option:selected").val();

    var req = {
        ScriptType: scriptType, position: Position, value: Value, minutes: Minutes, hour: Hour, day: Day, months: Months,
        startDate: $('#rptStartDate').val(), endDate: $('#rptEndDate').val(), strategyName: StrategyName, IsLive: isLiveOrder, PageNo: _CompletedCurrentPageNo, ScriptTradingSymbol: cboScriptTradingSymbol, UserId: 0, IsNotOwn: 0, IsAdmin: 0
    }
    $.ajax({
        type: 'POST',
        datatype: 'json',

        url: '/Trade/GetTransactionHistoryForReports',
        data: req,
        success: function (response) {
            var responseData = response;
            $('#watchlistDiv').html('');
            var lstData = responseData;

            var _CheckCurrentPage;
            if (lstData.length > 0) {
                _OpeningBalance = lstData[0].OpeningWalletBalance;
                for (var i = 0; i < lstData.length; i++) {
                    var result = lstData[i];
                    _CompletedTotalPageNo = result.totaL_PAGE;
                    _CheckCurrentPage = result.totaL_PAGE;
                    SetCompletedTradeDetails(result);
                }
                if (lstData.length > 0) {
                    _CompletedPreviousTotalPageNo = lstData[0].totaL_PAGE;
                }
                else {
                    _CompletedPreviousTotalPageNo = 1;
                }
                SetPagination();
            } else{				
				$('#watchlistDiv').html('<p class="text-center">No Data Available.</p>');
			}
        },
        error: function (response) {
            console.log(response.d);
        }

    });

}
function SetCompletedTradeDetails(item) {
    var sQty;
    if (item.tradinG_UNIT_TYPE == 1) {
        sQty = item.qty / item.scriptLotSize;
    } else {
        if (item.scriptLotSize > 10 && item.scriptExchange == "MCX" && ((item.companY_INITIAL == "EXPO" && item.tenanT_ID == 51) || (item.companY_INITIAL == "ASR" && item.tenanT_ID == 57) || item.companY_INITIAL == "RVERMA")) {
            sQty = item.qty / (item.scriptLotSize / 10);
        } else {
            sQty = item.qty;
        }
    }

    if (item.status == "TGT2")
        item.status = "TARGET";
    else if (item.status == "TGT3")
        item.status = "TARGET2";
    else if (item.status == "TGT4")
        item.status = "TARGET3";
    else if (item.status == "SL")
        item.status = "STOPLOSS";

    var BtnClick = '<a href="javascript:void(0)" title="View Transaction Detail" class="GetCompletedTradeDetail" style="display:none;margin-left: 10px;margin-right:10px;" data-bind=' + item.completedTradeID + ' data-userid=' + item.completedTradeID + ' data-scripttradingsymbol=' + item.tradeSymbol + ' ><i class="fa fa-info-circle"></i> </a> ' +
        ' <a href="javascript:void(0)" title="Hide Transaction Detail" class="hideTranDetailRow" style="margin-left: 10px;margin-right:10px;font-size:15px;display:none;" ><i class="fa fa-arrow-circle-up"></i></a> ';

    item.entryPrice = (item.entryPrice).toFixed(2);
    item.exitPrice = (item.exitPrice).toFixed(2);
    item.profitOrLoss = (item.profitOrLoss).toFixed(2);

    var netProfitLoss = item.profitOrLoss - item.brokerage;
    // var table = $('#tblTransaction').DataTable().row.add([
    //     BtnClick + deleteTradeBtn + item.completedTradeID,
    //     item.tradeSymbol,
    //     item.currentPosition,
    //     strategyname,
    //     item.status,
    //     item.entryDate + " " + item.entryTime,
    //     item.exitDate + " " + item.exitTime,
    //     item.entryPrice,
    //     item.exitPrice,
    //     sQty,
    //     tradingUnit,
    //     item.profitOrLoss,
    //     item.brokerage,
    //     netProfitLoss,
    //     item.email
    // ]).draw();

    // Convert the date string to a format recognized by the Date constructor
    var formattedExitDate = item.exitDate.split("-").reverse().join("/");

    // Create a new Date object
    var dateObject = new Date(formattedExitDate + " 00:00:00");

    // Get the month abbreviation and day
    var month = dateObject.toLocaleString('en-US', { month: 'short' });
    var day = dateObject.getDate();

    // Format the datetime string
    var formattedDateTime = `${day} ${month}`;

    var _CurrentPosition = '';
    if (item.currentPosition == 'BUY') {
        _CurrentPosition = '<input type="button" class="btn btn-primary p-0 m-0 btnBuySell" value="BUY">';
    } else {
        _CurrentPosition = '<input type="button" class="btn btn-danger p-0 m-0 btnBuySell" value="SELL">';
    }
    var ExtraDetails = '';
    if (netProfitLoss >= 0) {
        ExtraDetails = `<div class="col-5 p-0" style="display: flex;justify-content: right;">
                                                                                                        <h6 class="card-subtitle PriceSection">
                                                                                                                                    Q:${sQty} | PL:
                                                                                                        </h6>
                                                          <h6 class="card-subtitle PriceSection" style="color:dodgerblue">
                                                                                                                                    ${netProfitLoss}
                                                                                                        </h6>                                          </div>`;

    } else {
        ExtraDetails = `<div class="col-5 p-0" style="display: flex;justify-content: right;">
                                                                                                                <h6 class="card-subtitle PriceSection">
                                                                                                                                            Q:${sQty} | PL:
                                                                                                                </h6>
                                                                  <h6 class="card-subtitle PriceSection" style="color:orangered">
                                                                                                                                            ${netProfitLoss}
                                                                                                                </h6>                                          </div>`;

    }


    $('#watchlistDiv').append(`<li style="padding: 17px;">
                                                                                                                            <a href="#" onclick="CompletedTradeClick(${item.completedTradeID},${item.userID},'${item.tradeSymbol}')">
                                                                                <div class="col-12 p-0" style="display: flex;">
                                                                                    <div class="col-7 p-0">
                                                                                                <h6 class="card-subtitle">${item.tradeSymbol}</h6>
                                                                                    </div>
                                                                                           ${ExtraDetails}
                                                                                </div>
                                                                                <div class="col-12  p-0 pt-1" style="display: flex;">
                                                                                    <div class="col-6 p-0 d-flex" style="gap: 9px;">
                                                                                                ${_CurrentPosition}
                                                                                        <h6 class="card-subtitle ScriptexchangeSection">
                                                                                                    ${item.scriptExchange}
                                                                                        </h6>
                                                                                    </div>
                                                                                    <div class="col-6 p-0 d-flex" style="gap: 9px;position: relative;justify-content: end;">

                                                                                                                <h6 class="card-subtitle ScriptexchangeSection" style="font-size: 14px!important;">${item.status} on ${formattedDateTime}</h6>
                                                                                    </div>
                                                                                    <div class="col-6 p-0">
                                                                                    </div>
                                                                                </div>
                                                                            </a>
                                                                        </li>`);
}
function CompletedTradeClick(CompletedTradeId, UserID, scriptTradingSymbol) {
    var request = $.ajax({
        url: "/Trade/SetReportDetailDataMobile?CompletedTradeId=" + CompletedTradeId + "&userid=" + UserID + "&scriptTradingSymbol=" + scriptTradingSymbol,
        type: "GET",
        async: false,
        success: function (tradeData) {
            if (tradeData != null) {
                console.log(tradeData);
                $("#txtTradeSymbol").val(tradeData.tradeSymbol);
                $("#txtEntryDate").val(tradeData.entryDate);
                $("#txtEntryTime").val(tradeData.entryTime);
                $("#txtEntryPrice").val(tradeData.entryPrice);
                $("#txtExitDate").val(tradeData.exitDate);
                $("#txtExitTime").val(tradeData.exitTime);
                $("#txtExitPrice").val(tradeData.exitPrice);
                $("#txtProfitLoss").val(tradeData.profitOrLoss);
                $("#txtStatus").val(tradeData.status);
                $("#txtCurrentPosition").val(tradeData.currentPosition);
                $("#txtQuantity").val(tradeData.qty);
                $("#txtBrokerage").val(tradeData.brokerage);
                $("#txtScriptExchange").val(tradeData.scriptExchange);
                $('#btnCompleteddetails').trigger('click');
            }
        }
    });
}