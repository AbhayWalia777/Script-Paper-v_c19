var FavoriteWatchInterval;
var websocket;
var allObj = [];
var LastPriceDictionary = [];
var SocketInterval;
var allowedTradingUnit;
var Current_Loop_Valueof_Watchlist = 0;
$(document).ready(function () {
    $('.select2').select2();
    $('#tblWatchListTradeList').DataTable({
        "lengthChange": false,
        "order": false,
        "ordering": false,
        "searching": false,
        "paging": true,
        "responsive": true,
        "info": false
    });
    $('#Drp-Segment').select2({
        'placeholder': 'Segment',
        'allowClear': true
    });
    $('.DrpSegmentsScriptName').select2({
        'placeholder': 'Script Name',
        'allowClear': true
    });
    $('#DrpExpiryDate').select2({
        'placeholder': 'EXPIRY',
        'allowClear': true
    });
    $("#searchText").on('keyup', function () {
        SetTradeDataForRefresh();
    });
    $('#DrpCallPut').select2({
        'placeholder': 'CE / PE',
        'allowClear': true
    });
    $('#DrpStrikeRate').select2({
        'placeholder': 'STRIKE',
        'allowClear': true
    });

    $("#btnGear").click(function () {
        $("#exampleModal").modal('show');

    });

        allowedTradingUnit = JSON.parse($("#TradingUnitAccess").val());
        var Companyinitials = $("#CompanyInitial").val();
        intervalWatchList = setInterval(function () { SetTradeDataForRefresh(); }, 1000);
        if (Companyinitials == "ME" || Companyinitials == "ASR") {
            intervalSensexNifty = window.setInterval(function () { FavoriteWatchlist2(); }, 1000);
        } else {
            intervalSensexNifty = window.setInterval(function () { FavoriteWatchlist(); }, 1000);
        }
        var IsOneClickEnabled = localStorage.getItem("IsOneClickEnabled");
        if (IsOneClickEnabled == "1") {
            $('#cbxOneClick').prop('checked', true);
        }
        else {
            $('#cbxOneClick').prop('checked', false);
        }

        if (Companyinitials == "BOB") {
            $("#autoBinanceSLTrailDv").show();
        }
        $(document).on('click', '.card-body', function () {
            $("#" + $(this).attr('id') + "").trigger('click');
        });
        $("#cbxOneClick").click(function () {
            if ($("#cbxOneClick").prop('checked') == true) {
                localStorage.setItem("IsOneClickEnabled", "1");
            }
            else {
                localStorage.setItem("IsOneClickEnabled", "0");
            }
        });
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
    }    );
    FavoriteWatchInterval = setInterval(function () { FavoriteWatchlist(); }, 1000);
    //#region Call Watchlist For The First Time
    SetTradeDataForRefresh();
    //#endregion

    //#region Call WebSocket
    initSocket();
    SocketInterval = setInterval(function () { initSocket(); }, 1000);
    SetScriptNameData();
    $(document).on('change', '#Drp-Segment', function () {
        if ($('#Drp-Segment option:selected').text() != "")
            SetScriptNameData();
        SetTradeDataForRefresh();
        $('.DrpSegmentsScriptName').val(null).trigger('change');
    });

    $(document).on('change', '.DrpSegmentsScriptName', function () {
        if ($('.DrpSegmentsScriptName option:selected').text() != "") {
            SetScriptExpiryData();
            GetScriptStrikeRates();
        }
        $('.DrpExpiryDate').val(null).trigger('change');
    });
    $(document).on('change', '#DrpCallPut', function () {
        if ($('#DrpCallPut option:selected').text() != "") {
            GetScriptStrikeRates();
        }
        $('#DrpStrikeRate').val(null).trigger('change');
    });
    $('.DrpSegmentsScriptName').val(null).trigger('change');
    $('#DrpCallPut').val(null).trigger('change');

