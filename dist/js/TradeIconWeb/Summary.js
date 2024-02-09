var ActiveTradeInterval;
var ActiveTradeInterval1;
var CurrentActiveTradeID = 0;
var IsFindButtonClicked = false;
var StringUserID = 0;
$(document).ready(function () {
    GetSummeryData();
    $(".loader").fadeOut(2000);
    $(".navbar").fadeIn(2000);
    
    $("#summary").click(function () {
        GetSummeryData();
    });
    
    $(".close1").click(function () {
        $(".orderdiv").hide();
    });
    $(".close2").click(function () {
        $(".tradediv").hide();
    });
    $(".close3").click(function () {
        $(".positiondiv").hide();
    });

    
    $("#tblSummery").DataTable({
        "lengthChange": false,
        "order": true,
        "searching": false,
        "paging": false,
        "responsive": true
    });
    $("#ordertable").DataTable({
        "lengthChange": false,
        "order": true,
        "searching": true,
        "paging": false,
        "responsive": true
    });
    $("#tradetable").DataTable({
        "lengthChange": false,
        "order": true,
        "searching": true,
        "paging": false,
        "responsive": true
    });
    $("#positiontable").DataTable({
        "lengthChange": false,
        "order": true,
        "searching": true,
        "paging": false,
        "responsive": true
    });
    ActiveTradeInterval1 = window.setInterval(function () { GetOrderData(); }, 5000);
});
// Completed data starts from here
//Running Order data starts from here


function GetSummeryData() {
    $.ajax({
        url: "/Admin/AllUserDetailsWithM2m",
        type: "GET",
        dataType: "json",
        success: function (data) {
            var tblSummery = $('#tblSummery').DataTable();
            tblSummery.clear().draw();
            tblSummery.innerHTML = "";
            for (var i = 0; i < data.length; i++) {
                var inputdata = data[i];
                SetSummeryData(inputdata);
            }
        }
    });

}
function OrderDataPopUp(ThisUserID) {
    $(".orderdiv").show();
    StringUserID = ThisUserID;
    GetPendingData();
}
function tradeDataPopUp(ThisUserID) {
    $(".tradediv").show();
    StringUserID = ThisUserID;
    GetPendingData();
}
function positionDataPopUp(ThisUserID) {
    $(".positiondiv").show();
    StringUserID = ThisUserID;
    LoadData();
}
function SetSummeryData(item) {

    var Orders = '<td><a href="#" onclick="OrderDataPopUp(' + item.UserID + ');">View</a></td>';
    var Trade = '<td><a href="#" onclick="tradeDataPopUp(' + item.UserID + ');">View</a></td>';
    var positions = '<td><a href="#" onclick="positionDataPopUp(' + item.UserID + ');">View</a></td>';


    $('#tblSummery').DataTable().row.add([
        item.Username,
        '<span style="display:inline-flex;">' + item.Fullname + '</span>',
        item.TotalMaginBalance,
        item.UsedMaginBalance,
        item.TotalMaginBalance - item.UsedMaginBalance,
        item.Balance,
        item.Total_M2m_ProfitLoss,
        item.Balance + item.Total_M2m_ProfitLoss,
        Orders,
        Trade,
        positions
    ]).draw();
}

