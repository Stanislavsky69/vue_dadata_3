import {DebounceSettings} from "lodash-es";
import {Ref, WritableComputedRef, ComputedRef} from 'vue';



export type DaDataResult<T> = {
  value: string,
  unrestricted_value: string,
  data: T
}

export type DaDataAddressMetro = {
  name: string;
  line: string;
  distance: number;
}

export type DaDataAddress = {
  area: string | null;
  area_fias_id: string | null;
  area_kladr_id: string | null;
  area_type: string | null;
  area_type_full: string | null;
  area_with_type: string | null;
  beltway_distance: null;
  beltway_hit: null;
  block: string | null;
  block_type: string | null;
  block_type_full: string | null;
  federal_district: string | null;
  capital_marker: '0' | '1' | '2' | '3' | '4';
  city: string | null;
  city_area: string | null;
  city_district: string | null;
  city_district_fias_id: string | null;
  city_district_kladr_id: string | null;
  city_district_type: string | null;
  city_district_type_full: string | null;
  city_district_with_type: string | null;
  city_fias_id: string | null;
  city_kladr_id: string | null;
  city_type: string | null;
  city_type_full: string | null;
  city_with_type: string | null;
  country: string;
  country_iso_code: string;
  fias_id: string;
  fias_level: string;
  flat: string | null;
  flat_area: null;
  flat_price: null;
  flat_type: string | null;
  flat_type_full: string | null;
  geo_lat: string | null;
  geo_lon: string | null;
  geoname_id: string | null;
  history_values: string[] | null;
  house: string | null;
  house_fias_id: string | null;
  house_kladr_id: string | null;
  house_type: string | null;
  house_type_full: string | null;
  kladr_id: string;
  okato: string | null;
  oktmo: string | null;
  postal_box: string | null;
  postal_code: string | null;
  qc: null;
  qc_complete: null;
  qc_geo: '0' | '1' | '2' | '3' | '4' | '5';
  qc_house: null;
  region: string;
  region_fias_id: string;
  region_kladr_id: string;
  region_type: string;
  region_type_full: string;
  region_with_type: string;
  settlement: string | null;
  settlement_fias_id: string | null;
  settlement_kladr_id: string | null;
  settlement_type: string | null;
  settlement_type_full: string | null;
  settlement_with_type: string | null;
  source: string | null;
  square_meter_price: null;
  street: string | null;
  street_fias_id: string | null;
  street_kladr_id: string | null;
  street_type: string | null;
  street_type_full: string | null;
  street_with_type: string | null;
  tax_office: string | null;
  tax_office_legal: string | null;
  timezone: string | null;
  unparsed_parts: null;
  fias_code: string;
  region_iso_code: string;
  fias_actuality_state: string;
  metro: DaDataAddressMetro[] | null;
}

export type DaDataAddressBounds = 'country' | 'region' | 'area' | 'city' | 'settlement' | 'street' | 'houses' | 'flat';

export type DaDataPartyType = 'LEGAL' | 'INDIVIDUAL';

export type DaDataPartyBranchType = 'MAIN' | 'BRANCH';

export type DaDataPartyStatus = 'ACTIVE' | 'LIQUIDATING' | 'LIQUIDATED' | 'REORGANIZING';

export type DaDataParty = {
  inn: string;
  kpp: string;
  ogrn: string;
  ogrn_date: number;
  hid: string;
  type: DaDataPartyType;
  name: {
    full_with_opf: string;
    short_with_opf: string;
    latin: string | null;
    full: string;
    short: string;
  };
  okpo: null;
  okved: string;
  okved_type: string;
  opf: {
    code: string;
    type: string;
    full: string;
    short: string;
  };
  management?: {
    name: string;
    post: string;
  };
  branch_count?: number;
  branch_type?: DaDataPartyBranchType;
  address: DaDataResult<DaDataAddress>;
  state: {
    actuality_date: number;
    registration_date: number;
    liquidation_date: number | null;
    status: DaDataPartyStatus;
  };
}

