# vue_dadata_3

Компонент для работы с сервисом [dadata](https://dadata.ru/)

### Запуск

```
npm install vue_dadata_3
```


```
<template>
   <div>
        <dadata v-model="value"></dadata>
   </div>

</template>
<script setup>

import { ref } from 'vue';
import dadata from 'vue_dadata_3'

const value = ref(null);

</script>
```

### Стилизация

Нужно подключить файлы стилей так:
```
@import "~vue_dadata_3/src/assets/variabless";
@import "~vue_dadata_3/src/assets/styles";
```


### Состояния

```
{
  token: {
    type: String,
    default: null,
    required: true,
  },
  type: {
    type: String,
    default: 'address',
  },
  params: {
    type: Object,
    default: () => {},
  },
  setInputValue: {
    type: Function,
  },
  apiUrl: {
    type: String,
    default: null,
  },
  inputName: {
    type: String,
    default: 'address',
  },
  placeholder: {
    type: String,
    default: null,
  }
```

**token** - токен сервиса

**type** - тип [подсказок](https://dadata.ru/suggestions/usage/) по умолчанию address

**params** - [параметры](https://confluence.hflabs.ru/display/SGTDOC/HTTP+API) запроса.

**setInputValue** - коллбэк-функция, которая обрабатывает значение после выбора из подсказок. Принимает параметр объекта suggestion.

**apiUrl** - кастомный урл для отправки запросов, заменяет дефолтный.

**inputName** - значение атрибута name у input

**placeholder** - значение атрибута placeholder у input


### События

**onSelected** - возвращает объект, выбранной подсказки.

### Слоты

**list-item** - слот для отдельной подсказки. Слот принимает два параметра - объект подсказки и функция для обработки подсказки

```
 <da-data>
  <template #list-item="{ prop, prepareValue}">
    <span v-html="prepareValue(prop, 'value')"></span>
  </template>
 </da-data>
```

Функция **prepareValue** нужна для сохранения подсветки соответствий запроса. 
Эта функция опциональна. Если все-таки решили её использовать, то нужно выводить, как в примере выше через директиву v-html.

