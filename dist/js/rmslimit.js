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