var intervalSensexNifty;
var intervalWatchList;
var Id_for_Controls;
var sqModal;
    function BindClick() {
        $('.activeTradeRow').bind('click', function () {
            var ScriptCode = $(this).attr('data-id');
            window.location.href = "/Trade/ActiveTrade?ActiveTradeID=" + ScriptCode;
        });
    }
    //#region Get Sensex And Nifty Data
    function FavoriteWatchlist() {
        $.ajax({
            url: '/Trade/SetFavoriteWatchlistData',
            type: 'GET',
            success: function (data) {
                if (data != null) {
                    var result = JSON.parse(data);
                    if (result.objLstWatchList.length > 0) {
                        for (var i = 0; i < result.objLstWatchList.length; i++) {
                            var PerChange = parseFloat(result.objLstWatchList[i].Lastprice) - parseFloat(result.objLstWatchList[i].close);
                            var perCentageHtml = "";
                            var perCentage = "";
                            if (PerChange < 0) {
                                perCentage = (parseFloat(PerChange) / parseFloat(result.objLstWatchList[i].close)) * 100;
                                perCentageHtml = '<i class="fa fa-angle-down percentage-down">&nbsp' + perCentage.toFixed(2) + '</i>';
                            }
                            else if (PerChange >= 0) {
                                perCentage = (parseFloat(PerChange) / parseFloat(result.objLstWatchList[i].close)) * 100;
                                perCentageHtml = '<i class="fa fa-angle-up percentage-up">&nbsp' + perCentage.toFixed(2) + '</i>';
                            }
                            if (i == 0) {
                                $('.favorite1').html('<span class="sensex">' + result.objLstWatchList[0].ScriptTradingSymbol + ' </span><span class="sensex-price"> ' + result.objLstWatchList[0].Lastprice + '&nbsp&nbsp ' + perCentageHtml + '</span>');
                            }
                            if (i == 1) {
                                $('.favorite2').html('<span class="nifty">' + result.objLstWatchList[1].ScriptTradingSymbol + '</span><span class="nifty-price"> ' + result.objLstWatchList[1].Lastprice + '&nbsp&nbsp ' + perCentageHtml + '</span>');
                            }
                        }
                    }
                }
            },
            error: function (error) {
            }
        });
    }
    //#endregion
