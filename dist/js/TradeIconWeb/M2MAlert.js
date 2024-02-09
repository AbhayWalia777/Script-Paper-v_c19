var totalPageNo = 0;
var isCallf = false;
var _currentpage = 1;
$(document).ready(function () {
    $('#Tab_details').DataTable({
        "paging": false
    });
    GetData(1);
    $('#BtnM2M_Alert').trigger('click');
});

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace("active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += "active";
}

function GetData(page) {
    $.ajax({
        type: 'Get',
        datatype: 'json',
        contentType: 'application/json',
        url: '/Admin/_GetAllUserWithM2m?PageNo=' + page,
        success: function (response) {
            var lstData = JSON.parse(response);
            var Tab_details = $('#Tab_details').DataTable();
            Tab_details.clear().draw();
            Tab_details.innerHTML = "";

            if (lstData.length > 0) {
                $("tbody td").css("white-space", "nowrap");
                for (var i = 0; i < lstData.length; i++) {
                    var result = lstData[i];
                    TotalPageNo = parseInt(result.Total_Page);

                    SetAllUsersDetails(result);
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
    $('#PaginationM2MAlert').twbsPagination({
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

    var table = $('#Tab_details').DataTable().row.add([

        item.Username,
        item.Balance,
        item.Thresholdpercentage,
        item.Total_M2m_ProfitLoss
    ]).order([0, 'desc']).draw();
}