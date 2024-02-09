var _OpeningBalance = 0;
var _CompletedTotalPageNo = 0;
var _CompletedPreviousTotalPageNo = 0;
var _CompletedCurrentPageNo = 1;
var _CompletedCallBack = false;
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
        var req = JSON.parse($("#isLiveOrder").val());
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
function loadBarchartForTimeChart(Value, Minutes, Hour, Day, Months) {
    var Scripttype = $("#cboScriptExchange option:selected").text();
    var position = $("#position option:selected").val();
    var Strategyname = $("#cboStrategyName option:selected").val();
    var isLiveOrder = $("#isLiveOrder option:selected").val();
    var req = {
        Scripttype: Scripttype, position: position, value: Value, minutes: Minutes, hour: Hour, day: Day, months: Months, 
        startDate: $('#rptStartDate').val(), endDate: $('#rptEndDate').val(), Strategyname: Strategyname, IsLive: isLiveOrder
    }
    $("#selectedTimeStamp").val(JSON.stringify(req));

    $.ajax({
        type: 'POST',
        datatype: 'json',
        contentType: 'application/json',
        url: '/Trade/GetReportDataForTimeStamp',
        data: JSON.stringify(req),
        success: function (response) {
            var responseData = JSON.parse(response);
            var lstData = responseData.d;
            $('#barChart').remove();
            $('#divbarChart').empty();
            $('#divbarChart').append("<canvas id='barChart'></canvas>");
            if ((lstData != null) && (lstData[0] == "No Data Found")) {
                fillEmptyAreaChart("#barChart");
            }
            else {

                var lstLabels = lstData[0];
                var datasets1 = lstData[1];
                var datasets2 = lstData[2];
                var datasets3 = lstData[3];
                if (lstLabels == null || datasets1 == null && datasets1 == null) {

                    fillEmptyAreaChart("#barChart");
                }
                else {
                    // DrawLineChart(lstLabels, datasets1, datasets2, "#areaChart");
                    DrawBarChart(lstLabels, datasets1, datasets2, "#barChart", "po", datasets3);
                }
            }
        },
        error: function (response) {
            console.log(response.d);
        }

    });
    req = {
        Scripttype: Scripttype, position: position, value: Value, minutes: Minutes, hour: Hour, day: Day, months: Months,
        startDate: $('#rptStartDate').val(), endDate: $('#rptEndDate').val(), Strategyname: Strategyname, IsLive: isLiveOrder, PageNo: _CompletedCurrentPageNo
    }
    $.ajax({
        type: 'POST',
        datatype: 'json',
        contentType: 'application/json',
        url: '/Trade/GetTransactionHistoryForReports',
        data: JSON.stringify(req),
        success: function (response) {
            var responseData = (response);
            
            var lstData = responseData;
            $("#CompletedTradeDiv").html('');
            var _CheckCurrentPage;
            //_OpeningBalance = lstData[0].Openingwalletbalance;
           
            for (var i = 0; i < lstData.length; i++) {
                var result = lstData[i];
                _CompletedTotalPageNo = result.Total_Page;
                _CheckCurrentPage = result.Total_Page;
                SetCompletedTradeDetails(result);
            }
           
            if (_CompletedPreviousTotalPageNo != _CheckCurrentPage) {
                CompletedPaginationDestroy();
            }

            if (lstData.length > 0) {
                _CompletedPreviousTotalPageNo = lstData[0].Total_Page;
            }
            else {
                _CompletedPreviousTotalPageNo = 1;
            }

            SetCompletedPagination();
            
        },
        error: function (response) {
            console.log(response.d);
        }

    });

}
function SetCompletedTradeDetails(item) {
        var P_L = "";
        var CP = "";
        if (parseFloat(item.Profitorloss) >= 0) {
            P_L = '<font style="color:rgb(91, 233, 91);font-weight:bold;">' + item.Profitorloss + '</font>';
        }
        else if (parseFloat(item.Profitorloss) < 0) {
            P_L = '<font style="color:#ff4a4a;font-weight:bold;">' + item.Profitorloss + '</font>';
        }
    var sQty;
    if (item.TRADING_UNIT_TYPE == 1) {
        sQty = item.Qty / item.ScriptLotSize;
    }
    else {
        if (item.ScriptLotSize > 10 && item.ScriptExchange == "MCX" && ((item.COMPANY_INITIAL == "EXPO" && item.TENANT_ID == 51) || (item.COMPANY_INITIAL == "ASR" && item.TENANT_ID == 57) || (item.COMPANY_INITIAL == "RVERMA"))) {
            sQty = item.Qty / (item.ScriptLotSize / 10);
        } else {
            sQty = item.Qty;
        }
    }
    var GetQtyType = item.TRADING_UNIT.toLowerCase() == "Qty" ? 'U' : '';
    var css = "row-New-Theme watchlistRow";

if(item.ScriptExchange == "FOREX" && $("#Companyinitials").val() == "RT")
    {
    item.Entryprice=(item.Entryprice).toFixed(5);
    item.Exitprice=(item.Exitprice).toFixed(5);
    }
    var html = '<div class="row activeTradeRow" data-id=' + item.Completedtradeid + ' data-UserID=' + item.UserID + ' data-ScriptName=' + item.TradeSymbol +'>' +
            '<div class="col-12" >' +
            '<div class="' + css + '">' +
            '<div class="card-body" style="padding:5px;">' +
            '   <div class="row">' +
            '<div class="col-7">' +
            ' <p class="watchlist-p" style="font-size: 14px; margin-bottom: 5px;">' + item.TradeSymbol + '</p>' +
            '</div>' +
            '<div class="col-5">' +
            '     <div class="row" style="margin-top:3px;">' +
            '          <div class="col-5">' +
        '               <label class="watchlist-p" style="font-size: 12px"> Qty: ' + sQty + GetQtyType + '</label>' +
            '          </div>' +
            
            '              </div>' +
            '           </div>' +
            '<div class="col-5">' +
            '  <p class="watchlist-p" style="font-size: 13px;  margin-bottom: 7px;margin-top:7px;">ENTRY : ' + item.Entryprice + ' </p>' +
            '</div>' +
            '<div class="col-5">' +
            '  <p class="watchlist-p" style="font-size: 13px;  margin-bottom: 7px;margin-top:7px;">EXIT : ' + item.Exitprice + ' </p>' +
            '</div>' +
        '<div class="col-12" >' +
        '  <p class="watchlist-p" style="font-size: 13px;  margin-bottom: 7px;margin-top:7px;"> P&L : ' + P_L + ' | CP : ' + item.CurrentPosition + '</p>' +
        '  <p class="watchlist-p" style="font-size: 13px;  margin-bottom: 7px;margin-top:7px;">ENTRY TIME :  ' + item.Entrydate + " " + item.Entrytime + '  </p>' +
        '  <p class="watchlist-p" style="font-size: 13px;  margin-bottom: 7px;margin-top:7px;">EXIT TIME :  ' + item.ExitDate + " " + item.Exittime + '  </p>' +
        '  <p class="watchlist-p" style="font-size: 13px;  margin-bottom: 7px;margin-top:7px;">Brokerage :  ' + item.Brokerage +  '  </p>' +
            '</div>' +
            '        </div>' +
            '     </div>' +
            '  </div>' +
            '</div >' +
            '</div >';

        $('#CompletedTradeDiv').append(html);
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
        alert("To Date should not less than From date");
        return false;
    }
    else if (diffMonth > 6) {
        alert("Please select date between six month range");
        return false;
    }

    loadBarchartForTimeChart(0, false, false, false, false)

  
}