$(document).ready(function () {
        SetTradeDataForRefresh();
        intervalWatchList = setInterval(function () { SetTradeDataForRefresh(); }, 1000);
        intervalSensexNifty = window.setInterval(function () { FavoriteWatchlist(); }, 1000);
        $('#backbtn').css('color', '#fff');
        $('#backbtn').on('click', function () {
            window.location.href = "/Trade/Index";
        });
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
    });
    function SetTradeDataForRefresh() {
        try {

            var input = { 'tradetype': 0, 'searchedData': $("#searchText").val() };
            var request = $.ajax({
                url: "/Trade/SetTradeData",
                type: "GET",
                data: input,
                dataType: 'json',
                async: true,
                success: function (data) {
                    SetResult(data);
                }
            });

        } catch (e) {
            toastr.error("Error On SetTradeData.")
        }
    }
    function SetResult(data) {
        var results = JSON.parse(data);
        if (results != null) {
            if (results.ActiveTrade != null) {
                //Set data for WatchList trade
                if (results.ActiveTrade.length > 0) {
                    $('#ActiveTradeDiv').html('');
                    $('#PendingTradeDiv').html('');
                    $('#RejectedTradeDiv').html('');
                    var Table_Name;
                    var Total_Active = 0, Total_Pending = 0, Total_Rejected = 0, Total_Profit = 0;
                    for (var i = 0; i < results.ActiveTrade.length; i++) {
                        var result = results.ActiveTrade[i];
                        var Status = result.Status;
                        Total_Profit += result.Profitorloss;
                        if (Status.toUpperCase() == "COMPLETE") {
                            Total_Active += 1;
                            Table_Name = 'ActiveTradeDiv';
                            SetActiveTradeDetails(result, Table_Name);
                        }
                        else if (Status.toUpperCase() == "OPEN") {
                            Total_Pending += 1;
                            Table_Name = 'PendingTradeDiv';
                            SetActiveTradeDetails(result, Table_Name);
                        }
                        else
                        {
                            Total_Rejected += 1;
                            Table_Name = 'RejectedTradeDiv';
                            SetActiveTradeDetails(result, Table_Name);
                        }

                        BindClick();
                    }
                    $('#Total_Pending').html('');
                    $('#Total_Active').html('');
                    $('#Total_Rejected').html('');
                    $('#OverAllProfit').html('');
                    $('#Total_Pending').html(Total_Pending);
                    $('#Total_Active').html(Total_Active);
                    $('#Total_Rejected').html(Total_Rejected);
                    $('#OverAllProfit').html(Total_Profit);
                    if (Total_Profit > 0) {
                        $('#OverAllProfit').css('color', 'var(--main-color-Theme)');
                    }
                    else
                    {
                        $('#OverAllProfit').css('color', 'OrangeRed');
                    }
                }
                else {
                    $('#ActiveTradeDiv').html('<p class="text-center" style="color:#fff">No Active Trade Available.</p>');
                    $('#PendingTradeDiv').html('<p class="text-center" style="color:#fff">No Active Trade Available.</p>');
                    $('#RejectedTradeDiv').html('<p class="text-center" style="color:#fff">No Active Trade Available.</p>');
                    $('#Total_Pending').html(0);
                    $('#Total_Active').html(0);
                    $('#Total_Rejected').html(0);
                    $('#OverAllProfit').html(0);
                }
            }
            else
            {
                $('#ActiveTradeDiv').html('<p class="text-center" style="color:#fff">No Active Trade Available.</p>');
                $('#PendingTradeDiv').html('<p class="text-center" style="color:#fff">No Active Trade Available.</p>');
                $('#RejectedTradeDiv').html('<p class="text-center" style="color:#fff">No Active Trade Available.</p>');
                $('#Total_Pending').html(0);
                $('#Total_Active').html(0);
                $('#Total_Rejected').html(0);
                $('#OverAllProfit').html(0);
            }
        }
        else {
            $('#ActiveTradeDiv').html('<p class="text-center" style="color:#fff">No Active Trade Available.</p>');
            $('#PendingTradeDiv').html('<p class="text-center" style="color:#fff">No Active Trade Available.</p>');
            $('#RejectedTradeDiv').html('<p class="text-center" style="color:#fff">No Active Trade Available.</p>');
            $('#Total_Pending').html(0);
            $('#Total_Active').html(0);
            $('#Total_Rejected').html(0);
            $('#OverAllProfit').html(0);
        }
    }
    //#region Set Watch List Data
