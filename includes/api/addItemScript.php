<?php
    include "dbConfig.php";

    $userId = intval($database->real_escape_string(trim($_GET['userId'])));
    $userFullName = $database->real_escape_string(trim($_GET['userFullName']));

  	$allSuccess = false;
  	$anError = 0;
  	$path = "../uploads/";



  	foreach ($_FILES as $key => $file) {
      $rawFileName = $file['name'];
  		$rawFileSize = $file['size'];
  		$rawFileDirectory = $path.$rawFileName;
  		$rawFileTempName = $file['tmp_name'];


      $query = "INSERT INTO vaultFiles(userId,fileName, fileSize) VALUES($userId,'$rawFileName', '$rawFileSize');";

  		$uploaded = move_uploaded_file($rawFileTempName, $rawFileDirectory);

  		if ($uploaded == 1) {
  			$result = $database->query($query);
  		}

  		if ($uploaded ==1 && $result == 1) {
  			$allSuccess = true;
  		}else{
  			$anError ++;
  		}
  	}

  	if ($allSuccess) {
        echo "<div class='feedbackModal' title='Document Added Successfully'>
            <p>Your Documents Were Added To The Vault Successfully </p><br>
        </div>";
  	}else{
  		echo "
			<div class='feedbackModal' title='Document Could Not Be Added'>
				<p>Sorry, There Was An Error While Your Your Documents Were Being Added. Please Check Your Internet Connection And Try Again.</p><br>
			</div>
  		";
  	}
?>
