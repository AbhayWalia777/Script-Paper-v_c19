//delcaring global variable to hold primary key value.
var _FundManagerId;
$(document).ready(function () {
    $('#FundManagerList').DataTable({
        "order": [[1, "asc"]]
    });

    $(document).on('click', '.subscribe-prompt', function () {
        _FundManagerId = $(this).attr('id');
        var request = $.ajax({
            url: "/Admin/GetFundManagerDetails?FundManagerID=" + _FundManagerId,
            type: "GET",
            dataType: 'json',
            success: function (data) {
                if (parseFloat(data.Mindipositamount) <= parseFloat(data.Userwalletbalance)) {
                    var Modelhtml = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header alert alert-danger"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="myModalLabel">Confirmation Dialog</h4></div><div class="modal-body"><p id="pmessage" class="success-Message">Are you sure you wish to subscribe this Fund Manager / Copy Trader ? <br/> <b> Minimum Wallet Balance Should Be ' + parseFloat(data.Mindipositamount) + ' USD. </b> <br/><b> You Will be charged ' + parseFloat(data.Subscriptionfee) + ' USD. </b>  </p></div><div class="modal-footer"><button class="btn btn-success" onclick="subscribe()">Subscribe</button><button id="btnCancel" class="btn btn-default" data-dismiss="modal">Cancel</button></div></div></div></div>';
                    $("#mainWindow").append(Modelhtml);
                    $('#myModal').modal('show');
                }
                else {
                    toastr.error('Not Sufficient Balance');
                }
            }
        });
        return false;
    });
    $(document).on('click', '.unsubscribe-prompt', function () {
        _FundManagerId = $(this).attr('id');
        var request = $.ajax({
            url: "/Admin/GetFundManagerDetails?FundManagerID=" + _FundManagerId,
            type: "GET",
            dataType: 'json',
            success: function (data) {
                if (parseInt(data.Totalsubscribeddays) < parseInt(data.TradingPeriod)) {
                    var Modelhtml = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header alert alert-danger"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="myModalLabel">Confirmation Dialog</h4></div><div class="modal-body"><p id="pmessage" class="success-Message">Are you sure you wish to Unsubscribe this Fund Manager / Copy Trader ? <br/> <b> You Will be charged ' + parseFloat(data.Penaltyfee) + 'USD. As Penalty Fees </b>  </p></div><div class="modal-footer"><button class="btn btn-success" onclick="Unsubscribe()">Unsubscribe</button><button id="btnCancel" class="btn btn-default" data-dismiss="modal">Cancel</button></div></div></div></div>';
                    $("#mainWindow").append(Modelhtml);
                    $('#myModal').modal('show');
                }
                else {
                    var Modelhtml = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header alert alert-danger"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="myModalLabel">Confirmation Dialog</h4></div><div class="modal-body"><p id="pmessage" class="success-Message">Are you sure you wish to Unsubscribe this Fund Manager / Copy Trader ? </p></div><div class="modal-footer"><button class="btn btn-success" onclick="Unsubscribe()">Unsubscribe</button><button id="btnCancel" class="btn btn-default" data-dismiss="modal">Cancel</button></div></div></div></div>';
                    $("#mainWindow").append(Modelhtml);
                    $('#myModal').modal('show');
                }
            }
        });
        return false;
    });
});
function Unsubscribe() {
    if (_FundManagerId != '') {
        window.location.href = "/Admin/UnSubscribe?ManagerId=" + _FundManagerId;
    }
}
function subscribe() {
    if (_FundManagerId != '') {
        window.location.href = "/Admin/Subscribe?ManagerId=" + _FundManagerId;
    }
}

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
        $('.box-default').css({'background-color': 'black' ,'color' : 'white'});
        $('.box-header').css('color','white');
        $('.box-title').css('color','white');
        $('.even').removeClass('even');
        $('.odd').removeClass('odd');
        $('#FundManagerList').removeClass('table-striped');
        $('.form-control').css({'border':'2px solid var(--main-color-on-layoutchange)','color':'white','background-color':'black'});
        $('.dataTables_empty').css({'border-top-color':'black','background-color':'black'});
        $('li.disabled > a').css({'background-color':'black','color':'white'});
        $('.main-footer').css({'background-color':'black','color':'white'});
        $('.table-bordered>thead>tr>th, .table-bordered>tbody>tr>th, .table-bordered>tfoot>tr>th, .table-bordered>thead>tr>td, .table-bordered>tbody>tr>td, .table-bordered>tfoot>tr>td').css('border','1px solid var(--main-color-on-layoutchange)');
        $('.table-bordered').css('border','1px solid var(--main-color-on-layoutchange)');
        $('input').css({'border':'2px solid var(--main-color-on-layoutchange)','background-color':'black','color':'white'});
        $('.traderCard').css({'background-color':'black','color':'white','border':'2px solid var(--main-color-on-layoutchange)'});
        $('.traderCardHeader').css('border-bottom','2px solid var(--main-color-on-layoutchange)');
        $('.subscribers').css('border-bottom','2px solid var(--main-color-on-layoutchange)');
        $('.modal-content').css('background-color','black');
        $('ul.pagination >li>a').css({'background-color':'black','color':'white'});
        $('ul.pagination >li.active>a').css({'background-color':'#337ab7','color':'white'});
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
        $('.datatableheader').css('color','white');
        }
    }
}