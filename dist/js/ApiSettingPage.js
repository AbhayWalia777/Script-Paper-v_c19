        $(document).ready(function () {
            $("#Broker").on('change', function () {
                var Broker = $("#Broker").val();
                if (Broker == "ANGEL BROKING") {
                    $("#apiKeytr").show();
                    $("#apiSecretKeytr").show();
                    $("#angelBrokingClientCode").show();
                    $("#angelBrokingClientPassword").show();
                    $("#kotakSecurityConsumerKey").hide();
                    $("#kotakSecurityAccessToken").hide();
                    $("#kotakSecurityAccessCode").hide();
                }
                else if (Broker == "KOTAK SECURITIES")
                {
                    $("#apiKeytr").hide();
                    $("#apiSecretKeytr").hide();
                    $("#angelBrokingClientCode").hide();
                    $("#angelBrokingClientPassword").show();
                    $("#kotakSecurityConsumerKey").show();
                    $("#kotakSecurityAccessToken").show();
                    $("#kotakSecurityAccessCode").show();
                }
                else if (Broker == "CAPITALS") {
                    $("#apiKeytr").show();
                    $("#UserID").hide();
                    $("#apiSecretKeytr").hide();
                    $("#angelBrokingClientCode").show();
                    $("#angelBrokingClientPassword").show();
                    $("#kotakSecurityConsumerKey").hide();
                    $("#kotakSecurityAccessToken").hide();
                    $("#kotakSecurityAccessCode").hide();
                }
                else {
                    $("#apiKeytr").show();
                    $("#apiSecretKeytr").show();
                    $("#angelBrokingClientCode").show();
                    $("#angelBrokingClientCode").hide();
                    $("#angelBrokingClientPassword").hide();
                    $("#kotakSecurityConsumerKey").hide();
                    $("#kotakSecurityAccessToken").hide();
                    $("#kotakSecurityAccessCode").hide();
                }
            });
            var Broker = $("#Broker").val();
            if (Broker == "ANGEL BROKING") {
                $("#apiKeytr").show();
                $("#apiSecretKeytr").show();
                $("#angelBrokingClientCode").show();
                $("#angelBrokingClientPassword").show();
                $("#kotakSecurityConsumerKey").hide();
                $("#kotakSecurityAccessToken").hide();
                $("#kotakSecurityAccessCode").hide();
            }
            else if (Broker == "KOTAK SECURITIES") {
                $("#apiKeytr").hide();
                $("#apiSecretKeytr").hide();
                $("#angelBrokingClientCode").hide();
                $("#angelBrokingClientPassword").show();
                $("#kotakSecurityConsumerKey").show();
                $("#kotakSecurityAccessToken").show();
                $("#kotakSecurityAccessCode").show();
            }
            else if (Broker == "CAPITALS") {
                $("#apiKeytr").show();
                $("#UserID").hide();
                $("#apiSecretKeytr").hide();
                $("#angelBrokingClientCode").show();
                $("#angelBrokingClientPassword").show();
                $("#kotakSecurityConsumerKey").hide();
                $("#kotakSecurityAccessToken").hide();
                $("#kotakSecurityAccessCode").hide();
            }
            else {
                $("#apiKeytr").show();
                $("#apiSecretKeytr").show();
                $("#angelBrokingClientCode").show();
                $("#angelBrokingClientCode").hide();
                $("#angelBrokingClientPassword").hide();
                $("#kotakSecurityConsumerKey").hide();
                $("#kotakSecurityAccessToken").hide();
                $("#kotakSecurityAccessCode").hide();
            }
        });