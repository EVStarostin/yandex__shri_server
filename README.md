### Задание
- [x] Написать сервер на express который будет подниматься на 8000 порту и обрабатывать два роута: 
1. /status — должен выдавать время, прошедшее с запуска сервера в формате hh:mm:ss  
2. /api/events — должен отдавать содержимое файла events.json. При передаче get-параметра type включается фильтрация по типам событий. При передаче некорректного type — отдавать статус 400 "incorrect type". (/api/events?type=info:critical) Все остальные роуты должны отдавать `<h1>Page not found</h1>`, с корректным статусом 404.  

*Звёздочка

- [x] Перейти на POST-параметры.

- [x] Сделать пагинацию событий — придумать и реализовать API, позволяющее выводить события постранично.

- [x] Подключить данные к вёрстке из первого задания.

## Комментарии
`npm run start` - запустить локальный сервер на 8000 порту.  
Для удобства состыковки с фронтом залил сервер на VPS — http://node.evstar.ru:8000/status  
Ссылка на сайт — http://www.evstar.ru/  

API корректно обрабатывает запросы:

- GET /status — возвращает uptime сервера в формате 00:00:00
- GET /api/events — возвращает JSON с событиями {"events": [...]}
- GET /api/events?type=info:critical&page=2&limit=2 — возвращается отфильтрованный список событий, поля type, page и limit не обязательные. Если указана страница, но не указан лимит, то берется лимит по умолчанию - 10. В ответе также отправляется общее количество событий, чтобы на странице можно было отобразить, сколько всего страниц.  
- POST /api/events (в body необязательные поля info, page, limit) — ответ аналогичен GET запросу

