import { getCurrentInstance as originGetCurrentInstance } from "vue";
import { CurrentInstance, IPropsComponentContext } from "../types";

export const getCurrentInstance = (): CurrentInstance => {
   const instance = originGetCurrentInstance();

   if(instance) {
       return {
          props: instance.props as any,
          emit: instance.emit,
          pluginSettings: instance.appContext.config.globalProperties.$daDataNext ?? ''
       }
   }

   return {
       props: {
           apiUrl: '',
           cssClasses: {},
           inputName: '',
           modelValue: '',
           placeholder: '',
           token: '',
           type: '',
           mergeParams: {},
           setInputValue: undefined,
           debounceWait: 0,
           debounceOptions: {}
       } as IPropsComponentContext,
       emit: () => null,
       pluginSettings: undefined
   }
};