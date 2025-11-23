/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface DsCartBadgeDTO {
  count?: number;
  frax_id?: number;
}

export interface DsFactorCreateRequest {
  argument?: number;
  text: string;
  title: string;
}

export interface DsFactorDTO {
  argument?: number;
  id?: number;
  image?: string;
  status?: boolean;
  text?: string;
  title?: string;
}

export interface DsFactorInFraxDTO {
  argument?: number;
  description?: string;
  factor_id?: number;
  image?: string;
  text?: string;
  title?: string;
}

export interface DsFactorToFraxUpdateRequest {
  description?: string;
}

export interface DsFactorUpdateRequest {
  argument?: number;
  text?: string;
  title?: string;
}

export interface DsFraxDTO {
  PHF?: number;
  POF?: number;
  age?: number;
  complition_date?: string;
  creation_date?: string;
  creator_login?: number;
  factors?: DsFactorInFraxDTO[];
  forming_date?: string;
  gender?: boolean;
  height?: number;
  id?: number;
  moderator_login?: number;
  status?: number;
  weight?: number;
}

export interface DsFraxResolveRequest {
  /** "complete" | "reject" */
  action: string;
}

export interface DsFraxUpdateRequest {
  age?: number;
  gender?: boolean;
  height?: number;
  weight?: number;
}

export interface DsLoginResponse {
  token?: string;
  user?: DsUserDTO;
}

export interface DsPaginatedResponse {
  items?: any;
  total?: number;
}

export interface DsUserDTO {
  full_name?: string;
  id?: number;
  moderator?: boolean;
  username?: string;
}

export interface DsUserLoginRequest {
  password: string;
  username: string;
}

export interface DsUserRegisterRequest {
  full_name: string;
  password: string;
  username: string;
}

