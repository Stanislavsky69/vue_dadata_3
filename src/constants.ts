import { InjectionKey } from 'vue';
import { PluginOptions } from "./types";

export const dadataNextOptions = Symbol('da-data-next-options') as InjectionKey<PluginOptions>;