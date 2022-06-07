import { getCurrentInstance as originGetCurrentInstance } from "vue";
import { CurrentInstance, IPropsComponentContext } from "../types";

export const getCurrentInstance = (): CurrentInstance => {
   const instance = originGetCurrentInstance();

   if(instance) {
       return {
          props: instance.props as any,
          emit: instance.emit
       }
   }

   return {
       props: {
           apiUrl: '',
           cssClasses: {},
           inputName: '',
           modelValue: '',
           params: null,
           placeholder: '',
           token: '',
           type: '',
           mergeParams: {},
           setInputValue: undefined,
       } as IPropsComponentContext,
       emit: () => null
   }
};