export type DaDataBankType = 'BANK' | 'BANK_BRANCH' | 'NKO' | 'NKO_BRANCH' | 'RKC' | 'OTHER';

export type DaDataBankStatus = 'ACTIVE' | 'LIQUIDATING' | 'LIQUIDATED';

export type DaDataBank = {
  bic: string;
  swift: string;
  inn: string;
  kpp: string;
  registration_number: string;
  correspondent_account: string;
  name: {
    payment: string;
    full: null;
    short: string;
  };
  payment_city: string;
  opf: {
    type: DaDataBankType;
    full: null;
    short: null;
  };
  address: DaDataResult<DaDataAddress>;
  state: {
    actuality_date: number;
    registration_date: number;
    liquidation_date: number | null;
    status: DaDataBankStatus;
  };
  okpo: null;
  phone: number;
  rkc: number;
}

export type DaDataGender = 'MALE' | 'FEMALE' | 'UNKNOWN';

export type DaDataFio = {
  surname: string | null;
  name: string | null;
  patronymic: string | null;
  gender: DaDataGender;
  qc: '0' | '1';
  source: null;
}

export type DaDataSuggestionAnyType =
   DaDataResult<DaDataAddress>  |
   DaDataResult<DaDataBank>     |
   DaDataResult<DaDataParty>    |
   DaDataResult<DaDataFio>;

export type DaDataSuggestions = {
  suggestions: DaDataSuggestionAnyType[]
}


export interface PluginOptions {
  tag?: string,
  token: string
}

export type CssClasses = {
  root: string,
  input: string,
  listEmpty: string,
  row: string,
  list: string
}

export type DaDataDivisions = 'administrative' | 'municipal';

export interface DaDataLocationRestriction {
  country_iso_code?: string;
  region_iso_code?: string;

  kladr_id?: string | number;
  fias_id?: string;

  country?: string;
  region?: string;
  area?: string;
  city?: string;
  settlement?: string;
  street?: string;

  region_type_full?: string;
  area_type_full?: string;
  city_type_full?: string;
  settlement_type_full?: string;
  street_type_full?: string;
}

export interface DaDataLocationGeoRestriction {
  lat: number;
  lon: number;
  radius_meters?: number;
}

export interface DaDataLocationBoostRestriction {
  kladr_id: string | number,
}

export interface DaDataBound {
  value: DaDataAddressBounds;
}

export interface LocationOptions {
  division?: DaDataDivisions,
  locations?: Array<DaDataLocationRestriction>,
  locations_geo?: Array<DaDataLocationGeoRestriction>,
  locations_boost?: Array<DaDataLocationBoostRestriction>,
}

export interface IPropsComponentContext {
  modelValue: string,
  token: string,
  type: string,
  setInputValue?: (item: DaDataSuggestionAnyType) => string,
  apiUrl: string,
  inputName: string,
  inputId: string,
  placeholder: string,
  mergeParams: Record<string, any>,
  debounceWait: number,
  debounceOptions: DebounceSettings,
  cssClasses: CssClasses | Record<string, string>,
  restrictions: LocationOptions,
  fromBound: DaDataBound,
  toBound: DaDataBound,
}

export type CurrentInstance = {
  props: IPropsComponentContext,
  emit: (event: string, params: any) => void,
  pluginSettings: PluginOptions | undefined
}

export type ComposableDaData = {
  search: () => void,
  onInput: (event: Event) => void,
  onFocus: (event: Event) => void,
  showList: Ref<boolean>,
  localValue: WritableComputedRef<string>,
  prepareResults: (data: any, key: string) => string,
  computedCssClasses: ComputedRef<CssClasses>,
  onSelected: (data: any) => void,
  dadataDom: Ref<HTMLElement | null>,
  suggestions: Ref<DaDataSuggestionAnyType[]>
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $daDataNext: PluginOptions
  }
}
