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
    var Scripttype = $("#cboScriptExchange option:selected").text();
    var position = $("#position option:selected").val();
    var Strategyname = $("#cboStrategyName option:selected").val();
    var isLiveOrder = $("#isLiveOrder option:selected").val();
    var cboScriptTradingSymbol = $("#cboScriptTradingSymbol option:selected").val();

    var req = {
        Scripttype: Scripttype, position: position, value: Value, minutes: Minutes, hour: Hour, day: Day, months: Months,
        startDate: $('#rptStartDate').val(), endDate: $('#rptEndDate').val(), Strategyname: Strategyname, IsLive: isLiveOrder, PageNo: _CompletedCurrentPageNo, ScriptTradingSymbol: cboScriptTradingSymbol, UserID: 0, IsNotOwn: 0, IsAdmin: 0
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
                _OpeningBalance = lstData[0].Openingwalletbalance;
                var Profitorloss = 0; var Brokerage = 0;
                for (var i = 0; i < lstData.length; i++) {
                    var result = lstData[i];
                    Profitorloss += result.Profitorloss;
                    Brokerage += result.Brokerage;
                    _CompletedTotalPageNo = result.Total_Page;
                    _CheckCurrentPage = result.Total_Page;
                    SetCompletedTradeDetails(result);
                }
                $('#TotalProfitLoss').html(Profitorloss);
                $('#TotalBrokerage').html(Brokerage);
                if (Profitorloss >= 0) {
                    $('#TotalProfitLoss').css('color', 'rgba(0, 255, 64, 0.92)');
                } else {
                    $('#TotalProfitLoss').css('color', 'orangered');
                }
                if (lstData.length > 0) {
                    _CompletedPreviousTotalPageNo = lstData[0].Total_Page;
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
    if (item.TRADING_UNIT_TYPE == 1) {
        sQty = item.Qty / item.ScriptLotSize;
    } else {
        if (item.ScriptLotSize > 10 && item.ScriptExchange == "MCX" && ((item.COMPANY_INITIAL == "EXPO" && item.TENANT_ID == 51) || (item.COMPANY_INITIAL == "ASR" && item.TENANT_ID == 57) || item.COMPANY_INITIAL == "RVERMA")) {
            sQty = item.Qty / (item.ScriptLotSize / 10);
        } else {
            sQty = item.Qty;
        }
    }

    if (item.Status == "TGT2")
        item.Status = "TARGET";
    else if (item.Status == "TGT3")
        item.Status = "TARGET2";
    else if (item.Status == "TGT4")
        item.Status = "TARGET3";
    else if (item.Status == "SL")
        item.Status = "STOPLOSS";

    var BtnClick = '<a href="javascript:void(0)" title="View Transaction Detail" class="GetCompletedTradeDetail" style="display:none;margin-left: 10px;margin-right:10px;" data-bind=' + item.Completedtradeid + ' data-UserID=' + item.Completedtradeid + ' data-ScriptTradingSymbol=' + item.TradeSymbol + ' ><i class="fa fa-info-circle"></i> </a> ' +
        ' <a href="javascript:void(0)" title="Hide Transaction Detail" class="hideTranDetailRow" style="margin-left: 10px;margin-right:10px;font-size:15px;display:none;" ><i class="fa fa-arrow-circle-up"></i></a> ';

    item.Entryprice = (item.Entryprice).toFixed(2);
    item.Exitprice = (item.Exitprice).toFixed(2);
    item.Profitorloss = (item.Profitorloss).toFixed(2);

    var netProfitLoss = item.Profitorloss - item.Brokerage;
    // var table = $('#tblTransaction').DataTable().row.add([
    //     BtnClick + deleteTradeBtn + item.Completedtradeid,
    //     item.TradeSymbol,
    //     item.CurrentPosition,
    //     Strategyname,
    //     item.Status,
    //     item.Entrydate + " " + item.Entrytime,
    //     item.exitDate + " " + item.Exittime,
    //     item.Entryprice,
    //     item.Exitprice,
    //     sQty,
    //     tradingUnit,
    //     item.Profitorloss,
    //     item.Brokerage,
    //     netProfitLoss,
    //     item.Email
    // ]).draw();

    // Convert the date string to a format recognized by the Date constructor
    var formattedExitDate = item.ExitDate.split("-").reverse().join("/");

    // Create a new Date object
    var dateObject = new Date(formattedExitDate + " 00:00:00");

    // Get the month abbreviation and day
    var month = dateObject.toLocaleString('en-US', { month: 'short' });
    var day = dateObject.getDate();

    // Format the datetime string
    var formattedDateTime = `${day} ${month}`;

    var _CurrentPosition = '';
    if (item.CurrentPosition == 'Buy') {
        _CurrentPosition = '<input type="button" class="btn btn-primary p-0 m-0 btnBuySell" value="Buy">';
    } else {
        _CurrentPosition = '<input type="button" class="btn btn-danger p-0 m-0 btnBuySell" value="Sell">';
    }
    var ExtraDetails = '';
    if (netProfitLoss >= 0) {
        ExtraDetails = `<div class="col-5 p-0" style="display: flex;justify-content: right;">
                                                                                                        <h6 class="card-subtitle PriceSection">
                                                                                                                                    Q:${sQty} | PL:
                                                                                                        </h6>
                                                          <h6 class="card-subtitle PriceSection" style="color:dodgerblue">
                                                                                                                                    ${netProfitLoss.toFixed(2) }
                                                                                                        </h6>                                          </div>`;

    } else {
        ExtraDetails = `<div class="col-5 p-0" style="display: flex;justify-content: right;">
                                                                                                                <h6 class="card-subtitle PriceSection">
                                                                                                                                            Q:${sQty} | PL:
                                                                                                                </h6>
                                                                  <h6 class="card-subtitle PriceSection" style="color:orangered">
                                                                                                                                            ${netProfitLoss.toFixed(2) }
                                                                                                                </h6>                                          </div>`;

    }


    $('#watchlistDiv').append(`<li style="padding: 17px;">
                                                                                                                            <a href="#" onclick="CompletedTradeClick(${item.Completedtradeid},${item.UserID},'${item.TradeSymbol}')">
                                                                                <div class="col-12 p-0" style="display: flex;">
                                                                                    <div class="col-7 p-0">
                                                                                                <h6 class="card-subtitle">${item.TradeSymbol}</h6>
                                                                                    </div>
                                                                                           ${ExtraDetails}
                                                                                </div>
                                                                                <div class="col-12  p-0 pt-1" style="display: flex;">
                                                                                    <div class="col-6 p-0 d-flex" style="gap: 9px;">
                                                                                                ${_CurrentPosition}
                                                                                        <h6 class="card-subtitle ScriptexchangeSection">
                                                                                                    ${item.ScriptExchange}
                                                                                        </h6>
                                                                                    </div>
                                                                                    <div class="col-6 p-0 d-flex" style="gap: 9px;position: relative;justify-content: end;">

                                                                                                                <h6 class="card-subtitle ScriptexchangeSection" style="font-size: 14px!important;">${item.Status} on ${formattedDateTime}</h6>
                                                                                    </div>
                                                                                    <div class="col-6 p-0">
                                                                                    </div>
                                                                                </div>
                                                                            </a>
                                                                        </li>`);
}
function CompletedTradeClick(Completedtradeid, UserID, ScriptTradingSymbol) {
    var request = $.ajax({
        url: "/Trade/SetReportDetailDataMobile?Completedtradeid=" + Completedtradeid + "&UserID=" + UserID + "&ScriptTradingSymbol=" + ScriptTradingSymbol,
        type: "GET",
        async: false,
        success: function (tradeData) {
            if (tradeData != null) {
                console.log(tradeData);
                $("#txtTradeSymbol").val(tradeData.TradeSymbol);
                $("#txtEntryDate").val(tradeData.Entrydate);
                $("#txtEntryTime").val(tradeData.Entrytime);
                $("#txtEntryPrice").val(tradeData.Entryprice);
                $("#txtExitDate").val(tradeData.exitDate);
                $("#txtExitTime").val(tradeData.Exittime);
                $("#txtExitPrice").val(tradeData.Exitprice);
                $("#txtProfitLoss").val(tradeData.Profitorloss);
                $("#txtStatus").val(tradeData.Status);
                $("#txtCurrentPosition").val(tradeData.CurrentPosition);
                $("#txtQuantity").val(tradeData.Qty);
                $("#txtBrokerage").val(tradeData.Brokerage);
                $("#txtScriptExchange").val(tradeData.ScriptExchange);
                $('#btnCompleteddetails').trigger('click');
            }
        }
    });
}