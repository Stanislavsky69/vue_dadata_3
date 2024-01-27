# vue-dadata-3

Компонент для работы с сервисом [dadata](https://dadata.ru/)

## Обновление 2.0


### Запуск

```
npm install vue-dadata-3

```

```
yarn add vue-dadata-3

```

```
<template>
   <div>
        <DaDataNext v-model="value"></DaDataNext>
   </div>

</template>
<script setup lang="ts">

import { ref } from 'vue';
import { DaDataNext } from 'vue-dadata-3'

const value = ref(null);

</script>
```

или

```
import DaDataNext from 'vue-dadata-3';

createApp(App).use(DaDataNext, {
  tag: 'ИМЯ КОМПОНЕНТА. По умолчанию da-data-next',
  token: 'ВАШ ТОКЕН',
}).mount('#app');

```
Можно импортировать composable и использовать в своем компоненте:

```
import { useDaData } from 'vue-dadata-3';

```


Установив токен глобально далее его можно будет переопределить через пропсы.

### Стилизация

Стилизация согласно новому [стандарту](https://sass-lang.com/documentation/at-rules/use#configuration) sass.

Доступные переменные:

```
$dadata_v_3_base_font_size: 16px!default;
$dadata_v_3_input_width: 280px!default;
$dadata_v_3_input_height: 40px!default;
$dadata_v_3_borders_color: #797979!default;
$dadata_v_3_list_bg_color: #fff!default;
$dadata_v_3_list_font_size: 14px!default;
$dadata_v_3_row_hover: #a8a8a8!default;

```
Переопределяем переменные следующим образом:

```
@use "vue-dadata-3/styles" with (
  $dadata_v_3_base_font_size: 14px;
);

```

Или можно подключить готовый css, например в main.js

```
import "vue-dadata-3/index.css";

```


### Входные параметры

```
{
    modelValue: {
        type: String,
        required: true
    },
    token: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: 'address',
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
    inputId: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null,
    },
    mergeParams: {
      type: Object as PropType<AxiosRequestConfig>,
      default: () => ({}),
    },
    debounceWait: {
       type: Number,
       default: 0
    },
    debounceOptions: {
        type: Object as PropType<DebounceSettings>,
        default: () => ({})
    },
    cssClasses: {
      type: Object as PropType<CssClasses>,
      default: () => ({}),
    },
    locations: {
      type: Object as PropType<LocationOptions>,
      default: () => ({}),
    },
    fromBound: {
      type: Object as PropType<DaDataBound>,
      default: () => ({}),
    },
    toBound: {
      type: Object as PropType<DaDataBound>,
      default: () => ({}),
    },
}

```

- **token** - токен сервиса

- **type** - тип [подсказок](https://dadata.ru/suggestions/usage/) по умолчанию address

- **mergeParams** - [параметры](https://confluence.hflabs.ru/display/SGTDOC/HTTP+API) запроса.

- **setInputValue** - коллбэк-функция, которая обрабатывает значение после выбора из подсказок. Принимает параметр объекта suggestion.

- **apiUrl** - кастомный урл для отправки запросов, заменяет дефолтный.

- **inputName** - значение атрибута name у input

- **inputId** - значение атрибута id у input

- **placeholder** - значение атрибута placeholder у input

- **debounceWait** - время задержки перед отправкой запроса

- **debounceOptions** - опции плагина [debounce](https://lodash.com/docs/4.17.15#debounce) пакета lodash

- **cssClasses** - переопределение дефолтных css классов
  ```
  type CssClasses = {
    root: string,
    input: string,
    listEmpty: string,
    row: string,
    list: string
  }
  ```
- **locations** - настройка ограничений и приоритетов для местности по которой осуществляется поиск. 
Передаётся объектом со следующими опциональными полями:

  | Название        | Тип                           | Описание                                                                                                            |
  |-----------------|-------------------------------|---------------------------------------------------------------------------------------------------------------------|
  | division        | "municipal"\|"administrative" | [Административное либо муниципальное деление](https://confluence.hflabs.ru/pages/viewpage.action?pageId=1326056589) |
  | locations       | array[object]                 | [Ограничение сектора поиска](https://confluence.hflabs.ru/pages/viewpage.action?pageId=204669108)                   |
  | locations_geo   | array[object]                 | [Ограничение по радиусу окружности](https://confluence.hflabs.ru/pages/viewpage.action?pageId=990871806)            |
  | locations_boost | array[object]                 | [Приоритет города при ранжировании](https://confluence.hflabs.ru/pages/viewpage.action?pageId=285343795)            |

- **fromBound** и **toBound** - [гранулярные подсказки](https://confluence.hflabs.ru/pages/viewpage.action?pageId=222888017). Передаётся в виде объекта с полем value, содержащий нужный тип. Например, следующий элемент будет искать исключительно по городам: 

  ```vue
  <DaDataNext :from-bound="{value: 'city'}" :to-bound="{value: 'city'}"/>
  ```

### События

**onSelected** - возвращает объект, выбранной подсказки.

### Слоты

**list-item** - слот для отдельной подсказки. Слот принимает два параметра - объект подсказки и функция для обработки подсказки

```
 <da-data-next>
  <template #list-item="{ prop, prepareValue}">
    <span v-html="prepareValue(prop, 'value')"></span>
  </template>
 </da-data-next>
```

Функция **prepareValue** нужна для сохранения подсветки соответствий запроса. 
Эта функция опциональна. Если все-таки решили её использовать, то нужно выводить, как в примере выше через директиву v-html.




