$(document).ready(function () {

    intervalWatchList = setInterval(function () { SetTradeDataForRefresh(); }, 1000);

    $('#backbtn').css('color', '#fff');
    $('#backbtn').on('click', function () {
        window.location.href = "/Trade/Order";
    });
});
function SetTradeDataForRefresh() {
    $.ajax({
        url: "/Trade/SetActiveTradeDataForNewUI",
        type: "POST",
        data: { ActiveTradeId: $('#ActiveTradeId').val() },
        success: function (data) {
            if (data != null) {
                data = JSON.parse(data);
                if (data.ActiveTrade.length > 0) {
                    var item = data.ActiveTrade[0];
                    $('#LTP').text(item.ObjScriptDTO.LastPrice);
                    $('#lblLastPrice').text(item.ObjScriptDTO.LastPrice);
                    $('#AVG').text(item.OrderPrice);
                    $('#CurrentPositionNew').text(item.CurrentPositionNew);
                    $('#TriggerPrice').text(item.TriggerPrice);
                    $('#ProfitOrLoss').text(item.ProfitOrLoss);
                    $('#SL').text(item.SL);
                    $('#TGT2').text(item.TGT2);
                    $('#TGT3').text(item.TGT3);
                    $('#TGT4').text(item.TGT4);
                    $('#TIME').text(item.OrderDate + ' ' + item.OrderTime);
                    $('#ProductType').text(item.ProductType);
                    $('#IsLive').text(item.IsLive);
                    $('#StrategyName').text(item.StrategyName);
                    $('#WatchListName').text(item.WatchListName);


                    var symbolParam = '\'' + item.TradeSymbol + '\'';
                    var ScriptInstrumentType = '\'' + item.ScriptInstrumentType + '\'';
                    var productType = '\'' + item.ProductType + '\'';
                    var priceType = '\'' + item.PriceType + '\'';
                    var pos = '\'' + item.CurrentPosition.toString() + '\'';
                    var st = '\'' + item.Status.toString() + '\'';
                    var ScriptExchange = '\'' + item.ObjScriptDTO.ScriptExchange.toString() + '\'';
                    var buyButton = "";
                    var sellButton = "";
                    var convertButton = "";
                    var RoleId = $("#Role_Id").val();
                    var isManualStaratgy = false;
                    if (item.StrategyName == "Manual")
                        isManualStaratgy = true;

                    var currentPosition = item.CurrentPosition;
                    var buyorsell = 2;
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
                    var GetQtyType = item.TRADING_UNIT.toLowerCase() == "qty" ? 'U' : '';
                    $('#sQty').text(sQty + GetQtyType);
                    var editButton = "";
                    var syncButton = "";
                    var addbutton = "";
                    var RejectedOrderDeleteBtn = "";

                    if (item.Status.toUpperCase() != "REJECTED") {
                        if (item.CurrentPositionNew == "BUY")
                            buyorsell = 1;
                        editButton = ' <button class="btn btn-primary btn-sm" onclick="buySellPopUp(' + item.ScriptCode + ',' + buyorsell + ',' + symbolParam + ',' + item.WID + ',' + item.OrderPrice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + sQty + ',' + item.ObjScriptDTO.ScriptLotSize + ',' + item.TriggerPrice + ',' + item.SLNew + ',' + item.TGNew + ',' + priceType + ',' + productType + ',' + item.ActiveTradeID + ',' + st + ',' + item.ENABLE_AUTO_TRAILING + ')" type="button"><i class="fa fa-pencil btn-action"></i></button> ';
                        buyButton = ' <button class="btn btn-primary btn-sm" onclick="SquareOff(' + item.ActiveTradeID + ',' + pos + ',' + st + ',' + sQty + ',' + isManualStaratgy + ')" type="button">Sqr Off</button> ';
                        sellButton = ' <button class="btn btn-danger btn-sm btn-sell" onclick="SquareOff(' + item.ActiveTradeID + ',' + pos + ',' + st + ',' + sQty + ',' + isManualStaratgy + ')" type="button">Sqr Off</button> ';
                        if (item.ProductType == "MIS")
                            convertButton = ' <button title="Convert MIS to CNC" class="btn btn-primary btn-sm" onclick="convertButton(' + item.ActiveTradeID + ',' + pos + ',' + st + ',' + sQty + ',' + isManualStaratgy + ')" type="button"><i class="fa fa-exchange"></i></button> ';
                        if (item.Status.toUpperCase() != "OPEN" && isManualStaratgy)
                            addbutton = '<button class="btn btn-primary btn-sm btn-sell" onclick="AddQty(' + item.ActiveTradeID + ',' + pos + ',' + st + ')" type="button"><i class="fa fa-plus btn-action"></i></button>';

                    }
                    if (item.Status.toUpperCase() == "REJECTED") {
                        RejectedOrderDeleteBtn = '<button onclick = "DeleteRejectedTrade(' + item.ActiveTradeID + ')" type = "button" class="btn btn-warning btn-sm btn-delete" > <i class="fa fa-trash-o btn-action"></i></button >';
                    }
                    if (item.CurrentPositionNew == "BUY") {
                        currentPosition = sellButton;
                    }
                    else if (item.CurrentPositionNew == "SELL") {
                        currentPosition = buyButton;
                    }

                    var deleteButton = ' <a href="javascript:void(0)" id="' + item.ActiveTradeID + '" data-tradeId="' + item.ActiveTradeID + '" class="delete-prompt"><button type="button" class="btn btn-danger btn-sm"><i class="fa fa-trash-o btn-action"></i></button></a> ';
                    var actionButton = editButton + syncButton + addbutton + RejectedOrderDeleteBtn + convertButton;

                    if (parseInt(RoleId) == 2 && item.IsCopyTradeFlag == true) {
                        actionButton = "-";
                        currentPosition = "-";
                    }
                    $(".actionbtns").html(currentPosition + ' ' + actionButton);

                }
            }
        }
    });
}
var addQtyModal = $("#addQtyModal");
function AddQty(id, param, st) {
    $(addQtyModal).find(".sqMsg").text('');
    $(addQtyModal).find('#btnProceedAddQty').removeAttr('disabled');
    $(addQtyModal).find("input[name=sqActiveTradeId]").val(id);
    $(addQtyModal).find("input[name=sqStatus]").val(st);
    $(addQtyModal).find("input[name=sqParam]").val(param);
    $(addQtyModal).find("input[name=sqQty]").val('1');
    $(addQtyModal).modal('show');
}
function ProceedAddQty() {
    $(addQtyModal).find(".sqMsg").text('');
    var sqQty = $(addQtyModal).find("input[name=sqQty]").val();

    var intQty = 0;
    if (sqQty != '' && sqQty != '0') {
        intQty = parseInt(sqQty, 10);

    }
    else {
        $(addQtyModal).find('#btnProceedAddQty').removeAttr('disabled');
        $(addQtyModal).find(".sqMsg").text('Invalid Qty');
        return false;
    }
    var id = $(addQtyModal).find("input[name=sqActiveTradeId]").val();
    var st = $(addQtyModal).find("input[name=sqStatus]").val();
    var param = $(addQtyModal).find("input[name=sqParam]").val();
    var request = $.ajax({
        url: "/Trade/AddQtyToActiveTrade",
        type: "POST",
        data: { ID: id, actionParam: param, status: st, qty: intQty },
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


            return false;
        }
    });
    $(addQtyModal).find('#btnProceedAddQty').removeAttr('disabled');
    $(addQtyModal).modal('hide');
}

