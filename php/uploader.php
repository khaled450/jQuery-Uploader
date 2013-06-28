<?php
set_time_limit(120); //2min
ini_set('max_execution_time', 120);

$target_path = "files/";
$tmp_name = $_FILES['fileupload']['tmp_name'];
$name = $_FILES['fileupload']['name'];
$save_file_as = $_GET['filename'];

$target_file = $target_path.$name;


$complete = $target_path.$save_file_as;
$com = fopen($complete, "ab");
error_log($target_path);

// Open temp file
$in = fopen($tmp_name, "rb");
if ( $in ) {
  while( $buff = fread( $in, 1048576 ) ) { 
    fwrite($com, $buff);
  }   
}
fclose($in);
fclose($com);
?>
