var intervalSensexNifty;
var intervalWatchList;
var isShowDepthModal;
var LastPriceDictionary = [];
var marginInterval = "";
var SocketInterval;
var marketDepthInterval;
var allObj = [];
var websocket;
var mobilebuyBtn;
var mobilesellBtn;
var mobiledeleteBtn;
var Companyinitials;

var clicked_Watchlist_InstrumentToken = "";
var clicked_Watchlist_ScriptTradingSymbol = "";
var clicked_Watchlist_ScriptExchange = "";
var allowedTradingUnit;

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

//#region Document Ready Function 
$(document).ready(function () {
    allowedTradingUnit = JSON.parse($("#TradingUnitAccess").val());
    Companyinitials = $("#CompanyInitial").val();
    //#region Add Shimmer Effect While Changing Watchlist
    $('.nav-item').on('click', function () {
        $('#watchlistDiv').html('');
        $('#watchlistDiv').append('<photo class="shine-watchlist"></photo>' +
            '<photo class= "shine-watchlist"></photo>' +
            '<photo class= "shine-watchlist"></photo>' +
            '<photo class="shine-watchlist"></photo>' +
            '<photo class="shine-watchlist"></photo>' +
            '<photo class="shine-watchlist"></photo>' +
            '<photo class="shine-watchlist"></photo>');
        $('.active').removeClass('active');
        var div = $(this).addClass('active');
        div.addClass('active');
        SetTradeDataForRefresh();
    });
    //#endregion

    //#region Call Watchlist For The First Time
    SetTradeDataForRefresh();
    //#endregion

    //#region Call WebSocket
    initSocket();
    SocketInterval = setInterval(function () { initSocket(); }, 1000);
    intervalSensexNifty = window.setInterval(function () { FavoriteWatchlist(); }, 1000);
    //#endregion

    //#region Market Change Code
    $('input[Name=MarketType]').on('click', function (ele) {
        var value = $(ele.currentTarget).val();
        var priceval = $('#hdnPrice').val();
        var Triggerval = $('#hdnPrice').val();;
        $('#txtTarget').removeAttr('disabled');
        $('#txtTarget').removeAttr('readonly');
        $('#txtStopLoss').removeAttr('disabled');
        $('#txtStopLoss').removeAttr('readonly');
        if (value == 'Limit') {
            $('#buySellModel #price').removeAttr('disabled');
            $('#buySellModel #price').removeAttr('readonly');
            $('#buySellModel #price').val(priceval);
            $('#buySellModel #TriggerPrice').val('0');
            $('#buySellModel #TriggerPrice').attr('disabled', 'disabled');
        }
        else if (value == 'SL') {
            $('#buySellModel #price').removeAttr('disabled');
            $('#buySellModel #price').removeAttr('readonly');
            $('#buySellModel #price').val(priceval);
            $('#buySellModel #TriggerPrice').val(Triggerval);
            $('#buySellModel #TriggerPrice').removeAttr('disabled');
            $('#buySellModel #TriggerPrice').removeAttr('readonly');
        }
        else if (value == 'SL-M') {
            $('#buySellModel #TriggerPrice').removeAttr('disabled');
            $('#buySellModel #TriggerPrice').removeAttr('readonly');
            $('#buySellModel #TriggerPrice').val(Triggerval);
            $('#buySellModel #price').val('0');
            $('#buySellModel #price').attr('disabled', 'disabled');
            $('#txtTarget').attr('disabled', 'disabled');
            $('#txtTarget').attr('readonly', 'readonly');
            $('#txtStopLoss').attr('disabled', 'disabled');
            $('#txtStopLoss').attr('readonly', 'readonly');
        }
        else if (value == 'MARKET') {
            $('#buySellModel #price').val('0');
            $('#buySellModel #price').attr('disabled', 'disabled');
            $('#buySellModel #price').attr('readonly', 'readonly');
            $('#buySellModel #TriggerPrice').val('0');
            $('#buySellModel #TriggerPrice').attr('disabled', 'disabled');
            $('#buySellModel #TriggerPrice').attr('readonly', 'readonly');
        }
    });
    //#endregion

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
            };
            recognition.onerror = function (e) {
                recognition.stop();
                $("#microphone").modal('hide');
            };
        }
        else {
            toastr.error("Your Browser Does Not Support's This Feature.");
        }
    });
    //#endregion Voice Recognition

    $("#searchText").on('keyup', function () {
        SetTradeDataForRefresh();
    });

    //#region Buy Sell Div Details
    $('.mobileBuyBtn').on('click', function () {
        $("#" + mobilebuyBtn + "").trigger('click');
        $('.mobile-context-menu').css('display', 'none');
    });
    $('.mobileSellBtn').on('click', function () {
        $("#" + mobilesellBtn + "").trigger('click');
        $('.mobile-context-menu').css('display', 'none');
    });
    $('.mobileDeleteBtn').on('click', function () {
        $("#" + mobiledeleteBtn + "").trigger('click');
        $('.mobile-context-menu').css('display', 'none');
    });

    $("#watchlistDiv").delegate('.watchlistRow', 'click', function () {
        if (screen.width <= 768) {
            window.clearInterval(marketDepthInterval);
            clicked_Watchlist_InstrumentToken = $(this).attr('id');
            $('#marketDepthDiv').html('');
            $('#marketDepthDiv').append('<photo class="shine-watchlist"></photo>' +
                '<photo class= "shine-watchlist"></photo>');
            clicked_Watchlist_ScriptExchange = $(this).attr('data-ScriptExchange');
            $('#scriptTradingSymbolMobileContextMenu').html($(this).attr('data-scripttradingsymbol') + ' ' + '<span style="font-size:12px;"> (' + clicked_Watchlist_ScriptExchange + ')</span>');
            var newL = allObj.filter(opt => opt.InstrumentToken == clicked_Watchlist_InstrumentToken);
            if (newL.length > 0)
                $('#lastPriceMobileContextMenu').html('LTP : ' + newL[0].Lastprice);
            mobilebuyBtn = $($(this).find('.btn-Buy')).find('.btn-Buy').prevObject[0].id;
            mobilesellBtn = $($(this).find('.btn-Sell')).find('.btn-Sell').prevObject[0].id;
            mobiledeleteBtn = $($(this).find('.btn-delete')).find('.btn-delete').prevObject[0].id;
            $('.mobile-context-menu').css('display', 'block');
            MarketDepthPop(clicked_Watchlist_InstrumentToken, $(this).attr('data-scripttradingsymbol'));
        }
    });

    //#endregion
});
//#endregion