//Order and Trades Data For summary Page
function GetPendingData() {
    var TotalPending = 0;
    var TotalCompleted = 0;
    var input = { 'IsAdminWise': 0, 'UserID': StringUserID };
    $.ajax({
        url: "/Trade/GetDataManageTransaction",
        type: "GET",
        dataType: "json",
        data: input,
        success: function (result) {
            var data = JSON.parse(result);
            if (data != null) {
                var TblPending = $('#ordertable').DataTable();
                TblPending.clear().draw();
                TblPending.innerHTML = "";
                var tblcomplete = $('#tradetable').DataTable();
                tblcomplete.clear().draw();
                tblcomplete.innerHTML = "";
                if (data.ActiveTrade.length > 0) {
                    for (var i = 0; i < data.ActiveTrade.length; i++) {
                        var inputdata = data.ActiveTrade[i];
                        if (inputdata.Status.toUpperCase() != "COMPLETE") {
                            TotalPending += 1;
                            SetPendingData(inputdata, "ordertable");
                        }
                        if (inputdata.Status.toUpperCase() == "COMPLETE") {
                            TotalCompleted += 1;
                            SetCompletedData(inputdata, "tradetable");
                        }
                    }
                    if (CurrentActiveTradeID > 0) {
                        EditTrade(CurrentActiveTradeID);
                    }
                }
                var Executetable = document.getElementById("ordertable");
                for (var i = 0; i < Executetable.rows.length; i++) {
                    if ($(Executetable.rows[i].cells[5]).text() == 'Buy') {
                        $(Executetable.rows[i]).css("background-color", "lightblue");

                    }
                    else if ($(Executetable.rows[i].cells[5]).text() == 'Sell') {
                        $(Executetable.rows[i]).css("background-color", "#f1a2a2");

                    }
                }
                var Completedtable = document.getElementById("tradetable");
                for (var i = 0; i < Completedtable.rows.length; i++) {
                    if ($(Completedtable.rows[i].cells[5]).text() == 'Buy') {
                        $(Completedtable.rows[i]).css("background-color", "lightblue");

                    }
                    else if ($(Completedtable.rows[i].cells[5]).text() == 'Sell') {
                        $(Completedtable.rows[i]).css("background-color", "#f1a2a2");

                    }
                }
            }
        }
    });
}
function SetPendingData(item, TableName) {
    var user = "";
    if (item.Userroleid == 1)
        user = "Administrator";
    if (item.Userroleid == 2)
        user = "User";
    if (item.Userroleid == 3)
        user = "Broker";
    if (item.Userroleid == 4)
        user = "SuperAdministrator";
    if (item.Userroleid == 5)
        user = "Support";
    if (item.Userroleid == 6)
        user = "Fund Manager";
    if (item.Userroleid == 7)
        user = "Sub Broker";

    var symbolParam = '\'' + item.TradeSymbol + '\'';
    var ScriptInstrumentType = '\'' + item.ScriptInstrumentType + '\'';
    var ProductType = '\'' + item.ProductType + '\'';
    var PriceType = '\'' + item.PriceType + '\'';
    var pos = '\'' + item.CurrentPosition.toString() + '\'';
    var st = '\'' + item.Status.toString() + '\'';
    var ScriptExchange = '\'' + item.ObjScriptDTO.ScriptExchange.toString() + '\'';
    var BuyOrSell = item.CurrentPositionNew == "Buy" ? 1 : 0;

    var sQty;
    if (item.TRADING_UNIT_TYPE == 1) {
        sQty = item.Qty / item.ObjScriptDTO.ScriptLotSize;
    }
    else {
        if (item.ObjScriptDTO.ScriptLotSize > 10 && item.ObjScriptDTO.ScriptExchange == "MCX" && ((item.COMPANY_INITIAL == "EXPO" && item.TENANT_ID == 51) || (item.COMPANY_INITIAL == "ASR" && item.TENANT_ID == 57) || item.COMPANY_INITIAL == "RVERMA")) {
            sQty = item.Qty / (item.ObjScriptDTO.ScriptLotSize / 10);
        } else {
            sQty = item.Qty;
        }
    }
    var deleteTrade = '<a href="#" style="color:red;font-weight:bold;font-size:25px;padding-left:30px;" onclick="DeleteActiveTrade(' + item.ActiveTradeID + ',' + item.UserID + ',0)">x</a>';

    var HighPrice = "<span style='display:inline-flex;font-size:12px;'>H : " + item.high + "</span><br /> ";
    var LowPrice = "<span style='display:inline-flex;font-size:12px;'>L : " + item.low + "</span><br /> ";
    var BidPrice = "<span style='display:inline-flex;font-size:12px;'>BR : " + item.ObjScriptDTO.Bid + "</span><br /> ";
    var AskPrice = "<span style='display:inline-flex;font-size:12px;'>AR : " + item.ObjScriptDTO.Ask + "</span><br /> ";
    var Lastprice = "<span style='display:inline-flex;font-size:12px;font-weight:bold;'>LTP : " + item.ObjScriptDTO.Lastprice + "</span><br /> ";
    var InputOrderPrice = '<input type="text" id="InputPrice' + item.ActiveTradeID + '" value="' + item.OrderPrice + '" /><br />';
    var InputQty = '<input type="text" id="InputQty' + item.ActiveTradeID + '" value="' + sQty + '" /><br />';
    var ModificationSection = '<a class="fa fa-edit" id="EDIT' + item.ActiveTradeID + '" onclick="EditTrade(' + item.ActiveTradeID + ')" ></a>' + '<a style="display:none;" class="fa fa-save" id="UPDATE' + item.ActiveTradeID + '" onclick="UpdateTrade(' + item.ActiveTradeID + ',' + item.WID + ',' + item.ScriptCode + ',' + pos + ',' + item.TriggerPrice + ',' + item.SLNew + ',' + item.TGNew + ',' + sQty + ',' + item.OrderPrice + ',' + ProductType + ',' + PriceType + ',' + st + ')" ></a>' + '<a style="display:none;" class="fa fa-close" id="CANCEL' + item.ActiveTradeID + '" onclick="CancelTrade(' + item.ActiveTradeID + ')" ></a>';
    var ExecutionSection = '<a class="fa fa-play" id="EXECUTE' + item.ActiveTradeID + '" onclick="ExecuteOrder(' + item.ActiveTradeID + ',' + item.WID + ',' + item.ScriptCode + ',' + pos + ',' + item.TriggerPrice + ',' + item.SLNew + ',' + item.TGNew + ',' + sQty + ',' + item.ObjScriptDTO.Lastprice + ',' + ProductType + ',' + PriceType + ',' + st + ')" ></a>';

    var OrderPrice = "<div Id='divOrderPrice" + item.ActiveTradeID + "'>" + item.OrderPrice + "</div>";
    var LTPDiv = '<br /><div style="display:none;" id="LTPDiv' + item.ActiveTradeID + '">' + InputOrderPrice + Lastprice + AskPrice + BidPrice + HighPrice + LowPrice + "</div>";
    $('#' + TableName).DataTable().row.add([
        item.Status.toUpperCase == "OPEN" ? ExecutionSection : "no data",
        item.OrderTime,
        item.ObjScriptDTO.ScriptExchange,
        item.Username,
        item.TradeSymbol,
        item.CurrentPosition,
        item.CurrentPosition + "Limit",
        '<div id="HTMLQty' + item.ActiveTradeID + '">' + sQty + '</div>' + '<div style="display:none;" id="DIVQty' + item.ActiveTradeID + '">' + InputQty + '</div>',
        item.Qty,
        OrderPrice + LTPDiv,
        item.Status,
        user,
        item.Userip,
        item.Status.toUpperCase == "OPEN" ? ModificationSection : "no data",
        deleteTrade
    ]).draw();
}
function EditTrade(ActiveTradeID = 0) {
    $('#EDIT' + ActiveTradeID).css('display', 'none');
    $('#divOrderPrice' + ActiveTradeID).css('display', 'none');
    $('#HTMLQty' + ActiveTradeID).css('display', 'none');
    $('#LTPDiv' + ActiveTradeID).css('display', 'initial');
    $('#DIVQty' + ActiveTradeID).css('display', 'initial');
    $('#UPDATE' + ActiveTradeID).css('display', 'initial');
    $('#CANCEL' + ActiveTradeID).css('display', 'initial');
    CurrentActiveTradeID = ActiveTradeID;
    window.clearInterval(ActiveTradeInterval);

}
function ExecuteOrder(ActiveTradeID, intWID, ScriptCode, CurrentPosition, TriggerPrice, stopLoss, target, quantity, price, ProductType, marketType, st) {
    var result = window.confirm('Are you sure you want to execute this order?');
    if (result) {
        $('#EDIT' + ActiveTradeID).css('display', 'initial');
        $('#UPDATE' + ActiveTradeID).css('display', 'none');
        $('#CANCEL' + ActiveTradeID).css('display', 'none');
        CurrentActiveTradeID = 0;
        if (ScriptCode > 0 && intWID > 0 && quantity != '' && quantity != '0') {
            var request = $.ajax({
                url: "/Trade/ProceedBuySell",
                type: "POST",
                data: { intWID: intWID, ScriptCode: ScriptCode, CurrentPosition: CurrentPosition, allUsers: false, target: target, stopLoss: stopLoss, Quantity: quantity, price: price, TriggerPrice: TriggerPrice, ProductType: ProductType, MarketType: marketType, TradeID: ActiveTradeID, Status: st, iscbxAutoBinanceSlTrailEnabled: 0, TRADING_UNIT: 1 },
                dataType: 'json',
                async: true,
                success: function (data) {
                    var results = JSON.parse(data);

                    if (results.IsError) {
                        toastr.error(results.TypeName);
                        return false;
                    }
                    else {
                        if (tradeID != '0') {
                            toastr.success('Order Updated successfully');
                        }
                        else {
                            toastr.success('Order Placed successfully');
                        }
                        return false;
                    }

                }
            });
        }



        ActiveTradeInterval = window.setInterval(function () { GetPendingData(); }, 1000);
    }
}
function UpdateTrade(ActiveTradeID, intWID, ScriptCode, CurrentPosition, TriggerPrice, stopLoss, target, quantity, price, ProductType, marketType, st) {
    var result = window.confirm('Are you sure you want to update this order?');
    if (result) {
        CurrentActiveTradeID = 0;
        price = $('#InputPrice' + ActiveTradeID).val();
        quantity = $('#InputQty' + ActiveTradeID).val();
        if (ScriptCode > 0 && intWID > 0 && quantity != '' && quantity != '0') {
            var request = $.ajax({
                url: "/Trade/ProceedBuySell",
                type: "POST",
                data: { intWID: intWID, ScriptCode: ScriptCode, CurrentPosition: CurrentPosition, allUsers: false, target: target, stopLoss: stopLoss, Quantity: quantity, price: price, TriggerPrice: TriggerPrice, ProductType: ProductType, MarketType: marketType, TradeID: ActiveTradeID, Status: st, iscbxAutoBinanceSlTrailEnabled: 0, TRADING_UNIT: 1 },
                dataType: 'json',
                async: true,
                success: function (data) {
                    var results = JSON.parse(data);

                    if (results.IsError) {
                        toastr.error(results.TypeName);
                        return false;
                    }
                    else {
                        if (ActiveTradeID != '0') {
                            toastr.success('Order Updated successfully');
                        }
                        else {
                            toastr.success('Order Placed successfully');
                        }
                        return false;
                    }

                }
            });
        }

        ActiveTradeInterval = window.setInterval(function () { GetPendingData(); }, 1000);
    }
}
function CancelTrade(ActiveTradeID) {
    CurrentActiveTradeID = 0;
    ActiveTradeInterval = window.setInterval(function () { GetPendingData(); }, 1000);
}
function SetCompletedData(item, TableName) {
    var user = "";
    if (item.Userroleid == 1)
        user = "Administrator";
    if (item.Userroleid == 2)
        user = "User";
    if (item.Userroleid == 3)
        user = "Broker";
    if (item.Userroleid == 4)
        user = "SuperAdministrator";
    if (item.Userroleid == 5)
        user = "Support";
    if (item.Userroleid == 6)
        user = "Fund Manager";
    if (item.Userroleid == 7)
        user = "Sub Broker";
    var sQty;
    if (item.TRADING_UNIT_TYPE == 1) {
        sQty = item.Qty / item.ObjScriptDTO.ScriptLotSize;
    }
    else {
        if (item.ObjScriptDTO.ScriptLotSize > 10 && item.ObjScriptDTO.ScriptExchange == "MCX" && ((item.COMPANY_INITIAL == "EXPO" && item.TENANT_ID == 51) || (item.COMPANY_INITIAL == "ASR" && item.TENANT_ID == 57)|| item.COMPANY_INITIAL == "ASR")) {
            sQty = item.Qty / (item.ObjScriptDTO.ScriptLotSize / 10);
        } else {
            sQty = item.Qty;
        }
    }
    $('#' + TableName).DataTable().row.add([
        item.OrderTime,
        item.TradeExecutedOn,
        item.ObjScriptDTO.ScriptExchange,
        item.Username,
        item.TradeSymbol,
        item.CurrentPosition,
        item.CurrentPosition + "Limit",
        sQty,
        item.Qty,
        item.OrderPrice,
        user,
        item.Userip
    ]).draw();
}
//position Data For summary Page

