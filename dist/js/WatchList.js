var intWID = 0;
$(document).ready(function () {
    $('#txtScriptExpiryDate').inputmAsk('mm/dd/yyyy', { 'placeholder': 'mm/dd/yyyy' })
    $("#scriptNameDiv").hide();
    $('#txtScriptExpiryDate').datepicker({
        autoclose: true,
        useCurrent: true,
        todayHighlight: true,
        todayBtn: true,
        startDate: new Date(),
        todayBtn: "linked"
    });
    $('#tblList').DataTable(
        {
            'aoColumnDefs': [{
                'bSortable': false,
                'aTargets': [7]
            }]
        }
    );
    var ID = getQueryStringValue('ID');
    var _ScriptExchange = $('#cboScriptExchange').val();

    if (ID != "" && ID != "0") {
        OnSetData(ID);
        intWID = ID;
    }

    $('#btnCreate').on('click', function (e) {

        var ScriptCodeString = setScriptObject();
        var Watchlistname = $("#Watchlistname").val();
        if (Watchlistname == '' || Watchlistname == undefined || Watchlistname == null) {
            $('#lblWatchlistName').show();
            return false;
        }
        else {
            if (ScriptCodeString != null && ScriptCodeString != '' && ScriptCodeString != undefined) {
                var request = $.ajax({
                    url: "/Watchlist/SaveWatchList",
                    type: "POST",
                    data: { intWID: intWID, Watchlistname: Watchlistname, ScriptCodes: ScriptCodeString.ScriptCodeString },
                    dataType: 'json',
                    traditional: true,
                    success: function (data) {
                        window.location.replace("/Watchlist/Index");

                        var results = JSON.parse(data);
                        if (results.ScriptName != '' && results.ScriptName != null) {
                            setScriptDetails(results);
                        }
                    },
                    error: function (data) {
                        window.location.replace("/Watchlist/Index");
                    }
                });
            }
        }
    });
    $(document).on('change', '#cboScriptExchange', function () {
        $("#LotSizeDiv").hide();
        $("#txtLot").removeProp('readonly');
        $("#txtSize").removeProp('readonly');
        $("#txtSize").val("1");
        $("#txtLot").val("1");
        if ($(this).val() == "BINANCE") {
            $("#BinancePairDiv").show();
            $("#scriptNameDiv").show();
            $("#cboScriptSegment").val("");
            $("#segmentDiv").hide();
        }
        else if ($(this).val() == "FOREX") {
            $("#scriptNameDiv").show();
            $("#ForexPairDiv").show();
            $("#cboScriptSegment").val("");
            $("#segmentDiv").hide();
        }
        else if ($(this).val() != "NSE" && $(this).val() != "BSE" && $(this).val() != "" && $(this).val() != "FOREX") {
            $("#cboScriptSegment").val("");
            $("#segmentDiv").show();
            $("#BinancePairDiv").hide();
            $("#txtScript").val("");
            $("#scriptNameDiv").hide();
            $("#ForexPairDiv").hide();
            //$("#LotSizeDiv").show();
            var ScriptExchange = $(this).val();

            $.ajax({
                url: '/WatchList/GetSegment?ScriptExchange=' + ScriptExchange,
                type: 'Get',
                success: function (data) {
                    var newData = JSON.parse(data);
                    $('#cboScriptSegment').html('');
                    var list = $('#cboScriptSegment');
                    $('#cboScriptSegment').append($("<option></option>").val("").html("-Select-"));
                    $.each(newData, function (i, item) {
                        $('#cboScriptSegment').append($("<option></option>").val(item.Value).html(item.Text));
                    });


                }
            })

        }
        else {
            $("#cboScriptSegment").val("");
            $("#segmentDiv").hide();
            $("#ForexPairDiv").hide();
            $("#txtScript").val("");
            $("#scriptNameDiv").show();
            $("#ScriptStrikeDiv").hide();
            $("#LotSizeDiv").hide();
            $("#BinancePairDiv").hide();
        }

    });
    $(document).on('change', '#cboScriptSegment', function () {
        if ($(this).val() != "") {
            $("#txtScript").val("");
            $("#scriptNameDiv").show();
        }
        else {
            $("#txtScript").val("");
            $("#scriptNameDiv").hide();
        }
        if ($(this).val() == "OPT") {
            $("#ScriptStrikeDiv").show();
        }
        else {
            $("#ScriptStrikeDiv").hide();
        }
    });
    $("#BtnAddWishList").on('click', function () {
        SaveWatchList();
    });
    $("#txtScript").autocomplete({

        source: function (request, response) {

            $("#hdnSelectedScriptCode").val("");
            _ScriptExchange = $('#cboScriptExchange').val();
            var _ScriptSegment = $("#cboScriptSegment").val();
            var _ScriptPair = $("#BinancePair option:selected").val();
            var _ForexScriptPair = $("#ForexPair").val();
            var _ScriptExpiry = $("#txtScriptExpiryDate").val();
            //if (_ScriptPair != undefined && _ScriptPair != null && _ScriptPair != '')
            //    _ScriptSegment = _ScriptPair;
            var _ScriptStrike = $("#txtScriptStrike").val();
            $.ajax({
                url: "/Watchlist/GetScriptListWithSegment",
                type: "GET",
                dataType: "json",
                data: { Search: request.term, ScriptExchange: _ScriptExchange, Scriptsegment: _ScriptSegment, Scriptexpiry: _ScriptExpiry, ScriptStrike: _ScriptStrike, ScriptPair: _ScriptPair, ForexScriptPair: _ForexScriptPair },
                success: function (data) {
                    response($.map(data, function (item) {
                        return { label: item.scriptTradingSymbol, value: item.scriptTradingSymbol }
                    }));

                }
            });
        },
        messages: {
            noResults: "", results: ""
        },
        minLength: 2,
        select: function (event, ui) {
            $(this).val(ui.item.value);
            var script_Trading_Symbol = $("#txtScript").val();
            //SaveWatchList();

            var SelectedscriptExchange = $('#cboScriptExchange').val();
            var lotsize = 0;
            if (SelectedscriptExchange != "NSE" && SelectedscriptExchange != "BSE" && SelectedscriptExchange != "" && SelectedscriptExchange != "BINANCE" && SelectedscriptExchange != "FOREX") {
                $.ajax({
                    url: "/Watchlist/GetScriptLotSize",
                    type: "GET",
                    dataType: "json",
                    data: { scriptTradingSymbol: script_Trading_Symbol, ScriptExchange: SelectedscriptExchange },
                    success: function (data) {
                        $("#txtSize").val(data.Lot);
                        lotsize = data.Lot;
                        $("#txtLot").prop('readonly', true);
                        $("#txtSize").prop('readonly', true);
                    }
                });
                //if (SelectedscriptExchange == "NFO") {
                //    $("#txtLot").prop('readonly', true);
                //    $("#txtSize").prop('readonly', true);
                //}
                //else {
                //    if (parseInt(lotsize) != 1) {
                //        $("#txtSize").val("1000");
                //        $("#txtLot").val("1");
                //        $("#txtLot").prop('readonly', true);
                //        $("#txtSize").prop('readonly', true);
                //    }
                //    else {
                //        $("#txtSize").val("1");
                //        $("#txtLot").val("1");
                //        $("#txtLot").prop('readonly', true);
                //        $("#txtSize").prop('readonly', false);
                //    }
                //}

                $("#LotSizeDiv").show();
            }
            else {
                $("#LotSizeDiv").hide();
            }

        }

    });

    AutoCompleteUser();

    $(document).on('change', '.checkScript', function () {
        if (intWID != 0) {
            var input = { 'WID': intWID, 'ScriptCode': $(this).data('ScriptCode'), 'isActive': $(this).prop('checked') }
            $.ajax({
                url: "/Watchlist/updateActiveStatus",
                type: "GET",
                dataType: "json",
                data: input,
                success: function (data) {
                    if (data == 1) {
                        ShowAlertMessage(1, "Record updated successfully");
                        OnSetData(ID);
                    }
                    else {
                        ShowAlertMessage(2, "Something went wroung");
                    }
                }
            });
        }
    });
    $(document).on('click', '.checkFavorite', function () {
        if (intWID != 0) {
            var input = { 'WID': intWID, 'ScriptCode': $(this).data('ScriptCode'), 'isFavorite': 1 }
            $.ajax({
                url: "/Watchlist/updateFavoriteStatus",
                type: "GET",
                dataType: "json",
                data: input,
                success: function (data) {
                    var result = JSON.parse(data);
                    if (result.id == 1) {
                        toastr.success(result.Msg);
                        OnSetData(ID);
                    }
                    else {
                        toastr.error(result.Msg);
                    }
                }
            });
        }
    });
    $(document).on('click', '.manageExposer', function () {
        if (intWID != 0) {
            var sCode = $(this).data('ScriptCode');
            var input = { 'WID': intWID, 'ScriptCode': $(this).data('ScriptCode') }
            $.ajax({
                url: "/Watchlist/getScriptWiseExposer",
                type: "GET",
                dataType: "json",
                data: input,
                success: function (data) {
                    var result = JSON.parse(data);
                    if (result != null) {
                        if (result.ENABLE_SCRIPTWISE_BROKERAGE == 1) {
                            $('#cbxEnableExposer').prop('checked', true);
                        }
                        else {
                            $('#cbxEnableExposer').prop('checked', false);
                        }
                        if (result.ENABLE_LOTWISE_BROKERAGE == 1) {
                            $('#cbxEnableExposerLotWise').prop('checked', true);
                        }
                        else {
                            $('#cbxEnableExposerLotWise').prop('checked', false);
                        }
                        $('#txtMisExposerValue').val(result.MIS_EXPOSER);
                        $('#txtNormalExposerValue').val(result.NORMAL_EXPOSER);
                        $('#dropBrokerageType').val(result.BROKERAGE_TYPE);
                        $('#txtBrokerageValue').val(result.BROKERAGE_VALUE);
                    }
                    $("#exposerScriptCode").val(sCode);
                    $("#manageExposerModel").modal('show');
                }
            });
        }
    });
    $(document).on('click', '.checkRemoveFavorite', function () {
        if (intWID != 0) {
            var input = { 'WID': intWID, 'ScriptCode': $(this).data('ScriptCode'), 'isFavorite': 0 }
            $.ajax({
                url: "/Watchlist/updateFavoriteStatus",
                type: "GET",
                dataType: "json",
                data: input,
                success: function (data) {
                    var result = JSON.parse(data);
                    if (result.id == 1) {
                        toastr.success(result.Msg);
                        OnSetData(ID);
                    }
                    else {
                        toastr.error(result.Msg);
                    }
                }
            });
        }
    });
    $(document).on('change', '.lotsize', function () {
        if (intWID != 0) {
            var Lot = '0';
            var size = '0';
            var val = $(this).val();
            if (val != '' && val != '0') {
                if ($(this).hasClass('Lot'))
                    Lot = val;
                else
                    size = val;
                var input = { 'WID': intWID, 'ScriptCode': $(this).data('ScriptCode'), 'Lot': Lot, 'size': size };
                $.ajax({
                    url: "/Watchlist/updateLotSize",
                    type: "GET",
                    dataType: "json",
                    data: input,
                    success: function (data) {
                        if (data == 1) {
                            ShowAlertMessage(1, "Record updated successfully");
                            OnSetData(ID);
                        }
                        else {
                            ShowAlertMessage(2, "Something went wroung");
                        }
                    }
                });
            }
        }
    });

    $(document).on('click', '.importOptions', function () {
        if (intWID != 0) {
            var scriptTradingSymbol = $(this).attr("data-symbolParam");
            var ScriptExchange = $(this).attr("data-ScriptExchange");
            var ScriptCode = $(this).attr("data-ScriptCode");
            $('#scriptSymbol').val(scriptTradingSymbol);
            $('#ScriptExchange').val(ScriptExchange);
            $('#ScriptCode').val(ScriptCode);
            $('#txtCallOption').val("");
            $('#txtPutOption').val("");
            if (scriptTradingSymbol.includes("BANKNIFTY") || scriptTradingSymbol.includes("NIFTY")) {
                $('.div-Expiry').css('display', 'block');
            }
            else {
                $('.div-Expiry').css('display', 'none');
            }
            $("#importOptionModel").modal('show');
        }
    });

    $("#btnImport").on('click', function () {
        if (parseInt($('#txtCallOption').val()) < 5 || parseInt($('#txtCallOption').val()) > 15 || $('#txtCallOption').val() == '') {
            toastr.error("Max Value For Call Option : 15. Min Value For Call Option: 5");
            return false;
        }
        if (parseInt($('#txtPutOption').val()) < 5 || parseInt($('#txtPutOption').val()) > 15 || $('#txtPutOption').val() == '') {
            toastr.error("Max Value For Put Option: 15. Min Value For Put Option: 5 ");
            return false;
        }
        var ExpiryType = "";
        if ($("#rdMonthly").prop('checked') == true) {
            ExpiryType = "M";
        }
        else {
            ExpiryType = "W";
        }
        var input = {
            'WID': intWID, 'ScriptCode': $('#ScriptCode').val(), scriptTradingSymbol: $('#scriptSymbol').val(),
            ScriptExchange: $('#ScriptExchange').val(), ExpiryType: ExpiryType,
            CallOptionLimit: $('#txtCallOption').val(), CallPutLimit: $('#txtPutOption').val()
        }
        $.ajax({
            url: "/Watchlist/ImportOptions",
            type: "GET",
            dataType: "json",
            data: input,
            success: function (data) {
                $("#importOptionModel").modal('hide');
                OnSetData(intWID);
                if (data != null) {
                    toastr.success("Options Imported Successfully");
                }
                else {
                    toastr.error("Something Went Wrong");
                }
            }
        });
    });
});
$("#btnSaveExposer").on('click', function () {
    if (parseFloat($('#txtMisExposerValue').val()) <= 0 || parseFloat($('#txtNormalExposerValue').val()) <= 0 ||
        parseFloat($('#txtBrokerageValue').val()) <= 0) {
        toastr.error("Please Fill All Values");
        return false;
    }
    if ($("#cbxEnableExposer").prop('checked') == true && $("#cbxEnableExposerLotWise").prop('checked') == true) {
        toastr.error("Only One Type Of Brokrage Will Be Applied.Script Wise Or Lot Wise");
        return false;
    }
    var isCbxEnabled = '';
    var isCbxEnabledLotWise = '';
    if ($("#cbxEnableExposer").prop('checked') == true) {
        isCbxEnabled = 1;
    }
    else {
        isCbxEnabled = 0;
    }
    if ($("#cbxEnableExposerLotWise").prop('checked') == true) {
        isCbxEnabledLotWise = 1;
    }
    else {
        isCbxEnabledLotWise = 0;
    }

    var input = {
        'WID': intWID, 'ScriptCode': $("#exposerScriptCode").val(), ENABLE_SCRIPTWISE_BROKERAGE: parseInt(isCbxEnabled),
        MIS_EXPOSER: parseInt($('#txtMisExposerValue').val()), NORMAL_EXPOSER: parseFloat($('#txtNormalExposerValue').val()),
        BROKERAGE_TYPE: parseInt($('#dropBrokerageType').val()), BROKERAGE_VALUE: parseInt($('#txtBrokerageValue').val()),
        ENABLE_LOTWISE_BROKERAGE: parseInt(isCbxEnabledLotWise)
    }
    $.ajax({
        url: "/Watchlist/SaveScriptExposer",
        type: "GET",
        dataType: "json",
        data: input,
        success: function (data) {
            var result = JSON.parse(data);
            if (result.id == 0) {
                toastr.success(result.Msg);
            }
            else {
                toastr.error(result.Msg);
            }
        }
    });
    $("#manageExposerModel").modal('hide');
});
function SaveWatchList() {

    var Watchlistname = $("#Watchlistname").val();
    if (Watchlistname == '' || Watchlistname == undefined || Watchlistname == null) {
        $('#lblWatchlistName').show();
        return false;
    }
    //var Limit = $("#WatchListLength").val();
    //if (parseInt(Limit)>=2) {
    //    ShowAlertMessage(2, "You Can Add 50 Records In Watchlist");
    //    return false;
    //}

    var txtUser = null; //it will fetch logged in user
    var hdnIsAdmin = $("#hdnIsAdmin").val();
    if (hdnIsAdmin == "1") {
        txtUser = $("#txtUser").val();
    }
    var Lot = $("#LotSizeDiv #txtLot").val();
    var size = $("#LotSizeDiv #txtSize").val();
    //alert(intWID);
    var ID = getQueryStringValue('ID');
    var Type = getQueryStringValue('Type');
    if (Type == 'Copy' && ID == intWID) {
        return false;
    }
    var scriptTradingSymbol = $("#txtScript").val();
    var _ScriptExchange = $('#cboScriptExchange').val();
    if (scriptTradingSymbol != null && scriptTradingSymbol != '' && scriptTradingSymbol != undefined &&
        _ScriptExchange != null && _ScriptExchange != '') {
        var request = $.ajax({
            url: "/Watchlist/SaveWatchList",
            type: "POST",
            data: { scriptTradingSymbol: scriptTradingSymbol, intWID: intWID, Watchlistname: Watchlistname, ScriptExchange: _ScriptExchange, txtUser: txtUser, Lot: Lot, Size: size, ForexPair: $("#ForexPair option:selected").text(), otheruserid: $("#OtherUserId").val() },
            dataType: 'json',
            traditional: true,
            success: function (data) {
                var results = JSON.parse(data);
                if (results.IsError && results.ErrorMessage == "Invalid") {
                    $("#txtScript").val("");
                    //alert("Duplicate record.");
                    toastr.error("Invalid Pair");
                    return false;
                }

                if (results.IsExist) {
                    $("#txtScript").val("");
                    //alert("Duplicate record.");
                    ShowAlertMessage(2, "Duplicate record.");
                    return false;
                }

                if (results.IsError) {
                    $("#txtScript").val("");
                    //alert("An Error occurred while saving a record, please try again!");
                    ShowAlertMessage(2, "Invalid Script");
                    return false;
                }

                if (!results.IsError && results.ScriptCode != '' && results.ScriptCode != null) {
                    intWID = results.intWID;
                    setScriptDetails(results);
                    $("#txtScript").val("");
                    //alert("Record added");
                    ShowAlertMessage(1, "");
                    return false;
                }

            }
        });
    }
}

