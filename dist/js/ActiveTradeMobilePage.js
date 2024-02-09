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
        data: { ActiveTradeID: $('#ActiveTradeID').val() },
        success: function (data) {
            if (data != null) {
                data = JSON.parse(data);
                if (data.ActiveTrade.length > 0) {
                    var item = data.ActiveTrade[0];
                    $('#LTP').text(item.ObjScriptDTO.Lastprice);
                    $('#lblLastPrice').text(item.ObjScriptDTO.Lastprice);
                    $('#AVG').text(item.OrderPrice);
                    $('#CurrentPositionNew').text(item.CurrentPositionNew);
                    $('#TriggerPrice').text(item.TriggerPrice);
                    $('#Profitorloss').text(item.Profitorloss);
                    $('#SL').text(item.SL);
                    $('#TGT2').text(item.TGT2);
                    $('#TGT3').text(item.TGT3);
                    $('#TGT4').text(item.TGT4);
                    $('#TIME').text(item.OrderDate + ' ' + item.OrderTime);
                    $('#ProductType').text(item.ProductType);
                    $('#IsLive').text(item.IsLive);
                    $('#Strategyname').text(item.Strategyname);
                    $('#Watchlistname').text(item.Watchlistname);


                    var symbolParam = '\'' + item.TradeSymbol + '\'';
                    var ScriptInstrumentType = '\'' + item.ScriptInstrumentType + '\'';
                    var ProductType = '\'' + item.ProductType + '\'';
                    var PriceType = '\'' + item.PriceType + '\'';
                    var pos = '\'' + item.CurrentPosition.toString() + '\'';
                    var st = '\'' + item.Status.toString() + '\'';
                    var ScriptExchange = '\'' + item.ObjScriptDTO.ScriptExchange.toString() + '\'';
                    var buyButton = "";
                    var sellButton = "";
                    var convertButton = "";
                    var RoleId = $("#Role_Id").val();
                    var isManualStaratgy = false;
                    if (item.Strategyname == "Manual")
                        isManualStaratgy = true;

                    var CurrentPosition = item.CurrentPosition;
                    var BuyOrSell = 2;
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
                    var GetQtyType = item.TRADING_UNIT.toLowerCase() == "Qty" ? 'U' : '';
                    $('#sQty').text(sQty + GetQtyType);
                    var editButton = "";
                    var syncButton = "";
                    var addbutton = "";
                    var RejectedOrderDeleteBtn = "";

                    if (item.Status.toUpperCase() != "REJECTED") {
                        if (item.CurrentPositionNew == "Buy")
                            BuyOrSell = 1;
                        editButton = ' <button class="btn btn-primary btn-sm" onclick="buySellPopUp(' + item.ScriptCode + ',' + BuyOrSell + ',' + symbolParam + ',' + item.WID + ',' + item.OrderPrice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + sQty + ',' + item.ObjScriptDTO.ScriptLotSize + ',' + item.TriggerPrice + ',' + item.SLNew + ',' + item.TGNew + ',' + PriceType + ',' + ProductType + ',' + item.ActiveTradeID + ',' + st + ',' + item.ENABLE_AUTO_TRAILING + ')" type="button"><i class="fa fa-pencil btn-action"></i></button> ';
                        buyButton = ' <button class="btn btn-primary btn-sm" onclick="SquareOff(' + item.ActiveTradeID + ',' + pos + ',' + st + ',' + sQty + ',' + isManualStaratgy + ')" type="button">Sqr Off</button> ';
                        sellButton = ' <button class="btn btn-danger btn-sm btn-Sell" onclick="SquareOff(' + item.ActiveTradeID + ',' + pos + ',' + st + ',' + sQty + ',' + isManualStaratgy + ')" type="button">Sqr Off</button> ';
                        if (item.ProductType == "MIS")
                            convertButton = ' <button title="Convert MIS to CNC" class="btn btn-primary btn-sm" onclick="convertButton(' + item.ActiveTradeID + ',' + pos + ',' + st + ',' + sQty + ',' + isManualStaratgy + ')" type="button"><i class="fa fa-exchange"></i></button> ';
                        if (item.Status.toUpperCase() != "OPEN" && isManualStaratgy)
                            addbutton = '<button class="btn btn-primary btn-sm btn-Sell" onclick="AddQty(' + item.ActiveTradeID + ',' + pos + ',' + st + ')" type="button"><i class="fa fa-plus btn-action"></i></button>';

                    }
                    if (item.Status.toUpperCase() == "REJECTED") {
                        RejectedOrderDeleteBtn = '<button onclick = "DeleteRejectedTrade(' + item.ActiveTradeID + ')" type = "button" class="btn btn-warning btn-sm btn-delete" > <i class="fa fa-trash-o btn-action"></i></button >';
                    }
                    if (item.CurrentPositionNew == "Buy") {
                        CurrentPosition = sellButton;
                    }
                    else if (item.CurrentPositionNew == "Sell") {
                        CurrentPosition = buyButton;
                    }

                    var deleteButton = ' <a href="javascript:void(0)" id="' + item.ActiveTradeID + '" data-tradeId="' + item.ActiveTradeID + '" class="delete-prompt"><button type="button" class="btn btn-danger btn-sm"><i class="fa fa-trash-o btn-action"></i></button></a> ';
                    var actionButton = editButton + syncButton + addbutton + RejectedOrderDeleteBtn + convertButton;

                    if (parseInt(RoleId) == 2 && item.IsCopyTradeFlag == true) {
                        actionButton = "-";
                        CurrentPosition = "-";
                    }
                    $(".actionbtns").html(CurrentPosition + ' ' + actionButton);

                }
            }
        }
    });
}
var addQtyModal = $("#addQtyModal");
function AddQty(id, param, st) {
    $(addQtyModal).find(".sqMsg").text('');
    $(addQtyModal).find('#btnProceedAddQty').removeAttr('disabled');
    $(addQtyModal).find("input[Name=sqActiveTradeID]").val(id);
    $(addQtyModal).find("input[Name=sqStatus]").val(st);
    $(addQtyModal).find("input[Name=sqParam]").val(param);
    $(addQtyModal).find("input[Name=sqQty]").val('1');
    $(addQtyModal).modal('show');
}
function ProceedAddQty() {
    $(addQtyModal).find(".sqMsg").text('');
    var sqQty = $(addQtyModal).find("input[Name=sqQty]").val();

    var intQty = 0;
    if (sqQty != '' && sqQty != '0') {
        intQty = parseInt(sqQty, 10);

    }
    else {
        $(addQtyModal).find('#btnProceedAddQty').removeAttr('disabled');
        $(addQtyModal).find(".sqMsg").text('Invalid Qty');
        return false;
    }
    var id = $(addQtyModal).find("input[Name=sqActiveTradeID]").val();
    var st = $(addQtyModal).find("input[Name=sqStatus]").val();
    var param = $(addQtyModal).find("input[Name=sqParam]").val();
    var request = $.ajax({
        url: "/Trade/AddQtyToActiveTrade",
        type: "POST",
        data: { ID: id, actionParam: param, Status: st, Qty: intQty },
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
function SquareOff(id, param, st, Qty, isManualStaratgy) {
    var Companyinitials = $("#CompanyInitial").val();
    if (Companyinitials == "EXPO2") {
        $(sqModal).find(".sqMsg").text('');
        $(sqModal).find("input[Name=sqQty]").val(Qty);
        $(sqModal).find("input[Name=hdQty]").val(Qty);
        $(sqModal).find("input[Name=sqActiveTradeID]").val(id);
        $(sqModal).find("input[Name=sqStatus]").val(st);
        $(sqModal).find("input[Name=sqParam]").val(param);
        ProceedSqOf();
    }
    else {
        $(sqModal).find(".sqMsg").text('');
        $(sqModal).find("input[Name=sqQty]").val(Qty);
        $(sqModal).find("input[Name=hdQty]").val(Qty);
        $(sqModal).find("input[Name=sqActiveTradeID]").val(id);
        $(sqModal).find("input[Name=sqStatus]").val(st);
        $(sqModal).find("input[Name=sqParam]").val(param);
        if (isManualStaratgy)
            $(sqModal).modal('show');
        else if (confirm("Are you sure to square off?"))
            ProceedSqOf();
    }
}

function ProceedSqOf() {
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
        data: { ID: id, actionParam: param, Status: st, Qty: intQty },
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
    var id = $(convertMisToCncModal).find("input[Name=convertActiveTradeID]").val();
    var st = $(convertMisToCncModal).find("input[Name=convertStatus]").val();
    var param = $(convertMisToCncModal).find("input[Name=convertParam]").val();
    var intQty = $(convertMisToCncModal).find("input[Name=hdQty]").val();
    var request = $.ajax({
        url: "/Trade/ConvertMisToCnc",
        type: "POST",
        data: { ID: id, actionParam: param, Status: st, Qty: intQty },
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

function convertButton(id, param, st, Qty, isManualStaratgy) {
    //$(convertMisToCncModal).find(".convertMsg").text('Are you sure to convert MIS to CNC?');
    $(convertMisToCncModal).find("input[Name=convertQty]").val(Qty);
    $(convertMisToCncModal).find("input[Name=hdQty]").val(Qty);
    $(convertMisToCncModal).find("input[Name=convertActiveTradeID]").val(id);
    $(convertMisToCncModal).find("input[Name=convertStatus]").val(st);
    $(convertMisToCncModal).find("input[Name=convertParam]").val(param);
    if (isManualStaratgy)
        $(convertMisToCncModal).modal('show');
    else if (confirm("Are you sure to square off?"))
        ConvertMISToCNC();
}

//end



function buySellPopUp(ScriptCode, no, ScriptSymbol, WID, price, instumentType, ScriptExchange, Quantity = 1, ScriptLotSize = 1, TriggerPrice = 0, SL = 0, Target = 0, PriceType = '', ProductType = '', TradeID = 0, sttus = '', ENABLE_AUTO_TRAILING = 0) {
    $('.upperClause :input').removeAttr('disabled');
    $('#btnProceedBuySell').removeAttr('disabled');
    $("#price").removeClass("has-error");
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
    var CurrentPosition = "";
    if (no == 1) {
        CurrentPosition = 'Buy';
        $('#buySellModel .modal-title').css("background-color", "#31af38 ");
        $('#buySellModel #btnProceedBuySell').css("background-color", "#31af38 ");
        $('#buySellModel #btnProceedBuySell').css("color", "#fff");
        $('#buySellModel #btnProceedBuySell').text("Buy");

    }
    else if (no == 2) {
        CurrentPosition = 'Sell';
        $('#buySellModel .modal-title').css("background-color", "#dd4b39");
        $('#buySellModel #btnProceedBuySell').css("background-color", "rgb(221, 75, 57)");
        $('#buySellModel #btnProceedBuySell').css("color", "#fff");
        $('#buySellModel #btnProceedBuySell').text("Sell");
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
    if (PriceType == null || PriceType == '') {
        $('#buySellModel #price').attr('disabled', 'disabled');
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
    var ProductType = $('input[Name=ProductType]:checked').val();
    var marketType = $('input[Name=MarketType]:checked').val();
    if (ScriptCode == null || ScriptCode == "" ||
        CurrentPosition == null || CurrentPosition == "") {
        alert("Please enter correct details");
        return;
    }

    //if (ScriptExchange == "NFO") {
    //    var fQty = parseFloat(quantity);

    //    var fLotSize = parseFloat(ScriptLotSize);
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

    if (ScriptCode > 0 && intWID > 0 && quantity != '' && quantity != '0') {
        var request = $.ajax({
            url: "/Trade/ProceedBuySell",
            type: "POST",
            data: { intWID: intWID, ScriptCode: ScriptCode, CurrentPosition: CurrentPosition, allUsers: false, target: target, stopLoss: stopLoss, Quantity: quantity, price: price, TriggerPrice: TriggerPrice, ProductType: ProductType, MarketType: marketType, TradeID: tradeID, Status: st, iscbxAutoBinanceSlTrailEnabled: iscbxAutoBinanceSlTrailEnabled },
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
function HidePopUp() {
    $("#buySellModel").modal('hide');
}
