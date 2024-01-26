var ActiveTradeInterval;
var ActiveTradeInterval1;
var CurrentActiveTradeID = 0;
var IsFindButtonClicked = false;
var StringUserID = 0;
var LaptopImage = '<i class="fa fa-laptop" style=" color: orangered; font-size: large; font-weight: bold;"></i>';
var MobileImage = '<i class="fa fa-mobile-phone" style="color: lawngreen; font-size: large; font-weight: bold;"></i>';
$(document).ready(function () {
    $(".loader").fadeOut(2000);
    $(".navbar").fadeIn(2000);
    $("#dashboard").fadeIn(2000);
    $("#show").click(function () {
        $(".popup").show();
    });
    $("#popupclose").click(function () {
        $(".popup").hide();
    });

   
    $('#Drp-Segment').select2({
        'placeholder': 'Segment',
        'allowClear': true
    });
    $('#DrpSegmentsScriptName').select2({
        'placeholder': 'Script',
        'allowClear': true
    });
    $('#Drp-Client').select2({
        'placeholder': 'Client',
        'allowClear': true
    });
    $(document).on('change', '#Drp-Segment', function () {
        if ($('#Drp-Segment option:selected').text() != "")
            SetScriptNameData();
        $('#DrpSegmentsScriptName').val(null).trigger('change');
    });
    $('#Drp-Segment').val(null).trigger('change');
    $('#Drp-Client').val(null).trigger('change');
    $('#DrpSegmentsScriptName').val(null).trigger('change');

   
   
    $("#TblTradesList").DataTable({
        "lengthChange": false,
        "order": false,
        "ordering": false,
        "searching": false,
        "paging": false,
        "responsive": true,
        "info": false
    });
    $("#TblOrderList").DataTable({
        "lengthChange": false,
        "order": false,
        "ordering": false,
        "searching": false,
        "paging": false,
        "responsive": true,
        "info": false
    });
    $("#TblExecuteList").DataTable({
        "lengthChange": false,
        "order": false,
        "ordering": false,
        "searching": false,
        "paging": false,
        "responsive": true,
        "info": false
    });
    GetTradeData();
    GetOrderData();
    ActiveTradeInterval1 = window.setInterval(function () { GetOrderData(); }, 5000);
});
// Completed data starts from here
function GetTradeData() {
    $.ajax({
        url: "/Trade/GetCompletedTradeForTradesPage",
        type: "GET",
        dataType: "json",
        data: { 'IsAdminWise': 1, "IsOrderLog": 1,"IsOnlyCurrentDay":true },
        success: function (data) {
            var TblTradesList = $('#TblTradesList').DataTable();
            TblTradesList.clear().draw();
            TblTradesList.innerHTML = "";
            for (var i = 0; i < data.length; i++) {
                var inputdata = data[i];
                SetTradeData(inputdata);
            }
            var Tradetable = document.getElementById("TblTradesBody");
            for (var i = 0; i < Tradetable.rows.length; i++) {
                if ($(Tradetable.rows[i].cells[4]).text() == 'BUYLIMIT') {
                    $(Tradetable.rows[i]).css("background-color", "lightblue");
                    $(Tradetable.rows[i].cells[4]).css({
                        "color": "blue",
                        "font-weight": "bold"
                    });
                    $(Tradetable.rows[i].cells[3]).css("font-weight", "bold");
                }
                else if ($(Tradetable.rows[i].cells[4]).text() == 'SELLLIMIT') {
                    $(Tradetable.rows[i]).css("background-color", "#f1a2a2");
                    $(Tradetable.rows[i].cells[4]).css({
                        "color": "#a50909",
                        "font-weight": "bold"
                    });
                    $(Tradetable.rows[i].cells[3]).css("font-weight", "bold");

                }
            }
        }
    });

}
function SetTradeData(item) {
    var OrderPlacedFrom = item.OrderPlacedFrom.toUpperCase() == "MOBILE" ? MobileImage : LaptopImage;
    $('#TblTradesList').DataTable().row.add([
        OrderPlacedFrom,
        item.ExitTime,
        item.UserName,
        item.TradeSymbol,
        item.CurrentPosition + "LIMIT",
        item.TRADING_UNIT_TYPE == 1 ? item.ScriptLotSize / item.Qty:"",
        item.Qty,
        item.ExitPrice
    ]).draw();
}
//Running Order data starts from here
function GetOrderData() {
    var UserId = $('#Drp-Client option:selected').text() != "" ? $('#Drp-Client').val() : 0;
    var Tempscriptname = $('#Drp-Segment option:selected').text() != "" ? $('#Drp-Segment').val() : "";
    var Wid = $('#Drp-Segment option:selected').text() != "" ? Tempscriptname.split('>')[0] : "";
    var ScriptInstrumentType = $('#Drp-Segment option:selected').text() != "" ? Tempscriptname.split('>')[1] : "";
    var ScriptName = $('#DrpSegmentsScriptName option:selected').text() != "" ? $('#DrpSegmentsScriptName').val() : "";
    var input = { 'UserId': UserId, 'scriptExchangeType': Wid, 'ScriptInstrumentType': ScriptInstrumentType, 'ScriptName': ScriptName };
    $.ajax({
        url: "/Trade/GetDataManageTransaction",
        type: "GET",
        dataType: "json",
        data: input,
        success: function (result) {
            var data = JSON.parse(result);
            if (data != null) {
                var TblOrderList = $('#TblOrderList').DataTable();
                TblOrderList.clear().draw();
                TblOrderList.innerHTML = "";
                var TblExecuteList = $('#TblExecuteList').DataTable();
                TblExecuteList.clear().draw();
                TblExecuteList.innerHTML = "";
                if (data.ActiveTrade.length > 0) {
                    for (var i = 0; i < data.ActiveTrade.length; i++) {
                        var inputdata = data.ActiveTrade[i];
                        var TableName = inputdata.Status.toUpperCase() != "COMPLETE" ? "TblOrderList" : "TblExecuteList";
                        SetOrderData(inputdata, TableName);
                    }
                }
                var Ordertable = document.getElementById("TblOrderListbody");
                for (var i = 0; i < Ordertable.rows.length; i++) {
                    if ($(Ordertable.rows[i].cells[4]).text() == 'BUYLIMIT') {
                        $(Ordertable.rows[i]).css("background-color", "lightblue");
                        $(Ordertable.rows[i].cells[4]).css({
                            "color": "blue",
                            "font-weight": "bold"
                        });
                    }
                    else if ($(Ordertable.rows[i].cells[4]).text() == 'SELLLIMIT') {
                        $(Ordertable.rows[i]).css("background-color", "#f1a2a2");
                        $(Ordertable.rows[i].cells[4]).css({
                            "color": "#a50909",
                            "font-weight": "bold"
                        });
                    }
                }
                var Executetable = document.getElementById("TblExecuteListbody");
                for (var i = 0; i < Executetable.rows.length; i++) {
                    if ($(Executetable.rows[i].cells[4]).text() == 'BUYLIMIT') {
                        $(Executetable.rows[i]).css("background-color", "lightblue");
                        $(Executetable.rows[i].cells[4]).css({
                            "color": "blue",
                            "font-weight": "bold"
                        });
                    }
                    else if ($(Executetable.rows[i].cells[4]).text() == 'SELLLIMIT') {
                        $(Executetable.rows[i]).css("background-color", "#f1a2a2");
                        $(Executetable.rows[i].cells[4]).css({
                            "color": "#a50909",
                            "font-weight": "bold"
                        });
                    }
                }
            }
        }
    });
}
function SetOrderData(item, TableName) {
    var OrderPlacedFrom = item.OrderPlacedFrom.toUpperCase() == "MOBILE" ? MobileImage : LaptopImage;
    $('#' + TableName).DataTable().row.add([
        OrderPlacedFrom,
        item.OrderTime,
        item.UserName,
        '<b>' + item.TradeSymbol + '</b>',
        item.CurrentPosition + "LIMIT",
        item.TRADING_UNIT_TYPE == 1 ? item.Qty / item.ObjScriptDTO.ScriptLotSize:"",
        item.Qty,
        item.OrderPrice
    ]).draw();
}

function SetScriptNameData() {
    var Tempscriptname = $('#Drp-Segment option:selected').text() != "" ? $('#Drp-Segment').val() : "";
    var Wid = $('#Drp-Segment option:selected').text() != "" ? Tempscriptname.split('>')[0] : "";
    var ScriptInstrumentType = $('#Drp-Segment option:selected').text() != "" ? Tempscriptname.split('>')[1] : "";
    var input = { 'ScriptExchange': Wid, 'ScriptInstrumentType': ScriptInstrumentType };


    var request = $.ajax({
        url: "/Trade/GetScriptNameWithExchangeName",
        type: "GET",
        data: input,
        dataType: 'json',
        async: true,
        success: function (results) {
            $('#DrpSegmentsScriptName').html('');
            if (results != null) {
                if (results.length > 0) {
                    for (var i = 0; i < results.length; i++) {
                        var result = results[i].ScriptName;
                        $('#DrpSegmentsScriptName').append(new Option(result, result));
                    }
                    $('#DrpSegmentsScriptName').val(null).trigger('change');
                }
                else {
                    $('#DrpSegmentsScriptName').html('');
                }

            }
        }
    });
}

