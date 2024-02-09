        $(document).ready(function () {
            $('.classDate').inputmAsk('mm/dd/yyyy', { 'placeholder': 'mm/dd/yyyy' })

            $('.classDate').datepicker({
                autoclose: true,
                useCurrent: true,
                todayHighlight: true,
                todayBtn: true,
            });
            var today = new Date();
            var date = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            today = mm + '/' + dd + '/' + yyyy;
            date.setDate(date.getDate() - 30);
            dd = String(date.getDate()).padStart(2, '0');
            mm = String(date.getMonth() + 1).padStart(2, '0');
            yyyy = date.getFullYear();
            var previousDay = mm + '/' + dd + '/' + yyyy;

            $('#rptStartDate').val(previousDay);
            $('#rptEndDate').val(today);

            GetData();

        });
        function GetData() {
            var req = {
                AdminId: $('#AdminId').val() , startDate: $('#rptStartDate').val(), endDate: $('#rptEndDate').val()
            }
            $.ajax({
                type: 'POST',
                datatype: 'json',
                contentType: 'application/json',
                url: '/Admin/GetViewUserData',
                data: JSON.stringify(req),
                success: function (response) {
                    var responseData = JSON.parse(response);
                    var tblTransaction = $('#tblList').DataTable(
                    );
                    tblTransaction.clear().draw();
                    tblTransaction.innerHTML = "";
                    var lstData = responseData;
                    _OpeningBalance = lstData[0].Openingwalletbalance;
                    for (var i = 0; i < lstData.length; i++) {
                        var result = lstData[i];
                        SetCompletedTradeDetails(result);
                    }
                },
                error: function (response) {
                    console.log(response.d);
                }

            });
        }
        function SetCompletedTradeDetails(item) {

var ViewAllUsers="";
if(item.TotalUsers!=0)
{
ViewAllUsers='<a href="/Admin/ViewUsers?AdminId=' + item.UserID + '"><button type="button" class="btn btn-warning btn-sm margin-right-5px">View Users<i class="fa fa-user-alt"></i></button> </a>';
}

            var netProfit = item.Totalloss + item.Totalprofit;
            var table = $('#tblList').DataTable().row.add([
                item.CreatedDateString,
                item.Fullname,
                item.Username,
                item.Sponsorid,
                item.Email,
                item.TotalUsers,
                item.RoleName,
                item.ExpiryDateString,
                netProfit,
                item.TotalBrokerage,
                item.Balance,
                item.IsActive,
                ViewAllUsers
            ]).order([0, 'desc']).draw();
        }

 function SwitchDataTheme() {
        var data = localStorage.getItem('IsDark');
        if (data == 'NO') {
    }
    else {
        $('.content-wrapper').css({'background-color': 'black' ,'color' : 'white'});
        $('.box-default').css({'background-color': 'black' ,'color' : 'white'});
        $('.datatableheader').css({'background-color':'var(--main-color-on-layoutchange)','color':'black'});
        $('li').css('color','white');
        $('.content-header>.breadcrumb>li>a').css('color','white');
        $('#mainWindow').css('background-color','black');
        $('.box-title').css('color','white');
        $('.even').removeClass('even');
        $('.odd').removeClass('odd');
        $('#tblList').removeClass('table-striped');
        $('#Change-On-Dark-Theme').removeClass('table-striped');
        $('.form-control').css({'border':'2px solid var(--main-color-on-layoutchange)','color':'white','background-color':'black'});
        $('.dataTables_empty').css({'border-top-color':'black','background-color':'black'});
        $('li.disabled > a').css({'background-color':'black','color':'white'});
        $('.main-footer').css({'background-color':'black','color':'white'});
        $('.table-bordered>thead>tr>th, .table-bordered>tbody>tr>th, .table-bordered>tfoot>tr>th, .table-bordered>thead>tr>td, .table-bordered>tbody>tr>td, .table-bordered>tfoot>tr>td').css('border','1px solid var(--main-color-on-layoutchange)');
        $('.table-bordered').css('border','1px solid var(--main-color-on-layoutchange)');
        $('input').css({'border':'2px solid var(--main-color-on-layoutchange)','background-color':'black','color':'white'});
        
        $('.breadcrumb').css('background-color','black');
        $('.box').css('border-top-color','black');
        $('.box-default').css('border-top-color','black');
        $('label').css('color','white');
        $('.input-group-addon').css({'border': '1px solid var(--main-color-on-layoutchange)', 'background-color': 'black','color': 'white'});
        $('.select2-selection').css({'border': '2px solid var(--main-color-on-layoutchange)', 'background-color': 'black','color': 'white'});
        $('.select2-selection__rendered').css({'color': 'white'});
        $('tblWatchListTradeListBody > tr').css('background-color','black');
        $('tblActiveTradeBody > tr').css('background-color','black');
        $('.modal-body').css('background-color','black');
        $('.modal-footer').css('background-color','black');
        $('input:radio').addClass('checkBox-color-change');
        $('#rdPaper').removeClass('checkBox-color-change');
        $('.modal-header > button').css('color','black');
        $('#transactionalDetails').css({'background-color':'black','color':'white'});
        $('.change-completed-detail-UINew').css('color','white');
        $('.box-header').css({'background-color':'black','color':'white'});
        $('ul.pagination >li>a').css({'background-color':'black','color':'white'});
        $('ul.pagination >li.active>a').css({'background-color':'#337ab7','color':'white'});
        $('.datepicker-days').css({'background-color': 'black','color': 'white'});
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
        }
        else
        {
        $('.fixed-column').css('color','white');
        }
    }
}