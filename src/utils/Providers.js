export const Providers = {};

Providers.ACCU_WEATHER     = 1;
Providers.DARK_SKY         = 0;
Providers.OPEN_WEATHER_MAP = 3;
Providers.WEATHERBIT       = 2;

Providers.isValid = provider => provider >= 0 && provider <= 3;