function SetScriptNameData() {
    var Tempscriptname = $('#Drp-Segment option:selected').text() != "" ? $('#Drp-Segment').val() : "";
    var WID = $('#Drp-Segment option:selected').text() != "" ? Tempscriptname.split('>')[0] : "";
    var ScriptInstrumentType = $('#Drp-Segment option:selected').text() != "" ? Tempscriptname.split('>')[1] : "";
    var input = { 'ScriptExchange': WID, 'ScriptInstrumentType': ScriptInstrumentType };


    var request = $.ajax({
        url: "/Trade/GetScriptNameWithExchangeName",
        type: "GET",
        data: input,
        dataType: 'json',
        async: true,
        success: function (results) {
            $('.DrpSegmentsScriptName').html('');
            if (results != null) {
                if (results.length > 0) {
                    for (var i = 0; i < results.length; i++) {
                        var result = results[i].ScriptName;
                        $('.DrpSegmentsScriptName').append(new Option(result, result));

                    }
                    $('.DrpSegmentsScriptName').val(null).trigger('change');
                }
                else {
                    $('.DrpSegmentsScriptName').html('');
                }

            }
        }
    });
}
function SetScriptExpiryData() {
    var Tempscriptname = $('#Drp-Segment option:selected').text() != "" ? $('#Drp-Segment').val() : "";
    var WID = $('#Drp-Segment option:selected').text() != "" ? Tempscriptname.split('>')[0] : "";
    var ScriptInstrumentType = $('#Drp-Segment option:selected').text() != "" ? Tempscriptname.split('>')[1] : "";
    var ScriptName = $('.DrpSegmentsScriptName option:selected').text() != "" ? $('.DrpSegmentsScriptName option:selected').text() : "";
    if (WID != "" && ScriptName != "" && WID != null && ScriptName != null) {
        var input = { 'ScriptExchange': WID, 'ScriptInstrumentType': ScriptInstrumentType, 'ScriptName': ScriptName };


        var request = $.ajax({
            url: "/Trade/GetScriptExpiryDateWithScriptName",
            type: "GET",
            data: input,
            dataType: 'json',
            async: true,
            success: function (results) {
                $('#DrpExpiryDate').html('');
                if (results != null) {
                    if (results.length > 0) {
                        for (var i = 0; i < results.length; i++) {
                            var result = results[i].Scriptexpiry;
                            $('#DrpExpiryDate').append(new Option(result, result));

                        }
                        $('#DrpExpiryDate').val(null).trigger('change');
                    }
                    else {
                        $('#DrpExpiryDate').html('');
                    }

                }
            }
        });
    }
}
function GetScriptStrikeRates() {
    var Tempscriptname = $('#Drp-Segment option:selected').text() != "" ? $('#Drp-Segment').val() : "";
    var WID = $('#Drp-Segment option:selected').text() != "" ? Tempscriptname.split('>')[0] : "";
    var ScriptInstrumentType = $('#DrpCallPut option:selected').val() != "" ? $('#DrpCallPut option:selected').val() : "";
    var ScriptName = $('.DrpSegmentsScriptName option:selected').text() != "" ? $('.DrpSegmentsScriptName option:selected').text() : "";
    if (WID != "" && ScriptName != "" && ScriptInstrumentType != "" && WID != null && ScriptName != null && ScriptInstrumentType != null) {
        var input = { 'ScriptExchange': WID, 'ScriptInstrumentType': ScriptInstrumentType, 'ScriptName': ScriptName };


        var request = $.ajax({
            url: "/Trade/GetScriptStrikeRates",
            type: "GET",
            data: input,
            dataType: 'json',
            async: true,
            success: function (results) {
                $('#DrpStrikeRate').html('');
                if (results != null) {
                    if (results.length > 0) {
                        for (var i = 0; i < results.length; i++) {
                            var result = results[i].Scriptsegment;
                            $('#DrpStrikeRate').append(new Option(result, result));

                        }
                        $('#DrpStrikeRate').val(null).trigger('change');
                    }
                    else {
                        $('#DrpStrikeRate').html('');
                    }

                }
            }
        });
    }
}
function FavoriteWatchlist() {
    $.ajax({
        url: '/Trade/SetFavoriteWatchlistData',
        type: 'GET',
        dataType: 'json',
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
                            perCentageHtml = '  <i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp' + perCentage.toFixed(2) + '</i>';
                        }
                        else if (PerChange >= 0) {
                            perCentage = (parseFloat(PerChange) / parseFloat(result.objLstWatchList[i].close)) * 100;
                            perCentageHtml = '  <i style="color:dodgerblue;font-weight:bold;" class="fa fa-angle-up">&nbsp' + perCentage.toFixed(2) + '</i>';
                        }
                        if (i == 0) {

                            $('.favorite1').html('<a style="font-size:15px;color:white;font-weight:bold" class="color-White-Link">' + result.objLstWatchList[0].ScriptTradingSymbol + ' </a><a style="font-size:14px;font-weight:bold"> ' + result.objLstWatchList[0].Lastprice + '&nbsp&nbsp ' + perCentageHtml + '</a>');
                        }
                        if (i == 1) {
                            $('.favorite2').html('<a style="font-size:15px;color:white;font-weight:bold" class="color-White-Link">' + result.objLstWatchList[1].ScriptTradingSymbol + '</a><a style="font-size:14px;font-weight:bold">  ' + result.objLstWatchList[1].Lastprice + '&nbsp&nbsp ' + perCentageHtml + '</a>');
                        }
                    }
                }
            }
        },
        error: function (error) {
        }
    });
}
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
function SetTradeDataForRefresh() {
    try {
        var Tempscriptname = $('#Drp-Segment option:selected').text() != "" ? $('#Drp-Segment').val() : "";
        var WID = $('#Drp-Segment option:selected').text() != "" ? Tempscriptname.split('>')[0] : "";
        var input = { 'WID': 0, 'scriptExchangeType': "", 'searchedData': $("#searchText").val(), 'ScriptExchange': WID };
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
        var tblWatchListTradeList = $('#tblWatchListTradeList').DataTable();
        tblWatchListTradeList.clear().draw();
        tblWatchListTradeList.innerHTML = "";
        if (results.objLstWatchList != null) {
            //Set data for WatchList trade
            if (results.objLstWatchList.length > 0) {

                for (var i = 0; i < results.objLstWatchList.length; i++) {
                    var result = results.objLstWatchList[i];
                    SetWatchTradeDetails(result);
                }

                $('#tblWatchListTradeList tbody tr').on('mouseover', function () {
                    $('.BuySellBTNDiv').css('display', 'none'); this.children[0].children[2].style = 'display:initial';
                    $('.LblScriptSymbol').show(); this.children[0].children[0].style = 'display:none';
                });
                $('#tblWatchListTradeList tbody tr').on('mouseleave', function () {
                    $('.BuySellBTNDiv').css('display', 'none'); 
                    $('.LblScriptSymbol').show();
                });
            }
        }
    }
}

