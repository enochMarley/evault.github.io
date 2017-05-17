app.controller("homeCtrl", function($scope) {

});

//The controller that controls the signup process
app.controller("signUpCtrl", function($scope, $http) { //definition of the controller using angular JS $scope and $http modules
    
    $scope.errMsg = " "; //The error message to show if there is and error in the signup process, instantiated to blank text

    //The method to sign up if user submits the form
    $scope.signupUser = function() {
        var userFullName = $scope.fullName; //capture the user's full name into the userFullName variable
        var username = $scope.username;//capture the user's username into the username variable
        var email = $scope.email;//capture the user's full email address into the email variable
        var phoneNumber = $scope.phoneNumber; //capture the user's phone number into the phoneNumber variable
        var password = $scope.password;//capture the user's full password into the password variable
        var passwordConf = $scope.passwordConf;//capture the user's confirmation password into the passwordConf variable
        var signupData = {}; //An empty object to hold all the variables, to be sent to the server,using http request

        
        
        //Check password length
        if(password.length < 8){
            alert("Password Legth Must Be 8 Characters Or More");
        }else if(passwordConf.length < 8){ //Check confirmation password length
            alert("Confirmation password Legth Must Be 8 Characters Or More");
        }else if (password != passwordConf) {//check if password matces confirmation password
            $scope.errMsg = "The Confirmation Password Does Not Match The Password Provided";
        }else{ //else if everything is ok with the user's details
            //adding all the variable into the object
            signupData.userFullName = userFullName;
            signupData.username = username;
            signupData.email = email;
            signupData.phoneNumber = phoneNumber;
            signupData.password = passwordConf;


            var data = $.param(signupData);//convert the object into a readable parameter that the server can read
            //initiate the http request
            $http({
                    method: 'POST',
                    url: 'includes/api/signup.php',
                    data: data,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                })
                .success(function(response) { //if the user's details are sent to the server and there is a response from the server
                    var responseMsg = response;

                    if (responseMsg.message.toString() == "userEmail already exists") {// if email address already exists

                        //errorDialog varable to hold the feedback which will be displayed in the modal
                        var errorDialog = $("<div class='feedbackModal' title='Sign Up Unsuccessful'><p>An Account With The Email Address " + email + " Already Exists. Please Use Another Email</p></div>");
                        //dislplay the modal with the error message
                        errorDialog.dialog({modal: true,draggable: false,width: 500,dialogClass: "no-close",
                            buttons: [{
                                text: "Ok",
                                click: function() {
                                    $(this).dialog("destroy");
                                }
                            }]
                        });
                        $scope.email = "";

                    } else if (responseMsg.message.toString() == "userName already exists") { //if username already exists
                         //errorDialog varable to hold the feedback which will be displayed in the modal
                        var errorDialog = $("<div class='feedbackModal' title='Sign Up Unsuccessful'><p>An Account With The Username " + username + " Already Exists. Please Use Another Email</p></div>");
                        //dislplay the modal with the error message
                        errorDialog.dialog({modal: true,draggable: false,width: 500,dialogClass: "no-close",
                            buttons: [{
                                text: "Ok",
                                click: function() {
                                    $(this).dialog("destroy");
                                }
                            }]
                        });//modal

                        $scope.username = "";

                    } else if (responseMsg.code.toString() == "SignUp Successful") { //Else if the signup is successful
                        //message to display in modal
                        var diaString = "<div class='feedbackModal' title='Sign Up Successful'><p>You Signed Up With eVault Successfully<br>Your Vault Number Is <b>" + responseMsg.message.toString() + "</b>.Login with Your Email And Password To Use eVault.</p></div>";
                        //display the modal with the message in it
                        $(diaString).dialog({modal: true,draggable: false,width: 500,dialogClass: "no-close",
                            buttons: [{
                                text: "Ok",
                                click: function() {
                                    $(this).dialog("destroy");
                                    window.location.href = "#login";
                                }
                            }]
                        });//modal

                    } 
                }).error(function(error) {//if there was an error in sending the user's details to the server, or any other error
                    //message to display in modal    
                    var errMsg = "Please check your internet connection and try again.";
                    //show modal with error message
                    $(errMsg).dialog({modal: true,draggable: false,width: 500,dialogClass: "no-close",
                            buttons: [{
                                text: "Ok",
                                click: function() {
                                    $(this).dialog("destroy");
                                    window.location.href = "#login";
                                }
                            }]
                        });//modal
                });
            
        }
        
    };
    
});