function DeleteRejectedTrade(data) {
    var result = confirm("Are you sure you want to delete?");
    if (result) {
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
}
var sqModal = $("#sqOfModal");
function SquareOff(id, param, st, qty, isManualStaratgy) {
    var companyInitials = $("#CompanyInitial").val();
    if (companyInitials == "EXPO2") {
        $(sqModal).find(".sqMsg").text('');
        $(sqModal).find("input[name=sqQty]").val(qty);
        $(sqModal).find("input[name=hdQty]").val(qty);
        $(sqModal).find("input[name=sqActiveTradeId]").val(id);
        $(sqModal).find("input[name=sqStatus]").val(st);
        $(sqModal).find("input[name=sqParam]").val(param);
        ProceedSqOf();
    }
    else {
        $(sqModal).find(".sqMsg").text('');
        $(sqModal).find("input[name=sqQty]").val(qty);
        $(sqModal).find("input[name=hdQty]").val(qty);
        $(sqModal).find("input[name=sqActiveTradeId]").val(id);
        $(sqModal).find("input[name=sqStatus]").val(st);
        $(sqModal).find("input[name=sqParam]").val(param);
        if (isManualStaratgy)
            $(sqModal).modal('show');
        else if (confirm("Are you sure to square off?"))
            ProceedSqOf();
    }
}

function ProceedSqOf() {
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
        data: { ID: id, actionParam: param, status: st, qty: intQty },
        dataType: 'json',
        traditional: true,
        success: function (data) {
            var results = JSON.parse(data);
            if (results.exceptionDTO.id == 1) {
                toastr.success(results.exceptionDTO.Msg);
                window.location.href = "/Trade/Order";
            }
            else if (results.exceptionDTO.id == 0) {
                toastr.error(results.exceptionDTO.Msg);
            }
            else if (results.exceptionDTO.id == 2) {
                toastr.error(results.exceptionDTO.Msg);
            }


            return false;
        }
    });
    $('#btnProceedSquareOff').removeAttr('disabled');
    $(sqModal).modal('hide');
}

