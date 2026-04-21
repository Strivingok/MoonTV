// src/plugins/proxy.ts
import { proxyImg } from '~/utils/proxy';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('proxyImg', proxyImg);
});