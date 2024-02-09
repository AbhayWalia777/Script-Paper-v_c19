var totalPageNo = 0;
var isCallf = false;
var _currentPage = 1;
$(document).ready(function () {
    $('#my_table').dataTable({
        "paging": false,
        "lengthChange": false,
        "info": false,
        "ordering": true,
        "searching": true,
        "responsive": true
    });
    GetData(1);
});
function ChangeActiveStatus(CheckBoxID, UserID) {
    var CheckboxIsChecked = document.getElementById(CheckBoxID);
    if (CheckboxIsChecked.checked == false) {
        var result = confirm("Are you sure want to Deactive Account (" + UserID + ")?");
        if (result) {
            PostChangeActiveStatus(UserID, 0);
        }
        else {
            CheckboxIsChecked.checked = true;
        }
    }
    else {
        var result = confirm("Are you sure want to Activate Account (" + UserID + ") ? ");
        if (result) {
            PostChangeActiveStatus(UserID, 1);
        }
        else {
            CheckboxIsChecked.checked = false;
        }
    }
}

function PostChangeActiveStatus(UserID, value) {
    var input = { 'Status': value, 'UserID': UserID };
    $.ajax({
        url: "/Admin/ChangeActiveStatus",
        type: "GET",
        dataType: "json",
        data: input,
        success: function (data) {
            if (data == 1) {
                toastr.success("Updated Successfully");
            }
            else {
                toastr.error("Updated Failed");
            }
        }
    });
}

$('.cbxledgercheck').on('click', function () {
    if ($(this).prop('checked') == true) {
        var result = confirm("Are you sure want to Activate Ledger Report?");
        if (result) {

        } else {
            $(this).prop('checked') = false;
        }
    }
    else {
        var result = confirm("Are you sure want to Deactive Ledger Report?");
        if (result) {

        } else {
            $(this).prop('checked') = true;
        }
    }
});

function GetData(page) {
    $.ajax({
        type: 'Get',
        datatype: 'json',
        contentType: 'application/json',
        url: '/Admin/_GetAllUser?PageNo=' + page,
        success: function (response) {
            var lstData = JSON.parse(response);
            var my_table = $('#my_table').DataTable();
            my_table.clear().draw();
            my_table.innerHTML = "";
            /* console.log(lstData);*/

            if (lstData.length > 0) {
                $("tbody td").css("white-space", "nowrap");
                for (var i = 0; i < lstData.length; i++) {
                    var result = lstData[i];
                    TotalPageNo = parseInt(result.Total_Page);

                    SetAllUsersDetails(result);
                }
                var table = document.getElementById("my_tableBody");

                for (var i = 0; i < table.rows.length; i++) {

                    $(table.rows[i].cells[0]).append(i + 1);
                }
            }
            else {
                TotalPageNo = 0;
            }
            SetPagination();

        },
        error: function (response) {
            console.log(response);
        }
    });
}
function SetPagination() {
    $('#AllUsersPagination').twbsPagination({
        totalPages: TotalPageNo,
        visiblePages: 2,
        onPageClick: function (event, page) {
            if (isCallf)
                GetData(page);
            else
                isCallf = true;
        }
    });
}
function SetAllUsersDetails(item) {
    var SrNo = " ";

    var UniqueidForAction = '\'Active_Deactive' + item.UserID + '\'';
    var UserActiveStatus = item.Active == "Yes" ? 'Checked' : '';
    var Active_Deactive = '<div style="margin-left: 50px;"><input class="checkbox2" Id="Active_Deactive' + item.UserID + '" onclick="return ChangeActiveStatus(' + UniqueidForAction + ',' + item.UserID + ');" type="checkbox"' + UserActiveStatus + ' Name = ""/> </div >';
    var LedgerInApp = '<div style="margin-left:50px;"> <input class="checkbox2 cbxledgercheck" type = "checkbox" Name = ""/></div>';
    var BrokerageSetUp = '<a  class="btn br-page" href="/Admin/ManageBrokerage/' + item.UserID + '" style="background: transparent; padding-left: 0px; padding-top: 0px; margin-left: 30px;"><i class="fa fa-pencil" style="background-color: green; color: green; width: 0px;"></i></button>';
    var View = '<a href="/Admin/AddAccount?ID=' + item.UserID + '";">View</a>';

    var table = $('#my_table').DataTable().row.add([
        SrNo,
        item.Fullname,
        "1050",
        item.RoleName,
        item.ParentName,
        item.Mobileno,
        item.Username,
        Active_Deactive,
        LedgerInApp,
        BrokerageSetUp,
        View
    ]).order([0, 'desc']).draw();
}
function CompletedPaginationDestroy() {
    $('#AllUsersPagination').empty();
    $('#AllUsersPagination').removeData("twbs-pagination");
    $('#AllUsersPagination').unbind("page");
}
