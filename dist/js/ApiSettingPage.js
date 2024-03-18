window.onload(function () {
    var Broker = $("#Broker").val();
    $("#apiKeytr").show();
    $("#apiSecretKeytr").show();
    $("#angelBrokingClientCode").show();
    $("#angelBrokingClientPassword").show();    
    $("#kotakSecurityConsumerKey").show();
    $("#kotakSecurityAccessToken").show();
    $("#kotakSecurityAccessCode").show();    
    $("#UserID").show();       
    if (Broker == "ANGEL BROKING") {
        $("#kotakSecurityConsumerKey").hide();
        $("#kotakSecurityAccessToken").hide();
        $("#kotakSecurityAccessCode").hide();
    }
    else if (Broker == "KOTAK SECURITIES") {
        $("#apiKeytr").hide();
        $("#apiSecretKeytr").hide();
        $("#angelBrokingClientCode").hide();
    }
    else if (Broker == "CAPITALS") {        
        $("#UserID").hide();
        $("#apiSecretKeytr").hide();
        $("#kotakSecurityConsumerKey").hide();
        $("#kotakSecurityAccessToken").hide();
        $("#kotakSecurityAccessCode").hide();
    }
    else {

        $("#angelBrokingClientCode").hide();
        $("#angelBrokingClientPassword").hide();
        $("#kotakSecurityConsumerKey").hide();
        $("#kotakSecurityAccessToken").hide();
        $("#kotakSecurityAccessCode").hide();
    }
    $("#Broker").on('change', function () {
        var Broker = $("#Broker").val();
        $("#apiKeytr").show();
        $("#apiSecretKeytr").show();
        $("#angelBrokingClientCode").show();
        $("#angelBrokingClientPassword").show();
        $("#kotakSecurityConsumerKey").show();
        $("#kotakSecurityAccessToken").show();
        $("#kotakSecurityAccessCode").show();
        $("#UserID").show();
        if (Broker == "ANGEL BROKING") {
            $("#kotakSecurityConsumerKey").hide();
            $("#kotakSecurityAccessToken").hide();
            $("#kotakSecurityAccessCode").hide();
        }
        else if (Broker == "KOTAK SECURITIES") {
            $("#apiKeytr").hide();
            $("#apiSecretKeytr").hide();
            $("#angelBrokingClientCode").hide();
        }
        else if (Broker == "CAPITALS") {
            $("#UserID").hide();
            $("#apiSecretKeytr").hide();
            $("#kotakSecurityConsumerKey").hide();
            $("#kotakSecurityAccessToken").hide();
            $("#kotakSecurityAccessCode").hide();
        }
        else {

            $("#angelBrokingClientCode").hide();
            $("#angelBrokingClientPassword").hide();
            $("#kotakSecurityConsumerKey").hide();
            $("#kotakSecurityAccessToken").hide();
            $("#kotakSecurityAccessCode").hide();
        }
    });
});