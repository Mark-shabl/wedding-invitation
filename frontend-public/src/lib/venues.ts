import type { VenueItem } from "./types";

export const DEFAULT_VENUES: VenueItem[] = [
  {
    id: 1,
    title: "Зеленоградский Дворец бракосочетания",
    address: "г. Зеленоград",
    map_embed_url:
      "https://yandex.ru/map-widget/v1/?um=constructor%3A9a637b19c98a2dfa10fafc8113fb8cd2cb96c973cfb12fb4220a11f30fcdbb84&source=constructor",
    map_link_url:
      "https://yandex.ru/maps/?um=constructor%3A9a637b19c98a2dfa10fafc8113fb8cd2cb96c973cfb12fb4220a11f30fcdbb84&source=constructor",
    sort_order: 1,
  },
  {
    id: 2,
    title: "Банкетный зал — ресторан «Дюшес»",
    address: "г. Москва",
    map_embed_url:
      "https://yandex.ru/map-widget/v1/?um=constructor%3A17e8f7b9f5322d63ee7fb1139ed2f70463d821b84a4e69ea4fd5218e87d80079&source=constructor",
    map_link_url:
      "https://yandex.ru/maps/?um=constructor%3A17e8f7b9f5322d63ee7fb1139ed2f70463d821b84a4e69ea4fd5218e87d80079&source=constructor",
    sort_order: 2,
  },
];
