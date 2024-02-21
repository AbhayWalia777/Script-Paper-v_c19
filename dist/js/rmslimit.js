$(document).ready(function () {
    var tblRmsList = $("#tblRmsList").DataTable({
        "responsive": true,
    });
    var scriptExchangeWise = document.getElementById("IsScriptExchangeWise");
    if (scriptExchangeWise.checked)
        $("#scriptExchangePerQtyDiv").show();
    else
        $("#scriptExchangePerQtyDiv").hide();
    $("#chkIsDefault").on('change', function () {
        if ($(this).is(":checked")) {
            $("#UserDiv").hide();
        } else {
            $("#UserDiv").show();
        }
    });

    $('#chkEnableRMS').on('change', function () {
        var isChecked = $(this).is(":checked");
        if (isChecked == true) {
            if (confirm('Once enable/disable you can only trade with listed trade rules below')) {
                $(this).prop('checked', true);
                $.ajax({
                    url: "/Admin/EnableRMS",
                    type: "GET",
                    dataType: "json",
                    data: { IsRMSEmable: isChecked },
                    success: function (data) {
                        alert(data);
                    },
                });
            }
            else {
                $(this).prop('checked', false);
            }
        }
        else {
            if (confirm('Once enable/disable you can only trade with listed trade rules below')) {
                $(this).prop('checked', false);
                $.ajax({
                    url: "/Admin/EnableRMS",
                    type: "GET",
                    dataType: "json",
                    data: { IsRMSEmable: isChecked },
                    success: function (data) {
                        toastr.success(data);
                    },
                });
            }
            else {
                $(this).prop('checked', true);
            }
        }

    });


    $("#chkIsCircuitAdded").on('change', function () {
        if ($(this).is(":checked")) {
            $(".circuitdiv").show();
        } else {
            $(".circuitdiv").hide();
        }
    });
    $("#IsScriptExchangeWise").on('change', function () {
        if ($(this).is(":checked")) {
            $("#scriptNameDiv").hide();
            $("#scriptExchangePerQtyDiv").show();
        } else {
            $("#scriptNameDiv").show();
            $("#scriptExchangePerQtyDiv").hide();
        }
    });

    $("#cboRiskType").on('change', function () {
        var selectedValue = $(this).val();
        if (selectedValue == 1) {
            $(".rmstypePrice").hide();
            $(".rmstypeQuantity").show();
        }
        else if (selectedValue == 2) {
            $(".rmstypeQuantity").hide();
            $(".rmstypePrice").show();
        }
        else {
            $(".rmstypeQuantity").hide();
            $(".rmstypePrice").hide();
        }
    });


    $("#txtUser").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "/Strategy/GetUserListForRms",
                type: "GET",
                dataType: "json",
                data: { Search: request.term },
                success: function (data) {
                    response($.map(data, function (item) {
                        return { label: item.label, value: item.value, id: item.id };
                    }));
                }
            });
        },
        messages: {
            noResults: "", results: ""
        },
        multiple: true,
        minLength: 2,
        focus: function (event, ui) {
            //event.preventDefault();
            //$(this).val(ui.item.label);
        },
        select: function (event, ui) {
            console.log(ui.item.id);
            $("#hdnUserId").val(ui.item.id)

        }
    });

    $("#txtScriptName").autocomplete({
        source: function (request, response) {
            _ScriptExchange = $('#cboScriptExchange').val();
            $.ajax({
                url: "/Watchlist/GetScriptList",
                type: "GET",
                dataType: "json",
                data: { Search: request.term, ScriptExchange: _ScriptExchange },
                success: function (data) {
                    response($.map(data, function (item) {
                        return { label: item.ScriptTradingSymbol, value: item.ScriptTradingSymbol, code: item.ScriptCode };
                    }));
                }
            });
        },
        messages: {
            noResults: "", results: ""
        },
        multiple: true,
        minLength: 2,
        focus: function (event, ui) {
            //event.preventDefault();
            //$(this).val(ui.item.label);
        },
        select: function (event, ui) {
            $("#hdnScriptCode").val(ui.item.code)

        }
    });
});
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
        $('#tblRmsList').removeClass('table-striped');
        $('.form-control').css({'border':'2px solid var(--main-color-on-layoutchange)','color':'white','background-color':'black'});
        $('.dataTables_empty').css({'border-top-color':'black','background-color':'black'});
        $('li.disabled > a').css({'background-color':'black','color':'white'});
        $('.main-footer').css({'background-color':'black','color':'white'});
        $('#ui-id-2').css({'background-color':'black','color':'white'});
        $('.table-bordered>thead>tr>th, .table-bordered>tbody>tr>th, .table-bordered>tfoot>tr>th, .table-bordered>thead>tr>td, .table-bordered>tbody>tr>td, .table-bordered>tfoot>tr>td').css('border','1px solid var(--main-color-on-layoutchange)');
        $('.table-bordered').css('border','1px solid var(--main-color-on-layoutchange)');
        $('input').css({'border':'2px solid var(--main-color-on-layoutchange)','background-color':'black','color':'white'});
        $('.box-primary').css('background-color','black');
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
        $('.datatableheader').css('color','black');
        }
        else
        {
        $('.fixed-column').css('color','white');
        $('.datatableheader').css('color','white');
        }
    }
}