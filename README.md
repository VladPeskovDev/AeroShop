# AeroShop
Техническое задание | ERP.AERO | Node.js dev
Задача:
Сделать сервис с REST API. 
•	Авторизация по jwt-токену (/info, /logout, /file(все роуты) );
•	Настроить CORS для доступа с любого домена;
•	DB – Mysql;
•	Токен создавать при каждой авторизации, действителен 10 минут. Продлевать по истечению, с помощью refresh токена;
•	Реализовать на основе фреймворка express js;
•	API:
o	/signin [POST] - запрос jwt-токена по id и паролю;
o	/signin/new_token [POST]  - обновление jwt-токена по refresh токену
o	/signup [POST] - регистрация нового пользователя;
o	Поля id и password, id это номер телефона или email;
o	/file/upload [POST] - добавление нового файла в систему и запись параметров файла в базу: название, расширение, MIME type, размер, дата загрузки;
o	/file/list [GET]  выводит список файлов и их параметров из базы с использованием пагинации с размером страницы, указанного в передаваемом параметре list_size, по умолчанию 10 записей на страницу, если параметр пустой. Номер страницы указан в параметре page, по умолчанию 1, если не задан; 
o	/file/delete/:id [DELETE] - удаляет документ из базы и локального хранилища;
o	/file/:id [GET] - вывод информации о выбранном файле; 
o	/file/download/:id [GET] - скачивание конкретного файла;
o	/file/update/:id [PUT] - обновление текущего документа на новый в базе и локальном хранилище;
•	При удачной регистрации вернуть пару  jwt-токен и refresh токен;
o	/info [GET] - возвращает id пользователя;
o	/logout [GET] - выйти из системы;
•	После выхода необходимо заблокировать текущие токены пользователя. При следующем входе, пользователь должен получить новую пару токенов, отличную от тех, которые были при выходе;
•	Старые токены должны перестать работать после выхода;
•	Вход в API может осуществлять несколько устройств под одним логином. 
•	После выхода одного из устройств, остальные устройства одного пользователя должны продолжать работать.

