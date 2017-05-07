<?php
    include "dbConfig.php";
    include "functions.php";
    $userId = intval($database->real_escape_string(trim($_GET['userId'])));
    $response = array();

    $query = "SELECT * FROM vaultFiles where userId = $userId;";
    $result = $database->query($query);
    $counter = 0;

    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
           $fileSize = formatBytes(intval(trim($row['fileSize'])));
            $response["$counter"] = array('fileId' => trim($row['fileId']),'fileName' => trim($row['fileName']), 'fileSize' => "$fileSize", 'dateAdded' => trim($row['dateAdded']));
            $counter ++;
        }

        header('Content-Type: application/json');
        echo json_encode($response);
    }else {
        echo "";
    }


?>
