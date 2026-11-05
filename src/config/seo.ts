export const SITE_URL = 'https://suites.dev';
export const SITE_NAME = 'Suites';
export const SITE_DESCRIPTION =
  'A unit testing framework for TypeScript backends working with inversion of control and dependency injection';

export const DEFAULT_SOCIAL_IMAGE = {
  path: '/img/banner.png',
  width: 1774,
  height: 887,
  type: 'image/png',
  alt: 'Suites logo on a pale pink background',
};

export function pageTitle(title: string): string {
  return title === 'Suites Documentation' || title.split(/\s*\|\s*/).includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;
}
