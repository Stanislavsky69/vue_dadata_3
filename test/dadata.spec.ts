import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount, flushPromises, enableAutoUnmount } from '@vue/test-utils';
import axios from 'axios';

import { DaDataNext, CSS_CLASSES_DEFAULT } from '../src';

enableAutoUnmount(afterEach);

const MOCK_TOKEN = '12345678910';
const MOCK_RESPONSE = {
    suggestions: [{
        value: 'Тест'
    }, {
        value: 'Тест 2'
    }]
}

vi.spyOn(axios, 'request').mockImplementation(() => MOCK_RESPONSE)

describe('Тестирование компонента dadata-vue-3', () => {

    it('Показ списка на фокус', async () => {

        axios.post
       
        const component = mount(DaDataNext, {
            props: {
                token: MOCK_TOKEN,
                modelValue: 'Москва'
            }
        });
        
        const input = component.find('input');

        await input.trigger('focus');
        
        await flushPromises();

        expect(component.find(`.${CSS_CLASSES_DEFAULT.row}`).exists()).toBe(true);

    });
})