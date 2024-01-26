var intervalSensexNifty;
var intervalWatchList;
var Id_for_Controls;
var sqModal;
var BindClickButton;
var SocketInterval;
var websocket;
var allowedTradingUnit;
function BindClick() {
    $('.activeTradeRowView').bind('click', function () {
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
$(document).ready(function () {
    allowedTradingUnit = JSON.parse($("#TradingUnitAccess").val());
    $('#tablink2').trigger('click');
    var $options = $('#Drp-Segments>option').clone();
    $('#Drp-Segments-add').html('');
    $('#Drp-Segments-add').append($options);
    $('#Drp-Segments-add').val($('#Drp-Segments option:selected').val());

    $(document).on('change', '#Drp-Segments-add', function () {
        $('#Drp-Segments').val($('#Drp-Segments-add option:selected').val());
        $('.TxtSegment_ID').html($('#Drp-Segments option:selected').text());
        localStorage.setItem('GetSegments', $('#Drp-Segments option:selected').val());
    });
    intervalWatchList = setInterval(function () { SetTradeDataForRefresh(); }, 1000);
    initSocket();
    SocketInterval = setInterval(function () { initSocket(); }, 1000);
    $('#backbtn').css('color', '#fff');
    $('#backbtn').on('click', function () {
        window.location.href = "/Trade/Index";
    });
    $('input[name=MarketType]').on('change', function (ele) {
        var value = $(ele.currentTarget).val();
        var priceval = $('#hdnPrice').val();
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
            $('#buySellModel #TriggerPrice').val(priceval);
            $('#buySellModel #TriggerPrice').removeAttr('disabled');
            $('#buySellModel #TriggerPrice').removeAttr('readonly');
        }
        else if (value == 'SL-M') {
            $('#buySellModel #TriggerPrice').removeAttr('disabled');
            $('#buySellModel #TriggerPrice').removeAttr('readonly');
            $('#buySellModel #TriggerPrice').val(priceval);
            $('#buySellModel #Price').val('0');
            $('#buySellModel #Price').attr('disabled', 'disabled');
        }
        else if (value == 'MARKET') {
            $('#buySellModel #Price').val('0');
            $('#buySellModel #Price').attr('disabled', 'disabled');
            $('#buySellModel #TriggerPrice').val('0');
            $('#buySellModel #TriggerPrice').attr('disabled', 'disabled');
        }
    });
});
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
    }
}
function SetTradeDataForRefresh() {
    try {
        var Tempscriptname = $('#Drp-Segments option:selected').val();
        var scriptExchange = Tempscriptname.split('>')[0];
        var ScriptInstumentType = Tempscriptname.split('>')[1];
        var input = { 'tradetype': 0, 'ScriptExchange': scriptExchange, 'scriptInstrumentType': ScriptInstumentType};
        var request = $.ajax({
            url: "/Trade/SetActiveTradeDataForNewUI",
            type: "GET",
            data: input,
            dataType: 'json',
            async: true,
            success: function (data) {
                SetActiveResult(data);
            }
        });

    } catch (e) {
        toastr.error("Error On SetTradeData.");
    }
}
function SetActiveResult(data) {
    var results = JSON.parse(data);
    if (results != null) {
        $('#ActiveTradeDiv').html('');
        $('#PendingTradeDiv').html('');
        var Table_Name;
        if (results.ActiveTrade.length > 0) {
            for (var i = 0; i < results.ActiveTrade.length; i++) {
                var result = results.ActiveTrade[i];
                var Status = result.Status;
                if (Status.toUpperCase() == "COMPLETE") {
                    Table_Name = 'ActiveTradeDiv';
                    SetActiveTradeDetails(result, Table_Name);
                }
                else if (Status.toUpperCase() == "OPEN") {
                    Table_Name = 'PendingTradeDiv';
                    SetPendingTradeDetails(result, Table_Name);
                }
            }
        }
        else {
            var html = '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style=" padding: 10px; border-bottom: 1px solid lightgray; width: 100vw; position: relative; left: -15px; text-align: center; font-size: 13px;">No Trades Found.</div >';
            $('#ActiveTradeDiv').append(html);
            $('#PendingTradeDiv').append(html);
        }
    }
    $('#' + BindClickButton).css('display', 'initial');
    BindClick();
}
function SetActiveTradeDetails(item, Table_Name) {
    var OutputQty;
    if (item.TRADING_UNIT_TYPE == 1) {
        OutputQty = item.Qty / item.ObjScriptDTO.ScriptLotSize;
    }
    else {
        if (item.ObjScriptDTO.ScriptLotSize > 10 && item.ObjScriptDTO.ScriptExchange == "MCX" && ((item.COMPANY_INITIAL == "EXPO" && item.TENANT_ID == 51) || (item.COMPANY_INITIAL == "ASR" && item.TENANT_ID == 57) || (item.COMPANY_INITIAL == "RVERMA"))) {
            OutputQty = item.Qty / (item.ObjScriptDTO.ScriptLotSize / 10);
        } else {
            OutputQty = item.Qty;
        }
    }
    var GetQtyType = item.TRADING_UNIT.toLowerCase()=="qty"?'U':'';
    var CpDiv = item.CurrentPosition == "BUY" ? '<spam style="color:dodgerblue;padding-right: 4px;">' + item.CurrentPosition + '</spam>' : '<spam style="color:orangered;padding-right: 4px;">' + item.CurrentPosition + '</spam>';
    var PlDiv = item.ProfitOrLoss > 0 ? '<spam style="color:dodgerblue">' + item.ProfitOrLoss.toFixed(2) + '</spam>' : '<spam style="color:orangered">' + item.ProfitOrLoss.toFixed(2) + '</spam>';

    var Qty = item.CurrentPosition == "BUY" ? '<spam style="color:dodgerblue;font-size:larger;font-weight:bold;padding-right:4px;">Qty : ' + OutputQty + '</spam>' : '<spam style="color:orangered;font-size:larger;font-weight:bold;padding-right:4px;">Qty : ' + OutputQty  + '</spam>';
    var buyButton = "";
    var sellButton = "";
    var pos = '\'' + item.CurrentPosition.toString() + '\'';
    var st = '\'' + item.Status.toString() + '\'';

    var isManualStaratgy = false;
    if (item.StrategyName == "Manual")
        isManualStaratgy = true;

    var symbolParam = item.TradeSymbol.replace(/'/g, "");
    symbolParam = '\'' + symbolParam + '\'';
    var ScriptInstrumentType = '\'' + item.ScriptInstrumentType + '\'';
    var ScriptExchange = '\'' + item.ObjScriptDTO.ScriptExchange.toString() + '\'';
    var ScriptCOde = '\'' + item.ScriptCode.toString() + '\'';
    var productType = '\'' + item.ProductType + '\'';
    var priceType = '\'' + item.PriceType + '\'';
    var buyorsell = 2;
    if (item.CurrentPositionNew == "BUY")
        buyorsell = 1;
    var buyButton = '<div tabindex="-1" class="b-btn" style="float:right;"><button onclick="buySellPopUp(' + item.ScriptCode + ',1,' + symbolParam + ',' + item.WID + ',' + item.ObjScriptDTO.LastPrice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + OutputQty + ',' + item.ScriptLotSize + ')" type="button" class="btn tradebuyButton">BUY</button></div> ';
    var sellButton = '<div tabindex="-1" class="b-btn" style="float:right;"><button onclick="buySellPopUp(' + item.ScriptCode + ',2,' + symbolParam + ',' + item.WID + ',' + item.ObjScriptDTO.LastPrice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + OutputQty + ',' + item.ScriptLotSize + ')" type="button" class="btn btn-danger btn-sm btn-sell tradeSellButton">SELL</button></div> ';

    var TradesButton = '<button onclick="ShowCompleted(' + symbolParam + ',' + ScriptExchange + ',' + ScriptCOde + ')" type="button" class="btn btn-success btn-sm btn-buy tradebuyButton" style="background: #d3d3d359;color:black;box-shadow:1px 1px 2px black;">TRADES</button>';
    var Action_button = "";

    var editButton = ' <button class="btn btn-primary btn-sm tradebuyButton" style="margin-right:7px;" onclick="buySellPopUp(' + item.ScriptCode + ',' + buyorsell + ',' + symbolParam + ',' + item.WID + ',' + item.OrderPrice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + OutputQty + ',' + item.ObjScriptDTO.ScriptLotSize + ',' + item.TriggerPrice + ',' + item.SLNew + ',' + item.TGNew + ',' + priceType + ',' + productType + ',' + item.ActiveTradeID + ',' + st + ',' + item.ENABLE_AUTO_TRAILING + ')" type="button">Edit</button> ';
    if (item.Status.toUpperCase() == "REJECTED" || item.Status.toUpperCase() == "CANCELED" || item.Status.toUpperCase() == "OPEN") {
        var RejectedOrderDeleteBtn = '<button class="btn btn-danger btn-sm btn-DelActive tradeSellButton" type="button" id="btn-DelActive' + item.ActiveTradeID + '" onclick="DeleteActiveTrade(' + item.ActiveTradeID + ',' + item.UserID + ')" data-bind=' + item.ActiveTradeID + '>Delete</button> ';
        Action_button += RejectedOrderDeleteBtn;
    }
    Action_button += item.Status.toUpperCase() == "OPEN" ? editButton : "";
    var html = '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 completed-Div activeTradeRowView" data-scriptType="Btn' + item.ActiveTradeID + '" data-scriptType="Btn' + item.ScriptCode + '" style="">' +
        '<div class="col-lg-6 col-sm-6 col-xs-6 col-md-6">' +
        item.TradeSymbol +
        '</div>' +
        '<div class="col-lg-6 col-sm-6 col-xs-6 col-md-6">' +
        Qty +
        '</div>' +
        '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">' +
        '<div class="col-lg-4 col-sm-4 col-xs-4 col-md-4" style="display:inline-flex;">' +
        'Avg Price: ' + item.ObjScriptDTO.AveragePrice.toFixed(2) +
        '</div>' +
        '<div class="col-lg-4 col-sm-4 col-xs-4 col-md-4">' +
        'Rate : ' + item.ObjScriptDTO.LastPrice +
        '</div>' +
        '<div class="col-lg-4 col-sm-4 col-xs-4 col-md-4" style="padding-right:4px;">' +
        PlDiv +
        '</div>' +
        '</div>' +
        '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 BuySellButton" style="float:right;padding: 8px 18px 0px 0px;display:none;" Id="Btn' + item.ActiveTradeID + '">' +
        '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">' +  '</div>' +
        '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="display:flex;flex-direction:row-reverse;">' + Action_button + '</div>' +
        '        </div>' +
        '</div>';

    $('#' + Table_Name).append(html);

}
function SetPendingTradeDetails(item, Table_Name) {
    var OutputQty;
    if (item.TRADING_UNIT_TYPE == 1) {
        OutputQty = item.Qty / item.ObjScriptDTO.ScriptLotSize;
    }
    else {
        if (item.ObjScriptDTO.ScriptLotSize > 10 && item.ObjScriptDTO.ScriptExchange == "MCX" && ((item.COMPANY_INITIAL == "EXPO" && item.TENANT_ID == 51) || (item.COMPANY_INITIAL == "ASR" && item.TENANT_ID == 57) || (item.COMPANY_INITIAL == "RVERMA"))) {
            OutputQty = item.Qty / (item.ObjScriptDTO.ScriptLotSize / 10);
        } else {
            OutputQty = item.Qty;
        }
    }
    var CpDiv = item.CurrentPosition == "BUY" ? '<spam style="color:dodgerblue;padding-right: 4px;">' + item.CurrentPosition + '</spam>' : '<spam style="color:orangered;padding-right: 4px;">' + item.CurrentPosition + '</spam>';
    var PlDiv = item.ProfitOrLoss > 0 ? '<spam style="color:dodgerblue">' + item.ProfitOrLoss.toFixed(2) + '</spam>' : '<spam style="color:orangered">' + item.ProfitOrLoss.toFixed(2) + '</spam>';
    var Qty = "";
    if (item.TRADING_UNIT_TYPE == 1) {
        Qty = item.CurrentPosition == "BUY" ? '<spam style="color:dodgerblue;font-size:larger;font-weight:bold;padding-right:4px;">' + item.Qty.toFixed(2) + '(' + OutputQty + ')' + '</spam>' : '<spam style="color:orangered;font-size:larger;font-weight:bold;padding-right:4px;">' + item.Qty.toFixed(2) + '(' + OutputQty + ')' + '</spam>';
    } else {
        Qty = item.CurrentPosition == "BUY" ? '<spam style="color:dodgerblue;font-size:larger;font-weight:bold;padding-right:4px;">' + OutputQty + '</spam>' : '<spam style="color:orangered;font-size:larger;font-weight:bold;padding-right:4px;">' + OutputQty + '</spam>';
    }



    var buyButton = "";
    var sellButton = "";
    var pos = '\'' + item.CurrentPosition.toString() + '\'';
    var st = '\'' + item.Status.toString() + '\'';

    var isManualStaratgy = false;
    if (item.StrategyName == "Manual")
        isManualStaratgy = true;

    var symbolParam = item.TradeSymbol.replace(/'/g, "");
    symbolParam = '\'' + symbolParam + '\'';
    var ScriptInstrumentType = '\'' + item.ScriptInstrumentType + '\'';
    var ScriptExchange = '\'' + item.ObjScriptDTO.ScriptExchange.toString() + '\'';
    var ScriptCOde = '\'' + item.ScriptCode.toString() + '\'';
    var productType = '\'' + item.ProductType + '\'';
    var priceType = '\'' + item.PriceType + '\'';
    var buyorsell = 2;
    if (item.CurrentPositionNew == "BUY")
        buyorsell = 1;
    var buyButton = '<div tabindex="-1" class="b-btn" style="float:right;"><button onclick="buySellPopUp(' + item.ScriptCode + ',1,' + symbolParam + ',' + item.WID + ',' + item.ObjScriptDTO.LastPrice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + OutputQty + ',' + item.ScriptLotSize + ')" type="button" class="btn tradebuyButton">BUY</button></div> ';
    var sellButton = '<div tabindex="-1" class="b-btn" style="float:right;"><button onclick="buySellPopUp(' + item.ScriptCode + ',2,' + symbolParam + ',' + item.WID + ',' + item.ObjScriptDTO.LastPrice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + OutputQty + ',' + item.ScriptLotSize + ')" type="button" class="btn btn-danger btn-sm btn-sell tradeSellButton">SELL</button></div> ';

    var TradesButton = '<button onclick="ShowCompleted(' + symbolParam + ',' + ScriptExchange + ',' + ScriptCOde + ')" type="button" class="btn btn-success btn-sm btn-buy tradebuyButton" style="background: #d3d3d359;color:black;box-shadow:1px 1px 2px black;">TRADES</button>';
    var Action_button = "";

    var editButton = ' <button class="btn btn-primary btn-sm tradebuyButton" style="margin-right:7px;" onclick="buySellPopUp(' + item.ScriptCode + ',' + buyorsell + ',' + symbolParam + ',' + item.WID + ',' + item.OrderPrice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + OutputQty + ',' + item.ObjScriptDTO.ScriptLotSize + ',' + item.TriggerPrice + ',' + item.SLNew + ',' + item.TGNew + ',' + priceType + ',' + productType + ',' + item.ActiveTradeID + ',' + st + ',' + item.ENABLE_AUTO_TRAILING + ')" type="button">Edit</button> ';
    if (item.Status.toUpperCase() == "REJECTED" || item.Status.toUpperCase() == "CANCELED" || item.Status.toUpperCase() == "OPEN") {
        var RejectedOrderDeleteBtn = '<button class="btn btn-danger btn-sm btn-DelActive tradeSellButton" type="button" id="btn-DelActive' + item.ActiveTradeID + '" onclick="DeleteActiveTrade(' + item.ActiveTradeID + ',' + item.UserID + ')" data-bind=' + item.ActiveTradeID + '>Delete</button> ';
        Action_button += RejectedOrderDeleteBtn;
    }
    Action_button += item.Status.toUpperCase() == "OPEN" ? editButton : "";
    var html = '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 completed-Div activeTradeRowView" data-scriptType="Btn' + item.ActiveTradeID + '" data-scriptType="Btn' + item.ScriptCode + '" style="">' +
        '<div class="col-lg-6 col-sm-6 col-xs-6 col-md-6" style="padding-left:4px;">' +
        item.TradeSymbol +
        '</div>' +
        '<div class="col-lg-6 col-sm-6 col-xs-6 col-md-6" style="padding-right:4px;">' +
        item.OrderTime +
        '</div>' +
        '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">' +
        '<div class="col-lg-4 col-sm-4 col-xs-4 col-md-4" style="display:inline-flex;padding-left:4px;">' +
        CpDiv +
        '</div>' +
        '<div class="col-lg-4 col-sm-4 col-xs-4 col-md-4">' +
        Qty +
        '</div>' +
        '<div class="col-lg-4 col-sm-4 col-xs-4 col-md-4" style="padding-right:4px;">' +
        item.OrderPrice +
        '</div>' +
        '</div>' +
        '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 BuySellButton" style="float:right;padding: 8px 18px 0px 0px;display:none;" Id="Btn' + item.ActiveTradeID + '">' +
        '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">' +  '</div>' +
        '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="display:flex;flex-direction:row-reverse;">' + Action_button + '</div>' +
        '        </div>' +
        '</div>';

    $('#' + Table_Name).append(html);

}
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
    $(".All-MainDiv").css('display', 'none');
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
    if (PriceType != null && PriceType != '') {
        if (PriceType == 'LIMIT') {
            $('#rbtnLimit').removeAttr('disabled');
            $('#buySellModel #Price').removeAttr('readonly');
            $('#buySellModel #Price').removeAttr('disabled');
            $('#buySellModel #Price').val(price);
            $('#buySellModel #TriggerPrice').val('0');
            $('#buySellModel #TriggerPrice').attr('disabled', 'disabled');
            $("#rbtnLimit").prop('checked', true);
        }
        else if (PriceType == 'SL') {
            $('#rbtnSL').removeAttr('disabled');
            $("#rbtnSL").prop('checked', true);
            $('#buySellModel #Price').removeAttr('disabled');
            $('#buySellModel #Price').val(price);

            $('#buySellModel #TriggerPrice').removeAttr('disabled');

        }
        else if (PriceType == 'SL-M') {
            $('#rbtnSLM').removeAttr('disabled');
            $("#rbtnSLM").prop('checked', true);
            $('#buySellModel #Price').val(price);
            $('#buySellModel #Price').attr('disabled', 'disabled');
        }
        else if (PriceType == 'MARKET') {
            $('#rbtnMarket').removeAttr('disabled');
            $("#rbtnMarket").prop('checked', true);
            $('#buySellModel #Price').val(price);
            $('#buySellModel #Price').attr('disabled', 'disabled');

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
    if (PriceType == null || PriceType == '') {
        $('#buySellModel #Price').attr('disabled', 'disabled');
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
    var st = $("#hdnSt").val();
    var TRADING_UNIT = $("#dropTradingUnit").val();

    if (ScriptCode > 0 && intWID > 0 && quantity != '' && quantity != '0') {
        var request = $.ajax({
            url: "/Trade/ProceedBuySell",
            type: "POST",
            data: { intWID: intWID, ScriptCode: ScriptCode, CurrentPosition: CurrentPosition, allUsers: false, target: target, stopLoss: stopLoss, Quantity: quantity, Price: price, TriggerPrice: triggerPrice, ProductType: productType, MarketType: marketType, TradeID: tradeID, Status: st, iscbxAutoBinanceSlTrailEnabled: 0, TRADING_UNIT: TRADING_UNIT},
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
    $(".BuySellDiv").css('display', 'none');
    $("#watchlistDiv").css('display', 'inherit');

}
function SquareOff(id, param, st, qty, isManualStaratgy) {
    sqModal = $("#sqOfModal");
    $(sqModal).find(".sqMsg").text('');
    $(sqModal).find("input[name=sqQty]").val(qty);
    $(sqModal).find("input[name=hdQty]").val(qty);
    $(sqModal).find("input[name=sqActiveTradeId]").val(id);
    $(sqModal).find("input[name=sqStatus]").val(st);
    $(sqModal).find("input[name=sqParam]").val(param);
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
    var sqQty = $(sqModal).find("input[name=sqQty]").val();
    var initQty = $(sqModal).find("input[name=hdQty]").val();
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
    var id = $(sqModal).find("input[name=sqActiveTradeId]").val();
    var st = $(sqModal).find("input[name=sqStatus]").val();
    var param = $(sqModal).find("input[name=sqParam]").val();
    var request = $.ajax({
        url: "/Trade/ManageTradeSquareOff",
        type: "POST",
        data: { ID: id, actionParam: param, status: st, qty: intQty, isSupAdmin: 1 },
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
function DeleteRejectedTrade(data) {
    newconfirmMobile("Delete This Record", function () {
        var resp = $('body').find('.cresp').html();
        $('body').find('.cresp').remove();
        if (resp == 'Yes') {
            var request = $.ajax({
                url: "/Trade/DeleteRejectedTrade?ID=" + data,
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
function openTrade(tab, TableName) {
    $('.Div_CompletedTrade').css('display', 'none');
    $('.Div_PendingTrade').css('display', 'none');
    $('.tablinks').css('border-bottom', 'none');
    $('.tablinks').css('color', 'black');
    $('.tablinks').removeClass('ActiveTab');
    $('#' + tab).css('border-bottom', '2px solid lime');
    $('#' + tab).css('color', 'lime');
    $('#' + tab).addClass('ActiveTab');
    $('.' + TableName).css('display', 'initial');
}
function DeleteActiveTrade(TransactionId, UserID) {
    newconfirmMobile("Delete This Record", function () {
        var resp = $('body').find('.cresp').html();
        $('body').find('.cresp').remove();
        if (resp == 'Yes') {
            var request = $.ajax({
                url: "/Trade/DeleteActiveTrade?ID=" + TransactionId + "&userid=" + UserID,
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