function SetActiveTradeDetails(item, TableName) {

    var symbolParam = '\'' + item.TradeSymbol + '\'';
    var ScriptInstrumentType = '\'' + item.ScriptInstrumentType + '\'';
    var ProductType = '\'' + item.ProductType + '\'';
    var PriceType = '\'' + item.PriceType + '\'';
    var pos = '\'' + item.CurrentPosition.toString() + '\'';
    var st = '\'' + item.Status.toString() + '\'';
    var ScriptExchange = '\'' + item.ObjScriptDTO.ScriptExchange.toString() + '\'';


    var isManualStaratgy = false;
    if (item.Strategyname == "Manual")
        isManualStaratgy = true;

    var Companyinitials = $("#Companyinitials").val();
 if(item.ObjScriptDTO.ScriptExchange == "FOREX" && Companyinitials == "RT")
    {
    item.ObjScriptDTO.Lastprice=(item.ObjScriptDTO.Lastprice).toFixed(5);
    item.OrderPrice=(item.OrderPrice).toFixed(5);
    item.TriggerPrice=(item.TriggerPrice).toFixed(5);
    item.SL=(item.SL).toFixed(5);
    item.TGT2=(item.TGT2).toFixed(5);
    item.TGT3=(item.TGT3).toFixed(5);
    item.TGT4=(item.TGT4).toFixed(5);
    }
        var P_L = "";
        var CP = "";
        if (parseFloat(item.Profitorloss) >= 0) {
            P_L = '<font style="color:#4987ee !important;font-weight:bold;">' + item.Profitorloss + '</font>';
        }
        else if (parseFloat(item.Profitorloss) < 0){
            P_L = '<font style="color:#ff4a4a;font-weight:bold;">' + item.Profitorloss + '</font>';
        }

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
    var css = "row-New-Theme p-2 watchlistRow";
    var GetQtyType = item.TRADING_UNIT;
    var Div_SL_TGT_STATUS = '';
    var buyButton = '';
    var sellButton = '';
    var CurrentPosition = '';
    buyButton = ' <button class="btn btn-danger btn-sm btn-Sqroff" id="btn-Sqroff' + item.ActiveTradeID + '" onclick="SquareOff(' + item.ActiveTradeID + ',' + pos + ',' + st + ',' + sQty + ',' + isManualStaratgy + ')" type="button">Sqr Off</button> ';
    sellButton = ' <button class="btn btn-danger btn-sm btn-Sell btn-Sqroff" id="btn-Sqroff' + item.ActiveTradeID + '" onclick="SquareOff(' + item.ActiveTradeID + ',' + pos + ',' + st + ',' + sQty + ',' + isManualStaratgy + ')" type="button">Sqr Off</button> ';

    var RejectedOrderDeleteBtn = '';

    if (item.CurrentPositionNew == "Buy") {
        CurrentPosition = sellButton;
        CP = '<font style="color:#4987ee !important;font-weight:bold;">' + item.CurrentPositionNew + '</font>';

    }
    else if (item.CurrentPositionNew == "Sell") {
        CurrentPosition = buyButton;
        CP = '<font style="color:#ff4a4a;font-weight:bold;">' + item.CurrentPositionNew + '</font>';
    }
    if ($('#IsTargetStopLossAbsolute').val() == 'True' && item.CurrentPositionNew == "Sell")
        sQty = "-" + sQty;

    if (item.Status.toUpperCase() == "REJECTED" || item.Status.toUpperCase() == "CANCELED" || item.Status.toUpperCase() == "OPEN") {
        RejectedOrderDeleteBtn = '<button class="btn btn-danger btn-sm btn-DelActive" type="button" id="btn-DelActive' + item.ActiveTradeID + '" onclick="DeleteActiveTrade(' + item.ActiveTradeID + ',' + item.UserID + ')" data-bind=' + item.ActiveTradeID + '>Delete</button> ';
        CurrentPosition = RejectedOrderDeleteBtn;
    }


    if (item.SL == 0 && item.TGT2 == 0 && item.TGT3 == 0 && item.TriggerPrice < 0.1 && item.Status == "COMPLETE" || item.Status == "OPEN") {
        Div_SL_TGT_STATUS = '<div class="col-12" >' +
            '   <p class="watchlist-p" style="display:none;font-size: 11px;  margin-bottom: 5px;"> SL : ' + item.SL + ' | TGT : ' + item.TGT2 + ' | TGT2 : ' + item.TGT3 + ' | TGT3 : ' + item.TGT4 + '</p>' +
            '   <p class="watchlist-p" style="display:none;font-size: 11px;  margin-bottom: 5px;"> TRIGGER : ' + item.TriggerPrice + ' |  Status : ' + item.Status + '</p>' +
            '   <p class="watchlist-p" style="font-size: 11px;  margin-bottom: 5px;">Date : ' + item.OrderDate + ' ' + item.OrderTime + ' | CP: ' + CP + ' </p>' +
            '</div>';
    }
    else
    {
        Div_SL_TGT_STATUS = '<div class="col-12" >' +
            '   <p class="watchlist-p" style="font-size: 11px;  margin-bottom: 5px;"> SL : ' + item.SL + ' | TGT : ' + item.TGT2 + ' | TGT2 : ' + item.TGT3 + ' | TGT3 : ' + item.TGT4 + '</p>' +
            '   <p class="watchlist-p" style="font-size: 11px;  margin-bottom: 5px;"> TRIGGER : ' + item.TriggerPrice + ' |  Status : ' + item.Status + '</p>' +
            '   <p class="watchlist-p" style="font-size: 11px;  margin-bottom: 5px;">Date : ' + item.OrderDate + ' ' + item.OrderTime +  ' | CP: ' + item.CurrentPositionNew + ' </p>' +
            '</div>';
    }
    var html = '<div class="row p-2 activeTradeRow" data-id=' + item.ActiveTradeID + '>' +
        '<div class="col-12" >' +
        '<div class="' + css + '">' +
        '<div class="card-body" style="padding:5px;">' +
        '   <div class="row">' +
        '<div class="col-6">' +
        ' <p class="watchlist-p" style="font-size: 14px; margin-bottom: 0px;">' + item.TradeSymbol + '</p>' +
        '</div>' +
        '<div class="col-6">' +
        '     <div class="row" style="margin-top:3px;">' +
        '          <div class="col-5">' +
        '               <label class="watchlist-p" style="font-size: 12px">' + GetQtyType + ': ' + sQty + '</label>' +
        '          </div>' +
        '             <div class="col-7" style="margin-left:-7px;">' +
        '                  <span class="watchlist-p" style="font-size: 12px;font-weight:bold"> LTP: ' +
        '               ' + item.ObjScriptDTO.Lastprice + '' +
        '                        </span>' +
        '                 </div>' +
        '              </div>' +
        '           </div>' +
        '<div class="col-5">' +
        '  <p class="watchlist-p" style="font-size: 13px;  margin-bottom: 0px;margin-top:0px;">AVG : ' + item.OrderPrice + ' </p>' +
        '</div>' +
        '<div class="col-4">' +
        '  <p class="watchlist-p" style="font-size: 13px;  margin-bottom: 0px;margin-top:0px;"> P&L : ' + P_L + ' </p>' +
        '</div>' +
        Div_SL_TGT_STATUS +
        '        </div>' +
        '     </div>' +
        '  </div>' +
        '</div >' +
        '</div >' +
        '<div style="    position: relative;min - height: 1px;left: 70vw;top: -40px;">' + CurrentPosition + '</div>';
    $('#'+TableName).append(html);


    }
    //#endregion
    function openUserProfile() {
        document.getElementById("userDropdown").classList.toggle("show");
}
$('#SqrOffAllBtn').on('click', function () {
    newconfirmMobile("Sqr Off All?", function () {
    var resp = $('body').find('.cresp').html();
    $('body').find('.cresp').remove();
    if (resp == 'Yes') {
    window.location.href = "/Trade/SqrOffAll";
    }
    });
});
function SquareOff(id, param, st, Qty, isManualStaratgy) {
    sqModal = $("#sqOfModal");
    $(sqModal).find(".sqMsg").text('');
    $(sqModal).find("input[Name=sqQty]").val(Qty);
    $(sqModal).find("input[Name=hdQty]").val(Qty);
    $(sqModal).find("input[Name=sqActiveTradeID]").val(id);
    $(sqModal).find("input[Name=sqStatus]").val(st);
    $(sqModal).find("input[Name=sqParam]").val(param);
    if (isManualStaratgy)
        $(sqModal).modal('show');
    else {
        newconfirmMobile("square off?", function () {
    var resp = $('body').find('.cresp').html();
    $('body').find('.cresp').remove();
    if (resp == 'Yes') {
        ProceedSqOf();
    }
    });
    }


}
function ProceedSqOf() {
    sqModal = $("#sqOfModal");
    $(sqModal).find(".sqMsg").text('');
    var sqQty = $(sqModal).find("input[Name=sqQty]").val();
    var initQty = $(sqModal).find("input[Name=hdQty]").val();
    var intQty = 0;
    if (sqQty != '' && sqQty != '0') {
        intQty = parseInt(sqQty, 10);
        if (intQty > parseInt(initQty, 10)) {
            $('#btnProceedSquareOff').removeAttr('disabled');
            $(sqModal).find(".sqMsg").text('Invalid Qty');
            return false;
        }
    }
    else {
        $('#btnProceedSquareOff').removeAttr('disabled');
        $(sqModal).find(".sqMsg").text('Invalid Qty');
        return false;
    }
    var id = $(sqModal).find("input[Name=sqActiveTradeID]").val();
    var st = $(sqModal).find("input[Name=sqStatus]").val();
    var param = $(sqModal).find("input[Name=sqParam]").val();
    var request = $.ajax({
        url: "/Trade/ManageTradeSquareOff",
        type: "POST",
        data: { ID: id, actionParam: param, Status: st, Qty: intQty, isSupAdmin: 1 },
        dataType: 'json',
        traditional: true,
        success: function (data) {
            var results = JSON.parse(data);
            if (results.exceptionDTO.id == 1) {
                toastr.success(results.exceptionDTO.Msg);
            }
            else if (results.exceptionDTO.id == 0) {
                toastr.success(results.exceptionDTO.Msg);
            }
            else if (results.exceptionDTO.id == 2) {
                toastr.success(results.exceptionDTO.Msg);
            }


            return false;
        }
    });
    $('#btnProceedSquareOff').removeAttr('disabled');
    $(sqModal).modal('hide');
}
function DeleteActiveTrade(TransactionId, UserID) {
    newconfirmMobile("Delete This Record", function () {
        var resp = $('body').find('.cresp').html();
        $('body').find('.cresp').remove();
        if (resp == 'Yes') {
            var request = $.ajax({
                url: "/Trade/DeleteActiveTrade?ID=" + TransactionId + "&UserID=" + UserID,
                type: "GET",
                async: true,
                success: function (data) {
                    if (data != null) {
                        toastr.success(data);
                    }
                }
            });
        }
    });
}