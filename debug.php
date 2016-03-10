<?php

class Debug {	
	
	static function log($string){
	//	file_put_contents('log.txt', $string."\n", FILE_APPEND);
		file_put_contents('/var/www/projectx/debug.log', $string."\n", FILE_APPEND);
	}
}	
?>