document.body.addEventListener('click', function (event) {
    var element = document.querySelector('ul.mobile-context-menu-list.list-flat');
    var element2 = document.querySelector('#watchlistDiv');
    if (element != '' && element != null) {
        if (!element.contains(event.target) && !element2.contains(event.target)) {
            window.clearInterval(marketDepthInterval);
            $('.mobile-context-menu').css('display', 'none');
        }
    }
});

//#region Initilize WebSocket
function initSocket() {
    $.ajax({
        url: '/Home/ConnectWebSocket',
        type: 'GET',
        dataType: 'json',
        success: function (event) {
            if (event != 'undefined') {
                var allActiveAndWatchObj = JSON.parse(event);
                if (allActiveAndWatchObj.hasOwnProperty("Table")) {
                    allObj = allActiveAndWatchObj.Table;
                    wt();
                }
            }
        }
    });
}
//#endregion

function SetTradeDataForRefresh() {
    try {
        var WID = $("#custom-tabs-one-tab > li.nav-item.active a").attr("data-id");
        var selectedScriptExchange = $("#cboScriptExchange option:selected").val();
        var input = { 'WID': WID, 'scriptExchangeType': "", 'searchedData': $("#searchText").val() };
        var request = $.ajax({
            url: "/Trade/SetTradeDataForNewUI",
            type: "GET",
            data: input,
            dataType: 'json',
            async: true,
            success: function (data) {
                SetResult(data);
            }
        });

    } catch (e) {
        toastr.error("Error While Loading The Watchlist.");
    }
}
function SetResult(data) {
    var results = JSON.parse(data);
    if (results != null) {
        if (results.objLstWatchList != null) {
            //Set data for WatchList trade
            if (results.objLstWatchList.length > 0) {
                $('#watchlistDiv').html('');

                for (var i = 0; i < results.objLstWatchList.length; i++) {
                    var result = results.objLstWatchList[i];
                    SetWatchTradeDetails(result);
                }
            }
            else {
                $('#watchlistDiv').html('');

            }
        }
        if (results.OrderExceptionList.length > 0) {
            var html = '<table class="table table-bordered table-striped" id="exceptionsTable"><thead><tr><th>TradingSymbol</th><th>Quantity</th><th>price</th><th>BuyOrSell</th><th>Message</th></tr></thead><tbody>';
            for (var i = 0; i < results.OrderExceptionList.length; i++) {
                html += '<tr><td>' + results.OrderExceptionList[i].Tradingsymbol + '</td><td>' + results.OrderExceptionList[i].Quantity + '</td><td>' + results.OrderExceptionList[i].price + '</td><td>' + results.OrderExceptionList[i].TransactionType + '</td><td>' + results.OrderExceptionList[i].Message + '</td></tr>';
            }
            html += '</tbody></table>';
            $("#errorModal .modal-body").html(html);
            $("#errorModal").modal('show');
        }
    }
}
function wt() {
    var nData = allObj;
    if (nData != null && nData != 'undefined' && nData.length > 0) {
        var table = document.getElementById("watchlistDiv");
        var i = 0;
        while (i < table.children.length) {
            var htmlDivId = (table.children[i].id);
            var SCRIPT_TYPE = (table.children[i].dataset.Scripttype);
            if (htmlDivId != undefined && htmlDivId != '') {

                var newL = nData.filter(opt => opt.InstrumentToken == $("#" + htmlDivId + "").find('input[Name=hiddenCode]').val());
                if (newL.length > 0) {
                    var item = newL[0];

                    var PreviousLastPrice = 0.0;
                    var PreviousBidPrice = 0.0;
                    var PreviousAskPrice = 0.0;
                    var LTPColor = "";
                    var AskColor = "";
                    var BidColor = "";
                    for (var keys in LastPriceDictionary) {
                        if (LastPriceDictionary[keys].key == item.InstrumentToken) {
                            PreviousLastPrice = parseFloat(LastPriceDictionary[keys].value);
                            PreviousBidPrice = parseFloat(LastPriceDictionary[keys].Bid);
                            PreviousAskPrice = parseFloat(LastPriceDictionary[keys].Ask);
                            LTPColor = (LastPriceDictionary[keys].LTPColor);
                            AskColor = (LastPriceDictionary[keys].AskColor);
                            BidColor = (LastPriceDictionary[keys].BidColor);
                            break;
                        }
                    }
                    var LastAskHtml = "";
                    if (parseFloat(item.Ask) > PreviousAskPrice) {
                        LastAskHtml = '<div class="price-up">' + item.Ask.toFixed(2) + '</div>';
                        AskColor = "price-up";
                    }
                    if (parseFloat(item.Ask) < PreviousAskPrice) {
                        LastAskHtml = '<div class="price-down">' + item.Ask.toFixed(2) + '</div>';
                        AskColor = "price-down";
                    }
                    if (item.Ask == PreviousAskPrice) {
                        if (AskColor == "")
                            AskColor = "price-up";
                        LastAskHtml = '<div class="' + AskColor + '">' + item.Ask.toFixed(2) + '</div>';
                    }
                    var LastBidHtml = "";
                    if (parseFloat(item.Bid) > PreviousBidPrice) {
                        LastBidHtml = '<div class="price-up">' + item.Bid.toFixed(2) + '</div>';
                        BidColor = "price-up";
                    }
                    if (parseFloat(item.Bid) < PreviousBidPrice) {
                        LastBidHtml = '<div class="price-down">' + item.Bid.toFixed(2) + '</div>';
                        BidColor = "price-down";
                    }
                    if (item.Bid == PreviousBidPrice) {
                        if (BidColor == "")
                            BidColor = "price-up";
                        LastBidHtml = '<div class="' + BidColor + '">' + item.Bid.toFixed(2) + '</div>';
                    }

                    if (item.Close == null)
                        item.Close = 0;

                    var PerChange = parseFloat(item.Lastprice) - parseFloat(item.Close);
                    var perCentageHtml = "";
                    var perChangeInDigit = "";
                    var perCentage = "";
                    if (PerChange < 0) {
                        perCentage = (parseFloat(PerChange) / parseFloat(item.Close)) * 100;
                        if (SCRIPT_TYPE == "BINANCE") {
                            perCentage = item.Change;
                        }
                        if (SCRIPT_TYPE == "FOREX") {
                            perCentage = 0.00;
                        }
                        perCentageHtml = '<i class="fa fa-angle-down percentage-price-down">&nbsp&nbsp' + perCentage.toFixed(2) + '</i>';
                        /*                    perChangeInDigit = '<i class="fa percentage-price-down">&nbsp&nbsp' + item.ChangeInRupee.toFixed(2) + '</i>';*/
                    }
                    else if (PerChange >= 0) {
                        perCentage = (parseFloat(PerChange) / parseFloat(item.Close)) * 100;
                        if (SCRIPT_TYPE == "BINANCE") {
                            perCentage = item.Change;
                        }
                        if (SCRIPT_TYPE == "FOREX") {
                            perCentage = 0.00;
                        }
                        perCentageHtml = '<i class="fa fa-angle-up percentage-price-up">&nbsp&nbsp' + perCentage.toFixed(2) + '</i>';
                        /*perChangeInDigit = '<i class="fa percentage-price-up">&nbsp&nbsp' + item.ChangeInRupee.toFixed(2) + '</i>';*/
                    }
                    var LastPriceHtml = "";
                    if (parseFloat(item.Lastprice) > PreviousLastPrice) {
                        LastPriceHtml = 'LTP : <span class="price-up">' + item.Lastprice.toFixed(2) + '</span>';
                        LTPColor = "price-up";
                    }
                    if (parseFloat(item.Lastprice) < PreviousLastPrice) {
                        LastPriceHtml = 'LTP : <span class="price-down">' + item.Lastprice.toFixed(2) + '</span>';
                        LTPColor = "price-down";
                    }
                    if (item.Lastprice == PreviousLastPrice) {
                        if (LTPColor == "")
                            LTPColor = "price-up";
                        LastPriceHtml = 'LTP : <span class="' + LTPColor + '">' + item.Lastprice.toFixed(2) + '</span>';
                    }

                    if ($('#IsTargetStopLossAbsolute').val()=='True') {

                        if (parseFloat(item.Bid) > PreviousBidPrice) {
                            LastBidHtml = '<div class="price-up" style="padding-bottom:0px;">' + item.Bid.toFixed(2) + '</div>';
                            BidColor = "price-up";
                        }
                        if (parseFloat(item.Bid) < PreviousBidPrice) {
                            LastBidHtml = '<div class="price-down"  style="padding-bottom:0px;">' + item.Bid.toFixed(2) + '</div>';
                            BidColor = "price-down";
                        }
                        if (item.Bid == PreviousBidPrice) {
                            if (BidColor == "")
                                BidColor = "price-up";
                            LastBidHtml = '<div class="' + BidColor + '"  style="padding-bottom:0px;">' + item.Bid.toFixed(2) + '</div>';
                        }

                        $("#" + htmlDivId + "").find('.Percentage_SEGMENT').html(perCentageHtml + '(' + perCentageHtml + ')');
                        $("#" + htmlDivId + "").find('.LTP_SEGMENT').html(LastPriceHtml);
                        $("#" + htmlDivId + "").find('.HIGH_LOW').html('H : ' + item.high + ' | L : ' + item.low + '');
                        $("#" + htmlDivId + "").find('.Bid_Ask_SEGMENT').html('<div class="col-5" style="margin-left:-15px;display: flex;">' +
                            '                  ' +
                            '               <div style="font-size: 20px !important;">' + LastBidHtml + '</div >' +
                            '             </div>' +
                            '            <div class="col-7" style="display:flex;margin-left:15px">' +
                            '               <div style="font-size: 20px !important;">' + LastAskHtml + '</div >' +
                            '       </div>');
                    }
                    else {
                        $("#" + htmlDivId + "").find('.LTP_SEGMENT').html(LastPriceHtml + ' (' + perCentageHtml + ')');
                        $("#" + htmlDivId + "").find('.HIGH_LOW').html('H : ' + item.high + ' | L : ' + item.low + '');
                        $("#" + htmlDivId + "").find('.Bid_Ask_SEGMENT').html('<div class="col-5" style="margin-left:-15px;display: flex;">' +
                            '                  ' +
                            '               ' + LastBidHtml +
                            '             </div>' +
                            '            <div class="col-7" style="display:flex;margin-left:15px">' +
                            '              ' + LastAskHtml +
                            '       </div>');
                    }

                    if ($('#buySellModel #lblScriptCode').text() == item.ScriptCode) {
                        var LTP = item.Lastprice.toString();
                        $('#buySellModel #lblLastPrice').text(LTP);
                        $('#buySellModel #lblLastBid').text(item.Bid);
                        $('#buySellModel #lblLastAsk').text(item.Ask);
                        $('#buySellModel #hdnPrice').val(LTP);
                    }
                    var IsExistsLTP = false;
                    for (var keys in LastPriceDictionary) {
                        if (LastPriceDictionary[keys].key == item.InstrumentToken) {
                            IsExistsLTP = true;
                            LastPriceDictionary[keys].value = item.Lastprice;
                            LastPriceDictionary[keys].Bid = item.Bid;
                            LastPriceDictionary[keys].Ask = item.Ask;
                            LastPriceDictionary[keys].LTPColor = LTPColor;
                            LastPriceDictionary[keys].AskColor = AskColor;
                            LastPriceDictionary[keys].BidColor = BidColor;
                            break;
                        }
                    }
                    if (!IsExistsLTP) {
                        LastPriceDictionary.push({
                            key: item.InstrumentToken,
                            value: item.Lastprice,
                            Bid: item.Bid,
                            Ask: item.Ask,
                            LTPColor: LTPColor,
                            AskColor: AskColor,
                            BidColor: BidColor
                        });
                    }


                }
            }

            if ($('#buySellModel').hasClass('in')) {
                var newL = nData.filter(opt => opt.InstrumentToken == $('#buySellModel #lblScriptCode').text());
                if (newL.length > 0) {
                    $('#buySellModel #lblLastPrice').text(newL[0].Lastprice);
                    $('#buySellModel #lblLastBid').text(newL[0].Bid);
                    $('#buySellModel #lblLastAsk').text(newL[0].Ask);
                    $('#buySellModel #hdnHigh').text(newL[0].high);
                    $('#buySellModel #hdnLow').text(newL[0].low);
                    $('#buySellModel #hdnPrice').val(newL[0].Lastprice);
                }
            }
            if ($('.mobile-context-menu').css('display') == 'block') {
                var newL = nData.filter(opt => opt.InstrumentToken == clicked_Watchlist_InstrumentToken);
                if (newL.length > 0) {
                    $('#lastPriceMobileContextMenu').html('LTP : ' + newL[0].Lastprice);
                }
            }
            i++;
        }
    }
}
//#region Set Watch List Data
function SetWatchTradeDetails(item) {
    var LastAskHtml = '<div class="price-up">' + item.Ask.toFixed(2) + '</div>';
    var LastBidHtml = '<div class="price-up">' + item.Bid.toFixed(2) + '</div>';
    var LastPriceHtml = ' LTP <span class="price-up" >' + item.Lastprice.toFixed(2) + '</span>';

    var symbolParam = item.ScriptName.replace(/'/g, "");
    symbolParam = '\'' + symbolParam + '\'';

    var script_Trading_Symbol = item.ScriptTradingSymbol.replace(/'/g, "");
    script_Trading_Symbol = '\'' + script_Trading_Symbol + '\'';
    var ScriptInstrumentType = '\'' + item.ScriptInstrumentType + '\'';
    var ScriptExchange = '\'' + item.ScriptExchange.toString() + '\'';

    var PerChange = parseFloat(item.Lastprice) - parseFloat(item.close);
    var perCentageHtml = "";
    var perCentage = "";
    var perChangeInDigit = "";
    if (PerChange < 0) {
        perCentage = (parseFloat(PerChange) / parseFloat(item.close)) * 100;
        if (item.Scripttype == "BINANCE") {
            perCentage = item.PerChange;
        }
        if (item.Scripttype == "FOREX") {
            perCentage = 0.00;
        }
        perCentageHtml = '<i class="fa fa-angle-down percentage-price-down">&nbsp&nbsp' + perCentage.toFixed(2) + '</i>';
        perChangeInDigit = '<i class="fa percentage-price-down">&nbsp&nbsp' + PerChange.toFixed(2) + '</i>';
    }
    else if (PerChange >= 0) {
        perCentage = (parseFloat(PerChange) / parseFloat(item.close)) * 100;
        if (item.Scripttype == "BINANCE") {
            perCentage = item.PerChange;
        }
        if (item.Scripttype == "FOREX") {
            perCentage = 0.00;
        }
        perCentageHtml = '<i class="fa fa-angle-up percentage-price-up">&nbsp&nbsp' + perCentage.toFixed(2) + '</i>';
        perChangeInDigit = '<i class="fa percentage-price-up">&nbsp&nbsp' + PerChange.toFixed(2) + '</i>';
    }
    var Qty = 1;

    var hiddenCode = '<input Name="hiddenCode" value="' + item.ScriptCode + '" type="hidden" >';
    var btnBuyid = "btnBuy" + item.ScriptCode;
    var btnSellid = "btnSell" + item.ScriptCode;
    var btnMarketDepth = "btnMarketDepth" + item.ScriptCode;
    var btnDeleteid = "btnDelete" + item.ScriptCode;
    var deleteButton = ' <button id="' + btnDeleteid + '" onclick="removeScript(' + item.ScriptCode + ',' + item.WID + ')" type="button" class="btn btn-warning btn-sm btn-delete"><i class="fa fa-trash-o"></i></button> ';
    var buyButton = '<div tabindex="-1" style="display:none;" class="b-btn"><button class="btn-Buy" id="' + btnBuyid + '" onclick="buySellPopUp(' + item.ScriptCode + ',1,' + symbolParam + ',' + item.WID + ',' + item.Lastprice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + Qty + ',' + item.ScriptLotSize + ',' + item.Lastprice + ')" type="button" class="btn btn-success btn-sm btn-Buy">B </button> ';
    var sellButton = '<button class="btn-Sell" id="' + btnSellid + '" onclick="buySellPopUp(' + item.ScriptCode + ',2,' + symbolParam + ',' + item.WID + ',' + item.Lastprice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + Qty + ',' + item.ScriptLotSize + ',' + item.Lastprice + ')" type="button" class="btn btn-danger btn-sm btn-Sell"> S </button> ';
    var marketDepthButton = '</div>';
    var actionButton = buyButton + sellButton + deleteButton + marketDepthButton + hiddenCode;

    var btnMarketDepthForClick = "'#" + btnMarketDepth + "'";

    if (item.Scripttype == "FOREX" && Companyinitials == "RT") {
        item.open = (item.open).toFixed(5);
        item.Lastprice = (item.Lastprice).toFixed(5);
        item.high = (item.high).toFixed(5);
        item.low = (item.low).toFixed(5);
        item.close = (item.close).toFixed(5);
    }
    var html = "";
    if ($('#IsTargetStopLossAbsolute').val()=='True') {

        var Scriptexpiry = "";
        if (item.Scriptexpiry != "") {
            var date = item.Scriptexpiry.split(" ");
            Scriptexpiry = '<span style="color: red;font-size: 13px;">' + date[0] + '</span>';
        }
        var scriptInstumentType = '';
        if (item.ScriptInstrumentType == "FUT") {
        }
        else if (item.ScriptInstrumentType == "PE" || item.ScriptInstrumentType == "CE") {
            scriptInstumentType = item.ScriptInstrumentType;
        }
        if (item.ScriptName == "")
            item.ScriptName = item.ScriptTradingSymbol;
        if (item.ScriptName.length > 18) {
            item.ScriptName = item.ScriptName.substring(0, 18) + "...";
        }

        html = '<div class="row" style="border-bottom: 1px solid #ddd;" id="' + item.ScriptCode + '" data-Scripttype="' + item.Scripttype + '"  data-scripttradingsymbol="' + item.ScriptTradingSymbol + '" data-ScriptExchange="' + item.ScriptExchange + '">' +
            '<div class="col-12" >' + actionButton + ' ' +
            '<div class="watchlist-card c-left-border watchlist-table">' +
            '<div class="card-body" id="' + btnMarketDepth + '" style="padding:5px;">' +
            '   <div class="row">' +
            '<div class="col-6">' +
            '  <p class="watchlist-p watchlist-text-BBR Percentage_SEGMENT">  ' + perChangeInDigit + '(' + perCentageHtml + ')</p>' +
            '</div>' +
            '<div class="col-5">' +
            '  <p class="watchlist-p watchlist-text-BBR LTP_SEGMENT" style="margin-left:-13px;float:left;padding-left: 4px;">  ' + LastPriceHtml + '</p>' +
            '</div>' +
            '<div class="col-6">' +
            ' <p class="watchlist-p watchlist-text-BBR">' + item.ScriptName + scriptInstumentType + '</p>' +
            '</div>' +
            '<div class="col-5">' +
            '     <div class="row Bid_Ask_SEGMENT" style="margin-left:2px;">' +
            '             <div class="col-5" style="margin-left:-15px;display: flex;font-size: 20px !important;">' +
            '               ' + '<div class="price-up" style="padding-bottom:0px;">' + item.Bid.toFixed(2) + '</div>' +
            '             </div>' +
            '            <div class="col-7" style="display:flex;margin-left:15px;font-size: 20px !important;">' +
            '              ' + '<div class="price-up" style="padding-bottom:0px;">' + item.Ask.toFixed(2) + '</div>' +
            '       </div> ' +
            '              </div>' +
            '           </div>' +
            /*'<div class="col-12" style="display:flex">' +*/
            '<div class="col-4">' +
            '  <p class="watchlist-p watchlist-text-BBR">' + Scriptexpiry + '</p>' +
            '</div>' +
            '<div class="col-7">' +
            '  <p class="watchlist-p watchlist-text-BBR HIGH_LOW" style="float: left;padding-left: 57px;"> H : ' + item.high + ' |   L : ' + item.low + '</p>' +
            '</div>' +
            /*            '</div>' +*/
            '        </div>' +
            '     </div>' +
            '  </div>' +
            '</div >' +
            '</div >';
    }
    else {
        html = '<div class="row p-2 watchlistRow" id="' + item.ScriptCode + '" data-Scripttype="' + item.Scripttype + '"  data-scripttradingsymbol="' + item.ScriptTradingSymbol + '" data-ScriptExchange="' + item.ScriptExchange + '">' +
            '<div class="col-12" >' + actionButton + ' ' +
            '<div class="watchlist-card c-left-border watchlist-table">' +
            '<div class="card-body" id="' + btnMarketDepth + '" style="padding:5px;">' +
            '   <div class="row">' +
            '<div class="col-6">' +
            ' <p class="watchlist-p watchlist-text">' + item.ScriptTradingSymbol + '</p>' +
            '</div>' +
            '<div class="col-5">' +
            '     <div class="row Bid_Ask_SEGMENT" style="margin-left:2px;">' +
            '             <div class="col-5" style="margin-left:-15px;display: flex;">' +
            '                  <div class="watchlist-text">B:</div>' +
            '               ' + LastBidHtml +
            '             </div>' +
            '            <div class="col-7" style="display:flex;margin-left:15px">' +
            '              <div class="watchlist-text" >A:</div>' + LastAskHtml +
            '       </div> ' +

            '              </div>' +
            '           </div>' +
            '<div class="col-12" style="display:flex">' +
            '<div class="col-6">' +
            '  <p class="watchlist-p watchlist-text HIGH_LOW"> H : ' + item.high + ' |   L : ' + item.low + '</p>' +
            '</div>' +
            '<div class="col-5">' +
            '  <p class="watchlist-p watchlist-text LTP_SEGMENT" style="margin-left:-13px;">  ' + LastPriceHtml + '(' + perCentageHtml + ')</p>' +
            '</div>' +
            '</div>' +
            '        </div>' +
            '     </div>' +
            '  </div>' +
            '</div >' +
            '</div >';
    }
    $('#watchlistDiv').append(html);

}
//#endregion

function openUserProfile() {
    document.getElementById("userDropdown").classList.toggle("show");
}

function MarketDepthPop(ScriptCode, symbolParam) {
    var request = $.ajax({
        url: "/Trade/_MarketDepthMobile",
        type: "POST",
        data: { ScriptCode: ScriptCode },

        success: function (data) {
            $("#marketDepthDiv").html(data);
            marketDepthInterval = setInterval(function () { SetMarketDepthForRefresh(ScriptCode, symbolParam); }, 1000);
            return true;
        }
    });

}
function SetMarketDepthForRefresh(ScriptCode) {
    var request = $.ajax({
        url: "/Trade/_MarketDepthMobile",
        type: "POST",
        data: { ScriptCode: ScriptCode },
        async: true,
        success: function (data) {
            $("#marketDepthDiv").html(data);
            return true;
        }
    });
}

function buySellPopUp(ScriptCode, no, ScriptSymbol, WID, price, instumentType, ScriptExchange, Quantity = 1, ScriptLotSize = 1, TriggerPrice = 0, SL = 0, Target = 0, PriceType = '', ProductType = '', TradeID = 0, sttus = '') {
    $('.upperClause :input').removeAttr('disabled');
    $('#btnProceedBuySell').removeAttr('disabled');
    $("#price").removeClass("has-error");
    $('#buySellModel .modal-title').css("color", "#fff");
    $('#buySellModel #Terror').hide();
    $('#buySellModel #Quantity-error').hide();

    $("#buySellModel #hdnScriptExchange").val(ScriptExchange);
    $("#buySellModel #hdnScriptLotSize").val(ScriptLotSize);
    //debugger;
    var CurrentPosition = "";
    if (no == 1) {
        CurrentPosition = 'Buy';
        $('#buySellModel .modal-title').css("background-color", "#4987ee");
        $('#buySellModel #btnProceedBuySell').css("background-color", "#4987ee");
        $('#buySellModel #btnProceedBuySell').css("color", "#fff");
        $('#buySellModel #btnProceedBuySell').text("Buy");

    }
    else if (no == 2) {
        CurrentPosition = 'Sell';
        $('#buySellModel .modal-title').css("background-color", "#ff4a4a");
        $('#buySellModel #btnProceedBuySell').css("background-color", "#ff4a4a");
        $('#buySellModel #btnProceedBuySell').css("color", "#fff");
        $('#buySellModel #btnProceedBuySell').text("Sell");
    }

    $('#dropTradingUnit').html('');
    if (allowedTradingUnit != null) {
        if (allowedTradingUnit.length > 0) {
            var data = allowedTradingUnit.filter(opt => opt.ScriptExchange == ScriptExchange);
            var units = [];
            if (instumentType == "FUT" || instumentType == "CE" || instumentType == "PE") {
                if (instumentType == "FUT") {
                    if (data[0].Future_Trading_Unit_Type == null || data[0].Future_Trading_Unit_Type == '' || data[0].Future_Trading_Unit_Type == undefined) {
                        units.push(1);
                    } else {
                        units = data[0].Future_Trading_Unit_Type.split(",");
                    }
                }
                else {
                    if (data[0].Options_Trading_Unit_Type == null || data[0].Options_Trading_Unit_Type == '' || data[0].Options_Trading_Unit_Type == undefined) {
                        units.push(1);
                    } else {
                        units = data[0].Options_Trading_Unit_Type.split(",");
                    }
                }
            } else {
                if (data[0].Options_Trading_Unit_Type == null || data[0].Options_Trading_Unit_Type == '' || data[0].Options_Trading_Unit_Type == undefined) {
                    units.push(1);
                }
                else {
                    units = data[0].Equity_Trading_Unit_Type.split(",");
                }
            }
            $.each(units, function (i, item) {
                if (item == "0")
                    item = "1";
                $('#dropTradingUnit').append($("<option></option>").val(parseInt(item)).html(item == "1" ? "Lot" : "Qty"));
            });

        } else {
            $('#dropTradingUnit').append($("<option></option>").val(parseInt(1)).html("Lot"));
        }
    }
    else {
        $('#dropTradingUnit').append($("<option></option>").val(parseInt(1)).html("Lot"));
    }
    $("#lblScriptSymbol").text(ScriptSymbol.toString());
    $("#lblScriptCode").text(ScriptCode.toString());
    $("#lblCurrentPosition").text(CurrentPosition);
    $("#WID").val(WID);
    $("#hdnPrice").val(price);
    $("#hdnTradeID").val(TradeID.toString());
    $("#price").val('0');
    $("#TriggerPrice").val(TriggerPrice.toString());
    $("#txtStopLoss").val(SL.toString());
    $("#txtTarget").val(Target.toString());
    $("#Quantity").val(Quantity.toString());
    if (instumentType != 'EQ') {
        $('#rbtnNrml').val('NRML');
        $('#Itype').text('NRML');
    }
    else {
        $('#rbtnNrml').val('CNC');
        $('#Itype').text('CNC');
    }
    $("#rbtnMarket").prop('checked', true);
    $('#rbtnNrml').prop('checked', true);

    if (Companyinitials == "VM") {
        $(".ProductTypeDiv").css("display", "none");
        $(".TriggerPriceDiv").css("display", "none");
        $(".rbtnSLDiv").css("display", "none");
        $("#tgtSLDiv").css("display", "none");
        $(".tgtSLDivSL").css("display", "none");
    }
    if (Companyinitials == "EXPO") {
        $(".TriggerPriceDiv").css("display", "none");
        $(".rbtnSLDiv").css("display", "none");
        $(".RememberDiv").css("display", "none");
    }
    if (PriceType.length == 0) {

        var RememberData = localStorage.getItem("RememberTargetStoploss");
        if (RememberData != null) {
            RememberData = JSON.parse(RememberData);
            $("#cbxRememberTargetStoploss").prop('checked', true);
            // $("#txtTarget").val(RememberData.TGT);
            // $("#txtStopLoss").val(RememberData.SL);

            if (RememberData.PRODUCT_TYPE != null && RememberData.PRODUCT_TYPE != '') {
                RememberData.PRODUCT_TYPE == 'MIS' ? $('input[Name=ProductType]#rbtnIntraday').trigger('click') : $('input[Name=ProductType]#rbtnNrml').trigger('click');
            }
            if (RememberData.PRICE_TYPE != null && RememberData.PRICE_TYPE != '') {
                if (RememberData.PRICE_TYPE == 'MARKET') {
                    $('input[Name=MarketType]#rbtnMarket').trigger('click');
                } else if (RememberData.PRICE_TYPE == 'Limit') {
                    $('input[Name=MarketType]#rbtnLimit').trigger('click');
                }
                else if (RememberData.PRICE_TYPE == 'SL') {
                    $('input[Name=MarketType]#rbtnSL').trigger('click');
                }
                else if (RememberData.PRICE_TYPE == 'SL-M') {
                    $('input[Name=MarketType]#rbtnSLM').trigger('click');
                }
            }
            PriceType = $('input[Name=MarketType]:checked').val();
        }
        else {
            $("input[Name=MarketType]#rbtnMarket").trigger('click');
            $('input[Name=ProductType]#rbtnNrml').trigger('click');
        }
    }
    if (PriceType != null && PriceType != '') {
        if (PriceType == 'MARKET') {
            $('input[Name=MarketType]#rbtnMarket').trigger('click');
        } else if (PriceType == 'Limit') {
            $('input[Name=MarketType]#rbtnLimit').trigger('click');
        }
        else if (PriceType == 'SL') {
            $('input[Name=MarketType]#rbtnSL').trigger('click');
        }
        else if (PriceType == 'SL-M') {
            $('input[Name=MarketType]#rbtnSLM').trigger('click');
        }
    }


    if (ProductType != null && ProductType != '') {
        if (ProductType == 'MIS') {
            //$('#tgtSLDiv').hide();
            //$('#txtTarget').val('0');
            //$('#txtStopLoss').val('0');
            $('#rbtnIntraday').prop('checked', true);
        }
        else {
            $('#tgtSLDiv').show();
        }
    }
    if (sttus == 'COMPLETE')
        $('.upperClause :input').attr('disabled', 'disabled');
   

    $('#buySellModel').modal({
        backdrop: false,
        show: true
    });


    $("body").removeClass('modal-open');
    $("#hdnSt").val(sttus);


    
    isShowDepthModal = false;

    //var Companyinitials = $("#CompanyInitial").val();
    //if (Companyinitials == "EXPO") {
    //    ProceedBuySell();
    //}
    var IsOneClickEnabled = localStorage.getItem("IsOneClickEnabled");
    if (IsOneClickEnabled == "1") {
        ProceedBuySell();
    }
    if (ScriptExchange != "MCX") {
        $('#QuantityWiseBuy').css('display', 'none');
        $('#marketTypeDiv').addClass('col-md-offset-4');
    }
    else {
        $('#QuantityWiseBuy').css('display', 'block');
        $('#marketTypeDiv').removeClass('col-md-offset-4');
    }
    marginInterval = setInterval(function () { GetRequiredMargin(); }, 1000);
}

function GetRequiredMargin() {
    //debugger
    var MisOrNot = 0;
    var ScriptLotSize = $("#buySellModel #hdnScriptLotSize").val();
    $('#buySellModel #DivGetLotSize').text(ScriptLotSize);
    var ScriptCode = $("#lblScriptCode").text();
    var quantity = $("#Quantity").val();
    var Totalwalletbalance = 0;
    var Lastprice = $('#lblLastPrice').text();
    var intradayradiobutton = document.getElementById('rbtnIntraday');
    var ScriptExchange = $("#buySellModel #hdnScriptExchange").val();

    if (intradayradiobutton.checked == true) {
        MisOrNot = 1;
    }
    var BuyQtyWiseOrLotWise = $('#dropTradingUnit option:selected').text().toLowerCase() == "Qty" ? 1 : 0;

    var CurrentPosition = $("#lblCurrentPosition").text();
    if (CurrentPosition == 'Buy')
        Lastprice = $('#lblLastBid').text();
    else
        Lastprice = $('#lblLastAsk').text();

    if (Lastprice != '' && Lastprice != null) {
        var input = { 'ScriptLotSize': ScriptLotSize, 'ScriptCode': ScriptCode, 'quantity': quantity, 'Totalwalletbalance': Totalwalletbalance, 'MisOrNot': MisOrNot, 'Lastprice': Lastprice, 'TRADING_UNIT_TYPE': $("#dropTradingUnit").val(), 'ScriptExchange': ScriptExchange };

        var request = $.ajax({
            url: "/Trade/GetRequiredMargin",
            type: "GET",
            data: input,
            dataType: 'json',
            success: function (data) {
                SetRequiredMargin(data);
            }
        });
    }
}

function SetRequiredMargin(item) {
    //debugger
    if (item.length != null) {
        if (item.length > 0) {
            for (var i = 0; i < item.length; i++) {
                $('#buySellModel #DivGetRequiredMargin').text(item[i].Requiredmargin);
                $('#buySellModel #DivGetAvailableMargin').text(item[i].Availablemargin);
                $('#buySellModel #DivGetUsedMargin').text(item[0].Usedmargin);

                if (item[i].Requiredmargin > item[i].Availablemargin)
                    $('#DivGetAvailableMargin').css('color', 'red');
                else
                    $('#DivGetAvailableMargin').css('color', 'green');
            }
        }
        else {
            $('#buySellModel #DivGetRequiredMargin').text(0);
            $('#buySellModel #DivGetAvailableMargin').text(0);
            $('#buySellModel #DivGetUsedMargin').text(0);
        }
    }
    else {
        $('#buySellModel #DivGetRequiredMargin').text(0);
        $('#buySellModel #DivGetAvailableMargin').text(0);
        $('#buySellModel #DivGetUsedMargin').text(0);
    }
}
function removeScript(ScriptCode, intWID) {
    //debugger
    HideDepthModal();
    isShowDepthModal = false;
    var result = confirm("Are you sure you want to delete?");
    if (result && ScriptCode > 0 && intWID > 0) {
        var request = $.ajax({
            url: "/Watchlist/DeleteScript",
            type: "POST",
            data: { intWID: intWID, ScriptCode: ScriptCode },
            dataType: 'json',
            traditional: true,
            success: function (data) {
                var results = JSON.parse(data);

                if (results.IsError) {
                    toastr.error('Can Not Delete This Record.There Is One Active Trade.');
                    return false;
                }
                else {
                    var table = $('#tblList').DataTable();
                    $("#" + ScriptCode).remove();
                    toastr.success('Script Deleted Successfully.');
                    return false;
                }

            }

        });

    }
}
function ProceedBuySell() {
    var quantity = $("#Quantity").val();
    if (quantity < 0.01) {
        toastr.error("Invalid Qty");
        return;
    }
    if ($("#cbxRememberTargetStoploss").prop('checked') == true) {
        var data = {
            PRODUCT_TYPE: $('input[Name=ProductType]:checked').val(),
            PRICE_TYPE: $('input[Name=MarketType]:checked').val() };
        localStorage.setItem("RememberTargetStoploss", JSON.stringify(data));
    }
    else {
        localStorage.removeItem("RememberTargetStoploss");
    }

    var ScriptCode = $("#lblScriptCode").text();
    var CurrentPosition = $("#lblCurrentPosition").text();
    intWID = $("#WID").val();
    var target = $("#txtTarget").val();
    var stopLoss = $("#txtStopLoss").val();
    var ScriptExchange = $("#buySellModel #hdnScriptExchange").val();
    var ScriptLotSize = $("#buySellModel #hdnScriptLotSize").val();
    var price = $("#price").val();
    var TriggerPrice = $("#TriggerPrice").val();
    var tradeID = $("#hdnTradeID").val();
    var ProductType = $('input[Name=ProductType]:checked').val();
    var marketType = $('input[Name=MarketType]:checked').val();
    if (ScriptCode == null || ScriptCode == "" ||
        CurrentPosition == null || CurrentPosition == "") {
        alert("Please enter correct details");
        return;
    }
    var HighLowCircuitRequired = $("#HighLowCircuitRequired").val();
    if (HighLowCircuitRequired == 0) {
        if (marketType == "SL" || marketType == "SL-M") {
            var oprice = parseFloat(price);
            var tprice = parseFloat(TriggerPrice);
            var hdprice = $('#buySellModel #hdnPrice').val();
            var hdnPrice = parseFloat(hdprice);
            var showError = false;
            var msg = "";

            if (marketType == "SL") {
                if (CurrentPosition == "Sell" && marketType == "SL" && oprice > tprice) {
                    showError = true;
                    msg = "Trigger price connot be less than order price";
                }
                else if (CurrentPosition == "Buy" && marketType == "SL" && oprice < tprice) {
                    showError = true;
                    msg = "Trigger price Cannot be higher than order price";
                }
            }
            if (CurrentPosition == "Sell" && tprice > hdnPrice) {
                showError = true;
                msg = "Trigger price Cannot be higher than last price";
            }
            else if (CurrentPosition == "Buy" && tprice < hdnPrice) {
                showError = true;
                msg = "Trigger price connot be less than last price";
            }
            if (showError) {
                toastr.error(msg);
                $('#btnProceedBuySell').removeAttr('disabled');
                return;
            }

        }
        if (marketType == "Limit") {
            var oprice = parseFloat(price);
            var hdprice = $('#buySellModel #hdnPrice').val();
            var hdnPrice = parseFloat(hdprice);
            var showError = false;
            var msg = "";

            if (CurrentPosition == "Sell" && oprice < hdnPrice) {
                showError = true;
                msg = "Limit price Cannot be less than last price";
            }
            else if (CurrentPosition == "Buy" && oprice > hdnPrice) {
                showError = true;
                msg = "Limit price connot be greater than last price";
            }
            if (showError) {
                $("#price").addClass("has-error");
                toastr.error(msg);
                $('#btnProceedBuySell').removeAttr('disabled');
                return;
            }

        }
    }
    var st = $("#hdnSt").val();
    var TRADING_UNIT = $("#dropTradingUnit").val();

    if (ScriptCode > 0 && intWID > 0 && quantity != '' && quantity != '0') {
        var request = $.ajax({
            url: "/Trade/ProceedBuySell",
            type: "POST",
            data: { intWID: intWID, ScriptCode: ScriptCode, CurrentPosition: CurrentPosition, allUsers: false, target: target, stopLoss: stopLoss, Quantity: quantity, price: price, TriggerPrice: TriggerPrice, ProductType: ProductType, MarketType: marketType, TradeID: tradeID, Status: st, iscbxAutoBinanceSlTrailEnabled: 0, TRADING_UNIT: TRADING_UNIT },
            dataType: 'json',
            async: true,
            success: function (data) {
                var results = JSON.parse(data);

                if (results.IsError) {

                    HidePopUp();
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
    HidePopUp();
    $('#btnProceedBuySell').removeAttr('disabled');
}

function HidePopUp() {
    $("#buySellModel").modal('hide');
}

