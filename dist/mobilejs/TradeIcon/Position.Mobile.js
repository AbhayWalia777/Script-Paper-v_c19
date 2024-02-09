var intervalSensexNifty;
var intervalWatchList;
var Id_for_Controls;
var sqModal;
var websocket;
var BindClickButton;
var SocketInterval;
var ActiveTradeInterval;
var allowedTradingUnit;
var Companyinitials;
function BindClick() {
    $('.activeTradeRowView').bind('click', function () {
        var BtnID = $(this).attr('data-Scripttype');
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
function NumOfLots() {
    var TempQty = $('#Quantity').val();
    var TempLot = $('#tempLotFrontEND').html();
    TempQty = TempQty > 0 ? TempQty : 1;
    TempLot = TempLot > 0 ? TempLot : 1;

    $('#LotTOQtyBuySell').val(TempLot * TempQty);
}
$(document).ready(function () {
    allowedTradingUnit = JSON.parse($("#TradingUnitAccess").val());
    Companyinitials = $("#CompanyInitial").val();
    $('#Header_Text').html('position');
    $('#tablink1').trigger('click');
    $(document).on('change', '#Drp-Segments-add', function () {
        $('#Drp-Segments').val($('#Drp-Segments-add option:selected').val());
        $('.TxtSegment_ID').html($('#Drp-Segments option:selected').text());
        localStorage.setItem('GetSegments', $('#Drp-Segments option:selected').val());
    });
    LoadData();
    initSocket();
    OrderExeption();
    ActiveTradeInterval = setInterval(function () { LoadData(); }, 1000);
    SocketInterval = setInterval(function () { initSocket(); }, 1000);

    $('input[Name=MarketType]').on('change', function (ele) {
        var value = $(ele.currentTarget).val();
        var priceval = $('#hdnPrice').val();
        var TotalNrmlQty = $("#TotalNrmlQty").text();
        var Triggerval = $('#TriggerPrice').val();
        TotalNrmlQty = TotalNrmlQty > 0 ? TotalNrmlQty : TotalNrmlQty * -1;
        if (value == 'Limit') {
            $('#buySellModel #price').removeAttr('disabled');
            $('#buySellModel #price').removeAttr('readonly');
            $('#buySellModel #price').val(priceval);
            $('#buySellModel #TriggerPrice').val('0');
            $('#buySellModel #TriggerPrice').attr('disabled', 'disabled');
            $("#Quantity").val(TotalNrmlQty.toString());
        }
        else if (value == 'SL') {
            $('#buySellModel #price').removeAttr('disabled');
            $('#buySellModel #price').removeAttr('readonly');
            $('#buySellModel #price').val(priceval);
            $('#buySellModel #TriggerPrice').val(Triggerval);
            $('#buySellModel #TriggerPrice').removeAttr('disabled');
            $('#buySellModel #TriggerPrice').removeAttr('readonly');
            $("#Quantity").val(TotalNrmlQty.toString());
        }
        else if (value == 'SL-M') {
            $('#buySellModel #TriggerPrice').removeAttr('disabled');
            $('#buySellModel #TriggerPrice').removeAttr('readonly');
            $('#buySellModel #TriggerPrice').val(Triggerval);
            $('#buySellModel #price').val('0');
            $('#buySellModel #price').attr('disabled', 'disabled');
            $("#Quantity").val(TotalNrmlQty.toString());
        }
        else if (value == 'MARKET') {
            $('#buySellModel #price').val('0');
            $('#buySellModel #price').attr('disabled', 'disabled');
            $('#buySellModel #TriggerPrice').val('0');
            $('#buySellModel #TriggerPrice').attr('disabled', 'disabled');
            $("#Quantity").val(TotalNrmlQty.toString());
        }
        NumOfLots();
    });
});
function HidePopUp() {
    $(".ShowCompletedDiv").css('display', 'none');
    $(".BuySellDiv").css('display', 'none');
    $(".All-MainDiv").css('display', 'inherit');

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
function wt() {
    var nData = allObj;

    /*if ($('#buySellModel').hasClass('in')) {*/
    if (nData != null && nData != 'undefined' && nData.length > 0) {
        var newL = nData.filter(opt => opt.InstrumentToken == $('#buySellModel #lblScriptCode').text());
        if (newL.length > 0) {
            $('#buySellModel #lblLastPrice').text(newL[0].Lastprice);
            $('#buySellModel #lblLastBid').text(newL[0].Bid);
            $('#buySellModel #lblLastAsk').text(newL[0].Ask);
            $('#buySellModel #hdnHigh').text(newL[0].high);
            $('#buySellModel #hdnLow').text(newL[0].low);
            $('#buySellModel #hdnPrice').val(newL[0].Lastprice);
            $('#buySellModel #lblLow').text(newL[0].low);
            $('#buySellModel #lblHigh').text(newL[0].high);
            $('#buySellModel #lblOpen').text(newL[0].Open);
            $('#buySellModel #lblOpen').text($('#buySellModel #hdnBidAsk').val() == "Buy" ? newL[0].Bid : newL[0].Ask);

        }
    }
}
function OrderExeption() {
    var request = $.ajax({
        url: "/Trade/GetOrderExceptionList",
        type: "GET",
        dataType: 'json',
        success: function (data) {
            var results = JSON.parse(data);
                if (results != null) {
                    if (results.length > 0) {
                        var html = '<div><div class="col=12" style="text-align:center;"><b style="color:red;">ERROR</b></div><br>';
                        for (var i = 0; i < results.length; i++) {
                            html += '<div class=" row  watchlist-card c-left-border watchlist-table" style="border-bottom: 1px solid #ddd;"><div class="col-12" style = "text-align:center;"> ' + results[i].Tradingsymbol + '</div><div class="col-4" style = "text-align:center;"> Qty: ' + results[i].Quantity + '</div><div class="col-4" style = "text-align:center;"> price: ' + results[i].price + '</div><div class="col-2" style = "text-align:center;"> CP: ' + results[i].TransactionType + '</div>Msg:' + results[i].Message + '</div>';
                        }
                        html += '</div>';
                        console.log(html);
                        $("#errorModal .modal-body").html(html);
                        $("#errorModal").modal('show');
                    }
                }
        }
    });
}
function LoadData() {

    var Tempscriptname = $('#Drp-Segments option:selected').val();
    var ScriptExchange = Tempscriptname.split('>')[0];
    var ScriptInstumentType = Tempscriptname.split('>')[1];
    var OrderDate = $('.ActiveTab').text() == "DAY WISE" ? "OrderDate" : "";
    var OpenTrades = rbtnAll.checked == true ? "" : "OPEN";
    var input = { 'tradetype': 0, 'ActiveTradeID': 0, 'ScriptExchange': ScriptExchange, 'ScriptInstrumentType': ScriptInstumentType, 'OrderDate': OrderDate, 'OpenTrades': OpenTrades };
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
    var Totalprofitloss = 0;
    if (results != null) {
        $('#DivActivetrade').html('');
        if (results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                var result = results[i];

                Totalprofitloss += result.Profitorloss;
                result.Is_DataInCompleted == false ? setActiveresultdata(result) : setActiveCompletedresultdata(result);

            }
            $('#' + BindClickButton).css('display', 'initial');
            BindClick();
        }
        else {
            var html = '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style=" padding: 10px; border-bottom: 1px solid lightgray; width: 100vw; position: relative; left: -15px; text-align: center; font-size: 13px;">No Trades Found.</div >';

            $('#DivActivetrade').append(html);
        }
    }
    var html = "position (";
    html += Totalprofitloss > 0 ? '<span style="color:dodgerblue">' + Totalprofitloss.toFixed(2) + '</span>' : '<span style="color:orangered">' + Totalprofitloss.toFixed(2) + '</span>';
    $('#Header_Text').html(html + ')');
}
function setActiveresultdata(item) {

    var OutputQty;
    var totallot;
    var Total_NrmlQty;
    var tempLot;
    if (item.TRADING_UNIT_TYPE == 1) {
        OutputQty = item.Qty / item.ObjScriptDTO.ScriptLotSize;
        totallot = (item.ObjScriptDTO.ScriptLotSize) * OutputQty;
        Total_NrmlQty = item.TotalNrmlQty / item.ObjScriptDTO.ScriptLotSize;
        tempLot = item.ObjScriptDTO.ScriptLotSize;
    }
    else {
        if (item.ObjScriptDTO.ScriptLotSize > 10 && item.ObjScriptDTO.ScriptExchange == "MCX" && ((item.COMPANY_INITIAL == "EXPO" && item.TENANT_ID == 51) || (item.COMPANY_INITIAL == "ASR" && item.TENANT_ID == 57) || (item.COMPANY_INITIAL == "RVERMA"))) {
            OutputQty = item.ObjScriptDTO.ScriptLotSize >= 10 ? item.Qty / (item.ObjScriptDTO.ScriptLotSize / 10) : item.Qty;
            totallot = item.ObjScriptDTO.ScriptLotSize >= 10 ? (item.ObjScriptDTO.ScriptLotSize / 10) * OutputQty : item.ObjScriptDTO.ScriptLotSize;
            Total_NrmlQty = item.ObjScriptDTO.ScriptLotSize >= 10 ? item.TotalNrmlQty / (item.ObjScriptDTO.ScriptLotSize / 10) : item.TotalNrmlQty;
            tempLot = item.ObjScriptDTO.ScriptLotSize >= 10 ? item.ObjScriptDTO.ScriptLotSize / 10 : item.ObjScriptDTO.ScriptLotSize;
        } else {
            OutputQty = item.Qty;
            totallot = OutputQty;
            Total_NrmlQty = item.TotalNrmlQty;
            tempLot = item.ObjScriptDTO.ScriptLotSize;
        }
    }
    var GetQtyType = item.TRADING_UNIT.toLowerCase() == "Qty" ? 'U' : '';
    var CpDiv = item.CurrentPosition == "Buy" ? '<spam style="color:dodgerblue;padding-right: 4px;">' + item.CurrentPosition + '</spam>' : '<spam style="color:orangered;padding-right: 4px;">' + item.CurrentPosition + '</spam>';
    var PlDiv = item.Profitorloss > 0 ? '<spam style="color:dodgerblue;padding-right: 4px;">' + item.Profitorloss.toFixed(2) + '</spam>' : '<spam style="color:orangered;padding-right: 4px;">' + item.Profitorloss.toFixed(2) + '</spam>';
    var Qty = "";
    if (item.TRADING_UNIT_TYPE == 1) {
        Qty = item.CurrentPosition == "Buy" ? '<spam style="color:dodgerblue;font-size:larger;font-weight:bold;padding-right:4px;">Qty : ' + totallot + ' (' + OutputQty + GetQtyType + ')</spam>' : '<spam style="color:orangered;font-size:larger;font-weight:bold;padding-right:4px;">Qty : ' + totallot + ' (' + OutputQty + GetQtyType + ')</spam>';
    }
    else {
        Qty = item.CurrentPosition == "Buy" ? '<spam style="color:dodgerblue;font-size:larger;font-weight:bold;padding-right:4px;">Qty : ' + totallot + '</spam>' : '<spam style="color:orangered;font-size:larger;font-weight:bold;padding-right:4px;">Qty : ' + totallot + ')</spam>';
    }
    var buyButton = "";
    var sellButton = "";
    if (item.Strategyname == "Manual")
        isManualStaratgy = true;

    var symbolParam = item.TradeSymbol.replace(/'/g, "");
    symbolParam = '\'' + symbolParam + '\'';
    var ScriptInstrumentType = '\'' + item.ScriptInstrumentType + '\'';
    var ScriptExchange = '\'' + item.ObjScriptDTO.ScriptExchange.toString() + '\'';
    var ScriptCode = '\'' + item.ScriptCode.toString() + '\'';

    var buyButton = '<div tabindex="-1" class="b-btn" style="float:right;"><button onclick="buySellPopUp(' + Total_NrmlQty + ',' + tempLot + ',' + item.ScriptCode + ',1,' + symbolParam + ',' + item.WID + ',' + item.ObjScriptDTO.Lastprice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + OutputQty + ',' + item.ObjScriptDTO.ScriptLotSize +  ')" type="button" class="btn btn-success btn-sm btn-Buy tradebuyButton">CLOSE</button></div> ';
    var sellButton = '<div tabindex="-1" class="b-btn" style="float:right;"><button onclick="buySellPopUp(' + Total_NrmlQty + ',' + tempLot +',' + item.ScriptCode + ',2,' + symbolParam + ',' + item.WID + ',' + item.ObjScriptDTO.Lastprice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + OutputQty + ',' + item.ObjScriptDTO.ScriptLotSize +  ')" type="button" class="btn btn-danger btn-sm btn-Sell tradeSellButton">CLOSE</button></div> ';

    var TradesButton = '<button onclick="ShowCompleted(' + symbolParam + ',' + ScriptCode + ')" type="button" class="btn btn-success btn-sm btn-Buy tradebuyButton" style="background: #d3d3d359;color:black;box-shadow:1px 1px 2px black;">TRADES</button>';
    var Action_button = item.CurrentPosition == "Buy" ? sellButton : buyButton;
    Action_button = $('.ActiveTab').text() == "DAY WISE" ? "" : Action_button;

    var html = '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 completed-Div activeTradeRowView" data-Scripttype="Btn' + item.ActiveTradeID + '" style="">' +
        '<div class="col-lg-6 col-sm-6 col-xs-6 col-md-6">' +
        item.TradeSymbol +
        '</div>' +
        '<div class="col-lg-6 col-sm-6 col-xs-6 col-md-6">' +
        Qty +
        '</div>' +
        '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">' +
        '<div class="col-lg-4 col-sm-4 col-xs-4 col-md-4" style="display:inline-flex;">' +
        /*CpDiv + '(' + item.ProductType + ')' +*/
        'Avg price: ' + item.OrderPrice.toFixed(2) +
        '</div>' +
        '<div class="col-lg-4 col-sm-4 col-xs-4 col-md-4" style="display:inline-flex;">' +
        /*item.ObjScriptDTO.ScriptLotSize + '(' + OutputQty + ')' +*/
        'Rate : ' + item.ObjScriptDTO.Lastprice +
        '</div>' +
        '<div class="col-lg-4 col-sm-4 col-xs-4 col-md-4" style="display:inline-flex;">' +
        PlDiv +
        '</div>' +
        '</div>' +
        '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 BuySellButton" style="float:right;padding: 8px 18px 0px 0px;display:none;" Id="Btn' + item.ActiveTradeID + '">' +
        '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">' + TradesButton + '</div>' +
        '<div></div>'+
        '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="display:flex;flex-direction:row-reverse;">' + Action_button + '</div>' +
        '        </div>' +
        '</div>';

    $('#DivActivetrade').append(html);

}
function setActiveCompletedresultdata(item) {

    var OutputQty = item.Qty / item.ObjScriptDTO.ScriptLotSize;

    var PlDiv = item.Profitorloss > 0 ? '<spam style="color:dodgerblue;padding-right: 4px;">' + item.Profitorloss.toFixed(2) + '</spam>' : '<spam style="color:orangered;padding-right: 4px;">' + item.Profitorloss.toFixed(2) + '</spam>';

    var totallot = OutputQty > 0 ? (item.ObjScriptDTO.ScriptLotSize) * OutputQty : item.ObjScriptDTO.ScriptLotSize;
    var Qty = '<spam style="color:dodgerblue;font-size:larger;font-weight:bold;padding-right:4px;">Qty : ' +  OutputQty +'</spam>';

    var symbolParam = item.TradeSymbol.replace(/'/g, "");
    symbolParam = '\'' + symbolParam + '\'';

    var ScriptCode = '\'' + item.ScriptCode.toString() + '\'';

    var TradesButton = '<button onclick="ShowCompleted(' + symbolParam + ',' + ScriptCode + ')" type="button" class="btn btn-success btn-sm btn-Buy tradebuyButton" style="background: #d3d3d359;color:black;box-shadow:1px 1px 2px black;">TRADES</button>';


    var html = '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 completed-Div activeTradeRowView" data-Scripttype="BtnCompleted' + item.ActiveTradeID + '" style="">' +
        '<div class="col-lg-6 col-sm-6 col-xs-6 col-md-6">' +
        item.TradeSymbol +
        '</div>' +
        '<div class="col-lg-6 col-sm-6 col-xs-6 col-md-6">' +
        Qty +
        '</div>' +
        '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">' +
        '<div class="col-lg-4 col-sm-4 col-xs-4 col-md-4" style="display:inline-flex;">' +
        /*CpDiv + '(' + item.ProductType + ')' +*/
        'Avg price: ' + item.ObjScriptDTO.Averageprice.toFixed(2) +
        '</div>' +
        '<div class="col-lg-4 col-sm-4 col-xs-4 col-md-4">' +
        /*item.ObjScriptDTO.ScriptLotSize + '(' + OutputQty + ')' +*/
        'Rate : ' + item.ObjScriptDTO.Lastprice +
        '</div>' +
        '<div class="col-lg-4 col-sm-4 col-xs-4 col-md-4">' +
        PlDiv +
        '</div>' +
        '</div>' +
        '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 BuySellButton" style="float:right;padding: 8px 18px 0px 0px;display:none;" Id="BtnCompleted' + item.ActiveTradeID + '">' +
        '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">' + TradesButton + '</div>' +
        '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="display:flex;flex-direction:row-reverse;">' + '</div>' +
        '        </div>' +
        '</div>';

    $('#DivActivetrade').append(html);

}
function openTrade(tab, TableName) {
    $('.tablinks').css('border-bottom', 'none');
    $('.tablinks').css('color', 'black');
    $('.tablinks').removeClass('ActiveTab');
    $('#' + tab).css('border-bottom', '2px solid lime');
    $('#' + tab).css('color', 'lime');
    $('#' + tab).addClass('ActiveTab');
}


function ShowCompleted(ScriptTradingSymbol, ScriptCode) {

    var Tempscriptname = $('#Drp-Segments option:selected').val();
    var ScriptExchange = Tempscriptname.split('>')[0];
    var ScriptInstumentType = Tempscriptname.split('>')[1];
    var CurrentPosition = $('#Drp-Segments-CurrentPosition option:selected').val();


    var input = { 'ScriptExchange': ScriptExchange, 'ScriptInstumentType': ScriptInstumentType, 'ScriptTradingSymbol': ScriptTradingSymbol, 'ScriptCode': ScriptCode, "IsOrderLog": 1 };
    var request = $.ajax({
        url: "/Trade/GetCompletedTradeForTradesPage",
        type: "GET",
        data: input,
        dataType: 'json',
        async: true,
        success: function (data) {
            SetCompletedResult(data);
        }
    });
    $(".ShowCompletedDiv").css('display', 'inherit');
    $(".All-MainDiv").css('display', 'none');
}
function SetCompletedResult(results) {
    //var results = JSON.parse(data);
    if (results != null) {
        $('#DivCompletedtrade').html('');
        if (results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                setcompltedresultdata(result);
            }
        }
        else {
            var html = '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style=" padding: 10px; border-bottom: 1px solid lightgray; width: 100vw; position: relative; left: -15px; text-align: center; font-size: 13px;">No Trades Found.</div >';

            $('#DivCompletedtrade').append(html);
        }
    }
}
function setcompltedresultdata(item) {

    if (item.TRADING_UNIT_TYPE == 1) {
        OutputQty = item.Qty / item.ScriptLotSize;
    }
    else {
        if (item.ScriptLotSize > 10 && item.ScriptExchange == "MCX" && ((item.COMPANY_INITIAL == "EXPO" && item.TENANT_ID == 51) || (item.COMPANY_INITIAL == "ASR" && item.TENANT_ID == 57) || (item.COMPANY_INITIAL == "RVERMA"))) {
            OutputQty = item.Qty / (item.ScriptLotSize / 10);
        } else {
            OutputQty = item.Qty;
        }
    }
    var GetQtyType = item.TRADING_UNIT_TYPE == 2 ? 'U' : '';
    var Qty = "";
    if (item.TRADING_UNIT_TYPE == 1) {
        Qty = '<div class="col-lg-4 col-sm-4 col-xs-4 col-md-4">' + item.Qty.toFixed(2) + '(' + OutputQty + ')' + '</div>';
    } else {
        Qty = '<div class="col-lg-4 col-sm-4 col-xs-4 col-md-4">' + item.Qty.toFixed(2) + '</div>';
    }

    var CpDiv = item.CurrentPosition == "Buy" ? '<spam style="color:dodgerblue">' + item.CurrentPosition + '</spam>' : '<spam style="color:orangered">' + item.CurrentPosition + '</spam>';
    var PlDiv = item.Profitorloss > 0 ? '<spam style="color:dodgerblue">' + item.Profitorloss.toFixed(2) + '</spam>' : '<spam style="color:orangered">' + item.Profitorloss.toFixed(2) + '</spam>';
    var ProductType = item.ProductType == "NRML" ? "NRM" : item.ProductType;
    var html = '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 completed-Div" style="">' +
        '<div class="col-lg-6 col-sm-6 col-xs-6 col-md-6">' +
        item.TradeSymbol +
        '</div>' +
        '<div class="col-lg-6 col-sm-6 col-xs-6 col-md-6">' +
        item.ExitDate + '&nbsp;' + item.Exittime +
        '</div>' +
        '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">' +
        '<div class="col-lg-4 col-sm-4 col-xs-4 col-md-4">' +
        CpDiv + '(' + ProductType + ')' +
        '</div>' +
        Qty +
        '<div class="col-lg-4 col-sm-4 col-xs-4 col-md-4">' +
        '<b style="font-weight:bold;">' + item.Exitprice.toFixed(2) + '</b>' +
        '</div>' +
        '</div>' +
        '</div>';
    $('#DivCompletedtrade').append(html);

}
function buySellPopUp(TotalNrmlQty, tempLotFrontEND, ScriptCode, no, ScriptSymbol, WID, price, instumentType, ScriptExchange, Quantity = 1, ScriptLotSize = 1, TriggerPrice = 0, SL = 0, Target = 0, PriceType = '', ProductType = '', TradeID = 0, sttus = '') {
    if (ScriptExchange == "NFO") {
        $('#LotToQtyDiv').hide();
        $('#TxtLotName').html('Qty');
    } else {
        $('#LotToQtyDiv').show();
        $('#TxtLotName').html('Lot');
    }
    $("#TotalNrmlQty").text(TotalNrmlQty.toString());
    $("#tempLotFrontEND").text(tempLotFrontEND.toString());
    $(".All-MainDiv").css('display', 'none');
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
        $('#buySellModel .modal-title').css("background-color", "dodgerblue");
        $('#buySellModel #btnProceedBuySell').css("background-color", "#4987ee");
        $('#buySellModel #btnProceedBuySell').css("color", "#fff");
        $('#buySellModel #btnProceedBuySell').text("Buy");
        $('#buySellModel #hdnBidAsk').val("Buy");

    }
    else if (no == 2) {
        CurrentPosition = 'Sell';
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

        $('#rbtnMarket').removeAttr('disabled');
        $("#rbtnMarket").prop('checked', true);
        $('#buySellModel #price').val(price);
        $('#buySellModel #price').attr('disabled', 'disabled');
        $('#buySellModel #TriggerPrice').attr('disabled', 'disabled');

        Quantity = TotalNrmlQty;


    Quantity = Quantity > 0 ? Quantity : Quantity * -1;
    $("#Quantity").val(Quantity.toString());
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
    if (PriceType == null || PriceType == '') {
        $('#buySellModel #price').attr('disabled', 'disabled');
        $('#buySellModel #TriggerPrice').attr('disabled', 'disabled');
    }

    //$('#buySellModel').modal({
    //    backdrop: false,
    //    show: true
    //});


    //$("body").removeClass('modal-open');
    $("#hdnSt").val(sttus);


    var RememberData = localStorage.getItem("RememberTargetStoploss");
    if (RememberData != null) {
        RememberData = JSON.parse(RememberData);
        $("#cbxRememberTargetStoploss").prop('checked', true);
        $("#txtTarget").val(RememberData.TGT);
        $("#txtStopLoss").val(RememberData.SL);
    }
    isShowDepthModal = false;
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
    $('.BuySellDiv').css('display', 'inherit');
    $('#watchlistDiv').css('display', 'none');
    NumOfLots();
}
function ProceedBuySell() {
    var quantity = $("#Quantity").val();
    if (quantity < 0.01) {
        toastr.error("Invalid Qty");
        return;
    }
    if ($("#cbxRememberTargetStoploss").prop('checked') == true) {
        var data = { TGT: $("#txtTarget").val(), SL: $("#txtStopLoss").val() };
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

    var TotalNrmlQty = $("#TotalNrmlQty").text();
    TotalNrmlQty = TotalNrmlQty > 0 ? TotalNrmlQty : TotalNrmlQty * -1;

        if (quantity > TotalNrmlQty) {
            toastr.error('You Can not Sell more then buyed NRML Qty');
            $('#btnProceedBuySell').removeAttr('disabled');
            return;
        }
    var marketType = $('input[Name=MarketType]:checked').val();
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

        if ($('#IsTargetStopLossAbsolute').val()=='True') {
            var msg = "";
            if (CurrentPosition == 'Buy') {
                if (dTarget > 0) {
                    if (dTarget < Lastprice)
                        msg = 'Target should be greater than Last price';
                }
                if (dStoploss > 0) {
                    if (dStoploss > Lastprice)
                        msg = 'StopLoss should be less than Last price';
                }

            }
            else {
                if (dTarget > 0) {
                    if (dTarget > Lastprice)
                        msg = 'Target should be less than Last price';
                }
                if (dStoploss > 0) {
                    if (dStoploss < Lastprice)
                        msg = 'StopLoss  should be greater than Last price';
                }

            }
            if (msg != '') {
                toastr.error(msg);
                $('#btnProceedBuySell').removeAttr('disabled');
                return;
            }
        }
    }
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
    var st = $("#hdnSt").val();
    var TRADING_UNIT = $("#dropTradingUnit").val();

    if (ScriptCode > 0 && intWID > 0 && quantity != '' && quantity != '0') {
        var request = $.ajax({
            url: "/Trade/ProceedBuySell",
            type: "POST",
            data: { intWID: intWID, ScriptCode: ScriptCode, CurrentPosition: CurrentPosition, allUsers: false, target: '0', stopLoss: '0', Quantity: quantity, price: price, TriggerPrice: TriggerPrice, ProductType: ProductType, MarketType: marketType, TradeID: tradeID, Status: st, iscbxAutoBinanceSlTrailEnabled: 0, TRADING_UNIT: TRADING_UNIT },
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