function wt() {
    var nData = allObj;

    if (nData != null && nData != 'undefined' && nData.length > 0) {
        var table = document.getElementById("tblWatchListTradeListBody");
        var i = 0;
        while (i < table.rows.length) {
            var newL = nData.filter(opt => opt.InstrumentToken == $(table.rows[i].cells[0]).find('input[Name=hiddenCode]').val());
            if (newL.length > 0) {
                var item = newL[0];


                var PreviousLastPrice = 0.0;
                var PreviousBidPrice = 0.0;
                var PreviousAskPrice = 0.0;
                var LastColor = "";
                for (var keys in LastPriceDictionary) {
                    if (LastPriceDictionary[keys].key == item.InstrumentToken) {
                        PreviousLastPrice = parseFloat(LastPriceDictionary[keys].value);
                        PreviousBidPrice = parseFloat(LastPriceDictionary[keys].Bid);
                        PreviousAskPrice = parseFloat(LastPriceDictionary[keys].Ask);
                        LastColor = LastPriceDictionary[keys].color;
                        break;
                    }
                }

                var LastPriceHtml = "";
                if (parseFloat(item.Lastprice) > PreviousLastPrice) {
                    LastPriceHtml = '<span class="lp" >' + item.Lastprice + '</span>';
                    LastColor = 'dodgerblue';
                }
                if (parseFloat(item.Lastprice) < PreviousLastPrice) {
                    LastPriceHtml = '<span class="lp" >' + item.Lastprice + '</span>';
                    LastColor = 'red';
                }
                if (item.Lastprice == PreviousLastPrice) {
                    LastPriceHtml = '<span class="lp">' + item.Lastprice + '</span>';
                }
                $(table.rows[i].cells[3]).css('background-color', LastColor);
                $(table.rows[i].cells[3]).html(LastPriceHtml);
                var LastBidHtml = "";
                if (parseFloat(item.Bid) > PreviousBidPrice) {
                    LastBidHtml = '<span class="dodgerblue">' + item.Bid + '</span>';
                }
                if (parseFloat(item.Bid) < PreviousBidPrice) {
                    LastBidHtml = '<span class="red">' + item.Bid + '</span>';
                }
                if (item.Bid == PreviousBidPrice) {
                    LastBidHtml = '<span class="dodgerblue">' + item.Bid + '</span>';
                }


                $(table.rows[i].cells[1]).html(LastBidHtml);

                var LastAskHtml = "";
                if (parseFloat(item.Ask) > PreviousAskPrice) {
                    LastAskHtml = '<span class="dodgerblue">' + item.Ask + '</span>';
                }
                if (parseFloat(item.Ask) < PreviousAskPrice) {
                    LastAskHtml = '<span class="red">' + item.Ask + '</span>';
                }
                if (item.Ask == PreviousAskPrice) {
                    LastAskHtml = '<span class="dodgerblue">' + item.Ask + '</span>';
                }
                $(table.rows[i].cells[2]).html(LastAskHtml);
                $(table.rows[i].cells[5]).html(item.Open);
                $(table.rows[i].cells[6]).html(item.high);
                $(table.rows[i].cells[7]).html(item.low);
                $(table.rows[i].cells[8]).html(item.Close);



                var IsExistsLTP = false;
                for (var keys in LastPriceDictionary) {
                    if (LastPriceDictionary[keys].key == item.InstrumentToken) {
                        IsExistsLTP = true;
                        LastPriceDictionary[keys].value = item.Lastprice;
                        LastPriceDictionary[keys].color = LastColor;
                        LastPriceDictionary[keys].Bid = item.Bid;
                        LastPriceDictionary[keys].Ask = item.Ask;
                    }
                }
                if (!IsExistsLTP) {
                    LastPriceDictionary.push({
                        key: item.InstrumentToken,
                        value: item.Lastprice,
                        color: LastColor,
                        Bid: item.Bid,
                        Ask: item.Ask

                    });
                }
                var SCRIPT_TYPE = $(table.rows[i].cells[0]).find('input[Name=Scripttype]').val();
                if (item.Close == null)
                    item.Close = 0;

                var PerChange = 0;
                var perCentage = 0;
                var perCentageHtml = '';
                PerChange = parseFloat(item.Lastprice) - parseFloat(item.Close);
                if (PerChange < 0) {
                    perCentage = (parseFloat(PerChange) / parseFloat(item.Close)) * 100;
                    if (SCRIPT_TYPE == "BINANCE") {
                        perCentage = item.Change;
                    }
                    if (SCRIPT_TYPE == "FOREX") {
                        perCentage = 0.00000;
                    }
                    perCentageHtml = '<i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp&nbsp&nbsp' + perCentage.toFixed(5) + '&nbsp%</i>';
                }
                else if (PerChange >= 0) {
                    perCentage = (parseFloat(PerChange) / parseFloat(item.Close)) * 100;
                    if (SCRIPT_TYPE == "BINANCE") {
                        perCentage = item.Change;
                    }
                    if (SCRIPT_TYPE == "FOREX") {
                        perCentage = 0.00000;
                    }
                    perCentageHtml = '<i style="color:dodgerblue;font-weight:bold;" class="fa fa-angle-up">&nbsp&nbsp&nbsp' + perCentage.toFixed(5) + '&nbsp%</i>';
                }
                $(table.rows[i].cells[4]).html(perCentageHtml);

            }
            i++;
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
    }
}


function SetWatchTradeDetails(item) {

    var PreviousLastPrice = 0.0;
    var PreviousBidPrice = 0.0;
    var PreviousAskPrice = 0.0;
    var LastColor = "";
    for (var keys in LastPriceDictionary) {
        if (LastPriceDictionary[keys].key == item.ScriptCode) {
            PreviousLastPrice = parseFloat(LastPriceDictionary[keys].value);
            PreviousBidPrice = parseFloat(LastPriceDictionary[keys].Bid);
            PreviousAskPrice = parseFloat(LastPriceDictionary[keys].Ask);
            LastColor = LastPriceDictionary[keys].color;
            break;
        }
    }

    var LastPriceHtml = "";
    if (parseFloat(item.Lastprice) > PreviousLastPrice) {
        LastPriceHtml = '<span class="lp">' + item.Lastprice + '</span>';
        LastColor = 'dodgerblue';
    }
    if (parseFloat(item.Lastprice) < PreviousLastPrice) {
        LastPriceHtml = '<span class="lp">' + item.Lastprice + '</span>';
        LastColor = 'red';
    }
    if (item.Lastprice == PreviousLastPrice) {
        LastPriceHtml = '<span class="lp">' + item.Lastprice + '</span>';
    }

    var LastBidHtml = "";
    if (parseFloat(item.Bid) > PreviousBidPrice) {
        LastBidHtml = '<span class="dodgerblue">' + item.Bid + '</span>';
    }
    if (parseFloat(item.Bid) < PreviousBidPrice) {
        LastBidHtml = '<span class="red">' + item.Bid + '</span>';
    }
    if (item.Bid == PreviousBidPrice) {
        LastBidHtml = '<span class="dodgerblue">' + item.Bid + '</span>';
    }

    var LastAskHtml = "";
    if (parseFloat(item.Ask) > PreviousAskPrice) {
        LastAskHtml = '<span class="dodgerblue">' + item.Ask + '</span>';
    }
    if (parseFloat(item.Ask) < PreviousAskPrice) {
        LastAskHtml = '<span class="red">' + item.Ask + '</span>';
    }
    if (item.Ask == PreviousAskPrice) {
        LastAskHtml = '<span class="dodgerblue">' + item.Ask + '</span>';
    }

    var btnName = 'btn';
    var symbolParam = item.ScriptName.replace(/'/g, "");
    symbolParam = '\'' + symbolParam + '\'';

    var script_Trading_Symbol = item.ScriptTradingSymbol.replace(/'/g, "");
    script_Trading_Symbol = '\'' + script_Trading_Symbol + '\'';
    var ScriptInstrumentType = '\'' + item.ScriptInstrumentType + '\'';
    var ScriptExchange = '\'' + item.ScriptExchange.toString() + '\'';

    var PerChange = "";
    var perCentageHtml = "";
    var perCentage = "";
    PerChange = parseFloat(item.Lastprice) - parseFloat(item.close);
    if (PerChange < 0) {
        perCentage = (parseFloat(PerChange) / parseFloat(item.close)) * 100;
        perCentageHtml = '<i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp&nbsp&nbsp' + perCentage.toFixed(5) + '&nbsp%</i>';
    }
    else if (PerChange >= 0) {
        perCentage = (parseFloat(PerChange) / parseFloat(item.close)) * 100;
        perCentageHtml = '<i style="color:dodgerblue;font-weight:bold;" class="fa fa-angle-up">&nbsp&nbsp&nbsp' + perCentage.toFixed(5) + '&nbsp%</i>';
    }
    var Qty = 1;
    var btnBuyid = "btnBuy" + item.ScriptCode;
    var btnSellid = "btnSell" + item.ScriptCode;
    var deleteButton = ' <a href="#" id="btnName' + item.ScriptCode + '" onclick="removeScript(' + item.ScriptCode + ',' + item.WID + ')" type="button" style="color:red;font-weight:bold;font-size:14px;">x</a> ';
    var buyButton = '<div tabindex="-1" class="b-btn"><button id="' + btnBuyid + '" onclick="buySellPopUp(' + item.ScriptCode + ',1,' + symbolParam + ',' + item.WID + ',' + item.Lastprice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + Qty + ',' + item.ScriptLotSize + ',' + item.Lastprice + ')" type="button" class="btn btn-success btn-sm btn-Buy">B </button> ';
    var sellButton = '<button id="' + btnSellid + '" onclick="buySellPopUp(' + item.ScriptCode + ',2,' + symbolParam + ',' + item.WID + ',' + item.Lastprice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + Qty + ',' + item.ScriptLotSize + ',' + item.Lastprice + ')" type="button" class="btn btn-danger btn-sm btn-Sell"> S </button> ';



    var actionButton = '<div class="BuySellBTNDiv" style="display:none;">'+buyButton + sellButton+'</div>';
    var hiddenCode = '<input Name="hiddenCode" value="' + item.ScriptCode + '" type="hidden" >';
    var Scripttype = '<input Name="Scripttype" value="' + item.Scripttype + '" type="hidden" >';
    var Scriptexpiry = "";
    if (item.Scriptexpiry != "") {
        var date = item.Scriptexpiry.split(" ");
        Scriptexpiry = '<div><span class="expiry">(' + item.ScriptExchange + ') Expiry :' + date[0] + '</span></div>';
    }
    else {
        Scriptexpiry = '<div><span class="expiry">(' + item.ScriptExchange + ')</span></div>';
    }
    if ($('#buySellModel #lblScriptCode').text() == item.ScriptCode.toString()) {
        var LTP = item.Lastprice.toString();
        $('#buySellModel #lblLastPrice').text(LTP);
        $('#buySellModel #lblLastBid').text(item.Bid);
        $('#buySellModel #lblLastAsk').text(item.Ask);
        $('#buySellModel #hdnPrice').val(LTP);
    }

    var finalTradingSymbol = '<label class="LblScriptSymbol">' + item.ScriptTradingSymbol + '</label>';
    var wtable = $('#tblWatchListTradeList').DataTable().row.add([

        finalTradingSymbol + hiddenCode + actionButton,
        LastBidHtml,
        LastAskHtml,
        LastPriceHtml,
        perCentageHtml,
        item.open,
        item.high,
        item.low,
        item.close,
        deleteButton
    ]).draw();

    var Watchtable = document.getElementById("tblWatchListTradeList");
    if (LastColor == 'dodgerblue') {
        $(Watchtable.rows[Current_Loop_Valueof_Watchlist + 1].cells[1]).css("background-color", "dodgerblue");
    }
    else if (LastColor == 'red') {
        $(Watchtable.rows[Current_Loop_Valueof_Watchlist + 1].cells[1]).css("background-color", "red");
    }
    else {
        $(Watchtable.rows[Current_Loop_Valueof_Watchlist + 1].cells[1]).css("background-color", "red");
    }

    var IsExistsLTP = false;
    for (var keys in LastPriceDictionary) {
        if (LastPriceDictionary[keys].key == item.ScriptCode) {
            IsExistsLTP = true;
            LastPriceDictionary[keys].value = item.Lastprice;
            LastPriceDictionary[keys].color = LastColor;
        }
    }
    if (!IsExistsLTP) {
        LastPriceDictionary.push({
            key: item.ScriptCode,
            value: item.Lastprice,
            color: LastColor,
            Bid: item.Bid,
            Ask: item.Ask

        });
    }

}
function removeScript(ScriptCode, intWID) {
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
                    //var table = $('#tblList').DataTable();
                    //table.row($("#btnName" + ScriptCode).parents('tr')).remove().draw(false);
                    toastr.success('Script Deleted Successfully.');
                    SetTradeDataForRefresh();
                    return false;
                }

            }
        });
    }
}

