<?php
  include "dbConfig.php";
  $fileId = intval($database->real_escape_string(trim($_POST['fileId'])));

  $query = "DELETE FROM vaultFiles WHERE fileId = $fileId;";

  $result = $database->query($query);

  if ($result) {
    echo "Removal Successful";
  }else {
    echo "Cannot Remove Item Now";
  }


?>
