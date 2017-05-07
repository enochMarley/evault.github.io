<?php
    #This is a functions module for handling the token code generator and the cryptographic scripts.

    #Function for the token code generator
    function tokenCodeGenerator(){
        $salt = array("@#$%****","~~@#$%","(*)%%^","!~~~*&^&&","~!!@~**(^","!!@#*(","!!(*)~~#@%","!*(<>>!");
        $hashed_password = crypt(rand(),$salt[rand(1,(count($salt) -1))]);
	       return substr(md5((string)$hashed_password), 0 ,5);
    }

    function formatBytes($bytes, $precision = 2) {
      if ($bytes > pow(1024,3)) return round($bytes / pow(1024,3), $precision)."GB";
      else if ($bytes > pow(1024,2)) return round($bytes / pow(1024,2), $precision)."MB";
      else if ($bytes > 1024) return round($bytes / 1024, $precision)."KB";
      else return ($bytes)."B";
    }


?>