function setScriptDetails(item) {
    var btnName = 'btn';


    var symbolParam = '\'' + item.ScriptTradingSymbol + '\'';
    //alert(symbolParam);

    var finalTradingSymbol = "";
    if (item.Scripttype == "FOREX") {
        finalTradingSymbol = item.ScriptTradingSymbol + " / " + item.Scriptsegment;
    }
    else {
        finalTradingSymbol = item.ScriptTradingSymbol;
    }

    var Target = '<input type="text" id="txtTarget' + item.ScriptCode + '" class="form-control ui-autocomplete-input" />';
    var StopLoss = '<input type="text" id="txtStopLoss' + item.ScriptCode + '" class="form-control ui-autocomplete-input" />';
    var deleteButton = '<button id="btnName' + item.ScriptCode + '" onclick="removeScript(' + item.ScriptCode + ')" type="button" class="btn btn-danger btn-sm btn-delete"><i class="fa fa fa-trash-o"></i></button> ';
    var buyButton = '<button id="btnBuy' + item.ScriptCode + '" onclick="buySellPopUp(' + item.ScriptCode + ',1,' + symbolParam + ')" type="button" class="btn btn-success btn-sm btn-Buy"> Buy </button> ';
    var sellButton = '<button id="btnSell' + item.ScriptCode + '" onclick="buySellPopUp(' + item.ScriptCode + ',2,' + symbolParam + ')" type="button" class="btn btn-danger btn-sm btn-Sell"> Sell </button> ';
    var Lot = '<input type="text" class="form-control" id="txtLot"   style="width: 75px;"  readonly value=' + item.Lot + '>';
    var Size = '<input type="text" class="form-control" id="txtSize" style="width: 75px;" readonly value=' + item.Size + '>';
    var Checkbox = "";
    var importOptions = "";
    var FavoriteOptions = "";
    if (item.ScriptInstrumentType == "FUT") {
        importOptions = '<a href="javascript:void(0)" class="importOptions" data-ScriptCode=' + item.ScriptCode + ' data-symbolParam =' + symbolParam + ' data-ScriptExchange=' + item.ScriptExchange + ' title="Import Options" style="margin-left:10px;margin-right:10px;font-size:16px;"><i class="glyphicon glyphicon-save-file"></i></a>';
    }
    else {
        importOptions = '';
    }
    if (item.isActive == true) {
        Checkbox = '<input type="checkbox" class="checkScript" id="chkSelect" data-ScriptCode=' + item.ScriptCode + ' checked>'
    }
    else {
        Checkbox = '<input type="checkbox" class="checkScript" id="chkSelect" data-ScriptCode=' + item.ScriptCode + ' >'
    }
    if (item.isFavorite == 1) {
        FavoriteOptions = '<i class="fa fa-heart checkRemoveFavorite" style="margin-top: 1px;cursor:pointer;font-size: 16px;margin-right:5px;"  title="Add To Favorite"  data-ScriptCode=' + item.ScriptCode + '></i>'
    }
    else {
        FavoriteOptions = '<i class="fa fa-heart-o checkFavorite" style="margin-top: 1px;cursor:pointer;font-size: 16px;margin-right:5px;" title="Add To Favorite" data-ScriptCode=' + item.ScriptCode + '></i>';
    }
    var manageExposerbtn = "";
    if (($("#companyInitial").val() == "SC" || $("#companyInitial").val() == "DT") && $("#roleid").val() == "4") {
        manageExposerbtn = '<i class="fa fa-edit manageExposer" style="font-size: 20px;cursor:pointer;margin-right:5px;" title="Manage Exposer" data-ScriptCode=' + item.ScriptCode + '></i>';
    }
    if ($("#companyInitial").val() == "RT" && item.ScriptExchange == "FOREX") {
        item.open = (item.open).toFixed(5);
        item.high = (item.high).toFixed(5);
        item.low = (item.low).toFixed(5);
        item.close = (item.close).toFixed(5);
        item.Lastprice = (item.Lastprice).toFixed(5);
    }
    var allButtons = deleteButton;
    var ScriptCode = '<div class="actionBtn">' + FavoriteOptions + importOptions + manageExposerbtn + item.ScriptCode + '</div>'
    $('#tblList').DataTable().row.add([
        ScriptCode,
        finalTradingSymbol,
        item.open,
        item.high,
        item.low,
        item.close,
        item.Lastprice,
        Lot,
        Size,
        Checkbox,
        item.ScriptExchange,
        allButtons
    ]).draw();


    SetDataCommonCode();

    var table = document.getElementById("tblListBody");
    if (item.Expireday != 4) {
        for (var i = 0; i < table.rows.length; i++) {
            if ($(table.rows[i].cells[0]).text() == item.ScriptCode) {
                if (item.Expireday == 0) {
                    $(table.rows[i].cells[1]).append('<br /><span style="font-size:10px;color:red;"><b>(Expired)</b></span>')
                }
                else {
                    $(table.rows[i].cells[1]).append('<br /><span style="font-size:10px;color:red;"><b>(Expires ' + item.Expireday + ' days)</b></span>');
                }
            }
        }
    }
}

