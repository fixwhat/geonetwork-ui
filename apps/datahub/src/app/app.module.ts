import { NgModule } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { BrowserModule } from '@angular/platform-browser'
import { RouterModule } from '@angular/router'
import { Configuration } from '@geonetwork-ui/data-access/gn4'
import { FeatureRecordModule } from '@geonetwork-ui/feature/record'
import { DefaultRouterModule } from '@geonetwork-ui/feature/router'
import { FeatureSearchModule } from '@geonetwork-ui/feature/search'
import { UiInputsModule } from '@geonetwork-ui/ui/inputs'
import { RESULTS_LAYOUT_CONFIG, UiSearchModule } from '@geonetwork-ui/ui/search'
import { getGlobalConfig, getThemeConfig } from '@geonetwork-ui/util/app-config'
import {
  getDefaultLang,
  getLangFromBrowser,
  TRANSLATE_DEFAULT_CONFIG,
  UtilI18nModule,
} from '@geonetwork-ui/util/i18n'
import {
  PROXY_PATH,
  ThemeService,
  UtilSharedModule,
} from '@geonetwork-ui/util/shared'
import { EffectsModule } from '@ngrx/effects'
import { MetaReducer, StoreModule } from '@ngrx/store'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { environment } from '../environments/environment'

import { AppComponent } from './app.component'
import { DATAHUB_RESULTS_LAYOUT_CONFIG } from './app.config'
import { HeaderBadgeButtonComponent } from './record/header-badge-button/header-badge-button.component'
import { HeaderRecordComponent } from './record/header-record/header-record.component'
import { RecordPageComponent } from './record/record-page/record-page.component'
import { RecordPreviewDatahubComponent } from './search/record-preview-datahub/record-preview-datahub.component'
import { SearchHeaderComponent } from './search/search-header/search-header.component'
import { SearchPageComponent } from './search/search-page/search-page.component'

export const metaReducers: MetaReducer[] = !environment.production ? [] : []
// https://github.com/nrwl/nx/issues/191

@NgModule({
  declarations: [
    AppComponent,
    SearchPageComponent,
    RecordPreviewDatahubComponent,
    SearchHeaderComponent,
    HeaderBadgeButtonComponent,
    HeaderRecordComponent,
    RecordPageComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], {
      initialNavigation: 'enabledBlocking',
    }),
    StoreModule.forRoot(
      {},
      {
        metaReducers,
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
        },
      }
    ),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot(),
    UtilI18nModule,
    TranslateModule.forRoot(TRANSLATE_DEFAULT_CONFIG),
    FeatureSearchModule,
    DefaultRouterModule.forRoot({
      searchStateId: 'mainSearch',
      searchRouteComponent: SearchPageComponent,
      recordRouteComponent: RecordPageComponent,
    }),
    FeatureRecordModule,
    UiSearchModule,
    UtilSharedModule,
    MatIconModule,
    UiInputsModule,
  ],
  providers: [
    { provide: RESULTS_LAYOUT_CONFIG, useValue: DATAHUB_RESULTS_LAYOUT_CONFIG },
    {
      provide: Configuration,
      useFactory: () =>
        new Configuration({
          basePath: getGlobalConfig().GN4_API_URL,
        }),
    },
    {
      provide: PROXY_PATH,
      useFactory: () => getGlobalConfig().PROXY_PATH,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    translate: TranslateService,
    router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    translate.setDefaultLang(getDefaultLang())
    translate.use(getLangFromBrowser() || getDefaultLang())
    ThemeService.applyCssVariables(
      getThemeConfig().PRIMARY_COLOR,
      getThemeConfig().SECONDARY_COLOR,
      getThemeConfig().MAIN_COLOR,
      getThemeConfig().BACKGROUND_COLOR,
      getThemeConfig().MAIN_FONT,
      getThemeConfig().TITLE_FONT,
      getThemeConfig().FONTS_STYLESHEET_URL
    )
    ThemeService.generateBgOpacityClasses(
      'primary',
      getThemeConfig().PRIMARY_COLOR,
      [10, 25]
    )

    router.events
      .pipe(filter((e: Event): e is Scroll => e instanceof Scroll))
      .subscribe((e) => {
        if (e.position) {
          // backward navigation
        } else {
          if (e.routerEvent.url.startsWith(`/${ROUTER_ROUTE_DATASET}`)) {
            const recordPageElement = document.getElementById('record-page')
            if (recordPageElement) {
              recordPageElement.scrollTo({
                top: 0,
              })
            }
          }
        }
      })
  }
}
