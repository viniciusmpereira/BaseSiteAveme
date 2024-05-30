import 'cookie';
import { bold, red, yellow, dim, blue } from 'kleur/colors';
import './chunks/astro_C-BaZKnO.mjs';
import 'clsx';
import { compile } from 'path-to-regexp';

const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.dest;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return red(prefix.join(" "));
  }
  if (level === "warn") {
    return yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return dim(prefix[0]);
  }
  return dim(prefix[0]) + " " + blue(prefix.splice(1).join(" "));
}
if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}
class Logger {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
}

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    const path = toPath(sanitizedParams);
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"@astrojs/vercel/serverless","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.C4OZKuYN.css"},{"type":"inline","content":":root{--accent: #2337ff;--accent-dark: #000d8a;--black: 15, 18, 25;--gray: 96, 115, 159;--gray-light: 229, 233, 240;--gray-dark: 34, 41, 57;--gray-gradient: rgba(var(--gray-light), 50%), #fff;--box-shadow: 0 2px 6px rgba(var(--gray), 25%), 0 8px 24px rgba(var(--gray), 33%), 0 16px 32px rgba(var(--gray), 33%)}@font-face{font-family:Atkinson;src:url(/fonts/atkinson-regular.woff) format(\"woff\");font-weight:400;font-style:normal;font-display:swap}@font-face{font-family:Atkinson;src:url(/fonts/atkinson-bold.woff) format(\"woff\");font-weight:700;font-style:normal;font-display:swap}body{font-family:Atkinson,sans-serif;margin:0;padding:0;text-align:left;background:linear-gradient(var(--gray-gradient)) no-repeat;background-size:100% 600px;word-wrap:break-word;overflow-wrap:break-word;color:rgb(var(--gray-dark));font-size:20px;line-height:1.7}main{width:720px;max-width:calc(100% - 2em);margin:auto;padding:3em 1em}h1,h2,h3,h4,h5,h6{margin:0 0 .5rem;color:rgb(var(--black));line-height:1.2}h1{font-size:3.052em}h2{font-size:2.441em}h3{font-size:1.953em}h4{font-size:1.563em}h5{font-size:1.25em}strong,b{font-weight:700}a,a:hover{color:var(--accent)}p{margin-bottom:1em}.prose p{margin-bottom:2em}textarea{width:100%;font-size:16px}input{font-size:16px}table{width:100%}img{max-width:100%;height:auto;border-radius:8px}code{padding:2px 5px;background-color:rgb(var(--gray-light));border-radius:2px}pre{padding:1.5em;border-radius:8px}pre>code{all:unset}blockquote{border-left:4px solid var(--accent);padding:0 0 0 20px;margin:0;font-size:1.333em}hr{border:none;border-top:1px solid rgb(var(--gray-light))}@media (max-width: 720px){body{font-size:18px}main{padding:1em}}.sr-only{border:0;padding:0;margin:0;position:absolute!important;height:1px;width:1px;overflow:hidden;clip:rect(1px 1px 1px 1px);clip:rect(1px,1px,1px,1px);clip-path:inset(50%);white-space:nowrap}header[data-astro-cid-5g4usg5h]{margin:0;padding:0 1em;background:#fff;box-shadow:0 2px 8px rgba(var(--black),5%)}h2[data-astro-cid-5g4usg5h]{margin:0;font-size:1em}h2[data-astro-cid-5g4usg5h] a[data-astro-cid-5g4usg5h],h2[data-astro-cid-5g4usg5h] a[data-astro-cid-5g4usg5h].active{text-decoration:none}nav[data-astro-cid-5g4usg5h]{display:flex;align-items:center;justify-content:space-between}nav[data-astro-cid-5g4usg5h] a[data-astro-cid-5g4usg5h]{padding:1em .5em;color:var(--black);border-bottom:4px solid transparent;text-decoration:none}nav[data-astro-cid-5g4usg5h] a[data-astro-cid-5g4usg5h].active{text-decoration:none;border-bottom-color:var(--accent)}.social-links[data-astro-cid-5g4usg5h],.social-links[data-astro-cid-5g4usg5h] a[data-astro-cid-5g4usg5h]{display:flex}@media (max-width: 720px){.social-links[data-astro-cid-5g4usg5h]{display:none}}footer[data-astro-cid-26itficn]{padding:2em 1em 6em;background:linear-gradient(var(--gray-gradient)) no-repeat;color:rgb(var(--gray));text-align:center}.social-links[data-astro-cid-26itficn]{display:flex;justify-content:center;gap:1em;margin-top:1em}.social-links[data-astro-cid-26itficn] a[data-astro-cid-26itficn]{text-decoration:none;color:rgb(var(--gray))}.social-links[data-astro-cid-26itficn] a[data-astro-cid-26itficn]:hover{color:rgb(var(--gray-dark))}\na[data-astro-cid-7klrz6op]{display:inline-block;text-decoration:none}a[data-astro-cid-7klrz6op].active{font-weight:bolder;text-decoration:underline}\nmain[data-astro-cid-bvzihdzo]{width:calc(100% - 2em);max-width:100%;margin:0}.hero-image[data-astro-cid-bvzihdzo]{width:100%}.hero-image[data-astro-cid-bvzihdzo] img[data-astro-cid-bvzihdzo]{display:block;margin:0 auto;border-radius:12px;box-shadow:var(--box-shadow)}.prose[data-astro-cid-bvzihdzo]{width:720px;max-width:calc(100% - 2em);margin:auto;padding:1em;color:rgb(var(--gray-dark))}.title[data-astro-cid-bvzihdzo]{margin-bottom:1em;padding:1em 0;text-align:center;line-height:1}.title[data-astro-cid-bvzihdzo] h1[data-astro-cid-bvzihdzo]{margin:0 0 .5em}.date[data-astro-cid-bvzihdzo]{margin-bottom:.5em;color:rgb(var(--gray))}.last-updated-on[data-astro-cid-bvzihdzo]{font-style:italic}\n"}],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.C4OZKuYN.css"},{"type":"inline","content":":root{--accent: #2337ff;--accent-dark: #000d8a;--black: 15, 18, 25;--gray: 96, 115, 159;--gray-light: 229, 233, 240;--gray-dark: 34, 41, 57;--gray-gradient: rgba(var(--gray-light), 50%), #fff;--box-shadow: 0 2px 6px rgba(var(--gray), 25%), 0 8px 24px rgba(var(--gray), 33%), 0 16px 32px rgba(var(--gray), 33%)}@font-face{font-family:Atkinson;src:url(/fonts/atkinson-regular.woff) format(\"woff\");font-weight:400;font-style:normal;font-display:swap}@font-face{font-family:Atkinson;src:url(/fonts/atkinson-bold.woff) format(\"woff\");font-weight:700;font-style:normal;font-display:swap}body{font-family:Atkinson,sans-serif;margin:0;padding:0;text-align:left;background:linear-gradient(var(--gray-gradient)) no-repeat;background-size:100% 600px;word-wrap:break-word;overflow-wrap:break-word;color:rgb(var(--gray-dark));font-size:20px;line-height:1.7}main{width:720px;max-width:calc(100% - 2em);margin:auto;padding:3em 1em}h1,h2,h3,h4,h5,h6{margin:0 0 .5rem;color:rgb(var(--black));line-height:1.2}h1{font-size:3.052em}h2{font-size:2.441em}h3{font-size:1.953em}h4{font-size:1.563em}h5{font-size:1.25em}strong,b{font-weight:700}a,a:hover{color:var(--accent)}p{margin-bottom:1em}.prose p{margin-bottom:2em}textarea{width:100%;font-size:16px}input{font-size:16px}table{width:100%}img{max-width:100%;height:auto;border-radius:8px}code{padding:2px 5px;background-color:rgb(var(--gray-light));border-radius:2px}pre{padding:1.5em;border-radius:8px}pre>code{all:unset}blockquote{border-left:4px solid var(--accent);padding:0 0 0 20px;margin:0;font-size:1.333em}hr{border:none;border-top:1px solid rgb(var(--gray-light))}@media (max-width: 720px){body{font-size:18px}main{padding:1em}}.sr-only{border:0;padding:0;margin:0;position:absolute!important;height:1px;width:1px;overflow:hidden;clip:rect(1px 1px 1px 1px);clip:rect(1px,1px,1px,1px);clip-path:inset(50%);white-space:nowrap}header[data-astro-cid-5g4usg5h]{margin:0;padding:0 1em;background:#fff;box-shadow:0 2px 8px rgba(var(--black),5%)}h2[data-astro-cid-5g4usg5h]{margin:0;font-size:1em}h2[data-astro-cid-5g4usg5h] a[data-astro-cid-5g4usg5h],h2[data-astro-cid-5g4usg5h] a[data-astro-cid-5g4usg5h].active{text-decoration:none}nav[data-astro-cid-5g4usg5h]{display:flex;align-items:center;justify-content:space-between}nav[data-astro-cid-5g4usg5h] a[data-astro-cid-5g4usg5h]{padding:1em .5em;color:var(--black);border-bottom:4px solid transparent;text-decoration:none}nav[data-astro-cid-5g4usg5h] a[data-astro-cid-5g4usg5h].active{text-decoration:none;border-bottom-color:var(--accent)}.social-links[data-astro-cid-5g4usg5h],.social-links[data-astro-cid-5g4usg5h] a[data-astro-cid-5g4usg5h]{display:flex}@media (max-width: 720px){.social-links[data-astro-cid-5g4usg5h]{display:none}}footer[data-astro-cid-26itficn]{padding:2em 1em 6em;background:linear-gradient(var(--gray-gradient)) no-repeat;color:rgb(var(--gray));text-align:center}.social-links[data-astro-cid-26itficn]{display:flex;justify-content:center;gap:1em;margin-top:1em}.social-links[data-astro-cid-26itficn] a[data-astro-cid-26itficn]{text-decoration:none;color:rgb(var(--gray))}.social-links[data-astro-cid-26itficn] a[data-astro-cid-26itficn]:hover{color:rgb(var(--gray-dark))}\na[data-astro-cid-7klrz6op]{display:inline-block;text-decoration:none}a[data-astro-cid-7klrz6op].active{font-weight:bolder;text-decoration:underline}\nmain[data-astro-cid-5tznm7mj]{width:960px}ul[data-astro-cid-5tznm7mj]{display:flex;flex-wrap:wrap;gap:2rem;list-style-type:none;margin:0;padding:0}ul[data-astro-cid-5tznm7mj] li[data-astro-cid-5tznm7mj]{width:calc(50% - 1rem)}ul[data-astro-cid-5tznm7mj] li[data-astro-cid-5tznm7mj] [data-astro-cid-5tznm7mj]{text-decoration:none;transition:.2s ease}ul[data-astro-cid-5tznm7mj] li[data-astro-cid-5tznm7mj]:first-child{width:100%;margin-bottom:1rem;text-align:center}ul[data-astro-cid-5tznm7mj] li[data-astro-cid-5tznm7mj]:first-child img[data-astro-cid-5tznm7mj]{width:100%}ul[data-astro-cid-5tznm7mj] li[data-astro-cid-5tznm7mj]:first-child .title[data-astro-cid-5tznm7mj]{font-size:2.369rem}ul[data-astro-cid-5tznm7mj] li[data-astro-cid-5tznm7mj] img[data-astro-cid-5tznm7mj]{margin-bottom:.5rem;border-radius:12px}ul[data-astro-cid-5tznm7mj] li[data-astro-cid-5tznm7mj] a[data-astro-cid-5tznm7mj]{display:block}.title[data-astro-cid-5tznm7mj]{margin:0;color:rgb(var(--black));line-height:1}.date[data-astro-cid-5tznm7mj]{margin:0;color:rgb(var(--gray))}ul[data-astro-cid-5tznm7mj] li[data-astro-cid-5tznm7mj] a[data-astro-cid-5tznm7mj]:hover h4[data-astro-cid-5tznm7mj],ul[data-astro-cid-5tznm7mj] li[data-astro-cid-5tznm7mj] a[data-astro-cid-5tznm7mj]:hover .date[data-astro-cid-5tznm7mj]{color:rgb(var(--accent))}ul[data-astro-cid-5tznm7mj] a[data-astro-cid-5tznm7mj]:hover img[data-astro-cid-5tznm7mj]{box-shadow:var(--box-shadow)}@media (max-width: 720px){ul[data-astro-cid-5tznm7mj]{gap:.5em}ul[data-astro-cid-5tznm7mj] li[data-astro-cid-5tznm7mj]{width:100%;text-align:center}ul[data-astro-cid-5tznm7mj] li[data-astro-cid-5tznm7mj]:first-child{margin-bottom:0}ul[data-astro-cid-5tznm7mj] li[data-astro-cid-5tznm7mj]:first-child .title[data-astro-cid-5tznm7mj]{font-size:1.563em}}\n"}],"routeData":{"route":"/blog","isIndex":true,"type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/index.astro","pathname":"/blog","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.C4OZKuYN.css"},{"type":"inline","content":":root{--accent: #2337ff;--accent-dark: #000d8a;--black: 15, 18, 25;--gray: 96, 115, 159;--gray-light: 229, 233, 240;--gray-dark: 34, 41, 57;--gray-gradient: rgba(var(--gray-light), 50%), #fff;--box-shadow: 0 2px 6px rgba(var(--gray), 25%), 0 8px 24px rgba(var(--gray), 33%), 0 16px 32px rgba(var(--gray), 33%)}@font-face{font-family:Atkinson;src:url(/fonts/atkinson-regular.woff) format(\"woff\");font-weight:400;font-style:normal;font-display:swap}@font-face{font-family:Atkinson;src:url(/fonts/atkinson-bold.woff) format(\"woff\");font-weight:700;font-style:normal;font-display:swap}body{font-family:Atkinson,sans-serif;margin:0;padding:0;text-align:left;background:linear-gradient(var(--gray-gradient)) no-repeat;background-size:100% 600px;word-wrap:break-word;overflow-wrap:break-word;color:rgb(var(--gray-dark));font-size:20px;line-height:1.7}main{width:720px;max-width:calc(100% - 2em);margin:auto;padding:3em 1em}h1,h2,h3,h4,h5,h6{margin:0 0 .5rem;color:rgb(var(--black));line-height:1.2}h1{font-size:3.052em}h2{font-size:2.441em}h3{font-size:1.953em}h4{font-size:1.563em}h5{font-size:1.25em}strong,b{font-weight:700}a,a:hover{color:var(--accent)}p{margin-bottom:1em}.prose p{margin-bottom:2em}textarea{width:100%;font-size:16px}input{font-size:16px}table{width:100%}img{max-width:100%;height:auto;border-radius:8px}code{padding:2px 5px;background-color:rgb(var(--gray-light));border-radius:2px}pre{padding:1.5em;border-radius:8px}pre>code{all:unset}blockquote{border-left:4px solid var(--accent);padding:0 0 0 20px;margin:0;font-size:1.333em}hr{border:none;border-top:1px solid rgb(var(--gray-light))}@media (max-width: 720px){body{font-size:18px}main{padding:1em}}.sr-only{border:0;padding:0;margin:0;position:absolute!important;height:1px;width:1px;overflow:hidden;clip:rect(1px 1px 1px 1px);clip:rect(1px,1px,1px,1px);clip-path:inset(50%);white-space:nowrap}header[data-astro-cid-5g4usg5h]{margin:0;padding:0 1em;background:#fff;box-shadow:0 2px 8px rgba(var(--black),5%)}h2[data-astro-cid-5g4usg5h]{margin:0;font-size:1em}h2[data-astro-cid-5g4usg5h] a[data-astro-cid-5g4usg5h],h2[data-astro-cid-5g4usg5h] a[data-astro-cid-5g4usg5h].active{text-decoration:none}nav[data-astro-cid-5g4usg5h]{display:flex;align-items:center;justify-content:space-between}nav[data-astro-cid-5g4usg5h] a[data-astro-cid-5g4usg5h]{padding:1em .5em;color:var(--black);border-bottom:4px solid transparent;text-decoration:none}nav[data-astro-cid-5g4usg5h] a[data-astro-cid-5g4usg5h].active{text-decoration:none;border-bottom-color:var(--accent)}.social-links[data-astro-cid-5g4usg5h],.social-links[data-astro-cid-5g4usg5h] a[data-astro-cid-5g4usg5h]{display:flex}@media (max-width: 720px){.social-links[data-astro-cid-5g4usg5h]{display:none}}footer[data-astro-cid-26itficn]{padding:2em 1em 6em;background:linear-gradient(var(--gray-gradient)) no-repeat;color:rgb(var(--gray));text-align:center}.social-links[data-astro-cid-26itficn]{display:flex;justify-content:center;gap:1em;margin-top:1em}.social-links[data-astro-cid-26itficn] a[data-astro-cid-26itficn]{text-decoration:none;color:rgb(var(--gray))}.social-links[data-astro-cid-26itficn] a[data-astro-cid-26itficn]:hover{color:rgb(var(--gray-dark))}\na[data-astro-cid-7klrz6op]{display:inline-block;text-decoration:none}a[data-astro-cid-7klrz6op].active{font-weight:bolder;text-decoration:underline}\nmain[data-astro-cid-bvzihdzo]{width:calc(100% - 2em);max-width:100%;margin:0}.hero-image[data-astro-cid-bvzihdzo]{width:100%}.hero-image[data-astro-cid-bvzihdzo] img[data-astro-cid-bvzihdzo]{display:block;margin:0 auto;border-radius:12px;box-shadow:var(--box-shadow)}.prose[data-astro-cid-bvzihdzo]{width:720px;max-width:calc(100% - 2em);margin:auto;padding:1em;color:rgb(var(--gray-dark))}.title[data-astro-cid-bvzihdzo]{margin-bottom:1em;padding:1em 0;text-align:center;line-height:1}.title[data-astro-cid-bvzihdzo] h1[data-astro-cid-bvzihdzo]{margin:0 0 .5em}.date[data-astro-cid-bvzihdzo]{margin-bottom:.5em;color:rgb(var(--gray))}.last-updated-on[data-astro-cid-bvzihdzo]{font-style:italic}\n"}],"routeData":{"route":"/blog/[...slug]","isIndex":false,"type":"page","pattern":"^\\/blog(?:\\/(.*?))?\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"...slug","dynamic":true,"spread":true}]],"params":["...slug"],"component":"src/pages/blog/[...slug].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/rss.xml","isIndex":false,"type":"endpoint","pattern":"^\\/rss\\.xml\\/?$","segments":[[{"content":"rss.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rss.xml.js","pathname":"/rss.xml","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.C4OZKuYN.css"},{"type":"inline","content":":root{--accent: #2337ff;--accent-dark: #000d8a;--black: 15, 18, 25;--gray: 96, 115, 159;--gray-light: 229, 233, 240;--gray-dark: 34, 41, 57;--gray-gradient: rgba(var(--gray-light), 50%), #fff;--box-shadow: 0 2px 6px rgba(var(--gray), 25%), 0 8px 24px rgba(var(--gray), 33%), 0 16px 32px rgba(var(--gray), 33%)}@font-face{font-family:Atkinson;src:url(/fonts/atkinson-regular.woff) format(\"woff\");font-weight:400;font-style:normal;font-display:swap}@font-face{font-family:Atkinson;src:url(/fonts/atkinson-bold.woff) format(\"woff\");font-weight:700;font-style:normal;font-display:swap}body{font-family:Atkinson,sans-serif;margin:0;padding:0;text-align:left;background:linear-gradient(var(--gray-gradient)) no-repeat;background-size:100% 600px;word-wrap:break-word;overflow-wrap:break-word;color:rgb(var(--gray-dark));font-size:20px;line-height:1.7}main{width:720px;max-width:calc(100% - 2em);margin:auto;padding:3em 1em}h1,h2,h3,h4,h5,h6{margin:0 0 .5rem;color:rgb(var(--black));line-height:1.2}h1{font-size:3.052em}h2{font-size:2.441em}h3{font-size:1.953em}h4{font-size:1.563em}h5{font-size:1.25em}strong,b{font-weight:700}a,a:hover{color:var(--accent)}p{margin-bottom:1em}.prose p{margin-bottom:2em}textarea{width:100%;font-size:16px}input{font-size:16px}table{width:100%}img{max-width:100%;height:auto;border-radius:8px}code{padding:2px 5px;background-color:rgb(var(--gray-light));border-radius:2px}pre{padding:1.5em;border-radius:8px}pre>code{all:unset}blockquote{border-left:4px solid var(--accent);padding:0 0 0 20px;margin:0;font-size:1.333em}hr{border:none;border-top:1px solid rgb(var(--gray-light))}@media (max-width: 720px){body{font-size:18px}main{padding:1em}}.sr-only{border:0;padding:0;margin:0;position:absolute!important;height:1px;width:1px;overflow:hidden;clip:rect(1px 1px 1px 1px);clip:rect(1px,1px,1px,1px);clip-path:inset(50%);white-space:nowrap}header[data-astro-cid-5g4usg5h]{margin:0;padding:0 1em;background:#fff;box-shadow:0 2px 8px rgba(var(--black),5%)}h2[data-astro-cid-5g4usg5h]{margin:0;font-size:1em}h2[data-astro-cid-5g4usg5h] a[data-astro-cid-5g4usg5h],h2[data-astro-cid-5g4usg5h] a[data-astro-cid-5g4usg5h].active{text-decoration:none}nav[data-astro-cid-5g4usg5h]{display:flex;align-items:center;justify-content:space-between}nav[data-astro-cid-5g4usg5h] a[data-astro-cid-5g4usg5h]{padding:1em .5em;color:var(--black);border-bottom:4px solid transparent;text-decoration:none}nav[data-astro-cid-5g4usg5h] a[data-astro-cid-5g4usg5h].active{text-decoration:none;border-bottom-color:var(--accent)}.social-links[data-astro-cid-5g4usg5h],.social-links[data-astro-cid-5g4usg5h] a[data-astro-cid-5g4usg5h]{display:flex}@media (max-width: 720px){.social-links[data-astro-cid-5g4usg5h]{display:none}}footer[data-astro-cid-26itficn]{padding:2em 1em 6em;background:linear-gradient(var(--gray-gradient)) no-repeat;color:rgb(var(--gray));text-align:center}.social-links[data-astro-cid-26itficn]{display:flex;justify-content:center;gap:1em;margin-top:1em}.social-links[data-astro-cid-26itficn] a[data-astro-cid-26itficn]{text-decoration:none;color:rgb(var(--gray))}.social-links[data-astro-cid-26itficn] a[data-astro-cid-26itficn]:hover{color:rgb(var(--gray-dark))}\na[data-astro-cid-7klrz6op]{display:inline-block;text-decoration:none}a[data-astro-cid-7klrz6op].active{font-weight:bolder;text-decoration:underline}\n"},{"type":"external","src":"/_astro/index.DIJyB8jZ.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/src/pages/about.astro",{"propagation":"none","containsHead":true}],["D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/src/pages/blog/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/blog/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/src/pages/blog/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/blog/index@_@astro",{"propagation":"in-tree","containsHead":false}],["D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/src/pages/rss.xml.js",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/rss.xml@_@js",{"propagation":"in-tree","containsHead":false}],["D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000noop-middleware":"_noop-middleware.mjs","/src/pages/about.astro":"chunks/pages/about_CysR99GT.mjs","/src/pages/rss.xml.js":"chunks/pages/rss_q1kCdzmZ.mjs","\u0000@astrojs-manifest":"manifest_CsjDguQX.mjs","D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/node_modules/@astrojs/react/vnode-children.js":"chunks/vnode-children_BkR_XoPb.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"chunks/generic_CbZlVelt.mjs","\u0000@astro-page:src/pages/about@_@astro":"chunks/about_C2_PnRNw.mjs","\u0000@astro-page:src/pages/blog/index@_@astro":"chunks/index_SQyrWhnT.mjs","\u0000@astro-page:src/pages/blog/[...slug]@_@astro":"chunks/_.._X_j10_fD.mjs","\u0000@astro-page:src/pages/rss.xml@_@js":"chunks/rss_BMb14lzq.mjs","\u0000@astro-page:src/pages/index@_@astro":"chunks/index_DaqTdbLV.mjs","D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/src/content/blog/first-post.md?astroContentCollectionEntry=true":"chunks/first-post_BNa9cnbu.mjs","D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/src/content/blog/markdown-style-guide.md?astroContentCollectionEntry=true":"chunks/markdown-style-guide_BusX4e33.mjs","D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/src/content/blog/second-post.md?astroContentCollectionEntry=true":"chunks/second-post_D5waX86q.mjs","D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/src/content/blog/third-post.md?astroContentCollectionEntry=true":"chunks/third-post_DgwhQ8mR.mjs","D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/src/content/blog/using-mdx.mdx?astroContentCollectionEntry=true":"chunks/using-mdx_DLXOWby8.mjs","D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/src/content/blog/first-post.md?astroPropagatedAssets":"chunks/first-post_CmzaSCBO.mjs","D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/src/content/blog/markdown-style-guide.md?astroPropagatedAssets":"chunks/markdown-style-guide_Cl7naroh.mjs","D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/src/content/blog/second-post.md?astroPropagatedAssets":"chunks/second-post_Bop4CUcm.mjs","D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/src/content/blog/third-post.md?astroPropagatedAssets":"chunks/third-post_D_yA1dvH.mjs","D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/src/content/blog/using-mdx.mdx?astroPropagatedAssets":"chunks/using-mdx_Dl3o2sM1.mjs","D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/src/content/blog/first-post.md":"chunks/first-post_COmKc7H5.mjs","D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/src/content/blog/markdown-style-guide.md":"chunks/markdown-style-guide_BjH6pFZ1.mjs","D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/src/content/blog/second-post.md":"chunks/second-post_C8x1eSvz.mjs","D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/src/content/blog/third-post.md":"chunks/third-post_DQqX_qiZ.mjs","D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/src/content/blog/using-mdx.mdx":"chunks/using-mdx_Ck2jVVga.mjs","@astrojs/react/client.js":"_astro/client.BY2mA-CD.js","D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/src/components/Home/Slider.jsx":"_astro/Slider.raXj5urw.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/about.C4OZKuYN.css","/_astro/index.DIJyB8jZ.css","/blog-placeholder-1.jpg","/blog-placeholder-2.jpg","/blog-placeholder-3.jpg","/blog-placeholder-4.jpg","/blog-placeholder-5.jpg","/blog-placeholder-about.jpg","/favicon.svg","/_astro/client.BY2mA-CD.js","/_astro/index.B52nOzfP.js","/_astro/Slider.raXj5urw.js","/fonts/atkinson-bold.woff","/fonts/atkinson-regular.woff"],"buildFormat":"directory","checkOrigin":false,"rewritingEnabled":false});

export { AstroIntegrationLogger as A, Logger as L, getEventPrefix as g, levels as l, manifest };
