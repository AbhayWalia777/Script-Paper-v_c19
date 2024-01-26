
$(document).ready(function () {
    $('#Drp-Symbol').html("");
    $('.select2').select2();
    $('#btn-cancel').click(function () {
        $("#br_pageModal").modal('hide');
    });
    $('#broker_table').dataTable({
        "paging": false,
        "lengthChange": false,
        "info": false,
        "ordering": true,
        "seaching": true,
        "responsive": true
    });
    $("#chkScriptWise").on('click', function () {
        var x = $(this).is(':checked');
        if (x == true) {
            $(this).parents("#hidedroupdown").find('#scriptDrop').show();
        }
        else {
            $(this).parents("#hidedroupdown").find('#scriptDrop').hide();
        }
    });
    $('#NrmlPercent').keyup(function () { $('#NrmlFix').val('0'); });
    $('#NrmlFix').keyup(function () { $('#NrmlPercent').val('0'); });
    $('#MisPercent').keyup(function () { $('#MisFix').val('0'); });
    $('#MisFix').keyup(function () { $('#MisPercent').val('0'); });

    GetBrokerageData();
    SetScriptNameData();
});
$(document).on('change', '#UserIdsAllUsers', function () {
    GetBrokerageData();
});
function text(x) {
    if (x == 1) {
        $('#fix-trade').show();
        $('#pre-trade').hide();
    }

    else if (x == 0) {
        $('#fix-trade').hide();
        $('#pre-trade').show();
    }
}
function GetBrokerageData() {
    if ($('#UserIdsAllUsers option:selected').text() != "") {
        var UserID = $('#UserIdsAllUsers').val();
        $.ajax({
            url: "/Admin/GetBrokerageList",
            type: "GET",
            dataType: "json",
            data: { 'UserId': UserID },
            success: function (data) {
                var TblBrokerageList = $('#broker_table').DataTable();
                TblBrokerageList.clear().draw();
                TblBrokerageList.innerHTML = "";
                for (var i = 0; i < data.length; i++) {
                    var inputdata = data[i];
                    SetBrokerageData(inputdata);
                }
            }
        });
    }
}
function SetBrokerageData(item) {
    var FixedValue = item.objTradeScriptWise.IsFixed ? item.objTradeScriptWise.FixOrPerValue : 0;
    var PercentageValue = item.objTradeScriptWise.IsPercentage ? item.objTradeScriptWise.FixOrPerValue : 0;

    var ScriptExchangestring = '\'' + item.ScriptExchangestring + '\'';
    var ScriptExchange= '\'' + item.ScriptExchange + '\'';
    var ScriptName = item.objTradeScriptWise.ScriptName != null ? '\'' + item.objTradeScriptWise.ScriptName + '\'' : "''";

    var deleteButton = '<a class="fa CrossButton" onclick="DeleteBrokerage(' + item.UserId + "," + ScriptExchangestring + "," + ScriptName + ')"></a>';
    //EditBrokerage(segment, segmentScript, scriptName, NrmlPercent, NrmlFix, MisFix, MisPercentage)
    var EditButton = '<a class="" onclick="EditBrokerage(' + ScriptExchange + "," + ScriptExchangestring + "," + ScriptName + "," + item.objTradeScriptWise.NrmlPercentage + "," + item.objTradeScriptWise.NrmlFixed + "," + item.objTradeScriptWise.MisFixed + "," + item.objTradeScriptWise.MisPercentage + ')">EDIT</a>';

    $('#broker_table').DataTable().row.add([
        item.ScriptExchange,
        "NO",
        item.objTradeScriptWise.ScriptName,
        item.objTradeScriptWise.NrmlPercentage,
        item.objTradeScriptWise.MisPercentage,
        item.objTradeScriptWise.NrmlFixed,
        item.objTradeScriptWise.MisFixed,
        EditButton,
        deleteButton
    ]).draw();
}
$(document).on('change', '#Drp-Segment', function () {
    if ($('#Drp-Segment option:selected').text() != "")
        SetScriptNameData();
});
function SetScriptNameData() {
    var Tempscriptname = $('#Drp-Segment option:selected').text() != "" ? $('#Drp-Segment').val() : "";
    var Wid = $('#Drp-Segment option:selected').text() != "" ? Tempscriptname.split('_')[0] : "";
    var ScriptInstrumentType = $('#Drp-Segment option:selected').text() != "" ? Tempscriptname.split('_')[1] : "";
    var input = { 'ScriptExchange': Wid, 'ScriptInstrumentType': ScriptInstrumentType };

    var request = $.ajax({
        url: "/Trade/GetScriptNameWithExchangeName",
        type: "GET",
        data: input,
        dataType: 'json',
        async: true,
        success: function (data) {
            SetNameResult(data);
        }
    });
}
function SetNameResult(results) {
    $('#Drp-Symbol').html('');
    if (results != null) {
        //Set data for WatchList trade
        if (results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                var result = results[i].ScriptName;
                $('#Drp-Symbol').append(new Option(result, result));
            }
            $('#Drp-Symbol').val(null).trigger('change');
        }
        else {
            $('#Drp-Symbol').html('');
        }

    }
}
function DeleteBrokerage(UserID, ScriptExchange, ScriptName) {
    var input = { 'UserID': UserID, 'ScriptExchange': ScriptExchange, 'ScriptName': ScriptName };
    var request = $.ajax({
        url: "/Admin/DeleteBrokerage",
        type: "GET",
        data: input,
        dataType: 'json',
        async: true,
        success: function (data) {
            toastr.success('Record has been deleted successfully!');
            GetBrokerageData();
        }
    });
}
function EditBrokerage(segment,segmentScript, scriptName, NrmlPercent, NrmlFix, MisFix, MisPercentage) {
    //$('select').attr('disabled', 'disabled');
    $('#Drp-Segment option[value=' + segmentScript + ']').attr('selected', 'selected');
    $('#Drp-Symbol').html('<option value="' + scriptName + '">' + scriptName+'</option>');
    $('#NrmlPercent').val(NrmlPercent);
    $('#NrmlFix').val(NrmlFix);
    $('#MisPercent').val(MisPercentage);
    $('#MisFix').val(MisFix);

}
$('#save-btn').on('click', function () {
    $('#objTradeScriptWise_FromPage').val('Brokerage');
    $('#ManageUserForm').submit();
});