<?php
    $post = file_get_contents('php://input');   // получаем json-данные
    //$ip = $_SERVER['REMOTE_ADDR'];

    file_put_contents("cart.json", $post);  

        $out = json_encode(array('message' => 'Данные сохранены в файл...'));  
        echo $out;                              // отдаем json браузеру
?>