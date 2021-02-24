import { HttpClient, HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { GnApiModule, ToolsApiService } from '@lib/gn-api'
import {
  TranslateCompiler,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler'
import { Gn4TranslateLoader } from './gn4.translate.loader'

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http)
}

export const LANG_3_TO_2_MAPPER = {
  eng: 'en',
  dut: 'nl',
  fre: 'fr',
  ger: 'de',
  kor: 'ko',
  spa: 'es',
  cze: 'cs',
  cat: 'ca',
  fin: 'fi',
  ice: 'is',
  ita: 'it',
  por: 'pt',
  rus: 'ru',
  chi: 'zh',
  slo: 'sk',
}

export const LANG_2_TO_3_MAPPER = Object.entries(LANG_3_TO_2_MAPPER).reduce(
  (mapperObject, langEntry) => {
    return { ...mapperObject, [langEntry[1]]: langEntry[0] }
  },
  {}
)

export const TRANSLATE_DEFAULT_CONFIG = {
  loader: {
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,
    defaultLanguage: 'en',
    deps: [HttpClient],
  },
}

export const TRANSLATE_GEONETWORK_CONFIG = {
  compiler: {
    provide: TranslateCompiler,
    useClass: TranslateMessageFormatCompiler,
  },
  loader: {
    provide: TranslateLoader,
    useClass: Gn4TranslateLoader,
    defaultLanguage: 'en',
    deps: [ToolsApiService],
  },
}

@NgModule({
  imports: [HttpClientModule, GnApiModule],
  exports: [TranslateModule],
})
export class I18nModule {
  constructor(translate: TranslateService) {
    translate.setDefaultLang('en')
    translate.use('en')
  }
}
