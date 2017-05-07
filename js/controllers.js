app.controller("homeCtrl", function($scope) {
    $scope.appname = "eVault";
});

app.controller("signUpCtrl", function($scope, $http) {
    $scope.appname = "eVault";
    $scope.errMsg = " ";

    $scope.signupUser = function() {
        var userFullName = $scope.fullName;
        var username = $scope.username;
        var email = $scope.email;
        var phoneNumber = $scope.phoneNumber;
        var password = $scope.password;
        var passwordConf = $scope.passwordConf;
        var signupData = {};

        signupData.userFullName = userFullName;
        signupData.username = username;
        signupData.email = email;
        signupData.phoneNumber = phoneNumber;
        signupData.password = passwordConf;
        if (password != passwordConf) {
            $scope.errMsg = "The Confirmation Password Does Not Match The Password Provided";
        }

        var data = $.param(signupData);
        console.log(data);
        $http({
                method: 'POST',
                url: 'includes/api/signup.php',
                data: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            })
            .success(function(response) {
                var responseMsg = response;
                if (responseMsg.message.toString() == "userEmail already exists") {
                    var errorDialog = $("<div class='feedbackModal' title='Sign Up Unsuccessful'><p>An Account With The Email Address " + email + " Already Exists. Please Use Another Email</p></div>")
                    errorDialog.dialog({
                        modal: true,
                        draggable: false,
                        width: 500,
                        dialogClass: "no-close",
                        buttons: [{
                            text: "Ok",
                            click: function() {
                                $(this).dialog("destroy");
                            }
                        }]
                    });
                    $scope.email = "";
                } else if (responseMsg.message.toString() == "userName already exists") {
                    var errorDialog = $("<div class='feedbackModal' title='Sign Up Unsuccessful'><p>An Account With The Username " + username + " Already Exists. Please Use Another Email</p></div>")
                    errorDialog.dialog({
                        modal: true,
                        draggable: false,
                        width: 500,
                        dialogClass: "no-close",
                        buttons: [{
                            text: "Ok",
                            click: function() {
                                $(this).dialog("destroy");
                            }
                        }]
                    });
                    $scope.username = "";

                } else if (responseMsg.code.toString() == "SignUp Successful") {
                    var diaString = "<div class='feedbackModal' title='Sign Up Successful'><p>You Signed Up With eVault Successfully<br>Your Vault Number Is <b>" + responseMsg.message.toString() + "</b>.Login with Your Email And Password To Use eVault.</p></div>";
                    $(diaString).dialog({
                        modal: true,
                        draggable: false,
                        width: 500,
                        dialogClass: "no-close",
                        buttons: [{
                            text: "Ok",
                            click: function() {
                                $(this).dialog("destroy");
                                window.location.href = "#login";
                            }
                        }]
                    });
                }
            }).error(function(error) {
                var errMsg = "Please check your internet connection and try again.";
                $(errMsg).dialog({
                    modal: true,
                    draggable: false,
                    width: 500,
                    dialogClass: "no-close",
                    buttons: [{
                        text: "Ok",
                        click: function() {
                            $(this).dialog("destroy");
                        }
                    }]
                });
            });
    };
});


app.controller("loginCtrl", function($scope, $http, $location, $rootScope) {
    $scope.appname = "eVault";
    $rootScope.loggedIn = false;
    $rootScope.username = "";

    $scope.loginUser = function() {
        var email = $scope.loginEmail;
        var vaultNumber = $scope.vaultNumber;
        var password = $scope.loginPassword;
        var loginData = {};
        loginData.email = email;
        loginData.password = password;
        loginData.vaultNumber = vaultNumber;
        var data = $.param(loginData);
        $http({
                method: 'POST',
                url: 'includes/api/login.php',
                data: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            })
            .success(function(response) {
                if (response.code.toString() == "Login Successful") {
                    $rootScope.loggedIn = true;
                    $rootScope.userDetails = response.userDetails
                    $location.path('/userPage');
                } else if (response.code.toString() == "Login Failure") {
                    alert("login failed");
                }
                //console.log(response.userDetails);
            }).error(function(error) {
                alert("Please check your internet connection and try again.");
            });
    };

    $scope.verifyUser = function() {

        var vaultNumber = $scope.verifyVaultNumber;
        var loginData = {};
        loginData.vaultNumber = vaultNumber;
        var data = $.param(loginData);
        $http({
                method: 'POST',
                url: 'includes/api/login2.php',
                data: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            })
            .success(function(response) {
                if (response.code.toString() == "Login Successful") {
                    $rootScope.loggedIn = true;
                    $rootScope.userDetails = response.userDetails;
                    $location.path('/userPage');
                } else if (response.code.toString() == "Login Failure") {
                    alert("login failed");
                }
                //console.log(response.userDetails);
            }).error(function(error) {
                alert("Please check your internet connection and try again.");
            });
    }
});



