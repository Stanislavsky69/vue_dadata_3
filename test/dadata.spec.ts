import { describe, it, expect, vi,  afterEach } from 'vitest';
import { mount, enableAutoUnmount } from '@vue/test-utils';
import { defineComponent, nextTick, ref } from 'vue';

import { DaDataNext, CSS_CLASSES_DEFAULT } from '../src';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

enableAutoUnmount(afterEach);

const MOCK_TOKEN = '12345678910';
const MOCK_RESPONSE = {
    suggestions: [{
        data: {
            street: 'ул Тестовая'
        },
        value: 'Тест'
    }, {
        data: {
            street: 'ул Тестовая 2'
        },
        value: 'Тест 2'
    }]
}

const mock = new AxiosMockAdapter(axios);

mock.onPost('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address').reply(200, MOCK_RESPONSE);

vi.mock('lodash-es', async () => {
    let lodash;

    await vi.importActual('lodash-es').then(utils => lodash = utils)
    
    return {
        ...lodash,
        debounce: (fn) => {
            fn.cancel = vi.fn();
            return fn;
        },
    }
});

describe('Тестирование компонента dadata-vue-3', () => {

    it('Вызов события input', () => {
        const component = mount(DaDataNext, {
            props: {
                modelValue: 'Москва',
                token: MOCK_TOKEN,
            }
        });
        const input = component.find('input');

        input.trigger('input');

        expect(component.emitted()).toHaveProperty('input');

    });

    it('Вызов события focus', () => {
        const component = mount(DaDataNext, {
            props: {
                modelValue: 'Москва',
                token: MOCK_TOKEN,
            }
        });
        const input = component.find('input');

        input.trigger('focus');

        expect(component.emitted()).toHaveProperty('focus');
    });

    it('Вызов события onSelected', async () => {
        const component = mount(DaDataNext, {
            props: {
                modelValue: 'Москва',
                token: MOCK_TOKEN,
            }
        });
        const input = component.find('input');

        await input.trigger('focus');

        const element = component.find(`.${CSS_CLASSES_DEFAULT.row}:first-child`);

        element.trigger('click');

        expect(component.emitted()).toHaveProperty('onSelected');
    });

    it('Показ списка при вводе значения', async () => {
        const component = mount(DaDataNext, {
            props: {
                modelValue: 'Москва',
                token: MOCK_TOKEN,
            }
        });
        const input = component.find('input');
       
        await input.setValue('Тест 3');

        expect(component.html()).toContain('Тест 2');

    });

    it('Показ списка на фокус', async () => {
        const component = mount(DaDataNext, {
            props: {
                modelValue: 'Москва',
                token: MOCK_TOKEN,
            }
        });
        const input = component.find('input');
       
        await input.trigger('focus');

        expect(component.html()).toContain('Тест 2');

    });

    it('Закрытие списка на клик вне области', async () => {
        const component = mount(DaDataNext, {
            props: {
                modelValue: 'Москва',
                token: MOCK_TOKEN,
            },
        });
        const input = component.find('input');
       
        await input.trigger('focus');

        document.dispatchEvent(new Event('click'));

        await nextTick();

        expect(component.html()).not.toContain('Тест 2');

    });

    it('Слот list-item', async () => {
        const component = mount(DaDataNext, {
            props: {
                modelValue: 'Москва',
                token: MOCK_TOKEN
            },

            slots: {
                'list-item': '<template #list-item="{ prop }">{{ prop.data.street }}</template>'
            }
        });
        const input = component.find('input');
        await input.trigger('focus');

        expect(component.html()).toContain('ул Тестовая 2');

    });

    it('Параметра слота prepareValue', async () => {
        const component = mount(DaDataNext, {
            props: {
                modelValue: 'Тест 2',
                token: MOCK_TOKEN,
            },

            slots: {
                'list-item': `<template #list-item="{ prop, prepareValue }"><span v-html="prepareValue(prop, 'value')"></span></template>`
            }
        });

        const input = component.find('input');

        await input.trigger('focus');

        const highlights = component.findAll('.highlights');

        expect(highlights.length > 0).toBe(true);

    });

    it('Коллбэк setInputValue', async () => {
        const component = defineComponent({
            components: {
                DaDataNext
            },

            setup(){
                return {
                    localValue: ref('Москва'),
                    token: MOCK_TOKEN,
                    setInputValue: ({ data }) => {
                        return data.street
                    }
                }
            },

            template: `<div><da-data-next v-model="localValue" :set-input-value="setInputValue" :token="token" /></div>`
        })
        const mountComponent = mount(component);

        const input =  mountComponent.find('input');

        await input.trigger('focus');

        const element =  mountComponent.find(`.${CSS_CLASSES_DEFAULT.row}:first-child`);

        await element.trigger('click');

        expect(input.element.value).toBe('ул Тестовая');
    });
})