function AddScriptData() {
    var ScriptTradingSymbol = "";
    var intWID = 0;
    var Tempscriptname = $('#Drp-Segment option:selected').text() != "" ? $('#Drp-Segment').val() : "";
    var WID = $('#Drp-Segment option:selected').text() != "" ? Tempscriptname.split('>')[0] : "";
    var ScriptInstrumentType = $('#Drp-Segment option:selected').text() != "" ? Tempscriptname.split('>')[1] : "";
    var ScriptName = $('.DrpSegmentsScriptName option:selected').text() != "" ? $('.DrpSegmentsScriptName option:selected').text() : "";
    var Expirydate = $('#DrpExpiryDate option:selected').text() != "" ? $('#DrpExpiryDate option:selected').text() : "";
    var StrikeRate = $('#DrpStrikeRate option:selected').text() != "" ? $('#DrpStrikeRate option:selected').text() : "";
    var CallPut = $('#DrpCallPut option:selected').text() != "" ? $('#DrpCallPut option:selected').val() : "";
    var UserID = $('#UserID').val();
    AddNewScript(ScriptTradingSymbol, intWID, WID, WID, UserID, 0, 0, ScriptName, CallPut, Expirydate, StrikeRate);
}

function AddNewScript(ScriptTradingSymbol, intWID, Watchlistname, _ScriptExchange, txtUser, Lot, size, ScriptName, ScriptInstrumentType, Expirydate, StrikeRate) {
    if (_ScriptExchange != null && _ScriptExchange != '') {
        var request = $.ajax({
            url: "/Watchlist/SaveWatchListFromIndex",
            type: "POST",
            data: { ScriptTradingSymbol: ScriptTradingSymbol, intWID: intWID, Watchlistname: Watchlistname, ScriptExchange: _ScriptExchange, txtUser: txtUser, Lot: Lot, Size: size, ScriptName: ScriptName, ScriptInstrumentType: ScriptInstrumentType, Expirydate: Expirydate, StrikeRate: StrikeRate },
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
                    SetTradeDataForRefresh();
                }
            }
        });
    }

}

