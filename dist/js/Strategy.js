var strategyID = 0;
$(document).ready(function () {

    $('#tblStrategyPermission').DataTable();
    var ID = getQueryStringValue('ID');
    if (ID != "" && ID != "0") {
        OnSetData(ID);
        strategyID = ID;
    }
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

    var Strategyname = $("#Strategyname").val();
    if (Strategyname == '' || Strategyname == undefined || Strategyname == null) {
        $('#lblStrategyName').show();
        return false;
    }

    var UserID = $("#txtUser").val();
    if (UserID != null && UserID != '' && UserID != undefined &&
        Strategyname != null && Strategyname != '') {
        var request = $.ajax({
            url: "/Strategy/SaveStrategy",
            type: "POST",
            data: { UserEmail: UserID, strategyID: strategyID, Strategyname: Strategyname },
            dataType: 'json',
            traditional: true,
            success: function (data) {
                var results = JSON.parse(data);

                if (results.IsExist) {
                    $("#txtUser").val("");
                    //alert("Duplicate record.");
                    toastr.error("Duplicate record.");
                    return false;
                }

                if (results.IsError) {
                    $("#txtUser").val("");
                    //alert("An Error occurred while saving a record, please try again!");
                    toastr.error("An Error occurred while saving a record, please try again!");
                    return false;
                }

                if (!results.IsError) {
                    strategyID = results.strategyID;
                    SetItemDetails(results);
                    $("#txtUser").val("");
                    //alert("Record added");
                    toastr.success("Record added");
                    return false;
                }

            }
        });
    }
}

function RemoveRecord(UserID) {

    var result = confirm("Are you sure you want to delete?");
    if (result && UserID > 0 && strategyID > 0) {
        var request = $.ajax({
            url: "/Strategy/DeleteRecord",
            type: "POST",
            data: { strategyID: strategyID, UserID: UserID },
            dataType: 'json',
            traditional: true,
            success: function (data) {
                var results = JSON.parse(data);

                if (results.IsError) {
                    //alert("An Error occurred while deleting a record, please try again!");
                    toastbox.error("An Error occurred while deleting a record, please try again!");
                    return false;
                }
                else
                {
                    var table = $('#tblStrategyPermission').DataTable();
                    table.row($("#btnName" + UserID).parents('tr')).remove().draw(false);
                    //alert("Script deleted successfully.");
                    toastbox.success("Permission deleted successfully.");
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
        item.ObjUserDTO.Fullname,
          item.ObjUserDTO.Email,
          '<button id="btnName' + item.ObjUserDTO.UserID + '" onclick="RemoveRecord(' + item.ObjUserDTO.UserID + ')" type="button" class="btn btn-danger btn-sm"><i class="fa fa fa-trash-o"></i></button>'

    ]).draw();
}
