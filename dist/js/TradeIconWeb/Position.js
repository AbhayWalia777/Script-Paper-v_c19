var ActiveTradeInterval;
var allowedTradingUnit;
var companyInitials;
$(document).ready(function () {
    companyInitials = $("#CompanyInitial").val();
    allowedTradingUnit = JSON.parse($("#TradingUnitAccess").val());
    $('.blank1').select2({
        placeholder: "Segment",
        allowClear: true
    });
    $('.blank2').select2();

    $('#UserIdsSubBroker').select2({
        placeholder: "Select Sub Broker",
        allowClear: true
    });

    $('#UserIdsAllUserS').select2({
        placeholder: "Client",
        allowClear: true
    });

    $('#TblPositionList').DataTable({
        "paging": true,
        "lengthChange": false,
        "info": false,
        "searching": true,
        "responsive": true,
        columnDefs: [
            { orderable: false, targets:[0] }
        ]
    });

    $('#btnGetPosition').click(function () {
        LoadData();
    });
    $('#btnClosePosition').click(function () {
        var result = confirm("Are you sure want to close all position?");
        if (result) {
            SqrOffChecked();
        }
    });
    $('#btnDismiss').click(function () {
        toastr.error("Qty must be <= (pos qty + pending order qty).");
    });
    $('#chkTable').click(function () {
        //var table = document.getElementById("TblPositionListBody");
        //var i = 0;
        //while (i < table.rows.length) {
        //    $(table.rows[i].cells[0]).find('input[type="checkbox"]').prop('checked', this.checked);
        //    i++;
        //}

        //$('input[type="checkbox"]').each(function () {
        //    $(this).prop('checked', false);
        //});
        $('.CheckBoxTrades').prop('checked', this.checked);
    });

    $('#UserIdsSubBroker').val(null).trigger('change');
    $('#UserIdsAllUserS').val(null).trigger('change');

    $('input[name=MarketType]').on('change', function (ele) {
        var value = $(ele.currentTarget).val();
        var priceval = $('#hdnPrice').val();
        var TotalNrmlQty = $("#TotalNrmlQty").text();
        var Triggerval = $('#TriggerPrice').val();
        TotalNrmlQty = TotalNrmlQty > 0 ? TotalNrmlQty : TotalNrmlQty * -1;
        if (value == 'LIMIT') {
            $('#Price').removeAttr('disabled');
            $('#Price').removeAttr('readonly');
            $('#Price').val(priceval);
            $('#TriggerPrice').val('0');
            $('#TriggerPrice').attr('disabled', 'disabled');
            $("#Quantity").val(TotalNrmlQty.toString());
        }
        else if (value == 'SL') {
            $('#Price').removeAttr('disabled');
            $('#Price').removeAttr('readonly');
            $('#Price').val(priceval);
            $('#TriggerPrice').val(Triggerval);
            $('#TriggerPrice').removeAttr('disabled');
            $('#TriggerPrice').removeAttr('readonly');
            $("#Quantity").val(TotalNrmlQty.toString());
        }
        else if (value == 'SL-M') {
            $('#TriggerPrice').removeAttr('disabled');
            $('#TriggerPrice').removeAttr('readonly');
            $('#TriggerPrice').val(Triggerval);
            $('#Price').val('0');
            $('#Price').attr('disabled', 'disabled');
            $("#Quantity").val(TotalNrmlQty.toString());
        }
        else if (value == 'MARKET') {
            $('#Price').val('0');
            $('#Price').attr('disabled', 'disabled');
            $('#TriggerPrice').val('0');
            $('#TriggerPrice').attr('disabled', 'disabled');
            $("#Quantity").val(TotalNrmlQty.toString());
        }
        NumOfLots();
    });
});

$(document).on('change', '#UserIdsSubBroker', function () {
    if ($('#UserIdsSubBroker option:selected').text() != "")
        $('#UserIdsAllUserS').val(null).trigger('change');
});
$(document).on('change', '#UserIdsAllUserS', function () {
    if ($('#UserIdsAllUserS option:selected').text() != "")
        $('#UserIdsSubBroker').val(null).trigger('change');
});

function show() {
    var checkbox = document.getElementById('chkbox');
    if (checkbox.checked == true) {
        $('#datepicker').show();
    }
    else if (checkbox.checked != true) {
        $('#datepicker').hide();
    }
}

function text(x) {
    if (x == 1) {
        $('#btnClosePosition').css("visibility", "initial");
    }
    else {
        $('#btnClosePosition').css("visibility", "hidden");
    }
    return;
}

