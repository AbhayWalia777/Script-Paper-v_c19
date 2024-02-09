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

            GetUserData();


            $("#UserListDiv").delegate('.AllUserRow', 'click', function () {
                if (screen.width <= 768) {
                    var UserID = $(this).attr('id');

                  
                    var WithdrawalUrl = '/Admin/ViewUsers?AdminId=' + UserID;

                    $('.mobileWithdrawalBtn').attr('href', WithdrawalUrl);

                    $('.mobile-context-menu').css('display', 'block');
                }
            });


        });
        function GetUserData() {
            var req = {
                startDate: $('#rptStartDate').val(), endDate: $('#rptEndDate').val()
            }
            $.ajax({
                type: 'POST',
                datatype: 'json',
                contentType: 'application/json',
                url: '/Admin/GetManageAdminsData',
                data: JSON.stringify(req),
                success: function (response) {
                    var responseData = JSON.parse(response);
                    var tblTransaction = $('#tblList').DataTable(
                    );
                    tblTransaction.clear().draw();
                    tblTransaction.innerHTML = "";
                    var lstData = responseData;
                    if (lstData.length > 0) {
                        $('#UserListDiv').html('');
                        for (var i = 0; i < lstData.length; i++) {

                            var result = lstData[i];
                            SetAllUsersDetails(result);
                        }
                    }
                    else {
                        $('#UserListDiv').html('<b>No Data Available</b>');
                        $('#UserListDiv').css('text-align','center')
                    }
                },
                error: function (response) {
                    console.log(response.d);
                }

            });
}
document.body.addEventListener('click', function (event) {
    var element = document.querySelector('ul.mobile-context-menu-list.list-flat');
    var element2 = document.querySelector('#UserListDiv');
    if (element != '' && element != null) {
        if (!element.contains(event.target) && !element2.contains(event.target)) {
            $('.mobile-context-menu').css('display', 'none');
        }
    }
});

function SetAllUsersDetails(item) {

    var html = '<div class="row p-2 AllUserRow" id="' + item.UserID + '"' +
        '<div class="col-12" > ' +
        '<div class="watchlist-card c-left-border watchlist-table">' +
        '<div class="card-body" style="padding:5px;">' +
        '   <div class="row">' +
        '<div class="col-xs-3 col-md-3 col-sm-3">' +
        ' <img src="' + item.UserImage + '" class="user-image">' +
        '</div>' +
        '<div class="col-xs-9 col-sm-9 col-md-9">' +
        '     <div class="row Bid_Ask_SEGMENT" style="margin-top:-5px;margin-left:-8px">' +
        '             <div class="col-xs-12 col-sm-12 col-md-12" style="margin-left:-15px;display: flex;">' +
        '                  <div class="user-text"><span class="user-text user-text-span">Name : </span>' + item.Fullname + '</div>' +
        '             </div>' +
        '             <div class="col-xs-12 col-sm-12 col-md-12" style="margin-left:-15px;display: flex;">' +
        '                  <div class="user-text"><span class="user-text user-text-span">User Name : </span>' + item.Username + '</div>' +
        '             </div>' +
        '             <div class="col-xs-8 col-sm-8 col-md-8" style="margin-left:-15px;display: flex;">' +
        '                  <div class="user-text"><span class="user-text user-text-span">Role: </span>' + item.RoleName + '</div>' +
        '              </div>' +
        '             <div class="col-xs-5 col-sm-5 col-md-5" style="margin-left:-15px;display: flex;">' +
        '                  <div class="user-text"><span class="user-text user-text-span">Active: </span>' + item.IsActive + '</div>' +
        '             </div>' +
        '           </div>' +
        '<div class="col-12 user-text" style="display:flex;margin-left:-8px" >' +
        '<span class="user-text user-text-span" style="margin-top: 0px;margin-right: 6px;">Email: </span>' + item.Email + '</div>' +
        '<div class="col-xs-6 col-sm-6 col-md-6 user-text" style="display:flex;margin-left:-8px" >' +
        '<span class="user-text user-text-span" style="margin-top: 0px;margin-right: 6px;">Sponsor: </span>' + item.Sponsorid + '</div>' +
        '</div>' +
        '</div>' +

        '        </div>' +
        '     </div>' +

        '  </div>' +
        '</div >' +
        '</div >';

    $('#UserListDiv').append(html);
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