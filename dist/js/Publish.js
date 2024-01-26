$(document).ready(function () {
    $('input', 'form').blur(function () {
        $(this).valid();
    });
    var valstra = $('#StrategyID').val();
    if (valstra == 77 || valstra == 79 || valstra==81) {
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
    $('#StrategyID').on('change', function () {
        var val = $('#StrategyID').val();
        if (val == 77 || val == 79 || val==81) {
            GetDefaultBankNiftyWatchlist();
           
        }
        checkStrategy(false);
    })
    $('#ddlQuery').on('change', function () {
        var publishID = $("input[name=PublishID]").val();
        //var strategyID = $("#StrategyID").val();
        //window.location = "/Publish/ManagePublish/?ID=" + publishID + "&WID=0&strategyID=" + strategyID + "&SelectedQueryID=" + $(this).val() + "&publishName=" + $("#txtpublishname").val() + "&orbTime=" + $("#ORBTime").val() + "&period=" + $("#Period").val() + "&multiplier=" + $("#Multiplier").val();
        GetWatchListScripts(0, $(this).val(), publishID);

    })
    $('#ddlWatchlist').on('change', function () {
        var publishID = $("input[name=PublishID]").val();
        //var strategyID = $("#StrategyID").val();
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

                $.map(data, function (i, e) { htmlString += '<option value="' + i.WID + '">' + i.WatchListName + '</option>' });
                $('#ddlWatchlist').html(htmlString);
                $("#ddlWatchlist").val(updateWID);
            }
        });
    }
    function GetWatchListScripts(WID, SelectedQueryID, ID) {
        var value = { 'ID': ID, 'WID': WID, 'SelectedQueryID': SelectedQueryID };
        var request = $.ajax({
            url: "/Publish/GetWatchlistScripts",
            type: "GET",
            data: value,

            success: function (data) {
                $('#tablesDiv').html(data);
                checkStrategy(true);
            }
        });
    }
    function checkStrategy(IsChangeWatchlist) {
        var sID = $('#StrategyID option:selected').val();
        var StratgyID = parseInt(sID, 10);
        if (($('#StrategyID option:selected')).text().toLowerCase() == 'orb' || ($('#StrategyID option:selected')).text().toLowerCase() == 'orbr' || ($('#StrategyID option:selected')).text().toLowerCase() == 'manual' || ($('#StrategyID option:selected')).text().toLowerCase() == 'query builder' || ($('#StrategyID option:selected')).text().toLowerCase() == 'supertrend' || StratgyID > 64) {

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
            $('#dvAmaanStrategy').hide(); $('.dvShashiShant').hide();
            //$('#tblORB').show();
            // $('#tblList tbody').empty();
            $("#tblList tbody").find("input,button,textarea,select").attr("disabled", "disabled");
            $('#tableMystical').hide();
            $('#dvMinutesLebal').show();
            $('#ddlQuery').removeAttr('required');
            $('#dvQueryBuilder').hide();
            if (($('#StrategyID option:selected')).text().toLowerCase() == 'manual') {
                $('#dvTimeControl').hide();
                $('#tblORB').show();
            }
            else if (($('#StrategyID option:selected')).text().toLowerCase() == 'query builder') {
                $('#dvTimeControl').hide();
                $('#ddlQuery').attr("required", "required");
                $('#dvTimeControl .timeIntervaldd').val('1');
                $('#dvQueryBuilder').show();
                $('#dvWatchlist').hide();
                $('#tblORB').show();
            }
            if (($('#StrategyID option:selected')).text().toLowerCase() != 'query builder') {
                $('#dvWatchlist').show();
                $('#tblORB').show();
            }
            if (StratgyID == 65) {
                $('#dvPeriodControl').show();

                $('#dvMultiplierControl').show();
                $('#tableMystical').hide();
                $('#tblORB').show();

            }
            if (StratgyID == 67 || StratgyID == 68 || StratgyID == 69 || StratgyID == 71 ) {

                $('#dvPeriodControl').show();
                $('#tableMystical').hide();
                $('#tblORB').show();
            } if (StratgyID == 81) {

                $('#dvPeriodControl').show();
                $('#dvMultiplierControl').show();
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
            if (StratgyID == 76 || StratgyID==77) {
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
            if (StratgyID == 79) {
                $('#dvSmoothKControl').hide();
                $('#dvSmoothDControl').hide();
                $('#tableMystical').hide();
                $('#tblORB').hide();
                $('#dvTimeControl').show();
                $('#dvMinutesLebal').hide();
                $('#dvEntryOverallMargin').hide();
                $('#dvExitOverallMargin').hide();
                $('#dvTotalOverallMargin').hide();
                $('#dvMultiplierControl').hide();
                $('.dvShashiShant').show();
                $('#divUpperLimit').show();
                $('#divLowerLimit').show();
                $('#divStopLossPercentage').hide();

            }
            if (StratgyID == 82) {
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
            $("#tblList tbody").find("input,button,textarea,select").attr("disabled", false);
            // $('#tblListorb tbody').empty();
        }
        if ($('#StrategyID option:selected').val() == "") {
            $('#tblORB').hide();
            $('#tableMystical').hide();
        }
        var table = document.getElementById("tblListBody");
        var tableorb = document.getElementById("tblListorbbody");
        if (table != null)
            for (var i = 0; i < table.rows.length; i++) {

                for (var j = 0; j <= table.rows[i].cells.length; j++) {

                    $(table.rows[i].cells[j]).find("[id$=Size]").attr("readonly", "readonly");
                };
            }

        if (tableorb != null)
            for (var i = 0; i < tableorb.rows.length; i++) {
                ChangeLot(tableorb.rows[i]);
                for (var j = 0; j <= tableorb.rows[i].cells.length; j++) {

                    $(tableorb.rows[i].cells[j]).find("[id$=Size]").attr("readonly", "readonly");
                };
            }
        $('#tblListorbbody .charges').on('keydown', function (e) {

            let countstope = $(this).val().split(".").length;
            if (countstope == 2) {
                if (e.keyCode == 110 || e.keyCode == 190) {
                    e.preventDefault();
                }
            }
            if (countstope == 3) {
                e.preventDefault();
            }
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 || (e.ctrlKey == true && (e.keyCode == 86 || e.keyCode == 67)) || (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || (e.keyCode >= 35 && e.keyCode <= 40)) {

                // let it happen, don't do anything

                return;

            }
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }


        });
        $('#tblListorbbody .charges').on('change', function () {
            var id = $(this).attr("id");
            if ($(this).val() == '')
                $(this).val('0');
            var parent = $(this).parents('tr');
            if (id.includes("T2Lot") || id.includes("T3Lot") || id.includes("T4Lot") || id.includes("T2") || id.includes("T3") || id.includes("T4")) {
                ChangeLot(parent);
            }
            else if (id.includes("Lot")) {
                $(parent).find('[id$=T2Lot]').val('0');
                $(parent).find('[id$=T3Lot]').val('0');
                $(parent).find('[id$=T4Lot]').val('0');
                $(parent).find('[id$=T2]').val('0');
                $(parent).find('[id$=T3]').val('0');
                $(parent).find('[id$=T4]').val('0');
                $(parent).find('[id$=TSL]').val('0');
            }
        });
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
        if (($('#StrategyID option:selected')).text().toLowerCase() != 'mystical' && ($('#StrategyID option:selected')).text().toLowerCase() != 'mysticalr') {
            var tableorb = document.getElementById('tblListorbbody');
            for (var i = 0; i < tableorb.rows.length; i++) {
                if ($(tableorb.rows[i].cells[5]).find('input').val() == null || $(tableorb.rows[i].cells[5]).find('input').val() == '' || $(tableorb.rows[i].cells[5]).find('input').val() == "0") {
                    alert('Lot required');
                    return false;
                }
                else if ($(tableorb.rows[i].cells[6]).find('input').val() == null || $(tableorb.rows[i].cells[6]).find('input').val() == '' || $(tableorb.rows[i].cells[6]).find('input').val() == "0") {
                    alert('Size required');
                    return false;
                }
                //else if ($(tableorb.rows[i].cells[5]).find('input').val() == null || $(tableorb.rows[i].cells[5]).find('input').val() == '' || $(tableorb.rows[i].cells[5]).find('input').val() == "0") {
                //    alert('T2 required');
                //    return false;
                //}
                //else if (parseFloat($(tableorb.rows[i].cells[7]).find('input').val()) == 0) {
                //    var fTgt = parseFloat($(tableorb.rows[i].cells[7]).find('input').val());
                //    if (fTgt == 0) {
                //        alert('TGT is required');
                //        return false;
                //    }
                //}
                else if ($(tableorb.rows[i].cells[7]).find('input').val() != "0" && $(tableorb.rows[i].cells[8]).find('input').val() == "0") {
                    var fTgt = parseFloat($(tableorb.rows[i].cells[7]).find('input').val());
                    var fTgtLot = parseFloat($(tableorb.rows[i].cells[8]).find('input').val());
                    if (fTgt > 0 && fTgtLot == 0) {
                        alert('TGT Lot required');
                        return false;
                    }
                }
                else if ($(tableorb.rows[i].cells[9]).find('input').val() != "0" && $(tableorb.rows[i].cells[10]).find('input').val() == "0") {
                    var fTgt2 = parseFloat($(tableorb.rows[i].cells[9]).find('input').val());
                    var fTgt2Lot = parseFloat($(tableorb.rows[i].cells[10]).find('input').val());
                    if (fTgt2 > 0 && fTgt2Lot == 0) {
                        alert('TGT2 Lot required');
                        return false;
                    }
                }
                else if ($(tableorb.rows[i].cells[11]).find('input').val() != "0" && $(tableorb.rows[i].cells[12]).find('input').val() == "0") {

                    var fTgt3 = parseFloat($(tableorb.rows[i].cells[11]).find('input').val());
                    var fTgt3Lot = parseFloat($(tableorb.rows[i].cells[12]).find('input').val());
                    if (fTgt3 > 0 && fTgt3Lot == 0) {
                        alert('TGT3 Lot required');
                        return false;
                    }
                }

                else if ($(tableorb.rows[i].cells[4]).find('select').val() == null || $(tableorb.rows[i].cells[3]).find('select').val() == '') {
                    alert('Type required');
                    return false;
                }
                else if ($(tableorb.rows[i].cells[17]).find('input').val() == null || $(tableorb.rows[i].cells[17]).find('input').val() == '' || $(tableorb.rows[i].cells[17]).find('input').val() == '0') {
                    alert('SL count required');
                    return false;
                }
            }
            if ($('#StrategyID option:selected').val() == '75') {
                var superTrendVal = $('#amaanSupertrend').val();
                var RsiVal = $('#amaanRsi').val();
                var macdVal = $('#amaanMacd').val();
                var emaVal = $('#amaanEMA').val();

                var finalparm = "ST:" + superTrendVal + ";RSI:" + RsiVal + ";MACD:" + macdVal + ";EMA:" + emaVal;
                $('input[name=StrategyParameters]').val(finalparm);

            }
            if ($('#StrategyID option:selected').val() == '79') {
                var shashiShantRsi = $('#shashiShantRsi').val();
                var shashiShantTarget = $('#shashiShantTarget').val();
                var shashiShantStopLoss = $('#shashiShantStopLoss').val();
                
                $('input[name=SignalLength]').val(shashiShantRsi);
                $('input[name=EntryOverallMargin]').val(shashiShantStopLoss);
                $('input[name=ExitOverallMargin]').val(shashiShantTarget);

            }
        }
       
        else {
            var table = document.getElementById('tblListBody');
            var tableorb = document.getElementById('tblListorbbody');
            for (var i = 0; i < table.rows.length; i++) {
                if ($(table.rows[i].cells[4]).find('input').val() == null || $(table.rows[i].cells[3]).find('input').val() == '' || $(table.rows[i].cells[3]).find('input').val() == "0") {
                    alert('Lot required');
                    return false;
                }
                else if ($(table.rows[i].cells[5]).find('input').val() == null || $(table.rows[i].cells[4]).find('input').val() == '' || $(table.rows[i].cells[4]).find('input').val() == "0") {
                    alert('Size required');
                    return false;
                }
                else if ($(tableorb.rows[i].cells[11]).find('input').val() == null || $(tableorb.rows[i].cells[11]).find('input').val() == ''/* || $(tableorb.rows[i].cells[11]).find('input').val() == '0'*/) {
                    alert('SL count required');
                    return false;
                }
            }
        }

        return true;
    });
});
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
function OptionChainPop(publishid,strategyId) {

    var request = $.ajax({
        url: "/Publish/GetOptionChainResult",
        type: "GET",
        data: { ID: publishid, StrategyID: strategyId },

        success: function (data) {
            //var results = JSON.parse(data);

            $("#OptionChainResultModal .modal-body").html(data)
            //$("#MarketDepthModal").modal('show');
            $('#OptionChainResultModal').modal({
                backdrop: false,
                show: true
            });
            $("body").removeClass('modal-open');
            if (strategyId == 76)
                OptionChainInterval = setInterval(function () { SetOptionChainForRefresh(publishid, strategyId); }, 1000);
            else
                OptionChainInterval = setInterval(function () { SetOptionChainForRefresh(publishid, strategyId); }, 60000);
            return false;
        }
    });
}
function SetOptionChainForRefresh(publishid, strategyId) {

    var request = $.ajax({
        url: "/Publish/GetOptionChainResult",
        type: "GET",
        data: { ID: publishid, StrategyID: strategyId},
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
 function SwitchDataTheme() {
        var data = localStorage.getItem('IsDark');
        if (data == 'NO') {
    }
    else {
        $('.content-wrapper').css({'background-color': 'black' ,'color' : 'white'});
        $('.datatableheader').css('background-color','var(--main-color-on-layoutchange)');
        $('li').css('color','white');
        $('.content-header>.breadcrumb>li>a').css('color','white');
        $('#mainWindow').css('background-color','black');
        $('.box-title').css('color','white');
        $('.even').removeClass('even');
        $('.odd').removeClass('odd');
        $('#tblList').removeClass('table-striped');
        $('.form-control').css({'border':'2px solid var(--main-color-on-layoutchange)','color':'white','background-color':'black'});
        $('.dataTables_empty').css({'border-top-color':'black','background-color':'black'});
        $('li.disabled > a').css({'background-color':'black','color':'white'});
        $('.main-footer').css({'background-color':'black','color':'white'});
        $('.table-bordered>thead>tr>th, .table-bordered>tbody>tr>th, .table-bordered>tfoot>tr>th, .table-bordered>thead>tr>td, .table-bordered>tbody>tr>td, .table-bordered>tfoot>tr>td').css('border','1px solid var(--main-color-on-layoutchange)');
        $('.table-bordered').css('border','1px solid var(--main-color-on-layoutchange)');
        $('input').css({'border':'2px solid var(--main-color-on-layoutchange)','background-color':'black','color':'white'});
        $('#btnSave').css({'border':'','background-color':'','color':''});
        $('.box-header').css({'background-color':'black','color':'white'});
        $('.box-body').css({'background-color':'black','color':'white'});
        var NewUI='';
        if (MySkin.SkinName != '')
        {
        NewUI = MySkin.SkinName;
        }
        else
        {
        if (typeof (Storage) !== 'undefined') {
            NewUI = localStorage.getItem('skin')
        }
        }
        if (NewUI == 'skin-black' || NewUI == 'skin-black-light') {
        $('.fixed-column').css('color','black');
        }
        else
        {
        $('.fixed-column').css('color','white');
        }
    }
}