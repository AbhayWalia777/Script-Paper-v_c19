$(document).ready(function () {
    $('.select2').select2();
    $("#scriptNameDiv").hide();
    GetBanScriptData(0);
});

$(document).on('change', '#cboScriptExchange', function () {
    $("#txtScript").val("");

    if ($('#cboScriptExchange option:selected').text() != 'Select')
        $("#scriptNameDiv").show();
    else
        $("#scriptNameDiv").hide();

});

$(document).on('change', '#UserIds', function () {
    if ($('#UserIds option:selected').text() != '--Select--') {
        var userId = $('#UserIds').val();
        var username = $('#UserIds option:selected').text();
        GetBanScriptData(userId);
    }
});

function GetBanScriptData(UserId) {
    try {
        var input = "";
        input = { 'UserId': UserId };
        var request = $.ajax({
            url: "/Watchlist/GetBanScriptList",
            type: "GET",
            data: input,
            async: true,
            dataType: 'json',
            success: function (data) {
                SetResult(data);
            }
        });
    } catch (e) {
        alert("Error On SetBanScriptData.")
    }
}

function SetResult(item) {
    var results = JSON.parse(item);

    //#region Set data for Ban Script Table
    if (results != null) {
        var tblBanScriptList = $('#BanScriptList').DataTable();
        tblBanScriptList.clear().draw();
        tblBanScriptList.innerHTML = "";
        $("#BanScriptListdiv").html('');
        if (results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                SetScripBanDetails(result);
            }
        }
    }
}
function SetScripBanDetails(item) {
    var deleteButton = '<button id="btnName' + item.BanScriptId + '" onclick="removeScript(' + item.BanScriptId + ')" type="button" style="float:right" class="btn btn-danger btn-sm btn-delete"><i class="fa fa fa-trash-o"></i></button> ';
    var css = "row-New-Theme watchlistRow";
    var html = '<div class="row activeTradeRow" data-id=' + item.BanScriptId + '>' +
        '<div class="col-12" >' +
        '<div class="' + css + '">' +
        '<div class="card-body" style="padding:15px;">' +
        '   <div class="row">' +
        '<div class="col-8">' +
        ' <p class="watchlist-p" style="font-size: 14px; margin-bottom: 5px; Padding-left:15px;Padding-right:55px"> ID: ' + item.BanScriptId + '</p>' +
        '</div>' +
        '<div class="col-4">' +
        ' <p class="watchlist-p" style="font-size: 14px; margin-bottom: 5px; Padding-left:15px"> ' + deleteButton + '</p>' +
        '</div>' +
        '</div > ' +
        '   <div class="row">' +
        '<div class="col-12">' +
        ' <p class="watchlist-p" style="font-size: 14px; margin-bottom: 5px;Padding-left:15px"> Email: ' + item.Email + '</p>' +
        '</div>' +
        '</div > ' +

        '<div class="col-12" >' +
        '<p class="watchlist-p" style="font-size: 14px;  margin-bottom: 7px;margin-top:7px;">Script Exchange: ' + item.ScriptExchange + '</p>' +
        '</div >' +
        '<div class="col-12" >' +
        '<p class="watchlist-p" style="font-size: 14px;  margin-bottom: 7px;margin-top:7px;">ScriptName :' + item.ScriptName + '</p>' +
        '</div >' +
        '</div >' +
        '</div >' +
        '</div >';
    $('#BanScriptListdiv').append(html);
}

$("#txtScript").autocomplete({
    source: function (request, response) {
        var _ScriptExchange = $('#cboScriptExchange').val();
        var _ScriptSegment = "";
        var _ScriptExpiry = "";
        var _ScriptStrike = "";
        $.ajax({
            url: "/Watchlist/GetScriptListWithSegment",
            type: "GET",
            dataType: "json",
            data: { Search: request.term, ScriptExchange: _ScriptExchange, ScriptSegment: _ScriptSegment, ScriptExpiry: _ScriptExpiry, ScriptStrike: _ScriptStrike },
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
    }
});


function removeScript(BanScriptId) {
    newconfirmMobile("Delete This Record", function () {
        var resp = $('body').find('.cresp').html();
        $('body').find('.cresp').remove();
        if (resp == 'Yes') {
            if (resp && BanScriptId > 0) {
        var request = $.ajax({
            url: "/Watchlist/DeleteBanScript",
            type: "POST",
            data: { BanScriptId: BanScriptId },
            dataType: 'json',
            traditional: true,
            success: function (data) {
                var results = JSON.parse(data);

                if (results.IsError) {
                    toastr.error('SomeThing Went Wrong');
                    return false;
                }
                else {
                    toastr.success('Script Deleted Successfully.');

                    if ($('#UserIds option:selected').text() != '--Select--') {
                        var userId = $('#UserIds').val();
                        var username = $('#UserIds option:selected').text();
                        GetBanScriptData(userId);
                    }
                    else {
                        GetBanScriptData(0);
                    }
                    return false;
                }

            }
        });
    }
        }
    });

}

$('#BtnBanWishList').on('click', function () {
    insertScript();
});

$('#chkAllUsers').on('click', function () {
    var checkalluser = document.getElementById('chkAllUsers');
    if (checkalluser.checked == true) {
        $('#DivSelectUsers').css('display', 'none');
    }
    else {
        $('#DivSelectUsers').css('display', 'block');
    }
});

function insertScript() {
    var checkalluser = document.getElementById('chkAllUsers');
    var _ScriptExchange = $('#cboScriptExchange').val();
    var txtScriptData = $('#txtScript').val();
    if ($('#UserIds option:selected').text() != '--Select--' && $('#cboScriptExchange option:selected').text() != 'Select' && txtScriptData != '' || checkalluser.checked == true) {
        var userId = $('#UserIds').val();

        if (checkalluser.checked == true) {
            userId = 0;
        }
        var result = confirm("Are you sure you want to Ban this Script?");
        if (result) {
            var request = $.ajax({
                url: "/Watchlist/InsertBanList",
                type: "POST",
                data: { ScriptExchange: _ScriptExchange, ScriptName: txtScriptData, UserId: userId },
                dataType: 'json',
                traditional: true,
                success: function (data) {
                    var results = JSON.parse(data);
                    if (results == 1) {
                        toastr.success('Script Inserted Successfully.');

                        if ($('#UserIds option:selected').text() != '--Select--') {
                            var userId = $('#UserIds').val();
                            var username = $('#UserIds option:selected').text();
                            GetBanScriptData(userId);
                        }
                        else {
                            GetBanScriptData(0);
                        }
                        return false;
                    }
                    if (results == 0) {
                        toastr.error('Duplicate Record !!');
                    }
                    if (results == 3) {
                        toastr.error('Please Select Script Details Carefully !!');
                    }
                }
            });
        }
    }
    else {
        toastr.error('Please Fill All Required Details !!');
    }
}

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