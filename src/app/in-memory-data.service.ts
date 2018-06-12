import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const states = [
      {id: -1001, name: 'Соглашение',
        web_comment: 'С <a href=\"http://www.tut.by\" target=\"_blank\" >правилами и условиями</a>  пользования '},
      {id: -1000, name: 'Инициализация', web_comment: 'Укажите код указанный на карте'},
      {id: -12, name: 'Карта не выдана', web_comment: 'Нет данных о выдаче карты пользователю. Повторите попытку позже.'},
      {id: -11, name: 'Не верный статус', web_comment: ''},
      {id: -10, name: 'Указана не верная карта', web_comment: 'Проверьте код карты'},
      {id: -1, name: 'Ошибка базы данных', web_comment: 'Сервис не доступен. Попробуйте повторить попытку позже.'},
      {id: 1, name: 'Выдана', web_comment: ''},
      {id: 5, name: 'Регистрация', web_comment: 'Ваша анкета ожидает поверки на корректность заполнения.'},
      {id: 10, name: 'Уточнение анкеты', web_comment: 'Ваша анкета не корректно заполнена. '},
      {id: 100, name: 'Зарегистрирован', web_comment: 'Ваша анкета зарегистрирована.'}];
    return {states};
  }


}
