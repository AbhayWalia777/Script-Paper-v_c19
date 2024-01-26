var _OpeningBalance = 0;
var _CompletedTotalPageNo = 1;
var _CompletedPreviousTotalPageNo = 1;
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
        if(LevelLoginUser == 1 || LevelLoginUser == 2 ){
        if($('#UserIds option:selected').text()!='--Select--')
        {
        var userId = $('#UserIds').val();
        var isnotown=1;        

        var SubBrokerWise = document.getElementById('IsSubBrokerWise');
        var BrokerWise = document.getElementById('IsBrokerWise');
        var AdminWise = document.getElementById('IsAdminWise');
        
        if(AdminWise.checked == true || BrokerWise.checked == true|| SubBrokerWise.checked==true)
        var IsAdmin=1;
        else
        var IsAdmin=0;
        
        }
        else
        {
        var userId = 0;
        var isnotown=0;        
        var IsAdmin=0;
        }}
if(LevelLoginUser == 3 ){
        if($('#UserIds option:selected').text()!='--Select--')
        {
        var userId = $('#UserIds').val();
        var isnotown=1;        

        var BrokerWise = document.getElementById('IsBrokerWise');
        var SubBrokerWise = document.getElementById('IsSubBrokerWise');
        
        if(BrokerWise.checked == true || SubBrokerWise.checked==true)
        var IsAdmin=1;
        else
        var IsAdmin=0;
        
        }
        else
        {
        var userId = 0;
        var isnotown=0;        
        var IsAdmin=0;
        }}
if(LevelLoginUser == 4 ){
        if($('#UserIds option:selected').text()!='--Select--')
        {
        var userId = $('#UserIds').val();
        var isnotown=1;        

        var SubBrokerWise = document.getElementById('IsSubBrokerWise');
        
        if(SubBrokerWise.checked==true)
        var IsAdmin=1;
        else
        var IsAdmin=0;
        
        }
        else
        {
        var userId = 0;
        var isnotown=0;        
        var IsAdmin=0;
        }}