function LoadData() {
    var input = { 'tradetype': 0, 'ActiveTradeID': 0, 'IsAdminWise': 0, 'UserID': StringUserID };
    var request = $.ajax({
        url: "/Trade/GetCompletedTradeForPositionPage",
        type: "GET",
        data: input,
        dataType: 'json',
        success: function (data) {
            SetActiveResult(data);
        }
    });

}
function SetActiveResult(results) {
    var TblTradesList = $('#positiontable').DataTable();
    TblTradesList.clear().draw();
    TblTradesList.innerHTML = "";
    if (results != null) {
        if (results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                GetActiveResult(result);
            }
            $('#TheadCbk').removeClass('sorting_asc');
        }
    }
}
function GetActiveResult(item) {
    var OutputQty;
    var totallot;
    var Total_MisQty;
    var Total_NrmlQty;
    var tempLot;
    var buyButton = "";
    var sellButton = "";
    if (item.Strategyname == "Manual")
        isManualStaratgy = true;
    if (item.TRADING_UNIT_TYPE == 1) {
        OutputQty = item.Qty / item.ObjScriptDTO.ScriptLotSize;
        totallot = (item.ObjScriptDTO.ScriptLotSize) * OutputQty;
        Total_MisQty = item.TotalMisQty / item.ObjScriptDTO.ScriptLotSize;
        Total_NrmlQty = item.TotalNrmlQty / item.ObjScriptDTO.ScriptLotSize;
        tempLot = item.ObjScriptDTO.ScriptLotSize;
    }
    else {
        if (item.ObjScriptDTO.ScriptLotSize > 10 && item.ObjScriptDTO.ScriptExchange == "MCX" && ((item.COMPANY_INITIAL == "EXPO" && item.TENANT_ID == 51) || (item.COMPANY_INITIAL == "ASR" && item.TENANT_ID == 57) || item.COMPANY_INITIAL == "RVERMA")) {
            OutputQty = item.ObjScriptDTO.ScriptLotSize >= 10 ? item.Qty / (item.ObjScriptDTO.ScriptLotSize / 10) : item.Qty;
            totallot = item.ObjScriptDTO.ScriptLotSize >= 10 ? (item.ObjScriptDTO.ScriptLotSize / 10) * OutputQty : item.ObjScriptDTO.ScriptLotSize;
            Total_MisQty = item.ObjScriptDTO.ScriptLotSize >= 10 ? item.TotalMisQty / (item.ObjScriptDTO.ScriptLotSize / 10) : item.TotalMisQty;
            Total_NrmlQty = item.ObjScriptDTO.ScriptLotSize >= 10 ? item.TotalNrmlQty / (item.ObjScriptDTO.ScriptLotSize / 10) : item.TotalNrmlQty;
            tempLot = item.ObjScriptDTO.ScriptLotSize >= 10 ? item.ObjScriptDTO.ScriptLotSize / 10 : item.ObjScriptDTO.ScriptLotSize;
        } else {
            OutputQty = item.Qty;
            totallot = OutputQty;
            Total_MisQty = item.TotalMisQty;
            Total_NrmlQty = item.TotalNrmlQty;
            tempLot = item.ObjScriptDTO.ScriptLotSize;
        }
    }
    var Username = '\'' + item.Username + '\'';
    var TradeSymbol = '\'' + item.TradeSymbol + '\'';
    var symbolParam = item.TradeSymbol.replace(/'/g, "");
    symbolParam = '\'' + symbolParam + '\'';
    var ScriptInstrumentType = '\'' + item.ScriptInstrumentType + '\'';
    var ScriptExchange = '\'' + item.ObjScriptDTO.ScriptExchange.toString() + '\'';

    var overallQty = item.TRADING_UNIT_TYPE == 1 ? item.Qty + ' (' + (item.Qty / item.ObjScriptDTO.ScriptLotSize) + ')' : item.Qty;
    $('#positiontable').DataTable().row.add([
        item.Qty > 0 && item.Is_DataInCompleted == false ? '<input Name="hiddenTradeSymbol" type="hidden" value="' + item.TradeSymbol + '" /><input class="CheckBoxTrades" type="checkbox" value="' + item.UserID + '"/>' : "",
        item.ObjScriptDTO.ScriptExchange + item.ScriptInstrumentType,
        item.Username,
        item.TradeSymbol,
        item.TotalBuyQty,
        item.OrderPrice,
        item.TotalSellQty,
        item.ObjScriptDTO.Lastprice,
        item.Qty > 0 && item.Is_DataInCompleted == false ? overallQty  : 0,
        0,
        item.ObjScriptDTO.Ask,
        item.Profitorloss
    ]).draw();

}