//The controller that handles the login of a user
app.controller("loginCtrl", function($scope, $http, $location, $rootScope) { //include angular JS modules
    $rootScope.loggedIn = false;//check if a user is logged in, instantaited to false initially
    $rootScope.username = ""; //the username of the user is blank, since user is not logged in

    
    //Method to log user in if user submits the login form
    $scope.loginUser = function() {
        var email = $scope.loginEmail;//capture th email address of the user into the email variable
        var vaultNumber = $scope.vaultNumber;//capture the vault number of the user into the vaulNumber variable
        var password = $scope.loginPassword;//capture the password of the user into the password variable
        var loginData = {};//define and empty object to hold the login details, to be sent to the server
        
        if(password.length < 8){//if password length is less than 8 characters
            
            alert("Password Legth Must Be 8 Characters Or More");
        }else if(vaultNumber.length < 5|| vaultNumber.length > 5){//if vaultnumber is less than or more than 5 characters
            
            alert("Vault Number Must Be 5 Characters Long");
        }else{//else if everything is ok proceed
            //add the details to the object
            loginData.email = email;
            loginData.password = password;
            loginData.vaultNumber = vaultNumber;
            var data = $.param(loginData);

            //initiate the login http request
            $http({
                    method: 'POST',
                    url: 'includes/api/login.php',
                    data: data,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                })
                .success(function(response) { //if there is a response from the server
                    if (response.code.toString() == "Login Successful") { //if login is successful
                        $rootScope.loggedIn = true; //user is logged in successfully, this will be used to allow user on userpage
                        $rootScope.userDetails = response.userDetails //put all the user's details into the rootscope, acts like a session
                        $location.path('/userPage');//send the user to the main page
                    } else if (response.code.toString() == "Login Failure") { //if there is a login failure
                        alert("login failed");//alert the user that the login failed
                    }

                }).error(function(error) { //if there is an error
                    alert("Please check your internet connection and try again.");// alert the user
            });
        }
        
        
    };

    //this mehtod verifies a user, behaves just like the login method but takes only the vault number
    $scope.verifyUser = function() {

        var vaultNumber = $scope.verifyVaultNumber;
        if(vaultNumber.length < 5|| vaultNumber.length > 5){//if vaultnumber is less than or more than 5 characters
            
            alert("Vault Number Must Be 5 Characters Long");
        }else{
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
        
    }
    
    //method to handle the logout of a user
    $scope.logout = function() {
        $rootScope = false;//user is not logged in
        $location.path('/login');//send user to the login page
    }
    
});


//the controller which manages the main page
app.controller("userCtrl", function($scope, $http, $location, $rootScope) {
    $scope.addItemDiv = false;//dont show the division for uploading files
    $scope.itemsDiv = false;//dont show the files uploaded by a user
    $scope.noItemsDiv = true; //show that there are no files initially
    $scope.addItemBtn = true;//show button to show upload division if clicked
    $scope.goUserBtn = false;//show button to show main page if clicked
    $scope.showContactDiv = false;//show the contacts us details
    $scope.items = "";//the files of the user are initially empty

    var fileDetails = {};//an emtpy object to
    fileDetails.userId = $rootScope.userDetails.userId; //the id of the user which was got when the user logged in is put into the object
    var data = $.param(fileDetails);

    //function to get all the files of the user, using the id to search uniquely
    function getItemes() {
        //initiate the http request to the server to get all the files of the user
        $http({
                method: 'GET',
                url: 'includes/api/getItemsScript.php?userId=' + $rootScope.userDetails.userId,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            })
            .success(function(response) { //if the request was successfull
            
                if (response != "") { //if the response was not empty, that is there are items
                    $scope.noItemsDiv = false; //hide the div which says there are not items
                    $scope.itemsDiv = true; //show the div which shows the item
                    $scope.addItemDiv = false;//hide the div for adding files
                    
                }else if (response == "") {//else if the response was empty, that is there are no files for the user
                    
                    $scope.noItemsDiv = true;//show the div which says there are not items
                    $scope.itemsDiv = false;//hide the div which shows the item
                    $scope.addItemDiv = false;//hide the div for adding files
                }

                $scope.items = response;//the response is passed the items which will be used in the views, which was initally blank
            
            }).error(function(error) {//if there is an error
            
                alert("Please check your internet connection and try again.");//alert the user
            });

    }
    
    //run the function the function to get all the files for the user
    getItemes();

    //if the button for showing upload div is clicked
    $scope.addItem = function() {
        $scope.addItemDiv = true;
        $scope.addItemBtn = false;
        $scope.goUserBtn = true;
        $scope.noItemsDiv = false;
        $scope.itemsDiv = false;
        $scope.showContactDiv = false;
    }

    //if the button for showing the files of the user is clicked
    $scope.goUserPage = function() {
        $scope.addItemDiv = false;
        $scope.noItemsDiv = false;
        $scope.itemsDiv = false;
        $scope.addItemBtn = true;
        $scope.goUserBtn = false;
        $scope.showContactDiv = false;
        if ($scope.items == "") {
            $scope.noItemsDiv = true;
            $scope.itemsDiv = false;
        } else {
            $scope.noItemsDiv = false;
            $scope.itemsDiv = true;
        }
    }

    //this is the function which deletes a files from a user's vault
    $scope.removeItem = function(id, fileName) {
        var confDel = confirm("Are you Sure You Want To Remove " + fileName + " From Your Vault?");//ask if the user is sure to delete
        if (confDel) {// if yes, continue
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

    //the method which logs out a user
    $scope.logout = function() {
        $rootScope = false; //user in not logged in anymore
        $location.path('/login');//send the user to the login page
    }
    
    
    //if the contact us is clicked
    $scope.showContact = function(){
        $scope.addItemDiv = false;
        $scope.itemsDiv = false;
        $scope.noItemsDiv = false;
        $scope.addItemBtn = false;
        $scope.goUserBtn = true;
        $scope.showContactDiv = true;
    }

    
    //definition of the fields in the userPage.html form, for it to interact with the controller
    $scope.username = $rootScope.userDetails.username; //display the usernam which was derived when the user logged  id
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

    //if  a file is dragged on the drop division
    dropDiv.on("dragover", function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).css('border-color', '#1b66b4');
    });

    //if a file is dropped in the division
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
            $(showErrDialog).dialog({modal: true,draggable: false,width: 500,dialogClass: "no-close",
                buttons: [{
                    text: "Ok",
                    click: function() {
                        $(this).dialog("destroy");
                    }
                }]
            });
            
        } else if (isTooLarge) {
            
            showErrDialog = $("<div class='feedbackModal' title='File Size Too Large'><p>The file '" + fileName + "' must not exceed 2GB</p></div>");
            $(showErrDialog).dialog({modal: true,draggable: false,width: 500,dialogClass: "no-close",
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
                    $(data).dialog({modal: true,draggable: false,width: 500,dialogClass: "no-close",
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
                    });//Modal

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

    
    //if the file input is used and not the drop div
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
            $(showErrDialog).dialog({modal: true,draggable: false,width: 500,dialogClass: "no-close",
                buttons: [{
                    text: "Ok",
                    click: function() {
                        $(this).dialog("destroy");
                    }
                }]
            });
            
        } else if (isTooLarge) {
            
            showErrDialog = $("<div class='feedbackModal' title='File Size Too Large'><p>The file '" + fileName + "' must not exceed 2GB</p></div>");
            $(showErrDialog).dialog({modal: true,draggable: false,width: 500,dialogClass: "no-close",
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
                    $(data).dialog({modal: true,draggable: false,width: 500,dialogClass: "no-close",
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

    //if a user selects a file using the input
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