if(LevelLoginUser == 5 ){
        if($('#UserIds option:selected').text()!='--Select--')
        {
        var userId = $('#UserIds').val();
        var isnotown=1; 
        var IsAdmin=0;               
        }
        else
        {
        var userId = 0;
        var isnotown=0;        
        var IsAdmin=0;
        }}
    var req = {
        ScriptType: scriptType, position: Position, value: Value, minutes: Minutes, hour: Hour, day: Day, months: Months, 
        startDate: $('#rptStartDate').val(), endDate: $('#rptEndDate').val(), strategyName: StrategyName, IsLive: isLiveOrder, ScriptTradingSymbol: cboScriptTradingSymbol,UserId:userId,IsNotOwn:isnotown,IsAdmin:IsAdmin
    }
    $("#selectedTimeStamp").val(JSON.stringify(req));

    $.ajax({
        type: 'POST',
        datatype: 'json',
        
        url: '/Trade/GetReportDataForTimeStamp',
        data: req,
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
        if(LevelLoginUser == 1 || LevelLoginUser == 2 ){
        if($('#UserIds option:selected').text()!='--Select--')
        {
        var userId = $('#UserIds').val();
        var isnotown=1;        

        var BrokerWise = document.getElementById('IsBrokerWise');
        var AdminWise = document.getElementById('IsAdminWise');
        var SubBrokerWise = document.getElementById('IsSubBrokerWise');
        
        if(AdminWise.checked == true || BrokerWise.checked == true|| SubBrokerWise.checked==true)
        var IsAdmin=1;
        else
        var IsAdmin=0;
        
        }
        else
        {
        var userId = 0;
        var isnotown=0;        
        var IsAdmin=0;
        }}
if(LevelLoginUser == 3 ){
        if($('#UserIds option:selected').text()!='--Select--')
        {
        var userId = $('#UserIds').val();
        var isnotown=1;        

        var BrokerWise = document.getElementById('IsBrokerWise');
        var SubBrokerWise = document.getElementById('IsSubBrokerWise');
        
        if(BrokerWise.checked == true || SubBrokerWise.checked==true)
        var IsAdmin=1;
        else
        var IsAdmin=0;
        
        }
        else
        {
        var userId = 0;
        var isnotown=0;        
        var IsAdmin=0;
        }}
if(LevelLoginUser == 4 ){
        if($('#UserIds option:selected').text()!='--Select--')
        {
        var userId = $('#UserIds').val();
        var isnotown=1;        

        var SubBrokerWise = document.getElementById('IsSubBrokerWise');
        
        if(SubBrokerWise.checked==true)
        var IsAdmin=1;
        else
        var IsAdmin=0;
        
        }
        else
        {
        var userId = 0;
        var isnotown=0;        
        var IsAdmin=0;
        }}
if(LevelLoginUser == 5 ){
        if($('#UserIds option:selected').text()!='--Select--')
        {
        var userId = $('#UserIds').val();
        var isnotown=1; 
        var IsAdmin=0;               
        }
        else
        {
        var userId = 0;
        var isnotown=0;        
        var IsAdmin=0;
        }}
    req = {
        ScriptType: scriptType, position: Position, value: Value, minutes: Minutes, hour: Hour, day: Day, months: Months,
        startDate: $('#rptStartDate').val(), endDate: $('#rptEndDate').val(), strategyName: StrategyName, IsLive: isLiveOrder, PageNo: _CompletedCurrentPageNo, ScriptTradingSymbol: cboScriptTradingSymbol,UserId:userId,IsNotOwn:isnotown,IsAdmin:IsAdmin
    }
    $.ajax({
        type: 'POST',
        datatype: 'json',
        
        url: '/Trade/GetTransactionHistoryForReports',
        data: req,
        success: function (response) {
            var responseData = response;
            var tblTransaction = $('#tblTransaction').DataTable(  
                );
            tblTransaction.clear().draw();
            tblTransaction.innerHTML = "";
            var lstData = responseData;

            var _CheckCurrentPage;       
       if (lstData.length > 0) {
        _OpeningBalance = lstData[0].OpeningWalletBalance;
            for (var i = 0; i < lstData.length; i++) {
                var result = lstData[i];
                _CompletedTotalPageNo = result.totaL_PAGE;
                _CheckCurrentPage = result.totaL_PAGE;
                SetCompletedTradeDetails(result);
                $('#tblTransaction td:first-child').addClass('CompletedTradeModal_First_Td');
                BindClick();
                bindHideClick();
            }
           
            if (_CompletedPreviousTotalPageNo != _CheckCurrentPage) {
                CompletedPaginationDestroy();
            }

            if (lstData.length > 0) {
                _CompletedPreviousTotalPageNo = lstData[0].totaL_PAGE;
            }
            else {
               _CompletedPreviousTotalPageNo = 1;
            }
            SetCompletedPagination();
}
        },
        error: function (response) {
            console.log(response.d);
        }

    });

}
function SetCompletedTradeDetails(item) {
    var Credit=0;
    var Debit = 0;

    
    if (parseFloat(item.profitOrLoss) > 0) {
        Credit = parseFloat(item.profitOrLoss) + parseFloat(item.brokerage);
        Debit = 0;
        _OpeningBalance = parseFloat(_OpeningBalance) + parseFloat(item.profitOrLoss) + parseFloat(item.brokerage);
    } else if (parseFloat(item.profitOrLoss) <= 0) {
        Credit = 0;
        Debit = parseFloat(item.profitOrLoss) + parseFloat(item.brokerage);
        _OpeningBalance = parseFloat(_OpeningBalance) + parseFloat(item.profitOrLoss) + parseFloat(item.brokerage);
    } else if (parseFloat(item.profitOrLoss) == 0) {
        Credit = 0;
        Debit = 0;
    }
    var sQty;
    var tradingUnit;
    if (item.tradinG_UNIT_TYPE == 1) {
        sQty = item.qty / item.scriptLotSize;
        tradingUnit = item.tradinG_UNIT;
    } else {
        tradingUnit = item.tradinG_UNIT;
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

    var BtnClick = '<a href="javascript:void(0)" title="View Transaction Detail" class="GetCompletedTradeDetail" style="display:none;margin-left: 10px;margin-right:10px;" data-bind=' + item.completedTradeID + ' data-userid=' + item.userID + ' data-scripttradingsymbol=' + item.tradeSymbol + ' ><i class="fa fa-info-circle"></i> </a> ' +
        ' <a href="javascript:void(0)" title="Hide Transaction Detail" class="hideTranDetailRow" style="margin-left: 10px;margin-right:10px;font-size:15px;display:none;" ><i class="fa fa-arrow-circle-up"></i></a> ';
    var strategyname = item.strategyName;

    if ($("#CompanyInitial").val() == "RT") {
        strategyname = "ROBO";
    }

    var deleteTradeBtn = "";
    if (item.status != "CANCELED" && item.status != "REJECTED" && item.isLive == false && item.isSoftDeleted == 0) {
        deleteTradeBtn = '<a href="javascript:void(0)" onclick="DeleteCompletedTrade(' + item.completedTradeID + ')" data-bind=' + item.completedTradeID + ' style="margin-right:10px;" ><i class="fa fa-trash-o"></i> </a> ';
    } else {
        deleteTradeBtn = '<a href="javascript:void(0)" onclick="DeleteCompletedTrade(' + item.completedTradeID + ')" data-bind=' + item.completedTradeID + ' style="margin-right:10px;visibility: hidden;" ><i class="fa fa-trash-o"></i> </a> ';
    }
    var roleid = $("#Role_Id").val();
    if (roleid != 4) {
        if (roleid != 5) {
            deleteTradeBtn = "";
        }
    }
    if ($("#CompanyInitial").val() == "RT" && item.scriptExchange == "FOREX") {
        item.entryPrice = (item.entryPrice).toFixed(5);
        item.exitPrice = (item.exitPrice).toFixed(5);
        item.profitOrLoss = (item.profitOrLoss).toFixed(5);
    } else {
        item.entryPrice = (item.entryPrice).toFixed(2);
        item.exitPrice = (item.exitPrice).toFixed(2);
        item.profitOrLoss = (item.profitOrLoss).toFixed(2);
    }

    var netProfitLoss = item.profitOrLoss - item.brokerage;
    var table = $('#tblTransaction').DataTable().row.add([
        BtnClick + deleteTradeBtn + item.completedTradeID,
        item.tradeSymbol,
        item.currentPosition,
        strategyname,
        item.status,
        item.entryDate + " " + item.entryTime,
        item.exitDate + " " + item.exitTime,
        item.entryPrice,
        item.exitPrice,
        sQty,
        tradingUnit,
        item.profitOrLoss,
        item.brokerage,
        netProfitLoss,
        item.email
    ]).draw();

    var ctable = document.getElementById("tblTransaction");
    for (var i = 0; i < ctable.rows.length; i++) {
        var status = $(ctable.rows[i].cells[4]).text();
        if (status == "TARGET" || status == "TARGET2" || status == "TARGET3") {
            $(ctable.rows[i].cells[4]).css("background-color", "dodgerblue");
            $(ctable.rows[i].cells[4]).css("color", "white");
        }
        if (status == "STOPLOSS") {
            $(ctable.rows[i].cells[4]).css("background-color", "#ff4500b5");
            $(ctable.rows[i].cells[4]).css("color", "white");
        }
        var ProfitLoss = $(ctable.rows[i].cells[11]).text();
        if (ProfitLoss>=0) {
            $(ctable.rows[i].cells[11]).css({ "color":"#14a964","font-weight":"bold"});
        }
        if (ProfitLoss<0 ) {
            $(ctable.rows[i].cells[11]).css({ "color": "#d83824", "font-weight": "bold" });
        }


    }
}
//$('.DeleteCompletedTrade').on('click', function () {
//    var TransactionId = $(this).data('bind');
//    //var request = $.ajax({
//    //    url: "/Trade/SoftDeleteCompletedTrade?ID=" + TransactionId,
//    //    type: "GET",
//    //    async: true,
//    //    success: function (data) {
//    //        if (data != null) {
//    //            toastr.success(data);
//    //            SetCompletedTradeModalData();
//    //        }
//    //    }
//    //});
//    alert("hi");
//});
function DeleteCompletedTrade(TransactionId) {
    var result = confirm("Are you sure you want to delete?");
    if (result) {
        var request = $.ajax({
            url: "/Trade/SoftDeleteCompletedTrade?ID=" + TransactionId,
            type: "GET",
            async: true,
            success: function (data) {
                if (data != null) {
                    toastr.success(data);
                    //GetDataPageWise();
                    window.location.href = "/Trade/Report";
                }
            }
        });
    }
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
    //var req = {
    //    fromDate: $('#rptStartDate').val(),
    //    toDate: $('#rptEndDate').val()
    //}
    loadBarchartForTimeChart(0, false, false, false, false)

    //$.ajax({
    //    type: 'POST',
    //    datatype: 'json',
    //    
    //    url: '/Trade/GetReportData',
    //    data: req,
    //    success: function (response) {
    //        var responseData = JSON.parse(response);
    //        var lstData = responseData.d;
    //        $('#barChart').remove();
    //        $('#divbarChart').empty();
    //        $('#divbarChart').append("<canvas id='barChart'></canvas>");
    //        if ((lstData != null) && (lstData[0] == "No Data Found")) {
    //            fillEmptyAreaChart("#barChart");
    //        }
    //        else {

    //            var lstLabels = lstData[0];
    //            var datasets1 = lstData[1];
    //            var datasets2 = lstData[2];
    //            if (lstLabels == null || datasets1 == null && datasets1 == null) {

    //                fillEmptyAreaChart("#barChart");
    //            }
    //            else {
    //                // DrawLineChart(lstLabels, datasets1, datasets2, "#areaChart");
    //                DrawBarChart(lstLabels, datasets1, datasets2, "#barChart", "po");
    //            }
    //        }
    //    },
    //    error: function (response) {
    //        console.log(response.d);
    //    }

    //});
}

function DrawBarChart(lstLabels, datasets1, datasets2, chartId, type, datasets3) {
    var FinalDataSet = [];
    $.each(datasets1, function (key, value) {
        FinalDataSet.push(datasets1[key] + datasets2[key]);
    });

    const colors = FinalDataSet.map((value) => value < 0 ? 'red' : 'green');
    var totalProfit = 0;
    var totalLoss = 0;
    var TotalBrokerage = 0;
    jQuery.each(datasets1, function (index, item) {
        totalLoss += item;
    });
    jQuery.each(datasets2, function (index, item) {
        totalProfit += item;
    });
    jQuery.each(datasets3, function (index, item) {
        TotalBrokerage += item;
    });
    $("#TotalLoss").text(totalLoss.toFixed(2));
    $("#TotalProfit").text(totalProfit.toFixed(2));
    $("#TotalBrokerage").text(TotalBrokerage.toFixed(2));
    var netTotal = parseFloat(totalLoss.toFixed(2)) + parseFloat(totalProfit.toFixed(2)) - parseFloat(TotalBrokerage.toFixed(2));
    //netTotal = parseFloat(TotalBrokerage.toFixed(2) - parseFloat(netTotal.toFixed(2)));
    //var netProfitLossLabel = netTotal < 0 ? "Net Loss" : "Net Profit";
    var netProfitLossLabelBackgroundColor = netTotal < 0 ? "red" : "darkgreen";
    if (netTotal < 0) {
        $("#NetProfitLoss").text("Net Loss : " + netTotal.toFixed(2));
        $("#NetProfitLoss").css('color', 'red');
    }
    else {
        $("#NetProfitLoss").text("Net Profit : " + netTotal.toFixed(2));
        $("#NetProfitLoss").css('color', 'darkgreen');
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
    $("#TotalLoss").text("0.0000");
    $("#TotalProfit").text("0.0000");
    $("#TotalBrokerage").text("0.0000");
    $("#NetProfitLoss").text("");
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
LevelLoginUser=$('#LevelLoginUser').text();
    if ($("#CompanyInitial").val() != "RT") {
        $('.filterDiv').css("display", "inline-flex");
    }
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

    $('#tblTransaction').DataTable({
        "paging": false,
        "lengthChange": true,
        "order": [[0, 0, "desc"]],
        "processing": true,
        "responsive": true,
        dom: '<"top"lfB>rt<"bottom"pi><"clear">',
        buttons: [
            {
                extend: "excel",
                title:"Transaction History",
                className: "btn-info btn-sm"
            },
            {
                extend: "print",
                title: "Transaction History",
                className: "btn-info btn-sm"
            },
        ],
    });
    $('.dt-buttons').append('<button class="btn btn-default btn-info btn-sm" onClick="ExportPDF()">PDF</button>');
$('.select2').select2();
});
function SetCompletedPagination() {
    $('#TransactionPagination').twbsPagination({
        totalPages: _CompletedTotalPageNo,
        visiblePages: 2,
        onPageClick: function (event, page) {
            if (_CompletedCallBack)
            {
                _CompletedCurrentPageNo = page;
                GetDataPageWise();
            }
            else
                _CompletedCallBack = true;
        }
    });
}
function CompletedPaginationDestroy() {
    $('#TransactionPagination').empty();
    $('#TransactionPagination').removeData("twbs-pagination");
    $('#TransactionPagination').unbind("page");
}
function GetDataPageWise() {
    var scriptType = $("#cboScriptExchange option:selected").text();
    var Position = $("#position option:selected").val();
    var StrategyName = $("#cboStrategyName option:selected").val();
    var cboScriptTradingSymbol = $("#cboScriptTradingSymbol option:selected").val();
    var isLiveOrder = $("#isLiveOrder option:selected").val();
if(LevelLoginUser == 1 || LevelLoginUser == 2 ){
        if($('#UserIds option:selected').text()!='--Select--')
        {
        var userId = $('#UserIds').val();
        var isnotown=1;        

        var BrokerWise = document.getElementById('IsBrokerWise');
        var AdminWise = document.getElementById('IsAdminWise');
        var SubBrokerWise = document.getElementById('IsSubBrokerWise');
        
        if(AdminWise.checked == true || BrokerWise.checked == true || SubBrokerWise.checked==true)
        var IsAdmin=1;
        else
        var IsAdmin=0;
        
        }
        else
        {
        var userId = 0;
        var isnotown=0;        
        var IsAdmin=0;
        }}
if(LevelLoginUser == 3 ){
        if($('#UserIds option:selected').text()!='--Select--')
        {
        var userId = $('#UserIds').val();
        var isnotown=1;        

        var BrokerWise = document.getElementById('IsBrokerWise');
        var SubBrokerWise = document.getElementById('IsSubBrokerWise');
        
        if(BrokerWise.checked == true || SubBrokerWise.checked==true)
        var IsAdmin=1;
        else
        var IsAdmin=0;
        
        }
        else
        {
        var userId = 0;
        var isnotown=0;        
        var IsAdmin=0;
        }}
if(LevelLoginUser == 4 ){
        if($('#UserIds option:selected').text()!='--Select--')
        {
        var userId = $('#UserIds').val();
        var isnotown=1;        

        var SubBrokerWise = document.getElementById('IsSubBrokerWise');
        
        if(SubBrokerWise.checked==true)
        var IsAdmin=1;
        else
        var IsAdmin=0;
        
        }
        else
        {
        var userId = 0;
        var isnotown=0;        
        var IsAdmin=0;
        }}
if(LevelLoginUser == 5 ){
        if($('#UserIds option:selected').text()!='--Select--')
        {
        var userId = $('#UserIds').val();
        var isnotown=1; 
        var IsAdmin=0;               
        }
        else
        {
        var userId = 0;
        var isnotown=0;        
        var IsAdmin=0;
        }
    }
    var req = JSON.parse($("#selectedTimeStamp").val());
    var req = {
        ScriptType: scriptType, position: Position, value: req.value, minutes: req.minutes, hour: req.hour, day: req.day, months: req.months,
        startDate: $('#rptStartDate').val(), endDate: $('#rptEndDate').val(), strategyName: StrategyName, IsLive: isLiveOrder, PageNo: _CompletedCurrentPageNo,
        ScriptTradingSymbol: cboScriptTradingSymbol,UserId:userId,IsNotOwn:isnotown,IsAdmin:IsAdmin
    }
    $.ajax({
        type: 'POST',
        datatype: 'json',
        
        url: '/Trade/GetTransactionHistoryForReports',
        data: req,
        success: function (response) {
            var responseData = response;
            var tblTransaction = $('#tblTransaction').DataTable(
            );
            tblTransaction.clear().draw();
            tblTransaction.innerHTML = "";
            var lstData = responseData;

            var _CheckCurrentPage;
            _OpeningBalance = lstData[0].OpeningWalletBalance;
            for (var i = 0; i < lstData.length; i++) {
                var result = lstData[i];
                _CompletedTotalPageNo = result.totaL_PAGE;
                _CheckCurrentPage = result.totaL_PAGE;
               
                SetCompletedTradeDetails(result);
                $('#tblTransaction td:first-child').addClass('CompletedTradeModal_First_Td');
              
                BindClick();
                bindHideClick();
            }
            
            if (_CompletedPreviousTotalPageNo != _CheckCurrentPage) {
                CompletedPaginationDestroy();
            }

            if (lstData.length > 0) {
                _CompletedPreviousTotalPageNo = lstData[0].totaL_PAGE;
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
SwitchDataTheme();
}
function bindHideClick() {
    $(".hideTranDetailRow").bind('click', function () {
        $(this).css("display", "none");
        $("#TranDetail").css('display','none');
        $("#TranDetail").remove();
    });
}
function BindClick() {
    $('.GetCompletedTradeDetail').bind('click', function () {

        $(".hideTranDetailRow").hide();
        var tr = $(this).closest('tr');
        var upButton = $(tr).find('.hideTranDetailRow');
        $(upButton).show();
        var TransactionId = $(this).data('bind');
        var userid = $(this).data('userid');
        var scriptTradingSymbol = $(this).data('scripttradingsymbol');
        var request = $.ajax({
            url: "/Trade/SetReportDetailData?CompletedTradeId=" + TransactionId + "&userid=" + userid + "&scriptTradingSymbol=" + scriptTradingSymbol,
            type: "GET",
            async: false,
            success: function (data) {
                if (data != null) {
                    $("#TranDetail").remove();
                    $(data).insertAfter(tr);
                }
            }
        });
    });
}
$('#IsAdminWise').on('click',function(){

var BrokerWise = document.getElementById('IsBrokerWise');
var SubBrokerWise = document.getElementById('IsSubBrokerWise');
var AdminWise = document.getElementById('IsAdminWise');

SubBrokerWise.checked=false;
BrokerWise.checked=false;

if(AdminWise.checked==true)
GetUserList(1);
else
GetUserList(0);

});
$('#IsBrokerWise').on('click',function(){

var BrokerWise = document.getElementById('IsBrokerWise');
var SubBrokerWise = document.getElementById('IsSubBrokerWise');
var AdminWise = document.getElementById('IsAdminWise');

SubBrokerWise.checked=false;
if(LevelLoginUser == 1 || LevelLoginUser == 2 )
AdminWise.checked=false;

if(BrokerWise.checked==true)
GetUserList(2);
else
GetUserList(0);

});
$('#IsSubBrokerWise').on('click',function(){

var BrokerWise = document.getElementById('IsBrokerWise');
var SubBrokerWise = document.getElementById('IsSubBrokerWise');
var AdminWise = document.getElementById('IsAdminWise');

if(LevelLoginUser == 1 || LevelLoginUser == 2 )
AdminWise.checked=false;
if(LevelLoginUser == 1 || LevelLoginUser == 2 || LevelLoginUser == 3)
BrokerWise.checked=false;

if(SubBrokerWise.checked==true)
GetUserList(3);
else
GetUserList(0);

});
function GetUserList(IsAdminOrBroker)
{
            var input = "";
            input={'IsAdmin':IsAdminOrBroker};
            var request = $.ajax({
                url: "/Trade/GetUsersListByAdminOrBroker",
                type: "Get",
                data: input,
                success: function (data) {
                            SetDropDownData(data);
                                        }
});
}

function SetDropDownData(data)
{
            $('#UserIds').empty();
            $('#UserIds').html('');
            $('#UserIds').append($("<option></option>").val("").html("--Select--"));
            $.each(data, function (i, item) {
                $('#UserIds').append($("<option></option>").val(item.UserID).html(item.Email));
                        });
}

 function SwitchDataTheme() {
        var data = localStorage.getItem('IsDark');
        if (data == 'NO') {
    }
    else {
        $('.content-wrapper').css({'background-color': 'black' ,'color' : 'white'});
        $('.box-default').css({'background-color': 'black' ,'color' : 'white'});
        $('.datatableheader').css({'background-color':'var(--main-color-on-layoutchange)','color':'black'});
        $('li').css('color','white');
        $('.content-header>.breadcrumb>li>a').css('color','white');
        $('#mainWindow').css('background-color','black');
        $('.box-title').css('color','white');
        $('.even').removeClass('even');
        $('.odd').removeClass('odd');
        $('#tblTransaction').removeClass('table-striped');
        $('#Change-On-Dark-Theme').removeClass('table-striped');
        $('.form-control').css({'border':'2px solid var(--main-color-on-layoutchange)','color':'white','background-color':'black'});
        $('.dataTables_empty').css({'border-top-color':'black','background-color':'black'});
        $('li.disabled > a').css({'background-color':'black','color':'white'});
        $('.main-footer').css({'background-color':'black','color':'white'});
        $('.table-bordered>thead>tr>th, .table-bordered>tbody>tr>th, .table-bordered>tfoot>tr>th, .table-bordered>thead>tr>td, .table-bordered>tbody>tr>td, .table-bordered>tfoot>tr>td').css('border','1px solid var(--main-color-on-layoutchange)');
        $('.table-bordered').css('border','1px solid var(--main-color-on-layoutchange)');
        $('input').css({'border':'2px solid var(--main-color-on-layoutchange)','background-color':'black','color':'white'});
        
        $('.breadcrumb').css('background-color','black');
        $('.box').css('border-top-color','black');
        $('.box-default').css('border-top-color','black');
        $('label').css('color','white');
        $('.input-group-addon').css({'border': '1px solid var(--main-color-on-layoutchange)', 'background-color': 'black','color': 'white'});
        $('.select2-selection').css({'border': '2px solid var(--main-color-on-layoutchange)', 'background-color': 'black','color': 'white'});
        $('.select2-selection__rendered').css({'color': 'white'});
        $('tblWatchListTradeListBody > tr').css('background-color','black');
        $('tblActiveTradeBody > tr').css('background-color','black');
        $('.modal-body').css('background-color','black');
        $('.modal-footer').css('background-color','black');
        $('input:radio').addClass('checkBox-color-change');
        $('#rdPaper').removeClass('checkBox-color-change');
        $('.modal-header > button').css('color','black');
        $('#transactionalDetails').css({'background-color':'black','color':'white'});
        $('.change-completed-detail-UINew').css('color','white');
        $('.profit').css('color','lime');
        $('.TotalBrokerage').css('color','mediumpurple');
        $('.box-header').css({'background-color':'black','color':'white'});
        $('ul.pagination >li>a').css({'background-color':'black','color':'white'});
        $('ul.pagination >li.active>a').css({'background-color':'#337ab7','color':'white'});
        $('.datepicker-days').css({'background-color': 'black','color': 'white'});
        $('.box-default').css({'background':'black','color':'white'});
        $('.box-body').css({'color':'white'});$('h4').css({'color':'white'});
if (MySkin.SkinName != '')
        {
        NewUI = MySkin.SkinName;
        }
        else
        {
        if (typeof (Storage) !== 'undefined') {
            NewUI = localStorage.getItem('skin')
        }
        }
        if (NewUI == 'skin-black' || NewUI == 'skin-black-light') {
        $('.fixed-column').css('color','black');
        }
        else
        {
        $('.fixed-column').css('color','white');
        }
    }
}
function ExportPDF() {

    var UserId = $('#UserIds option:selected').val() != '' ? $('#UserIds').val() : '0';
    var fdate = $('#rptStartDate').val();
    var ndate = $('#rptEndDate').val();

    var url = "/Report/PrepareScriptWiseReport?reportType=Export4" + "&IsAdminWise=" + 0 + "&UserId=" + UserId + "&IsNotOwn=" + 0 + "&ScriptName=ALL" + "&startDate=" + fdate + "&endDate=" + ndate;
    $('<a href="' + url + '" target="blank"></a>')[0].click();
}
function loadSelectedTimeInterval() {
    $('#exampleModalCenter').modal('hide');
    var selectedValue = document.getElementById("timeIntervalDropdown").value;
    // Extract values and call the appropriate function
    var values = selectedValue.split(",");
    loadBarchartForTimeChart(values[0], values[1] === 'true', values[2] === 'true', values[3] === 'true', values[4] === 'true');
}