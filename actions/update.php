<?php
// phpinfo();
// This PHP script must be in "SOME_PATH/jsonFile/index.php"

// $file = 'jsonFile.js';

// if($_SERVER['REQUEST_METHOD'] === 'POST')
// // or if(!empty($_POST))
// {
//     file_put_contents($file, $_POST["jsonTxt"]);
//     //may be some error handeling if you want
// }
// else if($_SERVER['REQUEST_METHOD'] === 'GET')
// // or else if(!empty($_GET))
// {
//     echo file_get_contents($file);
//     //may be some error handeling if you want
// }


// if ('application/json' == $_SERVER['CONTENT_TYPE']
// && 'POST' == $_SERVER['REQUEST_METHOD'])
// {
//     $_REQUEST['JSON'] = json_decode(
//         file_get_contents('php://input'), true
//         );
//         $_POST['JSON'] = & $_REQUEST['JSON'];
//     }

/////////////////////////////////////

// Обработка GET-запроса

    
    // $input = file_get_contents('php://input');

    // $file = file_get_contents('data.json');     // читаем данные из файла
    // $input = json_decode($file, true);          // декодируем из json-формата в ассоциативный массив (true)
    
    // if (isset($_GET['fio']) && isset($_GET['phone'])) {
    //     $input[] = ['fio' => $_GET['fio'], 'phone' => $_GET['phone']];  // добавляем в массив полученные из input данные
    //     $out = json_encode($input);         // кодируем обратно в json
    //     file_put_contents('data.json', $out);    
    //     echo $out;
	// } else {
    //         $out = json_encode($input);         // кодируем обратно в json
    //         echo $out;
	// }

// [{"fio":"Ivanov","phone":"11"},{"fio":"Petrov","phone":"22"},{"fio":"Sidorov","phone":"33"}]

/////////////////////////////////////////

// Обработка POST-запроса
    $overwrite = false;
    $post = file_get_contents('php://input');   // получаем json-данные
    $post_decoded = json_decode($post, true);
    $ip = $_SERVER['REMOTE_ADDR'];

    $init = $post_decoded['init'];      // данные запрошены при первоначальной загрузке страницы

    $file = file_get_contents("data/{$ip}.json");     // читаем данные из файла

    $input = json_decode($file, true);          // декодируем из json-формата в ассоциативный массив (true)
    $contacts = $input;//['contacts'];

    if (!$init) {   // пришло новое значение

    foreach ($contacts as $item) {     // проверка на существование 
        if ($item['id'] == $post_decoded['id']) {    // если запись с таким ID существует в файле
            
            if (!$post_decoded['toDelete'])  {      // если нет флага toDelete
                $newarr[] = $post_decoded;              // то перезаписать ее новыми данными
            }
            $overwrite = true;

        } else {
            $newarr[] = array('fio' => $item['fio'], 'phone' => $item['phone'], 'id' => $item['id'], 'desc' => $item['desc']);
        }
    }

        if (!$overwrite) {
            $contacts[] = $post_decoded;
        } else {
            $contacts = $newarr;
        }
    } 
    // file_put_contents('data/data3.json', json_encode($contacts));    // сохраняем в файл
    
        $out = json_encode($contacts);         // кодируем обратно в json
        echo $out;                              // отдаем json браузеру