// manoj start

var convertMisToCncModal = $("#convertMisToCncModal");

function ConvertMISToCNC() {
    var id = $(convertMisToCncModal).find("input[name=convertActiveTradeId]").val();
    var st = $(convertMisToCncModal).find("input[name=convertStatus]").val();
    var param = $(convertMisToCncModal).find("input[name=convertParam]").val();
    var intQty = $(convertMisToCncModal).find("input[name=hdQty]").val();
    var request = $.ajax({
        url: "/Trade/ConvertMisToCnc",
        type: "POST",
        data: { ID: id, actionParam: param, status: st, qty: intQty },
        dataType: 'json',
        traditional: true,
        success: function (data) {
            var results = JSON.parse(data);
            $("#errorModal .modal-body").html('<p class="text-success">' + results.exceptionDTO.Msg + '</p>');
            $("#errorModal").modal('show');
            return false;
        }
    });
    $('#btnconvertMisToCnc').removeAttr('disabled');
    $(convertMisToCncModal).modal('hide');
    $('#btnconvertMisToCnc').on('click', function (){
        alert("Converted Successfully");
    });
}

function convertButton(id, param, st, qty, isManualStaratgy) {
    //$(convertMisToCncModal).find(".convertMsg").text('Are you sure to convert MIS to CNC?');
    $(convertMisToCncModal).find("input[name=convertQty]").val(qty);
    $(convertMisToCncModal).find("input[name=hdQty]").val(qty);
    $(convertMisToCncModal).find("input[name=convertActiveTradeId]").val(id);
    $(convertMisToCncModal).find("input[name=convertStatus]").val(st);
    $(convertMisToCncModal).find("input[name=convertParam]").val(param);
    if (isManualStaratgy)
        $(convertMisToCncModal).modal('show');
    else if (confirm("Are you sure to square off?"))
        ConvertMISToCNC();
}

//end