function OnSetData(ID) {
    try {
        var request = $.ajax({
            url: "/Watchlist/OnSetData",
            type: "GET",
            data: { ID: ID },
            dataType: 'json',
            traditional: true,
            success: function (data) {
                var results = JSON.parse(data);
                var table = $('#tblList').DataTable();
                table.clear();
                var totalRows = results.length;

                var chkSelectCount = 0;
                if (results != null) {
                    if (results.length > 0) {
                        for (var i = 0; i < results.length; i++) {
                            var result = results[i];
                            //$("#WatchListLength").val(results[0].TOTAL_SCRIPTS);
                            if (result.isActive == true) {
                                chkSelectCount += 1;
                            }
                            setScriptDetails(result);
                        }
                        if (totalRows == chkSelectCount) {
                            $('#chkisActiveAll').prop('checked', true);
                        }
                        else {
                            $('#chkisActiveAll').prop('checked', false);
                        }
                        $("#txtScript").val('');
                        $("#Watchlistname").val(results[0].Watchlistname);

                        var hdnIsAdmin = $("#hdnIsAdmin").val();
                        if (hdnIsAdmin == "1") {
                            $("#txtUser").val(results[0].ObjUserDTO.Email);
                        }
                    }
                }
                if (parseInt(ID) > 0)
                    $("#Watchlistname").val($("#hiddenwatchlistname").val());
                var Type = getQueryStringValue('Type');
                if (Type == "Copy") {
                    $('#Watchlistname').val('');
                    $('#txtUser').val('');
                }
                //if (Type == "View") {
                if (ID != "" && ID != "0") {
                    //setTimeout(function () {
                    //    OnSetDataForRefresh(ID);
                    //}, 1000 * 1);
                    setInterval(function () {
                        //OnSetDataForRefresh(ID); //hsn
                    }, 1000);
                }
                $("form :input").prop("disabled", false);
                $("#tblList_filter :input").prop("disabled", false);
                $("#tblList_length :input").prop("disabled", false);
                //}


                SetDataCommonCode();
            }
        });

    } catch (e) {
        alert("Error On OnSetData.")
    }
}

