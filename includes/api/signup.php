<?php
    include "dbConfig.php";
    include "functions.php";

    $rawUserFullName = $database->real_escape_string(trim($_POST['userFullName']));
    $rawUsername = $database->real_escape_string(trim($_POST['username']));
    $rawUserEmail = $database->real_escape_string(trim($_POST['email']));
    $rawUserPhone = $database->real_escape_string(trim($_POST['phoneNumber']));
    $rawUserPassword = $database->real_escape_string(trim($_POST['password']));
    $rawUserVaultNumber = tokenCodeGenerator();
    $response = array();

    /*$userFullName = encryptData($rawUserFullName);
    $username = encryptData($rawUsername);
    $userEmail = encryptData($rawUserEmail);
    $userPhone = encryptData($rawUserPhone);
    $userPassword = encryptData($rawUserPassword);
    $userVaultNumber = encryptData($rawUserVaultNumber);*/

    $query = "SELECT * FROM vaultuser WHERE userEmail = '$rawUserEmail' OR userName = '$rawUsername';";
    $result = $database->query($query);
    if (mysqli_num_rows($result) > 0) {
        $row = $result->fetch_assoc();
        if ($row['userEmail'] == "$rawUserEmail") {
            $code = "SignUp Failed";
        	$message = "userEmail already exists";
        	$response['code'] = $code;
        	$response['message'] = $message;
        	header('Content-Type: application/json');
        	echo json_encode($response);
        }
        if ($row['userName'] == "$rawUsername") {
            $code = "SignUp Failed";
        	$message = "userName already exists";
        	$response['code'] = $code;
        	$response['message'] = $message;
        	header('Content-Type: application/json');
        	echo json_encode($response);
        }
    }else{
        $query1 = "INSERT INTO vaultuser (userFullName,userName,userEmail,userPhone,userPassword,userVaultNumber)".
        "VALUES ('$rawUserFullName','$rawUsername','$rawUserEmail','$rawUserPhone','$rawUserPassword','$rawUserVaultNumber');";
        $result1 = $database->query($query1);
        if ($result1) {
            $code = "SignUp Successful";
        	$message = $rawUserVaultNumber;
        	$response['code'] = $code;
        	$response['message'] = $message;
        	header('Content-Type: application/json');
        	echo json_encode($response);
        }
    }
    /*echo "$rawUserEmail $rawUsername $rawUserFullName $rawUserPhone $rawUserPassword from the server of the application";
    echo $vaultNumber;*/


?>
