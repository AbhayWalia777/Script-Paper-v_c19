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
var companyInitials;

var clicked_Watchlist_InstrumentToken = "";
var clicked_Watchlist_ScriptTradingSymbol = "";
var clicked_Watchlist_ScriptExchange = "";
var BindClickButton = "";
var allowedTradingUnit;

//#region Get Sensex And Nifty Data
function FavoriteWatchlist() {
    $.ajax({
        url: '/Trade/SetFavoriteWatchlistData2',
        type: 'GET',
        dataType: 'json',
        success: function (Output) {
            if (Output != null) {
                var result = JSON.parse(Output);
                if (result.objLstWatchList.length > 0) {
                    for (var i = 0; i < result.objLstWatchList.length; i++) {
                        var PerChange = parseFloat(result.objLstWatchList[i].LastPrice) - parseFloat(result.objLstWatchList[i].close);
                        var perCentageHtml = "";
                        var absolute = "";
                        var perCentage = "";
                        if (PerChange < 0) {
                            perCentage = (parseFloat(PerChange) / parseFloat(result.objLstWatchList[i].close)) * 100;
                            perCentageHtml = '<i class="fa percentage-down">&nbsp' + perCentage.toFixed(2) + '</i>';
                            absolute = '<i class="fa fa-angle-down percentage-down"  style="font-size: 10px;padding-top: 5px;">&nbsp' + PerChange.toFixed(2) + '</i>';
                        }
                        else if (PerChange > 0) {
                            perCentage = (parseFloat(PerChange) / parseFloat(result.objLstWatchList[i].close)) * 100;
                            perCentageHtml = '<i class="fa percentage-up">&nbsp' + perCentage.toFixed(2) + '</i>';
                            absolute = '<i class="fa fa-angle-up percentage-up"  style="font-size: 10px;padding-top: 5px;">&nbsp' + PerChange.toFixed(2) + '</i>';
                        }
                        else if (PerChange == 0) {
                            perCentage = 0;
                            perCentageHtml = '<i class="fa percentage-up">&nbsp' + perCentage.toFixed(2) + '</i>';
                            absolute = '<i class="fa fa-angle-up percentage-up"  style="font-size: 10px;padding-top: 5px;">&nbsp' + PerChange.toFixed(2) + '</i>';
                        }
                        if (i == 0) {
                            $('.favorite1').html('<span class="sensex" style="font-size: 9px;font-weight: unset;">' + result.objLstWatchList[0].ScriptTradingSymbol + '&nbsp(' + perCentageHtml + ') </span><br /><span class="sensex-price" style=" display: inline-flex;"> ' + result.objLstWatchList[0].LastPrice.toFixed(1) + '&nbsp' + absolute + '</span>');
                        }
                        if (i == 1) {
                            $('.favorite2').html('<span class="nifty" style="font-size: 9px;font-weight: unset;">' + result.objLstWatchList[1].ScriptTradingSymbol + '&nbsp(' + perCentageHtml + ') </span><br /><span class="nifty-price" style=" display: inline-flex;"> ' + result.objLstWatchList[1].LastPrice.toFixed(1) + '&nbsp' + absolute + '</span>');
                        }
                    }
                }
            }
        },
        error: function (error) {
        }
    });
}
function BindClick() {
    $('.watchlistRowView').bind('click', function () {
        var BtnID = $(this).attr('data-scriptType');
        $('.BuySellButton').css('display', 'none');
        $('#' + BtnID).css('display', 'initial');
        if (BindClickButton == BtnID) {
            $('.BuySellButton').css('display', 'none');
            BindClickButton = 0;
        }
        else
            BindClickButton = BtnID;
    });
}
//#region Document Ready Function 
$(document).ready(function () {
    allowedTradingUnit = JSON.parse($("#TradingUnitAccess").val());
    companyInitials = $("#CompanyInitial").val();
    //#region Add Shimmer Effect While Changing Watchlist
    $(document).on('change', '#Drp-Segments', function () {
        $('#watchlistDiv').html('');
        $('#watchlistDiv').append('<br><photo class="shine-watchlist"></photo>' +
            '<photo class= "shine-watchlist"></photo>' +
            '<photo class= "shine-watchlist"></photo>' +
            '<photo class="shine-watchlist"></photo>' +
            '<photo class="shine-watchlist"></photo>' +
            '<photo class="shine-watchlist"></photo>' +
            '<photo class="shine-watchlist"></photo>');
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
    $('input[name=MarketType]').on('click', function (ele) {
        var value = $(ele.currentTarget).val();
        var priceval = $('#hdnPrice').val();
        var Triggerval = $('#hdnPrice').val();;
        $('#txtTarget').removeAttr('disabled');
        $('#txtTarget').removeAttr('readonly');
        $('#txtStopLoss').removeAttr('disabled');
        $('#txtStopLoss').removeAttr('readonly');
        if (value == 'LIMIT') {
            $('#buySellModel #Price').removeAttr('disabled');
            $('#buySellModel #Price').removeAttr('readonly');
            $('#buySellModel #Price').val(priceval);
            $('#buySellModel #TriggerPrice').val('0');
            $('#buySellModel #TriggerPrice').attr('disabled', 'disabled');
        }
        else if (value == 'SL') {
            $('#buySellModel #Price').removeAttr('disabled');
            $('#buySellModel #Price').removeAttr('readonly');
            $('#buySellModel #Price').val(priceval);
            $('#buySellModel #TriggerPrice').val(Triggerval);
            $('#buySellModel #TriggerPrice').removeAttr('disabled');
            $('#buySellModel #TriggerPrice').removeAttr('readonly');
        }
        else if (value == 'SL-M') {
            $('#buySellModel #TriggerPrice').removeAttr('disabled');
            $('#buySellModel #TriggerPrice').removeAttr('readonly');
            $('#buySellModel #TriggerPrice').val(Triggerval);
            $('#buySellModel #Price').val('0');
            $('#buySellModel #Price').attr('disabled', 'disabled');
            $('#txtTarget').attr('disabled', 'disabled');
            $('#txtTarget').attr('readonly', 'readonly');
            $('#txtStopLoss').attr('disabled', 'disabled');
            $('#txtStopLoss').attr('readonly', 'readonly');
        }
        else if (value == 'MARKET') {
            $('#buySellModel #Price').val('0');
            $('#buySellModel #Price').attr('disabled', 'disabled');
            $('#buySellModel #Price').attr('readonly', 'readonly');
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
        $("#searchText-add").val("");
        SetTradeDataForRefresh();
    });
    $("#searchText-add").on('keyup', function () {
        $("#searchText").val("");
        SetTradeDataForRefresh();
    });

    //#region Buy Sell Div Details

    $('#btn-Search-Main').on('click', function () {
        $('#btn-Cross-Main').css('display', 'revert');
        $('#btn-Search-Main').css('display', 'none');
        $('#Div_searchWatch').css('display', 'revert');
        $('#fav_div').css('display', 'none');
        $('#searchText').val("");
        $('#searchText-add').val("");
    });
    $('#btn-Cross-Main').on('click', function () {
        $('#btn-Cross-Main').css('display', 'none');
        $('#btn-Search-Main').css('display', 'revert');
        $('#Div_searchWatch').css('display', 'none');
        $('#fav_div').css('display', 'revert');
        $('#searchText').val("");
        $('#searchText-add').val("");
    });
    $('#btn-Add-More-Script').on('click', function () {
        $('#searchText').val("");
        $('#searchText-add').val("");
        var $options = $('#Drp-Segments>option').clone();
        $('#Drp-Segments-add').html('');
        $('#Drp-Segments-add').append($options);
        $('#Drp-Segments-add').val($('#Drp-Segments option:selected').val());
        $(".AddDeleteScriptDiv").css('display', 'inherit');
        $('#watchlistDiv').css('display', 'none');

    });
    $(document).on('change', '#Drp-Segments-add', function () {
        $('#Drp-Segments').val($('#Drp-Segments-add option:selected').val());
        $('.TxtSegment_ID').html($('#Drp-Segments option:selected').text());
        localStorage.setItem('GetSegments', $('#Drp-Segments option:selected').val());
        SetTradeDataForRefresh();
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
        var Tempscriptname = $('#Drp-Segments option:selected').val();
        var Wid = Tempscriptname.split('>')[0];
        var ScriptInstrumentType = Tempscriptname.split('>')[1];
        var DataForSearch = $("#searchText").val().length > 0 ? $("#searchText").val() : $("#searchText-add").val();
        /*var Wid = $("#custom-tabs-one-tab > li.nav-item.active a").attr("data-id");*/
        var selectedScriptExchange = $("#cboScriptExchange option:selected").val();
        var input = { 'Wid': 0, 'scriptExchangeType': "", 'searchedData': DataForSearch, 'ScriptExchange': Wid, 'ScriptInstrumentType': ScriptInstrumentType, 'OnlyCurrentMonth': 1 };
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
        $('#watchlistDiv').html('');
        $('#Add-WatchDiv').html('');
        if (results.objLstWatchList != null) {
            //Set data for WatchList trade
            if (results.objLstWatchList.length > 0) {

                for (var i = 0; i < results.objLstWatchList.length; i++) {
                    var result = results.objLstWatchList[i];
                    SetWatchTradeDetails(result);
                    SetWatchTradeDetailsForAdd(result, '');
                }
            }
            else {
                $('#watchlistDiv').html('');

            }
            BindClick();
        }
        if (results.WatchlistDataForAdd != null) {
            //Set data for WatchList trade
            if (results.WatchlistDataForAdd.length > 0) {

                for (var i = 0; i < results.WatchlistDataForAdd.length; i++) {
                    var result = results.WatchlistDataForAdd[i];
                    SetWatchTradeDetailsForAdd(result, 'ADD');
                }
            }
        }
        if (results.OrderExceptionList.length > 0) {
            var html = '<div><div class="col=12" style="text-align:center;"><b style="color:red;">ERROR</b></div><br>';
            for (var i = 0; i < results.OrderExceptionList.length; i++) {
                html += '<div class=" row  watchlist-card c-left-border watchlist-table" style="border-bottom: 1px solid #ddd;"><div class="col-12" style = "text-align:center;"> ' + results.OrderExceptionList[i].Tradingsymbol + '</div><div class="col-4" style = "text-align:center;"> Qty: ' + results.OrderExceptionList[i].Quantity + '</div><div class="col-4" style = "text-align:center;"> Price: ' + results.OrderExceptionList[i].Price + '</div><div class="col-2" style = "text-align:center;"> CP: ' + results.OrderExceptionList[i].TransactionType + '</div>Msg:' + results.OrderExceptionList[i].Message + '</div>';
            }
            html += '</div>';
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
            var SCRIPT_TYPE = (table.children[i].dataset.scripttype);
            if (htmlDivId != undefined && htmlDivId != '') {
                if (nData != null) {
                    if (nData.filter(x => x.InstrumentToken == $("#" + htmlDivId + "").find('input[name=hiddenCode]').val()).length > 0) {
                        var newL = nData.filter(opt => opt.InstrumentToken == $("#" + htmlDivId + "").find('input[name=hiddenCode]').val());
                        if (newL.length > 0) {
                            var item = newL[0];

                            var PreviousLastPrice = 0.0;
                            var PreviousBidPrice = 0.0;
                            var PreviousAskPrice = 0.0;
                            var LtpColor = "";
                            var AskColor = "";
                            var BidColor = "";
                            for (var keys in LastPriceDictionary) {
                                if (LastPriceDictionary[keys].key == item.InstrumentToken) {
                                    PreviousLastPrice = parseFloat(LastPriceDictionary[keys].value);
                                    PreviousBidPrice = parseFloat(LastPriceDictionary[keys].Bid);
                                    PreviousAskPrice = parseFloat(LastPriceDictionary[keys].Ask);
                                    LtpColor = (LastPriceDictionary[keys].LtpColor);
                                    AskColor = (LastPriceDictionary[keys].AskColor);
                                    BidColor = (LastPriceDictionary[keys].BidColor);
                                    break;
                                }
                            }
                            item.Ask = item.Ask > 0 ? item.Ask : 0;
                            item.Bid = item.Bid > 0 ? item.Bid : 0;
                            item.LastPrice = item.LastPrice > 0 ? item.LastPrice : 0;
                            item.Close = item.Close > 0 ? item.Close : 0;

                            var LastAskHtml = "";
                            if (parseFloat(item.Ask) > PreviousAskPrice) {
                                LastAskHtml = '<div class="price-up" style="padding-bottom:0px;display:inline-flex;width:100%;"><b style="color: black;">A :</b>' + item.Ask.toFixed(2) + '</div>';
                                AskColor = "price-up";
                            }
                            if (parseFloat(item.Ask) < PreviousAskPrice) {
                                LastAskHtml = '<div class="price-down" style="padding-bottom:0px;display:inline-flex;width:100%;"><b style="color: black;">A :</b>' + item.Ask.toFixed(2) + '</div>';
                                AskColor = "price-down";
                            }
                            if (item.Ask == PreviousAskPrice) {
                                if (AskColor == "")
                                    AskColor = "price-up";
                                LastAskHtml = '<div class="' + AskColor + '" style="padding-bottom:0px;display:inline-flex;width:100%;"><b style="color: black;">A :</b>' + item.Ask.toFixed(2) + '</div>';
                            }
                            var LastBidHtml = "";

                            if (item.Close == null)
                                item.Close = 0;

                            var PerChange = parseFloat(item.LastPrice) - parseFloat(item.Close);
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
                                perChangeInDigit = '<i class="fa percentage-price-down">&nbsp&nbsp' + PerChange.toFixed(2) + '</i>';
                            }
                            else if (PerChange >= 0) {
                                perCentage = (parseFloat(PerChange) / parseFloat(item.Close)) * 100;
                                if (SCRIPT_TYPE == "BINANCE") {
                                    perCentage = item.Change;
                                }
                                if (SCRIPT_TYPE == "FOREX") {
                                    perCentage = 0.00;
                                }
                                perCentageHtml = '<i class="fa fa-angle-up percentage-price-up">' + perCentage.toFixed(2) + '</i>';
                                perChangeInDigit = '<i class="fa percentage-price-up">&nbsp&nbsp' + PerChange.toFixed(2) + '</i>';
                            }
                            var LastPriceHtml = "";
                            if (parseFloat(item.LastPrice) > PreviousLastPrice) {
                                LastPriceHtml = 'LTP : <span class="price-up">(' + item.LastPrice.toFixed(2) + ')</span>';
                                LtpColor = "price-up";
                            }
                            if (parseFloat(item.LastPrice) < PreviousLastPrice) {
                                LastPriceHtml = 'LTP : <span class="price-down">(' + item.LastPrice.toFixed(2) + ')</span>';
                                LtpColor = "price-down";
                            }
                            if (item.LastPrice == PreviousLastPrice) {
                                if (LtpColor == "")
                                    LtpColor = "price-up";
                                LastPriceHtml = 'LTP : <span class="' + LtpColor + '">(' + item.LastPrice.toFixed(2) + ')</span>';
                            }

                            if (parseFloat(item.Bid) > PreviousBidPrice) {
                                LastBidHtml = '<div class="price-up" style="padding-bottom:0px;display:inline-flex;width:100%;"><b style="color: black;">B :</b> ' + item.Bid.toFixed(2) + '</div>';
                                BidColor = "price-up";
                            }
                            if (parseFloat(item.Bid) < PreviousBidPrice) {
                                LastBidHtml = '<div class="price-down" style="padding-bottom:0px;display:inline-flex;width:100%;"><b style="color: black;">B :</b> ' + item.Bid.toFixed(2) + '</div>';
                                BidColor = "price-down";
                            }
                            if (item.Bid == PreviousBidPrice) {
                                if (BidColor == "")
                                    BidColor = "price-up";
                                LastBidHtml = '<div class="' + BidColor + '" style="padding-bottom:0px;display:inline-flex;width:100%;"><b style="color: black;">B :</b> ' + item.Bid.toFixed(2) + '</div>';
                            }

                            $("#" + htmlDivId + "").find('.Percentage_SEGMENT').html(perChangeInDigit + '(' + perCentageHtml + '%)');
                            $("#" + htmlDivId + "").find('.LTP_SEGMENT').html('(' + item.LastPrice.toFixed(2) + ')');
                            $("#" + htmlDivId + "").find('.Item_Low').html('L: ' + item.Low.toFixed(2) + '');
                            $("#" + htmlDivId + "").find('.Item_High').html('H: ' + item.High.toFixed(2) + '');
                            $("#" + htmlDivId + "").find('.Item_Open').html('O: ' + item.Open.toFixed(2) + '');
                            $("#" + htmlDivId + "").find('.Item_Bid').html(LastBidHtml);
                            $("#" + htmlDivId + "").find('.Item_Ask').html(LastAskHtml);



                            if ($('#buySellModel #lblScriptCode').text() == item.ScriptCode) {
                                var ltp = item.LastPrice.toFixed(0).toString();
                                $('#buySellModel #lblLastPrice').text(ltp);
                                $('#buySellModel #lblLastBid').text(item.Bid.toFixed(0));
                                $('#buySellModel #lblLastAsk').text(item.Ask.toFixed(0));
                                $('#buySellModel #lblLow').text(item.Low.toFixed(0));
                                $('#buySellModel #lblHigh').text(item.High.toFixed(0));
                                $('#buySellModel #lblOpen').text(item.Open.toFixed(0));
                                $('#buySellModel #hdnPrice').val(ltp);
                            }
                            var IsExistsLTP = false;
                            for (var keys in LastPriceDictionary) {
                                if (LastPriceDictionary[keys].key == item.InstrumentToken) {
                                    IsExistsLTP = true;
                                    LastPriceDictionary[keys].value = item.LastPrice;
                                    LastPriceDictionary[keys].Bid = item.Bid;
                                    LastPriceDictionary[keys].Ask = item.Ask;
                                    LastPriceDictionary[keys].LtpColor = LtpColor;
                                    LastPriceDictionary[keys].AskColor = AskColor;
                                    LastPriceDictionary[keys].BidColor = BidColor;
                                    break;
                                }
                            }
                            if (!IsExistsLTP) {
                                LastPriceDictionary.push({
                                    key: item.InstrumentToken,
                                    value: item.LastPrice,
                                    Bid: item.Bid,
                                    Ask: item.Ask,
                                    LtpColor: LtpColor,
                                    AskColor: AskColor,
                                    BidColor: BidColor
                                });
                            }


                        }
                        /*if ($('#buySellModel').hasClass('in')) {*/
                        var newL = nData.filter(opt => opt.InstrumentToken == $('#buySellModel #lblScriptCode').text());
                        if (newL.length > 0) {
                            $('#buySellModel #lblLastPrice').text(newL[0].LastPrice);
                            $('#buySellModel #lblLastBid').text(newL[0].Bid);
                            $('#buySellModel #lblLastAsk').text(newL[0].Ask);
                            $('#buySellModel #hdnHigh').text(newL[0].High);
                            $('#buySellModel #hdnLow').text(newL[0].Low);
                            $('#buySellModel #hdnPrice').val(newL[0].LastPrice);
                            $('#buySellModel #lblLow').text(newL[0].Low);
                            $('#buySellModel #lblHigh').text(newL[0].High);
                            $('#buySellModel #lblOpen').text(newL[0].Open);
                            $('#buySellModel #lblOpen').text($('#buySellModel #hdnBidAsk').val() == "BUY" ? newL[0].Bid : newL[0].Ask);

                        }
                        /*}*/
                        if ($('.mobile-context-menu').css('display') == 'block') {
                            var newL = nData.filter(opt => opt.InstrumentToken == clicked_Watchlist_InstrumentToken);
                            if (newL.length > 0) {
                                $('#lastPriceMobileContextMenu').html('LTP : ' + newL[0].LastPrice);
                            }
                        }
                    }
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
    var LastPriceHtml = ' LTP <span class="price-up" >' + item.LastPrice.toFixed(2) + '</span>';

    var symbolParam = item.ScriptName.replace(/'/g, "");
    symbolParam = '\'' + symbolParam + '\'';

    var script_Trading_Symbol = item.ScriptTradingSymbol.replace(/'/g, "");
    script_Trading_Symbol = '\'' + script_Trading_Symbol + '\'';
    var ScriptInstrumentType = '\'' + item.ScriptInstrumentType + '\'';
    var ScriptExchange = '\'' + item.ScriptExchange.toString() + '\'';

    var PerChange = parseFloat(item.LastPrice) - parseFloat(item.close);
    var perCentageHtml = "";
    var perCentage = "";
    var perChangeInDigit = "";
    if (PerChange < 0) {
        perCentage = (parseFloat(PerChange) / parseFloat(item.close)) * 100;
        if (item.ScriptType == "BINANCE") {
            perCentage = item.PerChange;
        }
        if (item.ScriptType == "FOREX") {
            perCentage = 0.00;
        }
        perCentageHtml = '<i class="fa fa-angle-down percentage-price-down">&nbsp&nbsp' + perCentage.toFixed(2) + '</i>';
        perChangeInDigit = '<i class="fa percentage-price-down">&nbsp&nbsp' + PerChange.toFixed(2) + '</i>';
    }
    else if (PerChange > 0) {
        perCentage = (parseFloat(PerChange) / parseFloat(item.close)) * 100;
        if (item.ScriptType == "BINANCE") {
            perCentage = item.PerChange;
        }
        if (item.ScriptType == "FOREX") {
            perCentage = 0.00;
        }
        perCentageHtml = '<i class="fa fa-angle-up percentage-price-up">&nbsp&nbsp' + perCentage.toFixed(2) + '</i>';
        perChangeInDigit = '<i class="fa percentage-price-up">&nbsp&nbsp' + PerChange.toFixed(2) + '</i>';
    }
    else if (PerChange == 0) {
        perCentage = 0;
        if (item.ScriptType == "BINANCE") {
            perCentage = item.PerChange;
        }
        if (item.ScriptType == "FOREX") {
            perCentage = 0.00;
        }
        perCentageHtml = '<i class="fa fa-angle-up percentage-price-up">&nbsp&nbsp' + perCentage.toFixed(2) + '</i>';
        perChangeInDigit = '<i class="fa percentage-price-up">&nbsp&nbsp' + PerChange.toFixed(2) + '</i>';
    }

    var qty = 1;

    var hiddenCode = '<input name="hiddenCode" value="' + item.ScriptCode + '" type="hidden" >';
    var btnBuyid = "btnBuy" + item.ScriptCode;
    var btnSellid = "btnSell" + item.ScriptCode;
    var btnMarketDepth = "btnMarketDepth" + item.ScriptCode;
    var btnDeleteid = "btnDelete" + item.ScriptCode;
    var deleteButton = ' <button id="' + btnDeleteid + '" onclick="removeScript(' + item.ScriptCode + ',' + item.WID + ')" type="button" class="btn btn-warning btn-sm btn-delete"><i class="fa fa-trash-o"></i></button> ';
    var buyButton = '<div tabindex="-1" class="b-btn" style="float:right;"><button id="' + btnBuyid + '" onclick="buySellPopUp(' + item.ScriptCode + ',1,' + symbolParam + ',' + item.WID + ',' + item.LastPrice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + qty + ',' + item.ScriptLotSize  + ')" type="button" class="btn btn-success btn-sm btn-buy tradebuyButton">BUY</button> ';
    var sellButton = '<button id="' + btnSellid + '" onclick="buySellPopUp(' + item.ScriptCode + ',2,' + symbolParam + ',' + item.WID + ',' + item.LastPrice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + qty + ',' + item.ScriptLotSize  + ')" type="button" class="btn btn-danger btn-sm btn-sell tradeSellButton">SELL</button> ';
    var marketDepthButton = '</div>';
    var actionButton = buyButton + sellButton + hiddenCode + marketDepthButton /*+ deleteButton*/;

    var btnMarketDepthForClick = "'#" + btnMarketDepth + "'";

    if (item.ScriptType == "FOREX" && companyInitials == "RT") {
        item.open = (item.open).toFixed(5);
        item.LastPrice = (item.LastPrice).toFixed(5);
        item.high = (item.high).toFixed(5);
        item.low = (item.low).toFixed(5);
        item.close = (item.close).toFixed(5);
    }
    var html = "";

    var ScriptExpiry = "";
    if (item.ScriptExpiry != "") {
        var date = item.ScriptExpiry.split(" ");
        ScriptExpiry = '<span style="color: red;" class="watchlist-p watchlist-text-BBR">' + date[0] + '</span>';
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

    html = '<div class="row " style="border-bottom: 1px solid #ddd;" id="' + item.ScriptCode + '" data-scriptType="' + item.ScriptType + '"  data-scripttradingsymbol="' + item.ScriptTradingSymbol + '" data-scriptexchange="' + item.ScriptExchange + '">' +
        '<div class="col-12 watchlistRowView" data-scriptType="Btn' + item.ScriptCode + '"  data-scripttradingsymbol="' + item.ScriptTradingSymbol + '" data-scriptexchange="' + item.ScriptExchange + '">' +
        '<div class="watchlist-card c-left-border watchlist-table">' +
        '<div class="card-body" id="' + btnMarketDepth + '" style="padding:5px;">' +
        '   <div class="row">' +
        '<div style="background: #f1f0f0;display: inline-flex;width: 100%;height: 22px;" class="col-12">' +
        '<div class="col-6" style="display:inline-flex;">' +
        ' <p class="watchlist-p watchlist-text-BBR">' + item.ScriptName + scriptInstumentType + '</p>' +
        '&nbsp' + ScriptExpiry +
        '</div>' +
        '<div class="col-5" style="display:flex;flex-direction:row-reverse;">' +
        '  <p class="watchlist-p watchlist-text-BBR Percentage_SEGMENT"  style="margin-left: 0;">  ' + perChangeInDigit + '(' + perCentageHtml + '%)</p>' +
        '</div>' +
        '</div>' +
        '<div style="width:100vw;display:inline-flex;" >' +
        '<div style="padding:0; width:66.6666666%;">' +
        '     <div class="row BID_ASK_SEGMENT" style="margin-left:2px;">' +
        '<div class="Item_Bid" style="margin-left: 8px;display: flex;font-size:20px!important;width:50%;">       ' +
        '               ' + '<div class="price-up" style="padding-bottom:0px;display:inline-flex;width:100%;"><b style="color: black;">B :</b> ' + item.Bid.toFixed(2) + '</div>' +
        '             </div>' +
        '            <div class="Item_Ask" style="display:flex;font-size: 20px !important; width:46.3333333%;">' +
        '              ' + '<div class="price-up" style="padding-bottom:0px;display:inline-flex;width:100%;"><b style="color: black;">A :</b>' + item.Ask.toFixed(2) + '</div>' +
        '       </div> ' +
        '              </div>' +
        '           </div>' +
        '<div style="padding-left: 27px;width:33.3333333%;">' +
        ' <p class="watchlist-p watchlist-text-BBR LTP_SEGMENT"style="padding:2px;">(' + item.LastPrice.toFixed(2) + ')</p>' +
        '</div>' +
        '</div>' +

        '<div style="width:100vw;display:inline-flex;" >' +
        '<div style="padding:0; width:66.6666666%;">' +
        '     <div class="row" style="margin-left:2px;">' +
        '<div style="margin-left: 8px;display: flex;width:50%;">       ' +
        '               ' + '<div class="watchlist-p highlow-Mobile Item_Low" style="padding-left: 6px;">L: ' + item.low.toFixed(2) + '</div>' +
        '             </div>' +
        '            <div style="display:flex;width:46.3333333%;">' +
        '              ' + '<div class="watchlist-p highlow-Mobile Item_High">H: ' + item.high.toFixed(2) + '</div>' +
        '       </div> ' +
        '              </div>' +
        '           </div>' +
        '<div style="padding-left: 27px;width:33.3333333%;">' +
        '              ' + '<div class="watchlist-p highlow-Mobile Item_Open">O: ' + item.open.toFixed(2) + '</div>' +
        '</div>' +
        '</div>' +
        '        </div>' +
        '     </div>' +
        '  </div>' +
        '</div >' +
        '<div class="col-12 BuySellButton" style="float:right;padding: 8px 18px 0px 0px;display:none;" Id="Btn' + item.ScriptCode + '">' + actionButton +
        '        </div>' +
        '</div >';

    $('#watchlistDiv').append(html);

}
function SetWatchTradeDetailsForAdd(item, Value) {
    var html = "", DivData = "";
    if (Value == "ADD") {
        var symbol = '\'' + item.scriptTradingSymbol.toString() + '\'';

        var Tempscriptname = $('#Drp-Segments option:selected').val();
        var WID = '\'' + Tempscriptname.split('>')[0].toString() + '\'';
        html = '<div class="row" style="border-bottom: 1px solid #ddd;height:30px;">' +
            '<div class="col-12">' +
            '<div class="col-6">' +
            ' <p class="watchlist-p watchlist-text-BBR">' + item.scriptTradingSymbol + '</p>' +
            '</div>' +
            '<div class="col-5" style="float: right;position: relative;padding-right: 30px;top:-16px;">' +
            '<button class="btn btn-primary btn-sm btn-sell" onclick="AddNewScript(' + symbol + ',' + item.intWID + ',' + WID + ',' + WID + ',' + item.UserId + ',' + item.lot + ',' + item.size + ')" type="button"><i class="fa fa-plus"></i></button>' +
            '           </div>' +
            '</div >' +
            '</div >';
    }
    else {
        var ScriptExpiry = "";
        if (item.ScriptExpiry != "") {
            var date = item.ScriptExpiry.split(" ");
            ScriptExpiry = '<span style="color: red;margin-top: 0px;" class="watchlist-p watchlist-text-BBR">&nbsp;' + date[0] + '</span>';
        }
        DivData = '<div class="row" style="border-bottom: 1px solid #ddd;height:30px;">' +
            '<div class="col-12">' +
            '<div class="col-6">' +
            ' <p class="watchlist-p watchlist-text-BBR" style="display:inline-flex;">' + item.ScriptName + ScriptExpiry + '</p>' +
            '</div>' +
            '<div class="col-5" style="float: right;position: relative;padding-right: 30px;top:-16px;">' +
            ' <button onclick="removeScript(' + item.ScriptCode + ',' + item.WID + ')" type="button" class="btn btn-warning btn-sm btn-delete"><i class="fa fa-trash-o"></i></button> ' +
            /*        '<button class="btn btn-primary btn-sm btn-sell" onclick="AddNewScript(' + symbol + ',' + item.intWID + ',' + WID + ',' + WID + ',' + item.UserId + ',' + item.lot + ',' + item.size + ')" type="button"><i class="fa fa-plus"></i></button>' +*/
            '           </div>' +
            '</div >' +
            '</div >';
    }
    var output = Value == "ADD" ? $('#Add-WatchDiv').append(html) : $('#Add-WatchDiv').append(DivData);

}
//#endregion
function AddNewScript(scriptTradingSymbol, intWID, WatchlistName, _ScriptExchange, txtUser, lot, size) {
    if (scriptTradingSymbol != null && scriptTradingSymbol != '' && scriptTradingSymbol != undefined &&
        _ScriptExchange != null && _ScriptExchange != '') {
        var request = $.ajax({
            url: "/Watchlist/SaveWatchListFromIndex",
            type: "POST",
            data: { scriptTradingSymbol: scriptTradingSymbol, intWID: intWID, watchListName: WatchlistName, scriptExchange: _ScriptExchange, txtUser: txtUser, Lot: lot, Size: size },
            dataType: 'json',
            traditional: true,
            success: function (data) {
                var results = JSON.parse(data);
                if (results.IsError && results.ErrorMessage == "MaxLimit") {
                    toastr.error("Max 50 Scripts Allowed");
                }
                else if (results.IsExist) {
                    toastr.error("Duplicate Record");
                }
                else if (results.IsError) {
                    toastr.error("Something Went Wrong");
                }
                else if (!results.IsError && results.ScriptCode != '' && results.ScriptCode != null) {
                    toastr.success("Script Added Successfully");
                    $('#searchText').val("");
                    $('#searchText-add').val("");
                    SetTradeDataForRefresh();
                    HidePopUp();
                }
            }
        });
    }

}

function openUserProfile() {
    document.getElementById("userDropdown").classList.toggle("show");
}

function MarketDepthPop(scriptCode, symbolParam) {
    var request = $.ajax({
        url: "/Trade/_MarketDepthMobile",
        type: "POST",
        data: { ScriptCode: scriptCode },

        success: function (data) {
            $("#marketDepthDiv").html(data);
            marketDepthInterval = setInterval(function () { SetMarketDepthForRefresh(scriptCode, symbolParam); }, 1000);
            return true;
        }
    });

}
function SetMarketDepthForRefresh(scriptCode) {
    var request = $.ajax({
        url: "/Trade/_MarketDepthMobile",
        type: "POST",
        data: { ScriptCode: scriptCode },
        async: true,
        success: function (data) {
            $("#marketDepthDiv").html(data);
            return true;
        }
    });
}
function NumOfLots() {
    var TempQty = $('#Quantity').val();
    var TempLot = $('#hdnScriptLotSize').val();
    TempQty = TempQty > 0 ? TempQty : 1;
    TempLot = TempLot > 0 ? TempLot : 1;

    $('#LotTOQtyBuySell').val(TempLot * TempQty);
}

function buySellPopUp(ScriptCode, no, ScriptSymbol, Wid, price, instumentType, ScriptExchange, Quantity = 1, ScriptLotSize = 1, Triggerprice = 0, SL = 0, Target = 0, PriceType = '', producttype = '', TradeID = 0, sttus = '') {

    if (ScriptExchange == "NFO") {
        $('#LotToQtyDiv').hide();
        $('#TxtLotName').html('Qty');
    } else {
        $('#LotToQtyDiv').show();
        $('#TxtLotName').html('Lot');
    }

    $('.upperClause :input').removeAttr('disabled');
    $('#btnProceedBuySell').removeAttr('disabled');
    $("#Price").removeClass("has-error");
    $('#buySellModel .modal-title').css("color", "#fff");
    $('#buySellModel #Terror').hide();
    $('#buySellModel #Quantity-error').hide();

    $("#buySellModel #hdnScriptExchange").val(ScriptExchange);
    $("#buySellModel #hdnScriptLotSize").val(ScriptLotSize);
    $('#LotTOQtyBuySell').val(ScriptLotSize);
    //debugger;
    var CurrentPosition = "";
    if (no == 1) {
        CurrentPosition = 'BUY';
        $('#buySellModel .modal-title').css("background-color", "dodgerblue");
        $('#buySellModel #btnProceedBuySell').css("background-color", "#4987ee");
        $('#buySellModel #btnProceedBuySell').css("color", "#fff");
        $('#buySellModel #btnProceedBuySell').text("BUY");
        $('#buySellModel #hdnBidAsk').val("BUY");

    }
    else if (no == 2) {
        CurrentPosition = 'SELL';
        $('#buySellModel .modal-title').css("background-color", "#ff4a4a");
        $('#buySellModel #btnProceedBuySell').css("background-color", "#ff4a4a");
        $('#buySellModel #btnProceedBuySell').css("color", "#fff");
        $('#buySellModel #btnProceedBuySell').text("SELL");
        $('#buySellModel #hdnBidAsk').val("SELL");
    }

    $('#dropTradingUnit').html('');
    if (allowedTradingUnit != null) {
        if (allowedTradingUnit.length > 0) {
            var data = allowedTradingUnit.filter(opt => opt.ScriptExchange == ScriptExchange);
            var units = [];
            if (instumentType == "FUT" || instumentType == "CE" || instumentType == "PE") {
                if (instumentType == "FUT") {
                    if (data[0].FUTURE_TRADING_UNIT_TYPE == null || data[0].FUTURE_TRADING_UNIT_TYPE == '' || data[0].FUTURE_TRADING_UNIT_TYPE == undefined) {
                        units.push(1);
                    } else {
                        units = data[0].FUTURE_TRADING_UNIT_TYPE.split(",");
                    }
                }
                else {
                    if (data[0].OPTIONS_TRADING_UNIT_TYPE == null || data[0].OPTIONS_TRADING_UNIT_TYPE == '' || data[0].OPTIONS_TRADING_UNIT_TYPE == undefined) {
                        units.push(1);
                    } else {
                        units = data[0].OPTIONS_TRADING_UNIT_TYPE.split(",");
                    }
                }
            } else {
                if (data[0].OPTIONS_TRADING_UNIT_TYPE == null || data[0].OPTIONS_TRADING_UNIT_TYPE == '' || data[0].OPTIONS_TRADING_UNIT_TYPE == undefined) {
                    units.push(1);
                }
                else {
                    units = data[0].EQUITY_TRADING_UNIT_TYPE.split(",");
                }
            }
            $.each(units, function (i, item) {
                if (item == "0")
                    item = "1";
                $('#dropTradingUnit').append($("<option></option>").val(parseInt(item)).html(item == "1" ? "LOT" : "QTY"));
            });

        } else {
            $('#dropTradingUnit').append($("<option></option>").val(parseInt(1)).html("LOT"));
        }
    }
    else {
        $('#dropTradingUnit').append($("<option></option>").val(parseInt(1)).html("LOT"));
    }
    $("#lblScriptSymbol").text(ScriptSymbol.toString());
    $("#lblScriptCode").text(ScriptCode.toString());
    $("#lblCurrentPosition").text(CurrentPosition);
    $("#Wid").val(Wid);
    $("#hdnPrice").val(price);
    $("#hdnTradeID").val(TradeID.toString());
    $("#Price").val('0');
    $("#TriggerPrice").val(Triggerprice.toString());
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

    if (companyInitials == "VM") {
        $(".ProductTypeDiv").css("display", "none");
        $(".TriggerPriceDiv").css("display", "none");
        $(".rbtnSLDiv").css("display", "none");
        $("#tgtSLDiv").css("display", "none");
        $(".tgtSLDivSL").css("display", "none");
    }
    if (companyInitials == "EXPO") {
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
                if (RememberData.PRODUCT_TYPE == 'MIS') {
                    $('#rbtnIntraday').prop('checked', true);
                } else {
                    $('#rbtnNrml').prop('checked', true);
                }
            }
            if (RememberData.PRICE_TYPE != null && RememberData.PRICE_TYPE != '') {
                if (RememberData.PRICE_TYPE == 'MARKET') {
                    $('#rbtnMarket').prop('checked', true);
                } else if (RememberData.PRICE_TYPE == 'LIMIT') {
                    $('#rbtnLimit').prop('checked', true);
                }
                else if (RememberData.PRICE_TYPE == 'SL') {
                    $('#rbtnSL').prop('checked', true);
                }
                else if (RememberData.PRICE_TYPE == 'SL-M') {
                    $('#rbtnSLM').prop('checked', true);
                }

            }
            PriceType = $('input[name=MarketType]:checked').val();
        }
        else {
            $("#rbtnMarket").prop('checked', true);
            $('#rbtnNrml').prop('checked', true);
        }
    }

    if (PriceType != null && PriceType != '') {
        if (PriceType == 'LIMIT') {
            $('#buySellModel #Price').removeAttr('disabled');
            $('#buySellModel #Price').removeAttr('readonly');
            $('#buySellModel #Price').val(price);
            $('#buySellModel #TriggerPrice').val('0');
            $('#buySellModel #TriggerPrice').attr('disabled', 'disabled');
            $("#rbtnLimit").prop('checked', true);
        }
        else if (PriceType == 'SL') {
            $("#rbtnSL").prop('checked', true);
            $('#buySellModel #Price').removeAttr('disabled');
            $('#buySellModel #Price').removeAttr('readonly');
            $('#buySellModel #Price').val(price);

            $('#buySellModel #TriggerPrice').removeAttr('disabled');

        }
        else if (PriceType == 'SL-M') {
            $("#rbtnSLM").prop('checked', true);
            $('#buySellModel #Price').val(price);
            $('#buySellModel #Price').attr('disabled', 'disabled');
            $('#buySellModel #Price').attr('readonly', 'readonly');
        }
        else if (PriceType == 'MARKET') {
            $("#rbtnMarket").prop('checked', true);
            $('#buySellModel #Price').val(price);
            $('#buySellModel #Price').attr('disabled', 'disabled');
            $('#buySellModel #Price').attr('readonly', 'readonly');
            $('#buySellModel #TriggerPrice').attr('disabled', 'disabled');
        }
    }


    if (producttype != null && producttype != '') {
        if (producttype == 'MIS') {
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
    else
        $('.upperClause :input').removeAttr('disabled');


    //$('#buySellModel').modal({
    //    backdrop: false,
    //    show: true
    //});


    //$("body").removeClass('modal-open');
    $("#hdnSt").val(sttus);



    isShowDepthModal = false;

    //var companyInitials = $("#CompanyInitial").val();
    //if (companyInitials == "EXPO") {
    //    ProceedBuySell();
    //}
    var IsOneClickEnabled = localStorage.getItem("IsOneClickEnabled");
    if (IsOneClickEnabled == "1") {
        ProceedBuySellConfirm();
    }
    if (ScriptExchange != "MCX") {
        $('#QuantityWiseBuy').css('display', 'none');
        $('#marketTypeDiv').addClass('col-md-offset-4');
    }
    else {
        $('#QuantityWiseBuy').css('display', 'block');
        $('#marketTypeDiv').removeClass('col-md-offset-4');
    }
    $('.BuySellDiv').css('display', 'inherit');
    $('#watchlistDiv').css('display', 'none');
    marginInterval = setInterval(function () { GetRequiredMargin(); }, 1000);
}

function GetRequiredMargin() {
    //debugger
    var MisOrNot = 0;
    var scriptLotSize = $("#buySellModel #hdnScriptLotSize").val();
    $('#buySellModel #DivGetLotSize').text(scriptLotSize);
    var ScriptCode = $("#lblScriptCode").text();
    var quantity = $("#Quantity").val();
    var Totalwalletbalance = 0;
    var LastPrice = $('#lblLastPrice').text();
    var intradayradiobutton = document.getElementById('rbtnIntraday');
    var scriptExchange = $("#buySellModel #hdnScriptExchange").val();

    if (intradayradiobutton.checked == true) {
        MisOrNot = 1;
    }
    var BuyQtyWiseOrLotWise = 0;

    var CurrentPosition = $("#lblCurrentPosition").text();
    if (CurrentPosition == 'BUY')
        LastPrice = $('#lblLastBid').text();
    else
        LastPrice = $('#lblLastAsk').text();

    if (LastPrice != '' && LastPrice != null) {
        var input = { 'ScriptLotSize': scriptLotSize, 'ScriptCode': ScriptCode, 'quantity': quantity, 'Totalwalletbalance': Totalwalletbalance, 'MisOrNot': MisOrNot, 'LastPrice': LastPrice, 'TRADING_UNIT_TYPE': $("#dropTradingUnit").val(), 'scriptExchange': scriptExchange };

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
                $('#buySellModel #DivGetRequiredMargin').text(item[i].RequiredMargin);
                $('#buySellModel #DivGetAvailableMargin').text(item[i].AvailableMargin);
                $('#buySellModel #DivGetUsedMargin').text(item[0].UsedMargin);

                if (item[i].RequiredMargin > item[i].AvailableMargin)
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
    HidePopUp();
    isShowDepthModal = false;
    newconfirmMobile("Delete This Record", function () {
        var resp = $('body').find('.cresp').html();
        $('body').find('.cresp').remove();
        if (resp == 'Yes') {
            if (ScriptCode > 0 && intWID > 0) {
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
                            SetTradeDataForRefresh();
                            toastr.success('Script Deleted Successfully.');
                            return false;
                        }

                    }

                });

            }
        }
    });

}



function ProceedBuySellConfirm() {
    newconfirmMobileTradeIcon("Are you sure to execute?", function () {
        var resp = $('body').find('.crespp').html();
        $('body').find('.crespp').remove();
        if (resp == 'Yes') {
            ProceedBuySell();
        }
    });
}


function ProceedBuySell() {
    var quantity = $("#Quantity").val();
    if (quantity < 0.01) {
        toastr.error("Invalid Qty");
        return;
    }
    if ($("#cbxRememberTargetStoploss").prop('checked') == true) {
        var data = {
            PRODUCT_TYPE: $('input[name=ProductType]:checked').val(),
            PRICE_TYPE: $('input[name=MarketType]:checked').val()
        };
        localStorage.setItem("RememberTargetStoploss", JSON.stringify(data));
    }
    else {
        localStorage.removeItem("RememberTargetStoploss");
    }

    var ScriptCode = $("#lblScriptCode").text();
    var CurrentPosition = $("#lblCurrentPosition").text();
    intWID = $("#Wid").val();
    var target = $("#txtTarget").val();
    var stopLoss = $("#txtStopLoss").val();
    var scriptExchange = $("#buySellModel #hdnScriptExchange").val();
    var scriptLotSize = $("#buySellModel #hdnScriptLotSize").val();
    var price = $("#Price").val();
    var triggerPrice = $("#TriggerPrice").val();
    var tradeID = $("#hdnTradeID").val();
    var productType = "NRML";
    var marketType = $('input[name=MarketType]:checked').val();
    var HighPrice = $('#lblHigh').html();
    var LowPrice = $('#lblLow').html();
    if (ScriptCode == null || ScriptCode == "" ||
        CurrentPosition == null || CurrentPosition == "") {
        toastr.error("Please enter correct details");
        return;
    }
    if (((stopLoss != '' && stopLoss != '0') || (target != '' && target != '0'))) {
        var dTarget = parseFloat(target);
        var dStoploss = parseFloat(stopLoss);
        var oprice = parseFloat(price);
        var hdprice = $('#buySellModel #hdnPrice').val();
        var lastPrice = parseFloat(hdprice);
        if (oprice > 0)
            lastPrice = oprice;
    }
    var HighLowCircuitRequired = $("#HighLowCircuitRequired").val();
    if (HighLowCircuitRequired == 0) {
        if (marketType == "LIMIT") {
            var oprice = parseFloat(price);
            var HighPriceValue = parseFloat(HighPrice);
            var LowPriceValue = parseFloat(LowPrice);
            var showError = false;
            var msg = "";

            if (CurrentPosition == "SELL" && oprice < HighPriceValue) {
                showError = true;
                msg = "Limit price Cannot be less than high price";
            }
            else if (CurrentPosition == "BUY" && oprice > LowPriceValue) {
                showError = true;
                msg = "Limit price connot be greater than low price";
            }
            if (showError) {
                $("#Price").addClass("has-error");
                toastr.error(msg);
                $('#btnProceedBuySell').removeAttr('disabled');
                return;
            }

        }
        if (marketType == "SL") {
            var oprice = parseFloat(price);
            triggerPrice = oprice;
            var HighPriceValue = parseFloat(HighPrice);
            var LowPriceValue = parseFloat(LowPrice);
            var showError = false;
            var msg = "";

            if (CurrentPosition == "SELL" && oprice > LowPriceValue) {
                showError = true;
                msg = "StopLoss price Cannot be higher than low price";
            }
            else if (CurrentPosition == "BUY" && oprice < HighPriceValue) {
                showError = true;
                msg = "StopLoss price connot be less than high price";
            }
            if (showError) {
                $("#Price").addClass("has-error");
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
            data: { intWID: intWID, ScriptCode: ScriptCode, CurrentPosition: CurrentPosition, allUsers: false, target: target, stopLoss: stopLoss, Quantity: quantity, Price: price, TriggerPrice: triggerPrice, ProductType: productType, MarketType: marketType, TradeID: tradeID, Status: st, iscbxAutoBinanceSlTrailEnabled: 0, TRADING_UNIT: TRADING_UNIT },
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
                    price = $("#rbtnMarket").prop('checked') == true ? CurrentPosition == "BUY" ? $('#lblLastAsk').text() : $('#lblLastBid').text() : price;
                    if (TRADING_UNIT == 1) {
                        quantity = quantity * scriptLotSize;
                    }
                    if (tradeID != '0') {
                        toastr.success('Order has been Successfully Updated. ' + CurrentPosition + ' ' + quantity + ' @' + price);
                    }
                    else {
                        toastr.success('Order has been Successfully Placed. ' + CurrentPosition + ' ' + quantity + ' @' + price);
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
    $(".BuySellDiv").css('display', 'none');
    $(".AddDeleteScriptDiv").css('display', 'none');
    $('#watchlistDiv').css('display', 'inherit');
    $('#searchText').val("");
    $('#searchText-add').val("");
}