function OnSetDataForRefresh(ID) {
    try {
        var request = $.ajax({
            url: "/Watchlist/OnSetData",
            type: "GET",
            data: { ID: ID },
            dataType: 'json',
            traditional: true,
            success: function (data) {
                var results = JSON.parse(data);
                var table = $('#tblList').DataTable();
                table.clear();
                var totalRows = results.length;
                var chkSelectCount = 0;
                if (results != null) {
                    for (var i = 0; i < results.length; i++) {
                        var result = results[i];
                        if (result.isActive == true) {
                            chkSelectCount += 1;
                        }
                        setScriptDetails(result);
                    }
                }

                if (totalRows == chkSelectCount) {
                    $('#chkisActiveAll').prop('checked', true);
                }
                else {
                    $('#chkisActiveAll').prop('checked', false);
                }
                var Type = getQueryStringValue('Type');

                if (Type == "View") {
                    $("form :input").prop("disabled", true);
                    $("#tblList_filter :input").prop("disabled", false);
                    $("#tblList_length :input").prop("disabled", false);
                }

                SetDataCommonCode();

            }
        });

    } catch (e) {
        alert("Error On OnSetData.")
    }
}

function removeScript(ScriptCode) {

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
                    ShowAlertMessage(2, "Can't Delete This Record. There is one Active Trade");
                    return false;
                }
                else {
                    var table = $('#tblList').DataTable();
                    table.row($("#btnName" + ScriptCode).parents('tr')).remove().draw(false);
                    //alert("Script deleted successfully.");
                    ShowAlertMessage(1, "Script deleted successfully.");
                    return false;
                }

            }
        });
    }

}



