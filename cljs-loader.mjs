// Adapter  from https://nodejs.org/api/esm.html#esm_transpiler_loader to transpile cljs.
import { URL, pathToFileURL } from 'url';
import * as nbb from 'nbb/';
import { cwd } from 'process';

const baseURL = pathToFileURL(`${cwd()}/`).href;

// ClojureScript files end in .cljs.
const extensionsRegex = /\.cljs$/;

export function resolve(specifier, context, defaultResolve) {
  const { parentURL = baseURL } = context;

  // Node.js normally errors on unknown file extensions, so return a URL for
  // specifiers ending in the ClojureScript file extensions.
  if (extensionsRegex.test(specifier)) {
    return {
      url: new URL(specifier, parentURL).href
    };
  }

  // Let Node.js handle all other specifiers.
  return defaultResolve(specifier, context, defaultResolve);
}

export function getFormat(url, context, defaultGetFormat) {
  // Now that we patched resolve to let ClojureScript URLs through, we need to
  // tell Node.js what format such URLs should be interpreted as. For the
  // purposes of this loader, all ClojureScript URLs are ES modules.
  if (extensionsRegex.test(url)) {
    return {
      format: 'module'
    };
  }

  // Let Node.js handle all other URLs.
  return defaultGetFormat(url, context, defaultGetFormat);
}

export function transformSource(source, context, defaultTransformSource) {
  const { url, format } = context;

  if (extensionsRegex.test(url)) {
    return {
      // TODO: incomplete, nbb doesn't expose a named export that takes the file content
      // and compiles it. I think that should mostly look like nbb.main/main.
      source: nbb.compile(source, { bare: true })
    };
  }

  // Let Node.js handle all other sources.
  return defaultTransformSource(source, context, defaultTransformSource);
}