function DrawBarChart(lstLabels, datasets1, datasets2, chartId, type, datasets3) {
    var FinalDataSet = [];
    $.each(datasets1, function (key, value) {
        FinalDataSet.push(datasets1[key] + datasets2[key]);
    });

    const colors = FinalDataSet.map((value) => value < 0 ? 'red' : 'green');
    var Totalprofit = 0;
    var Totalloss = 0;
    var TotalBrokerage = 0;
    jQuery.each(datasets1, function (index, item) {
        Totalloss += item;
    });
    jQuery.each(datasets2, function (index, item) {
        Totalprofit += item;
    });
    jQuery.each(datasets3, function (index, item) {
        TotalBrokerage += item;
    });
    $("#Totalloss").text(Totalloss.toFixed(2));
    $("#Totalprofit").text(Totalprofit.toFixed(2));
    $("#TotalBrokerage").text(TotalBrokerage.toFixed(2));
    var netTotal = parseFloat(TotalBrokerage.toFixed(2)) + parseFloat(Totalloss.toFixed(2)) + parseFloat(Totalprofit.toFixed(2));
    //netTotal = parseFloat(TotalBrokerage.toFixed(2) - parseFloat(netTotal.toFixed(2)));
    //var netProfitLossLabel = netTotal < 0 ? "Net Loss" : "Net Profit";
    var netProfitLossLabelBackgroundColor = netTotal < 0 ? "red" : "darkgreen";
    if (netTotal < 0) {
        $("#NetProfitLoss").text(netTotal.toFixed(2));
    }
    else {
        $("#NetProfitLoss").text(netTotal.toFixed(2));
    }
    var data = {
        labels: lstLabels,
        showInLegend: true,
        legend: {
            fontSize: 20,
            fontFamily: "tamoha",
            fontColor: "Sienna"
        },
        datasets: [
            {
                //label: "Net P&L",
                backgroundColor: colors,
                borderColor: 'rgb(252,186,3)',
                data: FinalDataSet
            }]
    };

    var ctx = $(chartId).get(0).getContext('2d');
    ctx.canvas.height = 300;  // setting height of canvas
    ctx.canvas.width = 1000; // setting width of canvas

    var lineChart = new Chart(ctx,
        {
            type: 'bar',
            data: data,
            Options: {
                showScale: true,
                responsive: true,
                maintainAspectRatio: false,
                animations: {
                    tension: {
                        duration: 1000,
                        easing: 'linear',
                        from: 1,
                        to: 0,
                        loop: false
                    }
                },
                tooltips: {
                    'enabled': false
                }
            }
        });

   
}
function fillEmptyAreaChart(chartId) {
    var data = {
        labels: ["January", "February", "March", "April", "May", "June"],
        showInLegend: true,
        legend: {
            fontSize: 20,
            fontFamily: "tamoha",
            fontColor: "Sienna"
        },
        datasets: [
            {
                label: "Net Profit / Loss",
                backgroundColor: 'red',
                borderColor: 'green',
                data: []
            }]
    };

    var ctx = $(chartId).get(0).getContext('2d');
    ctx.canvas.height = 300;  // setting height of canvas
    ctx.canvas.width = 500; // setting width of canvas

    var lineChart = new Chart(ctx,
        {
            type: 'bar',
            data: data,
            Options: {
                showScale: true,
                responsive: true,
                maintainAspectRatio: false
            }
        });
    $("#Totalloss").text("0.0000");
    $("#Totalprofit").text("0.0000");
    $("#TotalBrokerage").text("0.0000");
    $("#NetProfitLoss").text("0.0000");
}
function makeChart() {
    $('.classDate').inputmask('mm/dd/yyyy', { 'placeholder': 'mm/dd/yyyy' })

    $('.classDate').datepicker({
        autoclose: true,
        useCurrent: true,
        todayHighlight: true,
        todayBtn: "linked",
    });

    fillEmptyAreaChart("#barChart");
}
$(document).ready(function () {
    makeChart();
    var today = new Date();
    var date = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    date.setDate(date.getDate() - 7);
    dd = String(date.getDate()).padStart(2, '0');
    mm = String(date.getMonth() + 1).padStart(2, '0');
    yyyy = date.getFullYear();
    var previousDay = mm + '/' + dd + '/' + yyyy;

    $('#rptStartDate').val(previousDay);
    $('#rptEndDate').val(today);
    loadBarchart();
    $('#backbtn').css('color', '#fff');
    $('#backbtn').on('click', function () {
        window.location.href = "/Trade/Index";
    });
    $(document).on('click', '.activeTradeRow', function () {
        var ScriptCode = $(this).attr('data-id');
        var scriptTradingSymbol = $(this).attr('data-ScriptName');
        var UserID = $(this).attr('data-UserID');
        var request = $.ajax({
            url: "/Trade/SetMobileReportDetailData",
            type: "POST",
            data: { Completedtradeid: ScriptCode, UserID: UserID, scriptTradingSymbol: scriptTradingSymbol },

            success: function (data) {
                $("#MarketDepthModal .modal-body").html(data)
                $('#MarketDepthModal').modal({
                    backdrop: false,
                    show: true
                });
                $("body").removeClass('modal-open');
                return false;
            }
        });
    });
});
function HideDepthModal() {
    $("#MarketDepthModal").modal('hide');
}