function buySellPopUp(ScriptCode, no, ScriptSymbol, Wid, price, instumentType, ScriptExchange, Quantity = 1, ScriptLotSize = 1, Triggerprice = 0, SL = 0, Target = 0, PriceType = '', producttype = '', TradeID = 0, sttus = '', ENABLE_AUTO_TRAILING = 0) {
    $('.upperClause :input').removeAttr('disabled');
    $('#btnProceedBuySell').removeAttr('disabled');
    $("#Price").removeClass("has-error");
    $('#buySellModel .modal-title').css("color", "#fff");
    $('#buySellModel #Terror').hide();
    $('#buySellModel #Quantity-error').hide();

    $("#buySellModel #hdnScriptExchange").val(ScriptExchange);
    $("#buySellModel #hdnScriptLotSize").val(ScriptLotSize);

    if (ENABLE_AUTO_TRAILING == 1) {
        $("#cbxAutoBinanceSlTrail").prop('checked', true);
    }
    else {
        $("#cbxAutoBinanceSlTrail").prop('checked', false);
    }
    var companyInitials = $("#CompanyInitial").val();
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
    var CurrentPosition = "";
    if (no == 1) {
        CurrentPosition = 'BUY';
        $('#buySellModel .modal-title').css("background-color", "#31af38 ");
        $('#buySellModel #btnProceedBuySell').css("background-color", "#31af38 ");
        $('#buySellModel #btnProceedBuySell').css("color", "#fff");
        $('#buySellModel #btnProceedBuySell').text("BUY");

    }
    else if (no == 2) {
        CurrentPosition = 'SELL';
        $('#buySellModel .modal-title').css("background-color", "#dd4b39");
        $('#buySellModel #btnProceedBuySell').css("background-color", "rgb(221, 75, 57)");
        $('#buySellModel #btnProceedBuySell').css("color", "#fff");
        $('#buySellModel #btnProceedBuySell').text("SELL");
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
        $('#Itype').text('NRML')
    }
    else {
        $('#rbtnNrml').val('CNC');
        $('#Itype').text('CNC')
    }
    $("#rbtnMarket").prop('checked', true);
    $('#rbtnNrml').prop('checked', true);

    if (PriceType != null && PriceType != '') {
        if (PriceType == 'MARKET') {
            $('input[name=MarketType]#rbtnMarket').trigger('click');
        } else if (PriceType == 'LIMIT') {
            $('input[name=MarketType]#rbtnLimit').trigger('click');
        }
        else if (PriceType == 'SL') {
            $('input[name=MarketType]#rbtnSL').trigger('click');
        }
        else if (PriceType == 'SL-M') {
            $('input[name=MarketType]#rbtnSLM').trigger('click');
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
    if (PriceType == null || PriceType == '') {
        $('#buySellModel #Price').attr('disabled', 'disabled');
        $('#buySellModel #TriggerPrice').attr('disabled', 'disabled');
    }
    $('#buySellModel').modal({
        backdrop: false,
        show: true
    });


    $("body").removeClass('modal-open');
    $("#hdnSt").val(sttus);
    //$("#buySellModel").modal('show');
    //ProceedBuySell();
}

function ProceedBuySell() {
    var quantity = $("#Quantity").val();
    if (quantity < 0.01) {
        toastr.error("Invalid Qty");
        return;
    }
    var iscbxAutoBinanceSlTrailEnabled = 0;
    if ($("#cbxAutoBinanceSlTrail").prop('checked') == true) {
        iscbxAutoBinanceSlTrailEnabled = 1;
    }
    else {
        iscbxAutoBinanceSlTrailEnabled = 0;
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
    var productType = $('input[name=ProductType]:checked').val();
    var marketType = $('input[name=MarketType]:checked').val();
    if (ScriptCode == null || ScriptCode == "" ||
        CurrentPosition == null || CurrentPosition == "") {
        alert("Please enter correct details");
        return;
    }

    //if (scriptExchange == "NFO") {
    //    var fQty = parseFloat(quantity);

    //    var fLotSize = parseFloat(scriptLotSize);
    //    var remainder = fQty % fLotSize;
    //    if (remainder > 0) {
    //        $('#Quantity-error').text('Invalid Quantity');
    //        $('#Quantity-error').show();
    //        $('#btnProceedBuySell').removeAttr('disabled');
    //        return;
    //    }


    //}
    if (marketType == "SL" || marketType == "SL-M") {
        var oprice = parseFloat(price);
        var tprice = parseFloat(triggerPrice);
        var hdprice = $('#buySellModel #hdnPrice').val();
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
        var hdprice = $('#buySellModel #hdnPrice').val();
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

    if (ScriptCode > 0 && intWID > 0 && quantity != '' && quantity != '0') {
        var request = $.ajax({
            url: "/Trade/ProceedBuySell",
            type: "POST",
            data: { intWID: intWID, ScriptCode: ScriptCode, CurrentPosition: CurrentPosition, allUsers: false, target: target, stopLoss: stopLoss, Quantity: quantity, Price: price, TriggerPrice: triggerPrice, ProductType: productType, MarketType: marketType, TradeID: tradeID, Status: st, iscbxAutoBinanceSlTrailEnabled: iscbxAutoBinanceSlTrailEnabled },
            dataType: 'json',
            async: true,
            success: function (data) {
                var results = JSON.parse(data);

                if (results.IsError) {

                    HidePopUp();
                    $("#errorModal .modal-body").html('<p class="text-danger">' + results.TypeName + '</p>')
                    $("#errorModal").modal('show');
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
function HidePopUp() {
    $("#buySellModel").modal('hide');
}