function buySellPopUp(ScriptCode, no, ScriptSymbol) {

    $('#btnProceedBuySell').removeAttr('disabled');

    debugger;
    var CurrentPosition = "";
    if (no == 1) {
        CurrentPosition = 'Buy';
    }
    else if (no == 2) {
        CurrentPosition = 'Sell';
    }
    else {
        return false;
    }


    $("#lblScriptSymbol").text(ScriptSymbol.toString());
    $("#lblScriptCode").text(ScriptCode.toString());
    $("#lblCurrentPosition").text(CurrentPosition);
    $("#buySellModel").modal('show');
    //ProceedBuySell();

}

function ProceedBuySell() {

    //var isvalid = $('#formPopup').validate();
    //if (!isvalid) {
    //    return false;
    //}

    //debugger;
    var ScriptCode = $("#lblScriptCode").text();
    var CurrentPosition = $("#lblCurrentPosition").text();

    var target = $("#txtTarget").val();
    var stopLoss = $("#txtStopLoss").val();

    if (ScriptCode == null || ScriptCode == "" ||
        CurrentPosition == null || CurrentPosition == "") {
        alert("Please enter correct details");
        return;
    }

    var allUsers = document.getElementById("chkAllUsers").checked;
    //document.getElementById("btnProceedBuySell").disabled = true;

    //var result = confirm("Are you sure you want to proceed?");
    if (ScriptCode > 0 && intWID > 0) {
        var request = $.ajax({
            url: "/Watchlist/ProceedBuySell",
            type: "POST",
            data: { intWID: intWID, ScriptCode: ScriptCode, CurrentPosition: CurrentPosition, allUsers: allUsers },
            dataType: 'json',
            traditional: true,
            success: function (data) {
                var results = JSON.parse(data);

                if (results.IsError) {
                    //alert("An Error occurred while deleting a record, please try again!");
                    ShowAlertMessage(2, "");
                    return false;
                }
                else {
                    //var table = $('#tblList').DataTable();
                    //table.row($("#btnName" + ScriptCode).parents('tr')).remove().draw(false);
                    //alert("Script deleted successfully.");
                    ShowAlertMessage(1, "Order placed successfully.");
                    HidePopUp();
                    return false;
                }

            }
        });
    }

    $('#btnProceedBuySell').removeAttr('disabled');
}

