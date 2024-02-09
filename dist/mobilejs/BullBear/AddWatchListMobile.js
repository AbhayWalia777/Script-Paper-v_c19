    function getQueryStringValue(key) {
        return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    }
    var intWID = 0;
    $(document).ready(function () {
        $('#txtScriptExpiryDate').inputmask('mm/dd/yyyy', { 'placeholder': 'mm/dd/yyyy' })
        $("#scriptNameDiv").hide();
        $('#txtScriptExpiryDate').datepicker({
            autoclose: true,
            useCurrent: true,
            todayHighlight: true,
            todayBtn: true,
            startDate: new Date(),
            todayBtn: "linked"
        });
        $('#backbtn').css('color', '#fff');
        $('#backbtn').on('click', function () {
            window.location.href = "/Watchlist/Index";
        });


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
                            return { label: item.ScriptTradingSymbol, value: item.ScriptTradingSymbol };
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
                if (SelectedscriptExchange != "NSE" && SelectedscriptExchange != "BSE" && SelectedscriptExchange != "") {
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
                            toastr.success("Record updated successfully");
                            OnSetData(ID);
                        }
                        else {
                            toastr.error("Something went wroung");
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

        $(document).on('change', '#chkisActiveAll', function () {
            if (intWID != 0) {
                var input = { 'WID': intWID, 'ScriptCode': '0', 'isActive': $(this).prop('checked') }
                $.ajax({
                    url: "/Watchlist/updateActiveStatus",
                    type: "GET",
                    dataType: "json",
                    data: input,
                    success: function (data) {
                        if (data > 0) {
                            toastr.success("Record updated successfully");
                            location.reload();
                        }
                        else {
                            toastr.error("Something went wroung");
                        }
                    }
                });
            }
        });


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
                data: { scriptTradingSymbol: scriptTradingSymbol, intWID: intWID, Watchlistname: Watchlistname, ScriptExchange: _ScriptExchange, txtUser: txtUser, Lot: Lot, Size: size, ForexPair: $("#ForexPair option:selected").text() },
                dataType: 'json',
                traditional: true,
                success: function (data) {
                    var results = JSON.parse(data);
                    if (results.IsError && results.ErrorMessage == "MaxLimit") {
                        $("#txtScript").val("");
                        //alert("Duplicate record.");
                        toastr.error("Max 50 Scripts Allowed");
                        return false;
                    }

                    if (results.IsExist) {
                        $("#txtScript").val("");
                        //alert("Duplicate record.");
                        toastr.error("Duplicate record.");
                        return false;
                    }

                    if (results.IsError) {
                        $("#txtScript").val("");
                        //alert("An Error occurred while saving a record, please try again!");

                        return false;
                    }

                    if (!results.IsError && results.ScriptCode != '' && results.ScriptCode != null) {
                        intWID = results.intWID;
                        setScriptDetails(results);
                        $("#txtScript").val("");
                        //alert("Record added");
                        toastr.success('Script Added Successfully');
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

        var Target = '<input type="text" id="txtTarget' + item.ScriptCode + '" class="form-control ui-autocomplete-input" />';
        var StopLoss = '<input type="text" id="txtStopLoss' + item.ScriptCode + '" class="form-control ui-autocomplete-input" />';
        var deleteButton = '<button id="btnName' + item.ScriptCode + '" onclick="removeScript(' + item.ScriptCode + ')" type="button" class="btn btn-danger btn-sm btn-delete"><i class="fa fa fa-trash-o"></i></button> ';
        var buyButton = '<button id="btnBuy' + item.ScriptCode + '" onclick="buySellPopUp(' + item.ScriptCode + ',1,' + symbolParam + ')" type="button" class="btn btn-success btn-sm btn-Buy"> Buy </button> ';
        var sellButton = '<button id="btnSell' + item.ScriptCode + '" onclick="buySellPopUp(' + item.ScriptCode + ',2,' + symbolParam + ')" type="button" class="btn btn-danger btn-sm btn-Sell"> Sell </button> ';
        var Lot = '<input type="text" class="form-control" id="txtLot"   style="width: 75px;"  readonly value=' + item.Lot + '>';
        var Size = '<input type="text" class="form-control" id="txtSize" style="width: 75px;" readonly value=' + item.Size + '>';
        var Checkbox = "";
        var favourites = "";
        if (item.isFavorite == 0) {
            favourites = '<a href="javascript:void(0)" class="checkFavorite" id="chkFavorite" data-ScriptCode=' + item.ScriptCode + ' title="Add To Favorites" style="margin-right:10px"><i class="fa fa-heart-o"></i></a>';
        }
        else {
            favourites = '<a href="javascript:void(0)" class="checkRemoveFavorite" id="chkRemoveFavorite" data-ScriptCode=' + item.ScriptCode + ' title="Remove From Favorites" style="margin-right:10px"><i class="fa fa-heart" style="bakground:red"></i></a>';
        }
        if (item.isActive == true) {
            Checkbox = '<input type="checkbox" class="checkScript" id="chkSelect" data-ScriptCode=' + item.ScriptCode + ' checked>'
        }
        else {
            Checkbox = '<input type="checkbox" class="checkScript" id="chkSelect" data-ScriptCode=' + item.ScriptCode + ' >'
        }
        var allButtons = deleteButton + buyButton + sellButton;

        //$('#tblList').DataTable().row.add([
        //    favourites + item.ScriptCode,
        //    item.ScriptTradingSymbol,
        //    item.open,
        //    item.high,
        //    item.low,
        //    item.close,
        //    item.Lastprice,
        //    Lot,
        //    Size,
        //    Checkbox,
        //    item.ScriptExchange,
        //    allButtons
        //]).draw();

        var finalTradingSymbol = "";
        if (item.Scripttype == "FOREX") {
            finalTradingSymbol = item.ScriptTradingSymbol + " / " + item.Scriptsegment;
        }
        else {
            finalTradingSymbol = item.ScriptTradingSymbol;
        }


        var html =
            '<div class="activeTradeRow" id=' + item.ScriptCode + '>' +
            '<div class="col-xs-12 col-sm-12" >' +
            '<div class="watchlist-card c-left-border watchlist-table-green">' +
            '<div class="card-body" style="padding:5px;">' +
            '   <div class="row">' +
            '<div class="col-xs-8 col-sm-8">' +
            '   <p class="watchlist-p" style="font-size: 14px; margin-bottom: 5px;">' + finalTradingSymbol + '</p>' +
            '</div>' +
            '<div class="col-xs-4 col-sm-4">' +
            '     <div class="row" style="margin-top:3px;">' +
            '          <div class="col-xs-3">' +
            '               <label class="watchlist-p" style="font-size: 12px"> ' + Checkbox + '</label>' +
            '          </div>' +
            '          <div class="col-xs-8">' +
            '               <label class="watchlist-p" style="font-size: 12px"> ' + deleteButton + '</label>' +
            '          </div>' +
            '     </div>' +
            '</div>' +
            '<div class="col-xs-12" >' +
            '  <p class="watchlist-p" style="font-size: 13px;  margin-bottom: 7px;margin-top:7px;"> EXCHANGE: ' + item.ScriptExchange + ' | Lot: ' + item.Lot + ' | SIZE: ' + item.Size + '</p>' +
            '  <p class="watchlist-p" style="font-size: 13px;  margin-bottom: 7px;margin-top:7px;"> O: ' + item.open + ' | H: ' + item.high + ' | L: ' + item.low + ' | C: ' + item.close + ' </p>' +
            '</div>' +
            '        </div>' +
            '     </div>' +
            '  </div>' +
            '</div >' +
            '</div >';

        $('#CompletedTradeDiv').append(html);

        SetDataCommonCode();

        //var table = document.getElementById("tblListBody");
        //if (item.Expireday != 4) {
        //    for (var i = 0; i < table.rows.length; i++) {
        //        if ($(table.rows[i].cells[0]).text() == item.ScriptCode) {
        //            if (item.Expireday == 0) {
        //                $(table.rows[i].cells[1]).append('<br /><span style="font-size:10px;color:red;"><b>(Expired)</b></span>')
        //            }
        //            else {
        //                $(table.rows[i].cells[1]).append('<br /><span style="font-size:10px;color:red;"><b>(Expires ' + item.Expireday + ' days)</b></span>');
        //            }
        //        }
        //    }
        //}
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

                    var totalRows = results.length;

                    var chkSelectCount = 0;
                    if (results != null) {

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
            toastr.error("Error On OnSetData.")
        }
    }


function removeScript(ScriptCode) {

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
                            toastr.error("Can't Delete This Record. There is one Active Trade");
                            return false;
                        }
                        else {
                            $("#" + ScriptCode).remove();
                            toastr.success("Script deleted successfully.");
                            return false;
                        }

                    }
                });
            }
        }
    });


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
            toastr.error("Please enter correct details");
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
                        toastr.error("Duplicate record.");
                        return false;
                    }
                    if (results.intWID > 0) {
                        toastr.success("Record save successfully");
                        intWID = results.intWID;
                        window.location.url("~/WatchList/AddWatchList?ID=" + intWID);
                    }
                    if (results.IsError) {
                        $("#txtScript").val("");
                        //alert("An Error occurred while saving a record, please try again!");

                        return false;
                    }

                    if (!results.IsError && results.ScriptCode != '' && results.ScriptCode != null) {
                        intWID = results.intWID;
                        setScriptDetails(results);
                        $("#txtScript").val("");
                        //alert("Record added");

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