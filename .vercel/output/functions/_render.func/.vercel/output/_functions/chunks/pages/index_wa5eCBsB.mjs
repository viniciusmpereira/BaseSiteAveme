/* empty css                          */
import { c as createComponent, r as renderTemplate, g as renderComponent, h as renderHead, d as addAttribute, f as renderSlot, e as createAstro, m as maybeRenderHead } from '../astro_C-BaZKnO.mjs';
import 'kleur/colors';
import { g as getCollection, a as $$FormattedDate, b as $$BaseHead, c as $$BaseHeader, d as $$BaseFooter, S as SITE_TITLE, e as SITE_DESCRIPTION } from './__Dn5cW6KB.mjs';
/* empty css                          */
import { jsx, jsxs } from 'react/jsx-runtime';
import 'react';
import { register } from 'swiper/element/bundle';
import { Swiper, SwiperSlide } from 'swiper/react';
/* empty css                          */

const $$Index$1 = createComponent(async ($$result, $$props, $$slots) => {
  const posts = (await getCollection("blog")).sort(
    (a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf()
  );
  return renderTemplate`<html lang="en" data-astro-cid-5tznm7mj> <head>${renderComponent($$result, "BaseHead", $$BaseHead, { "title": SITE_TITLE, "description": SITE_DESCRIPTION, "data-astro-cid-5tznm7mj": true })}${renderHead()}</head> <body data-astro-cid-5tznm7mj> ${renderComponent($$result, "Header", $$BaseHeader, { "data-astro-cid-5tznm7mj": true })} <main data-astro-cid-5tznm7mj> <section data-astro-cid-5tznm7mj> <ul data-astro-cid-5tznm7mj> ${posts.map((post) => renderTemplate`<li data-astro-cid-5tznm7mj> <a${addAttribute(`/blog/${post.slug}/`, "href")} data-astro-cid-5tznm7mj> <img${addAttribute(720, "width")}${addAttribute(360, "height")}${addAttribute(post.data.heroImage, "src")} alt="" data-astro-cid-5tznm7mj> <h4 class="title" data-astro-cid-5tznm7mj>${post.data.title}</h4> <p class="date" data-astro-cid-5tznm7mj> ${renderComponent($$result, "FormattedDate", $$FormattedDate, { "date": post.data.pubDate, "data-astro-cid-5tznm7mj": true })} </p> </a> </li>`)} </ul> </section> </main> ${renderComponent($$result, "Footer", $$BaseFooter, { "data-astro-cid-5tznm7mj": true })} </body></html>`;
}, "D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/src/pages/blog/index.astro", void 0);

const $$file$1 = "D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/src/pages/blog/index.astro";
const $$url$1 = "/blog";

const index$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index$1,
	file: $$file$1,
	url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$1 = createAstro();
const $$BaseSite = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$BaseSite;
  const { title, description } = Astro2.props;
  return renderTemplate`<html lang="pt-BR"> <head>${renderComponent($$result, "BaseHead", $$BaseHead, { "title": title, "description": description })}${renderHead()}</head> <body class="z-0"> ${renderComponent($$result, "Header", $$BaseHeader, {})} <main> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", $$BaseFooter, {})} </body></html>`;
}, "D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/src/layouts/BaseSite.astro", void 0);

register();
function App() {
  const data = [
    { id: "1", image: "/images/slide-1.avif", title: "Elevadores Personalizados", description: "Compromisso com excelência" },
    { id: "2", image: "/images/slide-2.avif", title: "Elevadores Personalizados", description: "Compromisso com excelência" },
    { id: "3", image: "/images/slide-3.avif", title: "Elevadores Personalizados", description: "Compromisso com excelência" },
    { id: "4", image: "/images/slide-4.avif", title: "Elevadores Personalizados", description: "Compromisso com excelência" }
  ];
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
    Swiper,
    {
      slidesPerView: 1,
      pagination: { clickable: true },
      navigation: true,
      autoplay: { delay: 2e3 },
      children: data.map((item) => /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "bg-cover bg-center h-screen flex items-center justify-center",
          style: { backgroundImage: `url(${item.image})` },
          children: /* @__PURE__ */ jsxs("div", { className: "text-white text-center", children: [
            item.title && /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold", children: item.title }),
            item.description && /* @__PURE__ */ jsx("p", { className: "text-lg mt-2", children: item.description })
          ] })
        }
      ) }, item.id))
    }
  ) });
}

const $$Astro = createAstro();
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`${renderComponent($$result, "BaseSite", $$BaseSite, { "title": "Base site Aveme", "description": "Base de site com slider em astro com Bun" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Slider", App, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/src/components/Home/Slider.jsx", "client:component-export": "default" })} ${maybeRenderHead()}<h1>🧑‍🚀 Projeto Base Aveme</h1> <p>Here are a few ideas on how to get started with the template:</p> <ul> <li>Astro Framework + Bun</li> <li>Swiper</li> <li>Tailwind Css</li> <li>React Icons</li> </ul> <p>
Este projeto base foi desenvolvido para auxiliar no início de um site institucional comum. Ele oferece um ponto de partida com um slider, opção de React e TypeScript, o que é bastante útil e pode ser utilizado como base para o desenvolvimento de qualquer projeto web.
</p> <p>
by <a href="https://github.com/viniciusmpereira">Vinicius Pereira</a>.
</p> ` })}`;
}, "D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/src/pages/index.astro", void 0);

const $$file = "D:/OneDrive/Aveme/Aveme/2024/BaseSiteAveme/src/pages/index.astro";
const $$url = "";

const index = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { index as a, index$1 as i };