function setScriptObject() {
    var ScriptCodeString = '';
    var table = $('#tblList').DataTable();
    var scriptsdata = table.rows().data();
    for (var i = 0; i < scriptsdata.length; i++) {
        if (i == scriptsdata.length - 1) {
            ScriptCodeString = ScriptCodeString + scriptsdata[i][1];
        }
        else {
            ScriptCodeString = ScriptCodeString + scriptsdata[i][1] + ',';
        }
    }
    var script = {
        ScriptCodeString: ScriptCodeString,
    }
    return script;

}

function AutoCompleteUser() {

    //start
    $("#txtUser").autocomplete({

        source: function (request, response) {

            $.ajax({
                url: "/Strategy/GetUserList",
                type: "GET",
                dataType: "json",
                data: { Search: request.term },
                success: function (data) {
                    response($.map(data, function (item) {
                        return { label: item.Email, value: item.Email };
                    }))

                }
            })
        },
        messages: {
            noResults: "", results: ""
        },
        minLength: 3,
        select: function (event, ui) {
            $(this).val(ui.item.value);
            var Type = getQueryStringValue('Type');
            var ID = getQueryStringValue('ID');
            if (Type == 'Copy' && ($('#Watchlistname').val() != '' || $('#Watchlistname').val() == undefined ||
                $('#Watchlistname').val() == null) && ($('#txtUser').val() != '' || $('#txtUser').val() == undefined || $('#txtUser').val() == null)
                && ID == intWID) {

                CopyWatchList();
            }
        }

    });

    $("#txtUser").change(function () {
        var Type = getQueryStringValue('Type');
        if (Type == 'Copy' && ($('#Watchlistname').val() != '' || $('#Watchlistname').val() == undefined || $('#Watchlistname').val() == null) && ($('#txtUser').val() != '' || $('#txtUser').val() == undefined || $('#txtUser').val() == null)) {

            CopyWatchList();
        }
    });

    function CopyWatchList() {
        var Watchlistname = $("#Watchlistname").val();
        if (Watchlistname == '' || Watchlistname == undefined || Watchlistname == null) {
            $('#lblWatchlistName').show();
            return false;
        }

        var txtUser = null; //it will fetch logged in user
        var hdnIsAdmin = $("#hdnIsAdmin").val();
        if (hdnIsAdmin == "1") {
            txtUser = $("#txtUser").val();
        }
        var request = $.ajax({
            url: "/Watchlist/SaveCopyWatchList",
            type: "POST",
            data: { intFromWID: intWID, Watchlistname: Watchlistname, txtUser: txtUser },
            dataType: 'json',
            traditional: true,
            success: function (data) {
                var results = JSON.parse(data);

                if (results.IsExist) {
                    $("#txtScript").val("");
                    //alert("Duplicate record.");
                    ShowAlertMessage(2, "Duplicate record.");
                    return false;
                }
                if (results.intWID > 0) {
                    ShowAlertMessage(1, "Record save successfully");
                    intWID = results.intWID;
                    window.location.url("~/WatchList/AddWatchList?ID=" + intWID);
                }
                if (results.IsError) {
                    $("#txtScript").val("");
                    //alert("An Error occurred while saving a record, please try again!");
                    ShowAlertMessage(2, "");
                    return false;
                }

                if (!results.IsError && results.ScriptCode != '' && results.ScriptCode != null) {
                    intWID = results.intWID;
                    setScriptDetails(results);
                    $("#txtScript").val("");
                    //alert("Record added");
                    ShowAlertMessage(1, "");
                    return false;
                }
            }
        });

    }
    //end

}