function buySellPopUp(ScriptCode, no, ScriptSymbol, WID, price, instumentType, ScriptExchange, Quantity = 1, ScriptLotSize = 1, TriggerPrice = 0, SL = 0, Target = 0, PriceType = '', ProductType = '', TradeID = 0, sttus = '') {

    if (ScriptExchange == "NFO") {
        $('#LotToQtyDiv').hide();
        $('#TxtLotName').html('Qty');
    } else {
        $('#LotToQtyDiv').show();
        $('#TxtLotName').html('Lot');
    }

    $('.upperClause :input').removeAttr('disabled');
    $('#btnProceedBuySell').removeAttr('disabled');
    $("#price").removeClass("has-error");
    $('#buySellModel .modal-title').css("color", "#fff");
    $('#buySellModel #Terror').hide();
    $('#buySellModel #Quantity-error').hide();

    $("#buySellModel #hdnScriptExchange").val(ScriptExchange);
    $("#buySellModel #hdnScriptLotSize").val(ScriptLotSize);
    $('#LotTOQtyBuySell').val(ScriptLotSize);
    //debugger;
    var CurrentPosition = "";
    if (no == 1) {
        CurrentPosition = 'Buy';
        $('#buySellModel .modal-header').css("background-color", "dodgerblue");
        $('#buySellModel .modal-title').css("background-color", "dodgerblue");
        $('#buySellModel #btnProceedBuySell').css("background-color", "#4987ee");
        $('#buySellModel #btnProceedBuySell').css("color", "#fff");
        $('#buySellModel #btnProceedBuySell').text("Buy");
        $('#buySellModel #hdnBidAsk').val("Buy");

    }
    else if (no == 2) {
        CurrentPosition = 'Sell';
        $('#buySellModel .modal-header').css("background-color", "#ff4a4a");
        $('#buySellModel .modal-title').css("background-color", "#ff4a4a");
        $('#buySellModel #btnProceedBuySell').css("background-color", "#ff4a4a");
        $('#buySellModel #btnProceedBuySell').css("color", "#fff");
        $('#buySellModel #btnProceedBuySell').text("Sell");
        $('#buySellModel #hdnBidAsk').val("Sell");
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


    var Companyinitials = $("#CompanyInitial").val();
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
                if (RememberData.PRODUCT_TYPE == 'MIS') {
                    $('#rbtnIntraday').prop('checked', true);
                } else {
                    $('#rbtnNrml').prop('checked', true);
                }
            }
            if (RememberData.PRICE_TYPE != null && RememberData.PRICE_TYPE != '') {
                if (RememberData.PRICE_TYPE == 'MARKET') {
                    $('#rbtnMarket').prop('checked', true);
                } else if (RememberData.PRICE_TYPE == 'Limit') {
                    $('#rbtnLimit').prop('checked', true);
                }
                else if (RememberData.PRICE_TYPE == 'SL') {
                    $('#rbtnSL').prop('checked', true);
                }
                else if (RememberData.PRICE_TYPE == 'SL-M') {
                    $('#rbtnSLM').prop('checked', true);
                }

            }
            PriceType = $('input[Name=MarketType]:checked').val();
        }
        else {
            $("#rbtnMarket").prop('checked', true);
            $('#rbtnNrml').prop('checked', true);
        }
    }

    if (PriceType != null && PriceType != '') {
        if (PriceType == 'Limit') {
            $('#buySellModel #price').removeAttr('disabled');
            $('#buySellModel #price').removeAttr('readonly');
            $('#buySellModel #price').val(price);
            $('#buySellModel #TriggerPrice').val('0');
            $('#buySellModel #TriggerPrice').attr('disabled', 'disabled');
            $("#rbtnLimit").prop('checked', true);
        }
        else if (PriceType == 'SL') {
            $("#rbtnSL").prop('checked', true);
            $('#buySellModel #price').removeAttr('disabled');
            $('#buySellModel #price').removeAttr('readonly');
            $('#buySellModel #price').val(price);

            $('#buySellModel #TriggerPrice').removeAttr('disabled');

        }
        else if (PriceType == 'SL-M') {
            $("#rbtnSLM").prop('checked', true);
            $('#buySellModel #price').val(price);
            $('#buySellModel #price').attr('disabled', 'disabled');
            $('#buySellModel #price').attr('readonly', 'readonly');
        }
        else if (PriceType == 'MARKET') {
            $("#rbtnMarket").prop('checked', true);
            $('#buySellModel #price').val(price);
            $('#buySellModel #price').attr('disabled', 'disabled');
            $('#buySellModel #price').attr('readonly', 'readonly');
            $('#buySellModel #TriggerPrice').attr('disabled', 'disabled');
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
    else
        $('.upperClause :input').removeAttr('disabled');


    $('#buySellModel').modal({
        backdrop: false,
        show: true
    });


    //$("body").removeClass('modal-open');
    $("#hdnSt").val(sttus);



    isShowDepthModal = false;

    //var Companyinitials = $("#CompanyInitial").val();
    //if (Companyinitials == "EXPO") {
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
            PRICE_TYPE: $('input[Name=MarketType]:checked').val()
        };
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
    var ProductType = "NRML";
    var marketType = $('input[Name=MarketType]:checked').val();
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
        var Lastprice = parseFloat(hdprice);
        if (oprice > 0)
            Lastprice = oprice;
    }
    var HighLowCircuitRequired = $("#HighLowCircuitRequired").val();
    if (HighLowCircuitRequired == 0) {
        if (marketType == "Limit") {
            var oprice = parseFloat(price);
            var HighPriceValue = parseFloat(HighPrice);
            var LowPriceValue = parseFloat(LowPrice);
            var showError = false;
            var msg = "";

            if (CurrentPosition == "Sell" && oprice < HighPriceValue) {
                showError = true;
                msg = "Limit price Cannot be less than high price";
            }
            else if (CurrentPosition == "Buy" && oprice > LowPriceValue) {
                showError = true;
                msg = "Limit price connot be greater than low price";
            }
            if (showError) {
                $("#price").addClass("has-error");
                toastr.error(msg);
                $('#btnProceedBuySell').removeAttr('disabled');
                return;
            }

        }
        if (marketType == "SL") {
            var oprice = parseFloat(price);
            TriggerPrice = oprice;
            var HighPriceValue = parseFloat(HighPrice);
            var LowPriceValue = parseFloat(LowPrice);
            var showError = false;
            var msg = "";

            if (CurrentPosition == "Sell" && oprice > LowPriceValue) {
                showError = true;
                msg = "StopLoss price Cannot be higher than low price";
            }
            else if (CurrentPosition == "Buy" && oprice < HighPriceValue) {
                showError = true;
                msg = "StopLoss price connot be less than high price";
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
                    price = $("#rbtnMarket").prop('checked') == true ? CurrentPosition == "Buy" ? $('#lblLastAsk').text() : $('#lblLastBid').text() : price;
                    if (TRADING_UNIT == 1) {
                        quantity = quantity * ScriptLotSize;
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
function NumOfLots() {
    var TempQty = $('#Quantity').val();
    var TempLot = $('#hdnScriptLotSize').val();
    TempQty = TempQty > 0 ? TempQty : 1;
    TempLot = TempLot > 0 ? TempLot : 1;

    $('#LotTOQtyBuySell').val(TempLot * TempQty);
}
function HidePopUp() {
    $(".BuySellDiv").css('display', 'none');
    $(".AddDeleteScriptDiv").css('display', 'none');
    $('#watchlistDiv').css('display', 'inherit');
    $('#searchText').val("");
    $('#searchText-add').val("");
}