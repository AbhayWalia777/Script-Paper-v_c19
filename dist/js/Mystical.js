var myInterval;
$(document).ready(function () {
    $('#tblList').DataTable();

    SetDataOnLoad();
    $('#cboWatchlist').on('change', function (e) {
        SetDataOnLoad();
    });
});

function OnSaveDetailData() {

    var script = $("#txtScript").val()
    if (script != null && script != '' && script != undefined) {
        var request = $.ajax({
            url: "/Mystical/GetScript",
            type: "GET",
            data: { script: script },
            dataType: 'json',
            traditional: true,
            success: function (data) {
                var results = JSON.parse(data);
                if (results.ScriptCode != '' && results.ScriptCode != null) {
                    setScriptDetails(results);
                    $("#txtScript").val('');
                }
            }
        });
    }
}

function setScriptDetails(item) {
    var btnName = 'btn';
 if($("#companyINitial").val() == "RT" && item.ScriptExchange == "FOREX")
    {
    item.open=(item.open).toFixed(5);
    item.high=(item.high).toFixed(5);
    item.low=(item.low).toFixed(5);
    item.Lastprice=(item.Lastprice).toFixed(5);
    item.ObjStrategyFormulaDTO.Buy=(item.ObjStrategyFormulaDTO.Buy).toFixed(5);
    item.ObjStrategyFormulaDTO.BT2=(item.ObjStrategyFormulaDTO.BT2).toFixed(5);
    item.ObjStrategyFormulaDTO.Sell=(item.ObjStrategyFormulaDTO.Sell).toFixed(5);
    item.ObjStrategyFormulaDTO.ST2=(item.ObjStrategyFormulaDTO.ST2).toFixed(5);
    }
    $('#tblList').DataTable().row.add([
          //item.ScriptName,
          //item.ScriptCode,
          item.ScriptTradingSymbol,
          item.open,
          item.high,
          item.low,
          //item.close,
          item.Lastprice,
          item.ObjStrategyFormulaDTO.Buy,
          item.ObjStrategyFormulaDTO.BT2,
          item.ObjStrategyFormulaDTO.Sell,
          item.ObjStrategyFormulaDTO.ST2
    ]).draw();
}

function OnSetData(ID) {
    //debugger
    try {
        var request = $.ajax({
            url: "/Mystical/OnSetData",
            type: "GET",
            data: { ID: ID },
            dataType: 'json',
            traditional: true,
            success: function (data) {
                var results = JSON.parse(data);
                var table = $('#tblList').DataTable();
                table.clear();
                if (results != null) {
                    for (var i = 0; i < results.length; i++) {
                        var result = results[i];
                        setScriptDetails(result);
                    }
                    $("#txtScript").val('');
                    $("#txtWname").val(results[0].Watchlistname);
                }
                var Type = getQueryStringValue('Type');
                if (ID != "" && ID != "0") {

                    //setTimeout(function () {
                    //    OnSetDataForRefresh(ID);
                    //}, 1000 * 1);
                    myInterval = setInterval(function () { OnSetDataForRefresh(ID); }, 1000);
                }
                $("form :input").prop("disabled", false);
                $("#tblList_filter :input").prop("disabled", false);
                $("#tblList_length :input").prop("disabled", false);
            }
        });
    } catch (e) {
        alert("Error On OnSetData.")
    }
}

function OnSetDataForRefresh(ID) {
    try {
        var request = $.ajax({
            url: "/Mystical/OnSetData",
            type: "GET",
            data: { ID: ID },
            dataType: 'json',
            traditional: true,
            success: function (data) {
                var results = JSON.parse(data);
                var table = $('#tblList').DataTable();
                table.clear();
                if (results != null) {
                    for (var i = 0; i < results.length; i++) {
                        var result = results[i];
                        setScriptDetails(result);
                    }
                }
                var Type = getQueryStringValue('Type');

                if (Type == "View") {
                    //$("form :input").prop("disabled", true);
                    $("#tblList_filter :input").prop("disabled", false);
                    $("#tblList_length :input").prop("disabled", false);
                }
            }
        });
    } catch (e) {
        alert("Error On OnSetData.")
    }
}

function SetDataOnLoad()
{
    clearInterval(myInterval);
    var ID = $('#cboWatchlist').val();
    if (ID > 0) {
        OnSetData(ID);
    }
}
function SwitchDataTheme() {
        var data = localStorage.getItem('IsDark');
        if (data == 'NO') {
                          }
    else {
        $('.content-wrapper').css({'background-color': 'black' ,'color' : 'white'});
        $('.content').css({'background-color': 'black' ,'color' : 'white'});
        $('.box-default').css({'background-color': 'black' ,'color' : 'white'});
        $('.datatableheader').css('background-color','var(--main-color-on-layoutchange)');
        $('li').css('color','white');
        $('.content-header>.breadcrumb>li>a').css('color','white');
        $('#mainWindow').css('background-color','black');
        $('.box-title').css('color','white');
        $('#tblList').removeClass('table-striped');
        $('li.disabled > a').css({'background-color':'black','color':'white'});
        $('.main-footer').css({'background-color':'black','color':'white'});
        $('.table-bordered>thead>tr>th, .table-bordered>tbody>tr>th, .table-bordered>tfoot>tr>th, .table-bordered>thead>tr>td, .table-bordered>tbody>tr>td, .table-bordered>tfoot>tr>td').css('border','1px solid var(--main-color-on-layoutchange)');
        $('.table-bordered').css('border','1px solid var(--main-color-on-layoutchange)');
        $('input').css({'border':'2px solid var(--main-color-on-layoutchange)','color':'white','background-color':'black'});
        $('.form-control').css({'border':'2px solid var(--main-color-on-layoutchange)','color':'white','background-color':'black'});
        $('.dataTables_empty').css({'border-top-color':'black','background-color':'black'});
        $('.sorting_1').css({'border':'1px solid var(--main-color-on-layoutchange)','height':'35px'});
var NewUI='';
        if (MySkin.SkinName != '')
        {
        NewUI = MySkin.SkinName;
        }
        else
        {
        if (typeof (Storage) !== 'undefined') {
            NewUI = localStorage.getItem('skin');
        }
        }
          if (NewUI == 'skin-black' || NewUI == 'skin-black-light') {
                $('.datatableheader').css('color','black');
                $('input[disabled],input[readonly]').css({'background-color':'gray','color':'black'});
                $('input[readonly]').css('cursor','not-allowed');
                $('input[readonly] .form-control').css('cursor','not-allowed');
                }
                else
                {
                    $('.datatableheader').css('color','white');
                    $('input[disabled]').css('background-color','var(--main-color-on-layoutchange)');
                    $('input[readonly]').css('background-color','var(--main-color-on-layoutchange)');
                    $('input[readonly]').css('cursor','not-allowed');
                    $('input[readonly] .form-control').css('cursor','not-allowed');
                }
    }
}