export interface DsUserUpdateRequest {
  full_name?: string;
  password?: string;
  username?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title API для системы FRAX
 * @version 1.0
 * @contact API Support <support@example.com>
 *
 * API-сервер для управления заявками и факторами риска в системе FRAX.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * @description Получение JWT токена по логину и паролю для доступа к защищенным эндпоинтам.
     *
     * @tags auth
     * @name LoginCreate
     * @summary Аутентификация пользователя (все)
     * @request POST:/auth/login
     * @response `200` `DsLoginResponse` OK
     * @response `400` `Record<string,string>` Ошибка валидации
     * @response `401` `Record<string,string>` Неверные учетные данные
     */
    loginCreate: (
      credentials: DsUserLoginRequest,
      params: RequestParams = {},
    ) =>
      this.request<DsLoginResponse, Record<string, string>>({
        path: `/auth/login`,
        method: "POST",
        body: credentials,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавляет текущий JWT токен в черный список, делая его недействительным. Требует авторизации.
     *
     * @tags auth
     * @name LogoutCreate
     * @summary Выход из системы (авторизованный пользователь)
     * @request POST:/auth/logout
     * @secure
     * @response `200` `Record<string,string>` Сообщение об успехе
     * @response `401` `Record<string,string>` Необходима авторизация
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/auth/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  factors = {
    /**
     * @description Возвращает постраничный список факторов риска.
     *
     * @tags factors
     * @name FactorsList
     * @summary Получить список факторов (все)
     * @request GET:/factors
     * @response `200` `DsPaginatedResponse` OK
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    factorsList: (
      query?: {
        /** Фильтр по названию фактора */
        title?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsPaginatedResponse, Record<string, string>>({
        path: `/factors`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Создает новую запись о факторе риска.
     *
     * @tags factors
     * @name FactorsCreate
     * @summary Создать новый фактор (только модератор)
     * @request POST:/factors
     * @secure
     * @response `201` `DsFactorDTO` Created
     * @response `400` `Record<string,string>` Ошибка валидации
     * @response `401` `Record<string,string>` Необходима авторизация
     * @response `403` `Record<string,string>` Доступ запрещен (не модератор)
     */
    factorsCreate: (
      factorData: DsFactorCreateRequest,
      params: RequestParams = {},
    ) =>
      this.request<DsFactorDTO, Record<string, string>>({
        path: `/factors`,
        method: "POST",
        body: factorData,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает детальную информацию о факторе риска.
     *
     * @tags factors
     * @name FactorsDetail
     * @summary Получить один фактор по ID (все)
     * @request GET:/factors/{id}
     * @response `200` `DsFactorDTO` OK
     * @response `404` `Record<string,string>` Фактор не найден
     */
    factorsDetail: (id: number, params: RequestParams = {}) =>
      this.request<DsFactorDTO, Record<string, string>>({
        path: `/factors/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет информацию о существующем факторе риска.
     *
     * @tags factors
     * @name FactorsUpdate
     * @summary Обновить фактор (только модератор)
     * @request PUT:/factors/{id}
     * @secure
     * @response `200` `DsFactorDTO` OK
     * @response `400` `Record<string,string>` Ошибка валидации
     * @response `401` `Record<string,string>` Необходима авторизация
     * @response `403` `Record<string,string>` Доступ запрещен
     */
    factorsUpdate: (
      id: number,
      updateData: DsFactorUpdateRequest,
      params: RequestParams = {},
    ) =>
      this.request<DsFactorDTO, Record<string, string>>({
        path: `/factors/${id}`,
        method: "PUT",
        body: updateData,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет фактор риска из системы.
     *
     * @tags factors
     * @name FactorsDelete
     * @summary Удалить фактор (только модератор)
     * @request DELETE:/factors/{id}
     * @secure
     * @response `204` `void` No Content
     * @response `401` `Record<string,string>` Необходима авторизация
     * @response `403` `Record<string,string>` Доступ запрещен
     */
    factorsDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, Record<string, string>>({
        path: `/factors/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Загружает и привязывает изображение к фактору риска.
     *
     * @tags factors
     * @name ImageCreate
     * @summary Загрузить изображение для фактора (только модератор)
     * @request POST:/factors/{id}/image
     * @secure
     * @response `200` `Record<string,string>` URL загруженного изображения
     * @response `400` `Record<string,string>` Файл не предоставлен
     * @response `401` `Record<string,string>` Необходима авторизация
     * @response `403` `Record<string,string>` Доступ запрещен
     */
    imageCreate: (
      id: number,
      data: {
        /** Файл изображения */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/factors/${id}/image`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
  frax = {
    /**
     * @description Возвращает отфильтрованный список всех сформированных заявок (кроме черновиков и удаленных).
     *
     * @tags frax
     * @name FraxList
     * @summary Получить список заявок (авторизованный пользователь)
     * @request GET:/frax
     * @secure
     * @response `200` `(DsFraxDTO)[]` OK
     * @response `401` `Record<string,string>` Необходима авторизация
     */
    fraxList: (
      query?: {
        /** Фильтр по статусу заявки */
        status?: number;
        /** Фильтр по дате 'от' (формат YYYY-MM-DD) */
        from?: string;
        /** Фильтр по дате 'до' (формат YYYY-MM-DD) */
        to?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsFraxDTO[], Record<string, string>>({
        path: `/frax`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Находит или создает черновик заявки для текущего пользователя и добавляет в него фактор.
     *
     * @tags factors
     * @name DraftFactorsCreate
     * @summary Добавить фактор в черновик заявки (все)
     * @request POST:/frax/draft/factors/{factor_id}
     * @secure
     * @response `201` `Record<string,string>` Сообщение об успехе
     * @response `401` `Record<string,string>` Необходима авторизация
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    draftFactorsCreate: (factorId: number, params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/frax/draft/factors/${factorId}`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Возвращает ID черновика текущего пользователя и количество факторов в нем.
     *
     * @tags frax
     * @name FactorscartList
     * @summary Получить информацию для иконки корзины (авторизованный пользователь)
     * @request GET:/frax/factorscart
     * @secure
     * @response `200` `DsCartBadgeDTO` OK
     * @response `401` `Record<string,string>` Необходима авторизация
     */
    factorscartList: (params: RequestParams = {}) =>
      this.request<DsCartBadgeDTO, Record<string, string>>({
        path: `/frax/factorscart`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает полную информацию о заявке, включая привязанные факторы.
     *
     * @tags frax
     * @name FraxDetail
     * @summary Получить одну заявку по ID (авторизованный пользователь)
     * @request GET:/frax/{id}
     * @secure
     * @response `200` `DsFraxDTO` OK
     * @response `401` `Record<string,string>` Необходима авторизация
     * @response `404` `Record<string,string>` Заявка не найдена
     */
    fraxDetail: (id: number, params: RequestParams = {}) =>
      this.request<DsFraxDTO, Record<string, string>>({
        path: `/frax/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Позволяет пользователю обновить поля своей заявки (возраст, пол, вес, рост).
     *
     * @tags frax
     * @name FraxUpdate
     * @summary Обновить данные заявки (авторизованный пользователь)
     * @request PUT:/frax/{id}
     * @secure
     * @response `204` `void` No Content
     * @response `401` `Record<string,string>` Необходима авторизация
     */
    fraxUpdate: (
      id: number,
      updateData: DsFraxUpdateRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, Record<string, string>>({
        path: `/frax/${id}`,
        method: "PUT",
        body: updateData,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Логически удаляет заявку, переводя ее в статус "удалена".
     *
     * @tags frax
     * @name FraxDelete
     * @summary Удалить заявку (авторизованный пользователь)
     * @request DELETE:/frax/{id}
     * @secure
     * @response `204` `void` No Content
     * @response `401` `Record<string,string>` Необходима авторизация
     */
    fraxDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, Record<string, string>>({
        path: `/frax/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Изменяет дополнительное описание для конкретного фактора в рамках одной заявки.
     *
     * @tags m-m
     * @name FactorsUpdate
     * @summary Обновить описание фактора в заявке (авторизованный пользователь)
     * @request PUT:/frax/{id}/factors/{factor_id}
     * @secure
     * @response `204` `void` No Content
     * @response `401` `Record<string,string>` Необходима авторизация
     */
    factorsUpdate: (
      id: number,
      factorId: number,
      updateData: DsFactorToFraxUpdateRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, Record<string, string>>({
        path: `/frax/${id}/factors/${factorId}`,
        method: "PUT",
        body: updateData,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Удаляет связь между заявкой и фактором.
     *
     * @tags m-m
     * @name FactorsDelete
     * @summary Удалить фактор из заявки (авторизованный пользователь)
     * @request DELETE:/frax/{id}/factors/{factor_id}
     * @secure
     * @response `204` `void` No Content
     * @response `401` `Record<string,string>` Необходима авторизация
     */
    factorsDelete: (id: number, factorId: number, params: RequestParams = {}) =>
      this.request<void, Record<string, string>>({
        path: `/frax/${id}/factors/${factorId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Переводит заявку из статуса "черновик" в "сформирована".
     *
     * @tags frax
     * @name FormUpdate
     * @summary Сформировать заявку (авторизованный пользователь)
     * @request PUT:/frax/{id}/form
     * @secure
     * @response `204` `void` No Content
     * @response `400` `Record<string,string>` Не все поля заполнены
     * @response `401` `Record<string,string>` Необходима авторизация
     */
    formUpdate: (id: number, params: RequestParams = {}) =>
      this.request<void, Record<string, string>>({
        path: `/frax/${id}/form`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * @description Модератор завершает (с расчетом) или отклоняет заявку.
     *
     * @tags frax
     * @name ResolveUpdate
     * @summary Завершить или отклонить заявку (только модератор)
     * @request PUT:/frax/{id}/resolve
     * @secure
     * @response `204` `void` No Content
     * @response `401` `Record<string,string>` Необходима авторизация
     * @response `403` `Record<string,string>` Доступ запрещен
     */
    resolveUpdate: (
      id: number,
      action: DsFraxResolveRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, Record<string, string>>({
        path: `/frax/${id}/resolve`,
        method: "PUT",
        body: action,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  users = {
    /**
     * @description Создает нового пользователя в системе. По умолчанию роль "пользователь", не "модератор".
     *
     * @tags auth
     * @name UsersCreate
     * @summary Регистрация нового пользователя (все)
     * @request POST:/users
     * @response `201` `DsUserDTO` Created
     * @response `400` `Record<string,string>` Ошибка валидации
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    usersCreate: (
      credentials: DsUserRegisterRequest,
      params: RequestParams = {},
    ) =>
      this.request<DsUserDTO, Record<string, string>>({
        path: `/users`,
        method: "POST",
        body: credentials,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает публичные данные пользователя. Требует авторизации.
     *
     * @tags users
     * @name UsersDetail
     * @summary Получение данных пользователя по ID (авторизованный пользователь)
     * @request GET:/users/{id}
     * @secure
     * @response `200` `DsUserDTO` OK
     * @response `401` `Record<string,string>` Необходима авторизация
     * @response `404` `Record<string,string>` Пользователь не найден
     */
    usersDetail: (id: number, params: RequestParams = {}) =>
      this.request<DsUserDTO, Record<string, string>>({
        path: `/users/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет имя пользователя или пароль. Требует авторизации.
     *
     * @tags users
     * @name UsersUpdate
     * @summary Обновление данных пользователя (авторизованный пользователь)
     * @request PUT:/users/{id}
     * @secure
     * @response `204` `void` No Content
     * @response `400` `Record<string,string>` Ошибка валидации
     * @response `401` `Record<string,string>` Необходима авторизация
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    usersUpdate: (
      id: number,
      updateData: DsUserUpdateRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, Record<string, string>>({
        path: `/users/${id}`,
        method: "PUT",
        body: updateData,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
}
