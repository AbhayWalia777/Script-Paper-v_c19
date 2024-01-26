var StrategyId = 0;
$(document).ready(function () {

    $('#tblStrategyPermission').DataTable();
    var ID = getQueryStringValue('ID');
    if (ID != "" && ID != "0") {
        OnSetData(ID);
        StrategyId = ID;
    }

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
        minLength: 2,
        select: function (event, ui) {
            $(this).val(ui.item.value);

            SaveStrategy();
        }

    });
});


function OnSetData(ID) {
    try {
        var request = $.ajax({
            url: "/Strategy/OnSetData",
            type: "GET",
            data: { ID: ID },
            dataType: 'json',
            traditional: true,
            success: function (data) {
                var results = JSON.parse(data);
                var table = $('#tblStrategyPermission').DataTable();
                table.clear();
                if (results != null) {
                    for (var i = 0; i < results.length; i++) {
                        var result = results[i];
                        SetItemDetails(result);
                    }
                }

                var Type = getQueryStringValue('Type');
                if (Type == "View") {
                    if (ID != "" && ID != "0") {
                        //setTimeout(function () {
                        //    OnSetDataForRefresh(ID);
                        //}, 1000 * 1);
                        setInterval(function () { OnSetDataForRefresh(ID); }, 1000);
                    }
                    $("form :input").prop("disabled", true);
                    $("#tblList_filter :input").prop("disabled", true);
                    $("#tblList_length :input").prop("disabled", false);
                }
            }
        });
    } catch (e) {
        alert("Error On OnSetData.")
    }
}

function SaveStrategy() {

    var StrategyName = $("#StrategyName").val();
    if (StrategyName == '' || StrategyName == undefined || StrategyName == null) {
        $('#lblStrategyName').show();
        return false;
    }

    var UserId = $("#txtUser").val();
    if (UserId != null && UserId != '' && UserId != undefined &&
        StrategyName != null && StrategyName != '') {
        var request = $.ajax({
            url: "/Strategy/SaveStrategy",
            type: "POST",
            data: { UserEmail: UserId, StrategyId: StrategyId, StrategyName: StrategyName },
            dataType: 'json',
            traditional: true,
            success: function (data) {
                var results = JSON.parse(data);

                if (results.IsExist) {
                    $("#txtUser").val("");
                    //alert("Duplicate record.");
                    ShowAlertMessage(2, "Duplicate record.");
                    return false;
                }

                if (results.IsError) {
                    $("#txtUser").val("");
                    //alert("An Error occurred while saving a record, please try again!");
                    ShowAlertMessage(2, "");
                    return false;
                }

                if (!results.IsError) {
                    StrategyId = results.StrategyId;
                    SetItemDetails(results);
                    $("#txtUser").val("");
                    //alert("Record added");
                    ShowAlertMessage(1, "");
                    return false;
                }

            }
        });
    }
}

function RemoveRecord(userId) {

    var result = confirm("Are you sure you want to delete?");
    if (result && userId > 0 && StrategyId > 0) {
        var request = $.ajax({
            url: "/Strategy/DeleteRecord",
            type: "POST",
            data: { StrategyId: StrategyId, userId: userId },
            dataType: 'json',
            traditional: true,
            success: function (data) {
                var results = JSON.parse(data);

                if (results.IsError) {
                    //alert("An Error occurred while deleting a record, please try again!");
                    ShowAlertMessage(2, "");
                    return false;
                }
                else
                {
                    var table = $('#tblStrategyPermission').DataTable();
                    table.row($("#btnName" + userId).parents('tr')).remove().draw(false);
                    //alert("Script deleted successfully.");
                    ShowAlertMessage(1, "Permission deleted successfully.");
                    return false;
                }

            }
        });
    }

}

function SetItemDetails(item) {
    var btnName = 'btn';
    $('#tblStrategyPermission').DataTable().row.add([
          //item.ObjUserDTO.UserID,
        item.ObjUserDTO.FullName,
          item.ObjUserDTO.Email,
          '<button id="btnName' + item.ObjUserDTO.UserID + '" onclick="RemoveRecord(' + item.ObjUserDTO.UserID + ')" type="button" class="btn btn-danger btn-sm"><i class="fa fa fa-trash-o"></i></button>'

    ]).draw();
}

        function SwitchDataTheme() {
        var data = localStorage.getItem('IsDark');
        if (data == 'NO') {
    }
    else {
var NewUI='';
        $('.content-wrapper').css({'background-color': 'black' ,'color' : 'white'});
        $('.box-default').css({'background-color': 'black' ,'color' : 'white'});
        $('.datatableheader').css('background-color','var(--main-color-on-layoutchange)');
        $('li').css('color','white');
        $('.content-header>.breadcrumb>li>a').css('color','white');
        $('#mainWindow').css('background-color','black');
        $('.box-title').css('color','white');
        $('.even').removeClass('even');
        $('.odd').removeClass('odd');
        $('#tblStrategyPermission').removeClass('table-striped');
        $('#tblStrategyPermission').removeClass('table-hover');
        $('li.disabled > a').css({'background-color':'black','color':'white'});
        $('.main-footer').css({'background-color':'black','color':'white'});
        $('.table-bordered>thead>tr>th, .table-bordered>tbody>tr>th, .table-bordered>tfoot>tr>th, .table-bordered>thead>tr>td, .table-bordered>tbody>tr>td, .table-bordered>tfoot>tr>td').css('border','1px solid var(--main-color-on-layoutchange)');
        $('.table-bordered').css('border','1px solid var(--main-color-on-layoutchange)');
        $('input').css({'border':'2px solid var(--main-color-on-layoutchange)','background-color':'black','color':'white'});
        $('.form-control').css({'border':'2px solid var(--main-color-on-layoutchange)','color':'white','background-color':'black'});
        $('.dataTables_empty').css({'border-top-color':'black','background-color':'black'});
        $('.ui-menu-item>div').css({'background-color':'black','color':'white'});
        $('.jvectormap-label>div').css({'background-color':'black','color':'white'});
        $('.ui-autocomplete').css({'background-color':'black'});
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