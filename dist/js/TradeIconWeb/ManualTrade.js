$(document).ready(function () {
    $('#mytable').DataTable({
        "paging": false,
        "lengthChange": false,
        "info": false,
        "ordering": false,
        "searching": true,
        "responsive": true
    });
    $('.classDate').inputmAsk('mm/dd/yyyy', { 'placeholder': 'mm/dd/yyyy' });

    $('.classDate').datepicker({
        autoclose: true,
        useCurrent: true,
        todayHighlight: true,
        todayBtn: "linked",
    });
    $('.blank1').select2({
        placeholder: "Select Segment",
        allowClear: true
    });
    $('.blank2').select2({
        placeholder: "Select Valan",
        allowClear: true
    });
    $('#Drp-Segments-ScriptName').select2();
    $('.blank1').val(null).trigger('change');
    GetData();
    SetScriptNameData();
    $(document).on('change', "#Drp-Segments", function () {
        SetScriptNameData();

    });
    $('#btnSubmit').on('click', function () {

        var Tempscriptname = $('#Drp-Segments option:selected').text() != "" ? $('#Drp-Segments').val() : "";
        var ScriptExchange = $('#Drp-Segments option:selected').text() != "" ? Tempscriptname.split('>')[0] : "";
        var ScriptInstumentType = $('#Drp-Segments option:selected').text() != "" ? Tempscriptname.split('>')[1] : "";
        var startDate = $('#rptStartDate').val() == "" ? "" : $('#rptStartDate').val();
        var scripttradingsymbol = $('#Drp-Segments-ScriptName').val();
        var closingprice = $('#txtclosingrates').val();
        if (ScriptExchange != "" && startDate != "" && scripttradingsymbol != "" && closingprice != "") {

            var request = $.ajax({
                url: "/Trade/ManualCloseTradeScriptWise",
                type: "POST",
                data: { ScriptExchange: ScriptExchange, ScriptInstrumentType: ScriptInstumentType, Date: startDate, ScriptTradingSymbol: scripttradingsymbol, ClosePrice: closingprice },
                dataType: 'json',
                async: true,
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
                    GetData();
                }
            });
        }
        else { toastr.error("Please Fill All Required Details."); }

    });
});

function GetData() {
    $.ajax({
        type: 'Get',
        datatype: 'json',
        url: '/Trade/GetAllManualOrderLog',
        success: function (lstData) {
            //var lstData = JSON.parse(response);
            var mytable = $('#mytable').DataTable();
            mytable.clear().draw();
            mytable.innerHTML = "";
            if (lstData.length > 0) {
                $("tbody td").css("white-space", "nowrap");
                for (var i = 0; i < lstData.length; i++) {
                    var result = lstData[i];
                    SetAllUsersDetails(result);
                }
            }
            else {
                TotalPageNo = 0;
            }

        },
        error: function (response) {
            console.log(response);
        }
    });
}
function SetAllUsersDetails(item) {
    var table = $('#mytable').DataTable().row.add([
        item.OrderDate,
        item.ObjScriptDTO.ScriptExchange,
        item.TradeSymbol,
        item.OrderPrice
    ]).order([0, 'desc']).draw();

}
function SetScriptNameData() {
    var Tempscriptname = $('#Drp-Segments option:selected').val();
    var WID = Tempscriptname.split('>')[0];
    var ScriptInstrumentType = Tempscriptname.split('>')[1];
    var startDate = $('#DrpDate').val() == "" ? "" : $('#DrpDate').val();
    var input = { 'ScriptExchange': WID, 'ScriptInstrumentType': ScriptInstrumentType, 'Date': startDate };
    var request = $.ajax({
        url: "/Trade/GetScriptExchangeNameWithExchangeName",
        type: "GET",
        data: input,
        dataType: 'json',
        async: true,
        success: function (data) {
            SetSNameResult(data);
        }
    });
}
function SetSNameResult(results) {
    //var results = JSON.parse(data);
    $('#Drp-Segments-ScriptName').html('');
    if (results != null) {
        //Set data for WatchList trade
        if (results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                var result = results[i].TradeSymbol;
                $('#Drp-Segments-ScriptName').append(new Option(result, result));
            }
        }
        else {
            $('#Drp-Segments-ScriptName').html('');
        }
    }
}