function SetDataCommonCode() {

    var Type = getQueryStringValue('Type');
    if (Type == "Manual") {
        $(".btn-delete").css("display", "none");
        $(".btn-Buy").css("display", "");
        $(".btn-Sell").css("display", "");
    }
    else {
        $(".btn-delete").css("display", "");
        $(".btn-Buy").css("display", "none");
        $(".btn-Sell").css("display", "none");
    }
}

function HidePopUp() {
    $("#buySellModel").modal('hide');
}
$("#txtSize").keyup(function () {
    var value = parseInt($("#txtSize").val());
    if (value < 1) {
        $("#txtSize").val("1");
    }
});

function SwitchDataTheme() {
    var data = localStorage.getItem('IsDark');
    if (data == 'NO') {
    }
    else {
        $('.content-wrapper').css({ 'background-color': 'black', 'color': 'white' });
        $('.datatableheader').css('background-color', 'var(--main-color-on-layoutchange)');
        $('li').css('color', 'white');
        $('.content-header>.breadcrumb>li>a').css('color', 'white');
        $('#mainWindow').css('background-color', 'black');
        $('.box-title').css('color', 'white');
        $('#tblList').removeClass('table-striped');
        $('input').css({ 'border': '2px solid var(--main-color-on-layoutchange)', 'color': 'white', 'background-color': 'black' });
        $('.form-control').css({ 'border': '2px solid var(--main-color-on-layoutchange)', 'color': 'white', 'background-color': 'black' });
        $('li.disabled > a').css({ 'background-color': 'black', 'color': 'white' });
        $('.main-footer').css({ 'background-color': 'black', 'color': 'white' });
        $('.table-bordered>thead>tr>th, .table-bordered>tbody>tr>th, .table-bordered>tfoot>tr>th, .table-bordered>thead>tr>td, .table-bordered>tbody>tr>td, .table-bordered>tfoot>tr>td').css('border', '1px solid var(--main-color-on-layoutchange)');
        $('.table-bordered').css('border', '1px solid var(--main-color-on-layoutchange)');
        $('.dataTables_empty').css({ 'border-top-color': 'black', 'background-color': 'black' });
        $('.sorting_1').css({ 'border': '1px solid var(--main-color-on-layoutchange)', 'height': '35px' });

        var NewUI = '';
        if (MySkin.SkinName != '') {
            NewUI = MySkin.SkinName;
        }
        else {
            if (typeof (Storage) !== 'undefined') {
                NewUI = localStorage.getItem('skin');
            }
        }
        if (NewUI == 'skin-black' || NewUI == 'skin-black-light') {
            $('.datatableheader').css('color', 'black');
            $('input[disabled],input[readonly]').css({ 'background-color': 'gray', 'color': 'black' });
            $('input[readonly]').css('cursor', 'not-allowed');
            $('input[readonly] .form-control').css('cursor', 'not-allowed');
        }
        else {
            $('.datatableheader').css('color', 'white');
            $('input[disabled]').css('background-color', 'var(--main-color-on-layoutchange)');
            $('input[readonly]').css('background-color', 'var(--main-color-on-layoutchange)');
            $('input[readonly]').css('cursor', 'not-allowed');
            $('input[readonly] .form-control').css('cursor', 'not-allowed');
        }
    }
}