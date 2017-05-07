<?php
    include "dbConfig.php";

    $rawUserEmail = $database->real_escape_string(trim($_POST['email']));
    $rawUserPassword = $database->real_escape_string(trim($_POST['password']));
    $rawVaultNumber = $database->real_escape_string(trim($_POST['vaultNumber']));


    $query = "SELECT * FROM vaultUser WHERE userEmail = '$rawUserEmail' AND userPassword = '$rawUserPassword' AND userVaultNumber = '$rawVaultNumber';";
    $result = $database->query($query);
    if (mysqli_num_rows($result) > 0) {
        $row = $result->fetch_assoc();
        if ($row['userEmail'] == "$rawUserEmail" && $row['userPassword'] == "$rawUserPassword") {
            $response = array('code' => 'Login Successful', 'userDetails' => array('username'=> trim($row['userName']), 'userId' => $row['userId'], 'userFullName' => trim($row['userFullName']), 'userEmail' => trim($row['userEmail'])));
        	header('Content-Type: application/json');
        	echo json_encode($response);
        }
    }else {
        $code = "Login Failure";
        $message = "Wrong Username Or Password. Please Try Again";
        $response['code'] = $code;
        $response['message'] = $message;
        header('Content-Type: application/json');
        echo json_encode($response);
    }

?>
