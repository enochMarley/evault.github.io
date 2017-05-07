<?php

    define("SERVER_NAME", "localhost");
    define("USER_NAME", "root");
    define("USER_PASSWORD", "");
    define("DATABASE_NAME", "evault");

    $database = new mysqli(SERVER_NAME,USER_NAME,USER_PASSWORD,DATABASE_NAME) or die("Sorry, could not connect to database.");
 ?>
