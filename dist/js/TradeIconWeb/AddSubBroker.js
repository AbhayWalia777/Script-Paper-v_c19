$(document).ready(function () {

    $("#tblSubBroker").DataTable({
        "search": true,
        "ordering": true,
        "info": true,
        "responsive": true,
        "lengthChange": false
    });
    $("#btnAdd").click(function () {
        $("#btnsave").show(); +
            $("#btncancel").show();
        $(".BrokerForm").show();
        $("#btnAdd").hide();
        $(".content").hide();
    });
    $("#btncancel").click(function () {
        $("#btnsave").hide();
        $("#btncancel").hide();
        $(".BrokerForm").hide();
        $("#btnAdd").show();
        $(".content").show();
    });
    $('.segmentdrop').select2({
        placeholder: "Select Segments",
        allowClear: true
    });
});
function toggle() {
    var state = $('#Password').is(':password') == false ? true : false;
    if (state) {
        document.getElementById("Password").setAttribute("type", "password");
    }
    else {
        document.getElementById("Password").setAttribute("type", "text");
    }
}