function SetCompletedPagination() {
    //$('#TransactionPagination').twbsPagination({
    //    totalPages: _CompletedTotalPageNo,
    //    visiblePages: 2,
    //    onPageClick: function (event, page) {
    //        if (_CompletedCallBack)
    //        {
    //            _CompletedCurrentPageNo = page;
    //            GetDataPageWise();
    //        }
    //        else
    //            _CompletedCallBack = true;
    //    }
    //});
}
function CompletedPaginationDestroy() {
    $('#TransactionPagination').empty();
    $('#TransactionPagination').removeData("twbs-pagination");
    $('#TransactionPagination').unbind("page");
}
function GetDataPageWise() {
    var Scripttype = $("#cboScriptExchange option:selected").text();
    var position = $("#position option:selected").val();
    var Strategyname = $("#cboStrategyName option:selected").val();
    var isLiveOrder = $("#isLiveOrder option:selected").val();
    var req = JSON.parse($("#selectedTimeStamp").val());

    var req = {
        Scripttype: Scripttype, position: position, value: req.value, minutes: req.minutes, hour: req.hour, day: req.day, months: req.months,
        startDate: $('#rptStartDate').val(), endDate: $('#rptEndDate').val(), Strategyname: Strategyname, IsLive: isLiveOrder, PageNo: _CompletedCurrentPageNo
    }
    $.ajax({
        type: 'POST',
        datatype: 'json',
        contentType: 'application/json',
        url: '/Trade/GetTransactionHistoryForReports',
        data: JSON.stringify(req),
        success: function (response) {
            var responseData = (response);

            var lstData = responseData;
            $("#CompletedTradeDiv").html('');
            var _CheckCurrentPage;
            //_OpeningBalance = lstData[0].Openingwalletbalance;
            
            for (var i = 0; i < lstData.length; i++) {
                var result = lstData[i];
                _CompletedTotalPageNo = result.Total_Page;
                _CheckCurrentPage = result.Total_Page;
               
                SetCompletedTradeDetails(result);
            }
            
            if (_CompletedPreviousTotalPageNo != _CheckCurrentPage) {
                CompletedPaginationDestroy();
            }

            if (lstData.length > 0) {
                _CompletedPreviousTotalPageNo = lstData[0].Total_Page;
            }
            else {
                _CompletedPreviousTotalPageNo = 1;
            }

            SetCompletedPagination();

        },
        error: function (response) {
            console.log(response.d);
        }
    });
}
function ExportPDF() {

    var UserID = $('#UserID').val();
    var fdate = $('#rptStartDate').val();
    var ndate = $('#rptEndDate').val();

    var req = {
        reportType: "Export7", UserID: UserID, IsNotOwn: 0, ScriptName: "ALL", startDate: fdate, endDate: ndate
    };
    $.ajax({
        type: 'GET',
        datatype: 'json',
        url: '/Report/AndroidPrepareScriptWiseReport',
        data: req,
        success: function (response) {
            if (response != null) {
                $('#AndroidPrepareScriptWiseReport').val(response);
                $('#ReportPdf').show();
                $('#btnGet').trigger('click');
            }
        }
    });
}
function ReportPdf() {

    var UserID = $('#UserID').val();
    var fdate = $('#rptStartDate').val();
    var ndate = $('#rptEndDate').val();

    var url = "/Report/PrepareScriptWiseReport?reportType=Export4" + "&IsAdminWise=" + 0 + "&UserID=" + UserID + "&IsNotOwn=" + 0 + "&ScriptName=ALL" + "&startDate=" + fdate + "&endDate=" + ndate;
    $('<a href="' + url + '" target="Blank"></a>')[0].click();
}
//function bindHideClick() {
//    $(".hideTranDetailRow").bind('click', function () {
//        $(this).css("display", "none");
//        $("#TranDetail").remove();
//    });
//}
//function BindClick() {
//        $('.activeTradeRow').bind('click', function () {
//            var ScriptCode = $(this).attr('data-id');
//            window.location.href = "/Trade/SetMobileReportDetailData?Completedtradeid=" + ScriptCode;
//        });
//}