function LoadData() {
    var IsAdminWise = document.getElementById('rdSelfSummary').checked == true ? 0 : 1;
    var UserId = 0;
    if ($('#UserIdsSubBroker option:selected').text() != "") {
        UserId = $('#UserIdsSubBroker option:selected').val();
        IsAdminWise = 0;
    }
    if ($('#UserIdsAllUserS option:selected').text() != "") {
        UserId = $('#UserIdsAllUserS option:selected').val();
        IsAdminWise = 0;
    }


    var Tempscriptname = $('#Drp-Segment option:selected').text() != "" ? $('#Drp-Segment').val() : "";
    var scriptExchange = $('#Drp-Segment option:selected').text() != "" ? Tempscriptname.split('>')[0] : "";
    var ScriptInstumentType = $('#Drp-Segment option:selected').text() != "" ? Tempscriptname.split('>')[1] : "";
    var orderdate = document.getElementById('RbtnDayWise').checked == true ? "OrderDate" : "";
    var OpenTrades = document.getElementById('rbtnAll').checked == true ? "" : "OPEN";
    var startDate = $('#DrpDate').val() == "" ? "" : $('#DrpDate').val();
    var input = { 'tradetype': 0, 'ActiveTradeId': 0, 'ScriptExchange': scriptExchange, 'scriptInstrumentType': ScriptInstumentType, 'OrderDate': orderdate, 'OpenTrades': OpenTrades, 'IsAdminWise': IsAdminWise, 'userID': UserId, 'startDate': startDate };
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
    var TotalProfitLoss = 0;
    var TblTradesList = $('#TblPositionList').DataTable();
    TblTradesList.clear().draw();
    TblTradesList.innerHTML = "";
    if (results != null) {
        if (results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                TotalProfitLoss += result.ProfitOrLoss;
                GetActiveResult(result);
                //result.Is_DataInCompleted == false ? setActiveresultdata(result) : setActiveCompletedresultdata(result);
            }
            $('#TheadCbk').removeClass('sorting_asc');
        }
    }
    var html = TotalProfitLoss > 0 ? '<span style="color:dodgerblue">' + TotalProfitLoss.toFixed(2) + '</span>' : '<span style="color:orangered">' + TotalProfitLoss.toFixed(2) + '</span>';
    $('#txtTotalPL').html(html);
}
function GetActiveResult(item) {
    var OutputQty;
    var totallot;
    var Total_NrmlQty;
    var tempLot;
    var buyButton = "";
    var sellButton = "";
    if (item.StrategyName == "Manual")
        isManualStaratgy = true;
    if (item.TRADING_UNIT_TYPE == 1) {
        OutputQty = item.Qty / item.ObjScriptDTO.ScriptLotSize;
        totallot = (item.ObjScriptDTO.ScriptLotSize) * OutputQty;
        Total_NrmlQty = item.TotalNrmlQty / item.ObjScriptDTO.ScriptLotSize;
        tempLot = item.ObjScriptDTO.ScriptLotSize;
    }
    else {
        if (item.ObjScriptDTO.ScriptLotSize > 10 && item.ObjScriptDTO.ScriptExchange == "MCX" && ((item.COMPANY_INITIAL == "EXPO" && item.TENANT_ID == 51) || (item.COMPANY_INITIAL == "ASR" && item.TENANT_ID == 57) || item.COMPANY_INITIAL == "RVERMA")) {
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
    var UserName = '\'' + item.UserName + '\'';
    var TradeSymbol = '\'' + item.TradeSymbol + '\'';
    var symbolParam = item.TradeSymbol.replace(/'/g, "");
    symbolParam = '\'' + symbolParam + '\'';
    var ScriptInstrumentType = '\'' + item.ScriptInstrumentType + '\'';
    var ScriptExchange = '\'' + item.ObjScriptDTO.ScriptExchange.toString() + '\'';

    var buyButton = 'onclick="buySellPopUp(' + UserName + ',' + TradeSymbol + ','  + Total_NrmlQty + ',' + tempLot + ',' + item.ScriptCode + ',1,' + symbolParam + ',' + item.WID + ',' + item.ObjScriptDTO.LastPrice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + OutputQty + ',' + item.ObjScriptDTO.ScriptLotSize + ')"';
    var sellButton = 'onclick="buySellPopUp(' + UserName + ',' + TradeSymbol + ',' + Total_NrmlQty + ',' + tempLot + ',' + item.ScriptCode + ',2,' + symbolParam + ',' + item.WID + ',' + item.ObjScriptDTO.LastPrice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + OutputQty + ',' + item.ObjScriptDTO.ScriptLotSize + ')"';

    var Action_button = item.CurrentPosition == "BUY" ? sellButton : buyButton;

    $('#TblPositionList').DataTable().row.add([
        item.Qty > 0 && item.Is_DataInCompleted == false ? '<input name="hiddenTradeSymbol" type="hidden" value="' + item.TradeSymbol + '" /><input class="CheckBoxTrades" type="checkbox" value="' + item.UserID + '"/>' : "",
        item.ObjScriptDTO.ScriptExchange + item.ScriptInstrumentType,
        item.UserName,
        item.TradeSymbol,
        item.TotalBuyQty,
        item.OrderPrice,
        item.TotalSellQty,
        item.ObjScriptDTO.LastPrice,
        item.Qty > 0 && item.Is_DataInCompleted == false ? item.Qty + ' (' + (item.Qty / item.ObjScriptDTO.ScriptLotSize) + ')' : 0,
        0,
        item.ObjScriptDTO.Ask,
        item.ProfitOrLoss,
        item.Qty > 0 && item.Is_DataInCompleted == false ? '<a class="fa CrossButton" ' + Action_button + ' style=" padding-bottom: 27px;"></a>' : ""
    ]).draw();

}

function SqrOffChecked() {
    var UserIds = "";
    var TradeSymbols = "";

    var table = document.getElementById("TblPositionListBody");
    var i = 0;
    while (i < table.rows.length) {
        if ($(table.rows[i].cells[0]).find('input[type="checkbox"]').is(':checked') == true) {
            UserIds += $(table.rows[i].cells[0]).find('input:checkbox').val() + ",";
            TradeSymbols += $(table.rows[i].cells[0]).find('input[name=hiddenTradeSymbol]').val() + ",";
        }
        i++;
    }
    if (UserIds.length > 0 && TradeSymbols.length > 0) {

        UserIds = UserIds.slice(0, UserIds.length - 1);
        TradeSymbols = TradeSymbols.slice(0, TradeSymbols.length - 1);
        var request = $.ajax({
            url: "/Trade/SqrOffTradeCapital",
            type: "Get",
            data: { 'userIds': UserIds, 'TradeSymbols': TradeSymbols },
            dataType: 'json',
            traditional: true,
            success: function (data) {
                var results = JSON.parse(data);
                if (results.exceptionDTO.id == 1) {
                    toastr.success(results.exceptionDTO.Msg);
                }
                else if (results.exceptionDTO.id == 0) {
                    toastr.error(results.exceptionDTO.Msg);
                }
                else if (results.exceptionDTO.id == 2) {
                    toastr.error(results.exceptionDTO.Msg);
                }
            }
        });
    }
    else {
        toastr.warning('Please select atleast one trade.');
    }
}

function NumOfLots() {
    var TempQty = $('#Quantity').val();
    var TempLot = $('#tempLotFrontEND').html();
    TempQty = TempQty > 0 ? TempQty : 1;
    TempLot = TempLot > 0 ? TempLot : 1;

    $('#LotTOQtyBuySell').val(TempLot * TempQty);
}

function buySellPopUp(userName, tradeSymbol,  TotalNrmlQty, tempLotFrontEND, ScriptCode, no, ScriptSymbol, Wid, price, instumentType, ScriptExchange, Quantity = 1, ScriptLotSize = 1, Triggerprice = 0, SL = 0, Target = 0, PriceType = '', producttype = '', TradeID = 0, sttus = '') {
    $("#TotalNrmlQty").text(TotalNrmlQty.toString());
    $("#tempLotFrontEND").text(tempLotFrontEND.toString());
    $(".All-MainDiv").css('display', 'none');
    $('#btnProceedBuySell').removeAttr('disabled');
    $("#Price").removeClass("has-error");
    $(' .modal-title').css("color", "#fff");
    $(' #Terror').hide();
    $(' #Quantity-error').hide();
    $('#txtClientName').html(userName);
    $('#txtTradingSymbol').html(tradeSymbol);

    $(" #hdnScriptExchange").val(ScriptExchange);
    $(" #hdnScriptLotSize").val(ScriptLotSize);
    $('#LotTOQtyBuySell').val(ScriptLotSize);
    //debugger;
    var CurrentPosition = "";
    if (no == 1) {
        CurrentPosition = 'BUY';
        $(' .modal-header').css("background-color", "dodgerblue");
        $(' #btnProceedBuySell').css("background-color", "#4987ee");
        $(' #btnProceedBuySell').css("color", "#fff");
        $(' #btnProceedBuySell').text("BUY");
        $(' #hdnBidAsk').val("BUY");

    }
    else if (no == 2) {
        CurrentPosition = 'SELL';
        $(' .modal-header').css("background-color", "#ff4a4a");
        $(' #btnProceedBuySell').css("background-color", "#ff4a4a");
        $(' #btnProceedBuySell').css("color", "#fff");
        $(' #btnProceedBuySell').text("SELL");
        $(' #hdnBidAsk').val("SELL");
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

    $('#rbtnMarket').removeAttr('disabled');
    $("#rbtnMarket").prop('checked', true);
    $(' #Price').val(price);
    $(' #Price').attr('disabled', 'disabled');
    $(' #TriggerPrice').attr('disabled', 'disabled');

    Quantity = TotalNrmlQty;


    Quantity = Quantity > 0 ? Quantity : Quantity * -1;
    $("#Quantity").val(Quantity.toString());
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
        $(' #Price').attr('disabled', 'disabled');
        $(' #TriggerPrice').attr('disabled', 'disabled');
    }

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
    $("#myModal").modal('show');
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
    intWID = $("#Wid").val();
    var target = $("#txtTarget").val();
    var stopLoss = $("#txtStopLoss").val();
    var scriptExchange = $(" #hdnScriptExchange").val();
    var scriptLotSize = $(" #hdnScriptLotSize").val();
    var price = $("#Price").val();
    var triggerPrice = $("#TriggerPrice").val();
    var tradeID = $("#hdnTradeID").val();
    var productType = "NRML";

    var TotalNrmlQty = $("#TotalNrmlQty").text();
    TotalNrmlQty = TotalNrmlQty > 0 ? TotalNrmlQty : TotalNrmlQty * -1;

    if (quantity > TotalNrmlQty) {
        toastr.error('You Can not Sell more then buyed NRML Qty');
        $('#btnProceedBuySell').removeAttr('disabled');
        return;
    }
    var marketType = $('input[name=MarketType]:checked').val();
    if (ScriptCode == null || ScriptCode == "" ||
        CurrentPosition == null || CurrentPosition == "") {
        toastr.error("Please enter correct details");
        return;
    }
    if (((stopLoss != '' && stopLoss != '0') || (target != '' && target != '0'))) {
        var dTarget = parseFloat(target);
        var dStoploss = parseFloat(stopLoss);
        var oprice = parseFloat(price);
        var hdprice = $(' #hdnPrice').val();
        var lastPrice = parseFloat(hdprice);
        if (oprice > 0)
            lastPrice = oprice;

        if ($('#IsTargetStopLossAbsolute').val()=='True') {
            var msg = "";
            if (CurrentPosition == 'BUY') {
                if (dTarget > 0) {
                    if (dTarget < lastPrice)
                        msg = 'Target should be greater than Last price';
                }
                if (dStoploss > 0) {
                    if (dStoploss > lastPrice)
                        msg = 'StopLoss should be less than Last price';
                }

            }
            else {
                if (dTarget > 0) {
                    if (dTarget > lastPrice)
                        msg = 'Target should be less than Last price';
                }
                if (dStoploss > 0) {
                    if (dStoploss < lastPrice)
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
        var tprice = parseFloat(triggerPrice);
        var hdprice = $(' #hdnPrice').val();
        var hdnPrice = parseFloat(hdprice);
        var showError = false;
        var msg = "";

        if (marketType == "SL") {
            if (CurrentPosition == "SELL" && marketType == "SL" && oprice > tprice) {
                showError = true;
                msg = "Trigger price connot be less than order price";
            }
            else if (CurrentPosition == "BUY" && marketType == "SL" && oprice < tprice) {
                showError = true;
                msg = "Trigger price Cannot be higher than order price";
            }
        }
        if (CurrentPosition == "SELL" && tprice > hdnPrice) {
            showError = true;
            msg = "Trigger price Cannot be higher than last price";
        }
        else if (CurrentPosition == "BUY" && tprice < hdnPrice) {
            showError = true;
            msg = "Trigger price connot be less than last price";
        }
        if (showError) {
            toastr.error(msg);
            $('#btnProceedBuySell').removeAttr('disabled');
            return;
        }

    }
    if (marketType == "LIMIT") {
        var oprice = parseFloat(price);
        var hdprice = $(' #hdnPrice').val();
        var hdnPrice = parseFloat(hdprice);
        var showError = false;
        var msg = "";

        if (CurrentPosition == "SELL" && oprice < hdnPrice) {
            showError = true;
            msg = "Limit price Cannot be less than last price";
        }
        else if (CurrentPosition == "BUY" && oprice > hdnPrice) {
            showError = true;
            msg = "Limit price connot be greater than last price";
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
                    if (tradeID != '0') {
                        toastr.success('Order Updated successfully');
                        LoadData();
                    }
                    else {
                        toastr.success('Order Placed successfully');
                        LoadData();
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
    $("#myModal").modal('hide');
}