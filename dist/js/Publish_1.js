$(document).ready(function () {
    //$('input', 'form').blur(function () {
    //    $(this).valid();
    //});
    // Make the fields readonly on page load
    $("#EntryOverallMargin, #ExitOverallMargin").prop("readonly", true);

    $("#Multiplier").on("input", function () {
        var multiplier = parseInt($(this).val()) || 0; // Get the multiplier value

        var stopLoss = multiplier * 1200;  // Formula for StopLoss
        var target = multiplier * 2850;   // Formula for Target

        $("#EntryOverallMargin").val(stopLoss); // Update EntryOverallMargin
        $("#ExitOverallMargin").val(target);    // Update ExitOverallMargin
    });

    var valstra = $('#strategyID').val();
    var validValues = [65, 111, 112, 70, 77, 79, 81, 85, 87, 88, 90, 101, 102, 103, 104, 105, 106, 113, 114, 115, 116, 117, 118, 119, 120];
    if (validValues.includes(parseInt(valstra))) {
        GetDefaultBankNiftyWatchlist();

    }
    if ($("#hdnShwMessage").val() != '') {
        var Modelhtml = '<div class="modal fade" id="myPublishModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header alert alert-danger"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="myModalLabel">Info</h4></div><div class="modal-body"><p id="pmessage" class="success-message">Are you sure you wish to delete this record ?  </p></div><div class="modal-footer"><button id="btnCancel" class="btn btn-success" data-dismiss="modal">Ok</button></div></div></div></div>';
        $("#mainWindow").append(Modelhtml);
        $("#myPublishModal .modal-header").removeClass(' ');
        $('#myPublishModal .delete-confirm').css('display', 'inline-block');
        $('#myPublishModal .success-message').html('').html($("#hdnShwMessage").val());


        $('#myPublishModal').modal('show');
    }
    checkStrategy(false);
    $('#strategyID').on('change', function () {
        var valstra = $('#strategyID').val();
        var validValues = [65, 111, 112, 70, 77, 79, 81, 85, 87, 88, 90, 101, 102, 103, 104, 105, 106, 113, 114, 115, 116, 117, 118, 119, 120];
        if (validValues.includes(parseInt(valstra))) {
            GetDefaultBankNiftyWatchlist();

        }
        checkStrategy(false);
    })
    $('#ddlQuery').on('change', function () {
        var publishID = $("input[name=PublishID]").val();
        //var strategyID = $("#strategyID").val();
        //window.location = "/Publish/ManagePublish/?ID=" + publishID + "&WID=0&strategyID=" + strategyID + "&SelectedQueryID=" + $(this).val() + "&publishName=" + $("#txtpublishname").val() + "&orbTime=" + $("#ORBTime").val() + "&period=" + $("#Period").val() + "&multiplier=" + $("#Multiplier").val();
        GetWatchListScripts(0, $(this).val(), publishID);

    })
    $('#ddlWatchlist').on('change', function () {
        var publishID = $("input[name=PublishID]").val();
        //var strategyID = $("#strategyID").val();
        //window.location = "/Publish/ManagePublish/?ID=" + publishID + "&SelectedQueryID=0&strategyID=" + strategyID + "&WID=" + $(this).val() + "&publishName=" + $("#txtpublishname").val() + "&orbTime=" + $("#ORBTime").val() + "&period=" + $("#Period").val() + "&multiplier=" + $("#Multiplier").val();
        $("input[name=WatchListID]").val($(this).val());
        GetWatchListScripts($(this).val(), 0, publishID);

    })
    $('#btnAddWatchList').on('click', function () {
        var selectedValue = $("#ddlWatchlist option:selected").val();
        if (selectedValue == null || selectedValue == '') {
            window.location.href = "/WatchList/AddWatchList?ID=0";
        }
        else {
            window.location.href = "/WatchList/AddWatchList?ID=" + selectedValue;
        }
    });
    function GetDefaultBankNiftyWatchlist() {
        var request = $.ajax({
            url: "/Publish/GetBankNiftyWatchlistResult",
            type: "GET",
            data: {},

            success: function (data) {
                var htmlString = '<option value="">--Select--</option>';

                $.map(data, function (i, e) { htmlString += '<option value="' + i.WID + '">' + i.Watchlistname + '</option>' });
                $('#ddlWatchlist').html(htmlString);
                $("#ddlWatchlist").val(updateWID);
            }
        });
    }
    function GetWatchListScripts(WID, SelectedQueryID, ID) {
        checkStrategy(true);
    }
    function checkStrategy(IsChangeWatchlist) {
        var sID = $('#strategyID option:selected').val();
        var StratgyID = parseInt(sID, 10);
        if (($('#strategyID option:selected')).text().toLowerCase() == 'orb' || ($('#strategyID option:selected')).text().toLowerCase() == 'orbr' || ($('#strategyID option:selected')).text().toLowerCase() == 'manual' || ($('#strategyID option:selected')).text().toLowerCase() == 'query builder' || ($('#strategyID option:selected')).text().toLowerCase() == 'supertrend' || StratgyID > 64) {
            $('#dvIsReversal').show();
            $('#dvTimeControl').show();
            $('#dvPeriodControl').hide();
            $('#dvMultiplierControl').hide();
            $('#dvSlowLengthControl').hide();
            $('#dvSignalLengthControl').hide();
            $('#dvSmoothKControl').hide();
            $('#dvSmoothDControl').hide();
            $('#dvEntryOverallMargin').hide();
            $('#divUpperLimit').hide();
            $('#divLowerLimit').hide();
            $('#divStopLossPercentage').hide();
            $('#dvExitOverallMargin').hide();
            $('#dvTotalOverallMargin').hide();
            $('#dvAmaanStrategy').hide(); $('.dvShashiShant').hide(); $('#dvBinanceStrategy').hide();
            //$('#tblORB').show();
            // $('#tblList tbody').empty();
            //$("#tblList tbody").find("input,button,textarea,select").attr("disabled", "disabled");
            $('#tableMystical').hide();
            $('#dvMinutesLebal').show();
            $('#ddlQuery').removeAttr('required');
            $('#dvQueryBuilder').hide();
            $('#tblORB').hide();
            $('#dvIsSignalTradeCandle').hide();
            $('#dvTSL').hide();
            $('#dvUMAStrategy').hide();
            if (($('#strategyID option:selected')).text().toLowerCase() == 'manual') {
                $('#dvTimeControl').hide();
                $('#tblORB').show();
            }
            else if (($('#strategyID option:selected')).text().toLowerCase() == 'query builder') {
                $('#dvTimeControl').hide();
                $('#ddlQuery').attr("required", "required");
                $('#dvTimeControl .timeIntervaldd').val('1');
                $('#dvQueryBuilder').show();
                $('#dvWatchlist').hide();
                $('#tblORB').show();
                $('#dvIsReversal').hide();
            }
            //if (($('#strategyID option:selected')).text().toLowerCase() != 'query builder') {
            //    $('#dvWatchlist').show();
            //    $('#tblORB').show();
            //}
            if (StratgyID == 65) {
                $('#dvPeriodControl').show();
                $('#dvEntryOverallMargin').show();
                $('#dvExitOverallMargin').show();
                $('#dvMultiplierControl').show();
                $('#tableMystical').hide();
                $('#tblORB').show();
                $('#dvTSL').show();

            }
            if (StratgyID == 70) {
                $('#dvPeriodControl').show();
                $('#dvSlowLengthControl').show();
                $('#dvSignalLengthControl').show();
                $('#tableMystical').hide();
                $('#tblORB').hide();
                $('#dvEntryOverallMargin').show();
                $('#dvExitOverallMargin').show();
                $('#dvMultiplierControl').show();
                $('#dvTSL').hide();
                $('#dvIsReversal').show();

            }
            if (StratgyID == 101 || StratgyID == 102 || StratgyID == 114) {
                $('#dvPeriodControl').hide();
                $('#dvEntryOverallMargin').show();
                $('#dvExitOverallMargin').show();
                $('#dvMultiplierControl').show();
                $('#tableMystical').hide();
                $('#tblORB').hide();
                $('#dvTimeControl').hide();
                $('#dvTSL').show();
                $('#dvIsReversal').show();

            }
            if (StratgyID == 111 || StratgyID == 112 || StratgyID == 113) {
                $('#dvPeriodControl').hide();
                $('#dvEntryOverallMargin').show();
                $('#dvExitOverallMargin').show();
                $('#dvMultiplierControl').show();
                $('#tableMystical').hide();
                $('#tblORB').hide();
                $('#dvTimeControl').hide();
                $('#dvTSL').show();
                $('#dvIsReversal').hide();

            }
            if (StratgyID == 67 || StratgyID == 68 || StratgyID == 69 || StratgyID == 71) {

                $('#dvPeriodControl').show();
                $('#tableMystical').hide();
                $('#tblORB').show();
            } if (StratgyID == 81) {

                $('#dvPeriodControl').show();
                $('#dvMultiplierControl').show();
                $('#dvEntryOverallMargin').show();
                $('#dvExitOverallMargin').show();


            }
            if (StratgyID == 70) {
                $('#dvSlowLengthControl').show();
                $('#dvSignalLengthControl').show();
                $('#tableMystical').hide();
                $('#tblORB').show();
            }
            if (StratgyID == 71) {
                $('#dvSmoothKControl').show();
                $('#dvSmoothDControl').show();
                $('#tableMystical').hide();
                $('#tblORB').show();
            }
            if (StratgyID == 75) {
                if (!IsChangeWatchlist) {
                    var parms = $('input[name=StrategyParameters]').val();
                    if (parms != null && parms != '') {

                        var arr = parms.split(';');
                        var stValarr = arr[0].split(':');
                        var stVal = stValarr[1];

                        var stRsiarr = arr[1].split(':');
                        var stRsi = stRsiarr[1];

                        var stMacdarr = arr[2].split(':');
                        var stMacd = stMacdarr[1];

                        var stEmaarr = arr[3].split(':');
                        var stEma = stEmaarr[1];

                        $('#amaanSupertrend').val(stVal);
                        $('#amaanRsi').val(stRsi);
                        $('#amaanMacd').val(stMacd);
                        $('#amaanEMA').val(stEma);

                    }

                }
                $('#dvAmaanStrategy').show();
            }
            if (StratgyID == 76 || StratgyID == 77) {
                $('#dvSmoothKControl').hide();
                $('#dvSmoothDControl').hide();
                $('#tableMystical').hide();
                $('#tblORB').hide();
                $('#dvTimeControl').hide();
                $('#dvMinutesLebal').hide();
                $('#dvEntryOverallMargin').show();
                $('#dvExitOverallMargin').show();
                $('#dvTotalOverallMargin').show();
                $('#dvMultiplierControl').show();
                $('#divUpperLimit').hide();
                $('#divLowerLimit').hide();
                $('#divStopLossPercentage').hide();

            }
            if (StratgyID == 78) {
                $('#dvSmoothKControl').hide();
                $('#dvSmoothDControl').hide();
                $('#tableMystical').hide();
                $('#tblORB').hide();
                $('#dvTimeControl').hide();
                $('#dvMinutesLebal').hide();
                $('#dvEntryOverallMargin').hide();
                $('#dvExitOverallMargin').hide();
                $('#dvTotalOverallMargin').hide();
                $('#dvMultiplierControl').hide();

                $('#divUpperLimit').show();
                $('#divLowerLimit').show();
                $('#divStopLossPercentage').show();

            }
            if (StratgyID == 79 || StratgyID == 88) {
                $('#dvSmoothKControl').hide();
                $('#dvSmoothDControl').hide();
                $('#tableMystical').hide();
                $('#tblORB').hide();
                $('#dvTimeControl').show();
                $('#dvMinutesLebal').hide();
                $('#dvEntryOverallMargin').hide();
                $('#dvExitOverallMargin').hide();
                $('#dvTotalOverallMargin').hide();
                $('#dvMultiplierControl').show();
                $('.dvShashiShant').show();
                $('#divUpperLimit').show();
                $('#divLowerLimit').show();
                $('#dvTSL').show();
                $('#divStopLossPercentage').hide();

            }
            if (StratgyID == 82 || StratgyID == 84) {
                $('#dvSmoothKControl').hide();
                $('#dvSmoothDControl').hide();
                $('#tableMystical').hide();
                $('#tblORB').hide();
                $('#dvTimeControl').hide();
                $('#dvMinutesLebal').hide();
                $('#dvEntryOverallMargin').hide();
                $('#dvExitOverallMargin').hide();
                $('#dvTotalOverallMargin').hide();
                $('#dvMultiplierControl').hide();
                $('#dvIsReversal').hide();
                var parms = $('input[name=StrategyParameters]').val();
                if (parms != null && parms != '') {

                    var arr = parms.split(';');
                    var stValarr = arr[0].split(':');
                    var stVal = stValarr[1];

                    var stRsiarr = arr[1].split(':');
                    var stRsi = stRsiarr[1];

                    var stMacdarr = arr[2].split(':');
                    var stMacd = stMacdarr[1];

                    var stEmaarr = arr[3].split(':');
                    var stEma = stEmaarr[1];
                    var stLotarr = arr[4].split(':');
                    var stLot = stLotarr[1];
                    var stLotMultarr = arr[5].split(':');
                    var stLotMult = stLotMultarr[1];
                    $('#binanceSetClose').val(stVal);
                    $('#binanceDifference').val(stRsi);
                    $('#binanceRentry').val(stMacd);
                    $('#binanceProfit').val(stEma);
                    $('#binanceLot').val(stLot);
                    $('#binanceLotMultiplier').val(stLotMult);

                }


                $('#dvBinanceStrategy').show();
            }
            if (StratgyID == 85) {
                $('#dvSmoothKControl').hide();
                $('#dvSmoothDControl').hide();
                $('#tableMystical').hide();
                $('#tblORB').hide();
                $('#dvTimeControl').show();
                $('#dvMinutesLebal').hide();
                $('#dvEntryOverallMargin').show();
                $('#dvExitOverallMargin').show();
                $('#dvTotalOverallMargin').hide();
                $('#dvMultiplierControl').hide();
                $('#dvIsReversal').show();
                $('#dvQty').show();
                $('#dvTSL').show();
                $('#dvIsSignalTradeCandle').show();
                var parms = $('input[name=StrategyParameters]').val();
                if (parms != null && parms != '') {

                    var arr = parms.split(';');
                    var stValarr = arr[0].split(':');
                    var stVal = stValarr[1];

                    var stRsiarr = arr[1].split(':');
                    var stRsi = stRsiarr[1];

                    var stMacdarr = arr[2].split(':');
                    var stMacd = stMacdarr[1];



                    $('#UmaSupertrend').val(stVal);
                    $('#UmaRsiLow').val(stRsi);
                    $('#UmaRsiHigh').val(stMacd);



                }


                $('#dvUMAStrategy').show();
            }
            if (StratgyID == 86 || StratgyID == 89 || StratgyID == 91) {
                $('#dvSmoothKControl').hide();
                $('#dvSmoothDControl').hide();
                $('#tableMystical').hide();
                $('#tblORB').hide();
                $('#dvTimeControl').hide();
                $('#dvMinutesLebal').hide();
                if (StratgyID == 86 || StratgyID == 91)
                    $('#dvEntryOverallMargin').show();
                $('#dvExitOverallMargin').show();
                $('#dvTotalOverallMargin').hide();
                $('#dvMultiplierControl').hide();
                $('#dvIsReversal').hide();
                $('#dvQty').hide();
                $('#dvTSL').hide();
                $('#dvIsSignalTradeCandle').hide();
                var parms = $('input[name=StrategyParameters]').val();
                if (parms != null && parms != '') {

                    var arr = parms.split(';');
                    var stValarr = arr[0].split(':');
                    var stVal = stValarr[1];

                    $('#TradingBotBalance').val(stVal);
                    JsonToTable(parms);

                }
                $('.dvTotalCap').show();
            }
            if (StratgyID == 87) {
                $('#dvSmoothKControl').hide();
                $('#dvSmoothDControl').hide();
                $('#tableMystical').hide();
                $('#tblORB').hide();
                $('#dvMinutesLebal').hide();
                $('#dvTimeControl').show();
                $('#dvExitOverallMargin').show();
                $('#dvTotalOverallMargin').hide();
                $('#dvMultiplierControl').hide();
                $('#dvIsReversal').hide();
                $('#dvQty').hide();
                $('#dvTSL').hide();
                $('#dvIsSignalTradeCandle').hide();
            }
            if (StratgyID == 90) {
                $('#dvSmoothKControl').hide();
                $('#dvSmoothDControl').hide();
                $('#tableMystical').hide();
                $('#tblORB').hide();
                $('#dvMinutesLebal').hide();
                $('#dvTimeControl').hide();
                $('#dvExitOverallMargin').hide();
                $('#dvTotalOverallMargin').hide();
                $('#dvMultiplierControl').hide();
                $('#dvIsReversal').hide();
                $('#dvQty').hide();
                $('#dvTSL').hide();
                $('#dvTimeControl').show();
                $('#dvIsSignalTradeCandle').hide();
                var parms = $('input[name=StrategyParameters]').val();
                if (parms != null && parms != '') {
                    JsonToTableRoyalStar(parms);
                }
                $('.dvRoyalStar').show();
            }
        }
        else {
            $('#dvTimeControl').hide();
            $('#dvPeriodControl').hide();
            $('#dvMultiplierControl').hide();
            $('#dvSlowLengthControl').hide();
            $('#dvSignalLengthControl').hide();
            $('#dvSmoothKControl').hide();
            $('#dvSmoothDControl').hide();
            $('#tblORB').hide();
            $('#tableMystical').hide();
            $('#dvMinutesLebal').hide();
            $('#dvAmaanStrategy').hide();
            $('#divUpperLimit').hide();
            $('#divLowerLimit').hide();
            $('#divStopLossPercentage').hide();
            $('#ddlQuery').removeAttr('required');

            $('#dvQueryBuilder').hide();
            $('#dvWatchlist').show();
            //$("#tblList tbody").find("input,button,textarea,select").attr("disabled", false);
            // $('#tblListorb tbody').empty();
        }
        if ($('#strategyID option:selected').val() == "") {
            $('#tblORB').hide();
            $('#tableMystical').hide();
        }
        //var table = document.getElementById("tblListBody");
        //var tableorb = document.getElementById("tblListorbbody");
        //if (table != null)
        //    for (var i = 0; i < table.rows.length; i++) {

        //        for (var j = 0; j <= table.rows[i].cells.length; j++) {

        //            $(table.rows[i].cells[j]).find("[id$=Size]").attr("readonly", "readonly");
        //        };
        //    }

        //if (tableorb != null)
        //    for (var i = 0; i < tableorb.rows.length; i++) {
        //        ChangeLot(tableorb.rows[i]);
        //        for (var j = 0; j <= tableorb.rows[i].cells.length; j++) {

        //            $(tableorb.rows[i].cells[j]).find("[id$=Size]").attr("readonly", "readonly");
        //        };
        //    }
        //$('#tblListorbbody .charges').on('keydown', function (e) {

        //    let countstope = $(this).val().split(".").length;
        //    if (countstope == 2) {
        //        if (e.keyCode == 110 || e.keyCode == 190) {
        //            e.preventDefault();
        //        }
        //    }
        //    if (countstope == 3) {
        //        e.preventDefault();
        //    }
        //    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 || (e.ctrlKey == true && (e.keyCode == 86 || e.keyCode == 67)) || (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || (e.keyCode >= 35 && e.keyCode <= 40)) {

        //        // let it happen, don't do anything

        //        return;

        //    }
        //    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        //        e.preventDefault();
        //    }


        //});
        //$('#tblListorbbody .charges').on('change', function () {
        //    var id = $(this).attr("id");
        //    if ($(this).val() == '')
        //        $(this).val('0');
        //    var parent = $(this).parents('tr');
        //    if (id.includes("T2Lot") || id.includes("T3Lot") || id.includes("T4Lot") || id.includes("T2") || id.includes("T3") || id.includes("T4")) {
        //        ChangeLot(parent);
        //    }
        //    else if (id.includes("Lot")) {
        //        $(parent).find('[id$=T2Lot]').val('0');
        //        $(parent).find('[id$=T3Lot]').val('0');
        //        $(parent).find('[id$=T4Lot]').val('0');
        //        $(parent).find('[id$=T2]').val('0');
        //        $(parent).find('[id$=T3]').val('0');
        //        $(parent).find('[id$=T4]').val('0');
        //        $(parent).find('[id$=TSL]').val('0');
        //    }
        //});
        $('.charges').click(function () {
            OnChargesClick(this);
        })
    }


    $('.number').on('keydown', function (e) {
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 || (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || (e.keyCode >= 35 && e.keyCode <= 40)) {

            // let it happen, don't do anything

            return;

        }
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }

    });
    $('#btnSave').on('click', function () {
        if (($('#strategyID option:selected')).text().toLowerCase() != 'mystical' && ($('#strategyID option:selected')).text().toLowerCase() != 'mysticalr') {
            //var tableorb = document.getElementById('tblListorbbody');
            //for (var i = 0; i < tableorb.rows.length; i++) {
            //    if ($(tableorb.rows[i].cells[5]).find('input').val() == null || $(tableorb.rows[i].cells[5]).find('input').val() == '' || $(tableorb.rows[i].cells[5]).find('input').val() == "0") {
            //        alert('Lot required');
            //        return false;
            //    }
            //    else if ($(tableorb.rows[i].cells[6]).find('input').val() == null || $(tableorb.rows[i].cells[6]).find('input').val() == '' || $(tableorb.rows[i].cells[6]).find('input').val() == "0") {
            //        alert('Size required');
            //        return false;
            //    }
            //    //else if ($(tableorb.rows[i].cells[5]).find('input').val() == null || $(tableorb.rows[i].cells[5]).find('input').val() == '' || $(tableorb.rows[i].cells[5]).find('input').val() == "0") {
            //    //    alert('T2 required');
            //    //    return false;
            //    //}
            //    //else if (parseFloat($(tableorb.rows[i].cells[7]).find('input').val()) == 0) {
            //    //    var fTgt = parseFloat($(tableorb.rows[i].cells[7]).find('input').val());
            //    //    if (fTgt == 0) {
            //    //        alert('TGT is required');
            //    //        return false;
            //    //    }
            //    //}
            //    else if ($(tableorb.rows[i].cells[7]).find('input').val() != "0" && $(tableorb.rows[i].cells[8]).find('input').val() == "0") {
            //        var fTgt = parseFloat($(tableorb.rows[i].cells[7]).find('input').val());
            //        var fTgtLot = parseFloat($(tableorb.rows[i].cells[8]).find('input').val());
            //        if (fTgt > 0 && fTgtLot == 0) {
            //            alert('TGT Lot required');
            //            return false;
            //        }
            //    }
            //    else if ($(tableorb.rows[i].cells[9]).find('input').val() != "0" && $(tableorb.rows[i].cells[10]).find('input').val() == "0") {
            //        var fTgt2 = parseFloat($(tableorb.rows[i].cells[9]).find('input').val());
            //        var fTgt2Lot = parseFloat($(tableorb.rows[i].cells[10]).find('input').val());
            //        if (fTgt2 > 0 && fTgt2Lot == 0) {
            //            alert('TGT2 Lot required');
            //            return false;
            //        }
            //    }
            //    else if ($(tableorb.rows[i].cells[11]).find('input').val() != "0" && $(tableorb.rows[i].cells[12]).find('input').val() == "0") {

            //        var fTgt3 = parseFloat($(tableorb.rows[i].cells[11]).find('input').val());
            //        var fTgt3Lot = parseFloat($(tableorb.rows[i].cells[12]).find('input').val());
            //        if (fTgt3 > 0 && fTgt3Lot == 0) {
            //            alert('TGT3 Lot required');
            //            return false;
            //        }
            //    }

            //    else if ($(tableorb.rows[i].cells[4]).find('select').val() == null || $(tableorb.rows[i].cells[3]).find('select').val() == '') {
            //        alert('Type required');
            //        return false;
            //    }
            //    else if ($(tableorb.rows[i].cells[17]).find('input').val() == null || $(tableorb.rows[i].cells[17]).find('input').val() == '' || $(tableorb.rows[i].cells[17]).find('input').val() == '0') {
            //        alert('SL count required');
            //        return false;
            //    }
            //}
            if ($('#strategyID option:selected').val() == '75') {
                var superTrendVal = $('#amaanSupertrend').val();
                var RsiVal = $('#amaanRsi').val();
                var macdVal = $('#amaanMacd').val();
                var emaVal = $('#amaanEMA').val();

                var finalparm = "ST:" + superTrendVal + ";RSI:" + RsiVal + ";MACD:" + macdVal + ";EMA:" + emaVal;
                $('input[name=StrategyParameters]').val(finalparm);

            } if ($('#strategyID option:selected').val() == '82' || $('#strategyID option:selected').val() == '84') {
                var binanceSetClose = $('#binanceSetClose').val();
                var binanceDifference = $('#binanceDifference').val();
                var binanceRentry = $('#binanceRentry').val();
                var binanceProfit = $('#binanceProfit').val();
                var binanceLot = $('#binanceLot').val();
                var binanceLotMultiplier = $('#binanceLotMultiplier').val();

                var finalparm = "binanceSetClose:" + binanceSetClose + ";binanceDifference:" + binanceDifference + ";binanceRentry:" + binanceRentry + ";binanceProfit:" + binanceProfit
                    + ";binanceLot:" + binanceLot + ";binanceLotMultiplier:" + binanceLotMultiplier;
                $('input[name=StrategyParameters]').val(finalparm);

            }
            if ($('#strategyID option:selected').val() == '79' || $('#strategyID option:selected').val() == '88') {
                var shashiShantRsi = $('#shashiShantRsi').val();
                var shashiShantTarget = $('#shashiShantTarget').val();
                var shashiShantStopLoss = $('#shashiShantStopLoss').val();

                $('input[name=SignalLength]').val(shashiShantRsi);
                $('input[name=EntryOverallMargin]').val(shashiShantStopLoss);
                $('input[name=ExitOverallMargin]').val(shashiShantTarget);

            }
            if ($('#strategyID option:selected').val() == '85') {
                var superTrendVal = $('#UmaSupertrend').val();
                var RsiVal = $('#UmaRsiLow').val();
                var macdVal = $('#UmaRsiHigh').val();

                var finalparm = "ST:" + superTrendVal + ";RSI:" + RsiVal + ";RSI2:" + macdVal + "";
                $('input[name=StrategyParameters]').val(finalparm);

            }
            if ($('#strategyID option:selected').val() == '86' || $('#strategyID option:selected').val() == '89' || $('#strategyID option:selected').val() == '91') {
                var TradingBotBalance = $('#TradingBotBalance').val();
                TableToJson();
                var finalparm = "Balance:" + TradingBotBalance + ";buyArray=" + buyTablejson + ";sellArray=" + sellTablejson + "";
                $('input[name=StrategyParameters]').val(finalparm);

            }
            if ($('#strategyID option:selected').val() == '90') {
                TableToJsonRoyalStar();
                var finalparm = RoyalStarTablejson;
                $('input[name=StrategyParameters]').val(finalparm);
            }
        }

        else {
            //var table = document.getElementById('tblListBody');
            //var tableorb = document.getElementById('tblListorbbody');
            //for (var i = 0; i < table.rows.length; i++) {
            //    if ($(table.rows[i].cells[4]).find('input').val() == null || $(table.rows[i].cells[3]).find('input').val() == '' || $(table.rows[i].cells[3]).find('input').val() == "0") {
            //        alert('Lot required');
            //        return false;
            //    }
            //    else if ($(table.rows[i].cells[5]).find('input').val() == null || $(table.rows[i].cells[4]).find('input').val() == '' || $(table.rows[i].cells[4]).find('input').val() == "0") {
            //        alert('Size required');
            //        return false;
            //    }
            //    else if ($(tableorb.rows[i].cells[11]).find('input').val() == null || $(tableorb.rows[i].cells[11]).find('input').val() == ''/* || $(tableorb.rows[i].cells[11]).find('input').val() == '0'*/) {
            //        alert('SL count required');
            //        return false;
            //    }
            //}
        }

        return true;
    });
});
var buyTablejson = '';
var sellTablejson = '';
function TableToJson() {
    var otArr = [];
    var tbl2 = $('#TradinBotBuyTable tbody tr').each(function (i) {
        var x = $(this).children();
        var itArr = { level: "", PricePercentage: "", SqaureOfBuyQty: "" };
        x.each(function (key, val) {
            if (key == 0)
                itArr["level"] = $(val).find('input').val();
            else if (key == 1)
                itArr["PricePercentage"] = $(val).find('input').val();
            else if (key == 2)
                itArr["SqaureOfBuyQty"] = $(val).find('input').val();

        });
        otArr.push(itArr);

    })
    buyTablejson = JSON.stringify(otArr);



    otArr = [];
    var tbl3 = $('#TradinBotSellTable tbody tr').each(function (i) {
        var x = $(this).children();
        var itArr = { level: "", PricePercentage: "", SqaureOfBuyQty: "" };
        x.each(function (key, val) {

            if (key == 0)
                itArr.level = $(val).find('input').val();
            else if (key == 1)
                itArr.PricePercentage = $(val).find('input').val();
            else if (key == 2)
                itArr.SqaureOfBuyQty = $(val).find('input').val();

        });
        otArr.push(itArr);
    })
    sellTablejson = JSON.stringify(otArr);
}
function JsonToTable(parms) {

    if (parms != null && parms != '') {

        var arr = parms.split(';');
        var stValarr = arr[1].split('=');
        var stVal = stValarr[1];

        var stRsiarr = arr[2].split('=');
        var stRsi = stRsiarr[1];

        var buyTableArray = JSON.parse(stVal);
        $('#TradinBotBuyTable tbody').html('');
        $.each(buyTableArray, function (index, value) {
            var tableRow = "<tr>";
            $.each(value, function (k, val) {
                if (k == 'level')
                    tableRow += "<td><input type='text' class='form-control' value='" + val + "' /></td>";
                else
                    tableRow += "<td><input type='number' class='form-control' value='" + val + "' /></td>";
            });
            tableRow += "</tr>";
            $('#TradinBotBuyTable tbody').append(tableRow);
        });

        var sellTableArray = JSON.parse(stRsi);
        $('#TradinBotSellTable tbody').html('');
        $.each(sellTableArray, function (index, value) {
            var tableRow = "<tr>";
            $.each(value, function (k, val) {
                if (k == 'level')
                    tableRow += "<td><input type='text' class='form-control' value='" + val + "' /></td>";
                else
                    tableRow += "<td><input type='number' class='form-control' value='" + val + "' /></td>";
            });
            tableRow += "</tr>";
            $('#TradinBotSellTable tbody').append(tableRow);
        });

    }

}
function OnChargesClick(ele) {
    var parent = $(ele).parents('tr');
    var id = $(ele).attr('id');
    if (id.includes('T3') || id.includes('T4Lot')) {
        var t2 = parseFloat($('[id$=T2]').val());
        var t3 = parseFloat($('[id$=T3]').val());
        if (id.includes('T3') && t2 < 1)
            ShowPopover(ele, 'Please enter first target');
        else if (t2 < 1 || t3 < 1)
            ShowPopover(ele, 'Please enter previous targets');
    }

}
function ChangeLot(parent) {
    var t2Lot = $(parent).find('[id$=T2Lot]').val();
    var t3Lot = $(parent).find('[id$=T3Lot]').val();
    var t4Lot = $(parent).find('[id$=T4Lot]').val();
    var t2 = $(parent).find('[id$=T2]').val();
    var t3 = $(parent).find('[id$=T3]').val();
    var t4 = $(parent).find('[id$=T4]').val();
    var tsl = $(parent).find('[id$=TSL]').val();
    var t2LotDec = 0, t3LotDec = 0, t4LotDec = 0, t2Dec = 0, t3Dec = 0, t4Dec = 0, tslDec = 0;
    if (t2 != '')
        t2Dec = parseFloat(t2);
    if (t3 != '')
        t3Dec = parseFloat(t3);
    if (t4 != '')
        t4Dec = parseFloat(t4);
    if (t2Lot != '')
        t2LotDec = parseFloat(t2Lot);
    if (t3Lot != '')
        t3LotDec = parseFloat(t3Lot);
    if (t4Lot != '')
        t4LotDec = parseFloat(t4Lot);
    if (tsl != '')
        tslDec = parseFloat(tsl);
    if (t2 == 0)
        t2LotDec = 0;
    if (t3 == 0)
        t3LotDec = 0;
    if (t4 == 0)
        t4LotDec = 0;
    if (t3 > 0 && t2 == 0) {
        $(parent).find('[id$=T3]').val(0);
        $(parent).find('[id$=T4]').val(0);
        return;
    }
    if (t4 > 0 && (t2 == 0 || t3 == 0)) {
        $(parent).find('[id$=T4').val(0);
        return;
    }
    var total = t2LotDec + t3LotDec + t4LotDec;
    //if (t2LotDec == 0 && t3LotDec == 0 && t4LotDec == 0) {
    //    $(parent).find('[id$=Lot]').removeAttr('readonly');
    //    $(parent).find('[id$=Lot]').val(total);
    //}
    //else {
    //$(parent).find('[id$=Lot]').removeAttr('readonly');
    if (total > 0)
        $(parent).find('[id$=Lot]').val(total);
    //$(parent).find('[id$=Lot]').attr('readonly', 'readonly');
    //}
    //$(parent).find('[id$=T2Lot]').removeAttr('readonly');
    //$(parent).find('[id$=T3Lot]').removeAttr('readonly');
    //$(parent).find('[id$=T4Lot]').removeAttr('readonly');
    $(parent).find('[id$=T2Lot]').val(t2LotDec);
    $(parent).find('[id$=T3Lot]').val(t3LotDec);
    $(parent).find('[id$=T4Lot]').val(t4LotDec);
    $(parent).find('[id$=TSL]').val(tslDec);
    if (total == 0)
        $(parent).find('[id$=TSL]').val('0');

}
function ShowPopover(ele, msg) {
    var popHtml = "<p>" + msg + "</p>";
    $(ele).popover({
        html: true,
        content: function () {
            return popHtml
        }
    });
}
var OptionChainInterval;
function OptionChainPop(publishid, strategyID) {

    var request = $.ajax({
        url: "/Publish/GetOptionChainResult",
        type: "GET",
        data: { ID: publishid, strategyID: strategyID },

        success: function (data) {
            //var results = JSON.parse(data);

            $("#OptionChainResultModal .modal-body").html(data)
            //$("#MarketDepthModal").modal('show');
            $('#OptionChainResultModal').modal({
                backdrop: false,
                show: true
            });
            $("body").removeClass('modal-open');
            if (strategyID == 76)
                OptionChainInterval = setInterval(function () { SetOptionChainForRefresh(publishid, strategyID); }, 1000);
            else
                OptionChainInterval = setInterval(function () { SetOptionChainForRefresh(publishid, strategyID); }, 60000);
            return false;
        }
    });
}
function SetOptionChainForRefresh(publishid, strategyID) {

    var request = $.ajax({
        url: "/Publish/GetOptionChainResult",
        type: "GET",
        data: { ID: publishid, strategyID: strategyID },
        async: true,
        success: function (data) {
            //var results = JSON.parse(data);

            $("#OptionChainResultModal .modal-body").html(data)

            return false;
        }
    });
}
function HideOptionChainResult() {
    clearInterval(OptionChainInterval);
    $("#OptionChainResultModal").modal('hide');
}
var RoyalStarTablejson = "";
function TableToJsonRoyalStar() {
    var otArr = [];
    $('#RoyalStarTable tbody tr').each(function (i) {
        var x = $(this).children();
        var itArr = { RSIvalue: "", HoldTime: "", Lot: "", SL: "", TSL: "", StrikePriceRange: "", IsCallActive: "", IsPutActive: "" };
        x.each(function (key, val) {
            if (key == 0)
                itArr["RSIvalue"] = $(val).find('input').val();
            if (key == 1)
                itArr["HoldTime"] = $(val).find('input').val();
            if (key == 2)
                itArr["Lot"] = $(val).find('input').val();
            if (key == 3)
                itArr["SL"] = $(val).find('input').val();
            if (key == 4)
                itArr["TSL"] = $(val).find('input').val();
            if (key == 5)
                itArr["StrikePriceRange"] = $(val).find('select').val();
            if (key == 6)
                itArr["IsCallActive"] = $(val).find('input').prop('checked') == true ? 1 : 0;
            if (key == 7)
                itArr["IsPutActive"] = $(val).find('input').prop('checked') == true ? 1 : 0;
        });
        otArr.push(itArr);

    })
    RoyalStarTablejson = JSON.stringify(otArr);
}
$('#BtnAddRoyalStar').on('click', function () {
    if (document.getElementById('RoyalStarTable').rows.length <= 10) {
        var DataValue = "<tr>";
        DataValue += '<td><input type="number" class="form-control" value="0" /></td>';
        DataValue += '<td><input type="number" class="form-control" value="0" /></td>';
        DataValue += '<td><input type="number" class="form-control" value="0" /></td>';
        DataValue += '<td><input type="number" class="form-control" value="0" /></td>';
        DataValue += '<td><input type="number" class="form-control" value="0" /></td>';

        DataValue += '<td>' + GetDRPForRoyalStar("") + '</td>';

        DataValue += '<td><input type="checkbox" checked /></td>';
        DataValue += '<td><input type="checkbox" checked /></td>';

        DataValue += '<td><button class="btn btn-danger btn-sm" onclick="this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode)" >Remove</button></td>';
        DataValue += "</tr>";
        $('#TblRoyalStarBody').append(DataValue);
    } else {
        toastr.error('Max limit is 10')
    }
});
function GetDRPForRoyalStar(DRPValue) {
    var StringData = '<select style="width: 100%!important;">' +
        '<option value="50_100">50_100</option>' +
        '<option value="100_150">100_150</option>' +
        '<option value="150_200">150_200</option>' +
        '<option value="200_250">200_250</option>' +
        '<option value="250_300">250_300</option>' +
        '<option value="300_350">300_350</option>' +
        '<option value="350_400">350_400</option>' +
        '<option value="400_450">400_450</option>' +
        '<option value="450_500">450_500</option>' +
        '<option value="500_550">500_550</option>' +
        '<option value="550_600">550_600</option>' +
        '<option value="600_650">600_650</option>' +
        '<option value="650_700">650_700</option>' +
        '<option value="700_750">700_750</option>' +
        '<option value="750_800">750_800</option>' +
        '<option value="800_850">800_850</option>' +
        '<option value="850_900">850_900</option>' +
        '<option value="900_950">900_950</option>' +
        '<option value="950_1000">950_1000</option>' +
        "</select>";
    if (DRPValue.length > 0) {
        DRPValue = ">" + DRPValue;
        StringData = StringData.replace(DRPValue, ' selected ' + DRPValue);
    }
    return StringData;
}
function JsonToTableRoyalStar(parms) {
    if (parms != null && parms != '') {
        var TableArray = JSON.parse(parms);
        $('#TblRoyalStarBody').html('');
        $.each(TableArray, function (index, value) {
            var tableRow = "<tr>";
            $.each(value, function (k, val) {
                if (k == 'IsCallActive' || k == 'IsPutActive') {
                    tableRow += '<td><input type="checkbox" ' + (val == "1" ? "checked" : "") + '/></td>';
                }
                else if (k == 'StrikePriceRange')
                    tableRow += '<td>' + GetDRPForRoyalStar(val) + '</td>';
                else
                    tableRow += "<td><input type='number' class='form-control' value='" + val + "' /></td>";
            });
            tableRow += '<td><button class="btn btn-danger btn-sm" onclick="this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode)" >Remove</button></td>';
            tableRow += "</tr>";
            $('#TblRoyalStarBody').append(tableRow);
        });
    }

}