app.controller("userCtrl", function($scope, $http, $location, $rootScope) {
    $scope.appname = "eVault";
    $scope.addItemDiv = false;
    $scope.itemsDiv = false;
    $scope.noItemsDiv = true;
    $scope.addItemBtn = true;
    $scope.goUserBtn = false;
    $scope.items = "";

    var fileDetails = {};
    fileDetails.userId = $rootScope.userDetails.userId;
    var data = $.param(fileDetails);

    function getItemes() {
        $http({
                method: 'GET',
                url: 'includes/api/getItemsScript.php?userId=' + $rootScope.userDetails.userId,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            })
            .success(function(response) {
                console.log(response);
                if (response != "") {
                    $scope.noItemsDiv = false;
                    $scope.itemsDiv = true;
                    $scope.addItemDiv = false;
                }else if (response == "") {
                    $scope.noItemsDiv = true;
                    $scope.itemsDiv = false;
                    $scope.addItemDiv = false;
                }

                $scope.items = response;
            }).error(function(error) {
                alert("Please check your internet connection and try again.");
            });

    }
    getItemes();


    $scope.username = $rootScope.userDetails.username;
    $scope.emptyItems = "There Is No Item In Your Vault. Click On 'Add Item' In The Menu To Add Items To Your Vault";

    $scope.addItem = function() {
        $scope.addItemDiv = true;
        $scope.addItemBtn = false;
        $scope.goUserBtn = true;
        $scope.noItemsDiv = false;
        $scope.itemsDiv = false;
    }

    $scope.goUserPage = function() {
        $scope.addItemDiv = false;
        $scope.noItemsDiv = false;
        $scope.itemsDiv = false;
        $scope.addItemBtn = true;
        $scope.goUserBtn = false;
        if ($scope.items == "") {
            $scope.noItemsDiv = true;
            $scope.itemsDiv = false;
        } else {
            $scope.noItemsDiv = false;
            $scope.itemsDiv = true;
        }
    }

    $scope.removeItem = function(id, fileName) {
        var confDel = confirm("Are you Sure You Want To Remove " + fileName + " From Your Vault?");
        if (confDel) {
            var fileId = id;
            var loginData = {};
            loginData.fileId = fileId;
            var data = $.param(loginData);
            $http({
                    method: 'POST',
                    url: 'includes/api/removeItem.php',
                    data: data,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                })
                .success(function(response) {
                    if (response.toString() == "Removal Successful") {
                        getItemes();
                    } else if (response.toString() == "Removal Failure") {
                        alert("Cannot Remove Item Now");
                    }
                    //console.log(response.userDetails);
                }).error(function(error) {
                    alert("Please check your internet connection and try again.");
                });
        }
    }

    $scope.logout = function() {
        alert("Your full name is " + $rootScope.userDetails.userFullName);
    }


    $scope.appname = "eVault";
    $scope.username = $rootScope.userDetails.username;
    var userId = $rootScope.userDetails.userId;
    var userFullName = $rootScope.userDetails.userFullName;
    var dropForm = $(".drop-form");
    var fieldset = $("fieldset");
    var dropDiv = $(".drop-div");
    var cancelProgressDiv = $(".cancel-progress-div");
    var cancelProgress = $(".cancel-progress");
    var restartProgressDiv = $(".restart-progress-div");
    var restartProgress = $(".restart-progress");
    var progressDiv = $(".progress-div");
    var progress = $(".progress");
    var progressBar = $(".progress-bar");

    progressDiv.hide();
    restartProgressDiv.hide();
    cancelProgressDiv.hide();

    dropDiv.on("dragover", function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).css('border-color', '#1b66b4');
    });

    dropDiv.on("drop", function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).css('border-color', '#c0c0c0');

        var isFolder = false;
        var isTooLarge = false;
        var folderName = "";
        var fileName = "";
        var files = e.originalEvent.dataTransfer.files;
        var percentageCompleted = 0;
        var showErrDialog = "";

        for (var i = 0, f = files[i]; i < files.length; i++) {
            if (!f.type && f.size % 4096 == 0) {
                isFolder = true;
                userId
                folderName = f.name;
            }
        }

        for (var i = 0, f = files[i]; i < files.length; i++) {
            if (f.size > 2147483648) {
                isTooLarge = true;
                fileName = f.name;
            }
        }

        if (isFolder) {
            showErrDialog = $("<div class='feedbackModal' title='Zip Folder'><p>Please zip '" + folderName + "' before dropping.</p></div>");
            $(showErrDialog).dialog({
                modal: true,
                draggable: false,
                width: 500,
                dialogClass: "no-close",
                buttons: [{
                    text: "Ok",
                    click: function() {
                        $(this).dialog("destroy");
                    }
                }]
            });
        } else if (isTooLarge) {
            showErrDialog = $("<div class='feedbackModal' title='File Size Too Large'><p>The file '" + fileName + "' must not exceed 2GB</p></div>");
            $(showErrDialog).dialog({
                modal: true,
                draggable: false,
                width: 500,
                dialogClass: "no-close",
                buttons: [{
                    text: "Ok",
                    click: function() {
                        $(this).dialog("destroy");
                    }
                }]
            });
        } else {
            var xhr = new window.XMLHttpRequest();
            var formData = new FormData();
            var fileLength = 0;
            for (var i = 0; i < files.length; i++) {
                formData.append("files" + i, files[i]);
                fileLength++;
            }

            dropDiv.hide();
            progressDiv.show();
            cancelProgressDiv.show();

            $.ajax({
                xhr: function() {
                    xhr.upload.addEventListener("progress", function(event) {
                        if (event.lengthComputable) {
                            percentageCompleted = Math.round((event.loaded / event.total) * 100);
                            console.log(percentageCompleted);
                            progressBar.width(percentageCompleted + "%").html("Adding Documents To vault..." + percentageCompleted + "% complete");

                        }
                    }, false);

                    xhr.upload.addEventListener("load", function(event) {
                        progressBar.addClass("progress-bar-success").html("Document Added Successfully");
                    });
                    userId
                    return xhr;
                },
                url: "includes/api/addItemScript.php?userId=" + userId + "&userFullName=" + userFullName,
                type: "POST",
                data: formData,
                enctype: 'multipart/form-data',
                contentType: false,
                processData: false,
                success: function(data, textStatus, jqXHR) {
                    console.log(data);
                    progressBar.removeClass('active');
                    cancelProgress.hide();
                    restartProgress.hide();
                    $(data).dialog({
                        modal: true,
                        draggable: false,
                        width: 500,
                        dialogClass: "no-close",
                        buttons: [{
                            text: "Ok",
                            click: function() {
                                $(this).dialog("destroy");
                                dropDiv.show();
                                progressDiv.hide();
                                cancelProgressDiv.hide();
                                progressBar.removeClass('progress-bar-success');
                                getItemes();
                                $scope.addItemBtn = true;
                                $scope.goUserBtn = false;
                            }
                        }]
                    });

                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('ERRORS: ' + textStatus + jqXHR + " " + errorThrown);
                }
            });

            cancelProgress.on("click", function() {
                xhr.abort();
                progressBar.addClass("progress-bar-danger").html("<span class='glyphicon glyphicon-warning-sign'></span> Drop Aborted!").removeClass("active");
                cancelProgressDiv.hide();
                restartProgressDiv.show();
                restartProgress.show();
            });

            restartProgress.on("click", function() {
                progressBar.addClass('active').removeClass('progress-bar-success');
                progressDiv.effect('fold');
                dropDiv.html("Drop Files Here");
                percentageCompleted = 0;
                cancelProgressDiv.show();
                progressBar.width(percentageCompleted + "%").html(percentageCompleted + "%");
            });

        }
    });

    $(".drop-form").on("submit", function() {
        var files = document.getElementById('drop-input').files;

        var isFolder = false;
        var isTooLarge = false;
        var folderName = "";
        var fileName = "";
        var percentageCompleted = 0;
        var showErrDialog = "";

        for (var i = 0, f = files[i]; i < files.length; i++) {
            if (!f.type && f.size % 4096 == 0) {
                isFolder = true;
                folderName = f.name;
            }
        }

        for (var i = 0, f = files[i]; i < files.length; i++) {
            if (f.size > 2147483648) {
                isTooLarge = true;
                fileName = f.name;
            }
        }

        if (isFolder) {
            showErrDialog = $("<div class='feedbackModal' title='Zip Folder'><p>Please zip '" + folderName + "' before dropping.</p></div>");
            $(showErrDialog).dialog({
                modal: true,
                draggable: false,
                width: 500,
                dialogClass: "no-close",
                buttons: [{
                    text: "Ok",
                    click: function() {
                        $(this).dialog("destroy");
                    }
                }]
            });
        } else if (isTooLarge) {
            showErrDialog = $("<div class='feedbackModal' title='File Size Too Large'><p>The file '" + fileName + "' must not exceed 2GB</p></div>");
            $(showErrDialog).dialog({
                modal: true,
                draggable: false,
                width: 500,
                dialogClass: "no-close",
                buttons: [{
                    text: "Ok",
                    click: function() {
                        $(this).dialog("destroy");
                    }
                }]
            });
        } else {
            var xhr = new window.XMLHttpRequest();
            var formData = new FormData();
            var fileLength = 0;
            for (var i = 0; i < files.length; i++) {
                formData.append("files" + i, files[i]);
                fileLength++;
            }

            dropDiv.hide();
            progressDiv.show();
            cancelProgressDiv.show();

            $.ajax({
                xhr: function() {
                    xhr.upload.addEventListener("progress", function(event) {
                        if (event.lengthComputable) {
                            percentageCompleted = Math.round((event.loaded / event.total) * 100);
                            console.log(percentageCompleted);
                            progressBar.width(percentageCompleted + "%").html("Adding Documents To vault..." + percentageCompleted + "% complete");

                        }
                    }, false);

                    xhr.upload.addEventListener("load", function(event) {
                        progressBar.addClass("progress-bar-success").html("Document Added Successfully");
                    });
                    return xhr;
                },
                url: "includes/api/addItemScript.php?userId=" + userId + "&userFullName=" + userFullName,
                type: "POST",
                data: formData,
                enctype: 'multipart/form-data',
                contentType: false,
                processData: false,
                success: function(data, textStatus, jqXHR) {
                    console.log(data);
                    progressBar.removeClass('active');
                    cancelProgress.hide();
                    restartProgress.hide();
                    $(data).dialog({
                        modal: true,
                        draggable: false,
                        width: 500,
                        dialogClass: "no-close",
                        buttons: [{
                            text: "Ok",
                            click: function() {
                                $(this).dialog("destroy");
                                dropDiv.show();
                                progressDiv.hide();
                                cancelProgressDiv.hide();
                                progressBar.removeClass('progress-bar-success');
                                getItemes();
                                $scope.addItemBtn = true;
                                $scope.goUserBtn = false;
                            }
                        }]
                    });

                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('ERRORS: ' + textStatus + jqXHR + " " + errorThrown);
                }
            });

            cancelProgress.on("click", function() {
                xhr.abort();
                progressBar.addClass("progress-bar-danger").html("<span class='glyphicon glyphicon-warning-sign'></span> Drop Aborted!").removeClass("active");
                cancelProgressDiv.hide();
                restartProgressDiv.show();
                restartProgress.show();
            });

            restartProgress.on("click", function() {
                progressBar.addClass('active').removeClass('progress-bar-success');
                progressDiv.effect('fold');
                $('.securityCode').val("");
                $('.notes').val("");
                dropDiv.html("Drop Files Here");
                percentageCompleted = 0;
                cancelProgressDiv.show();
                progressBar.width(percentageCompleted + "%").html(percentageCompleted + "%");
            });

        }
    });

    $("#drop-input").on("change", function() {
        var files = document.getElementById('drop-input').files;
        var fileLength = 0;
        for (var i = 0; i < files.length; i++) {
            fileLength++;
        }

        if (fileLength == 1) {

            $("#drop-input-label").text(fileLength + " file is selected");
        } else if (fileLength > 1) {
            $("#drop-input-label").text(fileLength + " files are selected");
        }

    });
});
