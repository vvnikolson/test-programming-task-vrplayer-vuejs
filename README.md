<<<<<<< HEAD
## Текст задания
---
Реализуйте приложение, которое будет выполнять следующие функции (важно: в конце документа указано, на чем должен быть реализован функционал):

1. Форма формирования vr/360 плеера. Картинки хранить на сервере. В форме будут следующие поля:
    + Название с валидацией от 3 до 60 символов, только латинские+цифры.
    + Поле загрузки 360 карнинки (можно через drag-n-drop)
    + Скорость вращения
    + Разрешить или запретить ручное вращение
    + Превью картинки в плеере (без очков). При клике по ней - переход на страницу с плеером.
2. Страница с плеером. Для этого пункта можно использовать готовые решения.
    + По умолчанию плеер загружается в 360 варианте без vr
    + У плеера должна быть кнопка перехода в vr режим и обратно.
    + В 360 режиме должна быть функция ручного вращения камеры путем перемещения курсора по полю.
3. Список видео/картинок. На странице должна быть таблица в стиле bootstrap, у которой будут следующие поля:
   + Название
   + Скорость вращения
   + Разрешено ли ручное вращение
   + Ссылка на страницу с плеером
   + Также должны быть следующие поля поиска:
     + Название
     + Разрешено ли ручное вращение

Клиентская часть должна быть написана с использованием vue.js, для стилей верстки лучше использовать bootstrap.
Серверная часть может быть написана на чем угодно.
Хранение данных должно быть в mysql или postgresql.
Допускается использование сторонних библиотек.
---
---
## Результат
### Серверная часть
Серверная часть реализована на Spring Boot 2.1.9, база данных -- MySQL8, для взаимодействия с которой используется ORM Hibernate. 
##### Интерфейс
- `[GET] /images` - список всех изображений (сразу всё, без пагинации), ответ представлен в виде массива JSON с полями:
```
[{
    id: <Идентификатор, используется для ссылок на изображения в плеере > 
    creation_time: <дата и время загрузки>
    name: <Название изображения> 
    rotation_speed: <заданная скорость вращения>
    manual_camera_control: <возможность вращения камерой с помощью мыши>
    preview: <ссылка на превью>
    source: <ссылка на оригинальное изображение>
}]
```
- `[GET] /images/<id>` - данные конкретного изображения, единственный JSON объект, с описанным выше форматом
- `[GET] /images/<id>/preview` - превью сцены из плеера, представляет собой панорамное изображение, натянутое на шар. 500x500 в base64 кодировке
- `[GET] /images/<id>/source` - исходное изображение, отправленное пользователем
- `[POST] /images` - точка загрузки изображения вместе с данными, формат `multipart/form-data`, payload представляет собой DTO, содержащий: исходный файл изображения в формате JPEG или PNG, превью сцены в виде Base64 строки, название сцены, данное пользователем, данные о том, как нужно смотреть сцену - разрешено ли ручное вращение камерой и скорость вращения камеры. Также реализована валидация всех полей в соответствии с условиями задачи.
В БД изображения хранятся в виде массива двоичных данных BLOB.
- На все остальные запросы, на которые отсутствует маппинг, возвращается заглавная страница `/`.  
---
### Клиентская часть
Клиентская часть реализована с помощью Vue.js, расширенный плагинами Vuex и Vue-router. 
Для отправки запросов использовался Axios. 
Стилями приложение обогатил расширенный Bootstrap (будь он неладен), интегрированный с Vue.js (Bootstrap-vue).
За сборку всех компонентов ответственен Webpack, на выходе которого получаем два файла `main.js`  и `main.css`, встраиваемые в отдаваемый сервером html.

Всё приложение состоит из трёх страниц:
- `/` -- здесь находится список всех ранее загруженных панорам, доступных для просмотра. Представляет собой таблицу с полями, указанными в условии задачи + дата загрузки и превью сцены, по клике на который происходит переход в сам плеер.
- `/show/<id>` -- здесь пользователь попадает в плеер, содержащим загруженное изображением с соответствующим `<id>`, выдаваемым при загрузке на сервер. Реализован с помощью WebGL библиотеки Three.js. Технически представляет собой сцену, куда помещён шар, в центре которого находится камера. На шар натягивается текстура, полученная из загруженного изображения.
- `/upload` -- страница с формой загрузки изображения. Загрузка происходит в два этапа: 
  - на первом происходит заполнение полей формы с валидацией. 
  - При нажатии на кнопку загрузки инициализируется плеер и извлекается превью из отрисованной сцены. При нажатии на полученное изображение, данные отправляются на сервер, а пользователь попадает непосредственно в сам плеер.

Структура клиентской части приложения выглядит следующим образом: 
- `utils` -- различные утилиты, здесь лежат обёртка над стандартными методами управления событиями и модифицированный объект управления камерой из примеров библиотеки three.js
- `styles` -- сюда сваливаем стили, которые будут переиспользованы в разных файлах множество раз. В данном случае, здесь происходит подключение bootstrap.   
- `store` -- вся основная логика приложения вынесена в модули Vuex, которых всего три:
  - `alert.module` - ответственен за всплывающие в левом нижнем углу уведомления о событиях, таких как иницализация плеера, успешная загрузка данных
  - `image.module` - обработка формы и хранение введённых пользователем данных
  - `player.module` - ответственен за плеер, хранит все ссылки на объекты сцены, рендер, текстуры
- `service` -- сервисный слой, ответственный за общение с сервером: формирование сообщений,обработка ошибок и тд.
- `router` -- сюда вынесен маппинг страниц vue-router
- `pages` -- корневые vue-компоненты, зарегистрированные как страницы во vue-router 
- `components` -- остальные vue-компоненты
- `api` -- непосредственно обращение к серверу 

## Сборка и запуск
Запуск производится в Docker контейнерах. С помощью `docker-compose` и файла `docker-compose.yml` конфигурируются три контейнера для сервера, клиентской части и базы данных. 
```sh
$ docker-compose up
```
Сервер будет доступен по адресу `localhost:8080`
#### Сложности
Если, по непонятным мне причинам, коннектор базы данных в спринге отказывается подключатся к БД из контейнера и просто вываливается с монструозным стактрейсом, хотя они однозначно видят друг друга, необходимо собрать jar файл и запустить сервер отдельно из консоли.
Для этого в дочерней директории подготовлен файл `Dockerfile-back-build`, который скопирует исходный текст в контейнер, запустит Maven, тот в свою очередь подтянет зависимости и соберёт всё в один jar. 
Далее собранный jar копируется в локальную дирректорию из контейнера и запускается локальной java машиной.
Последовательность комманд такова:
```
./rs-nov-test-task.backend$ docker image build -t docker-backend -f Dockerfile-back-build .
./rs-nov-test-task.backend$ docker create docker-backend
./rs-nov-test-task.backend$ docker cp <id_из_результата_команды>:/build/target/docker-vrplayer-backend.jar ./
./rs-nov-test-task.backend$ java -jar docker-vrplayer-backend.jar
```
Для запуска необходима JRE как минимум 8 версии.
=======
# test-programming-task-vrplayer-vuejs
Реализовать vr/360 плеер с использованием vue.js
>>>>>>> 806c36e8d3561285ce544442386042f8296c1ed4
